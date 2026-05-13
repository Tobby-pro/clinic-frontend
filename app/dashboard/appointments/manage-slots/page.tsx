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
  AlertCircle,
  Stethoscope,
  ArrowRight,
  Database,
  Hash
} from "lucide-react";

// API services and Hooks
import { getDoctors, createSlots } from "@/services/api";
import useUser from "@/app/hooks/useUser";
import VerificationBadge from "@/components/dashboard/VerificationBadge";

interface Doctor {
  id: number;
  name: string;
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
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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
    setIsError(true);
    if (err?.detail) {
      const detail = err.detail;
      setMessage(typeof detail === "string" ? detail : JSON.stringify(detail));
    } else {
      setMessage(err?.message || "Something went wrong.");
    }
  };

  const handleAddSlot = () => {
    if (!slotTime || !day) return;
    const formatted = dayjs(`${day}T${slotTime}`).format("hh:mm A");
    if (slots.includes(formatted)) {
      setMessage("Time slot already exists.");
      setIsError(true);
      return;
    }
    setSlots((prev) => [...prev, formatted].sort((a, b) => {
      return dayjs(`2000-01-01 ${a}`).unix() - dayjs(`2000-01-01 ${b}`).unix();
    }));
    setSlotTime("");
    setMessage("");
    setIsError(false);
  };

  const handleRemoveSlot = (timeToRemove: string) => {
    setSlots((prev) => prev.filter((s) => s !== timeToRemove));
  };

  const handleSaveSlots = async () => {
    if (!selectedDoctor || !day || slots.length === 0) {
      setMessage("Incomplete availability data.");
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      const backendTimes = slots.map((s) => dayjs(`2000-01-01 ${s}`).format("HH:mm"));
      const res = await createSlots({
        doctor_id: selectedDoctor,
        date: day,
        times: backendTimes,
      });
      setMessage(res.message || "Availability published successfully!");
      setIsError(false);
      setSlots([]);
      setDay("");
      setSelectedDoctor(null);
    } catch (err: any) {
      handleUIError(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-100 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-300";

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
        <span className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Querying Registry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      
      {/* HEADER */}
      <header className="space-y-1 pt-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Manage Availability
        </h1>
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-50 rounded-md">
            <Database size={12} className="text-blue-500" />
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
                    ? "border-blue-200 bg-blue-50/30 shadow-sm" 
                    : "border-gray-100 bg-white hover:border-blue-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl border ${selectedDoctor === doc.id ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20" : "bg-gray-50 text-gray-300 border-gray-100"}`}>
                    <User size={18} strokeWidth={3} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-gray-900 tracking-tight">
                      {doc.name}
                    </p>
                    <VerificationBadge status={clinicStatus} type="inline" />
                  </div>
                </div>
                {selectedDoctor === doc.id && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
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
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
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
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
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
                      className="group flex items-center justify-between bg-gray-50 px-4 py-3 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all"
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

        {/* FEEDBACK MESSAGES */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center justify-center gap-3 p-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] border ${
                isError 
                  ? "bg-red-50 text-red-600 border-red-100" 
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }`}
            >
              {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="pt-12 flex flex-col items-center md:items-start opacity-40">
        <div className="flex items-center gap-2 mb-1">
          <Hash size={12} className="text-blue-500" />
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