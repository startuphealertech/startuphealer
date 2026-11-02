"use client";

import { FaFilePdf } from "react-icons/fa";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-outline">
      <FaFilePdf /> Download / Save as PDF
    </button>
  );
}
