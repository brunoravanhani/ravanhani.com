import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: process.env.AWS_REGION ?? "us-east-1" });

const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGINS ?? "");
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? "";
const MIN_RECAPTCHA_SCORE = 0.5;

const MAX_FIELD_LENGTH = 2000;

// In-memory IP rate limiting: max 3 submissions per IP per 10 minutes.
// Resets when the Lambda container is recycled, which is acceptable for a
// personal portfolio contact form.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
/** @type {Map<string, number[]>} */
const rateLimitStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (rateLimitStore.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }
  rateLimitStore.set(ip, [...timestamps, now]);
  return false;
}

async function verifyRecaptcha(token, ip) {
  const params = new URLSearchParams({
    secret: RECAPTCHA_SECRET,
    response: token,
    remoteip: ip,
  });
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!res.ok) return { success: false, score: 0 };
  return res.json();
}

/**
 * Escapes HTML special characters to prevent injection in the email body.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildCorsHeaders() {
  
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export const handler = async (event) => {
  const corsHeaders = buildCorsHeaders();

  const sourceIp =
    event.requestContext?.http?.sourceIp ?? "unknown";

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // IP rate limiting
  if (isRateLimited(sourceIp)) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Too many requests. Please try again later." }),
    };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { name, email, message, website, captchaToken } = body;

  // Honeypot check – bots fill hidden fields, humans don't
  if (website) {
    // Return 200 to avoid tipping off the bot
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Your message has been sent!" }),
    };
  }

  // reCAPTCHA v3 verification
  if (!captchaToken || typeof captchaToken !== "string") {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing captcha token" }),
    };
  }
  let recaptchaResult;
  try {
    recaptchaResult = await verifyRecaptcha(captchaToken, sourceIp);
  } catch {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Captcha verification failed. Please try again." }),
    };
  }
  if (!recaptchaResult.success || recaptchaResult.score < MIN_RECAPTCHA_SCORE) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Captcha verification failed. Please try again." }),
    };
  }

  // Required fields validation
  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "name, email, and message are required" }),
    };
  }

  // Type validation
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "name, email, and message must be strings" }),
    };
  }

  // Length validation
  if (
    name.length > MAX_FIELD_LENGTH ||
    email.length > 320 ||
    message.length > MAX_FIELD_LENGTH
  ) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "One or more fields exceed the maximum allowed length" }),
    };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Invalid email address" }),
    };
  }

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

  const command = new SendEmailCommand({
    Source: process.env.SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [process.env.PERSONAL_EMAIL],
    },
    ReplyToAddresses: [email.trim()],
    Message: {
      Subject: {
        Data: `[Contact Form] New message from ${name.trim()}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <h3>Message:</h3>
            <p>${safeMessage}</p>
          `,
          Charset: "UTF-8",
        },
        Text: {
          Data: `New Contact Form Submission\n\nName: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error("SES send error:", err);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to send email. Please try again later." }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, message: "Your message has been sent!" }),
  };
};
