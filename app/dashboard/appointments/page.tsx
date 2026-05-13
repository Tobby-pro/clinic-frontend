// app/dashboard/appointments/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Settings2, User, ArrowUpRight, Clock, UserCheck, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getAdminTodayAppointments } from "@/services/api"; 
import { useAppointmentDrawer } from "../../store/useAppointmentDrawer";
import dayjs from "dayjs";

function AppointmentsContent() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppts, setFilteredAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const openDrawer = useAppointmentDrawer((state) => state.openDrawer);

  useEffect(() => {
    getAdminTodayAppointments().then(data => {
      const appts = data || [];
      // Formatting to ensure patient_id is present for routing
      const formatted = appts.map((appt: any) => ({
        ...appt,
        patient_id: appt.patient_id || appt.patient?.id,
      }));
      setAppointments(formatted);
      setFilteredAppts(formatted);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = appointments;
    if (filter !== "all") result = result.filter(a => a.status?.toLowerCase() === filter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => (a.patient_name || "").toLowerCase().includes(term));
    }
    setFilteredAppts(result);
  }, [searchTerm, filter, appointments]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BOOKED": return "bg-blue-50 text-blue-600 border-blue-100";
      case "COMPLETED": return "bg-green-50 text-green-600 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-24 px-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Registry</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Clinical Master Ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/appointments/manage-slots" className="px-4 py-2.5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 transition-all flex items-center gap-2">
            <Settings2 size={18} className="text-blue-500" />
            <span className="text-[11px] font-black uppercase">Slots</span>
          </Link>
          <Link href="/dashboard/appointments/create" className="bg-[#ff7600] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-2">
            <Plus size={16} /> Create
          </Link>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input 
            type="text" 
            placeholder="Search patient registry..." 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none text-sm font-medium focus:bg-white focus:border-blue-100 transition-all" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["all", "booked", "completed", "cancelled"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout Stretched to Parent Width */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-20 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">
            Syncing Ledger...
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAppts.map((appt) => (
              <motion.div 
                layout 
                key={appt.id} 
                onClick={() => openDrawer(appt)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
              >
                {/* TIME SECTION - Consistent with Today's Schedule */}
                <div className="flex items-center gap-3 sm:flex-col sm:gap-0 sm:min-w-[80px]">
                  <Clock size={16} className="text-orange-500 md:hidden" />
                  <span className="text-sm font-bold text-gray-900">{appt.time}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Slot</span>
                </div>

                {/* PATIENT INFO - Clickable Name routes to details */}
                <div className="flex-1 border-l sm:border-l-0 sm:pl-0 pl-4 border-gray-100">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/dashboard/patient/${appt.patient_id}`}
                      onClick={(e) => e.stopPropagation()} // Prevents drawer from opening
                      className="group/name flex items-center gap-1.5"
                    >
                      <span className="font-black text-gray-800 text-base group-hover/name:text-[#ff7600] transition-colors ">
                        {appt.patient_name}
                      </span>
                      <ArrowUpRight size={14} className="text-gray-300 group-hover/name:text-[#ff7600] transition-all" />
                    </Link>
                    
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-black uppercase ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                      <UserCheck size={14} className="text-blue-500" />
                      <span>{appt.doctor_name}</span>
                    </div>
                    {appt.reason && (
                      <div className="hidden lg:flex items-center gap-1 text-orange-500 text-[11px] font-bold italic">
                        <MessageSquare size={12} />
                        <span className="truncate max-w-[200px]">"{appt.reason}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS - Profiles route directly */}
                <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                  <Link
                    href={`/dashboard/patient/${appt.patient_id}`}
                    onClick={(e) => e.stopPropagation()} // Prevents drawer from opening
                    className="p-2.5 bg-gray-50 group-hover:bg-orange-50 rounded-xl text-gray-400 group-hover:text-[#ff7600] transition-all"
                  >
                    <User size={18} />
                  </Link>
                  {/* Subtle indicator that card opens drawer */}
                  <div className="p-2.5 text-gray-200 group-hover:text-gray-400 transition-colors">
                    <Settings2 size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><AppointmentsContent /></Suspense>;
}