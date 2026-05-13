// app/dashboard/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // 🔥 Added for navigation
import { 
  Building2, 
  MapPin, 
  Save, 
  Activity,
  CheckCircle2,
  FileText,
  Upload,
  Info,
  BadgeCheck,
  Globe,
  Phone,
  Mail
} from "lucide-react";

import { updateClinicSettings, getClinicSettings } from "@/services/api";
import useUser from "@/app/hooks/useUser"; 

interface LocalUser {
  id: number;
  name: string;
  clinicId?: number;
  clinic_status?: string;
  role: string;
}

export default function SettingsPage() {
  const { user, loading: userLoading } = useUser() as { user: LocalUser | null, loading: boolean };
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true); 
  
  const clinicId = user?.clinicId; 
  const verificationStatus = user?.clinic_status || "pending";

  const [clinicData, setClinicData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    hours: ""
  });

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (!userLoading && clinicId) {
      async function loadSettings() {
        try {
          setFetching(true);
          const data = await getClinicSettings(clinicId!);
          const formattedData = {
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            hours: data.hours || ""
          };
          setClinicData(formattedData);
          setInitialData(formattedData);
        } catch (error) {
          console.error("Failed to load clinic settings:", error);
        } finally {
          setFetching(false);
        }
      }
      loadSettings();
    } else if (!userLoading && !clinicId) {
      setFetching(false);
    }
  }, [clinicId, userLoading]);

  // DIRECTIONAL LOGIC: Check if data has actually changed
  const isDirty = JSON.stringify(clinicData) !== JSON.stringify(initialData);

  const handleSave = async () => {
    if (!isDirty || !clinicId) return;
    setLoading(true);
    try {
      await updateClinicSettings(clinicId!, clinicData);
      setInitialData(clinicData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); 
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-5 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:border-[#ff7600] focus:bg-white text-sm text-gray-800 transition-all outline-none placeholder:text-gray-400 font-medium";
  const labelStyles = "text-[11px] font-black text-gray-500 ml-1 uppercase tracking-[0.15em]";

  if (userLoading || fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-2 border-orange-100 border-t-[#ff7600] rounded-full animate-spin" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-6 animate-pulse">
          Syncing Profile Data
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-24 px-4 md:px-0 font-sans">
      
      {/* HEADER SECTION */}
      <header className="flex items-center justify-between pt-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Settings
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Master Configuration / Business Profile
            </p>
          </div>
        </div>

        <motion.button
          whileTap={isDirty ? { scale: 0.95 } : {}}
          onClick={handleSave}
          disabled={loading || !isDirty}
          className={`px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${
            success 
              ? "bg-green-600 text-white shadow-lg shadow-green-500/20" 
              : isDirty 
                ? "bg-[#ff7600] text-white shadow-lg shadow-orange-500/20 hover:bg-black" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : success ? (
            <CheckCircle2 size={16} strokeWidth={3} />
          ) : (
            <Save size={16} strokeWidth={3} />
          )}
          <span>{success ? "Success" : isDirty ? "Save Changes" : "No Changes"}</span>
        </motion.button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: MAIN FORM */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-12">
            
            {/* General Identity */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Activity size={18} className="text-[#ff7600]" />
                <h2 className={labelStyles}>Primary Identity</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelStyles}>Clinic Registered Name</label>
                  <input 
                    type="text" 
                    value={clinicData.name} 
                    placeholder="e.g. St. Nicholas Hospital"
                    onChange={(e) => setClinicData({...clinicData, name: e.target.value})} 
                    className={inputStyles} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelStyles}>Contact Email Address</label>
                  <input 
                    type="email" 
                    value={clinicData.email} 
                    placeholder="admin@yourclinic.com"
                    onChange={(e) => setClinicData({...clinicData, email: e.target.value})} 
                    className={inputStyles} 
                  />
                </div>
              </div>
            </section>

            {/* Reach & Location */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <MapPin size={18} className="text-blue-500" />
                <h2 className={labelStyles}>Location & Contact</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelStyles}>Primary Phone Line</label>
                  <input 
                    type="text" 
                    value={clinicData.phone} 
                    placeholder="+234 800 000 0000"
                    onChange={(e) => setClinicData({...clinicData, phone: e.target.value})} 
                    className={inputStyles} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelStyles}>Public Website</label>
                  <input 
                    type="text" 
                    value={clinicData.website} 
                    placeholder="https://www.yourclinic.com"
                    onChange={(e) => setClinicData({...clinicData, website: e.target.value})} 
                    className={inputStyles} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelStyles}>Physical Office Address</label>
                <textarea 
                  rows={2} 
                  value={clinicData.address} 
                  placeholder="Enter the full street address for patient navigation..."
                  onChange={(e) => setClinicData({...clinicData, address: e.target.value})} 
                  className={`${inputStyles} resize-none`} 
                />
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT COLUMN: VERIFICATION & DOCS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* VERIFICATION BADGE AREA */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compliance Status</h2>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${
                verificationStatus === "verified" 
                ? "bg-green-50 text-green-600 border-green-100" 
                : "bg-blue-50 text-blue-600 border-blue-100"
              }`}>
                {verificationStatus}
              </span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
              <BadgeCheck size={18} className="text-blue-500 shrink-0" />
              <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                Verification unlocks your <b>Public Booking Portal</b> and map listing.
              </p>
            </div>
          </div>

          {/* DOCUMENT UPLOADER TRIGGER */}
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#ff7600]" />
              <h2 className={labelStyles}>KYC Documents</h2>
            </div>

            <div className="space-y-3">
              {['CAC Certificate', 'HEFAMAA License'].map((doc, i) => (
                <Link href="/dashboard/verification" key={i}>
                  <div className="group border-2 border-dashed border-gray-100 rounded-2xl p-6 hover:border-[#ff7600] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50/20 mb-3 last:mb-0">
                    <Upload size={18} className="text-gray-300 group-hover:text-[#ff7600] transition-colors" />
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{doc}</span>
                    <span className="text-[8px] text-gray-400">Click to Upload</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* SYSTEM INFO */}
          <div className="p-6 bg-gray-900 rounded-[2rem] text-white">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">Protocol Tip</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              Updating these fields updates your digital signature on all automated laboratory reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}