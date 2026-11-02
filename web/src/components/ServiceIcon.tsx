import {
  FaRocket,
  FaIndustry,
  FaFileInvoiceDollar,
  FaCertificate,
  FaRegistered,
  FaHandHoldingUsd,
  FaLaptopCode,
  FaBullhorn,
} from "react-icons/fa";
import type { Service } from "@/data/services";

const map = {
  rocket: FaRocket,
  industry: FaIndustry,
  gst: FaFileInvoiceDollar,
  iso: FaCertificate,
  trademark: FaRegistered,
  funding: FaHandHoldingUsd,
  web: FaLaptopCode,
  marketing: FaBullhorn,
} as const;

export default function ServiceIcon({ icon, className }: { icon: Service["icon"]; className?: string }) {
  const Icon = map[icon];
  return <Icon className={className} aria-hidden />;
}
