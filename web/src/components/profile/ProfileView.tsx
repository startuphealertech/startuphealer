"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";
import { api, ApiClientError, type User } from "@/lib/api";
import { INDIAN_STATES, PROFILE_ROLES } from "@/data/site";
import { Initials } from "@/components/ui/Sections";

type P = NonNullable<User["profile"]>;

function readWelcome() {
  try {
    return sessionStorage.getItem("sh_welcome") === "1";
  } catch {
    return false;
  }
}
function clearWelcome() {
  try {
    sessionStorage.removeItem("sh_welcome");
  } catch {}
}

export default function ProfileView() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [form, setForm] = useState<{ firstName: string; lastName: string; contactNumber: string; profile: P }>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    profile: {},
  });

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/profile");
  }, [loading, user, router]);

  // Sync the edit form whenever a (new) user object arrives — render-time adjustment instead of an effect.
  const [syncedUser, setSyncedUser] = useState<User | null>(null);
  if (user && user !== syncedUser) {
    setSyncedUser(user);
    setForm({ firstName: user.firstName, lastName: user.lastName || "", contactNumber: user.contactNumber || "", profile: { ...user.profile } });
    // New users land here after registration — open the editor straight away.
    if (!syncedUser && readWelcome() && !user.profile?.startupName) setEditing(true);
  }

  if (loading || !user) {
    return <div className="container-x py-24 text-center text-slate-500">Loading...</div>;
  }

  const setP = (k: keyof P, v: string | boolean) => setForm((f) => ({ ...f, profile: { ...f.profile, [k]: v } }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const { user: u } = await api<{ user: User }>("/profile", { method: "PUT", body: form });
      clearWelcome();
      setUser(u);
      setEditing(false);
      setMsg({ ok: true, text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof ApiClientError ? err.message : "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  }

  const p = user.profile || {};
  const rows: [string, string | undefined][] = [
    ["I am a", p.role],
    ["Startup name", p.startupName],
    ["Co-founder Name", p.hasCoFounder ? p.coFounderName : "No co-founder"],
    ["Industry", p.industry],
    ["Sector", p.sector],
    ["State & UT", p.state],
    ["City", p.city],
    ["Full address", p.address],
  ];

  return (
    <section className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-10 sm:py-16">
      <div className="container-x max-w-4xl">
        <div className="card overflow-hidden">
          <div className="h-24 bg-brand-gradient sm:h-32" />
          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <Initials name={`${user.firstName} ${user.lastName}`} className="h-24 w-24 text-3xl ring-4 ring-white" />
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold">Profile of {user.firstName} {user.lastName}</h1>
                <p className="text-sm text-slate-500">
                  {user.email} {user.contactNumber && `· +91 ${user.contactNumber}`}
                </p>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn btn-outline">
                  <FaEdit /> Edit profile
                </button>
              )}
            </div>

            {msg && (
              <p className={`mt-5 flex items-center gap-2 rounded-lg p-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`} role="status">
                {msg.ok && <FaCheckCircle />} {msg.text}
              </p>
            )}

            {!editing ? (
              <>
                <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                  {rows.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-sm font-semibold text-slate-500">{k}</dt>
                      <dd className="mt-0.5 text-slate-900">{v || "Not provided"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-slate-500">Business Description</h2>
                  <p className="mt-1 whitespace-pre-line text-slate-900">{p.businessDescription || "Not provided"}</p>
                </div>
              </>
            ) : (
              <form onSubmit={save} className="mt-8 space-y-8">
                <fieldset>
                  <legend className="mb-3 text-lg font-bold">Create Your Profile</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PROFILE_ROLES.map((r) => (
                      <label
                        key={r.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm transition ${
                          form.profile.role === r.value ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-cyan-200"
                        }`}
                      >
                        <input type="radio" name="role" value={r.value} checked={form.profile.role === r.value} onChange={() => setP("role", r.value)} className="accent-emerald-600" />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="grid gap-4 sm:grid-cols-3">
                  <legend className="mb-3 text-lg font-bold">Your Details</legend>
                  <div>
                    <label className="label" htmlFor="pf-fn">First Name</label>
                    <input id="pf-fn" className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label" htmlFor="pf-ln">Last Name</label>
                    <input id="pf-ln" className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="pf-ph">Contact Number</label>
                    <input id="pf-ph" className="input" inputMode="numeric" maxLength={10} value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value.replace(/\D/g, "") })} />
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 text-lg font-bold">Do you have co-founder?</legend>
                  <div className="flex gap-3">
                    {[false, true].map((v) => (
                      <button
                        type="button"
                        key={String(v)}
                        onClick={() => setP("hasCoFounder", v)}
                        className={`flex-1 rounded-2xl border-2 py-3 font-bold transition ${
                          !!form.profile.hasCoFounder === v ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"
                        }`}
                      >
                        {v ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                  {form.profile.hasCoFounder && (
                    <input className="input mt-3" placeholder="Co-founder name" value={form.profile.coFounderName || ""} onChange={(e) => setP("coFounderName", e.target.value)} />
                  )}
                </fieldset>

                <fieldset className="grid gap-4 sm:grid-cols-2">
                  <legend className="mb-3 text-lg font-bold">Startup Information</legend>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="pf-sn">Startup&apos;s name?</label>
                    <input id="pf-sn" className="input" value={form.profile.startupName || ""} onChange={(e) => setP("startupName", e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="pf-ind">Industry</label>
                    <input id="pf-ind" className="input" placeholder="e.g., IT Services" value={form.profile.industry || ""} onChange={(e) => setP("industry", e.target.value)} />
                  </div>
                  <div>
                    <label className="label" htmlFor="pf-sec">Sector</label>
                    <input id="pf-sec" className="input" placeholder="e.g., Web, Meta Ads, SEO" value={form.profile.sector || ""} onChange={(e) => setP("sector", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="pf-desc">Business Description</label>
                    <textarea id="pf-desc" rows={4} maxLength={2000} className="input" placeholder="Type your message here" value={form.profile.businessDescription || ""} onChange={(e) => setP("businessDescription", e.target.value)} />
                  </div>
                </fieldset>

                <fieldset className="grid gap-4 sm:grid-cols-2">
                  <legend className="mb-3 text-lg font-bold">Location</legend>
                  <div>
                    <label className="label" htmlFor="pf-st">State & UT</label>
                    <select id="pf-st" className="input" value={form.profile.state || ""} onChange={(e) => setP("state", e.target.value)}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="pf-city">City</label>
                    <input id="pf-city" className="input" value={form.profile.city || ""} onChange={(e) => setP("city", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="pf-addr">Full address</label>
                    <input id="pf-addr" className="input" value={form.profile.address || ""} onChange={(e) => setP("address", e.target.value)} />
                  </div>
                </fieldset>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    <FaSave /> {saving ? "Saving..." : "Save profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearWelcome();
                      setEditing(false);
                    }}
                    className="btn btn-outline"
                  >
                    <FaTimes /> Skip for now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
