import Link from "next/link";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import type { Service } from "@/data/services";
import { whatsappLink } from "@/data/site";
import ServiceIcon from "@/components/ServiceIcon";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article id={s.slug} className="group flex h-full scroll-mt-24 flex-col rounded-2xl border-2 border-cyan-100 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-2xl sm:p-8">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50 text-2xl text-emerald-600 ring-1 ring-emerald-100">
        <ServiceIcon icon={s.icon} />
      </span>
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
        <Link href={`/services/${s.slug}`} className="hover:text-cyan-700">
          {s.title}
        </Link>
      </h2>
      <p className="mt-2 font-medium text-slate-700">{s.short}</p>
      <p className="mt-2 text-sm text-slate-600">{s.description}</p>
      <ul className="mt-5 space-y-2">
        {s.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-slate-700">
            <FaCheck className="mt-0.5 shrink-0 text-emerald-500" /> {f}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-800">Key Benefits:</p>
        <div className="flex flex-wrap gap-2">
          {s.benefits.map((b) => (
            <span key={b} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-6">
        {s.timeline && <p className="mb-1 text-xs text-slate-500">{s.timeline}</p>}
        <p className="text-lg font-bold text-cyan-700">{s.price}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/services/${s.slug}`} className="btn btn-outline !px-3 text-sm">
            Details
          </Link>
          <a href={whatsappLink(`Hello! I want to get started with StartupHealer for ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-3 text-sm">
            <FaWhatsapp /> Get Started
          </a>
        </div>
      </div>
    </article>
  );
}
