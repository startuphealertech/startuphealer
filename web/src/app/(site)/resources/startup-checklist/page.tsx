import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import PrintButton from "@/components/PrintButton";

export const metadata = pageMetadata({
  title: "Startup Compliance & Funding Checklist 2026",
  description: "Free checklist of registrations, certificates and schemes for Indian startups.",
  path: "/resources/startup-checklist",
  noindex: true, // gated lead-magnet content
});

const sections = [
  {
    title: "1. Set up the legal entity",
    items: [
      "Choose structure: Private Limited / LLP / OPC / Partnership / Proprietorship",
      "Company name approval with RoC",
      "MOA / AOA drafting & incorporation certificate",
      "PAN & TAN for the business",
      "Open a current bank account",
    ],
  },
  {
    title: "2. Core registrations",
    items: [
      "GST registration (mandatory above turnover threshold or for inter-state / online sales)",
      "MSME / Udyam registration — collateral-free loans, subsidies, lower interest",
      "Shop & Establishment licence (state-specific)",
      "Professional tax registration (where applicable)",
    ],
  },
  {
    title: "3. Startup India (DPIIT) recognition",
    items: [
      "Check eligibility: entity < 10 years old, turnover < ₹100 Cr, working on innovation",
      "Prepare a short write-up of your innovation / scalability",
      "Apply for DPIIT recognition certificate",
      "Explore tax exemption (3 years), IPR fast-track and government tenders",
      "State schemes — e.g. iStart Rajasthan, SIC registration",
    ],
  },
  {
    title: "4. Protect your brand & quality",
    items: [
      "Trademark search & filing for your brand name / logo",
      "ISO 9001:2015 certification for process credibility",
      "Industry-specific certifications (CE, GMP, FSSAI, etc.)",
    ],
  },
  {
    title: "5. Get funding-ready",
    items: [
      "Professional pitch deck (problem, solution, market, traction, team, ask)",
      "3–5 year financial model",
      "Cap table & founder agreements",
      "Explore Seed Fund Scheme, incubation programmes & hackathons (e.g. MSME Hackathon 5.0)",
      "Build investor list & practise your pitch",
    ],
  },
  {
    title: "6. Go to market",
    items: [
      "SEO-friendly, mobile-first website",
      "Google Business Profile & social pages",
      "Performance marketing plan with clear ROI tracking",
    ],
  },
];

export default function ChecklistPage() {
  return (
    <section className="container-x max-w-3xl py-12 print:py-0">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Free Resource · StartupHealer</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Startup Compliance & Funding Checklist 2026</h1>
      <p className="mt-3 text-slate-600">Tick off each item as you go. Need help with any step? Our experts handle it end-to-end.</p>
      <div className="mt-5 print:hidden">
        <PrintButton />
      </div>

      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <div key={s.title} className="card break-inside-avoid p-6">
            <h2 className="text-xl font-bold">{s.title}</h2>
            <ul className="mt-4 space-y-2">
              {s.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-emerald-600" aria-label={it} />
                  <span className="text-slate-700">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-cyan-50 to-emerald-50 p-6 text-center">
        <p className="font-semibold">Want us to do this for you?</p>
        <p className="mt-1 text-sm text-slate-600">
          Call {site.phone} · {site.email}
        </p>
        <Link href="/contact" className="btn btn-primary mt-4 print:hidden">Book a Free Consultation</Link>
      </div>
    </section>
  );
}
