"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Activity } from "lucide-react";

const trustItems = [
  { label: "HIPAA Ready", icon: <ShieldCheck size={14} /> },
  { label: "Secure Infrastructure", icon: <Lock size={14} /> },
  { label: "99.9% Uptime", icon: <Activity size={14} /> },
];

export default function FloatingTrustCard() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-[100] w-[95%] md:w-full max-w-fit px-2 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-1 p-1 md:p-1.5 rounded-[1.5rem] md:rounded-[2rem] bg-[#020617]/90 backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-auto"
      >
        {trustItems.map((item, index) => (
          <div key={item.label} className="flex items-center w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-3 rounded-[1.5rem] hover:bg-white/5 transition-colors group cursor-default w-full justify-center md:justify-start">
              <div className="relative flex items-center justify-center flex-shrink-0">
                <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full group-hover:bg-orange-500/40 transition-colors" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#ff7600] relative z-10" />
              </div>
              <span className="text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </span>
            </div>
            
            {/* Divider: Hidden on mobile, shown on desktop */}
            {index !== trustItems.length - 1 && (
              <div className="hidden md:block h-4 w-[1px] bg-white/10 mx-1" />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}