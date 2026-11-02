// Only allow internal redirects (prevents open-redirect via ?next=https://evil.com)
export function safeNext(fallback: string) {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
