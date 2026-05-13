"use client";

import { useEffect, useState } from "react";
import { Check, Building2, Loader2, CreditCard, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getSubscriptionPlans, subscribeClinicToPlan, getClinicSubscription } from "@/services/api";
import useUser from "@/app/hooks/useUser";
import Loader from "@/components/ui/Loader"; // NEW SHARED IMPORT

export default function AdminBillingPage() {
  const { user } = useUser() as any;
  const [plans, setPlans] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  const loadBillingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allPlans = await getSubscriptionPlans();
      if (allPlans && Array.isArray(allPlans)) {
        setPlans(allPlans.filter((p) => p.id === "CORPORATE"));
      }
      if (user?.clinic_id) {
        const subData = await getClinicSubscription(user.clinic_id);
        setCurrentSub(subData);
      }
    } catch (err) {
      setError("Failed to sync institutional billing data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.clinic_id) loadBillingData();
    else if (user && !user.clinic_id) setIsLoading(false);
  }, [user?.clinic_id]);

  const handleSubscribe = async (tier: string) => {
    setPendingTier(tier);
    try {
      const data = await subscribeClinicToPlan(tier);
      if (data?.checkout_url) window.location.href = data.checkout_url;
      else if (data?.status === "ACTIVE") window.location.reload();
    } catch (err) {
      alert("Gateway Sync Error.");
    } finally {
      setPendingTier(null);
    }
  };

  // Using the shared Loader component
  if (isLoading) return <Loader text="Authenticating Node" />;

  if (error) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-6" />
        <h2 className="text-xl font-black text-gray-900 uppercase">Sync Failed</h2>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 mb-8">{error}</p>
        <button onClick={loadBillingData} className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
           Retry Ledger Sync
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 pb-32">
      {/* HEADER */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-[#ff7600] text-[9px] font-black uppercase tracking-widest mb-4">
            NHN Compliance Node
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Clinic Subscription</h1>
          <p className="text-[10px] md:text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Manage your institution's global marketplace compliance.</p>
        </div>
        
        {currentSub?.status === "ACTIVE" && (
          <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50 border border-emerald-100 rounded-2xl self-center lg:self-end shadow-sm">
            <ShieldCheck className="text-emerald-500" size={20} />
            <div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active License</p>
              <p className="text-xs font-bold text-emerald-900">Verified Corporate Node</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {plans.map((plan) => {
          const isCurrent = currentSub?.tier === plan.id && currentSub?.status === "ACTIVE";
          const corpFeatures = [
            "Verified Marketplace Badge",
            "Advanced Analytics",
            "Digital Documentation",
            "Priority Search Ranking",
            "Unlimited Doctor Slots",
            "24/7 Support"
          ];
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white border-[1.5px] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 w-full max-w-2xl shadow-2xl transition-all overflow-hidden ${
                isCurrent ? "border-[#ff7600] ring-4 md:ring-8 ring-orange-50" : "border-gray-100"
              }`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7600]/5 blur-[80px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8 md:mb-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-[#ff7600] shadow-xl">
                    <Building2 size={32} />
                  </div>
                  {isCurrent && (
                    <div className="bg-[#ff7600] text-white px-3 py-1.5 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={12} /> Verified
                    </div>
                  )}
                </div>

                <h2 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{plan.label}</h2>
                
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                    ₦{(plan.amount || 0).toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-black text-[10px] md:text-[12px] uppercase tracking-[0.2em]">/ Year</span>
                </div>

                <div className="my-8 md:my-10 h-[1px] bg-gradient-to-r from-gray-100 via-gray-200 to-transparent w-full" />

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 md:mb-14">
                  {corpFeatures.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-[12px] md:text-[14px] font-bold text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-[#ff7600]" />
                      </div>
                      <span className="leading-tight">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!!pendingTier || isCurrent}
                  className={`w-full py-5 md:py-7 rounded-2xl md:rounded-[2rem] text-[10px] md:text-[12px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                    isCurrent 
                      ? "bg-gray-100 text-gray-400" 
                      : "bg-slate-900 hover:bg-[#ff7600] text-white shadow-xl shadow-slate-200"
                  }`}
                >
                  {pendingTier === plan.id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : isCurrent ? "Access Active" : (
                    <>
                      <CreditCard size={18} /> Initialize License
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}