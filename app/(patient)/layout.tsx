// app/(patient)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import PatientSidebar from "@/components/dashboard/PatientSidebar";

export default function PatientSharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      {/* 1. SIDEBAR (Rendered once for all patient pages) */}
      <PatientSidebar />

      {/* 2. MAIN CONTENT AREA */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ 
          // This respects your Sidebar's CSS variables
          marginLeft: isMobile ? "0px" : "var(--sidebar-width, 80px)" 
        }}
      >
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-10 pt-20 md:pt-10 pb-32 md:pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}