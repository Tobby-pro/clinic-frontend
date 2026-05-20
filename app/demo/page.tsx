// app/demo/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";
import { 
  Sparkles, 
  Video, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  Mail, 
  ArrowRight 
} from "lucide-react";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function BookDemoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    facilityName: "",
  });

  const valueProps = [
    {
      icon: <Video className="text-[#ff7600]" size={18} />,
      title: "Personalized 15-Min Walkthrough",
      desc: "No generic slide decks. See exactly how Clinbox manages your specific clinical workflows.",
    },
    {
      icon: <Layers className="text-[#ff7600]" size={18} />,
      title: "Live Architecture Deep-Dive",
      desc: "Explore the Clinical Master Ledger, automated billing tracks, and patient self-scheduling engine.",
    },
    {
      icon: <Zap className="text-[#ff7600]" size={18} />,
      title: "Custom Migration Strategy",
      desc: "Learn how we seamlessly transfer your active patient records from legacy software with zero downtime.",
    },
  ];

  const availableTimes = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    
    setLoading(true);
    // Simulate API pipeline dispatch for meeting schedule coordination
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <AuthLayoutWrapper showBackButton={true}>
      <main className={`relative min-h-screen bg-slate-50 pt-32 pb-20 overflow-hidden ${poppins.className}`}>
        
        {/* BRANDED GRAPHIC BACKGROUND */}
        <div className="absolute inset-0 z-0 opacity-[0.2] bg-[url('/images/grid-background-desktop.png')] bg-top pointer-events-none" />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#ff7600]/10 blur-[120px] rounded-full pointer-events-none" />

        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: VALUE PROPOSITION */}
            <div className="lg:col-span-5 text-center lg:text-left mt-4 lg:mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-[10px] font-black uppercase tracking-wider mb-6"
              >
                <Sparkles size={12} />
                Experience Clinbox Live
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight leading-[1.1] mb-6"
              >
                See how we power <span className="text-[#ff7600]">modern</span> clinics.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base text-slate-600 leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
              >
                Discover how our intelligent scheduling platform eliminates administrative gridlock, manages role scopes securely, and cuts patient wait times by up to 40%.
              </motion.p>

              {/* STYLED BENEFITS LIST */}
              <div className="space-y-6 text-left max-w-xl mx-auto lg:mx-0">
                {valueProps.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-sm backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-indigo-950 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* COMPLIANCE FOOTER NOTE */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10 flex items-center justify-center lg:justify-start gap-4 opacity-60 px-4"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-[#ff7600]" /> NHN Compliant Node
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-[#ff7600]" /> NDPR Data Encrypted
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: NATIVE INTERACTIVE SCREEN LAYERS */}
            <div className="lg:col-span-7 w-full flex justify-center">
              <motion.div 
                layout
                className="w-full max-w-[580px] bg-white border border-slate-200/80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-10 relative min-h-[580px] flex flex-col justify-center"
              >
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="booking-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleFormSubmit}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-indigo-950 tracking-tight">Schedule Your Consultation</h2>
                        <p className="text-xs text-slate-400 font-medium mt-1">Select your preferred date window and details.</p>
                      </div>

                      {/* DATE & TIME INTEGRATED GRID CONTAINER */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Calendar size={12} className="text-[#ff7600]" /> Target Date
                          </label>
                          <input 
                            type="date" 
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-xl p-4 text-sm font-medium outline-none transition-all text-slate-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Clock size={12} className="text-[#ff7600]" /> Available Slot
                          </label>
                          <select 
                            required
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-xl p-4 text-sm font-medium outline-none transition-all text-slate-700 appearance-none"
                          >
                            <option value="">Choose a time...</option>
                            {availableTimes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <hr className="border-slate-100" />

                      {/* USER DEMOGRAPHICS DATA STREAM */}
                      <div className="space-y-4">
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="Your Full Name"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="email" 
                            placeholder="Work Email Address"
                            required
                            value={formData.workEmail}
                            onChange={(e) => setFormData({...formData, workEmail: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all"
                          />
                        </div>

                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            placeholder="Hospital / Medical Center Name"
                            required
                            value={formData.facilityName}
                            onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-xl py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={loading || !selectedDate || !selectedTime}
                        className="w-full bg-slate-900 text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#ff7600] active:scale-[0.99] transition-all disabled:opacity-30 unique-btn-shadow"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Confirm Demo Slot <ArrowRight size={14} /></>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    /* NATIVE TRANSACTION COMPLETION FEEDBACK CARD */
                    <motion.div 
                      key="success-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6 py-6"
                    >
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 size={32} />
                      </div>
                      
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-indigo-950 tracking-tight">Demo Slot Confirmed!</h2>
                        <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                          Excellent. We've locked in your presentation parameters and configured a temporary workspace sandbox for your facility.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-wider">Facility</span>
                          <span className="font-bold text-indigo-950">{formData.facilityName}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-wider">Date Window</span>
                          <span className="font-bold text-indigo-950">{selectedDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-wider">Target Time</span>
                          <span className="font-bold text-[#ff7600]">{selectedTime}</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-400">
                        An access token and meeting calendar invite has been sent to <span className="text-slate-700 font-bold">{formData.workEmail}</span>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </section>
      </main>
    </AuthLayoutWrapper>
  );
}