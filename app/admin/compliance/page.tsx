"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  FileText,
  Loader2
} from "lucide-react";
import { 
  getPendingVerifications, 
  approveClinic, 
  rejectClinic 
} from "@/services/api"; // 🔥 Cleanly imported from your service

interface PendingAdmin {
  id: number;
  name: string;
  email: string;
  clinic_name?: string;
  verification_document: string;
  verification_status: string;
}

export default function AdminComplianceHub() {
  const [admins, setAdmins] = useState<PendingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 1. FETCH PENDING CLINICS USING API SERVICE
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getPendingVerifications();
        setAdmins(data);
      } catch (err) {
        console.error("Failed to fetch registry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  // 2. THE APPROVAL ACTION USING API SERVICE
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      if (action === 'approve') {
        await approveClinic(id);
      } else {
        await rejectClinic(id);
      }

      // Successfully updated! Remove from local list after successful update
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      
    } catch (err: any) {
      alert(err.message || `System Error: Could not ${action} clinic.`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Tier-1 Registry</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Compliance Hub</h1>
            <p className="text-gray-500 text-sm font-medium">Verify CAC and HEFAMAA documents for clinic onboarding.</p>
          </div>
          
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="grid gap-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Loader2 className="animate-spin text-gray-300" size={40} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Registry...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] py-20 flex flex-col items-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <CheckCircle size={32} className="text-gray-200" />
              </div>
              <h3 className="text-gray-900 font-bold">Queue Clear</h3>
              <p className="text-gray-400 text-sm">All pending verification requests have been processed.</p>
            </div>
          ) : (
            <AnimatePresence>
              {admins.map((admin) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-100 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 font-bold uppercase">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{admin.clinic_name || "New Clinic"}</h4>
                      <p className="text-xs text-gray-400 font-medium">{admin.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    {/* DOCUMENT VIEW BUTTON */}
                    <a 
                      href={admin.verification_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      <FileText size={14} /> View CAC
                    </a>

                    {/* REJECT BUTTON */}
                    <button 
                      onClick={() => handleAction(admin.id, 'reject')}
                      disabled={processingId !== null}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <XCircle size={24} />
                    </button>

                    {/* THE BIG GREEN (ORANGE) BUTTON (APPROVE) */}
                    <button 
                      onClick={() => handleAction(admin.id, 'approve')}
                      disabled={processingId !== null}
                      className="flex items-center gap-2 px-8 py-3 bg-[#ff7600] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {processingId === admin.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                      Approve Clinic
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* FOOTER FOOTNOTE */}
        <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] pt-10">
          Manual Verification Protocol • Secure Admin Access Only
        </p>
      </div>
    </div>
  );
}