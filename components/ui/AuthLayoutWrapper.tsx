"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface AuthLayoutWrapperProps {
  children: ReactNode;
  showBackButton?: boolean;
}

export default function AuthLayoutWrapper({
  children,
  showBackButton = true
}: AuthLayoutWrapperProps) {
  const router = useRouter();

  return (
    <div className="relative w-full h-full">
      {/* 👑 FIXED GLOBAL BACK BUTTON: Perfectly anchored at top-left across all screens */}
      {showBackButton && (
        <div className="fixed top-6 left-6 md:top-10 md:left-10 z-[9999]">
          <button
            onClick={() => router.back()}
            type="button"
            className="group inline-flex h-9 items-center gap-2 rounded-xl border border-slate-100 bg-white pl-2.5 pr-3.5 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-900 active:scale-95"
            title="Go back to previous page"
          >
            <ChevronLeft 
              size={15} 
              className="text-slate-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-slate-800" 
            />
            <span>Back</span>
          </button>
        </div>
      )}

      {children}
    </div>
  );
}