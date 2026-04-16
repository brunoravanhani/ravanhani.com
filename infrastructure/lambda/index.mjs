import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({ region: process.env.AWS_REGION ?? "us-east-1" });

const ALLOWED_ORIGIN = (process.env.ALLOWED_ORIGINS ?? "");

const MAX_FIELD_LENGTH = 2000;

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
  const origin =
    event.headers?.origin ?? event.headers?.Origin ?? "";
  const corsHeaders = buildCorsHeaders();

  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
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

  const { name, email, message } = body;

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
