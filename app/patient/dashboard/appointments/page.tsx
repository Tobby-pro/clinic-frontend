// app/patient/dashboard/appointments/page.tsx

"use client";

import { useState, useEffect, Suspense } from "react"; 
import { motion } from "framer-motion";
import { Calendar, Clock, MessageSquare } from "lucide-react";
import { getPatientUpcomingAppointments } from "@/services/api"; 
import { useAppointmentDrawer } from "../../../store/useAppointmentDrawer";

function PatientAppointmentsContent() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const openDrawer = useAppointmentDrawer((state) => state.openDrawer);

  useEffect(() => {
    getPatientUpcomingAppointments().then(data => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">My Schedule</h1>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Status: Pending & Confirmed</p>
      </header>
      
      <div className="grid gap-4">
        {loading ? (
          <div className="p-10 text-center text-gray-300 font-black uppercase tracking-widest">Accessing Ledger...</div>
        ) : (
          appointments.map((appt) => (
            <motion.div 
              key={appt.id} 
              whileHover={{ scale: 1.01 }}
              onClick={() => openDrawer(appt)}
              className="p-6 bg-white border border-gray-100 rounded-[2rem] cursor-pointer hover:border-blue-400 transition-all shadow-sm"
            >
               <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-black text-gray-900 uppercase italic">Dr. {appt.doctor_name}</h3>
                    <div className="flex gap-4">
                      <span className="text-xs text-gray-500 font-bold flex items-center gap-1"><Clock size={14}/> {appt.time}</span>
                      <span className="text-xs text-gray-500 font-bold flex items-center gap-1"><Calendar size={14}/> {appt.date}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium italic truncate max-w-[250px]">
                      {appt.reason}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                    appt.status === "CONFIRMED" ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                    {appt.status === "BOOKED" ? "PENDING VALIDATION" : appt.status}
                  </div>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><PatientAppointmentsContent /></Suspense>;
}