import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
    {/* Same fixed background as the (site) layout — the reference 404 also sits on the leaf artwork */}
    <div className="site-bg" style={{ backgroundImage: "url(/images/leaf.png)" }} aria-hidden />
    <Navbar />
    <main className="pt-16">
    <section className="container-x flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
      <Image src="/images/leaf.png" alt="" width={200} height={150} className="w-36 opacity-80" aria-hidden />
      <p className="text-gradient mt-4 text-7xl font-extrabold">404</p>
      <h1 className="mt-2 text-3xl font-bold">Oops! Page Not Found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you&apos;re looking for seems to have taken a detour. Don&apos;t worry, we&apos;ll help you get back on track!
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">Back to Home</Link>
        <Link href="/services" className="btn btn-outline">Explore Services</Link>
      </div>
      <p className="mt-10 text-sm text-slate-500">Looking for something specific?</p>
      <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm font-medium text-cyan-700">
        <Link href="/about">About Us</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
