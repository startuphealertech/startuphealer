import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { site } from "@/data/site";
import CurrentYear from "./CurrentYear";

// Footer styled after startuphealer.com (values read from the live site):
// white background, 2px cyan-200 top border, gray-800 text / gray-600 body copy, cyan→emerald gradient
// headings, cyan-600 link hover, gradient social buttons and a cyan-50 → emerald-50 → green-50 copyright bar.
const quickLinks = [
  { name: "Home", href: "/", bullet: "text-cyan-500" },
  { name: "About", href: "/about", bullet: "text-emerald-500" },
  { name: "Services", href: "/services", bullet: "text-teal-500" },
  { name: "Testimonials", href: "/success-stories", bullet: "text-green-500" },
  { name: "FAQ", href: "/faq", bullet: "text-cyan-500" },
  { name: "Contact", href: "/contact", bullet: "text-emerald-500" },
];

const socials = [
  { href: site.socials.facebook, label: "Facebook", Icon: FaFacebookF, tint: "from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700" },
  { href: site.socials.instagram, label: "Instagram", Icon: FaInstagram, tint: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: FaLinkedinIn, tint: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" },
];

const heading = "mb-4 bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-xl font-bold text-transparent";

export default function Footer() {
  return (
    <footer className="border-t-2 border-cyan-200 bg-white text-gray-800">
      <div className="container-x grid grid-cols-1 gap-10 py-12 md:grid-cols-3 md:gap-8">
        {/* Brand */}
        <div>
          <Image src="/images/logo.jpeg" alt="StartupHealer Logo" width={306} height={160} className="mb-4 h-20 w-auto" />
          <p className="mb-6 leading-relaxed text-gray-600">{site.shortAbout}</p>
          <div className="flex gap-4">
            {socials.map(({ href, label, Icon, tint }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`rounded-full bg-gradient-to-r p-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${tint}`}
              >
                <Icon aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className={heading}>Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group inline-flex items-center transition-colors duration-200 hover:text-cyan-600">
                  <span className={`mr-2 transition-transform duration-200 group-hover:translate-x-1 ${l.bullet}`} aria-hidden>
                    ›
                  </span>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={heading}>Contact Us</h3>
          <div className="mb-6 overflow-hidden rounded-lg border-2 border-cyan-200 shadow-md">
            <iframe
              title="StartupHealer Location"
              src={site.mapEmbed}
              className="block h-[180px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 text-gray-600">
            <FaPhoneAlt className="shrink-0 text-lg text-cyan-600" aria-hidden />
            <a href={site.phoneHref} className="font-medium transition-colors duration-200 hover:text-cyan-600">
              {site.phone}
            </a>
          </div>
          <div className="mb-4 flex items-center gap-3 text-gray-600">
            <FaEnvelope className="shrink-0 text-lg text-emerald-600" aria-hidden />
            <a href={`mailto:${site.email}`} className="break-all font-medium transition-colors duration-200 hover:text-cyan-600">
              {site.email}
            </a>
          </div>
          <div className="flex items-start gap-3 text-gray-600">
            <FaMapMarkerAlt className="mt-1 shrink-0 text-xl text-green-600" aria-hidden />
            <address className="not-italic leading-relaxed">{site.address.full}</address>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-200 bg-gradient-to-r from-cyan-50 via-emerald-50 to-green-50 py-4 text-center">
        <p className="px-4 text-sm text-gray-600">
          © <CurrentYear />{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text font-semibold text-transparent">StartupHealer</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
