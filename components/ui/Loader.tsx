"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Syncing Ledger..." }: LoaderProps) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm z-[9999]">
      <div className="relative flex items-center justify-center">
        {/* The Glow effect */}
        <div className="absolute inset-0 bg-[#ff7600]/20 blur-2xl rounded-full animate-pulse" />
        {/* The Spinning Icon */}
        <Loader2 
          className="animate-spin text-[#ff7600] relative z-10" 
          size={48} 
          strokeWidth={3} 
        />
      </div>
      {/* The Styled Text */}
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}