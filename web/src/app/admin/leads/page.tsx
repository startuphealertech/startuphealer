"use client";

import { useCallback, useState } from "react";
import { FaDownload, FaTrash, FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";
import { usePaged } from "@/components/admin/usePaged";
import { Badge, Pager, Panel, SearchBox, StateRow, fmtDate } from "@/components/admin/ui";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  stage?: string;
  interest?: string;
  message?: string;
  source: string;
  resource?: string;
  status: string;
  notes?: string;
  createdAt: string;
  meta?: { page?: string; utmSource?: string; utmCampaign?: string };
};

const SOURCES = ["lead-magnet", "chatbot", "service-enquiry", "contact", "other"];
const STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

export default function LeadsPage() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const filters = { q, source, status };
  const { data, loading, error, page, setPage, reload } = usePaged<Lead>("/admin/leads", filters);
  const [selected, setSelected] = useState<Lead | null>(null);
  const onSearch = useCallback((v: string) => setQ(v), []);

  const [actionError, setActionError] = useState("");

  // Returns false (and shows the error) instead of failing silently with an unhandled rejection.
  async function update(id: string, body: Partial<Lead>) {
    setActionError("");
    try {
      await api(`/admin/leads/${id}`, { method: "PATCH", body });
      reload();
      return true;
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update the lead");
      reload(); // re-sync the UI with the server state
      return false;
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setActionError("");
    try {
      await api(`/admin/leads/${id}`, { method: "DELETE" });
      setSelected(null);
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not delete the lead");
    }
  }

  const exportUrl = `/api/v1/admin/leads/export.csv?${new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([, v]) => v)))}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBox onChange={onSearch} placeholder="Search name, email, phone..." />
        <select value={source} onChange={(e) => setSource(e.target.value)} className="input !py-2 sm:w-44">
          <option value="">All sources</option>
          {SOURCES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !py-2 sm:w-40">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <a href={exportUrl} className="btn btn-primary !py-2 text-sm sm:ml-auto">
          <FaDownload /> Export CSV
        </a>
      </div>

      {actionError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {actionError}
        </p>
      )}
      <Panel>
        <StateRow loading={loading} error={error} empty={!!data && data.items.length === 0} />
        {data && data.items.length > 0 && !loading && (
          <>
            {/* Mobile cards */}
            <ul className="divide-y md:hidden">
              {data.items.map((l) => (
                <li key={l._id} className="p-4" onClick={() => setSelected(l)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold">{l.name}</p>
                      <p className="truncate text-sm text-slate-500">{l.email}</p>
                      {l.phone && <p className="text-sm text-slate-500">{l.phone}</p>}
                    </div>
                    <Badge v={l.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <Badge v={l.source} /> {l.interest} · {fmtDate(l.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Interest / Stage</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.items.map((l) => (
                    <tr key={l._id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelected(l)}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{l.name}</p>
                        <p className="text-slate-500">{l.email}</p>
                      </td>
                      <td className="px-4 py-3">{l.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <p>{l.interest || "—"}</p>
                        <p className="text-xs text-slate-500">{l.stage}</p>
                      </td>
                      <td className="px-4 py-3"><Badge v={l.source} /></td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <select value={l.status} onChange={(e) => update(l._id, { status: e.target.value })} className="rounded-lg border px-2 py-1 text-xs">
                          {STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{fmtDate(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
      {data && <Pager page={page} pages={data.pages} total={data.total} onChange={setPage} />}

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSave={async (b) => {
            if (await update(selected._id, b)) setSelected(null);
          }}
          onDelete={() => remove(selected._id)}
        />
      )}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onSave, onDelete }: { lead: Lead; onClose: () => void; onSave: (b: Partial<Lead>) => void; onDelete: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const rows: [string, string | undefined][] = [
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Interest", lead.interest],
    ["Stage", lead.stage],
    ["Source", lead.source],
    ["Resource", lead.resource],
    ["Message", lead.message],
    ["Page", lead.meta?.page],
    ["UTM", [lead.meta?.utmSource, lead.meta?.utmCampaign].filter(Boolean).join(" / ")],
    ["Created", fmtDate(lead.createdAt)],
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold">{lead.name}</h2>
          <button onClick={onClose} className="text-slate-400" aria-label="Close">✕</button>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold uppercase text-slate-400">{k}</dt>
              <dd className="whitespace-pre-line break-words text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
        {lead.phone && (
          <a href={`https://wa.me/91${lead.phone}`} target="_blank" rel="noopener noreferrer" className="btn mt-5 w-full bg-[#25D366] text-white">
            <FaWhatsapp /> WhatsApp lead
          </a>
        )}
        <label className="label mt-6">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="label mt-4">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={2000} className="input" />
        <div className="mt-5 flex gap-2">
          <button onClick={() => onSave({ status, notes })} className="btn btn-primary flex-1">Save</button>
          <button onClick={onDelete} className="btn text-red-600 hover:bg-red-50" aria-label="Delete lead">
            <FaTrash />
          </button>
        </div>
      </aside>
    </div>
  );
}
