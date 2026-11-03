import Link from "next/link";
import type { Metadata } from "next";
import { FaCheckCircle, FaArrowRight, FaQuoteLeft } from "react-icons/fa";
import { services } from "@/data/services";
import { homeStats, whyChoose } from "@/data/site";
import { successStories } from "@/data/content";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/ui/Reveal";
import HoverLift from "@/components/ui/HoverLift";
import { CertificateCube, CtaBanner, Initials, SectionHeading, Stars } from "@/components/ui/Sections";
import CountUp from "@/components/home/CountUp";
import LeadMagnetButton from "@/components/home/LeadMagnetButton";
import TeamSection from "@/components/home/TeamSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Per-service card gradient + icon colour, in the same order as startuphealer.com.
const cardTints = [
  { bg: "from-cyan-100 to-teal-100", icon: "text-cyan-600" },
  { bg: "from-teal-100 to-emerald-100", icon: "text-teal-600" },
  { bg: "from-emerald-100 to-green-100", icon: "text-emerald-600" },
  { bg: "from-green-100 to-cyan-100", icon: "text-green-600" },
  { bg: "from-cyan-100 to-emerald-100", icon: "text-cyan-700" },
  { bg: "from-teal-100 to-cyan-100", icon: "text-teal-700" },
  { bg: "from-emerald-100 to-green-100", icon: "text-emerald-700" },
  { bg: "from-green-100 to-teal-100", icon: "text-green-700" },
];

// Hero KPIs — values/labels from startuphealer.com
const heroKpis = [
  { to: 80, suffix: "%", label: "Faster Compliance Process", desc: "Save time with our streamlined approach", color: "from-cyan-600 to-teal-600" },
  { to: 500, suffix: "+", label: "Startups Supported", desc: "Trusted by founders across India", color: "from-teal-600 to-emerald-600" },
  { to: 95, suffix: "%", label: "Client Success Rate", desc: "Results that speak for themselves", color: "from-emerald-600 to-green-600" },
];

