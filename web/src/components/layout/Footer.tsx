import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { site } from "@/data/site";
import { services } from "@/data/services";
import CurrentYear from "./CurrentYear";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Success Stories", href: "/success-stories" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-block rounded-xl bg-white p-2">
            <Image src="/images/logo.jpeg" alt="StartupHealer Logo" width={150} height={78} className="h-12 w-auto" />
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{site.shortAbout}</p>
          <div className="flex gap-3">
            {[
              { href: site.socials.facebook, label: "Facebook", Icon: FaFacebookF },
              { href: site.socials.instagram, label: "Instagram", Icon: FaInstagram },
              { href: site.socials.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-emerald-400">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Services</h3>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-emerald-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <FaPhoneAlt className="mt-1 shrink-0 text-emerald-400" />
              <a href={site.phoneHref} className="hover:text-emerald-400">{site.phone}</a>
            </li>
            <li className="flex gap-3">
              <FaEnvelope className="mt-1 shrink-0 text-emerald-400" />
              <a href={`mailto:${site.email}`} className="break-all hover:text-emerald-400">{site.email}</a>
            </li>
            <li className="flex gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-emerald-400" />
              <address className="not-italic">{site.address.full}</address>
            </li>
          </ul>
          <div className="mt-4 overflow-hidden rounded-xl">
            <iframe
              title="StartupHealer Location"
              src={site.mapEmbed}
              className="h-36 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            © <CurrentYear /> StartupHealer. All rights reserved.
          </p>
          <p>Jaipur, Rajasthan · Made for Indian founders 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
