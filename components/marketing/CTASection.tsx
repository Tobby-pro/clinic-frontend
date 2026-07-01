"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Sparkles, UserCheck } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-50/30 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,118,0,0.06),transparent_70%)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-200/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: TEXT COLLATERAL & TEASER UI FORM */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8 text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-2">
              <Sparkles size={14} className="text-[#ff7600]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Start Your Journey</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-indigo-950 tracking-tight leading-[1.1]">
              Ready to <span className="text-[#ff7600]">modernize</span> <br className="hidden md:block" /> your clinic experience?
            </h2>
            
            <p className="text-slate-500 text-base md:text-sm max-w-xl leading-relaxed">
              Join a community of patients and providers who value time, security, and effortless scheduling.
            </p>

            {/* THE TEASER UI - Acts as a massive link to Login */}
            <Link href="/login" className="group block relative w-full max-w-2xl pt-2">
              <div className="relative inline-block p-1.5 rounded-[2.5rem] bg-gradient-to-b from-slate-200 to-slate-100 border border-white shadow-xl transition-transform duration-500 group-hover:scale-[1.01] active:scale-[0.99] w-full">
                <div className="bg-white rounded-[2rem] px-6 py-10 md:px-10 flex flex-col items-center">
                  
                  {/* Mock UI Elements */}
                  <div className="w-full flex flex-col md:flex-row gap-3 mb-6">
                      <div className="flex-1 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center px-4 text-slate-400 font-medium text-xs">
                          Select a Department...
                      </div>
                      <div className="flex-1 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center px-4 text-slate-400 font-medium text-xs">
                          Choose preferred date...
                      </div>
                  </div>

                  <div className="flex flex-col items-center gap-5 text-center">
                      <div className="h-14 w-14 bg-orange-50 rounded-full flex items-center justify-center text-[#ff7600] group-hover:bg-[#ff7600] group-hover:text-white transition-all duration-500">
                          <Calendar size={24} />
                      </div>
                      
                      <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-900">Sign in to book your spot</h3>
                          <p className="text-slate-500 text-xs px-2">You’ll need a patient account to manage your health data securely.</p>
                      </div>

                      <div className="flex items-center gap-2.5 bg-[#ff7600] text-white px-8 py-4 rounded-xl font-bold text-base shadow-[0_12px_24px_-8px_rgba(255,118,0,0.5)] group-hover:shadow-[0_16px_32px_-8px_rgba(255,118,0,0.6)] transition-all mt-2">
                          <UserCheck size= {18} />
                          Access Patient Portal
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                  </div>

                  {/* Overlay Glass Effect */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 🎯 RIGHT COLUMN: THE RE-ALLOCATED PREMIUM 3D ILLUSTRATION */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 hidden lg:flex justify-center items-center relative"
          >
            {/* Subtle supporting background halo */}
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-indigo-500/0 blur-2xl rounded-full transform scale-75 animate-pulse" />
            
            <div className="relative w-full max-w-[440px] h-[440px]">
              <Image 
                src="/images/new-doc05.png" 
                alt="ClinBox Premium 3D Workspace Illustration" 
                fill
                priority 
                className="drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] object-contain select-none pointer-events-none transform hover:scale-[1.02] transition-transform duration-700 ease-out" 
              />
            </div>
          </motion.div>

        </div>

        {/* TRUST FOLLOWER */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center md:justify-start gap-8 opacity-40">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            Trusted by leading clinics nationwide
          </span>
        </div>
      </div>
    </section>
  );
}