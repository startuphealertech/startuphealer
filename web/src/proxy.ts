import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/data/services";

const serviceSlugs = new Set(services.map((s) => s.slug));

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unknown service slugs -> real HTTP 404 (the streamed page would otherwise keep a 200 status).
  if (pathname.startsWith("/services/")) {
    const slug = pathname.slice("/services/".length).replace(/\/$/, "");
    if (!serviceSlugs.has(slug)) return NextResponse.rewrite(new URL("/__not-found", request.url));
    return NextResponse.next();
  }

  // Fast guard: bounce visitors without a session cookie to /login.
  // Real authorisation (incl. admin role) is enforced by the API on every request.
  if (!request.cookies.has("sh_token")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/services/:slug+"],
};
