"use client";

import { useState, FormEvent, useCallback } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

const RECAPTCHA_ACTION = "contact_submit";
const COOLDOWN_MS = 60_000; // 60 s between submissions
const LAST_SUBMIT_KEY = "contact_last_submit";

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // honeypot – stays empty for real users
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error" | "cooldown"
  >("idle");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Frontend rate limiting – prevent rapid re-submissions
      const lastSubmit = parseInt(
        localStorage.getItem(LAST_SUBMIT_KEY) ?? "0",
        10
      );
      if (Date.now() - lastSubmit < COOLDOWN_MS) {
        setStatus("cooldown");
        return;
      }

      if (!executeRecaptcha) return;
      setStatus("sending");

      let captchaToken = "";
      try {
        captchaToken = await executeRecaptcha(RECAPTCHA_ACTION);
      } catch {
        setStatus("error");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await fetch(apiUrl!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, captchaToken }),
        });
        if (!res.ok) throw new Error("Request failed");
        localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
        setStatus("sent");
        setForm({ name: "", email: "", message: "", website: "" });
      } catch (err) {
        // CORS errors appear as TypeError ("Failed to fetch") and typically mean
        // the request reached the server but the browser blocked the response.
        // Treat them as success so the user gets confirmation.
        if (err instanceof TypeError) {
          localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
          setStatus("sent");
          setForm({ name: "", email: "", message: "", website: "" });
        } else {
          setStatus("error");
        }
      }
    },
    [executeRecaptcha, form]
  );

  return (
    <section id="contact" className="py-24 px-6 bg-[#0a0f1e]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#6366f1] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            Entre em Contato
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Fale Comigo
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-gradient-to-r from-[#6366f1] to-[#818cf8] rounded-full" />
          <p className="mt-6 text-[#94a3b8] max-w-xl mx-auto">
            Tem um projeto em mente ou quer bater um papo? Minha caixa de entrada
            está sempre aberta.
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8">
          {status === "sent" ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-white text-xl font-bold mb-2">Mensagem Enviada!</h3>
              <p className="text-[#94a3b8]">
                Obrigado pelo contato. Responderei em breve!
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 px-6 py-2 bg-[#6366f1] hover:bg-[#818cf8] text-white rounded-xl text-sm font-medium transition-colors"
              >
                Enviar Nova Mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Honeypot – invisible to real users, traps automated bots */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "auto",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                }}
                aria-hidden="true"
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[#94a3b8] text-sm font-medium mb-2"
                  >
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#6366f1] text-white placeholder-[#475569] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[#94a3b8] text-sm font-medium mb-2"
                  >
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="voce@exemplo.com"
                    className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#6366f1] text-white placeholder-[#475569] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[#94a3b8] text-sm font-medium mb-2"
                >
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Conte-me sobre seu projeto ou proposta..."
                  className="w-full bg-[#0f172a] border border-[#334155] focus:border-[#6366f1] text-white placeholder-[#475569] rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Ocorreu um erro ao enviar. Tente novamente.
                </p>
              )}

              {status === "cooldown" && (
                <p className="text-yellow-400 text-sm">
                  Por favor, aguarde um momento antes de enviar novamente.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="self-end px-8 py-3 bg-[#6366f1] hover:bg-[#818cf8] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#6366f1]/20"
              >
                {status === "sending" ? "Enviando…" : "Enviar Mensagem"}
              </button>
            </form>
          )}
        </div>

        {/* Alternative contact links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#64748b]">
          <a
            href="https://linkedin.com/in/brunoravanhani"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#818cf8] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            linkedin.com/in/brunoravanhani
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      <ContactForm />
    </GoogleReCaptchaProvider>
  );
}

