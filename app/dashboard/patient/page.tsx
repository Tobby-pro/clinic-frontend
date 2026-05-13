// app/appointments/patient/page.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, ChevronRight, Activity, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { getPatients } from "@/services/api"; 

interface Patient {
  id: string | number;
  full_name: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  last_visit?: string;
}

export default function PatientRegistryPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      
      {/* HEADER - Maintaining Brand Consistency */}
      <header className="flex items-center justify-between pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Patient Index
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Verified Medical Database
            </p>
          </div>
        </div>

        {/* ✅ Fixed Link: Ensuring consistency with singular 'patient' route */}
        <Link href="/dashboard/patient/create">
          <button className="flex items-center gap-2 bg-[#ff7600] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-black transition-all active:scale-95">
            <UserPlus size={14} strokeWidth={3} />
            <span>Enroll Patient</span>
          </button>
        </Link>
      </header>

      {/* SEARCH SECTION */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by ID, Name, or Phone..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl outline-none text-sm font-medium shadow-sm focus:border-blue-100 transition-all"
        />
      </div>

      {/* PATIENT LIST */}
      <div className="grid gap-3">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="font-black text-gray-400 uppercase tracking-[0.2em] text-[10px]">
            Master Ledger
          </h2>
          <div className="h-[1px] flex-1 bg-gray-100 ml-4" />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <AnimatePresence>
            {filteredPatients.map((patient) => (
              /* ✅ Fixed Link: Changed from 'patients' to 'patient' to match /app/dashboard/patient/[id]/page.tsx */
              <Link key={patient.id} href={`/dashboard/patient/${patient.id}`}>
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 5 }}
                  className="group bg-white border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all p-5 rounded-3xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-50 transition-colors">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg tracking-tight">{patient.full_name}</h3>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                        <span className="text-blue-600">ID: {patient.id}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span>{patient.gender || "Not Set"}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span>{patient.phone_number || "No Contact"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-xl text-gray-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}