"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane, FaPhoneAlt } from "react-icons/fa";
import { api, ApiClientError } from "@/lib/api";
import { site } from "@/data/site";

type Msg = { from: "user" | "bot"; text: string; link?: string; quickReplies?: string[]; askLead?: boolean };
type BotReply = { reply: string; quickReplies: string[]; link?: string; askLead: boolean };

const SESSION_KEY = "sh_chat_session";
const GREETING: Msg = {
  from: "bot",
  text: "Hi! 👋 I'm the StartupHealer assistant. Ask me about Startup India, MSME, GST, ISO, Trademark, Funding, Websites or Marketing.",
  quickReplies: ["Our services", "Pricing", "Startup India Certificate", "Talk to an expert"],
};

function getSessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export default function Chatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [leadError, setLeadError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<string>("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, leadOpen]);

  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const t = text.trim();
    if (!t || typing) return;
    if (!sessionRef.current) sessionRef.current = getSessionId();
    if (/share my details|talk to an expert/i.test(t)) setLeadOpen(true);
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);
    try {
      const r = await api<BotReply>("/chatbot/message", {
        method: "POST",
        body: { sessionId: sessionRef.current, message: t.slice(0, 1000), page: pathname },
      });
      setMsgs((m) => [...m, { from: "bot", text: r.reply, link: r.link, quickReplies: r.quickReplies, askLead: r.askLead }]);
      if (r.askLead && !leadDone) setLeadOpen(true);
    } catch {
      setMsgs((m) => [
        ...m,
        { from: "bot", text: `Sorry, I couldn't connect right now. Please call us at ${site.phone} or WhatsApp us.` },
      ]);
    } finally {
      setTyping(false);
    }
  }

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadError("");
    const fd = new FormData(e.currentTarget);
    if (!sessionRef.current) sessionRef.current = getSessionId();
    try {
      await api("/chatbot/lead", {
        method: "POST",
        body: {
          sessionId: sessionRef.current,
          name: String(fd.get("name") || ""),
          email: String(fd.get("email") || ""),
          phone: String(fd.get("phone") || "").replace(/\D/g, "").slice(-10),
        },
      });
      setLeadDone(true);
      setLeadOpen(false);
      setMsgs((m) => [...m, { from: "bot", text: "Thank you! 🙌 Our expert will contact you within 2 hours." }]);
    } catch (err) {
      setLeadError(err instanceof ApiClientError ? err.message : "Please try again.");
    }
  }

  const last = msgs[msgs.length - 1];

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        className={`fixed bottom-5 right-4 z-40 ${open ? "hidden sm:flex" : "flex"} h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-xl transition hover:scale-105 sm:right-6`}
      >
        {open ? <FaTimes size={22} /> : <FaCommentDots size={24} />}
        {!open && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-ping rounded-full bg-emerald-400" />}
      </button>

      {open && (
        <section
          aria-label="StartupHealer chat assistant"
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-fade-up sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-3xl"
        >
          <header className="flex items-center gap-3 bg-brand-gradient p-4 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image src="/images/leaf.png" alt="" width={32} height={24} />
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-tight">StartupHealer Assistant</p>
              <p className="text-xs text-white/85">Typically replies instantly</p>
            </div>
            <a href={site.phoneHref} aria-label="Call us" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <FaPhoneAlt size={14} />
            </a>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 sm:hidden">
              <FaTimes />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.from === "user" ? "rounded-br-sm bg-cyan-600 text-white" : "rounded-bl-sm bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {m.text}
                  {m.link && (
                    <Link href={m.link} onClick={() => setOpen(false)} className="mt-2 block font-semibold text-emerald-600 underline">
                      View details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 rounded-2xl bg-white px-4 py-3 shadow-sm w-16" aria-label="Assistant is typing">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </div>
            )}

            {leadOpen && !leadDone && (
              <form onSubmit={submitLead} className="space-y-2 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">Share your details — an expert will call you back</p>
                <input name="name" required minLength={2} placeholder="Your name" className="input !py-2 text-sm" autoComplete="name" />
                <input name="email" type="email" required placeholder="Email" className="input !py-2 text-sm" autoComplete="email" />
                <input name="phone" type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} placeholder="Phone (10 digits)" className="input !py-2 text-sm" />
                {leadError && <p className="text-xs text-red-600">{leadError}</p>}
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary flex-1 !py-2 text-sm">Request callback</button>
                  <button type="button" onClick={() => setLeadOpen(false)} className="btn !px-3 !py-2 text-sm text-slate-500">Later</button>
                </div>
              </form>
            )}
            <div ref={endRef} />
          </div>

          {last?.from === "bot" && last.quickReplies && last.quickReplies.length > 0 && !typing && (
            <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2">
              {last.quickReplies.map((q) => (
                <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50">
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Type your question"
              maxLength={1000}
              className="input !rounded-full !py-2.5"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white disabled:opacity-50">
              <FaPaperPlane />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
