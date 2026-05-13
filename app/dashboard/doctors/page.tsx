"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  Search,
  Loader2,
  Database,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { getDoctors, createDoctor as apiCreateDoctor } from "@/services/api";
import useUser from "@/app/hooks/useUser";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  available: boolean;
}

export default function DoctorsPage() {
  const { user, loading: userLoading } = useUser() as any;
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const clinicStatus = user?.clinic?.status || user?.clinic_status || "pending";

  const fetchDoctors = async () => {
    try {
      setFetching(true);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch doctors");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const createDoctor = async () => {
    if (!name.trim() || !specialty.trim()) {
      setError("Name and Specialty are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiCreateDoctor({ name, specialty });
      setName("");
      setSpecialty("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchDoctors();
    } catch (err: any) {
      setError(err.message || "Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyles = "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 shadow-sm";

  if (userLoading || (fetching && doctors.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-6 animate-pulse">
          Querying Staff Registry
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      
      {/* 1. VERIFICATION BANNER */}
      <AnimatePresence>
        {clinicStatus === "pending" && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-6 mb-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-[#ff7600] p-3 rounded-2xl text-white shadow-lg shadow-orange-200">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Verification Gate Active</h4>
                  <p className="text-[12px] text-gray-600 font-medium mt-1 leading-relaxed">
                    To enable public bookings, please upload your <b>HEFAMAA</b> or <b>CAC</b> documents.
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-6 py-3 bg-white border border-orange-100 text-[#ff7600] text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#ff7600] hover:text-white transition-all active:scale-95 shadow-sm">
                Verify Entity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Medical Staff
          </h1>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-50 rounded-md">
              <Database size={12} className="text-blue-500" />
            </div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
              {doctors.length} Registered Practitioners
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
          <input 
            type="text"
            placeholder="Search Practitioner Registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-[1.5rem] text-[12px] font-bold focus:border-blue-200 transition-all outline-none shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT: ONBOARDING FORM */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <span className="flex-none bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded">ADD</span>
            <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
              Secure Onboarding
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Professional Name</label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50" size={18} />
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${inputStyles} pl-12`}
                  placeholder="Dr. Oluchi Adenuga"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Primary Specialty</label>
              <div className="relative">
                <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50" size={18} />
                <input 
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className={`${inputStyles} pl-12`}
                  placeholder="e.g. Pediatrics"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={createDoctor}
              disabled={loading}
              className={`
                w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl
                ${success ? "bg-green-600 text-white shadow-green-500/20" : "bg-[#ff7600] text-white shadow-orange-500/20 hover:bg-black"}
                disabled:opacity-60
              `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verified & Linked</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} strokeWidth={3} />
                  <span>Authorize Practitioner</span>
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-wider justify-center border border-red-100"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: ACTIVE REGISTRY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <span className="flex-none bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded">LIVE</span>
            <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
              Active Branch Directory
            </h2>
            <div className="h-[1px] flex-1 bg-gray-100" />
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Stethoscope size={24} strokeWidth={2} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-base font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        Dr. {doc.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest bg-blue-50/50 px-2 py-0.5 rounded-md">
                          {doc.specialty}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${doc.available ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                            {doc.available ? "On Duty" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                    <ArrowRight size={18} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredDoctors.length === 0 && !fetching && (
              <div className="text-center py-20 bg-gray-50/30 rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search size={24} className="text-gray-200" />
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
                  Registry Empty
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* PERSISTENCE FOOTER */}
      <footer className="pt-10 flex flex-col items-center md:items-start border-t border-gray-100">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
            Cloud SQL Real-Time Ledger • Encrypted Node
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">
          Authorized Nigerian Health Network Node • Lagos Branch Registry
        </p>
      </footer>
    </div>
  );
}