"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, Mail, Phone, Loader2, CheckCircle } from "lucide-react";

export default function AppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 flex flex-col items-center text-center"
      >
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
        <p className="text-slate-500 font-medium">Our team will call you shortly to confirm your slot.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            required
            type="text" 
            placeholder="Tobi Paul"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#ff7600]/20 focus:border-[#ff7600] outline-none transition-all font-semibold text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            required
            type="email" 
            placeholder="tobipaul@gmail.com"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#ff7600]/20 focus:border-[#ff7600] outline-none transition-all font-semibold text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            required
            type="tel" 
            placeholder="+234..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#ff7600]/20 focus:border-[#ff7600] outline-none transition-all font-semibold text-slate-800"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Preferred Date</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            required
            type="date" 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#ff7600]/20 focus:border-[#ff7600] outline-none transition-all font-semibold text-slate-800"
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="md:col-span-2 w-full bg-[#ff7600] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#e56b00] transition-all shadow-xl shadow-orange-200 flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Request Appointment Now"}
      </button>
    </form>
  );
}