"use client";

import { useEffect, useState } from "react";
import { getAdminTodayAppointments } from "@/services/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Calendar, Clock, User, UserCheck, ArrowUpRight } from "lucide-react";

// ✅ ADDED patient_id TO INTERFACE
interface Appointment {
  id: number;
  patient_id: number; 
  status: string;
  reason?: string;
  patient_name: string;
  doctor_name: string;
  time: string;
  source: "admin" | "patient";
}

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const data = await getAdminTodayAppointments();

      // ✅ FIX: EXTRACT patient_id FROM THE DATA
      const formattedData: Appointment[] = data.map((appt: any) => ({
        id: appt.id,
        patient_id: appt.patient_id || appt.patient?.id, // Ensure we get the ID
        status: appt.status ?? "UNKNOWN",
        reason: appt.reason ?? "",
        patient_name: appt.patient_name ?? "Unknown Patient",
        doctor_name: appt.doctor_name ?? "Unknown Doctor",
        time: appt.time ?? "TBD",
        source: appt.source === "admin" ? "admin" : "patient",
      }));

      formattedData.sort((a, b) =>
        dayjs(a.time, "hh:mm A").unix() - dayjs(b.time, "hh:mm A").unix()
      );

      setAppointments(formattedData);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Unable to sync appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 20000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "BOOKED": return "bg-blue-50 text-blue-600 border-blue-100";
      case "COMPLETED": return "bg-green-50 text-green-600 border-green-100";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
          <p className="text-sm text-gray-500">{dayjs().format("MMMM D, YYYY")}</p>
        </div>
        <div className="bg-orange-50 text-[#ff7600] px-3 py-1 rounded-full text-xs font-bold">
          {appointments.length} TOTAL
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 md:p-6">
        {loading && appointments.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <Calendar className="text-gray-200 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No appointments for today.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {appointments.map((appt) => (
                <motion.div
                  layout
                  key={appt.id}
                  className="group relative bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* TIME SECTION */}
                  <div className="flex items-center gap-3 sm:flex-col sm:gap-0 sm:min-w-[80px]">
                    <Clock size={16} className="text-orange-500 md:hidden" />
                    <span className="text-sm font-bold text-gray-900">{appt.time}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Slot</span>
                  </div>

                  {/* PATIENT INFO - NOW CLICKABLE */}
                  <div className="flex-1 border-l sm:border-l-0 sm:pl-0 pl-4 border-gray-100">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/dashboard/patient/${appt.patient_id}`}
                        className="group/name flex items-center gap-1.5"
                      >
                        <span className="font-black text-gray-800 text-base group-hover/name:text-[#ff7600] transition-colors">
                          {appt.patient_name}
                        </span>
                        <ArrowUpRight size={14} className="text-gray-300 group-hover/name:text-[#ff7600] transition-all" />
                      </Link>
                      
                      <span className={`text-[10px] px-2 py-0.5 rounded-md border font-black ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <UserCheck size={14} className="text-blue-500" />
                        <span>{appt.doctor_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                    {appt.reason && (
                      <span className="hidden lg:inline text-[11px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md italic truncate max-w-[120px]">
                        "{appt.reason}"
                      </span>
                    )}
                    <Link
                      href={`/dashboard/patient/${appt.patient_id}`}
                      className="p-2.5 bg-gray-50 group-hover:bg-orange-50 rounded-xl text-gray-400 group-hover:text-[#ff7600] transition-all"
                    >
                      <User size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {error && <div className="p-4 text-center text-red-500 text-sm font-medium">{error}</div>}
    </div>
  );
}