// components/ui/AuthLayoutWrapper.tsx

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

      {/* GLOBAL BACK BUTTON */}
      {showBackButton && (
        <button
          onClick={() => router.back()}

          /*
            🔥 FIX:
            changed z-50
            TO z-[9999]

            so button stays ABOVE everything
          */

          className="absolute left-6 top-6 p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200/60 rounded-xl transition-all flex items-center justify-center shadow-sm hover:shadow active:scale-95 z-[9999] group"

          title="Go back to previous page"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
      )}

      {children}

    </div>
  );
}