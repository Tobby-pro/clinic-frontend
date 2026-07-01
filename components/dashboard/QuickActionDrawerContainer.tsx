"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useGlobalDrawer } from "@/app/hooks/useGlobalDrawer"; 
import PatientBookingForm from "./AppointmentForm";
import PatientCheckInForm from "./PatientCheckInForm"; // 🎯 Import our new view block

export default function QuickActionDrawerContainer() {
  const { isOpen, viewType, closeDrawer } = useGlobalDrawer();

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl p-6 md:p-8 overflow-y-auto flex flex-col"
          >
            <div className="flex justify-end items-center mb-4">
              <button onClick={closeDrawer} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors outline-none">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1">
              {viewType === "BOOK_APPOINTMENT" && <PatientBookingForm />}
              
              {/* 🎯 Swapped structural slot wrapper for actual component integration */}
              {viewType === "CHECK_IN" && <PatientCheckInForm />}
              
              {viewType === "REGISTER_PATIENT" && (
                <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest border border-dashed border-gray-100 rounded-2xl">
                  New Patient Intake Onboarding Slot
                </div>
              )}
              {viewType === "COLLECT_PAYMENT" && (
                <div className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest border border-dashed border-gray-100 rounded-2xl">
                  Administrative Billing Ledger Slot
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}