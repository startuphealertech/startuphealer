"use client";

import { useMemo, useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";

type Faq = { category: string; question: string; answer: string };

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [open, setOpen] = useState<number | null>(0);

  const categories = useMemo(() => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))], [faqs]);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return faqs
      .map((f, i) => ({ ...f, i }))
      .filter((f) => (cat === "All" || f.category === cat) && (!term || `${f.question} ${f.answer}`.toLowerCase().includes(term)));
  }, [faqs, q, cat]);

  return (
    <div>
      <div className="relative">
        <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for answers..."
          aria-label="Search FAQs"
          className="input !rounded-full !py-3.5 !pl-11 shadow-sm"
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              cat === c ? "bg-brand-gradient text-white shadow" : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      {q && <p className="mt-4 text-sm text-slate-500">Found {filtered.length} result(s)</p>}

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold">No results found for &ldquo;{q}&rdquo;</p>
            <p className="mt-1 text-sm text-slate-500">Try different keywords or contact our support team</p>
          </div>
        ) : (
          filtered.map((f) => {
            const isOpen = open === f.i;
            return (
              <div key={f.i} className={`card overflow-hidden transition ${isOpen ? "ring-2 ring-cyan-200" : ""}`}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : f.i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f.i}`}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-slate-900"
                  >
                    {f.question}
                    <FaChevronDown className={`shrink-0 text-emerald-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </h3>
                {/* Kept in the DOM (hidden) so crawlers still see every answer */}
                <div id={`faq-${f.i}`} hidden={!isOpen} className="px-5 pb-5 leading-relaxed text-slate-600">
                  {f.answer}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
