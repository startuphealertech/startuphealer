import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FaCheckCircle, FaArrowRight, FaShieldAlt, FaHandshake, FaBalanceScale, FaQuoteLeft } from "react-icons/fa";
import { services } from "@/data/services";
import { homeStats, whyChoose } from "@/data/site";
import { partners, successStories } from "@/data/content";
import ServiceIcon from "@/components/ServiceIcon";
import Reveal from "@/components/ui/Reveal";
import { CtaBanner, Initials, SectionHeading, Stars } from "@/components/ui/Sections";
import CountUp from "@/components/home/CountUp";
import LeadMagnetButton from "@/components/home/LeadMagnetButton";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const cardTints = [
  "from-cyan-50 to-teal-50 text-cyan-600",
  "from-teal-50 to-emerald-50 text-teal-600",
  "from-emerald-50 to-green-50 text-emerald-600",
  "from-green-50 to-cyan-50 text-green-600",
];

const whyIcons = [FaHandshake, FaShieldAlt, FaBalanceScale];

export default function HomePage() {
  return (
    <>
      {/* ---------- HERO (new design) ---------- */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
        <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden />

        <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-6 lg:py-24">
          <div className="text-center lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Trusted by 500+ founders across India
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] text-slate-900 sm:text-5xl xl:text-6xl">
              We Don&apos;t Just Consult — <span className="text-gradient">We Care</span>
            </h1>
            <p className="mt-5 text-xl font-medium text-slate-700 sm:text-2xl">
              Your Growth Partner for <span className="font-bold text-cyan-600">Compliance</span>,{" "}
              <span className="font-bold text-emerald-600">Funding</span>, and <span className="font-bold text-green-600">Scale</span>
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              We bring <span className="font-semibold text-cyan-600">clarity</span>, <span className="font-semibold text-emerald-600">confidence</span>, and{" "}
              <span className="font-semibold text-green-600">practical direction</span> to early-stage startups — helping you overcome challenges that slow you down, so you
              can focus on what truly matters: <span className="text-gradient font-bold">building impact</span>.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/register" className="btn btn-primary">
                Get Started Free <FaArrowRight />
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-slate-600 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
              {["No Hidden Costs", "Transparent Process", "Expert Guidance", "24/7 Support"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <FaCheckCircle className="shrink-0 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative mx-auto aspect-square w-full max-w-[440px] lg:max-w-[520px]">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-400 via-emerald-400 to-green-400 opacity-90 shadow-2xl" />
            <div className="absolute inset-6 animate-spin-slow rounded-full border-2 border-dashed border-white/60" aria-hidden />
            <div className="absolute inset-12 flex items-center justify-center overflow-hidden rounded-full bg-white shadow-inner">
              <Image
                src="/images/leaf.png"
                alt="StartupHealer leaf — growth for startups"
                width={1024}
                height={768}
                priority
                sizes="(max-width: 1024px) 70vw, 440px"
                className="w-[118%] max-w-none animate-float mix-blend-multiply"
              />
            </div>
            {[
              { label: "Startup India", sub: "DPIIT Recognised", pos: "left-0 top-[12%]" },
              { label: "MSME / Udyam", sub: "Registered", pos: "-right-1 top-[22%] sm:right-0" },
              { label: "ISO 9001:2015", sub: "Certified", pos: "left-0 bottom-[18%]" },
              { label: "Funding Ready", sub: "Pitch + Investors", pos: "-right-1 bottom-[8%] sm:right-2" },
            ].map((b, i) => (
              <div
                key={b.label}
                className={`absolute ${b.pos} flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-emerald-100 animate-float`}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                <FaCheckCircle className="text-emerald-500" />
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-800 sm:text-sm">{b.label}</p>
                  <p className="text-[10px] text-slate-500 sm:text-xs">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div className="container-x relative pb-14">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { to: 80, suffix: "%", label: "Faster Compliance Process", desc: "Save time with our streamlined approach" },
              { to: 500, suffix: "+", label: "Startups Supported", desc: "Trusted by founders across India" },
              { to: 95, suffix: "%", label: "Client Success Rate", desc: "Results that speak for themselves" },
            ].map((k) => (
              <div key={k.label} className="card p-6 text-center transition hover:-translate-y-1">
                <p className="text-gradient text-4xl font-extrabold sm:text-5xl">
                  <CountUp to={k.to} suffix={k.suffix} />
                </p>
                <p className="mt-2 font-semibold text-slate-800">{k.label}</p>
                <p className="text-sm text-slate-500">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="container-x py-16 sm:py-24" aria-labelledby="services-heading">
        <SectionHeading
          title="Our"
          highlight="Services"
          description="From compliance to growth, we offer comprehensive solutions to help your startup thrive at every stage."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.06}>
              <Link
                href={`/services/${s.slug}`}
                className={`group flex h-full flex-col rounded-2xl border border-white bg-gradient-to-br p-4 shadow-md transition hover:-translate-y-1 hover:shadow-xl sm:p-6 ${cardTints[i % 4]}`}
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition group-hover:scale-110 sm:h-14 sm:w-14">
                  <ServiceIcon icon={s.icon} className="text-xl sm:text-2xl" />
                </span>
                <h3 className="text-sm font-bold text-slate-800 sm:text-lg">{s.name}</h3>
                <p className="mt-1 hidden text-sm text-slate-600 sm:block">{s.short}</p>
                <span className="mt-auto pt-3 text-xs font-semibold text-emerald-700 sm:text-sm">
                  {s.price.replace("Starting from ", "From ")} →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn btn-primary">
            View All Services <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="bg-slate-950 py-12 text-white">
        <div className="container-x grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {homeStats.map((s) => (
            <div key={s.label}>
              <p className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl">{s.number}</p>
              <p className="mt-1 text-sm text-slate-300 sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- WHY CHOOSE ---------- */}
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading title="Why Choose" highlight="StartupHealer?" />
          <div className="grid gap-5 md:grid-cols-3">
            {whyChoose.map((w, i) => {
              const Icon = whyIcons[i];
              return (
                <Reveal key={w.title} delay={i * 0.1}>
                  <div className="card h-full p-7">
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
                      <Icon size={24} />
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{w.title}</h3>
                    <p className="mt-2 text-slate-600">{w.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- SUCCESS STORIES PREVIEW ---------- */}
      <section className="container-x py-16 sm:py-24">
        <SectionHeading
          title="Success"
          highlight="Stories"
          description="Our clients' success is our greatest achievement. Here's what some of the founders we've worked with have to say."
        />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {successStories.slice(0, 3).map((t) => (
            <article key={t.id} className="card flex w-[85%] shrink-0 snap-center flex-col p-6 md:w-auto">
              <FaQuoteLeft className="text-3xl text-emerald-200" />
              <p className="mt-3 flex-1 text-slate-600">{t.content}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <Initials name={t.name} className="h-11 w-11 text-sm" />
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
            Read All Success Stories <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ---------- PARTNERS ---------- */}
      <section className="border-y border-slate-100 bg-white py-12" aria-labelledby="partners-heading">
        <div className="container-x text-center">
          <h2 id="partners-heading" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Our Partners
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {partners.map((p) => (
              <div key={p.name} className="flex h-20 min-w-40 items-center justify-center rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 px-8 shadow-sm" title={p.full}>
                {p.logo ? (
                  <Image src={p.logo} alt={p.full} width={140} height={56} className="h-12 w-auto object-contain" />
                ) : (
                  <span className="text-gradient font-display text-3xl font-extrabold tracking-wide">{p.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LEAD MAGNET BANNER ---------- */}
      <section className="container-x pt-16">
        <div className="grid items-center gap-6 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
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
