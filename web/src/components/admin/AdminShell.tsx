"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTachometerAlt, FaBullseye, FaEnvelopeOpenText, FaUsers, FaComments, FaSignOutAlt, FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: FaTachometerAlt },
  { href: "/admin/leads", label: "Leads", Icon: FaBullseye },
  { href: "/admin/contacts", label: "Messages", Icon: FaEnvelopeOpenText },
  { href: "/admin/chats", label: "Chatbot", Icon: FaComments },
  { href: "/admin/users", label: "Users", Icon: FaUsers },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login?next=/admin");
    else if (user.role !== "admin") router.replace("/");
  }, [user, loading, router]);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  if (loading || !user || user.role !== "admin") {
    return <div className="flex min-h-dvh items-center justify-center text-slate-500">Checking access...</div>;
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const Sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Admin">
      <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
        <Image src="/images/logo.jpeg" alt="StartupHealer" width={120} height={62} className="h-10 w-auto rounded bg-white" />
        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">Admin</span>
      </Link>
      {nav.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            active(href) ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow" : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Icon /> {label}
        </Link>
      ))}
      <div className="mt-auto space-y-1 border-t border-slate-800 pt-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800">
          <FaGlobe /> View website
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-300 hover:bg-slate-800"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-slate-950 lg:block">{Sidebar}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setOpen(false)} className="absolute right-3 top-3 p-2 text-slate-400" aria-label="Close menu">
          <FaTimes />
        </button>
        {Sidebar}
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setOpen(true)} className="p-2 text-slate-600 lg:hidden" aria-label="Open menu">
            <FaBars />
          </button>
          <p className="font-semibold text-slate-800">{nav.find((n) => active(n.href))?.label ?? "Admin"}</p>
          <p className="ml-auto truncate text-sm text-slate-500">{user.email}</p>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
