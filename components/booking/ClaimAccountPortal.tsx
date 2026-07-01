"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { verifyPatientPhone, activatePatientPortal } from "@/services/api"; 

interface ClaimAccountPortalProps {
  patientId: number;
  phone: string;
  onComplete?: () => void;
  facilityName?: string;
  doctorName?: string;
  apptTime?: string;
}

const BRAND_BG = "bg-[#ff7600]";
const BRAND_TEXT = "text-[#ff7600]";
const BRAND_BORDER = "focus:border-[#ff7600] border-orange-100";
const BRAND_HOVER = "hover:bg-[#e56b00]";
const BRAND_LIGHT_BG = "bg-orange-50/60";

const SECONDARY_DARK_CARD = "bg-gray-900 border border-gray-800 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden";

const TOAST_STYLE_CONFIG = {
  style: {
    minWidth: '280px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: 'bold',
    background: '#ffffff',
    color: '#1e293b',
    border: '1px solid #f1f5f9',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)'
  },
  duration: 5000,
};

function PortalOverlayLoader({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-5 bg-white/95 backdrop-blur-md z-[99999]">
      <div className="relative flex items-center justify-center w-28 h-28">
        <div className="absolute inset-0 bg-[#ff7600]/20 blur-3xl rounded-full animate-pulse scale-125" />
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#ff7600] animate-spin" />
        <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 z-10">
          <svg width="44" height="44" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g fill="#ff7600">
              <rect x="213.5" y="213.5" width="73" height="73" />
              <path d="M213.5 201.5h73v-51l-36.5-27-36.5 27v51z" />
              <path d="M299.5 213.5v73h51l27-36.5-27-36.5h-51z" />
              <path d="M286.5 299.5h-73v51l36.5 27 36.5-27v-51z" />
              <path d="M201.5 286.5v-73h-51l-27 36.5 27 36.5h51z" />
            </g>
          </svg>
        </div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500/80 animate-pulse mt-2 text-center pl-[0.4em]">
        {text}
      </p>
    </div>
  );
}

