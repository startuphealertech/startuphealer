import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { site, whatsappLink } from "@/data/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/ui/Sections";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "Contact Us — Get In Touch",
  description: `Call ${site.phone}, email ${site.email} or visit us at Radha Kunj, Mansarovar, Jaipur. Free consultation for Startup India, MSME, GST, ISO and funding.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHero
        eyebrow="Contact"
        title="Get In"
        highlight="Touch"
        description="Ready to get started? Reach out to us and let's discuss how we can help your startup succeed."
      />

      <section className="container-x grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          {[
            { Icon: FaPhoneAlt, t: "Phone", body: <a href={site.phoneHref} className="hover:text-cyan-700">{site.phone}</a> },
            { Icon: FaEnvelope, t: "Email", body: <a href={`mailto:${site.email}`} className="break-all hover:text-cyan-700">{site.email}</a> },
            {
              Icon: FaMapMarkerAlt,
              t: "Address",
              body: (
                <address className="not-italic">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.line3}
                </address>
              ),
            },
          ].map(({ Icon, t, body }) => (
            <div key={t} className="card flex gap-4 p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Icon />
              </span>
              <div>
                <p className="font-semibold text-slate-900">{t}</p>
                <div className="text-slate-600">{body}</div>
              </div>
            </div>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#25D366] text-white hover:brightness-105">
            <FaWhatsapp size={20} /> Chat on WhatsApp
          </a>
          <div className="overflow-hidden rounded-2xl shadow">
            <iframe title="StartupHealer Location" src={site.mapEmbed} className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
