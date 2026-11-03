import {
  FaCertificate,
  FaBuilding,
  FaFileInvoice,
  FaAward,
  FaTrademark,
  FaHandHoldingUsd,
  FaGlobe,
  FaBullhorn,
} from "react-icons/fa";
import type { Service } from "@/data/services";

// Icons match startuphealer.com (verified against the reference site's SVG paths).
const map = {
  rocket: FaCertificate, // Startup India Certificate
  industry: FaBuilding, // MSME Certificate
  gst: FaFileInvoice, // GST Registration
  iso: FaAward, // ISO 9001:2015 Certification
  trademark: FaTrademark, // Trademark & Company Registration
  funding: FaHandHoldingUsd, // Funding & Investment
  web: FaGlobe, // Web Designing
  marketing: FaBullhorn, // Digital Marketing
} as const;

export default function ServiceIcon({ icon, className }: { icon: Service["icon"]; className?: string }) {
  const Icon = map[icon];
  return <Icon className={className} aria-hidden />;
}
