"use client";

import { motion } from "framer-motion";
import { Smartphone, Bell, CalendarCheck, ShieldCheck, Sparkles, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PatientExperience() {
  return (
    <section className="relative py-32 overflow-hidden bg-white">
      {/* 1. GRID INTEGRATION - Constant Brand Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.4] bg-[url('/images/grid-background-desktop.png')] bg-top pointer-events-none" />

      {/* 2. MESH GRADIENT DEPTH - Pure Orange Brand Power */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute top-[10%] right[-5%] w-[600px] h-[600px] bg-[#ff7600]/15 blur-[130px] rounded-full animate-pulse opacity-70"></div>
        
        {/* Bottom Left Glow */}
        <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-orange-300/20 blur-[110px] rounded-full opacity-60"></div>
        
        {/* Center Aura for the Phone Mockup */}
        <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] bg-[#ff7600]/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* LEFT SIDE: THE VISUAL (Phone Mockup) */}
          <div className="relative order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 bg-white/30 backdrop-blur-2xl border border-white/60 p-2 rounded-[2.8rem] shadow-2xl max-w-[320px] mx-auto lg:ml-0"
            >
              <div className="bg-slate-950 rounded-[2.4rem] overflow-hidden border-4 border-slate-900 aspect-[9/19] relative">
                {/* Mockup Screen Content */}
                <div className="p-6 bg-white h-full relative font-sans">
                  {/* Status Bar Mock */}
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-bold text-slate-900">9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-4 h-4 bg-slate-100 rounded-full" />
                        <div className="w-4 h-4 bg-slate-100 rounded-full" />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-[#ff7600] uppercase tracking-widest mb-1">Available Today</p>
                  <p className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Book Your Visit</p>
                  
                  <div className="space-y-3">
                    {[
                        { time: "10:30 AM", dr: "Dr. Sarah Jenkins", type: "General Checkup" },
                        { time: "01:15 PM", dr: "Dr. Michael Chen", type: "Cardiology" },
                        { time: "04:00 PM", dr: "Dr. James Wilson", type: "Pediatrics" },
                    ].map((slot, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-3 border border-slate-100 rounded-2xl flex gap-3 items-center hover:border-orange-200 transition-colors cursor-pointer group"
                      >
                        <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff7600] group-hover:bg-[#ff7600] group-hover:text-white transition-all">
                           <Clock size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-slate-900">{slot.time}</p>
                          <p className="text-[9px] text-slate-500 font-medium">{slot.dr}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-slate-200 group-hover:border-[#ff7600] flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#ff7600] rounded-full scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Booking Confirmation Button */}
                  <div className="absolute bottom-8 left-6 right-6">
                    <div className="p-4 bg-[#ff7600] rounded-2xl text-center text-white font-bold text-sm shadow-[0_10px_20px_-5px_rgba(255,118,0,0.4)] hover:scale-[1.02] transition-transform cursor-pointer">
                        Confirm Appointment
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Reminder Card */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-16 top-24 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/80 flex items-center gap-4 z-20"
              >
                <div className="bg-[#ff7600] p-2.5 rounded-2xl text-white shadow-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#ff7600] uppercase tracking-widest">Live Alert</p>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">Dr. Sarah is ready!</p>
                </div>
              </motion.div>

              {/* Map/Location Mini Card */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 bottom-20 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/80 hidden md:flex items-center gap-3 z-20"
              >
                <div className="bg-slate-900 p-2 rounded-xl text-white">
                  <MapPin size={18} />
                </div>
                <p className="text-xs font-bold text-slate-800">Main Clinic, Block A</p>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: THE CONTENT */}
          <div className="order-1 lg:order-2">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/80 backdrop-blur-sm border border-orange-100 text-[#ff7600] text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles size={14} />
              Book With Your Doctor
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-8 leading-[1.1] tracking-tight">
              A smarter way to <span className="text-[#ff7600]">manage your health</span> from home.
            </h2>
            
            <div className="grid gap-8">
              {[
                {
                  icon: <Smartphone />,
                  title: "Book Anywhere, Anytime",
                  desc: "Forget long phone queues. Schedule your next visit in 60 seconds from your phone, 24/7."
                },
                {
                  icon: <CalendarCheck />,
                  title: "Real-Time Availability",
                  desc: "See exactly when your favorite doctor is free. No back-and-forth, just instant confirmation."
                },
                {
                  icon: <ShieldCheck />,
                title: "Your Medical History, Secured",
                  desc: "Access your prescriptions, test results, and past visits in one secure, private portal."
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff7600] group-hover:scale-110 group-hover:bg-[#ff7600] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#ff7600] transition-colors">{item.title}</h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4"
            >
              <Link 
                href="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] active:scale-95 group"
              >
                Book Your First Visit
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
              </Link>
              
              <p className="text-slate-400 text-xs font-medium">No account required to browse availability.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}