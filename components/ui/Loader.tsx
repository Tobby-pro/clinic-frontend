"use client";

import React from "react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = "Syncing Ledger..." }: LoaderProps) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-5 bg-white/95 backdrop-blur-md z-[9999]">
      <div className="relative flex items-center justify-center w-28 h-28">
        
        {/* Layer 1: Ambient Brand Glow (Breathing Pulse) */}
        <div className="absolute inset-0 bg-[#ff7600]/20 blur-3xl rounded-full animate-pulse scale-125" />
        
        {/* Layer 2: Orbital Processing Track (Smooth Infinite Spin) */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#ff7600] animate-spin" />
        
        {/* Layer 3: Central Logo Core Card (Stays solid & grounded) */}
        <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 z-10">
          <svg 
            width="44" 
            height="44" 
            viewBox="0 0 500 500" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Finalized Minimalist Cross Layout with 0.1 Wider Gap Calibration */}
            <g fill="#ff7600">
              {/* Center Square Block */}
              <rect x="213.5" y="213.5" width="73" height="73" />

              {/* Top Pointer */}
              <path d="M213.5 201.5h73v-51l-36.5-27-36.5 27v51z" />
              
              {/* Right Pointer */}
              <path d="M299.5 213.5v73h51l27-36.5-27-36.5h-51z" />
              
              {/* Bottom Pointer */}
              <path d="M286.5 299.5h-73v51l36.5 27 36.5-27v-51z" />
              
              {/* Left Pointer */}
              <path d="M201.5 286.5v-73h-51l-27 36.5 27 36.5h51z" />
            </g>
          </svg>
        </div>
      </div>

      {/* Layer 4: Status Transmission Text */}
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500/80 animate-pulse mt-2 text-center pl-[0.4em]">
        {text}
      </p>
    </div>
  );
}