// Section order follows startuphealer.com:
// Hero → Our Services → Stats → Why Choose → 3D cube → Meet the Team (+ "Want to Work With Us?") → CTA.
// Local additions kept between Team and the final CTA: Success Stories preview and the free checklist lead magnet.
export default function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section id="home" className="relative flex min-h-[70vh] flex-col items-center justify-center">
        <div className="container-x py-14 text-center sm:py-16">
          <h1 className="mx-auto max-w-5xl text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
            We Don&apos;t Just Consult — <span className="text-gradient">We Care</span>
          </h1>
          <div className="mx-auto mt-6 h-1.5 w-24 rounded-full bg-brand-gradient" />
          <p className="mt-6 text-xl font-medium text-slate-700 sm:text-2xl">
            Your Growth Partner for <span className="font-bold text-cyan-600">Compliance</span>,{" "}
            <span className="font-bold text-emerald-600">Funding</span>, and <span className="font-bold text-green-600">Scale</span>
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
            We bring <span className="font-semibold text-cyan-600">clarity</span>, <span className="font-semibold text-emerald-600">confidence</span>, and{" "}
            <span className="font-semibold text-green-600">practical direction</span> to early-stage startups — helping you overcome challenges that slow you down, so you can
            focus on what truly matters: <span className="text-gradient font-bold">building impact</span>.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3 sm:gap-6">
            {heroKpis.map((k) => (
              <HoverLift key={k.label}>
                <div className="h-full rounded-2xl border-2 border-cyan-100 bg-white/90 p-6 shadow-lg backdrop-blur-md transition-colors hover:border-cyan-300">
                  <p className={`bg-gradient-to-r ${k.color} bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl`}>
                    <CountUp to={k.to} suffix={k.suffix} />
                  </p>
                  <p className="mt-2 font-semibold text-slate-800">{k.label}</p>
                  <p className="text-sm text-slate-500">{k.desc}</p>
                </div>
              </HoverLift>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn btn-primary">
              Get Started Free <FaArrowRight />
            </Link>
            <Link href="/services" className="btn btn-outline">
              Explore Services
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 justify-items-start gap-3 text-sm text-slate-600 sm:flex sm:flex-wrap sm:justify-center sm:gap-6">
            {["No Hidden Costs", "Transparent Process", "Expert Guidance", "24/7 Support"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <FaCheckCircle className="shrink-0 text-emerald-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="container-x py-16 text-center sm:py-20">
        <SectionHeading
          title="Our"
          highlight="Services"
          description="From compliance to growth, we offer comprehensive solutions to help your startup thrive at every stage."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {services.map((s, i) => {
            const tint = cardTints[i % cardTints.length];
            return (
              <Reveal key={s.slug} delay={(i % 4) * 0.06}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`group flex h-full flex-col items-center justify-center rounded-2xl border-2 border-white/50 bg-gradient-to-br p-4 text-center shadow-lg backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-6 ${tint.bg}`}
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
                    <ServiceIcon icon={s.icon} className={`text-xl sm:text-2xl ${tint.icon}`} />
                  </span>
                  <h3 className="text-sm font-semibold leading-tight text-slate-800 sm:text-base">{s.name}</h3>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-12">
          <Link href="/services" className="btn btn-primary !px-8 !py-4">
            View All Services
          </Link>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="bg-white/80 py-16 backdrop-blur-md">
        <div className="container-x grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {homeStats.map((s) => (
            <div key={s.label}>
              <p className="text-gradient text-4xl font-extrabold md:text-5xl">{s.number}</p>
              <p className="mt-2 font-medium text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- WHY CHOOSE ---------- */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading title="Why Choose" highlight="StartupHealer?" />
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {whyChoose.map((w) => (
              <HoverLift key={w.title}>
                <div className="h-full rounded-2xl border-2 border-cyan-200 bg-white/95 p-8 shadow-lg backdrop-blur-md transition hover:border-cyan-400 hover:shadow-xl">
                  <h3 className="mb-3 text-xl font-bold text-slate-800">{w.title}</h3>
                  <p className="leading-relaxed text-slate-600">{w.desc}</p>
                </div>
              </HoverLift>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3D CERTIFICATE CUBE ---------- */}
      <CertificateCube />

      {/* ---------- MEET THE TEAM (+ "Want to Work With Us?") ---------- */}
      <TeamSection />

      {/* ---------- SUCCESS STORIES PREVIEW (local addition; content = verified client testimonials) ---------- */}
      <section className="container-x py-16 sm:py-20">
        <SectionHeading
          title="Success"
          highlight="Stories"
          description="Our clients' success is our greatest achievement. Here's what some of the founders we've worked with have to say."
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {successStories.slice(0, 3).map((t) => (
            <article key={t.id} className="flex w-[85%] shrink-0 snap-center flex-col rounded-2xl border-2 border-cyan-100 bg-white/95 p-6 shadow-lg md:w-auto">
              <FaQuoteLeft className="text-3xl text-cyan-200" aria-hidden />
              <p className="mt-3 flex-1 text-slate-700">&ldquo;{t.content}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3 border-t-2 border-cyan-100 pt-4">
                <Initials name={t.name} className="h-11 w-11 shrink-0 text-sm" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="truncate text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <Stars n={t.rating} />
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/success-stories" className="btn btn-outline">
            Read All Testimonials <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ---------- LEAD MAGNET BANNER (local addition) ---------- */}
      <section className="container-x">
        <div className="grid items-center gap-6 rounded-3xl border-2 border-emerald-100 bg-gradient-to-r from-emerald-50/95 to-cyan-50/95 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Free Resource</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Startup Compliance & Funding Checklist 2026</h2>
            <p className="mt-2 text-slate-600">Every registration, certificate and government scheme a new Indian startup needs — in one simple checklist.</p>
          </div>
          <LeadMagnetButton />
        </div>
      </section>

      <CtaBanner
        title="Ready to Start Your Journey?"
        description="Join 500+ successful startups who chose StartupHealer as their growth partner. Let's build something amazing together!"
        primary={{ href: "/contact", label: "Get Started Today" }}
        secondary={{ href: "/services", label: "Explore Services" }}
      />
    </>
  );
}
