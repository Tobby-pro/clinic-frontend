"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Sparkles, UserCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-32 bg-slate-50/30 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,118,0,0.08),transparent_70%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-200/20 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <Sparkles size={14} className="text-[#ff7600]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Start Your Journey</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-indigo-950 mb-6 tracking-tight leading-none">
            Ready to <span className="text-[#ff7600]">modernize</span> <br className="hidden md:block" /> your clinic experience?
          </h2>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            Join a community of patients and providers who value time, security, and effortless scheduling.
          </p>

          {/* THE TEASER UI - Acts as a massive link to Login */}
          <Link href="/login" className="group block relative">
            <div className="relative inline-block p-1.5 rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-slate-100 border border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] active:scale-[0.98] w-full max-w-3xl">
              <div className="bg-white rounded-[2rem] px-8 py-12 md:px-16 flex flex-col items-center">
                
                {/* Mock UI Elements to look like a form start */}
                <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center px-4 text-slate-400 font-medium text-sm">
                        Select a Department...
                    </div>
                    <div className="flex-1 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center px-4 text-slate-400 font-medium text-sm">
                        Choose preferred date...
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="h-16 w-16 bg-orange-50 rounded-full flex items-center justify-center text-[#ff7600] group-hover:bg-[#ff7600] group-hover:text-white transition-all duration-500">
                        <Calendar size={28} />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Sign in to book your spot</h3>
                        <p className="text-slate-500 text-sm">You’ll need a patient account to manage your health data securely.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#ff7600] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_15px_30px_-10px_rgba(255,118,0,0.5)] group-hover:shadow-[0_20px_40px_-10px_rgba(255,118,0,0.6)] transition-all">
                        <UserCheck size={20} />
                        Access Patient Portal
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Overlay Glass Effect to signify it's a "Teaser" */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
              </div>
            </div>
          </Link>
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Trusted by leading clinics nationwide</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}