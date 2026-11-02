import { FaShieldAlt, FaBolt, FaUserTie, FaChartLine } from "react-icons/fa";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/data/site";
import { PageHero, SectionHeading } from "@/components/ui/Sections";
import ServiceCard from "@/components/services/ServiceCard";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Services — Startup India, MSME, GST, ISO, Trademark, Funding",
  description:
    "Startup India (DPIIT) certificate from ₹5,000, MSME from ₹1,000, GST from ₹2,500, ISO 9001 from ₹3,300, Trademark & Company registration, funding support, web design and digital marketing.",
  path: "/services",
  keywords: services.flatMap((s) => s.keywords),
});

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/services/${s.slug}`,
    name: s.title,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero
        eyebrow="What we do"
        title="Our"
        highlight="Services"
        description="Comprehensive solutions designed to help startups grow smarter, faster, and stronger — from compliance to scale."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
          {["Expert Guidance", "Fast Turnaround", "100% Secure", "Result-Oriented"].map((t) => (
            <span key={t} className="rounded-full border border-emerald-200 bg-white px-4 py-1.5 font-medium text-emerald-700 shadow-sm">
              ✓ {t}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.slug} s={s} />
          ))}
        </div>
      </section>

      <section className="bg-mist py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading title="Why Choose" highlight="StartupHealer Services?" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { Icon: FaShieldAlt, t: "100% Secure", d: "Your data is safe with us" },
              { Icon: FaBolt, t: "Fast Delivery", d: "Quick turnaround times" },
              { Icon: FaUserTie, t: "Expert Support", d: "Experienced professionals" },
              { Icon: FaChartLine, t: "Results Focused", d: "Measurable outcomes" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="card p-5 text-center sm:p-6">
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <Icon size={22} />
                </span>
                <h3 className="font-bold text-slate-900">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <h2 className="text-3xl font-extrabold">Ready to Transform Your Startup?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Choose any service or get a custom package tailored to your needs. Free consultation included!</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">Schedule Free Consultation</Link>
          <a href={site.phoneHref} className="btn btn-outline">Call: {site.phone}</a>
        </div>
      </section>
    </>
  );
}
