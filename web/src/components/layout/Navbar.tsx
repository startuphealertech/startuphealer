"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaTimes } from "react-icons/fa";
import { mainNav, site } from "@/data/site";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Close the drawer on navigation (render-time state adjustment, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4 md:h-20" aria-label="Main">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${site.name} home`}>
          <Image src="/images/logo.jpeg" alt="StartupHealer Logo" width={140} height={73} priority className="h-11 w-auto md:h-14" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  isActive(item.href) ? "bg-cyan-50 text-cyan-700" : "text-slate-700 hover:text-cyan-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-outline !px-4 !py-2 text-sm">
                  <FaTachometerAlt /> Admin
                </Link>
              )}
              <Link href="/profile" className="btn btn-outline !px-4 !py-2 text-sm">
                <FaUserCircle /> {user.firstName}
              </Link>
              <button onClick={handleLogout} className="btn !px-3 text-slate-500 hover:text-red-600" aria-label="Logout">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn !px-4 !py-2 text-sm text-cyan-700 hover:bg-cyan-50">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary !px-5 !py-2 text-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`block h-0.5 w-6 bg-cyan-600 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-emerald-600 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-green-600 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        id="mobile-menu"
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[82%] max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <Image src="/images/logo.jpeg" alt="StartupHealer Logo" width={110} height={57} className="h-10 w-auto" />
          <button onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-600" aria-label="Close menu">
            <FaTimes size={20} />
          </button>
        </div>
        <p className="px-5 pt-4 text-xs font-semibold uppercase tracking-wider text-emerald-600">Empowering Startups</p>
        <ul className="flex-1 overflow-y-auto p-3">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                tabIndex={open ? 0 : -1}
                className={`block rounded-xl px-4 py-3 text-base font-medium ${
                  isActive(item.href) ? "bg-gradient-to-r from-cyan-50 to-emerald-50 text-cyan-700" : "text-slate-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-slate-100 p-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" tabIndex={open ? 0 : -1} className="btn btn-outline w-full">
                  <FaTachometerAlt /> Admin Panel
                </Link>
              )}
              <Link href="/profile" tabIndex={open ? 0 : -1} className="btn btn-outline w-full">
                <FaUserCircle /> View Profile
              </Link>
              <button onClick={handleLogout} tabIndex={open ? 0 : -1} className="btn w-full text-red-600 hover:bg-red-50">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" tabIndex={open ? 0 : -1} className="btn btn-outline w-full">
                Log in
              </Link>
              <Link href="/register" tabIndex={open ? 0 : -1} className="btn btn-primary w-full">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </aside>
    </header>
  );
}
