"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaTimes } from "react-icons/fa";
import { mainNav, site } from "@/data/site";
import { useAuth } from "@/components/AuthProvider";

// Header styled after startuphealer.com: solid white bar, shadow-md, cyan-100 bottom border, 64px tall,
// gray-700 / medium links with cyan-600 hover. On small screens the hamburger sits left of the logo
// and the menu slides in from the left, as on the reference.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Close the menu on navigation (render-time state adjustment, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cyan-100 bg-white shadow-md">
      <nav className="container-x flex h-16 items-center justify-between gap-4" aria-label="Main">
        <div className="flex min-w-0 items-center">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="-ml-2 mr-1 flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl transition hover:bg-cyan-50 sm:mr-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className={`block h-0.5 w-6 bg-cyan-600 transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-emerald-600 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-green-600 transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label={`${site.name} home`}>
            <Image src="/images/logo.jpeg" alt="StartupHealer Logo" width={140} height={73} priority className="h-10 w-auto sm:h-12" />
            <span className="truncate bg-gradient-to-r from-cyan-600 via-emerald-600 to-green-600 bg-clip-text font-display text-xl font-bold text-transparent sm:text-2xl" aria-hidden>
              {site.name}
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-5 lg:flex xl:gap-6">
          <ul className="flex items-center gap-5 xl:gap-7">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative inline-block whitespace-nowrap py-2 font-medium transition-colors duration-200 ${
                      active ? "text-cyan-600" : "text-gray-700 hover:text-cyan-600"
                    }`}
                  >
                    {item.name}
                    {/* gradient underline: full width when active, grows on hover */}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Signed-in controls only (no Log in / Get Started Free in the header) */}
          {user && (
            <div className="flex items-center gap-2 border-l border-cyan-100 pl-4 xl:pl-6">
              {user.role === "admin" && (
                <Link href="/admin" aria-label="Admin panel" className="btn btn-outline !px-3 !py-2 text-sm xl:!px-4">
                  <FaTachometerAlt /> <span className="hidden xl:inline">Admin</span>
                </Link>
              )}
              <Link href="/profile" aria-label={`Profile — ${user.firstName}`} className="btn btn-outline !px-3 !py-2 text-sm xl:!px-4">
                <FaUserCircle /> <span className="hidden max-w-[8rem] truncate xl:inline">{user.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="btn !px-3 text-gray-500 hover:text-red-600" aria-label="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="border-b-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} home`}>
              <Image src="/images/logo.jpeg" alt="" width={110} height={57} className="h-10 w-auto" style={{ width: "auto" }} />
              <span className="bg-gradient-to-r from-cyan-600 via-emerald-600 to-green-600 bg-clip-text font-display text-lg font-bold text-transparent">{site.name}</span>
            </Link>
            <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:text-cyan-600" aria-label="Close menu">
              <FaTimes size={20} />
            </button>
          </div>
          <p className="text-xs font-medium text-gray-600">Empowering Startups</p>
        </div>
        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg border px-4 py-3 font-medium transition-all ${
                    active
                      ? "border-cyan-200 bg-gradient-to-r from-cyan-50 to-emerald-50 text-cyan-700"
                      : "border-transparent text-gray-700 hover:border-cyan-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-emerald-50 hover:text-cyan-600"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Signed-in actions only */}
        {user && (
          <div className="space-y-2 border-t border-cyan-200 p-4">
            {user.role === "admin" && (
              <Link href="/admin" className="btn btn-outline w-full">
                <FaTachometerAlt /> Admin Panel
              </Link>
            )}
            <Link href="/profile" className="btn btn-outline w-full">
              <FaUserCircle /> View Profile
            </Link>
            <button onClick={handleLogout} className="btn w-full text-red-600 hover:bg-red-50">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </aside>
    </header>
  );
}
