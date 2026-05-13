"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Hospital, 
  Navigation,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { getClinics, getNearbyClinics, getClinicSubscription } from "@/services/api";
import { useRouter } from "next/navigation";
import TierBadge from "@/components/shared/TierBadge";

interface Clinic {
  id: number;
  name: string;
  address?: string;
  area_name?: string;
  is_bookable: boolean;
  status: string;
  rating?: number;
  tier?: string; 
}

export default function ExploreClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [isSortedByDistance, setIsSortedByDistance] = useState(false);
  const router = useRouter();

  const enrichWithTiers = async (data: Clinic[]) => {
    const enriched = await Promise.all(
      data.map(async (c) => {
        try {
          const sub = await getClinicSubscription(c.id);
          return { ...c, tier: sub.tier };
        } catch {
          return { ...c, tier: "BASIC" };
        }
      })
    );
    setClinics(enriched);
  };

  useEffect(() => {
    async function fetchInitialClinics() {
      try {
        setLoading(true);
        const data = await getClinics();
        if (data) await enrichWithTiers(data);
      } catch (err) {
        console.error("Discovery error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialClinics();
  }, []);

  const handleGetLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const nearbyData = await getNearbyClinics(latitude, longitude);
          if (nearbyData) await enrichWithTiers(nearbyData);
          setIsSortedByDistance(true);
        } catch (err) {
          console.error("Location Fetch Error:", err);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        alert(`Location Error: ${error.message}`);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const filteredClinics = clinics.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      (c.name.toLowerCase().includes(query) ||
      (c.address || "").toLowerCase().includes(query) ||
      (c.area_name || "").toLowerCase().includes(query)) &&
      c.status === "VERIFIED"
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 pt-6 px-4 md:px-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#ff7600] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {isSortedByDistance ? "Discovery Mode: Nearby" : "Discovery Mode: All"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Medical Centers</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Find and book appointments with verified clinics</p>
        </div>
        <div className="bg-orange-50 text-[#ff7600] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest w-fit">
          {filteredClinics.length} Available
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7600] transition-colors" size={18} />
              <input
                placeholder="Search area or clinic name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:border-orange-200 focus:bg-white text-sm font-medium outline-none transition-all"
              />
            </div>

            <button 
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className={`w-full py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] transition-all active:scale-[0.98] ${
                isSortedByDistance 
                ? "bg-orange-50 border-orange-200 text-[#ff7600]" 
                : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Navigation size={14} className={`${locating ? "animate-spin" : ""} ${isSortedByDistance ? "fill-[#ff7600]" : ""}`} />
              {locating ? "Scanning Map..." : isSortedByDistance ? "Showing Nearest" : "View Clinics Near Me"}
            </button>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-[#ff7600]" />
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Verification</h4>
              </div>
              <h3 className="text-lg font-medium mb-2">Trust Guarantee</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every clinic listed undergoes strict verification to ensure quality standards.
              </p>
            </div>
          </div>
        </div>

        {/* CLINIC LIST - Removed max-w-2xl to allow full width scaling */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 w-full">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 bg-gray-50 rounded-[2.2rem] animate-pulse border border-gray-100" />
                ))
              ) : filteredClinics.length > 0 ? (
                filteredClinics.map((clinic) => {
                  const isLive = clinic.is_bookable;
                  const isCorporate = clinic.tier === "CORPORATE";

                  return (
                    <motion.div
                      key={clinic.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => isLive && router.push(`/patient/clinics/${clinic.id}/doctors`)}
                      className={`group relative p-4 md:p-6 rounded-[2.2rem] border flex items-center gap-4 transition-all duration-300 w-full ${
                        isLive ? "cursor-pointer" : "opacity-60 grayscale-[0.5] cursor-not-allowed"
                      } ${
                        isCorporate 
                        ? "bg-slate-900 border-slate-800 shadow-xl shadow-slate-200/50" 
                        : "bg-white border-gray-100 hover:border-orange-200 hover:shadow-md"
                      }`}
                    >
                      {/* Icon Container - Fixed shrink behavior */}
                      <div className={`p-3.5 md:p-4 rounded-2xl shrink-0 transition-all ${
                        isCorporate 
                        ? 'bg-white/10 text-[#ff7600]' 
                        : isLive ? 'bg-orange-50 text-[#ff7600]' : 'bg-gray-50 text-gray-400'
                      } group-hover:bg-[#ff7600] group-hover:text-white`}>
                        <Hospital size={22} className="md:w-6 md:h-6" />
                      </div>

                      {/* Content Section - min-w-0 is key for truncation */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className={`font-black text-sm md:text-base truncate leading-tight ${
                            isCorporate ? "text-white" : "text-gray-900 group-hover:text-[#ff7600]"
                          }`}>
                            {clinic.name}
                          </h3>
                          <ShieldCheck size={14} className={isCorporate ? "text-[#ff7600]" : "text-blue-500 shrink-0"} />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          {/* Address with strict truncation for mobile */}
                          <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-tight min-w-0 max-w-[160px] xs:max-w-[220px] md:max-w-none">
                            <MapPin size={10} className="text-[#ff7600] shrink-0" />
                            <span className="truncate block">
                              {clinic.address || clinic.area_name || "Location Verified"}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 text-[10px] font-black shrink-0 ${
                            isCorporate ? "text-gray-200" : "text-gray-900"
                          }`}>
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span>{(clinic.rating || 4.8).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Section - Pinned */}
                      <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                        <div className="flex flex-col items-end gap-1">
                          <TierBadge tier={clinic.tier || "BASIC"} showIcon={false} />
                          
                          <div className="flex items-center gap-1.5">
                            {isLive && (
                               <span className="relative flex h-1.5 w-1.5">
                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                 <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                               </span>
                            )}
                            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter ${isLive ? 'text-emerald-500' : 'text-gray-400'}`}>
                              {isLive ? "Available" : "Offline"}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`p-2 md:p-2.5 rounded-xl transition-all shadow-sm active:scale-90 ${
                          isCorporate 
                          ? 'bg-[#ff7600] text-white' 
                          : isLive ? 'bg-gray-900 text-white group-hover:bg-[#ff7600]' : 'bg-gray-100 text-gray-300'
                        }`}>
                          <ArrowRight size={14} className="md:w-4 md:h-4" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <Hospital className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">No verified clinics found matching your criteria.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}