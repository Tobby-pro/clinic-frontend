"use client";

import { useState, useEffect } from "react";
import { 
  Upload, 
  FileCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  ArrowLeft,
  Info,
  BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import useUser from "@/app/hooks/useUser";

export default function VerificationPage() {
  const { user } = useUser() as any;
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Logic to track if we are already in review or verified
  const rawStatus = user?.verification_status || user?.clinic_status || "IDLE";
  const currentStatus = rawStatus.toUpperCase();

  useEffect(() => {
    if (currentStatus === "VERIFIED") {
      setStatus("success");
      setMessage("Your clinic is fully verified and live on the network.");
    }
  }, [currentStatus]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setStatus("error");
        setMessage("Document exceeds 10MB limit.");
        return;
      }
      setFile(selectedFile);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("idle");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ MATCHED TO YOUR PYTHON ROUTER
      const res = await fetch("http://localhost:8000/verification/upload", {
        method: "POST",
        body: formData,
        credentials: "include", 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");

      setStatus("success");
      setMessage("Files transmitted to secure storage. Review in progress.");
      
      // Forces a refresh so the Sidebar and Dashboard see the new "PENDING" status
      setTimeout(() => {
        window.location.reload();
      }, 2500);

    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Protocol transmission failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      <header className="flex items-center justify-between pt-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#ff7600] mb-2 transition-colors">
            <ArrowLeft size={12} strokeWidth={3} /> Return to Overview
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Trust Verification</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7600]"></span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Compliance / Regulatory Documentation</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 space-y-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
                    <CheckCircle2 size={32} className="text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Transmission Verified</h2>
                    <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto">{message}</p>
                  </div>
                  <Link href="/dashboard" className="inline-block px-10 py-4 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#ff7600] transition-all">
                    Go to Dashboard
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">Document Submission</h2>
                    
                    {currentStatus === "PENDING" && (
                       <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex items-center gap-3 border border-blue-100 mb-4">
                         <Loader2 size={16} className="animate-spin" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Manual Verification by Admin</span>
                       </div>
                    )}

                    <label className={`group relative cursor-pointer border-2 border-dashed rounded-[2rem] p-20 flex flex-col items-center justify-center transition-all duration-500 ${file ? "border-green-400 bg-green-50/20" : "border-gray-100 hover:border-[#ff7600] bg-gray-50/30"}`}>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                      <div className={`p-6 rounded-2xl mb-5 transition-transform group-hover:scale-110 ${file ? "bg-green-100 text-green-600" : "bg-white text-gray-300 shadow-sm"}`}>
                        {file ? <FileCheck size={32} strokeWidth={2.5} /> : <Upload size={32} strokeWidth={2.5} />}
                      </div>
                      <span className="text-lg font-black text-gray-900 tracking-tight text-center px-4">{file ? file.name : "Select CAC or HEFAMAA License"}</span>
                    </label>
                  </div>

                  {status === "error" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
                      <AlertCircle size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{message}</span>
                    </motion.div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={!file || loading}
                    className={`w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 ${!file || loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-[#ff7600] shadow-xl shadow-gray-200"}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><BadgeCheck size={18} /><span>Begin Verification</span></>}
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-2">
               <ShieldCheck size={18} className="text-[#ff7600]" />
               <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em]">Security Protocol</h2>
             </div>
             <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
               Verified clinics receive a <b>Trusted Badge</b> on their profile, increasing patient booking conversion by up to 40% in the Lagos area.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}