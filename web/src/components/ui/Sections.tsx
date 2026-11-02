import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  highlight: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <Image
        src="/images/leaf.png"
        alt=""
        width={520}
        height={390}
        className="pointer-events-none absolute -right-24 -top-10 w-72 opacity-25 sm:w-[420px]"
        aria-hidden
      />
      <div className="container-x relative py-14 text-center sm:py-20">
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-5xl">
          {title} <span className="text-gradient">{highlight}</span>
        </h1>
        <div className="mx-auto mt-4 h-1.5 w-28 rounded-full bg-brand-gradient" />
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ title, highlight, description }: { title: string; highlight: string; description?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
      <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
      <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-brand-gradient" />
      {description && <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>}
    </div>
  );
}

export function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <FaStar key={i} />
      ))}
    </div>
  );
}

export function CtaBanner({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="container-x py-14 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 via-emerald-600 to-green-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <Image src="/images/leaf.png" alt="" width={400} height={300} className="pointer-events-none absolute -bottom-16 -left-16 w-64 opacity-20" aria-hidden />
        <Image src="/images/leaf.png" alt="" width={400} height={300} className="pointer-events-none absolute -right-16 -top-16 w-64 rotate-180 opacity-20" aria-hidden />
        <h2 className="relative text-2xl font-extrabold sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-white/90 sm:text-lg">{description}</p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={primary.href} className="btn bg-white text-emerald-700 shadow-lg hover:bg-emerald-50">
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn border-2 border-white/80 text-white hover:bg-white/10">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function Initials({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <div className={`flex items-center justify-center rounded-full bg-brand-gradient font-bold text-white ${className}`} aria-hidden>
      {initials}
    </div>
  );
}
