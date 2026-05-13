"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "@/services/api";
import useUser from "@/app/hooks/useUser"; 
import VerificationBadge from "@/components/dashboard/VerificationBadge"; 
import NotificationBell from "@/components/NotificationBell";

const adminNavItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Appts", href: "/dashboard/appointments", icon: Calendar },
  { name: "Doctors", href: "/dashboard/doctors", icon: Users },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard }, 
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser() as any; 
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayStatus = user?.verification_status ? String(user.verification_status).toUpperCase() : "PENDING";
  const userName = user?.name ? user.name.split(" ")[0] : "Admin";

  useEffect(() => {
    const syncSidebarWidth = () => {
      if (window.innerWidth >= 768) {
        const width = isHovered ? "256px" : "80px";
        document.documentElement.style.setProperty("--sidebar-width", width);
      } else {
        document.documentElement.style.setProperty("--sidebar-width", "0px");
      }
    };
    syncSidebarWidth();
    window.addEventListener("resize", syncSidebarWidth);
    return () => window.removeEventListener("resize", syncSidebarWidth);
  }, [isHovered]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await logoutUser(); 
      router.push("/admin/login"); 
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* --- MOBILE TOP BAR (Synced with Patient Sidebar) --- */}
      <header className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#ff7600] flex items-center justify-between px-5 z-[110] shadow-md">
        <div className="flex items-center gap-2.5">
          <Image 
            src="/images/clinbox_pro.png" 
            alt="Clinbox" 
            width={85} 
            height={22} 
            className="brightness-0 invert object-contain"
          />
          <span className="h-3 w-[1px] bg-white/30 ml-1" />
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[10px] uppercase tracking-widest opacity-90">
              {loading ? "..." : userName}
            </span>
            {!loading && <VerificationBadge status={displayStatus} type="inline" />}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="scale-90 brightness-0 invert">
            <NotificationBell />
          </div>
          <button 
            onClick={handleLogout} 
            className="text-white/90 active:scale-95 flex items-center justify-center"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around z-[100] px-2 pb-2">
        {adminNavItems.map((item) => (
          <Link key={item.name} href={item.href} className={`flex flex-col items-center flex-1 ${pathname === item.href ? "text-[#ff7600]" : "text-gray-400"}`}>
            <item.icon size={20} strokeWidth={pathname === item.href ? 2.5 : 2} />
            <span className="text-[9px] font-bold mt-1 uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* --- DESKTOP SIDEBAR (Synced with Patient Sidebar) --- */}
      <aside onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`hidden md:flex fixed top-0 left-0 z-40 h-screen flex-col bg-gradient-to-b from-[#ff7600] to-[#e56b00] text-white transition-all duration-300 ${isHovered ? "w-64" : "w-20"}`}>
        <div className="flex items-center h-20 px-5 border-b border-white/10 overflow-hidden shrink-0">
          <div className="min-w-[40px] flex justify-center">
             {!isHovered && <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ff7600] font-black text-xl rotate-3">C</div>}
          </div>
          {isHovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-2 flex flex-col">
              <Image src="/images/clinbox_pro.png" alt="Clinbox" width={110} height={30} className="brightness-0 invert" />
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-bold uppercase opacity-60">Admin Portal</span>
                {!loading && <VerificationBadge status={displayStatus} />}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex-1 py-8 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {adminNavItems.map((item) => (
            <Link key={item.name} href={item.href} className={`flex items-center h-12 rounded-xl transition-all ${pathname === item.href ? "bg-white text-[#ff7600] shadow-xl" : "hover:bg-white/10 text-white/80"}`}>
              <div className="min-w-[56px] flex justify-center"><item.icon size={22} /></div>
              {isHovered && <span className="text-sm font-semibold">{item.name}</span>}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <div className="min-w-[56px] flex justify-center"><LogOut size={22} /></div>
            {isHovered && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}