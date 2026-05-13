// components/dashboard/VerificationBadge.tsx

import { ShieldAlert, Info } from "lucide-react";

interface VerificationBadgeProps {
  status: string;
  type?: "badge" | "inline";
}

export default function VerificationBadge({ status, type = "badge" }: VerificationBadgeProps) {
  // 🔥 THE FIX: Normalize to lowercase for the check so "VERIFIED" or "verified" both work
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "verified") return null;

  if (type === "inline") {
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-blue-500 font-bold uppercase tracking-tighter bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-100/50">
        <ShieldAlert size={10} />
        <span>Internal Use Only</span>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter cursor-help transition-all hover:bg-blue-600 hover:text-white">
        <Info size={10} />
        <span>Not Public</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48 bg-gray-900 text-white text-[10px] p-3 rounded-xl shadow-xl z-50 normal-case font-medium leading-relaxed">
        Verification is pending. This data is active in your dashboard but hidden from the patient booking portal.
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}