"use client";

import Link from "next/link";
import { CreditCard, ChevronRight } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import useUser from "@/app/hooks/useUser";

export default function Header() {
  const { user } = useUser() as any;

  // Determine the correct billing path based on role
  const billingPath = user?.role === "ADMIN" ? "/dashboard/billing" : "/patient/billing";

  return (
    <header className="flex h-16 border-b bg-white/90 backdrop-blur-xl px-4 md:px-6 items-center justify-between fixed top-0 left-0 right-0 md:left-[var(--sidebar-width)] z-[100] transition-all duration-300">
      
      {/* LEFT SIDE: Identity & Branding */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Logo Branding - Visible only on mobile */}
        <div className="md:hidden flex items-center">
           <div className="w-8 h-8 bg-[#ff7600] rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-black text-sm">C</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <h2 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {user?.role === "ADMIN" ? "Registry" : "Patient Portal"}
          </h2>
          
          {/* Desktop Only Billing Pill */}
          <Link 
            href={billingPath}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
          >
            <CreditCard size={13} className="text-gray-400 group-hover:text-[#ff7600]" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-[#ff7600]">
              {user?.subscription_tier || "Manage"}
            </span>
            <ChevronRight size={10} className="text-gray-300 group-hover:text-[#ff7600]" />
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE: Notifications & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* FORCE VISIBILITY */}
        <div className="block relative z-[110]">
          <NotificationBell />
        </div>
        
        {/* User Profile Section */}
        <div className="flex items-center gap-2 md:gap-3 md:border-l md:pl-6 border-gray-100">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] md:text-xs font-black text-gray-900 uppercase tracking-tight">
              {user?.name?.split(' ')[0] || "User"}
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500" />
              <span className="text-[8px] md:text-[9px] font-bold text-[#ff7600] uppercase tracking-tighter">
                {user?.role || "Member"}
              </span>
            </div>
          </div>
          
          <Link href={user?.role === "ADMIN" ? "/dashboard/settings" : "/patient/dashboard/settings"}>
            <div className="h-8 w-8 md:h-9 md:w-9 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-[#ff7600] font-black text-xs border border-orange-200 hover:shadow-md transition-all active:scale-95">
              {user?.name?.[0] || "U"}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}