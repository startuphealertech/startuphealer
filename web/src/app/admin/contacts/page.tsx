"use client";

import { useCallback, useState } from "react";
import { FaTrash, FaReply } from "react-icons/fa";
import { api } from "@/lib/api";
import { usePaged } from "@/components/admin/usePaged";
import { Badge, Pager, Panel, SearchBox, StateRow, fmtDate } from "@/components/admin/ui";

type Contact = { _id: string; name: string; email: string; phone?: string; service?: string; message: string; status: string; createdAt: string };
const STATUSES = ["new", "read", "replied", "archived"];

export default function ContactsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { data, loading, error, page, setPage, reload } = usePaged<Contact>("/admin/contacts", { q, status });
  const onSearch = useCallback((v: string) => setQ(v), []);

  const setSt = async (id: string, s: string) => {
    await api(`/admin/contacts/${id}`, { method: "PATCH", body: { status: s } });
    reload();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await api(`/admin/contacts/${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchBox onChange={onSearch} placeholder="Search messages..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !py-2 sm:w-40">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <Panel>
        <StateRow loading={loading} error={error} empty={!!data && data.items.length === 0} />
        {!loading && (
          <ul className="divide-y">
            {data?.items.map((c) => (
              <li key={c._id} className={`p-4 sm:p-5 ${c.status === "new" ? "bg-cyan-50/40" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {c.name} <Badge v={c.status} />
                    </p>
                    <p className="text-sm text-slate-500">
                      {c.email} {c.phone && `· ${c.phone}`} {c.service && `· ${c.service}`}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{fmtDate(c.createdAt)}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{c.message}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent("Re: Your enquiry with StartupHealer")}`}
                    onClick={() => setSt(c._id, "replied")}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                  >
                    <FaReply /> Reply
                  </a>
                  <select value={c.status} onChange={(e) => setSt(c._id, e.target.value)} className="rounded-lg border px-2 py-1.5 text-xs">
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => del(c._id)} className="ml-auto rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Delete">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {data && <Pager page={page} pages={data.pages} total={data.total} onChange={setPage} />}
    </div>
  );
}
