// app/dashboard/patient/[id]/page.tsx

"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Activity, Calendar, Clock, 
  FileText, ShieldCheck, Phone, AlertCircle, Plus,
  CreditCard, UserCheck, Fingerprint, MapPin
} from "lucide-react";
import { getPatientById, getPatientHistory } from "@/services/api";

export default function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === "undefined" || id === "[id]") {
      setError("Invalid Patient Identifier");
      setLoading(false);
      return;
    }

    async function fetchDossier() {
      try {
        setLoading(true);
        // Fetches real data from your FastAPI backend
        const [patientData, historyData] = await Promise.all([
          getPatientById(id),
          getPatientHistory(id)
        ]);
        setPatient(patientData);
        setHistory(historyData);
      } catch (err: any) {
        console.error("Sync Error:", err);
        setError("Failed to synchronize patient record.");
      } finally {
        setLoading(false);
      }
    }
    fetchDossier();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#ff7600] border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-6 animate-pulse">
        Fetching Secure Dossier
      </span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-4">
        <AlertCircle size={32} />
      </div>
      <h2 className="text-xl font-black text-gray-900 uppercase">Registry Error</h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{error}</p>
      <button onClick={() => router.back()} className="mt-6 px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
        Return to Registry
      </button>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-24 px-4 md:px-0 font-sans text-gray-900">
      {/* --- HEADER SECTION --- */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => router.back()}
            className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#ff7600] hover:border-orange-100 transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                {/* Fixed: using full_name to match your database data */}
                {patient?.full_name || "Anonymous Patient"}
              </h1>
              {patient?.is_verified && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">
                  <ShieldCheck size={12} fill="currentColor" className="text-blue-600/20" />
                  <span className="text-[9px] font-black uppercase">Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Fingerprint size={14} className="text-[#ff7600]" />
              <span className="text-[11px] font-black text-[#ff7600] uppercase tracking-widest">Registry ID: {id?.toString().padStart(6, '0')}</span>
              <span className="h-1 w-1 bg-gray-300 rounded-full" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status: Active Registry</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#ff7600] transition-all shadow-xl shadow-gray-200 active:scale-95">
          <Plus size={16} strokeWidth={3} />
          <span>Open New Consultation</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- LEFT COLUMN: BIO & BILLING --- */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-gray-100 rounded-[2.8rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <ShieldCheck size={120} />
            </div>
            
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-10">Access Control & Billing</h2>
            
            <div className="space-y-8 relative z-10">
              {/* TIER */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100">
                  <UserCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Membership Tier</p>
                  <p className="text-base font-black text-gray-900 leading-none mt-1">
                    {patient?.subscription_tier || "BASIC"} LEVEL
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff7600] border border-orange-100">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Billing Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-md ${
                        patient?.subscription_status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {patient?.subscription_status || "ACTIVE"}
                    </span>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                        patient?.subscription_status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>

              {/* CONTACT */}
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Contact Secure</p>
                  {/* Fixed: using phone_number to match your database data */}
                  <p className="text-base font-bold text-gray-900 mt-1">{patient?.phone_number || "No Phone Linked"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-7 rounded-[2.2rem] shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Visits</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{history.length}</p>
            </div>
            <div className="bg-white border border-gray-100 p-7 rounded-[2.2rem] shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Compliance</p>
              <p className="text-3xl font-black text-blue-600 mt-1">100%</p>
            </div>
          </div>
        </aside>

        {/* --- RIGHT COLUMN: HISTORY --- */}
        <main className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-black text-gray-400 uppercase tracking-[0.3em] text-[10px]">Medical History Ledger</h2>
            <div className="h-[1px] flex-1 bg-gray-100 ml-6" />
          </div>

          <div className="space-y-4">
            {history.length > 0 ? history.map((entry: any, idx: number) => (
                <motion.div 
                  key={entry.id || idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white border border-gray-100 hover:border-orange-200 p-6 rounded-[2rem] flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-orange-500/5 cursor-default"
                >
                  <div className="flex flex-col items-center justify-center min-w-[70px] py-3 px-2 bg-gray-50 rounded-2xl group-hover:bg-orange-50 transition-colors">
                    <span className="text-[10px] font-black text-gray-400 group-hover:text-[#ff7600] uppercase tracking-widest">
                       {new Date(entry.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black text-gray-900">{new Date(entry.date).getDate()}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-black text-gray-900 group-hover:text-[#ff7600] transition-colors">
                        {entry.reason || "General Consultation"}
                      </h3>
                      <span className="text-[9px] font-black uppercase text-gray-300">#{entry.id}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                        <Clock size={14} className="text-blue-500" />
                        {entry.time || "N/A"}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                        <FileText size={14} className="text-blue-500" />
                        Dr. {entry.doctor_name || "Medical Officer"}
                      </div>
                      <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        entry.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {entry.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
            )) : (
              <div className="py-28 text-center bg-white border border-dashed border-gray-200 rounded-[3.5rem] flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-4">
                    <FileText size={32} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Historical Archive Empty</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}