"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Hospital, ArrowRight, Star, ShieldCheck, ChevronRight } from "lucide-react";
import { getClinics, getNearbyClinics, getClinicSubscription } from "@/services/api";
import TierBadge from "@/components/shared/TierBadge";

interface Clinic {
  id: number;
  name: string;
  address?: string;
  status: string;
  rating: number;
  review_count: number;
  available_today: boolean;
  is_bookable?: boolean;
  tier?: string; 
}

export default function ClinicsPreview({ limit = 3 }: { limit?: number }) {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getTierWeight = (tier?: string) => {
    switch (tier?.toUpperCase()) {
      case "CORPORATE": return 3;
      case "PROFESSIONAL": return 2;
      default: return 1;
    }
  };

  const fetchAndEnrichClinics = useCallback(async (lat?: number, lng?: number) => {
    try {
      setLoading(true);
      const rawData = lat && lng ? await getNearbyClinics(lat, lng) : await getClinics();
      
      const actionableClinics = (rawData || []).filter((c: any) => {
          return c.status === "VERIFIED" && (c.is_bookable || c.available_today);
      });

      const enriched = await Promise.all(
        actionableClinics.map(async (c: any) => {
          try {
            const sub = await getClinicSubscription(c.id);
            return { ...c, tier: sub.tier };
          } catch {
            return { ...c, tier: "BASIC" };
          }
        })
      );

      const sorted = enriched.sort((a, b) => getTierWeight(b.tier) - getTierWeight(a.tier));
      setClinics(sorted.slice(0, limit));
    } catch (err) {
      console.error("Clinic Preview Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAndEnrichClinics(pos.coords.latitude, pos.coords.longitude),
        () => fetchAndEnrichClinics()
      );
    } else {
      fetchAndEnrichClinics();
    }
  }, [fetchAndEnrichClinics]);

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Available Near You
        </h3>
        <button 
          onClick={() => router.push('/patient/explore')}
          className="flex items-center gap-1 text-[#ff7600] text-[10px] font-black uppercase"
        >
          Explore All <ChevronRight size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full">
        {loading ? (
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 rounded-[2rem] animate-pulse border border-gray-100" />
          ))
        ) : clinics.length > 0 ? (
          clinics.map((clinic) => {
            const isCorporate = clinic.tier === "CORPORATE";

            return (
              <motion.div
                key={clinic.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => router.push(`/patient/clinics/${clinic.id}/doctors`)}
                className={`group cursor-pointer relative p-4 md:p-5 rounded-[2rem] transition-all flex items-center gap-3 md:gap-4 border w-full overflow-hidden ${
                  isCorporate 
                  ? "bg-slate-900 border-slate-800 shadow-xl shadow-slate-100" 
                  : "bg-white border-gray-100 hover:border-orange-200"
                }`}
              >
                {/* Visual Icon - Shrunk slightly on mobile to save space */}
                <div className={`p-3 md:p-4 rounded-2xl flex-shrink-0 transition-all ${
                  isCorporate ? 'bg-white/10 text-[#ff7600]' : 'bg-orange-50 text-[#ff7600]'
                } group-hover:bg-[#ff7600] group-hover:text-white`}>
                  <Hospital size={20} className="md:w-6 md:h-6" />
                </div>

                {/* Info - min-w-0 is CRITICAL for truncation */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className={`font-black text-sm md:text-base truncate ${
                      isCorporate ? "text-white" : "text-gray-900"
                    }`}>
                      {clinic.name}
                    </h3>
                    <ShieldCheck size={12} className={isCorporate ? "text-[#ff7600]" : "text-blue-500 flex-shrink-0"} />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {/* Address Container with Strict Truncation */}
                    <div className="flex items-center gap-1 text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-tight max-w-[140px] xs:max-w-[180px] md:max-w-none">
                      <MapPin size={10} className="text-[#ff7600] flex-shrink-0" />
                      <span className="truncate">
                        {clinic.address || "Verified Location"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-black ${
                      isCorporate ? "text-gray-200" : "text-gray-900"
                    }`}>
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span>{(clinic.rating || 4.5).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Action area */}
                <div className="flex flex-col items-end gap-1.5 shrink-0 ml-auto">
                  <TierBadge tier={clinic.tier || "BASIC"} showIcon={false} />
                  
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[8px] font-black uppercase text-emerald-500">Open</span>
                  </div>
                  
                  <div className={`p-2 rounded-xl transition-all ${
                    isCorporate ? 'bg-[#ff7600] text-white' : 'bg-gray-900 text-white'
                  }`}>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="py-8 text-center bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
             <p className="text-[10px] font-black text-gray-400 uppercase">No active clinics available</p>
          </div>
        )}
      </div>
    </div>
  );
}