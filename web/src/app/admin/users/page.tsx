"use client";

import { useCallback, useState } from "react";
import { api, type User } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { usePaged } from "@/components/admin/usePaged";
import { Badge, Pager, Panel, SearchBox, StateRow, fmtDate } from "@/components/admin/ui";

export default function UsersPage() {
  const { user: me } = useAuth();
  const [q, setQ] = useState("");
  const { data, loading, error, page, setPage, reload } = usePaged<User>("/admin/users", { q });
  const onSearch = useCallback((v: string) => setQ(v), []);
  const [err, setErr] = useState("");

  async function patch(id: string, body: Partial<User>) {
    setErr("");
    try {
      await api(`/admin/users/${id}`, { method: "PATCH", body });
      reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="space-y-4">
      <SearchBox onChange={onSearch} placeholder="Search users..." />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <Panel>
        <StateRow loading={loading} error={error} empty={!!data && data.items.length === 0} />
        {!loading && (
          <ul className="divide-y">
            {data?.items.map((u) => (
              <li key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">
                    {u.firstName} {u.lastName} <Badge v={u.role} /> {!u.isActive && <Badge v="disabled" />}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {u.email} {u.contactNumber && `· ${u.contactNumber}`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {u.profile?.startupName && `${u.profile.startupName} · `}Joined {fmtDate(u.createdAt)} · Last login {fmtDate(u.lastLoginAt)}
                  </p>
                </div>
                {me?.id !== u.id && (
                  <div className="flex gap-2">
                    <button onClick={() => patch(u.id, { role: u.role === "admin" ? "user" : "admin" })} className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50">
                      {u.role === "admin" ? "Remove admin" : "Make admin"}
                    </button>
                    <button
                      onClick={() => patch(u.id, { isActive: !u.isActive })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${u.isActive ? "text-red-600 hover:bg-red-50" : "text-emerald-700 hover:bg-emerald-50"}`}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      {data && <Pager page={page} pages={data.pages} total={data.total} onChange={setPage} />}
    </div>
  );
}
