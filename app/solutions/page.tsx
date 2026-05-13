"use client";

import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const solutionCards = [
  {
    title: "Clinical Operations",
    description: "Centralize your clinic's master ledger and appointment registry in one secure hub.",
    icon: <Building2 className="text-[#ff7600]" size={24} />,
    stats: "40% Faster Check-ins"
  },
  {
    title: "Medical Practitioners",
    description: "Focus on care while we handle automated patient alerting and document verification.",
    icon: <Stethoscope className="text-[#ff7600]" size={24} />,
    stats: "Zero Paperwork"
  },
  {
    title: "Patient Management",
    description: "Provide a seamless experience from booking to billing with automated compliance checks.",
    icon: <Users2 className="text-[#ff7600]" size={24} />,
    stats: "99% Retention Rate"
  }
];

export default function SolutionsPage() {
  return (
    <main className={`relative min-h-screen bg-white overflow-hidden ${poppins.className}`}>
      {/* 1. BACKGROUND TEXTURE */}
      <div className="absolute inset-0 z-0 opacity-[0.3] bg-[url('/images/grid-background-desktop.png')] bg-top pointer-events-none" />
      
      {/* 2. AMBIENT GLOWS */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff7600]/15 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-orange-200/20 blur-[100px] rounded-full" />

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HERO SECTION: TEXT + ILLUSTRATION GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          
          {/* LEFT SIDE: TEXT CONTENT */}
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              The Clinbox Ecosystem
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-5xl font-extrabold text-indigo-950 tracking-tight leading-[1.1] mb-6"
            >
              Built for the <span className="text-[#ff7600]">Modern</span> <br /> Healthcare Workflow.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed"
            >
              A well-defined registry system that bridges the gap between patient care and 
              administrative precision. Secure, encrypted, and lightning-fast.
            </motion.p>
            
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="mt-8 flex items-center gap-4"
            >
                <Link href="/admin/register" className="bg-[#ff7600] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-[#e56b00] transition-all">
                    Start Building
                </Link>
                <Link href="/demo" className="text-slate-900 font-bold text-sm hover:text-[#ff7600] transition-colors">
                    View Demo
                </Link>
            </motion.div>
          </div>

          {/* RIGHT SIDE: THE ILLUSTRATION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Floating Animation Wrapper */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-8 border-white/50 backdrop-blur-sm"
            >
               <Image 
                src="/images/clin-doc.png" // Ensure the extension matches (jpg/png)
                alt="Clinic Solutions Illustration"
                fill
                className="object-cover"
                priority
               />
            </motion.div>

            {/* Decorative background circle for the image */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-50/50 rounded-full blur-3xl" />
          </motion.div>

        </div>

        {/* SOLUTIONS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {solutionCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(255,118,0,0.1)] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                {card.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[10px] font-bold text-[#ff7600] uppercase tracking-wider">{card.stats}</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#ff7600] group-hover:text-white transition-colors">
                  <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SECONDARY "TRUST" SECTION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative p-12 rounded-[3rem] bg-slate-900 text-white overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7600]/20 blur-[100px] -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Security & Compliance First.</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="text-[#ff7600]" size={20} />
                  <p className="text-sm font-medium">256-bit AES Encryption for all clinic records</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Zap className="text-[#ff7600]" size={20} />
                  <p className="text-sm font-medium">Automated Registry Sync with Local Master Ledgers</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <BarChart3 className="text-[#ff7600]" size={20} />
                  <p className="text-sm font-medium">Real-time Compliance Monitoring Bot</p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 font-medium mb-8">Ready to transform your clinic workflow?</p>
              <Link
                href="/admin/register"
                className="inline-flex items-center gap-3 bg-[#ff7600] hover:bg-[#e56b00] text-white px-10 py-5 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-orange-900/20"
              >
                Get Started Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}