export default function ClaimAccountPortal({ 
  patientId, 
  phone, 
  onComplete,
  facilityName = "The Eko Hospital",
  doctorName = "Dr. dr kima",
  apptTime = "04:17 PM"
}: ClaimAccountPortalProps) {
  const router = useRouter();
  const [claimStep, setClaimStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");

  // STEP 1: Save the 6-Digit PIN
  const handleSavePin = async () => {
    if (pin.length < 6) return;
    
    toast.dismiss();
    setLoading(true);
    setLoaderText("Creating your profile...");

    try {
      await activatePatientPortal({
        patient_id: Number(patientId),
        password: pin,
      });

      // Single, clear human instruction text
      toast.success("PIN set up successfully! Please check your phone for the verification code. 🔐", {
        ...TOAST_STYLE_CONFIG,
        iconTheme: { primary: '#ff7600', secondary: '#fff' }
      });
      setClaimStep(2);
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail || err?.message || "Could not save your PIN. Please try again.";
      toast.error(errMsg, TOAST_STYLE_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify the OTP and Route Session
  const handleVerifyAndLogin = async () => {
    if (otp.length < 6) return;
    
    toast.dismiss();
    setLoading(true);
    setLoaderText("Verifying code...");

    try {
      const response = await verifyPatientPhone({
        phone: phone.trim(),
        otp: String(otp).trim(), 
      });

      if (response && response.access_token) {
        document.cookie = `access_token=${response.access_token}; path=/; max-age=604800; SameSite=Lax`;
      }
      
      // 🎯 EXACTLY WHAT YOU WANTED: Single human-readable toast notice
      toast.success("Your appointment has been successfully booked and is waiting to be confirmed by the doctor or admin. 🎉", {
        ...TOAST_STYLE_CONFIG,
        iconTheme: { primary: '#ff7600', secondary: '#fff' }
      });

      setClaimStep(3);
      if (onComplete) onComplete();

      router.push("/patient/dashboard?activated=true");
    } catch (err: any) {
      const errMsg = err?.response?.data?.detail || err?.message || "Incorrect verification code.";
      toast.error(errMsg, TOAST_STYLE_CONFIG);
    } {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-left relative">
      
      {loading && <PortalOverlayLoader text={loaderText} />}
      
      {/* 1. CONFIRMATION HERO HEADER */}
      <div className="text-center py-4 space-y-3">
        <div className={`w-14 h-14 ${BRAND_LIGHT_BG} ${BRAND_TEXT} rounded-full flex items-center justify-center mx-auto shadow-sm`}>
          <Sparkles size={26} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Booking Request Sent</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Set up your profile below to manage your appointment status.
          </p>
        </div>
      </div>

      {/* 2. SPECIFICATION MATRIX CARD */}
      <div className={SECONDARY_DARK_CARD}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff7600]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff7600]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Appointment Details</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Clinic / Facility</span>
              <span className="font-semibold text-gray-100">{facilityName}</span>
            </div>
            
            <div className="flex grid-cols-2 gap-4">
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Doctor</span>
                <span className="font-semibold text-gray-100">{doctorName}</span>
              </div>
              
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Time Selected</span>
                <span className="font-black text-[#ff7600] tracking-wide">{apptTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRANSACTIONAL ACCOUNT CLAIM ACTIONS */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
        <AnimatePresence mode="wait">
          
          {claimStep === 1 && (
            <motion.div key="claim-pin" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${BRAND_LIGHT_BG} ${BRAND_TEXT} rounded-xl flex items-center justify-center shrink-0`}>
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Set Up Your Profile</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Create a 6-digit PIN to securely see your medical records.</p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex justify-center gap-2.5">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        pin.length > i ? `${BRAND_BG} scale-110 shadow-[0_0_8px_rgba(255,118,0,0.4)]` : "bg-slate-200"
                      }`} 
                    />
                  ))}
                </div>
                
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-slate-50 border border-slate-100 ${BRAND_BORDER} rounded-xl py-3.5 text-center text-xl font-bold tracking-[0.5em] outline-none transition-all`}
                />

                <button
                  onClick={handleSavePin}
                  disabled={pin.length < 6 || loading}
                  className={`w-full ${BRAND_BG} text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${BRAND_HOVER} transition-all disabled:opacity-20 shadow-md shadow-orange-500/10`}
                >
                  <span>Create Account</span> <ArrowRight size={14} strokeWidth={2.5}/>
                </button>
              </div>
            </motion.div>
          )}

          {claimStep === 2 && (
            <motion.div key="claim-otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${BRAND_LIGHT_BG} ${BRAND_TEXT} rounded-xl flex items-center justify-center shrink-0`}>
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Verify your phone</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">We sent a verification code to <span className="font-bold text-slate-600">{phone}</span></p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={`w-full bg-slate-50 border border-slate-100 ${BRAND_BORDER} rounded-xl py-3.5 text-center text-xl font-bold tracking-[0.3em] outline-none transition-all`}
                />

                <button
                  onClick={handleVerifyAndLogin}
                  disabled={otp.length < 6 || loading}
                  className={`w-full ${BRAND_BG} text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 ${BRAND_HOVER} transition-all disabled:opacity-20 shadow-md shadow-orange-500/10`}
                >
                  <span>Verify & Secure Booking</span> <ShieldCheck size={14} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          )}

          {claimStep === 3 && (
            <motion.div key="claim-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-2">
              <div className={`w-12 h-12 ${BRAND_LIGHT_BG} ${BRAND_TEXT} rounded-full flex items-center justify-center mx-auto shadow-sm`}>
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
              <h5 className="text-sm font-bold text-gray-900">Request Confirmed</h5>
              <p className="text-[11px] text-slate-400">Loading your profile dashboard...</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="text-center pt-2">
        <button 
          onClick={() => router.push("/patient/dashboard")}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#ff7600] transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}