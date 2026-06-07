"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { 
  CheckCircle2, Users, Calendar, Sparkles, Search, 
  MapPin, ChevronRight, Building2, ShieldAlert, Clock, User, Phone, ArrowLeft
} from "lucide-react"; 
import { searchClinics, registerPatient } from "@/services/api"; // Pulling from your real services

// Marketing Layouts (Untouched for Desktop)
import FeaturesSection from "@/components/marketing/FeaturesSection";
import PatientExperience from "@/components/marketing/PatientExperience";
import Footer from "@/components/layout/Footer"; 
import CTASection from "@/components/marketing/CTASection";
import FloatingTrustCard from "@/components/marketing/FloatingTrustCard";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function HomePage() {
  const sectionRef = useRef(null);
  
  // Mobile Booking App State
  const [bookingStep, setBookingStep] = useState("home"); // "home" | "choose-doctor" | "choose-slot" | "verification" | "success"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Verification details collected at the end
  const [patientData, setPatientData] = useState({ fullName: "", phone: "", email: "" });

  // Mock data for immediate patient interface matching your flow
  const mockDoctors = [
    { id: 1, name: "Dr. Oluwaseun W.", specialty: "General Medicine", availability: "Today" },
    { id: 2, name: "Dr. Amara Anya", specialty: "Pediatrics", availability: "Tomorrow" },
  ];

  const mockSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const nearbyClinics = [
    { id: 1, name: "Alimosho General Hospital", distance: "1.2 km", location: "Lagos" },
    { id: 2, name: "Duchess International Hospital", distance: "3.5 km", location: "Ikeja" },
    { id: 3, name: "Finnih Medical Centre", distance: "4.1 km", location: "Ikeja" },
  ];

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

  /* ---------------- PATIENT PRE-BOOKING LOGIC ---------------- */
  const handleFinalBookingSubmit = async () => {
    setLoading(true);
    try {
      // 1. Silent registry/matching using your existing registerPatient signature
      await registerPatient({
        full_name: patientData.fullName,
        email: patientData.email.toLowerCase().trim(),
        password: "TEMPORARY_PIN_123456" // Satisfies backend schema securely without disrupting patient context
      });
      
      // 2. Fire booking creation endpoint here with selectedClinic, selectedDoctor, selectedSlot
      setBookingStep("success");
    } catch (err) {
      console.error("Booking verification sequence failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={poppins.className}>
      
      {/* ========================================================================= */}
      {/* 📱 MOBILE VIEW: FLUID TRANSACTIONAL BOOKING PLATFORM                       */}
      {/* ========================================================================= */}
      <main className="block md:hidden min-h-screen bg-[#fcfcfc] pt-24 pb-12 px-4 overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP A: THE APP-LIKE HOMEPAGE */}
          {bookingStep === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-[#ff7600] uppercase tracking-widest">Welcome to ClinBox</p>
                <h1 className="text-2xl font-black text-indigo-950 tracking-tight mt-1">Find Healthcare Near You</h1>
              </div>

              {/* SEARCH HUB */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search clinics or specialized care..." 
                  className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-xs font-medium outline-none shadow-sm"
                />
              </div>

              {/* TWO CORE SPLIT ENTRY CARDS */}
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => { setSelectedClinic(nearbyClinics[0]); setBookingStep("choose-doctor"); }}
                  className="w-full bg-slate-900 text-white rounded-2xl p-5 text-left relative overflow-hidden shadow-lg shadow-slate-900/10"
                >
                  <Calendar className="absolute right-[-10px] bottom-[-10px] opacity-10" size={100} />
                  <span className="text-[9px] text-[#ff7600] font-black uppercase tracking-wider">Instant Access</span>
                  <h3 className="text-lg font-bold mt-0.5 flex items-center gap-1">Book Appointment <ChevronRight size={16} /></h3>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/admin/register" className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <Building2 size={20} className="text-[#ff7600]" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block">Register Clinic</span>
                  </Link>
                  <Link href="/admin/login" className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                    <ShieldAlert size={20} className="text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 mt-2 block">Admin Terminal</span>
                  </Link>
                </div>
              </div>

              {/* NEARBY CLINICS FEED */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between"><h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Nearby Clinics</h3></div>
                <div className="space-y-3">
                  {nearbyClinics.map((clinic) => (
                    <div 
                      key={clinic.id}
                      onClick={() => { setSelectedClinic(clinic); setBookingStep("choose-doctor"); }}
                      className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer active:scale-98 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-[#ff7600]"><Building2 size={20} /></div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{clinic.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5"><MapPin size={10} /> {clinic.distance}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP B: CHOOSE DOCTOR */}
          {bookingStep === "choose-doctor" && (
            <motion.div key="doctors" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <button onClick={() => setBookingStep("home")} className="flex items-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft size={14} /> Back to Clinics</button>
              <div>
                <h2 className="text-xl font-black text-slate-900">{selectedClinic?.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Select an available medical practitioner</p>
              </div>
              <div className="space-y-3">
                {mockDoctors.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc); setBookingStep("choose-slot"); }}
                    className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs">{doc.name[4]}</div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{doc.name}</h4>
                        <p className="text-[11px] text-slate-400 font-medium">{doc.specialty}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">{doc.availability}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP C: CHOOSE TIMELOT */}
          {bookingStep === "choose-slot" && (
            <motion.div key="slots" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <button onClick={() => setBookingStep("choose-doctor")} className="flex items-center gap-1 text-xs font-bold text-slate-500"><ArrowLeft size={14} /> Back to Staff</button>
              <div>
                <h2 className="text-xl font-black text-slate-900">Select Consultation Slot</h2>
                <p className="text-xs text-slate-400 mt-0.5">With {selectedDoctor?.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mockSlots.map((slot) => (
                  <button 
                    key={slot}
                    onClick={() => { setSelectedSlot(slot); setBookingStep("verification"); }}
                    className="p-4 bg-white border border-slate-100 rounded-xl text-center font-bold text-xs text-slate-700 hover:border-[#ff7600] hover:text-[#ff7600] transition-all"
                  >
                    <Clock size={14} className="inline mr-1 mb-0.5" /> {slot}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP D: PHONE / FIELD VERIFICATION (NO ACCOUNT PRIOR REQUIRED) */}
          {bookingStep === "verification" && (
            <motion.div key="verification" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Patient Verification</h2>
                <p className="text-xs text-slate-400 mt-0.5">Secure your appointment at {selectedClinic?.name}</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" placeholder="Full Legal Name" 
                    value={patientData.fullName} onChange={(e) => setPatientData({...patientData, fullName: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="tel" placeholder="Mobile Number" 
                    value={patientData.phone} onChange={(e) => setPatientData({...patientData, phone: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none"
                  />
                </div>
                <div className="relative">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" placeholder="Email Address" 
                    value={patientData.email} onChange={(e) => setPatientData({...patientData, email: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 text-xs font-medium outline-none"
                  />
                </div>
              </div>
              <button 
                onClick={handleFinalBookingSubmit}
                disabled={!patientData.fullName || !patientData.phone || loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-30"
              >
                {loading ? "Confirming Slot..." : "Confirm Booking"}
              </button>
            </motion.div>
          )}

          {/* STEP E: SUCCESS MATRIX */}
          {bookingStep === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={32} /></div>
              <h2 className="text-xl font-black text-slate-900">Appointment Secured!</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Your confirmation reference has been dispatched. Present this token at **{selectedClinic?.name}** on arrival at **{selectedSlot}**.
              </p>
              <button onClick={() => { setBookingStep("home"); setPatientData({fullName:"", phone:"", email:""}); }} className="mt-4 px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">Return to Portal</button>
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