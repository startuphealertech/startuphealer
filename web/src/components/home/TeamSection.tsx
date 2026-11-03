import Link from "next/link";
import { team } from "@/data/content";
import { Initials, SectionHeading } from "@/components/ui/Sections";
import Reveal from "@/components/ui/Reveal";

// Per-member accent (avatar ring + expertise tags), same palette as the reference site.
const accents = [
  { ring: "ring-cyan-200", tag: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { ring: "ring-emerald-200", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { ring: "ring-green-200", tag: "bg-green-50 text-green-700 border-green-200" },
];

// "Meet the Team" — shown on the Home page (as on startuphealer.com).
export default function TeamSection() {
  return (
    <section id="team" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          title="Meet the"
          highlight="Team"
          description="A passionate team of experts dedicated to helping founders succeed. We bring years of experience, strategic insights, and genuine care to every startup we support."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const a = accents[i % accents.length];
            return (
              <Reveal key={m.name} delay={i * 0.1}>
                <article className="card group h-full bg-white/95 p-8 text-center backdrop-blur-md transition hover:-translate-y-2 hover:shadow-xl">
                  <Initials name={m.name} className={`mx-auto h-24 w-24 text-2xl ring-4 ${a.ring} transition group-hover:scale-105`} />
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{m.name}</h3>
                  <p className="text-sm font-semibold text-emerald-600">{m.role}</p>
                  <p className="mt-3 text-sm text-slate-600">{m.bio}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {m.expertise.map((e) => (
                      <span key={e} className={`rounded-full border px-3 py-1 text-xs font-medium ${a.tag}`}>
                        {e}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Part of the team section on the reference site */}
        <div className="mt-16 rounded-2xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50/95 via-emerald-50/95 to-green-50/95 p-8 text-center">
          <h3 className="mb-3 text-2xl font-bold text-slate-800">Want to Work With Us?</h3>
          <p className="mx-auto mb-6 max-w-2xl text-slate-600">
            Our team is here to support your startup journey. Get in touch to discuss how we can help you succeed.
          </p>
          <Link href="/contact" className="btn btn-primary !px-8">
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
