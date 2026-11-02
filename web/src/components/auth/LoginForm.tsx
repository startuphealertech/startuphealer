"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiClientError, type User } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { safeNext } from "@/lib/redirect";
import PasswordInput from "./PasswordInput";
import SocialButtons from "./SocialButtons";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    try {
      const { user } = await api<{ user: User }>("/auth/login", {
        method: "POST",
        body: { email, password, remember: fd.get("remember") === "on" },
      });
      setUser(user);
      router.replace(safeNext(user.role === "admin" ? "/admin" : "/profile"));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email Address</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput id="password" name="password" required autoComplete="current-password" placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" name="remember" defaultChecked className="h-4 w-4 accent-emerald-600" /> Remember me
          </label>
          <button type="button" onClick={() => setForgot(true)} className="font-medium text-cyan-700 hover:underline">
            Forgot Password?
          </button>
        </div>
        {forgot && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800" role="status">
            Password reset via email OTP is coming soon. Meanwhile, please contact support at sales@startuphealer.com.
          </p>
        )}
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
