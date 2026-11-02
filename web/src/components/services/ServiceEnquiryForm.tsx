"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { api, utmMeta, ApiClientError } from "@/lib/api";

export default function ServiceEnquiryForm({ service }: { service: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      await api("/leads", {
        method: "POST",
        body: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || "").replace(/\D/g, "").slice(-10),
          message: String(fd.get("message") || "") || undefined,
          interest: service,
          source: "service-enquiry",
          website: String(fd.get("website") || ""),
          meta: utmMeta(),
        },
      });
      setState("done");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="card flex flex-col items-center justify-center p-8 text-center">
        <FaCheckCircle className="text-emerald-500" size={48} />
        <h2 className="mt-4 text-xl font-bold">Thank You!</h2>
        <p className="mt-2 text-slate-600">Our {service} expert will call you within 2 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-6 sm:p-7">
      <h2 className="text-xl font-bold">Get a free consultation</h2>
      <p className="text-sm text-slate-500">For: {service}</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="se-name" className="label">Full Name *</label>
        <input id="se-name" name="name" required minLength={2} className="input" placeholder="John Doe" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="se-email" className="label">Email Address *</label>
        <input id="se-email" name="email" type="email" required className="input" placeholder="john@example.com" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="se-phone" className="label">Phone Number *</label>
        <input id="se-phone" name="phone" type="tel" required inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} className="input" placeholder="9876543210" autoComplete="tel-national" />
      </div>
      <div>
        <label htmlFor="se-msg" className="label">Message</label>
        <textarea id="se-msg" name="message" rows={3} maxLength={2000} className="input" placeholder="Tell us about your business..." />
      </div>
      {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">
        {state === "sending" ? "Sending..." : "Request Callback"}
      </button>
    </form>
  );
}
