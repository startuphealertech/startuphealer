"use client";

import { useState } from "react";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { api, ApiClientError } from "@/lib/api";
import { services } from "@/data/services";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    try {
      await api("/contact", {
        method: "POST",
        body: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || "").replace(/\D/g, "").slice(-10),
          service: String(fd.get("service") || "") || undefined,
          message: String(fd.get("message") || ""),
          website: String(fd.get("website") || ""),
        },
      });
      form.reset();
      setState("done");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="card flex flex-col items-center justify-center p-10 text-center">
        <FaCheckCircle className="text-emerald-500" size={56} />
        <h3 className="mt-4 text-2xl font-bold">Thank You!</h3>
        <p className="mt-2 text-slate-600">Your message has been sent successfully.</p>
        <p className="text-slate-600">We&apos;ll get back to you soon.</p>
        <button onClick={() => setState("idle")} className="btn btn-outline mt-6">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Send us a Message</h2>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">Full Name *</label>
          <input id="c-name" name="name" required minLength={2} className="input" placeholder="John Doe" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="c-email" className="label">Email Address *</label>
          <input id="c-email" name="email" type="email" required className="input" placeholder="john@example.com" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="c-phone" className="label">Phone Number</label>
          <input id="c-phone" name="phone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} className="input" placeholder="9876543210" autoComplete="tel-national" />
        </div>
        <div>
          <label htmlFor="c-service" className="label">Service</label>
          <select id="c-service" name="service" className="input" defaultValue="">
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="label">Your Message *</label>
        <textarea id="c-message" name="message" required minLength={5} rows={5} maxLength={4000} className="input" placeholder="Tell us about your project and how we can help..." />
      </div>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full sm:w-auto">
        <FaPaperPlane /> {state === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
