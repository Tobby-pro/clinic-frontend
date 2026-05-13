// app/patient/clinics/[clinicId]/doctors/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  ChevronLeft, 
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  Star
} from "lucide-react";
import { getDoctorsByClinic } from "@/services/api";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
}

export default function ClinicDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const clinicId = Array.isArray(params.clinicId)
    ? Number(params.clinicId[0])
    : Number(params.clinicId);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const data = await getDoctorsByClinic(clinicId);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (clinicId) fetchDoctors();
  }, [clinicId]);

  const filteredDoctors = doctors.filter((doc) =>
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#ff7600]/20 border-t-[#ff7600] rounded-full animate-spin" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Syncing Doctors...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      
      <header className="flex flex-col gap-4">
        <button 
          onClick={() => router.push('/patient/explore')}
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#ff7600] transition-colors w-fit"
        >
          <ChevronLeft size={14} /> Back to Discovery
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Select a Specialist</h1>
          <p className="text-sm text-gray-500 mt-1">Available medical professionals at this facility.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CLINIC CONTEXT */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#ff7600]">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Verified Facility</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Clinic Information</h2>
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <p className="text-xs font-medium">Medical District, Lagos State</p>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7600] transition-colors" size={14} />
              <input 
                placeholder="Search specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#ff7600] text-xs outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* DOCTOR GRID */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 px-2">
            Available Practitioners ({filteredDoctors.length})
          </h3>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.length === 0 ? (
                <div className="py-20 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-bold uppercase">No specialists found</p>
                </div>
              ) : (
                filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      if (doctor.available) {
                        // Route to booking within the patient dashboard
                        router.push(`/patient/booking?clinicId=${clinicId}&doctorId=${doctor.id}`);
                      }
                    }}
                    className={`group flex items-center justify-between p-5 rounded-[2rem] border transition-all ${
                      doctor.available 
                      ? "bg-white border-gray-100 hover:border-[#ff7600]/30 cursor-pointer hover:shadow-lg" 
                      : "bg-gray-50 border-transparent opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Anchor Icon Box */}
                      <div className={`p-4 rounded-2xl transition-all ${doctor.available ? 'bg-orange-50 text-[#ff7600]' : 'bg-gray-100 text-gray-400'} group-hover:bg-[#ff7600] group-hover:text-white`}>
                        <Stethoscope size={24} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-[#ff7600] transition-colors">Dr. {doctor.name}</h4>
                          <ShieldCheck size={14} className="text-blue-500" />
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-tight">{doctor.specialty}</span>
                          <div className="flex items-center gap-1 text-gray-900 text-[10px] font-black">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {doctor.available && (
                           <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                           </span>
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-tight ${doctor.available ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {doctor.available ? "Online Now" : "Busy"}
                        </span>
                      </div>
                      
                      <div className={`p-2.5 rounded-xl transition-all shadow-md active:scale-90 ${doctor.available ? 'bg-gray-900 text-white group-hover:bg-[#ff7600]' : 'bg-gray-100 text-gray-300'}`}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}