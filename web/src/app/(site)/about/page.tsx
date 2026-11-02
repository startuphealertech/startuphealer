import { FaCheckCircle } from "react-icons/fa";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { offerings, team } from "@/data/content";
import { CtaBanner, Initials, PageHero, SectionHeading } from "@/components/ui/Sections";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/JsonLd";

export const metadata = pageMetadata({
  title: "About Us — We Don't Just Consult, We Care",
  description:
    "StartupHealer is a Jaipur-based growth partner for founders. Our mission: heal the startup ecosystem by solving funding confusion, compliance complexity and lack of strategic focus.",
  path: "/about",
});

const tagColors = ["bg-cyan-50 text-cyan-700 border-cyan-200", "bg-emerald-50 text-emerald-700 border-emerald-200", "bg-green-50 text-green-700 border-green-200"];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        eyebrow="About Us"
        title="About"
        highlight="StartupHealer"
        description="We understand that every founder's journey is filled with uncertainty, excitement, and constant problem-solving."
      />

      <section className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
            At StartupHealer, we don&apos;t just consult — <span className="text-gradient">we care</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            We understand that every founder&apos;s journey is filled with uncertainty, excitement, and constant problem-solving. That&apos;s why we exist — to bring{" "}
            <strong className="text-cyan-700">clarity</strong>, <strong className="text-emerald-700">confidence</strong>, and{" "}
            <strong className="text-green-700">practical direction</strong> to early-stage startups.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            We&apos;re not a service aggregator or a paperwork portal. We&apos;re a <strong className="text-emerald-700">growth partner</strong> that listens, understands your story,
            and builds tailored strategies that actually move your business forward.
          </p>
        </Reveal>
        <div className="cube-scene flex justify-center py-10" aria-label="Certifications we help with: Startup India, MSME, GST, ISO 9001, Trademark, Funding">
          <div className="cube">
            <div className="face front">Startup India</div>
            <div className="face back">MSME</div>
            <div className="face right">GST</div>
            <div className="face left">ISO 9001</div>
            <div className="face top">Trademark</div>
            <div className="face bottom">Funding</div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-16 sm:py-20">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card h-full p-8">
              <h2 className="text-2xl font-bold">🌟 Our Mission</h2>
              <p className="mt-3 text-slate-600">
                To heal the startup ecosystem by helping founders overcome challenges that slow them down — whether it&apos;s funding confusion, compliance complexity, or lack of
                strategic focus.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card h-full p-8">
              <h2 className="text-2xl font-bold">🌏 Our Vision</h2>
              <p className="mt-3 text-slate-600">
                To become India&apos;s most trusted startup support ecosystem — where entrepreneurs find not just services, but a team that genuinely wants them to win.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <SectionHeading title="🚀 What We" highlight="Offer" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((o, i) => (
            <Reveal key={o.title} delay={(i % 3) * 0.08}>
              <div className="card flex h-full gap-4 p-6">
                <FaCheckCircle className="mt-1 shrink-0 text-xl text-emerald-500" />
                <div>
                  <h3 className="font-bold text-slate-900">{o.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{o.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg text-slate-600">
          Every service we offer is designed to help founders build <strong>smarter</strong>, <strong>faster</strong>, and <strong>stronger</strong> — without losing focus on what
          truly matters: <span className="text-gradient font-bold">building impact</span>.
        </p>
      </section>

      <section id="team" className="bg-mist py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading
            title="Meet the"
            highlight="Team"
            description="A passionate team of experts dedicated to helping founders succeed. We bring years of experience, strategic insights, and genuine care to every startup we support."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.1}>
                <article className="card group h-full p-8 text-center">
                  <Initials name={m.name} className="mx-auto h-24 w-24 text-2xl ring-4 ring-emerald-100 transition group-hover:scale-105" />
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{m.name}</h3>
                  <p className="text-sm font-semibold text-emerald-600">{m.role}</p>
                  <p className="mt-3 text-sm text-slate-600">{m.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {m.expertise.map((e, j) => (
                      <span key={e} className={`rounded-full border px-3 py-1 text-xs font-medium ${tagColors[j % 3]}`}>
                        {e}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Want to Work With Us?"
        description="Our team is here to support your startup journey. Get in touch to discuss how we can help you succeed."
        primary={{ href: "/contact", label: "Schedule a Consultation" }}
      />
    </>
  );
}
