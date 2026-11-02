"use client";

import { FaDownload } from "react-icons/fa";
import { openLeadMagnet } from "@/components/LeadMagnetPopup";

export default function LeadMagnetButton({ className = "btn btn-primary", label = "Get the Free Checklist" }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={openLeadMagnet} className={className}>
      <FaDownload /> {label}
    </button>
  );
}
