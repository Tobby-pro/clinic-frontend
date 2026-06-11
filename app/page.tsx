// app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { 
  CheckCircle2, Users, Calendar, Sparkles, Search, 
  MapPin, ChevronRight, Building2, ShieldAlert, Clock, User, Phone, ArrowLeft, Loader2
} from "lucide-react"; 

// ✅ IMPORTED: Bringing in your full suite of live async database services
import { 
  getClinics, 
  getDoctorsByClinic, 
  getAvailableSlots, 
  API_URL 
} from "@/services/api";

// Marketing Layouts (Untouched for Desktop)
import FeaturesSection from "@/components/marketing/FeaturesSection";
import PatientExperience from "@/components/marketing/PatientExperience";
import Footer from "@/components/layout/Footer"; 
import CTASection from "@/components/marketing/CTASection";
import FloatingTrustCard from "@/components/marketing/FloatingTrustCard";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function HomePage() {
  const sectionRef = useRef(null);
  
  // Mobile Booking App State Machine
  const [bookingStep, setBookingStep] = useState("home"); // "home" | "choose-doctor" | "choose-slot" | "verification" | "success"
  const [searchQuery, setSearchQuery] = useState("");
  
  // Live State Repositories
  const [clinicsList, setClinicsList] = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [slotsList, setSlotsList] = useState<any[]>([]);
  
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null); // Tracks full slot object with numerical id
  const [loading, setLoading] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState("");
  
  // Verification details collected at the end
  const [patientData, setPatientData] = useState({ fullName: "", phone: "", email: "", reason: "General Consultation" });

  // 1. Fetch live clinics from your database on component initial startup load
  useEffect(() => {
    async function loadInitialClinics() {
      try {
        const data = await getClinics();
        setClinicsList(data || []);
      } catch (err) {
        console.error("Failed to fetch database clinics:", err);
      }
    }
    loadInitialClinics();
  }, []);

  // 2. Fetch doctors dynamically as soon as a user clicks on a clinic card
  const handleClinicSelection = async (clinic: any) => {
    setSelectedClinic(clinic);
    setBookingStep("choose-doctor");
    setLoading(true);
    try {
      const doctors = await getDoctorsByClinic(clinic.id);
      setDoctorsList(doctors || []);
    } catch (err) {
      console.error("Error loading doctors for this clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch specific available database slots when a doctor is selected
  const handleDoctorSelection = async (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingStep("choose-slot");
    setLoading(true);
    try {
      // Formats current system timestamp down to clean standard ISO string for your backend route query parameters
      const todayString = new Date().toISOString().split("T")[0];
      const data = await getAvailableSlots(doctor.id, todayString);
      setSlotsList(data.slots || []);
    } catch (err) {
      console.error("Error loading slots for this doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PATIENT LIVE TRANSACTIONAL BOOKING SUBMIT ---------------- */
  const handleFinalBookingSubmit = async () => {
    setLoading(true);
    setErrorFeedback("");
    try {
      // Direct post connection to your new public route execution context layer
      const res = await fetch(`${API_URL}/public/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: Number(selectedClinic.id),
          doctor_id: Number(selectedDoctor.id),
          slot_id: Number(selectedSlot.id), // Passes the absolute relational primary key integer
          full_name: patientData.fullName.trim(),
          phone: patientData.phone.trim(),
          email: patientData.email.toLowerCase().trim(),
          reason: patientData.reason
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || "Booking transaction declined.");
      }
      
      setBookingStep("success");
    } catch (err: any) {
      console.error("Booking sequence failed", err);
      setErrorFeedback(err.message || "An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DESKTOP UI SCROLL EFFECTS (UNTOUCHED) ---------------- */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
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

  return (
    <div className={poppins.className}>
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: FLUID TRANSACTIONAL BOOKING PLATFORM                       */}
      {/* ========================================================================= */}
      <main className="block md:hidden min-h-screen bg-[#fcfcfc] pt-24 pb-12 px-4 overflow-x-hidden">
        
        {/* HIGH-FIDELITY PROGRESS MATRIX (VISIBLE FOR DEVELOPERS & USERS) */}
        {bookingStep !== "success" && (
          <div className="mb-6 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              {stepsConfig.slice(0, 4).map((stepItem, idx) => {
                const isCompleted = currentStepIndex > idx;
                const isActive = currentStepIndex === idx;
                
                return (
                  <div key={stepItem.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5 z-10">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isCompleted ? "bg-emerald-500 text-white shadow-sm" : 
                        isActive ? "bg-slate-900 text-white ring-4 ring-slate-100" : "bg-slate-100 text-slate-400"
                      }`}>
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <span className={`text-[9px] font-bold tracking-tight transition-all ${
                        isActive ? "text-slate-900 font-black" : isCompleted ? "text-emerald-600" : "text-slate-400"
                      }`}>
                        {stepItem.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div className="flex-1 h-[2px] mx-2 -mt-4 bg-slate-50 relative overflow-hidden">
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 bg-emerald-500"
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
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium outline-none shadow-sm"
                />
              </div>

              {/* TWO CORE SPLIT ENTRY CARDS */}
              <div className="grid grid-cols-1 gap-3">
                {clinicsList.length > 0 && (
                  <button 
                    onClick={() => handleClinicSelection(clinicsList[0])}
                    className="w-full bg-slate-900 text-white rounded-2xl p-5 text-left relative overflow-hidden shadow-lg shadow-slate-900/10 active:scale-[0.99] transition-transform"
                  >
                    <Calendar className="absolute right-[-10px] bottom-[-10px] opacity-10" size={100} />
                    <span className="text-[9px] text-[#ff7600] font-black uppercase tracking-wider">Instant Access</span>
                    <h3 className="text-lg font-bold mt-0.5 flex items-center gap-1">Book Appointment <ChevronRight size={16} /></h3>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/admin/register" className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm active:scale-[0.97] transition-all">
                    <Building2 size={20} className="text-[#ff7600]" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block">Register Clinic</span>
                  </Link>
                  <Link href="/admin/login" className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm active:scale-[0.97] transition-all">
                    <ShieldAlert size={20} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block">Admin Terminal</span>
                  </Link>
                </div>
              </div>

              {/* NEARBY CLINICS FEED */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between"><h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Available Clinics</h3></div>
                <div className="space-y-3">
                  {clinicsList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-xl text-center">
                      <Loader2 className="animate-spin text-slate-300 mb-2" size={20} />
                      <p className="text-[11px] text-slate-400 font-medium">Querying distributed database node...</p>
                    </div>
                  ) : (
                    clinicsList
                      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((clinic) => (
                        <div 
                          key={clinic.id}
                          onClick={() => handleClinicSelection(clinic)}
                          className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
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
                <h2 className="text-xl font-black text-slate-900">{selectedClinic?.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select an available medical practitioner</p>
              </div>
              
              {loading ? (
                <div className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <Loader2 className="animate-spin text-[#ff7600]" size={18} />
                  <span className="text-xs text-slate-500 font-bold tracking-tight">Loading clinical staff roster...</span>
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
                        className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">{doc.name[0]}</div>
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
            <motion.div key="slots" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-6">
              <button onClick={() => setBookingStep("choose-doctor")} className="flex items-center gap-1 text-xs font-bold text-slate-500 active:opacity-70"><ArrowLeft size={14} /> Back to Staff</button>
              <div>
                <h2 className="text-xl font-black text-slate-900">Select Consultation Slot</h2>
                <p className="text-xs text-slate-400 mt-0.5">With Dr. {selectedDoctor?.name}</p>
              </div>
              
              {loading ? (
                <div className="flex items-center gap-3 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <Loader2 className="animate-spin text-indigo-600" size={18} />
                  <span className="text-xs text-slate-500 font-bold tracking-tight">Verifying real-time availability...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {slotsList.length === 0 ? (
                    <div className="col-span-2 text-xs text-slate-400 p-4 bg-slate-50 rounded-xl text-center font-medium">No open consultation sessions remaining for today.</div>
                  ) : (
                    slotsList.map((slotItem) => (
                      <button 
                        key={slotItem.id}
                        onClick={() => { setSelectedSlot(slotItem); setBookingStep("verification"); }}
                        className="p-4 bg-white border border-slate-100 rounded-xl text-center font-bold text-xs text-slate-700 hover:border-[#ff7600] hover:text-[#ff7600] shadow-sm active:scale-[0.96] transition-all"
                      >
                        <Clock size={14} className="inline mr-1 mb-0.5" /> {slotItem.formatted?.time || "Consultation Slot"}
                      </button>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP D: PHONE / FIELD VERIFICATION */}
          {bookingStep === "verification" && (
            <motion.div key="verification" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Patient Verification</h2>
                <p className="text-xs text-slate-400 mt-0.5">Secure your appointment at {selectedClinic?.name}</p>
              </div>
              
              {errorFeedback && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold text-xs animate-shake">{errorFeedback}</div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" placeholder="Full Legal Name" 
                    value={patientData.fullName} onChange={(e) => setPatientData({...patientData, fullName: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none shadow-sm focus:border-slate-300 transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" placeholder="Mobile Number" 
                    value={patientData.phone} onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none shadow-sm focus:border-slate-300 transition-all"
                  />
                </div>
                <div className="relative">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" placeholder="Email Address" 
                    value={patientData.email} onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none shadow-sm focus:border-slate-300 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" placeholder="Reason for Consultation" 
                    value={patientData.reason} onChange={(e) => setPatientData({...patientData, reason: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none shadow-sm focus:border-slate-300 transition-all"
                  />
                </div>
              </div>
              <button 
                onClick={handleFinalBookingSubmit}
                disabled={!patientData.fullName || !patientData.phone || !patientData.email || loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-30 flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Executing Transaction...
                  </>
                ) : "Confirm Booking"}
              </button>
            </motion.div>
          )}

          {/* STEP E: SUCCESS MATRIX */}
          {bookingStep === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm"><CheckCircle2 size={32} /></div>
              <h2 className="text-xl font-black text-slate-900">Appointment Secured!</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your confirmation reference has been dispatched. Present this token at **{selectedClinic?.name}** on arrival with **Dr. {selectedDoctor?.name}** at **{selectedSlot?.formatted?.time}**.
              </p>
              <button 
                onClick={() => { 
                  setBookingStep("home"); 
                  setPatientData({fullName:"", phone:"", email:"", reason: "General Consultation"}); 
                  setSelectedClinic(null);
                  setSelectedDoctor(null);
                  setSelectedSlot(null);
                }} 
                className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.97]"
              >
                Return to Portal
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP VIEW: MARKETING LANDING SUITE (UNTOUCHED)                        */}
      {/* ========================================================================= */}
      <div className="hidden md:block">
        <section ref={sectionRef} className="relative z-40 min-h-screen flex items-center overflow-visible bg-[url('/images/grid-background-desktop.png')] bg-cover bg-center bg-no-repeat lg:bg-top pt-24 pb-20 md:pt-40 lg:pt-48">
          <div className="absolute inset-0 -z-20 overflow-hidden">
            <div className="absolute top-[-5%] left-[-5%] w-[800px] h-[800px] bg-[#ff7600]/20 blur-[130px] rounded-full animate-pulse opacity-70"></div>
          </div>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles size={14} /> V2.0 AI Integration Ready
                </div>
                <h1 className="font-extrabold tracking-tight text-5xl lg:text-6xl text-indigo-950 leading-[1.1]">
                  {words.map((word, index) => (
                    <motion.span key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={word === "Scheduling." ? "text-[#ff7600] inline-block mr-2" : "inline-block mr-2"}>
                      {word}
                    </motion.span>
                  ))}
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-xl">The ultimate workspace for modern clinics. Centralize your data, automate patient bookings, and reclaim your time.</p>
                <div className="flex flex-row items-center gap-4 mt-10">
                  <Link href="/admin/register" className="bg-[#ff7600] text-white py-4 px-8 rounded-2xl text-base font-bold transition-all hover:bg-[#e56b00]">Get Started Free</Link>
                  <Link href="/admin/login" className="border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-2xl text-base font-bold tracking-tight bg-white/40">Admin Login</Link>
                </div>
              </div>
              <div className="relative flex justify-center items-center">
                <Image src="/images/new-doc05.png" alt="3D illustration" width={600} height={600} priority className="drop-shadow-xl" />
              </div>
            </div>
          </div>
          <FloatingTrustCard />
        </section>
        <FeaturesSection />
        <PatientExperience />
        <CTASection />
        <Footer />
      </div>

    </div>
  );
}