"use client";

import { useEffect, useState } from "react";
import { getClinicSummary } from "@/services/api";
import TodayAppointments from "@/components/dashboard/TodayAppointments";
import QuickActions from "@/components/dashboard/QuickActions";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Users, 
  CalendarCheck, 
  Zap, 
  RefreshCcw, 
  AlertCircle, 
  ShieldCheck, 
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "@/app/hooks/useUser";
import Link from "next/link";
import Loader from "@/components/ui/Loader";

export default function DashboardPage() {
  const { user } = useUser() as any;
  const [stats, setStats] = useState({ 
    total_patients: 0, 
    today_appointments: 0, 
    wait_time: "..." 
  });
  
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const clinicStatus = currentStatus || user?.clinic?.status || user?.clinic_status || "PENDING";

  const fetchData = async () => {
    try {
      const data = await getClinicSummary();
      
      setStats({
        total_patients: data?.total_patients ?? 0,
        today_appointments: data?.today_appointments ?? 0,
        wait_time: data?.wait_time ?? "0 min",
      });

      if (data?.current_status) {
        setCurrentStatus(data.current_status);
      }
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return <Loader text="Establishing Secure Link..." />;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-24 px-4 md:px-0 font-sans">
      
      {/* 1. SOFT GATE BANNER */}
      <AnimatePresence>
        {(clinicStatus === "PENDING" || clinicStatus === "pending") && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-5 mb-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-[#ff7600] p-3 rounded-xl text-white shadow-lg shadow-orange-100">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tight">Sandbox Mode</h4>
                  <p className="text-[10px] text-gray-600 font-medium mt-0.5 leading-tight">
                    Verify <b>CAC / HEFAMAA</b> to enable online bookings.
                  </p>
                </div>
              </div>
              <Link href="/dashboard/verification" className="w-full md:w-auto">
                <button className="w-full md:w-auto px-6 py-3 bg-white border border-orange-100 text-[#ff7600] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ff7600] hover:text-white transition-all shadow-sm">
                  Verify Now
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header className="flex items-center justify-between gap-6 pt-2">
        <div className="space-y-0.5">
          <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">
            Overview
          </h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">
              {clinicStatus === "VERIFIED" ? "Verified Registry" : "Branch Ledger"}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="group p-3 md:px-6 md:py-3 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw
            size={14}
            className={`text-[#ff7600] ${refreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden md:inline ml-3 text-[10px] font-black text-gray-600 uppercase tracking-widest">Sync</span>
        </button>
      </header>

      {/* 2. REFINED ANALYTICS GRID - Sleeker on Mobile */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <StatCard 
            title="Registry" 
            value={(stats.total_patients ?? 0).toLocaleString()} 
            icon={<div className="p-1.5 bg-orange-50 rounded-lg"><Users size={16} className="text-[#ff7600]" /></div>}
            description="Active records"
            className="p-3 md:p-6" // Assuming your component accepts className
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard 
            title="Today" 
            value={(stats.today_appointments ?? 0).toString()} 
            icon={<div className="p-1.5 bg-orange-50 rounded-lg"><CalendarCheck size={16} className="text-[#ff7600]" /></div>}
            description="Check-ins"
            className="p-3 md:p-6"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="col-span-2 md:col-span-1" // Makes wait-time full width on mobile for balance
        >
          <StatCard 
            title="Latency" 
            value={stats.wait_time ?? "0 min"} 
            icon={<div className="p-1.5 bg-orange-50 rounded-lg"><Zap size={16} className="text-[#ff7600]" /></div>}
            description="Avg wait"
            className="p-3 md:p-6 flex flex-row items-center justify-between md:flex-col md:items-start" 
          />
        </motion.div>
      </section>

      {/* CORE INTERFACE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <span className="bg-gray-900 text-white text-[9px] font-black px-2 py-0.5 rounded">LIVE</span>
            <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[9px]">Daily Manifest</h2>
            <div className="h-[px] flex-1 bg-gray-100" />
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <TodayAppointments />
          </div>
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2 space-y-4">
          <div className="flex items-center gap-4 px-2">
            <span className="bg-[#ff7600] text-white text-[9px] font-black px-2 py-0.5 rounded">FAST</span>
            <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[9px]">Actions</h2>
            <div className="h-[px] flex-1 bg-gray-100" />
          </div>
          <QuickActions />
        </div>
      </section>

      {/* SYSTEM LOGS */}
      <footer className="pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            Status: 
            <span className="text-[#ff7600] flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md">
              <ShieldCheck size={10} /> {clinicStatus === "VERIFIED" ? "Verified" : "Secured"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Activity size={12} className="text-[#ff7600]" />
          Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </footer>
    </div>
  );
}