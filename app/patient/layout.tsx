// app/patient/dashboard/layout.tsx
"use client";

import PatientSidebar from "@/components/dashboard/PatientSidebar";
import Header from "@/components/dashboard/Header";
import GlobalAppointmentDrawer from "@/components/GlobalAppointmentDrawer";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      
      {/* ✅ GLOBAL SIDEBAR (handles mobile + desktop internally) */}
      <PatientSidebar />

      {/* ✅ MAIN WRAPPER */}
      <div
        className="
          flex-1
          flex flex-col
          transition-all
          w-full
        "
        style={{
          marginLeft: "var(--sidebar-width-mobile, 0px)", 
        }}
      >
        {/* WRAPPER FOR DESKTOP SPACING */}
        <div className="md:ml-[var(--sidebar-width,80px)] transition-all flex flex-col min-h-screen">
          
          {/* ✅ HEADER SECTION */}
          <div className="hidden md:block">
            <Header />
          </div>

          {/* ✅ MAIN CONTENT 
              ADJUSTED: Added pt-14 for mobile and pt-16 for desktop 
              to offset the fixed headers so content isn't covered.
          */}
          <main
            className="
              flex-1
              pt-14 md:pt-16   /* Space for Fixed Top Bars */
              pb-24 md:pb-8   /* Space for Mobile Nav + Bottom padding */
              w-full
            "
          >
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* 🚀 GLOBAL DRAWER: This handles the drawer UI for the patient role */}
      <GlobalAppointmentDrawer />
    </div>
  );
}