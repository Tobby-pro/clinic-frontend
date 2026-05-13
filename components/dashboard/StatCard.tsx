"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;      // ✅ For those Lucide icons
  description?: string;  // ✅ For the "Live" or "+12%" labels
  className?: string;    // ✅ To handle the grid spanning on mobile
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  className = "" 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        bg-white p-4 md:p-6 
        rounded-[1.5rem] md:rounded-[2rem] 
        border border-gray-100 
        shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] 
        hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] 
        transition-all flex flex-col justify-between 
        min-h-[110px] md:min-h-[140px] 
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-0.5 md:space-y-1">
          <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
            {title}
          </p>
          <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter">
            {value}
          </h3>
        </div>
        
        {/* Sleek Icon Container */}
        {icon && (
          <div className="p-2 md:p-2.5 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {/* Modern bottom label */}
      {description && (
        <div className="mt-2 md:mt-4 flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-green-400" />
          <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wide">
            {description}
          </p>
        </div>
      )}
    </motion.div>
  );
}