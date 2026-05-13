"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getAvailableSlots, createAppointment } from "@/services/api";
import { Clock, Calendar, Phone, CheckCircle, AlertCircle } from "lucide-react";

interface Slot {
  id: number;
  start: string;
  end: string;
}

export default function PatientSlotBooking() {
  const { doctorId } = useParams();
  const router = useRouter();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [day, setDay] = useState<string>(dayjs().format("YYYY-MM-DD"));

  const [patientName, setPatientName] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");

  const [loadingSlots, setLoadingSlots] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // FETCH AVAILABLE SLOTS
  useEffect(() => {
    if (!doctorId || !day) return;

    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const data = await getAvailableSlots(Number(doctorId), day);
        setSlots(data?.slots ?? []);
        setSelectedSlot(null);
      } catch (err: any) {
        console.error(err);
        setMessage("Failed to fetch slots");
        setIsError(true);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [doctorId, day]);

  // HANDLE BOOKING
  const handleBooking = async () => {
    if (!selectedSlot) return setMessage("Please select a time slot");
    if (!patientName.trim()) return setMessage("Enter patient name");
    if (!patientPhone.trim()) return setMessage("Enter patient phone");

    try {
      setBooking(true);
      setMessage("");

      await createAppointment({
        slot_id: selectedSlot.id,
        patient_name: patientName,
        patient_phone: patientPhone,
        reason: "General consultation",
      });

      // Redirect to confirmation page (must create this page)
      router.push(`/patient/appointments/confirmed?slot=${selectedSlot.id}`);
    } catch (err: any) {
      console.error("Booking error:", err);
      setMessage("Booking failed. Try again.");
      setIsError(true);
    } finally {
      setBooking(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

        {/* STEP 1: Select Date */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Calendar className="text-[#ff7600]" size={20} /> Select Date
          </h2>
          <input
            type="date"
            value={day}
            min={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => setDay(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ff7600]/20 outline-none font-medium text-sm sm:text-base"
          />
        </motion.div>

        {/* STEP 2: Select Slot */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Clock className="text-[#ff7600]" size={20} /> Select Time
          </h2>

          {loadingSlots ? (
            <p className="text-gray-400 text-sm">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => {
                const time = new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl border text-sm sm:text-base font-semibold transition ${
                      isSelected
                        ? "bg-[#ff7600] text-white border-[#ff7600]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#ff7600]"
                    }`}
                  >
                    {time}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* STEP 3: Patient Info */}
        {selectedSlot && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Phone className="text-[#ff7600]" size={20} /> Patient Details
            </h2>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter full name"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ff7600]/20 outline-none text-sm sm:text-base"
            />
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#ff7600]/20 outline-none text-sm sm:text-base"
            />
          </motion.div>
        )}

        {/* CONFIRM BUTTON */}
        {selectedSlot && (
          <button
            onClick={handleBooking}
            disabled={booking}
            className={`w-full py-3 mt-4 rounded-xl font-semibold text-white transition ${
              booking ? "bg-gray-400" : "bg-[#ff7600] hover:bg-[#e56b00]"
            }`}
          >
            {booking ? "Booking..." : "Confirm Appointment"}
          </button>
        )}

        {/* MESSAGE */}
        {message && (
          <div className={`p-3 rounded-xl mt-4 flex items-center gap-2 text-sm ${isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
            {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {message}
          </div>
        )}
      </div>
    </section>
  );
}