// app/patient/dashboard/setting/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  Camera, 
  Fingerprint, 
  CheckCircle2, 
  ShieldCheck, 
  HeartPulse, 
  Save,
  MapPin,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import useUser from "@/app/hooks/useUser";

export default function PatientSettings() {
  const { user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    blood_group: "",
    emergency_contact: "",
    address: ""
  });

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        blood_group: user.blood_group || "",
        emergency_contact: user.emergency_contact || "",
        address: user.address || ""
      };
      setFormData(data);
      setInitialData(data);
    }
  }, [user]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleSave = async () => {
    if (!isDirty || loading) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", 
      });

      if (!res.ok) throw new Error("Update failed");

      setInitialData(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refined styles: smaller text, medium weights, softer colors
  const inputStyles = "w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-500/5 text-sm text-gray-800 transition-all outline-none placeholder:text-gray-300 font-normal";
  const labelStyles = "text-[11px] font-medium text-gray-500 ml-1 uppercase tracking-wider";

  if (userLoading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-[#ff7600] rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#ff7600] rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-[10px] font-medium text-gray-400 uppercase tracking-[0.3em] animate-pulse">
        Securing Environment
      </p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 pt-6 px-4 md:px-0">
      
      {/* BREADCRUMB */}
      <nav className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            <Link href="/patient/dashboard" className="hover:text-[#ff7600] transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-900 font-semibold">Account Settings</span>
        </div>
        
        <Link href="/patient/dashboard" className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-all group">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Overview</span>
        </Link>
      </nav>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">My Profile</h1>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#ff7600]" />
          <p className="text-xs text-gray-500 font-normal">Your personal health data is encrypted and HIPAA compliant.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* HERO SECTION */}
        <div className="relative h-32 bg-gradient-to-br from-gray-50 to-orange-50/40 border-b border-gray-50">
          <div className="absolute -bottom-10 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-3xl flex items-center justify-center text-[#ff7600] border-4 border-white shadow-xl overflow-hidden">
                <div className="w-full h-full bg-orange-50/50 flex items-center justify-center">
                   <UserIcon size={40} strokeWidth={1.2} />
                </div>
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-[#ff7600] transition-all">
                <Camera size={14} />
              </button>
            </div>
            <div className="pb-3 hidden md:block">
               <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{formData.name || "Patient"}</h2>
               <p className="text-xs text-gray-500 font-normal">{formData.email}</p>
            </div>
          </div>
        </div>

        <div className="pt-16 p-6 md:p-12 space-y-10 md:space-y-12">
          
          {/* CORE IDENTITY */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <Fingerprint size={15} className="text-[#ff7600]" />
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Core Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelStyles}>Full Legal Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyles} placeholder="First and Last Name" />
              </div>
              <div className="space-y-2">
                <label className={labelStyles}>Registered Phone</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputStyles} placeholder="+234..." />
              </div>
            </div>
          </section>

          {/* MEDICAL INFO */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
              <HeartPulse size={15} className="text-[#ff7600]" />
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.2em]">Medical Reference</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelStyles}>Blood Type</label>
                <select value={formData.blood_group} onChange={(e) => setFormData({...formData, blood_group: e.target.value})} className={inputStyles}>
                  <option value="">Choose Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelStyles}>Emergency Contact</label>
                <input type="text" value={formData.emergency_contact} onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} placeholder="Name / Phone" className={inputStyles} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>Residential Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-4 text-gray-300" />
                <textarea 
                  rows={2}
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  className={`${inputStyles} pl-12 resize-none`}
                  placeholder="Enter your current living address"
                />
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-50">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">System Integrity</span>
               <span className="text-[10px] font-medium text-green-500 flex items-center gap-1.5 mt-1">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  Live Cloud Sync
               </span>
            </div>

            <motion.button
              whileHover={isDirty ? { scale: 1.01 } : {}}
              whileTap={isDirty ? { scale: 0.98 } : {}}
              onClick={handleSave}
              disabled={!isDirty || loading}
              className={`
                px-10 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2.5 w-full md:w-auto justify-center
                ${success ? "bg-green-600 text-white" : isDirty ? "bg-gray-900 text-white shadow-xl shadow-gray-200" : "bg-gray-100 text-gray-400"}
              `}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Syncing...</span>
                  </motion.div>
                ) : success ? (
                  <motion.div key="success" initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <span>Records Updated</span>
                  </motion.div>
                ) : (
                  <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Save size={18} className={isDirty ? "text-[#ff7600]" : ""} />
                    <span>{isDirty ? "Commit Changes" : "No Changes"}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}