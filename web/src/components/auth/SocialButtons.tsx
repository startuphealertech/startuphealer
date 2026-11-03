"use client";

import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function SocialButtons() {
  const [note, setNote] = useState("");
  return (
    <div>
      <div className="grid gap-4">
        <button type="button" onClick={() => setNote("Google login coming soon!")} className="btn w-full justify-start !rounded-xl border-2 border-cyan-100 bg-white/95 !py-4 text-sm text-slate-700 shadow-md hover:border-cyan-300 hover:shadow-lg">
          <FaGoogle className="text-red-500" /> Continue with Google
        </button>
        <button type="button" onClick={() => setNote("LinkedIn login coming soon!")} className="btn w-full justify-start !rounded-xl border-2 border-cyan-100 bg-white/95 !py-4 text-sm text-slate-700 shadow-md hover:border-cyan-300 hover:shadow-lg">
          <FaLinkedinIn className="text-[#0077B5]" /> Continue with LinkedIn
        </button>
      </div>
      {note && <p className="mt-3 text-center text-sm text-amber-600" role="status">{note}</p>}
    </div>
  );
}
