"use client";

import { useEffect, useState } from "react";

export const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export function Pager({ page, pages, total, onChange }: { page: number; pages: number; total: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-3 text-sm text-slate-600">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40">
          Prev
        </button>
        <span>
          {page} / {Math.max(1, pages)}
        </span>
        <button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg border bg-white px-3 py-1.5 disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  );
}

export function SearchBox({ onChange, placeholder = "Search..." }: { onChange: (v: string) => void; placeholder?: string }) {
  const [v, setV] = useState("");
  useEffect(() => {
    const t = setTimeout(() => onChange(v.trim()), 350);
    return () => clearTimeout(t);
  }, [v, onChange]);
  return <input type="search" value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} className="input !py-2 sm:max-w-xs" />;
}

const badgeColors: Record<string, string> = {
  new: "bg-cyan-100 text-cyan-800",
  contacted: "bg-amber-100 text-amber-800",
  qualified: "bg-violet-100 text-violet-800",
  converted: "bg-emerald-100 text-emerald-800",
  lost: "bg-slate-200 text-slate-600",
  read: "bg-slate-100 text-slate-700",
  replied: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-200 text-slate-500",
  "lead-magnet": "bg-green-100 text-green-800",
  chatbot: "bg-indigo-100 text-indigo-800",
  contact: "bg-sky-100 text-sky-800",
  "service-enquiry": "bg-teal-100 text-teal-800",
  admin: "bg-rose-100 text-rose-800",
  user: "bg-slate-100 text-slate-700",
};

export function Badge({ v }: { v: string }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColors[v] || "bg-slate-100 text-slate-700"}`}>{v}</span>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function StateRow({ loading, error, empty }: { loading: boolean; error: string; empty: boolean }) {
  if (loading) return <p className="p-6 text-center text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (empty) return <p className="p-6 text-center text-slate-500">Nothing here yet.</p>;
  return null;
}
