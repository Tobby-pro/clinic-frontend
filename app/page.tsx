"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { 
  CheckCircle2, Calendar, Sparkles, Search, Clock,
  MapPin, ChevronRight, Building2, ShieldAlert, User, Phone, ArrowLeft, LogIn
} from "lucide-react"; 
import toast from "react-hot-toast";

// ✅ Single Location Service Core Managed 
import { 
  getClinics, 
  getDoctorsByClinic, 
  getAvailableSlots, 
  bookPublicAppointment, 
  API_URL 
} from "@/services/api";

// Isomorphic Extracted Core Step Modules
import MobileSlotSelector from "@/components/booking/MobileSlotSelector";
import ClaimAccountPortal from "@/components/booking/ClaimAccountPortal"; 

// Marketing Layouts (Untouched for Desktop)
import FeaturesSection from "@/components/marketing/FeaturesSection";
import PatientExperience from "@/components/marketing/PatientExperience";
import Footer from "@/components/layout/Footer"; 
import CTASection from "@/components/marketing/CTASection";
import FloatingTrustCard from "@/components/marketing/FloatingTrustCard";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Shared Premium Toast Styling Configuration
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
  iconTheme: {
    primary: '#ff7600',
    secondary: '#fff',
  },
  duration: 5000 
};

