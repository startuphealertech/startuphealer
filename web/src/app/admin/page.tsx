"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBullseye, FaUsers, FaEnvelope, FaComments, FaChartLine } from "react-icons/fa";
import { api } from "@/lib/api";
import { Panel } from "@/components/admin/ui";

type Stats = {
  leads: number;
  leads7: number;
  users: number;
  contactsNew: number;
  chats: number;
  bySource: { _id: string; count: number }[];
  byStatus: { _id: string; count: number }[];
  daily: { _id: string; count: number }[];
};

export default function AdminDashboard() {
  const [s, setS] = useState<(Stats & { days: { d: string; c: number }[] }) | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api<Stats>("/admin/stats")
      .then((st) => {
        // Last 30 days, filling missing days with 0
        const now = Date.now();
        const days = Array.from({ length: 30 }).map((_, i) => {
          const d = new Date(now - (29 - i) * 86400000).toISOString().slice(0, 10);
          return { d, c: st.daily.find((x) => x._id === d)?.count ?? 0 };
        });
        setS({ ...st, days });
      })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-red-600">{err}</p>;
  if (!s) return <p className="text-slate-500">Loading dashboard...</p>;

  const cards = [
    { label: "Total leads", value: s.leads, Icon: FaBullseye, href: "/admin/leads", tint: "from-cyan-500 to-cyan-600" },
    { label: "Leads (7 days)", value: s.leads7, Icon: FaChartLine, href: "/admin/leads", tint: "from-emerald-500 to-emerald-600" },
    { label: "New messages", value: s.contactsNew, Icon: FaEnvelope, href: "/admin/contacts", tint: "from-amber-500 to-orange-500" },
    { label: "Registered users", value: s.users, Icon: FaUsers, href: "/admin/users", tint: "from-violet-500 to-indigo-500" },
    { label: "Chat sessions", value: s.chats, Icon: FaComments, href: "/admin/chats", tint: "from-green-500 to-teal-500" },
  ];

  const days = s.days;
  const max = Math.max(1, ...days.map((x) => x.c));
  const totalSrc = s.bySource.reduce((a, b) => a + b.count, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        {cards.map(({ label, value, Icon, href, tint }) => (
          <Link key={label} href={href} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:p-5">
            <span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${tint}`}>
              <Icon />
            </span>
            <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{value}</p>
            <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-800">Leads — last 30 days</h2>
          <div className="mt-4 flex h-40 items-end gap-[3px]" role="img" aria-label="Daily leads bar chart">
            {days.map((x) => (
              <div key={x.d} className="group relative flex-1">
                <div className="w-full rounded-t bg-gradient-to-t from-cyan-500 to-emerald-400" style={{ height: `${(x.c / max) * 150 + (x.c ? 4 : 1)}px` }} />
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                  {x.d.slice(5)}: {x.c}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="font-semibold text-slate-800">Leads by source</h2>
          <ul className="mt-4 space-y-3">
            {s.bySource.length === 0 && <li className="text-sm text-slate-500">No leads yet.</li>}
            {s.bySource.map((x) => (
              <li key={x._id}>
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{x._id.replace("-", " ")}</span>
                  <span className="font-semibold">{x.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${(x.count / totalSrc) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <h2 className="mt-6 font-semibold text-slate-800">Pipeline</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.byStatus.map((x) => (
              <span key={x._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
                {x._id}: {x.count}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
