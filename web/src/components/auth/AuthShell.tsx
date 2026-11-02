import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50">
      <div className="container-x grid min-h-[calc(100dvh-5rem)] items-center gap-10 py-10 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-green-500 p-10 text-white shadow-2xl lg:block">
          <Image src="/images/leaf.png" alt="" width={600} height={450} className="pointer-events-none absolute -bottom-20 -right-20 w-[420px] opacity-30" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">StartupHealer</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight">We Don&apos;t Just Consult — We Care</h2>
          <p className="mt-4 max-w-md text-white/90">Your Growth Partner for Compliance, Funding, and Scale.</p>
          <ul className="relative mt-10 space-y-3">
            {["Track your registrations & certificates", "Save your startup profile once", "Get expert help within 2 hours", "Exclusive founder resources"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <FaCheckCircle /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-6 inline-block lg:hidden">
            <Image src="/images/logo.jpeg" alt="StartupHealer" width={140} height={73} className="h-12 w-auto" />
          </Link>
          <div className="card p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-slate-500">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
