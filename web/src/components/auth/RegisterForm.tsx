"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { api, ApiClientError, type User } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import PasswordInput from "./PasswordInput";
import SocialButtons from "./SocialButtons";

function strength(p: string) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}
const strengthLabel = ["Too short", "Weak", "Okay", "Good", "Strong"];
const strengthColor = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pwd, setPwd] = useState("");

  function validate(d: Record<string, string>) {
    const e: Record<string, string> = {};
    if (!d.firstName.trim()) e.firstName = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Please enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(d.contactNumber)) e.contactNumber = "Please enter a valid 10-digit contact number";
    if (d.password.length < 6) e.password = "Password must be at least 6 characters long";
    if (d.password !== d.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError("");
    const fd = new FormData(ev.currentTarget);
    const d = {
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      contactNumber: String(fd.get("contactNumber") || "").replace(/\D/g, "").slice(-10),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
    };
    const e = validate(d);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (fd.get("terms") !== "on") return setFormError("Please accept the terms to continue");

    setLoading(true);
    try {
      const { user } = await api<{ user: User }>("/auth/register", { method: "POST", body: d });
      try {
        sessionStorage.setItem("sh_welcome", "1"); // tells /profile to open the profile wizard
      } catch {}
      setUser(user);
      router.replace("/profile");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.errors?.length) setErrors(Object.fromEntries(err.errors.map((x) => [x.field, x.message])));
        setFormError(err.message);
      } else setFormError("Registration failed");
      setLoading(false);
    }
  }

  const err = (k: string) => (errors[k] ? <p className="mt-1 text-xs text-red-600">{errors[k]}</p> : null);
  const s = strength(pwd);

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label">First Name *</label>
            <input id="firstName" name="firstName" autoComplete="given-name" className="input" aria-invalid={!!errors.firstName} />
            {err("firstName")}
          </div>
          <div>
            <label htmlFor="lastName" className="label">Last Name</label>
            <input id="lastName" name="lastName" autoComplete="family-name" className="input" />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="label">Email Address *</label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" aria-invalid={!!errors.email} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="contactNumber" className="label">Contact Number *</label>
          <div className="flex">
            <span className="flex items-center rounded-l-xl border-[1.5px] border-r-0 border-slate-300 bg-slate-50 px-3 text-slate-500">+91</span>
            <input id="contactNumber" name="contactNumber" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" className="input !rounded-l-none" aria-invalid={!!errors.contactNumber} />
          </div>
          {err("contactNumber")}
        </div>
        <div>
          <label htmlFor="password" className="label">Password *</label>
          <PasswordInput id="password" name="password" autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} aria-invalid={!!errors.password} />
          {pwd && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${i < s ? strengthColor[s] : "bg-slate-200"}`} />
                ))}
              </div>
              <span className="text-xs text-slate-500">{strengthLabel[s]}</span>
            </div>
          )}
          {err("password")}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label">Confirm Password *</label>
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} />
          {err("confirmPassword")}
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-cyan-50 p-3 text-xs text-cyan-800">
          <FaInfoCircle className="mt-0.5 shrink-0" /> Email OTP verification is coming soon. For now you can sign up with email & password.
        </p>

        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" name="terms" defaultChecked className="mt-0.5 h-4 w-4 accent-emerald-600" />
          I agree to StartupHealer&apos;s terms and to be contacted about my account.
        </label>

        {formError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{formError}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Processing..." : "Create an account"}
        </button>
      </form>
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
