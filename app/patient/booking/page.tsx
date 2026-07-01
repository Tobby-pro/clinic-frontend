"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { getDoctors, getDoctorsByClinic, getAvailableSlots, createAppointment } from "@/services/api";
import useUser from "@/app/hooks/useUser";
import { 
  User, 
  ArrowRight,
  MessageSquare,
  ChevronLeft,
  Calendar
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
}

interface Slot {
  id: number;
  time: string;
  is_booked: boolean;
}

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlClinicId = searchParams.get("clinicId");
  const preSelectedDocId = searchParams.get("doctorId");

  const { user } = useUser();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  // Auto-select doctor from URL
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(
    preSelectedDocId ? parseInt(preSelectedDocId) : null
  );
  
  const [day, setDay] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        let data;
        const targetClinicId = urlClinicId || user?.clinic_id;
        if (targetClinicId) {
          data = await getDoctorsByClinic(Number(targetClinicId));
        } else {
          data = await getDoctors();
        }
        setDoctors(data || []);
      } catch (err: any) {
        const detail = err?.response?.data?.detail || err?.message || "Failed to sync roster.";
        toast.error(typeof detail === "string" ? detail : "Connection error");
      }
    }
    if (user || urlClinicId) fetchDoctors();
  }, [user, urlClinicId]);

  // Cleanly sanitized date token logic targeting the correct endpoint schema
  useEffect(() => {
    if (!selectedDoctor || !day) return;
    
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const targetedDayString = dayjs(day).format("YYYY-MM-DD");
        const data = await getAvailableSlots(selectedDoctor as number, targetedDayString);
        
        const formattedSlots: Slot[] = (data.slots ?? []).map((slot: any) => {
          const displayedTime = slot.formatted?.time 
            ? slot.formatted.time 
            : slot.start 
              ? dayjs(slot.start).format("hh:mm A") 
              : "Session Window";

          return {
            id: slot.id,
            time: displayedTime,
            is_booked: slot.is_booked ?? !(slot.isAvailable ?? slot.is_available ?? true),
          };
        });
        
        setSlots(formattedSlots);
        setSelectedSlot(null);
      } catch (err: any) {
        const detail = err?.response?.data?.detail || err?.message || "Failed to load slots.";
        toast.error(typeof detail === "string" ? detail : "Connection error");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDoctor, day]);

  const handleSubmit = async () => {
    if (!selectedSlot) return toast.error("Please select a time window.");
    if (!reason.trim()) return toast.error("Please state your reason for visit.");

    setLoadingSubmit(true);

    // Using react-hot-toast promises for sleek asynchronous status states
    toast.promise(
      createAppointment({
        slot_id: selectedSlot.id,
        reason: reason.trim(),
      }),
      {
        loading: "Securing your appointment confirmation...",
        success: () => {
          setLoadingSubmit(false);
          // Seamless non-blocking reroute sequence
          setTimeout(() => router.push("/patient/dashboard"), 1000);
          return "Appointment Booked Successfully! 🎉";
        },
        error: (err: any) => {
          setLoadingSubmit(false);
          const detail = err?.response?.data?.detail || err?.message || "An error occurred";
          return typeof detail === "string" ? detail : "Booking failed";
        }
      },
      {
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
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#ff7600',
            secondary: '#fff',
          },
        }
      }
    );
  };

  const inputStyles = "w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-500/5 text-sm text-gray-800 transition-all outline-none placeholder:text-gray-400 font-medium";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 px-4 md:px-0">
      <header className="flex flex-col gap-4 mt-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#ff7600] transition-colors w-fit"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Complete Booking</h1>
          <p className="text-sm text-gray-500 mt-1">Provide visit details to confirm your appointment.</p>
        </div>
      </header>

      <div className="space-y-12">
        {/* STEP 1: DOCTOR */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
            <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">1</span>
            <h2 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Medical Professional</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                  selectedDoctor === doc.id 
                    ? "border-[#ff7600] bg-orange-50/30 shadow-sm" 
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className={`p-2.5 rounded-xl border transition-colors ${selectedDoctor === doc.id ? "bg-[#ff7600] text-white border-transparent" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Dr. {doc.name.split(' ').pop()}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Medical Staff</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 2: DATE */}
        {selectedDoctor && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <h2 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Pick a Date</h2>
            </div>
            <div className="max-w-xs relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7600] transition-colors" size={16} />
              <input
                type="date"
                value={day}
                min={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => setDay(e.target.value)}
                className={`${inputStyles} pl-12`}
              />
            </div>
          </motion.section>
        )}

        {/* STEP 3: TIME SLOTS */}
        {day && selectedDoctor && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <h2 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Available Time</h2>
            </div>
            {loadingSlots ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-4 h-4 border-2 border-[#ff7600]/20 border-t-[#ff7600] rounded-full animate-spin" />
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Checking Slots...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.is_booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-4 rounded-xl border text-[11px] font-bold transition-all ${
                      selectedSlot?.id === slot.id ? "bg-gray-900 text-white border-gray-900" : 
                      slot.is_booked ? "bg-gray-50 text-gray-200 border-transparent cursor-not-allowed" : 
                      "bg-white border-gray-100 text-gray-600 hover:border-[#ff7600] hover:text-[#ff7600]"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* STEP 4: REASON & CONFIRM */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                <h2 className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Visit Reason</h2>
              </div>
              <div className="bg-white border border-gray-100 p-6 md:p-10 rounded-[2.5rem] shadow-sm space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <MessageSquare size={14} className="text-[#ff7600]" />
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Symptoms or Reason</label>
                  </div>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe why you are visiting..."
                    className={`${inputStyles} resize-none`}
                  />
                </div>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                  className="w-full py-5 bg-[#ff7600] text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loadingSubmit ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm Appointment</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PatientBookingForm() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-400 animate-pulse">Syncing Clinical Registry...</div>}>
      <BookingFormContent />
    </Suspense>
  );
}