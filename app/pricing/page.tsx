// app/pricing/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins } from "next/font/google";
import { 
  Check, 
  Building2, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function PublicPricingPage() {
  const [activeTab, setActiveTab] = useState<"clinic" | "patient">("clinic");

  const clinicPlans = [
    {
      label: "Corporate License",
      amount: "30,000",
      period: "/ Year",
      desc: "Full infrastructure for multi-specialty clinics.",
      features: ["Unlimited Appointments", "Clinical Master Ledger", "Compliance Bot Pro", "Staff Role Management"],
      icon: <Building2 size={24} />,
      color: "bg-slate-900",
    }
  ];

  const patientPlans = [
    { label: "Basic", amount: "2,000", period: "/ Mo", desc: "Essential health access.", features: ["Digital Records", "Basic Alerts"], icon: <ShieldCheck size={20} /> },
    { label: "Premium", amount: "5,000", period: "/ Mo", desc: "Priority care for individuals.", features: ["Priority Booking", "Verified Docs", "Telehealth Access"], icon: <Zap size={20} />, popular: true },
    { label: "Family", amount: "12,000", period: "/ Mo", desc: "Full coverage for up to 5.", features: ["Family Ledger", "Group Records", "24/7 Support"], icon: <Users size={20} /> },
  ];

  return (
    <AuthLayoutWrapper showBackButton={true}>
      <main className={`relative min-h-screen bg-white pt-32 pb-20 overflow-hidden ${poppins.className}`}>
        {/* BRANDED BACKGROUND */}
        <div className="absolute inset-0 z-0 opacity-[0.2] bg-[url('/images/grid-background-desktop.png')] bg-top pointer-events-none" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ff7600]/10 blur-[120px] rounded-full" />

        <section className="relative z-10 max-w-7xl mx-auto px-6">
          {/* HEADER */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-slate-900 tracking-tight mb-6"
            >
              Flexible plans for <span className="text-[#ff7600]">everyone</span>.
            </motion.h1>
            
            {/* THE MATURE TOGGLE */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-[2rem] border border-slate-200 shadow-inner">
              <button 
                onClick={() => setActiveTab("clinic")}
                className={`px-10 py-3 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === "clinic" ? "bg-white text-[#ff7600] shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                For Clinics
              </button>
              <button 
                onClick={() => setActiveTab("patient")}
                className={`px-10 py-3 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === "patient" ? "bg-white text-[#ff7600] shadow-md" : "text-slate-400 hover:text-slate-600"}`}
              >
                For Patients
              </button>
            </div>
          </div>

          {/* PRICING GRID */}
          <div className="flex flex-wrap justify-center gap-8">
            <AnimatePresence mode="wait">
              {activeTab === "clinic" ? (
                <motion.div 
                  key="clinic-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md"
                >
                  {clinicPlans.map((plan, i) => (
                    <div key={i} className="p-10 rounded-[3rem] bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform">
                        <Building2 size={120} />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-[11px] font-black text-[#ff7600] uppercase tracking-[0.2em] mb-4">{plan.label}</h3>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-5xl font-black">₦{plan.amount}</span>
                          <span className="text-slate-400 font-bold text-sm">{plan.period}</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-10 font-medium">{plan.desc}</p>
                        <ul className="space-y-5 mb-12">
                          {plan.features.map((f, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-sm font-bold text-slate-200">
                              <div className="w-5 h-5 rounded-full bg-[#ff7600]/20 flex items-center justify-center">
                                <Check size={12} className="text-[#ff7600]" />
                              </div>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Link href="/register" className="flex items-center justify-center gap-3 w-full py-5 bg-[#ff7600] hover:bg-[#e56b00] rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-orange-900/40">
                          Get Your Clinic Started <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6 w-full">
                  {patientPlans.map((plan, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-8 rounded-[2.5rem] bg-white border ${plan.popular ? 'border-[#ff7600] shadow-2xl shadow-orange-100' : 'border-slate-100 shadow-xl shadow-slate-100'} relative`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff7600] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter flex items-center gap-1">
                          <Sparkles size={10} /> Most Popular
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:text-[#ff7600]">
                        {plan.icon}
                      </div>
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{plan.label}</h3>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-3xl font-black text-slate-900">₦{plan.amount}</span>
                        <span className="text-slate-400 font-bold text-[10px]">{plan.period}</span>
                      </div>
                      <ul className="space-y-4 mb-10 min-h-[180px]">
                        {plan.features.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-[12px] font-bold text-slate-600">
                            <Check size={14} className="text-[#ff7600]" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/register" className={`block w-full py-4 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.popular ? 'bg-[#ff7600] text-white shadow-lg' : 'bg-slate-900 text-white'}`}>
                        Select Plan
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* TRUST FOOTER */}
          <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#ff7600]" size={20} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank-Grade 256-bit Encryption</span>
             </div>
             <div className="flex items-center gap-3">
                <Users className="text-[#ff7600]" size={20} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trusted by 50+ NHN Clinics</span>
             </div>
          </div>
        </section>
      </main>
    </AuthLayoutWrapper>
  );
}