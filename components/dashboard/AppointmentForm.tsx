// components/dashboard/AppointmentForm.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { getDoctors, getAvailableSlots, createAppointmentAdmin } from "@/services/api";
import useUser from "@/app/hooks/useUser";
import { 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Stethoscope,
  MessageSquare
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

export default function PatientBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedDocId = searchParams.get("doctorId");

  const { user } = useUser();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(
    preSelectedDocId ? parseInt(preSelectedDocId) : null
  );
  
  const [day, setDay] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState("");

  // ✅ NEW FIELDS (ADMIN ONLY)
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // 1. Fetch Doctors
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err: any) {
        handleUIError(err);
      }
    }
    fetchDoctors();
  }, []);

  // 2. Fetch Slots
  useEffect(() => {
    if (!selectedDoctor || !day) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      setMessage("");
      try {
        const data = await getAvailableSlots(selectedDoctor as number, day);
        const formattedSlots: Slot[] = (data.slots ?? []).map((slot: any) => ({
          id: slot.id,
          time: dayjs(slot.start).format("hh:mm A"),
          is_booked: slot.is_booked,
        }));
        setSlots(formattedSlots);
        setSelectedSlot(null);
      } catch (err: any) {
        handleUIError(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDoctor, day]);

  const handleUIError = (err: any) => {
    setIsError(true);
    const detail = err?.response?.data?.detail || err?.message || "An error occurred";
    setMessage(typeof detail === "string" ? detail : "Connection error");
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return setMessage("Please select a time window.");
    if (!patientName.trim()) return setMessage("Please enter patient name.");
    if (!patientPhone.trim()) return setMessage("Please enter patient phone.");
    if (!reason.trim()) return setMessage("Please provide a reason for your visit.");

    try {
      setLoadingSubmit(true);
      setMessage("");
      
      // ✅ SWITCHED TO ADMIN API
      await createAppointmentAdmin({
        slot_id: selectedSlot.id,
        patient_name: patientName,
        patient_phone: patientPhone,
        reason: reason,
      });

      setMessage("Appointment scheduled successfully!");
      setIsError(false);
      
      // ✅ FIXED REDIRECT (ADMIN)
      setTimeout(() => router.push("/dashboard/appointments"), 2000);
    } catch (err: any) {
      handleUIError(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const inputStyles = "w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-500/5 text-xs md:text-sm text-gray-800 transition-all outline-none placeholder:text-gray-400";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 px-4 md:px-0">
      
      <header className="flex flex-col gap-1.5 mt-4">
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
          Book Consultation
        </h1>
        <div className="flex items-center gap-2">
          <Stethoscope size={14} className="text-[#ff7600]" />
          <p className="text-[10px] md:text-[11px] text-gray-400 font-medium uppercase tracking-[0.15em]">
            Patient Portal • {user?.name || "Verified Patient"}
          </p>
        </div>
      </header>

      <div className="space-y-12">
        
        {/* STEP 1: DOCTOR */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
            <h2 className="font-medium text-gray-400 uppercase tracking-widest text-[10px]">
              01. Select Practitioner
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctor(doc.id)}
                className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                  selectedDoctor === doc.id 
                    ? "border-[#ff7600] bg-orange-50/30 shadow-sm" 
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${selectedDoctor === doc.id ? "bg-[#ff7600] text-white border-transparent" : "bg-gray-50 text-gray-400 border-gray-100"}`}>
                    <User size={16} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${selectedDoctor === doc.id ? "text-gray-900" : "text-gray-600"}`}>
                      Dr. {doc.name.split(' ').pop()}
                    </p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Medical Staff</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* STEP 2: DATE */}
        {selectedDoctor && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
              <h2 className="font-medium text-gray-400 uppercase tracking-widest text-[10px]">
                02. Choose Date
              </h2>
            </div>
            <div className="max-w-xs">
              <input
                type="date"
                value={day}
                min={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => setDay(e.target.value)}
                className={inputStyles}
              />
            </div>
          </motion.section>
        )}

        {/* STEP 3: SLOTS */}
        {day && (
          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
              <h2 className="font-medium text-gray-400 uppercase tracking-widest text-[10px]">
                03. Available Windows
              </h2>
            </div>

            {loadingSlots ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-[#ff7600] rounded-full animate-spin" />
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Checking Registry...</span>
              </div>
            ) : slots.length === 0 ? (
              <div className="p-8 bg-gray-50/50 rounded-[1.5rem] border border-dashed border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">No slots found for this date</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.is_booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl border transition-all text-[11px] font-semibold tracking-tight ${
                      selectedSlot?.id === slot.id
                        ? "bg-gray-900 border-gray-900 text-white shadow-lg"
                        : slot.is_booked
                        ? "bg-gray-50 border-gray-50 text-gray-200 cursor-not-allowed"
                        : "border-gray-100 bg-white hover:border-[#ff7600] text-gray-600"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* STEP 4: REASON & SUBMIT */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                <h2 className="font-medium text-gray-400 uppercase tracking-widest text-[10px]">
                  04. Visit Details
                </h2>
              </div>

              <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">

                {/* ✅ NEW INPUTS */}
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={inputStyles}
                />

                <input
                  type="tel"
                  placeholder="Patient Phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className={inputStyles}
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 ml-1">
                    <MessageSquare size={14} className="text-[#ff7600]" />
                    <label className="text-[11px] font-medium text-gray-600 uppercase tracking-wider">Reason for Appointment</label>
                  </div>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms or reason for the checkup..."
                    className={`${inputStyles} resize-none`}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={loadingSubmit}
                  className="w-full py-4 bg-[#ff7600] text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2.5"
                >
                  {loadingSubmit ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* FEEDBACK */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl text-[11px] font-medium uppercase tracking-wider ${
                isError 
                  ? "bg-red-50 text-red-500 border border-red-100" 
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              <span>{message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="pt-8 flex flex-col items-center md:items-start border-t border-gray-50">
        <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest underline decoration-[#ff7600]/30 underline-offset-4">
          Health Registry Protocol
        </span>
        <span className="text-[10px] text-gray-400 mt-1">
          Patient Self-Service Portal
        </span>
      </footer>
    </div>
  );
}