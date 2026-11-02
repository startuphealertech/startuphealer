"use client";

import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function SocialButtons() {
  const [note, setNote] = useState("");
  return (
    <div>
      <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400">
        <span className="h-px flex-1 bg-slate-200" /> OR <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setNote("Google login coming soon!")} className="btn border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50">
          <FaGoogle className="text-red-500" /> Google
        </button>
        <button type="button" onClick={() => setNote("LinkedIn login coming soon!")} className="btn border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50">
          <FaLinkedinIn className="text-[#0077B5]" /> LinkedIn
        </button>
      </div>
      {note && <p className="mt-3 text-center text-sm text-amber-600" role="status">{note}</p>}
    </div>
  );
}
