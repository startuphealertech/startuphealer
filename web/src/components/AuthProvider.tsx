"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiClientError, type User } from "@/lib/api";

// /auth/me answers logged-out visitors with { user: null } (HTTP 200), so an *error* never means "logged out".
// Transient failures (network, 429 rate limit, 5xx) are retried instead of silently signing the user out
// (which bounced admins to /login). A definitive 401/403 still clears the session.
const isTransient = (e: unknown) => !(e instanceof ApiClientError) || e.status === 0 || e.status === 429 || e.status >= 500;
async function fetchMe(attempts = 3): Promise<User | null> {
  for (let i = 0; ; i++) {
    try {
      return (await api<{ user: User | null }>("/auth/me")).user ?? null;
    } catch (e) {
      if (!isTransient(e) || i >= attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

type AuthState = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<User | null>;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await fetchMe();
      setUser(u);
      return u;
    } catch (e) {
      if (!isTransient(e)) setUser(null); // keep the current session on a transient failure
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    fetchMe()
      .then((u) => alive && setUser(u))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ user, loading, refresh, setUser, logout }), [user, loading, refresh, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
