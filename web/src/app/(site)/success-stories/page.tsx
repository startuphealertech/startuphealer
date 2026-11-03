import { FaQuoteLeft, FaCheckCircle, FaTrophy, FaAward, FaUsers, FaHeart } from "react-icons/fa";
import { successStories, storyStats } from "@/data/content";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/data/site";
import { CtaBanner, Initials, PageHero, SectionHeading, Stars } from "@/components/ui/Sections";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "Success Stories — What Our Clients Say",
  description:
    "Real success stories from founders who got Startup India, MSME, SIC, iStart Rajasthan, ISO 9001, CE & GMP approvals with StartupHealer. 500+ happy clients, 4.9/5 average rating.",
  path: "/success-stories",
});

const reviewsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: "StartupHealer",
  review: successStories.map((t) => ({
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.content,
    reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
  })),
};

export default function SuccessStoriesPage() {
  return (
    <>
      <JsonLd data={reviewsJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Success Stories", path: "/success-stories" }])} />
      <PageHero
        eyebrow="Success Stories"
        title="What Our"
        highlight="Clients Say"
        description="Our clients' success is our greatest achievement. Here's what some of the founders and entrepreneurs we've worked with have to say about StartupHealer."
      >
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {storyStats.map((s) => (
            <div key={s.label} className="card p-4 sm:p-5">
              <p className="text-gradient text-2xl font-extrabold sm:text-3xl">{s.value}</p>
              <p className="text-xs text-slate-600 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="container-x py-14 sm:py-20">
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
          {successStories.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 0.06} className="break-inside-avoid">
              <article className="card p-6">
                <div className="flex items-center justify-between">
                  <FaQuoteLeft className="text-3xl text-emerald-200" />
                  <Stars n={t.rating} />
                </div>
                <p className="mt-4 leading-relaxed text-slate-700">{t.content}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-medium text-cyan-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <Initials name={t.name} className="h-12 w-12 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <FaCheckCircle /> Verified Client
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-mist/70 py-16">
        <div className="container-x">
          <SectionHeading title="Why Clients" highlight="Choose Us" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { Icon: FaTrophy, t: "Trusted Results", d: "Proven track record of success" },
              { Icon: FaAward, t: "Award Winning", d: "Recognized excellence" },
              { Icon: FaUsers, t: "Expert Team", d: "Experienced professionals" },
              { Icon: FaHeart, t: "Client Focused", d: "Your success is our priority" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="card p-5 text-center sm:p-6">
                <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white">
                  <Icon size={24} />
                </span>
                <h3 className="font-bold">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        original
        title="Ready to Join Our Success Stories?"
        description="Let's write your success story together. Get started today and experience the StartupHealer difference!"
        primary={{ href: "/contact", label: "Get Started Today" }}
        secondary={{ href: "/services", label: "View Our Services" }}
      />
    </>
  );
}
