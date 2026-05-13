// components/GlobalAppointmentDrawer.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, CheckCircle2, UserCheck, XCircle, ArrowUpRight, MessageSquare } from "lucide-react";
import { useAppointmentDrawer } from "@/app/store/useAppointmentDrawer";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { confirmAppointment } from "@/services/api";
import { useAppointmentActions } from "@/app/hooks/useAppointmentActions";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

export default function GlobalAppointmentDrawer() {
  const { selectedAppt, closeDrawer } = useAppointmentDrawer();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { 
    setIsMounted(true); 
  }, []);

  // FIXED LOGIC: Any path starting with /dashboard is an Admin view.
  // This ensures buttons show on /dashboard/doctors, /dashboard/analytics, etc.
  const isAdminView = pathname.startsWith("/dashboard");
  
  const { handleCancel, handleComplete, isProcessing } = useAppointmentActions(() => {
    closeDrawer();
    setTimeout(() => window.location.reload(), 300);
  });

  if (!isMounted) return null;

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {selectedAppt && (
          <div className="fixed inset-0 z-[9999]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 md:p-8 overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Clinical Protocol</h2>
                <button onClick={closeDrawer} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-6">
                {/* Identity Card */}
                <div className="p-6 bg-gray-900 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                      {isAdminView ? "Patient Registry" : "Practitioner Details"}
                    </span>
                    <h3 className="text-2xl font-black mt-1 uppercase italic">
                      {isAdminView ? selectedAppt.patient_name : `Dr. ${selectedAppt.doctor_name}`}
                    </h3>
                    {isAdminView && (
                      <Link 
                        href={`/dashboard/patient/${selectedAppt.patient_id}`} 
                        className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter flex items-center gap-1 mt-4 hover:text-white transition-colors"
                      >
                        Access Health Records <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </div>
                  <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
                </div>

                {/* Reason Section */}
                <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={14} className="text-orange-600" />
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Reason for Booking</span>
                  </div>
                  <p className="text-sm text-gray-700 font-bold leading-relaxed">
                    {selectedAppt.reason || "Routine Clinical Consultation"}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Schedule</p>
                    <p className="font-bold text-gray-900 text-center text-sm">{selectedAppt.time}</p>
                    <p className="text-[9px] text-gray-400 text-center font-medium uppercase">{selectedAppt.date}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Status</p>
                    <div className="flex justify-center mt-1">
                       <span className={`font-black uppercase text-[10px] px-2 py-1 rounded-lg border ${
                         selectedAppt.status === "BOOKED" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-green-50 text-green-600 border-green-100"
                       }`}>
                         {selectedAppt.status}
                       </span>
                    </div>
                  </div>
                </div>

                {/* ADMIN ACTIONS - Globalized for all /dashboard pages */}
                {isAdminView ? (
                  <div className="space-y-3 pt-4">
                    {selectedAppt.status === "BOOKED" && (
                      <button 
                        disabled={isProcessing} 
                        onClick={async () => { 
                          try {
                            await confirmAppointment(selectedAppt.id);
                            toast.success("Ledger Updated: Booking Validated");
                            closeDrawer();
                            setTimeout(() => window.location.reload(), 500);
                          } catch (err) {
                            toast.error("Validation sequence failed");
                          }
                        }} 
                        className="w-full py-5 bg-green-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 active:scale-[0.98] transition-all"
                      >
                        <CheckCircle2 size={20} /> Validate Booking
                      </button>
                    )}

                    <button 
                      disabled={isProcessing} 
                      onClick={async () => { await handleComplete(selectedAppt.id); }} 
                      className="w-full py-5 bg-gray-900 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      <UserCheck size={20} /> Mark Completed
                    </button>

                    <button 
                      disabled={isProcessing} 
                      onClick={async () => { await handleCancel(selectedAppt.id); }} 
                      className="w-full py-5 bg-white border-2 border-red-50 text-red-500 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                    >
                      <XCircle size={20} /> Void Record
                    </button>
                  </div>
                ) : (
                  <div className="pt-6">
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                      Contact clinic to modify this record
                    </p>
                    <button onClick={closeDrawer} className="w-full py-5 bg-gray-100 text-gray-600 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em]">
                      Close Dossier
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}