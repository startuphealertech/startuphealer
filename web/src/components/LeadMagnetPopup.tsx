"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaTimes, FaCheckCircle, FaDownload, FaGift } from "react-icons/fa";
import { api, utmMeta, ApiClientError } from "@/lib/api";
import { services } from "@/data/services";

const STORAGE_KEY = "sh_lead_magnet";
const SNOOZE_DAYS = 3;
const DELAY_MS = 12000;
const HIDDEN_ON = ["/admin", "/login", "/register", "/profile", "/resources"];

const RESOURCE = "Startup Compliance & Funding Checklist 2026";

function readState(): { submitted?: boolean; snoozedUntil?: number } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeState(s: object) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readState(), ...s }));
  } catch {
    /* storage unavailable (private mode) — popup just shows again later */
  }
}

export default function LeadMagnetPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const shown = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const hiddenHere = HIDDEN_ON.some((p) => pathname.startsWith(p));

  const show = useCallback(() => {
    if (shown.current) return;
    const st = readState();
    if (st.submitted || (st.snoozedUntil && st.snoozedUntil > Date.now())) return;
    shown.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (hiddenHere) return;
    const timer = window.setTimeout(show, DELAY_MS);
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show(); // desktop exit-intent
    };
    const onScroll = () => {
      const h = document.documentElement;
      if ((h.scrollTop + window.innerHeight) / h.scrollHeight > 0.6) show(); // mobile: 60% scroll depth
    };
    const onManual = () => {
      shown.current = false;
      writeState({ snoozedUntil: 0 });
      show();
    };
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("open-lead-magnet", onManual);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("open-lead-magnet", onManual);
    };
  }, [hiddenHere, show]);

  const close = useCallback(() => {
    setOpen(false);
    if (status !== "done") writeState({ snoozedUntil: Date.now() + SNOOZE_DAYS * 86400000 });
  }, [status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") || "").replace(/\D/g, "").slice(-10);
    setStatus("sending");
    try {
      await api("/leads", {
        method: "POST",
        body: {
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: phone || "",
          stage: String(fd.get("stage") || "") || undefined,
          interest: String(fd.get("interest") || "") || undefined,
          source: "lead-magnet",
          resource: RESOURCE,
          consent: fd.get("consent") === "on",
          website: String(fd.get("website") || ""),
          meta: utmMeta(),
        },
      });
      writeState({ submitted: true });
      setStatus("done");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (!open || hiddenHere) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lm-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl animate-fade-up sm:max-w-3xl sm:rounded-3xl"
      >
        <button onClick={close} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow hover:text-slate-900">
          <FaTimes />
        </button>
        <div className="grid sm:grid-cols-5">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-500 via-emerald-500 to-green-500 p-6 text-white sm:col-span-2 sm:flex">
            <Image src="/images/leaf.png" alt="" width={300} height={225} className="pointer-events-none absolute -bottom-10 -right-14 w-64 opacity-30" />
            <FaGift size={34} />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Free Download</p>
              <p className="mt-2 font-display text-2xl font-bold leading-tight">{RESOURCE}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/90">
                <li>✔ Every registration a new startup needs</li>
                <li>✔ Startup India, MSME, GST, ISO, Trademark</li>
                <li>✔ Government schemes & funding readiness</li>
              </ul>
            </div>
          </div>

          <div className="p-6 sm:col-span-3 sm:p-8">
            {status === "done" ? (
              <div className="py-6 text-center">
                <FaCheckCircle className="mx-auto text-emerald-500" size={56} />
                <h2 id="lm-title" className="mt-4 text-2xl font-bold">You&apos;re in! 🎉</h2>
                <p className="mt-2 text-slate-600">Your free checklist is unlocked. Our expert will also reach out within 2 hours for a free consultation.</p>
                <Link href="/resources/startup-checklist" onClick={() => setOpen(false)} className="btn btn-primary mt-6">
                  <FaDownload /> Get the Checklist
                </Link>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 sm:hidden">Free Download</p>
                <h2 id="lm-title" className="text-2xl font-bold leading-tight text-slate-900">
                  Launch your startup the <span className="text-gradient">right way</span>
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Get our free <strong>{RESOURCE}</strong> + a free 15-min consultation with a StartupHealer expert.
                </p>
                <form onSubmit={onSubmit} className="mt-5 space-y-3" noValidate={false}>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <div>
                    <label htmlFor="lm-name" className="label">Full Name *</label>
                    <input id="lm-name" name="name" required minLength={2} maxLength={120} className="input" placeholder="John Doe" autoComplete="name" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lm-email" className="label">Email *</label>
                      <input id="lm-email" name="email" type="email" required className="input" placeholder="john@example.com" autoComplete="email" />
                    </div>
                    <div>
                      <label htmlFor="lm-phone" className="label">Phone (WhatsApp)</label>
                      <input id="lm-phone" name="phone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} className="input" placeholder="9876543210" autoComplete="tel-national" />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lm-stage" className="label">Startup stage</label>
                      <select id="lm-stage" name="stage" className="input" defaultValue="">
                        <option value="">Select</option>
                        <option>Just an idea</option>
                        <option>Registered company</option>
                        <option>Generating revenue</option>
                        <option>Raising funds</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="lm-interest" className="label">Interested in</label>
                      <select id="lm-interest" name="interest" className="input" defaultValue="">
                        <option value="">Select</option>
                        {services.map((s) => (
                          <option key={s.slug}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-500">
                    <input type="checkbox" name="consent" defaultChecked className="mt-0.5 h-4 w-4 accent-emerald-600" />
                    I agree to be contacted by StartupHealer via call, WhatsApp or email.
                  </label>
                  {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700" role="alert">{error}</p>}
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full">
                    {status === "sending" ? "Sending..." : "Send Me the Free Checklist"}
                  </button>
                  <p className="text-center text-xs text-slate-400">No spam. Unsubscribe anytime.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Use anywhere: <button onClick={openLeadMagnet}>Free checklist</button>
export const openLeadMagnet = () => window.dispatchEvent(new Event("open-lead-magnet"));
