"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import GlobalAppointmentDrawer from "@/components/GlobalAppointmentDrawer";
// 🚨 ADD THIS IMPORT RIGHT HERE:
import QuickActionDrawerContainer from "@/components/dashboard/QuickActionDrawerContainer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we are on mobile to disable the margin shift
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar />

      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: isMobile ? "0px" : "var(--sidebar-width, 80px)" 
        }}
      >
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-20 md:pt-16 pb-28 md:pb-10 transition-all">
          <div className="w-full h-full py-6 md:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* 🚀 GLOBAL DRAWERS SECTION */}
      {/* This handles looking up existing appointment details */}
      <GlobalAppointmentDrawer />
      
      {/* 🎯 ADD THIS: This handles creating NEW things from your Quick Actions grid */}
      <QuickActionDrawerContainer />
    </div>
  );
}