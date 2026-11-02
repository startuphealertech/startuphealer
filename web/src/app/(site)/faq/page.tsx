import Link from "next/link";
import { faqs } from "@/data/content";
import { site } from "@/data/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/Sections";
import FaqList from "@/components/faq/FaqList";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "FAQ — Frequently Asked Questions",
  description:
    "Everything you need to know about StartupHealer's services, pricing, timelines and support — Startup India, MSME, GST, ISO, Trademark, Company registration and funding.",
  path: "/faq",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])} />
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked"
        highlight="Questions"
        description="Everything you need to know about StartupHealer's services, processes, and support. Can't find your answer? We're here to help!"
      >
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { v: "15+", l: "FAQs Covered" },
            { v: "24/7", l: "Support Available" },
            { v: "< 2hrs", l: "Response Time" },
            { v: "100%", l: "Satisfaction Rate" },
          ].map((s) => (
            <div key={s.l} className="card p-4">
              <p className="text-gradient text-2xl font-extrabold">{s.v}</p>
              <p className="text-xs text-slate-600">{s.l}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="container-x max-w-3xl py-14 sm:py-20">
        <FaqList faqs={faqs} />
      </section>

      <section className="container-x pb-20">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-cyan-50 to-emerald-50 p-8 text-center">
          <h2 className="text-2xl font-extrabold">Still Have Questions?</h2>
          <p className="mt-2 text-slate-600">Our expert team is ready to help you. Get in touch and we&apos;ll respond within 2 hours!</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-primary">Contact Support</Link>
            <a href={site.phoneHref} className="btn btn-outline">Call: {site.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
