"use client";

import { useState, useEffect } from "react";
import {
  Search,
  CalendarDays,
  ClipboardList,
  User,
  LogOut,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "@/services/api";
import NotificationBell from "@/components/NotificationBell";
import useUser from "@/app/hooks/useUser"; // ✅ Import the hook

const patientNavItems = [
  { name: "Home", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Appts", href: "/patient/explore/", icon: CalendarDays },
  { name: "Records", href: "/patient/records", icon: ClipboardList },
  { name: "Billing", href: "/patient/billing", icon: CreditCard }, 
  { name: "Profile", href: "/patient/dashboard/settings", icon: User },
];

export default function PatientSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Get user data from hook
  const { user, loading: userLoading } = useUser();
  const userName = user?.name ? user.name.split(" ")[0] : "Patient";

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
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
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
          
          {/* ✅ DYNAMIC NAME REPLACEMENT */}
          <span className="font-bold text-white text-[10px] uppercase tracking-widest opacity-90">
            {userLoading ? "..." : userName}
          </span>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around z-[100] px-2 pb-2">
        {patientNavItems.slice(0, 2).map((item) => (
          <Link key={item.name} href={item.href} className={`flex flex-col items-center flex-1 ${pathname === item.href ? "text-[#ff7600]" : "text-gray-400"}`}>
            <item.icon size={20} strokeWidth={pathname === item.href ? 2.5 : 2} />
            <span className="text-[9px] font-bold mt-1 uppercase">{item.name}</span>
          </Link>
        ))}
        <Link href="/patient/explore" className="relative -top-6 bg-[#ff7600] p-4 rounded-2xl text-white shadow-lg border-4 border-white"><Search size={24} strokeWidth={3} /></Link>
        {patientNavItems.slice(2).map((item) => (
          <Link key={item.name} href={item.href} className={`flex flex-col items-center flex-1 ${pathname === item.href ? "text-[#ff7600]" : "text-gray-400"}`}>
            <item.icon size={20} strokeWidth={pathname === item.href ? 2.5 : 2} />
            <span className="text-[9px] font-bold mt-1 uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={`hidden md:flex fixed top-0 left-0 z-40 h-screen flex-col bg-gradient-to-b from-[#ff7600] to-[#e56b00] text-white transition-all duration-300 ${isHovered ? "w-64" : "w-20"}`}>
        <div className="flex items-center h-20 px-5 border-b border-white/10 overflow-hidden shrink-0">
          <div className="min-w-[40px] flex justify-center">
             {!isHovered && <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ff7600] font-black text-xl rotate-3">C</div>}
          </div>
          {isHovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-2 flex flex-col">
              <Image src="/images/clinbox_pro.png" alt="Clinbox" width={110} height={30} className="brightness-0 invert" />
              <span className="text-[9px] font-bold uppercase opacity-60">Patient Portal</span>
            </motion.div>
          )}
        </div>

        <div className="flex-1 py-8 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {patientNavItems.map((item) => (
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