/* ========================================================================= */
/* ✨ UPDATED GEOMETRIC LOADER SUB-COMPONENT                                 */
/* ========================================================================= */
function ClinboxInlineLoader({ text = "Loading... please wait" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 my-4">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Layer 1: Ambient Brand Glow (Breathing Pulse) */}
        <div className="absolute inset-0 bg-[#ff7600]/10 blur-2xl rounded-full animate-pulse scale-110" />
        
        {/* Layer 2: Orbital Processing Track (Smooth Infinite Spin) */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#ff7600] animate-spin" />
        
        {/* Layer 3: Central Logo Core Card */}
        <div className="relative w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 z-10">
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 500 500" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
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
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse pl-[0.3em]">
        {text}
      </p>
    </div>
  );
}

/* ========================================================================= */
/* ✨ UPDATED OVERLAY GLOBAL BLOCKING LOADER LAYOUT                         */
/* ========================================================================= */
function ClinboxGlobalOverlayLoader({ text }: { text: string }) {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center gap-5 bg-white/95 backdrop-blur-md z-[9999]">
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Layer 1: Ambient Brand Glow */}
        <div className="absolute inset-0 bg-[#ff7600]/20 blur-3xl rounded-full animate-pulse scale-125" />
        
        {/* Layer 2: Orbital Processing Track */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#ff7600] animate-spin" />
        
        {/* Layer 3: Central Logo Core Card */}
        <div className="relative w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 z-10">
          <svg 
            width="44" 
            height="44" 
            viewBox="0 0 500 500" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
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

export default function HomePage() {
  const sectionRef = useRef(null);
  
  // Mobile Booking App State Machine
  const [bookingStep, setBookingStep] = useState("home"); 
  const [searchQuery, setSearchQuery] = useState("");
  
  // Live State Repositories
  const [clinicsList, setClinicsList] = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [slotsList, setSlotsList] = useState<any[]>([]);
  
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null); 
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState("");
  
  // Capture the backend generated patient id for modular portal setup
  const [newPatientId, setNewPatientId] = useState<number | null>(null);
  
  // Verification details collected at the end - Completely removed email address fields
  const [patientData, setPatientData] = useState({ fullName: "", phone: "", reason: "General Consultation" });

  // 1. Fetch live clinics from your database on component initial startup load
  useEffect(() => {
    async function loadInitialClinics() {
      console.log("🚀 [CLINBOX STEP ENGINE] Mounting HomePage: Fetching all live clinics...");
      try {
        const data = await getClinics();
        console.log("📦 [CLINBOX STEP ENGINE] Clinics successfully loaded from database:", data);
        setClinicsList(data || []);
      } catch (err) {
        console.error("❌ [CLINBOX STEP ENGINE] Failed to fetch database clinics:", err);
      }
    }
    loadInitialClinics();
  }, []);

  // 2. Fetch doctors dynamically as soon as a user clicks on a clinic card
  const handleClinicSelection = async (clinic: any) => {
    console.log(`🏥 [CLINBOX STEP ENGINE] Clinic selected: "${clinic.name}" (ID: ${clinic.id})`);
    
    setSelectedClinic(clinic);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setDoctorsList([]);
    
    setBookingStep("choose-doctor");
    setLoading(true);
    try {
      console.log(`📡 [CLINBOX STEP ENGINE] Requesting medical staff roster for Clinic ID: ${clinic.id}...`);
      const doctors = await getDoctorsByClinic(clinic.id);
      console.log("📦 [CLINBOX STEP ENGINE] Staff roster synchronized:", doctors);
      setDoctorsList(doctors || []);
    } catch (err) {
      console.error("❌ [CLINBOX STEP ENGINE] Error loading doctors for this clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch specific available database slots when a doctor is selected
  const handleDoctorSelection = async (doctor: any) => {
    console.log(`🧑‍⚕️ [CLINBOX STEP ENGINE] Practitioner selected: "Dr. ${doctor.name}" (ID: ${doctor.id})`);
    
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setSlotsList([]);
    
    setBookingStep("choose-slot");
    setLoading(true);
    try {
      const todayString = new Date().toISOString().split("T")[0];
      console.log(`📡 [CLINBOX STEP ENGINE] Requesting available bookable timeslots for Date: ${todayString}...`);
      const data = await getAvailableSlots(doctor.id, todayString);
      console.log("📦 [CLINBOX STEP ENGINE] Real-time timeslots fetched raw payload:", data);
      setSlotsList(data.slots || []);
    } catch (err) {
      console.error("❌ [CLINBOX STEP ENGINE] Error loading slots for this doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 4. Centralized transactional handler when a user selects a slot configuration
  const handleSlotSelection = (slot: any) => {
    const computedId = slot?.id ?? slot?.slot_id;
    console.log(`⏰ [CLINBOX STEP ENGINE] Timeslot selected internally: Slot ID: ${computedId} (Time: ${slot?.time || "Custom Window"})`);
    setSelectedSlot(slot);
  };

  // 🔑 5. Force step progression when confirmation layout button drops
  const handleAdvanceToVerification = () => {
    console.log("➡️ [CLINBOX STEP ENGINE] Advancing workflow to Stage 4: [Patient Verification Fields Layout]");
    setBookingStep("verification");
  };

  /* ---------------- PATIENT LIVE TRANSACTIONAL BOOKING SUBMIT ---------------- */
  const handleFinalBookingSubmit = async () => {
    const finalPayload = {
      clinic_id: Number(selectedClinic?.id),
      doctor_id: Number(selectedDoctor?.id),
      slot_id: Number(selectedSlot?.id ?? selectedSlot?.slot_id), 
      full_name: patientData.fullName.trim(),
      phone: patientData.phone.trim(),
      reason: patientData.reason
    };

    console.log("🔥 [CLINBOX STEP ENGINE] DISPATCHING PUBLIC APPOINTMENT APEX PAYLOAD TO BACKEND:", finalPayload);
    setLoading(true);
    setErrorFeedback("");
    try {
      const response = await bookPublicAppointment(finalPayload);
      console.log("✨ [CLINBOX STEP ENGINE] API TRANSACTION SUCCESSFUL! Core Response Body:", response);
      
      if (response && response.patient && response.patient.id) {
        console.log(`🆔 [CLINBOX STEP ENGINE] New Patient Profile Auto-Created by Backend Engine. ID: ${response.patient.id}`);
        setNewPatientId(Number(response.patient.id));
      }
      
      const targetedSlotId = selectedSlot?.id ?? selectedSlot?.slot_id;
      setSlotsList((prev) => prev.filter((s) => (s.id ?? s.slot_id) !== targetedSlotId));
      
      toast.dismiss(); 
      toast.success("Appointment booked! Awaiting clinic confirmation. 🚀", TOAST_STYLE_CONFIG);
      
      console.log("🏁 [CLINBOX STEP ENGINE] Local state hot-swapped to Step: success");
      setBookingStep("success");
    } catch (err: any) {
      console.error("❌ [CLINBOX STEP ENGINE] CRITICAL TRANSACTION FAIL: Booking sequence rejected:", err);
      setErrorFeedback(err.message || "An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DESKTOP UI SCROLL EFFECTS (UNTOUCHED) ---------------- */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const x = useMotionValue(0); const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12 });
  const springY = useSpring(y, { stiffness: 150, damping: 12 });
  function handleMouseMove(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  }
  const heading = "Transform Your Clinic Operations With Intelligent Scheduling.";
  const words = heading.split(" ");

  /* ---------------- MATURED UI STEPMAPPER CONFIGURATION ---------------- */
  const stepsConfig = [
    { key: "home", label: "Clinic" },
    { key: "choose-doctor", label: "Staff" },
    { key: "choose-slot", label: "Time" },
    { key: "verification", label: "Details" },
    { key: "success", label: "Receipt" }
  ];

  const currentStepIndex = stepsConfig.findIndex(s => s.key === bookingStep);

  // RELAXED FORM VALIDATION STRATEGY
  const numericPhoneValue = patientData.phone.replace(/\s+/g, "");
  const isPhoneValid = /^\+?[0-9]{7,15}$/.test(numericPhoneValue);
  const isFormValid = patientData.fullName.trim().length > 1 && isPhoneValid && patientData.reason.trim().length > 0;

  return (
    <div className={poppins.className}>
      
      {/* GLOBAL DETACHED OVERLAY WATCH STATE */}
      {loading && bookingStep === "verification" && (
        <ClinboxGlobalOverlayLoader text="Saving your spot..." />
      )}
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: FLUID TRANSACTIONAL BOOKING PLATFORM                       */}
      {/* ========================================================================= */}
      <main className="block md:hidden min-h-screen bg-white pt-20 pb-12 px-4 overflow-x-hidden">
        
        {/* APPLICATION CONTEXT HEADER BAR */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">C</div>
            <span className="text-sm font-black tracking-tight text-indigo-950">ClinBox</span>
          </div>
          <Link href="/patient/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-600 active:scale-95 transition-all">
            <LogIn size={13} className="text-slate-400" />
            <span>Login</span>
          </Link>
        </div>
        
        {/* HIGH-FIDELITY PROGRESS MATRIX */}
        {bookingStep !== "success" && (
          <div className="mb-6 bg-white border border-slate-200/60 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] mt-2">
            <div className="flex items-center justify-between">
              {stepsConfig.slice(0, 4).map((stepItem, idx) => {
                const isCompleted = currentStepIndex > idx;
                const isActive = currentStepIndex === idx;
                
                return (
                  <div key={stepItem.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isCompleted ? "bg-[#ff7600] text-white shadow-sm" : 
                        isActive ? "bg-[#ff7600] text-white ring-4 ring-orange-100" : "bg-slate-100 text-slate-400"
                      }`}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold tracking-tight transition-all ${
                        isActive ? "text-[#ff7600] font-black" : isCompleted ? "text-[#ff7600]" : "text-slate-400"
                      }`}>
                        {stepItem.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className="flex-1 h-[2px] mx-2 -mt-4 bg-slate-100 relative overflow-hidden">
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 bg-[#ff7600]"
                          initial={{ width: "0%" }}
                          animate={{ width: isCompleted ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* STEP A: THE APP-LIKE HOMEPAGE */}
          {bookingStep === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-[#ff7600] uppercase tracking-widest">Welcome to ClinBox</p>
                <h1 className="text-2xl font-black text-indigo-950 tracking-tight mt-1">Find Healthcare Near You</h1>
              </div>

              {/* SEARCH HUB */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clinics or specialized care..." 
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium outline-none shadow-sm focus:border-slate-300 transition-all"
                />
              </div>

              {/* TWO CORE SPLIT ENTRY CARDS */}
              <div className="grid grid-cols-1 gap-3">
                {clinicsList.length > 0 && (
                  <button 
                    onClick={() => handleClinicSelection(clinicsList[0])}
                    className="w-full bg-[#ff7600] text-white rounded-2xl p-5 text-left relative overflow-hidden shadow-lg shadow-[#ff7600]/20 active:scale-[0.99] transition-all hover:bg-[#e56b00]"
                  >
                    <Calendar className="absolute right-[-10px] bottom-[-10px] text-white opacity-[0.12]" size={100} />
                    <span className="text-[9px] text-white/80 font-black uppercase tracking-wider">Instant Access</span>
                    <h3 className="text-lg font-bold mt-0.5 flex items-center gap-1 text-white">Book Appointment <ChevronRight size={16} className="text-white/90" /></h3>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/admin/register" className="bg-white border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between shadow-sm active:scale-[0.97] transition-all hover:border-[#ff7600]/40 group">
                    <Building2 size={20} className="text-[#ff7600]" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block group-hover:text-[#ff7600] transition-colors">Register Clinic</span>
                  </Link>
                  <Link href="/admin/login" className="bg-white border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between shadow-sm active:scale-[0.97] transition-all hover:border-[#ff7600]/40 group">
                    <ShieldAlert size={20} className="text-indigo-950 group-hover:text-[#ff7600] transition-colors" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block group-hover:text-[#ff7600] transition-colors">Admin Terminal</span>
                  </Link>
                </div>
              </div>

              {/* NEARBY CLINICS FEED */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between"><h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Available Clinics</h3></div>
                <div className="space-y-3">
                  {clinicsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-200/60 rounded-xl text-center">
                      <ClinboxInlineLoader text="Loading clinics... please wait" />
                    </div>
                  ) : (
                    clinicsList
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((clinic) => (
                        <div 
                          key={clinic.id}
                          onClick={() => handleClinicSelection(clinic)}
                          className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-[#ff7600]/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#ff7600]"><Building2 size={20} /></div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{clinic.name}</h4>
                              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5"><MapPin size={10} /> {clinic.address || "Medical Network Center"}</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP B: CHOOSE DOCTOR */}
          {bookingStep === "choose-doctor" && (
            <motion.div key="doctors" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-6">
              <button onClick={() => setBookingStep("home")} className="flex items-center gap-1 text-xs font-bold text-slate-500 active:opacity-70"><ArrowLeft size={14} /> Back to Clinics</button>
              <div>
                <h2 className="text-xl font-black text-indigo-950 tracking-tight">{selectedClinic?.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select an available medical practitioner</p>
              </div>
              
              {loading ? (
                <div className="p-8 bg-white border border-slate-200/60 rounded-2xl shadow-sm flex items-center justify-center w-full">
                  <ClinboxInlineLoader text="Loading doctors... please wait" />
                </div>
              ) : (
                <div className="space-y-3">
                  {doctorsList.length === 0 ? (
                    <div className="text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center font-medium">No active practitioners scheduled for this clinic today.</div>
                  ) : (
                    doctorsList.map((doc) => (
                      <div 
                        key={doc.id}
                        onClick={() => handleDoctorSelection(doc)}
                        className="p-4 bg-white border border-slate-200/60 rounded-xl flex items-center justify-between cursor-pointer shadow-sm active:scale-[0.98] transition-transform hover:border-[#ff7600]/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-950 rounded-full flex items-center justify-center text-white font-bold text-xs">{doc.name[0]}</div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Dr. {doc.name}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{doc.specialty || "General Medicine"}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">Available</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP C: CHOOSE TIMESLOT */}
          {bookingStep === "choose-slot" && (
            <MobileSlotSelector 
              selectedDoctor={selectedDoctor}
              slotsList={slotsList}
              selectedSlot={selectedSlot}
              setSelectedSlot={handleSlotSelection}
              loading={loading}
              onBack={() => setBookingStep("choose-doctor")}
              onNext={handleAdvanceToVerification}
            />
          )}

          {/* STEP D: PHONE / FIELD VERIFICATION */}
          {bookingStep === "verification" && (
            <motion.div key="verification" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              <button 
                onClick={() => setBookingStep("choose-slot")} 
                className="flex items-center gap-1 text-xs font-bold text-slate-500 active:opacity-70 transition-opacity"
              >
                <ArrowLeft size={14} /> Back to Timeslots
              </button>
              
              <div>
                <h2 className="text-xl font-black text-indigo-950 tracking-tight">Patient Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">Enter your details to finalize your booking</p>
              </div>

              <div className="space-y-4 bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-950/60 tracking-wider">Full Legal Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      value={patientData.fullName}
                      onChange={(e) => setPatientData({ ...patientData, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-950/60 tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-indigo-950/60 tracking-wider">Reason for Visit</label>
                  <textarea 
                    rows={3}
                    value={patientData.reason}
                    onChange={(e) => setPatientData({ ...patientData, reason: e.target.value })}
                    placeholder="Brief description of symptoms..."
                    className="w-full bg-slate-50 border border-slate-100 focus:border-slate-300 rounded-xl p-4 text-xs font-medium outline-none resize-none transition-all"
                  />
                </div>
              </div>

              {errorFeedback && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold text-center">
                  {errorFeedback}
                </div>
              )}

              <button
                onClick={handleFinalBookingSubmit}
                disabled={!isFormValid || loading}
                className="w-full bg-[#ff7600] text-white py-4.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-20 transition-all hover:bg-[#e56b00]"
              >
                <span>Confirm Booking</span>
              </button>
            </motion.div>
          )}

          {/* STEP E: SUCCESS RECEIPT + LAZY PORTAL ACTIVATION TRIGGER */}
          {bookingStep === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {newPatientId && (
                <ClaimAccountPortal 
                  patientId={newPatientId} 
                  phone={patientData.phone.trim()} 
                  facilityName={selectedClinic?.name}
                  doctorName={selectedDoctor ? `Dr. ${selectedDoctor.name}` : undefined}
                  apptTime={selectedSlot?.time}
                  onComplete={() => {
                    setBookingStep("home");
                    setPatientData({ fullName: "", phone: "", reason: "General Consultation" });
                    setNewPatientId(null);
                  }}
                />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 💻 DESKTOP VIEW: CLEAN WHITE HERO CANVAS WITH DASHBOARD SCREENSHOT         */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        <section ref={sectionRef} className="relative min-h-screen flex items-center bg-white pt-24 pb-20 md:pt-40 lg:pt-48 overflow-visible">
          
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* LEFT: TEXT COLLATERAL AREA */}
              <div className="text-left space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }} 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-xs font-bold uppercase tracking-wider"
                >
                  <Sparkles size={14} /> HIPAA Ready • Secure Infrastructure • 99.9%
                </motion.div>
                
                {/* 📉 Headline reduced by ~4% (text-5xl lg:text-5xl instead of lg:text-6xl) */}
                <h1 className="font-extrabold tracking-tight text-5xl lg:text-6xl text-indigo-950 leading-[1.1]">
                  {words.map((word, index) => (
                    <motion.span 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: index * 0.04 }} 
                      className={word === "Scheduling." ? "text-[#ff7600] inline-block mr-2" : "inline-block mr-2"}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
                
                {/* 📉 Description copy text reduced by 20% (text-sm text-slate-500/90 instead of text-lg text-slate-600) */}
                <p className="text-sm text-slate-500/90 max-w-xl leading-relaxed">
                  Connect your medical practice directly to patient portals. Instantly synchronize slots, optimize front-desk pipelines, and dispatch live alerts.
                </p>
                
                <div className="flex flex-row items-center gap-4 mt-10">
                  <Link 
                    href="/admin/register" 
                    className="bg-[#ff7600] text-white py-4 px-8 rounded-2xl text-base font-bold transition-all hover:bg-[#e56b00] shadow-lg shadow-[#ff7600]/20 active:scale-95"
                  >
                    Register Practice
                  </Link>
                  <Link 
                    href="/admin/login" 
                    className="border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-2xl text-base font-bold tracking-tight bg-white/40 hover:border-[#ff7600]/40 hover:text-[#ff7600] transition-all active:scale-95"
                  >
                    Access Portal
                  </Link>
                </div>
              </div>
              
              {/* 🎯 RIGHT: HIGH-FIDELITY DASHBOARD SCREENSHOT PREVIEW WITH 3D TILT */}
              {/* 📈 Wrapped entire inner system to scale images upward by +15% via scale-115 wrapper */}
              <div className="w-full flex items-center justify-center transform scale-115 origin-center lg:pl-6">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  onMouseMove={handleMouseMove}
                  style={{ rotateX: springY, rotateY: springX, transformStyle: "preserve-3d" }}
                  className="relative w-full cursor-pointer group"
                >
                  {/* Ambient Radial Gradient Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-indigo-500/5 blur-3xl rounded-3xl -z-10 transform scale-95 opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* 🖥️ SCREEN 1: MAIN CLINIC ADMIN DASHBOARD FRAME */}
                  <div className="relative border border-slate-200/80 bg-white rounded-2xl p-2.5 shadow-[0_32px_64px_-12px_rgba(15,23,42,0.08)] overflow-hidden">
                    
                    {/* High-Fidelity Desktop Browser Header Element */}
                    <div className="flex items-center gap-1.5 px-3 pb-2.5 pt-1 border-b border-slate-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="h-4 w-40 bg-slate-50 border border-slate-100 rounded-md ml-4 flex items-center justify-center">
                        <span className="text-[8px] text-slate-400 tracking-tight">clinbox.com/dashboard</span>
                      </div>
                    </div>

                    {/* ✨ FIXED DASHBOARD CONTAINER */}
                    <div className="relative w-full aspect-[16/10] bg-white rounded-xl overflow-hidden mt-3 flex items-center justify-center">
                      <Image
                        src="/images/clinbox_screen.png"
                        alt="Clinbox Operations Management Terminal Dashboard View"
                        fill
                        priority
                        className="object-contain object-center group-hover:scale-[1.005] transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* 📱 SCREEN 2: OVERLAY PATIENT DASHBOARD INTERFACE (Cascaded Foreground Layer) */}
                  {/* Adjusted offset coordinates cleanly to map with increased size scale setup */}
                  <div className="absolute bottom-[-24px] left-[-36px] w-[55%] border-4 border-white bg-white rounded-2xl p-2 shadow-[0_24px_50px_-10px_rgba(255,118,0,0.15)] overflow-hidden hidden sm:block transform group-hover:translate-y-[-4px] transition-transform duration-500">
                    <div className="flex items-center gap-1 px-1.5 pb-1.5 border-b border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                    <div className="relative w-full aspect-[4/3] bg-white rounded-lg overflow-hidden mt-1.5">
                      <Image
                        src="/images/clinbox_screen01.png"
                        alt="Clinbox Patient Portal Dashboard View"
                        fill
                        priority
                        className="object-contain object-center"
                      />
                    </div>
                  </div>

                </motion.div>
              </div>

            </div>
          </div>
        </section>

        <FeaturesSection />
        <PatientExperience />
        <CTASection />
        <Footer />
        <FloatingTrustCard />
      </div>

    </div>
  );
}