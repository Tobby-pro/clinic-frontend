"use client";

import { motion } from "framer-motion";
import { Clock, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";

interface Slot {
  id: number;
  time: string;
  is_booked: boolean;
  slot_id?: number;
  _id?: number;
  booked?: boolean;
  status?: string;
  is_available?: boolean;
  isAvailable?: boolean;
  start?: any;
  formatted?: {
    time: string;
  };
}

interface MobileSlotSelectorProps {
  selectedDoctor: any;
  slotsList: Slot[] | { slots: Slot[] } | any; 
  selectedSlot: any;
  setSelectedSlot: (slot: Slot) => void;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function MobileSlotSelector({
  selectedDoctor,
  slotsList,
  selectedSlot,
  setSelectedSlot,
  loading,
  onBack,
  onNext
}: MobileSlotSelectorProps) {
  
  const rawArray: Slot[] = Array.isArray(slotsList) 
    ? slotsList 
    : slotsList?.slots 
      ? slotsList.slots 
      : [];

  const activeAvailableSlots = rawArray.filter((slot: Slot) => {
    const isBooked = slot.is_booked ?? slot.booked ?? !(slot.is_available ?? slot.isAvailable ?? true);
    return isBooked === false;
  });

  return (
    <motion.div 
      key="slots" 
      initial={{ opacity: 0, x: 16 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -16 }} 
      className="space-y-6"
    >
      <button 
        onClick={() => {
          console.log("👈 [CLINBOX STEP ENGINE] Back arrow triggered inside MobileSlotSelector.");
          onBack();
        }} 
        type="button"
        className="flex items-center gap-1 text-xs font-bold text-slate-500 active:opacity-70 transition-opacity"
      >
        <ArrowLeft size={14} /> Back to Staff
      </button>

      <div>
        <h2 className="text-xl font-black text-indigo-950 tracking-tight">Select Time</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          With Dr. {selectedDoctor?.name || "Selected Practitioner"}
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Loader2 className="animate-spin text-[#ff7600]" size={18} />
          <span className="text-xs text-slate-500 font-bold tracking-tight">Loading available slots... please wait</span>
        </div>
      ) : activeAvailableSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
          <AlertTriangle className="text-amber-500 mb-2" size={24} />
          <p className="text-sm font-bold text-indigo-950">No Slots Available</p>
          <p className="text-xs text-slate-400 max-w-[250px] mx-auto mt-1 leading-relaxed">
            This doctor has no open slots left for today. Please check back later or select another doctor.
          </p>
        </div>
      ) : (
        <>
          {/* Time Card Flex Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
            {activeAvailableSlots.map((slotItem: Slot) => {
              const targetId = slotItem.id ?? slotItem.slot_id;
              const currentSelectedId = selectedSlot?.id ?? selectedSlot?.slot_id;
              const isSelected = currentSelectedId === targetId;
              
              const clockDisplayTime = slotItem.time ?? 
                slotItem.formatted?.time ?? 
                (slotItem.start ? slotItem.start.toString().substring(11, 16) : "Available Window");

              return (
                <button 
                  key={targetId}
                  type="button"
                  onClick={() => {
                    console.log(`🎯 [CLINBOX STEP ENGINE] Slot button clicked inside grid view: ID ${targetId} (${clockDisplayTime})`);
                    setSelectedSlot(slotItem);
                  }}
                  className={`p-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                    isSelected 
                      ? "bg-indigo-950 border-indigo-950 text-white shadow-md shadow-indigo-950/10 scale-[0.98]" 
                      : "bg-white border-slate-100 text-slate-700 hover:border-[#ff7600] hover:text-[#ff7600] shadow-sm"
                  }`}
                >
                  <Clock size={13} className={isSelected ? "text-[#ff7600]" : "text-slate-400"} /> 
                  {clockDisplayTime}
                </button>
              );
            })}
          </div>

          {/* Explicit Step Confirmation Control Bar */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const activeId = selectedSlot?.id ?? selectedSlot?.slot_id;
                console.log(`🚀 [CLINBOX STEP ENGINE] "Continue to Details" clicked! Proceeding with Slot ID: ${activeId}`);
                onNext();
              }}
              disabled={!selectedSlot}
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 active:scale-[0.99] transition-transform"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}