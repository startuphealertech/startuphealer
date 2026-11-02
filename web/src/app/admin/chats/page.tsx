"use client";

import { useState } from "react";
import { usePaged } from "@/components/admin/usePaged";
import { Pager, Panel, StateRow, fmtDate } from "@/components/admin/ui";

type Chat = {
  _id: string;
  sessionId: string;
  page?: string;
  updatedAt: string;
  messages: { from: "user" | "bot"; text: string; at: string }[];
  lead?: { name: string; email: string; phone?: string };
};

export default function ChatsPage() {
  const { data, loading, error, page, setPage } = usePaged<Chat>("/admin/chats", {});
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Chatbot conversations. Sessions where the visitor shared details are linked to a lead.</p>
      <Panel>
        <StateRow loading={loading} error={error} empty={!!data && data.items.length === 0} />
        {!loading && (
          <ul className="divide-y">
            {data?.items.map((c) => {
              const firstUser = c.messages.find((m) => m.from === "user")?.text;
              const isOpen = open === c._id;
              return (
                <li key={c._id} className="p-4">
                  <button onClick={() => setOpen(isOpen ? null : c._id)} className="flex w-full items-start justify-between gap-3 text-left" aria-expanded={isOpen}>
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {c.lead ? `${c.lead.name} · ${c.lead.email}${c.lead.phone ? ` · ${c.lead.phone}` : ""}` : "Anonymous visitor"}
                      </p>
                      <p className="truncate text-sm text-slate-500">“{firstUser}”</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-400">
                      <p>{fmtDate(c.updatedAt)}</p>
                      <p>{c.messages.length} msgs</p>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3">
                      {c.messages.map((m, i) => (
                        <div key={i} className={`flex ${m.from === "user" ? "justify-end" : ""}`}>
                          <p className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.from === "user" ? "bg-cyan-600 text-white" : "bg-white shadow-sm"}`}>{m.text}</p>
                        </div>
                      ))}
                      {c.page && <p className="text-xs text-slate-400">Started on: {c.page}</p>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
      {data && <Pager page={page} pages={data.pages} total={data.total} onChange={setPage} />}
    </div>
  );
}
