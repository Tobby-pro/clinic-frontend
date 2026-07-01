"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { 
  Clock, 
  Calendar, 
  User, 
  Plus, 
  X, 
  CheckCircle2, 
  Database,
  Hash
} from "lucide-react";
import toast from "react-hot-toast";

// API services and Hooks
import { getDoctors, createSlots } from "@/services/api";
import useUser from "@/app/hooks/useUser";
import VerificationBadge from "@/components/dashboard/VerificationBadge";

interface Doctor {
  id: number;
  name: string;
}

// Shared Premium Toast Styling Configuration
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
  duration: 5000, // 👈 Kept active for 5 seconds so users can comfortably read it
};

/* ========================================================================= */
/* ✨ BRAND SYNCED GEOMETRIC LOADER COMPONENT                              */
/* ========================================================================= */
function RegistryLoader({ text = "Querying Registry..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 bg-[#ff7600]/10 blur-2xl rounded-full animate-pulse scale-110" />
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#ff7600] animate-spin" />
        <div className="relative w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 z-10">
          <svg width="36" height="36" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ff7600">
              <rect x="213.5" y="213.5" width="73" height="73" />
              <path d="M213.5 201.5h73v-51l-36.5-27-36.5 27v51z" />
              <path d="M299.5 213.5v73h51l27-36.5-27-36.5h-51z" />
              <path d="M286.5 299.5h-73v51l36.5 27 36.5-27v-51z" />
              <path d="M201.5 286.5v-73h-51l-27 36.5 27 36.5h51z" />
            </g>
          </svg>
        </div>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse pl-[0.3em]">
        {text}
      </p>
    </div>
  );
}

export default function ManageSlotsPage() {
  const { user } = useUser() as any;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [day, setDay] = useState<string>("");
  const [slotTime, setSlotTime] = useState<string>("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const clinicStatus = user?.clinic?.status || user?.clinic_status || "pending";

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setFetching(true);
        const data = await getDoctors();
        setDoctors(data);
      } catch (err: any) {
        handleUIError(err);
      } finally {
        setFetching(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleUIError = (err: any) => {
    let errorMsg = "Something went wrong.";
    if (err?.detail) {
      errorMsg = typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail);
    } else if (err?.message) {
      errorMsg = err.message;
    }
    toast.dismiss();
    toast.error(errorMsg, TOAST_STYLE_CONFIG);
  };

  const handleAddSlot = () => {
    if (!slotTime || !day) return;
    const formatted = dayjs(`${day}T${slotTime}`).format("hh:mm A");
    
    if (slots.includes(formatted)) {
      toast.dismiss();
      toast.error("Time slot already exists.", TOAST_STYLE_CONFIG);
      return;
    }
    
    setSlots((prev) => [...prev, formatted].sort((a, b) => {
      return dayjs(`2000-01-01 ${a}`).unix() - dayjs(`2000-01-01 ${b}`).unix();
    }));
    setSlotTime("");
  };

  const handleRemoveSlot = (timeToRemove: string) => {
    setSlots((prev) => prev.filter((s) => s !== timeToRemove));
  };

  const handleSaveSlots = async () => {
    if (!selectedDoctor || !day || slots.length === 0) {
      toast.dismiss();
      toast.error("Incomplete availability data.", TOAST_STYLE_CONFIG);
      return;
    }
    
    try {
      setLoading(true);
      const backendTimes = slots.map((s) => dayjs(`2000-01-01 ${s}`).format("HH:mm"));
      
      toast.dismiss();
      const res = await createSlots({
        doctor_id: selectedDoctor,
        date: day,
        times: backendTimes,
      });
      
      toast.success(res.message || "Availability published successfully! 🚀", {
        ...TOAST_STYLE_CONFIG,
        iconTheme: { primary: '#ff7600', secondary: '#fff' }
      });
      
      setSlots([]);
      setDay("");
      setSelectedDoctor(null);
    } catch (err: any) {
      handleUIError(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-200 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300";

  if (fetching) {
    return <RegistryLoader text="Querying Registry..." />;
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      
      {/* HEADER */}
      <header className="space-y-1 pt-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Manage Availability
        </h1>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-orange-50 rounded-md">
            <Database size={12} className="text-[#ff7600]" />
          </div>
          <p className="text-[10px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">
            Time-Slot Ledger / Clinic Operations
          </p>
        </div>
      </header>

      <div className="space-y-12">
        
        {/* SECTION 1: PRACTITIONER */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="flex-none bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded">01</span>
            <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
              Select Practitioner
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                className={`p-5 rounded-[2rem] border transition-all text-left flex items-center justify-between group ${
                  selectedDoctor === doc.id 
                    ? "border-orange-200 bg-orange-50/10 shadow-sm" 
                    : "border-gray-100 bg-white hover:border-orange-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border transition-colors ${selectedDoctor === doc.id ? "bg-[#ff7600] text-white border-transparent shadow-lg shadow-orange-500/20" : "bg-gray-50 text-gray-300 border-gray-100"}`}>
                    <User size={18} strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-gray-900 tracking-tight">
                      {doc.name}
                    </p>
                    <VerificationBadge status={clinicStatus} type="inline" />
                  </div>
                </div>
                {selectedDoctor === doc.id && <div className="w-2 h-2 rounded-full bg-[#ff7600] animate-pulse" />}
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 2 & 3: DATE AND TIME */}
        <AnimatePresence>
          {selectedDoctor && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* DATE */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="flex-none bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded">02</span>
                  <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                    Configure Date
                  </h2>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff7600]" size={18} />
                    <input
                      type="date"
                      value={day}
                      min={dayjs().format("YYYY-MM-DD")}
                      onChange={(e) => setDay(e.target.value)}
                      className={`${inputStyles} pl-12`}
                    />
                  </div>
                </div>
              </div>

              {/* TIME */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="flex-none bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded">03</span>
                  <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                    Assign Slots
                  </h2>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex gap-3">
                  <div className="relative flex-1">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff7600]" size={18} />
                    <input
                      type="time"
                      value={slotTime}
                      disabled={!day}
                      onChange={(e) => setSlotTime(e.target.value)}
                      className={`${inputStyles} pl-12`}
                    />
                  </div>
                  <button
                    onClick={handleAddSlot}
                    disabled={!slotTime}
                    className="w-14 flex items-center justify-center bg-gray-900 text-white rounded-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-10"
                  >
                    <Plus size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLOT PREVIEW AREA */}
        <AnimatePresence>
          {slots.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="flex-none bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded">04</span>
                <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
                  Verification & Publishing
                </h2>
                <div className="h-[1px] flex-1 bg-gray-100" />
              </div>

              <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((s) => (
                    <motion.div
                      key={s}
                      layout
                      className="group flex items-center justify-between bg-gray-50 px-4 py-3 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-white transition-all"
                    >
                      <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">{s}</span>
                      <button 
                        onClick={() => handleRemoveSlot(s)}
                        className="p-1 hover:bg-red-50 rounded-lg text-gray-300 hover:text-red-500 transition-all"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={handleSaveSlots}
                  disabled={loading}
                  className="w-full py-5 bg-[#ff7600] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 hover:bg-black active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Publish to Portal</span>
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <footer className="pt-12 flex flex-col items-center md:items-start opacity-40">
        <div className="flex items-center gap-2 mb-1">
          <Hash size={12} className="text-[#ff7600]" />
          <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">
            Registry-Auth v4.2
          </span>
        </div>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          Synchronizing with Clinic Master Schedule
        </span>
      </footer>
    </div>
  );
}