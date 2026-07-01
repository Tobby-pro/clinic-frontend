"use client";

import { useEffect } from "react";
import { Plus, CalendarDays, Search, ArrowUpRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useUser from "@/app/hooks/useUser";

import StatsCards from "./StatsCards"; 
import UpcomingAppointment from "./UpcomingAppointment";
import ClinicsPreview from "./ClinicsPreview";

// 🎨 SHARED PREMIUM TOAST CONFIG
const TOAST_STYLE_CONFIG = {
  style: {
    minWidth: '280px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 'bold',
    background: '#ffffff',
    color: '#1e293b',
    border: '1px solid #f1f5f9',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)'
  },
  iconTheme: {
    primary: '#ff7600',
    secondary: '#fff',
  },
  duration: 4000,
};

export default function PatientDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const userName = user?.name ? user.name.split(" ")[0] : "Patient";

  // ✨ MULTI-FLOW TOAST LISTENER
  useEffect(() => {
    const isBooked = searchParams.get("booked") === "true";
    const isActivated = searchParams.get("activated") === "true";

    if (isBooked) {
      toast.success("Appointment secured successfully! Pending validation. ⏳", TOAST_STYLE_CONFIG);
      cleanUrlQuery();
    } else if (isActivated) {
      toast.success("Identity authenticated! Portal access granted. 🔐", TOAST_STYLE_CONFIG);
      cleanUrlQuery();
    }
  }, [searchParams]);

  // Helper to cleanly strip query params without refreshing or breaking state
  const cleanUrlQuery = () => {
    const newUrl = window.location.pathname;
    window.history.replaceState({ path: newUrl }, "", newUrl);
  };

  return (
    <div className="w-full space-y-8 md:space-y-10">
      
      {/* 1. HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff7600] shadow-[0_0_8px_rgba(255,118,0,0.4)]" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em]">
              Patient Portal
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {userLoading ? "..." : `Hello, ${userName}.`}
          </h1>
          <p className="text-gray-500 font-normal text-xs md:text-sm leading-relaxed">
            Your health records and clinic visits are up to date.
          </p>
        </div>

        <Link href="/patient/explore" className="w-full md:w-fit">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#ff7600] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2.5 w-full md:w-fit justify-center transition-all text-sm"
          >
            <Plus size={18} strokeWidth={3}/>
            <span>Book Appointment</span>
          </motion.button>
        </Link>
      </header>

      {/* 2. STATS GRID */}
      <section className="w-full">
        <StatsCards />
      </section>

      {/* 3. MAIN CONTENT GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <CalendarDays className="text-[#ff7600]" size={14} />
                Next Appointment
              </h2>
              
              <Link 
                href="/patient/dashboard/appointments" 
                className="text-[10px] font-bold text-[#ff7600] uppercase tracking-widest inline-flex items-center gap-1 hover:underline"
              >
                <span>See All</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <UpcomingAppointment />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Search className="text-[#ff7600]" size={14} />
                Find a Clinic
              </h2>
            </div>
            <ClinicsPreview limit={3} />
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-gray-800 shadow-xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <HeartPulse size={16} className="text-[#ff7600]" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Health Profile</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Profile Status</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6">
                  Complete your history to help doctors understand you better.
                </p>
                
                <Link href="/patient/dashboard/settings" className="block w-full">
                  <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold transition-all border border-white/10 uppercase tracking-widest">
                    Update Profile
                  </button>
                </Link>
             </div>
          </div>
        </aside>
      </section>
    </div>
  );
}