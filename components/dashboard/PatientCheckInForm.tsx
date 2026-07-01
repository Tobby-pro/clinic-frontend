"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getAdminTodayAppointments, updateAppointmentStatus } from "@/services/api";

interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  time: string;
  status: string;
}

export default function PatientCheckInForm() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Load today's active schedule array
  useEffect(() => {
    async function fetchSchedule() {
      try {
        const data = await getAdminTodayAppointments();
        setAppointments(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load manifest records");
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, []);

  // Filter list down instantly based on name or phone matches
  const filteredAppointments = appointments.filter((appt) =>
    appt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckIn = async (id: number) => {
    setActionId(id);
    setError("");
    try {
      // 🚀 Fires your PATCH endpoint contract directly
      await updateAppointmentStatus(id, "checked_in");
      
      // Update local state arrays cleanly so UI reflects the match instantly
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? { ...appt, status: "checked_in" } : appt))
      );
    } catch (err: any) {
      setError(err.message || "Could not process check-in status modification");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Patient Check-In
        </h1>
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          Daily Desk Intake Registry
        </p>
      </header>

      {/* SEARCH HOOK */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-500/5 text-xs md:text-sm text-gray-800 transition-all outline-none placeholder:text-gray-400"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-[11px] font-medium uppercase">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* LIST MANIFEST */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-[#ff7600] rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Reading Daily Register...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">No matching active records found</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-gray-200/80"
            >
              <div className="min-w-0 space-y-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">{appt.patient_name}</h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="font-semibold text-gray-600">{appt.time}</span>
                  <span>•</span>
                  <span className="truncate">Dr. {appt.doctor_name}</span>
                </div>
              </div>

              {appt.status === "checked_in" ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-100 rounded-xl text-[10px] font-bold uppercase tracking-tight">
                  <CheckCircle size={12} />
                  In Queue
                </div>
              ) : (
                <button
                  disabled={actionId === appt.id}
                  onClick={() => handleCheckIn(appt.id)}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-[#ff7600] text-white text-[10px] font-bold uppercase tracking-tight rounded-xl transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionId === appt.id ? (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Clock size={12} />
                      Check In
                    </>
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}