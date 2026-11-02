import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaCheckCircle, FaWhatsapp, FaPhoneAlt, FaArrowLeft } from "react-icons/fa";
import { services, getService } from "@/data/services";
import { site, whatsappLink, SITE_URL } from "@/data/site";
import { successStories } from "@/data/content";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import ServiceIcon from "@/components/ServiceIcon";
import JsonLd from "@/components/JsonLd";
import ServiceEnquiryForm from "@/components/services/ServiceEnquiryForm";
import { Stars } from "@/components/ui/Sections";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({
    title: `${s.title} — ${s.price}`,
    description: `${s.short} ${s.description}`.slice(0, 160),
    path: `/services/${s.slug}`,
    keywords: s.keywords,
  });
}

// Match success stories to a service by keywords in their tags.
const storyMatch: Record<string, string[]> = {
  "startup-india-certificate": ["Startup India"],
  "msme-certificate": ["MSME", "Incubation"],
  "iso-9001-certification": ["ISO 9001", "CE", "GMP"],
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const stories = successStories.filter((t) => t.tags.some((tag) => (storyMatch[s.slug] || []).includes(tag))).slice(0, 2);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: `${s.short} ${s.description}`,
    serviceType: s.title,
    url: `${SITE_URL}/services/${s.slug}`,
    areaServed: { "@type": "Country", name: "India" },
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: { "@type": "Offer", priceCurrency: "INR", description: s.price },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: s.title, path: `/services/${s.slug}` },
        ])}
      />

      <section className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
        <div className="container-x py-10 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-cyan-700">Home</Link> / <Link href="/services" className="hover:text-cyan-700">Services</Link> /{" "}
            <span className="text-slate-800">{s.title}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-3xl text-white shadow-lg">
                <ServiceIcon icon={s.icon} />
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">{s.title}</h1>
              <p className="mt-4 text-lg font-medium text-slate-700 sm:text-xl">{s.short}</p>
              <p className="mt-3 text-slate-600 sm:text-lg">{s.description}</p>
              <div className="mt-6 inline-flex flex-col rounded-2xl border border-emerald-200 bg-white px-5 py-3 shadow-sm">
                <span className="text-xl font-bold text-cyan-700">{s.price}</span>
                {s.timeline && <span className="text-sm text-slate-500">{s.timeline}</span>}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappLink(`Hello! I want to get started with StartupHealer for ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <FaWhatsapp /> Get Started on WhatsApp
                </a>
                <a href={site.phoneHref} className="btn btn-outline">
                  <FaPhoneAlt /> {site.phone}
                </a>
              </div>
            </div>
            <ServiceEnquiryForm service={s.title} />
          </div>
        </div>
      </section>

      <section className="container-x grid gap-6 py-14 sm:py-20 md:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">What&apos;s included</h2>
          <ul className="mt-5 space-y-3">
            {s.features.map((f) => (
              <li key={f} className="flex gap-3 text-slate-700">
                <FaCheckCircle className="mt-1 shrink-0 text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-2xl font-bold">Key Benefits</h2>
          <ul className="mt-5 grid gap-3">
            {s.benefits.map((b) => (
              <li key={b} className="rounded-xl bg-gradient-to-r from-cyan-50 to-emerald-50 px-4 py-3 font-medium text-emerald-800">
                {b}
              </li>
            ))}
          </ul>
          <h3 className="mt-8 text-lg font-bold">How it works</h3>
          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            <li><strong className="text-slate-800">1. Free consultation</strong> — we understand your business and requirement.</li>
            <li><strong className="text-slate-800">2. Documents</strong> — we share an exact checklist and prepare everything.</li>
            <li><strong className="text-slate-800">3. Filing & follow-up</strong> — we handle submission and liaison.</li>
            <li><strong className="text-slate-800">4. Delivery</strong> — you receive your certificate / deliverable.</li>
          </ol>
        </div>
      </section>

      {stories.length > 0 && (
        <section className="bg-mist py-14">
          <div className="container-x">
            <h2 className="mb-6 text-center text-2xl font-bold">Success Stories</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {stories.map((t) => (
                <figure key={t.id} className="card p-6">
                  <Stars n={t.rating} />
                  <blockquote className="mt-3 text-slate-600">&ldquo;{t.content}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <strong>{t.name}</strong> · <span className="text-slate-500">{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-14">
        <h2 className="mb-6 text-2xl font-bold">Other services</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/services/${r.slug}`} className="card flex items-center gap-4 p-5 transition hover:-translate-y-1">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                <ServiceIcon icon={r.icon} />
              </span>
              <span>
                <span className="block font-semibold text-slate-900">{r.title}</span>
                <span className="text-sm text-cyan-700">{r.price}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link href="/services" className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-700">
          <FaArrowLeft /> All services
        </Link>
      </section>
    </>
  );
}
