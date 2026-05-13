"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  Users,
  Loader2,
  CreditCard,
  Sparkles,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getSubscriptionPlans,
  subscribeClinicToPlan,
} from "@/services/api";
import useUser from "@/app/hooks/useUser";
import Loader from "@/components/ui/Loader"; // Importing global loader for consistency

export default function PatientBillingPage() {
  const { user } = useUser() as any;
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingTier, setPendingTier] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSubscriptionPlans();
      if (data && Array.isArray(data)) {
        const patientPlans = data.filter((p) => ["BASIC", "PREMIUM", "FAMILY"].includes(p.id));
        setPlans(patientPlans);
      }
    } catch (err) {
      setError("Network sync failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubscribe = async (tier: string) => {
    if (user?.subscription_tier === tier) return;
    setPendingTier(tier);
    try {
      const data = await subscribeClinicToPlan(tier);
      if (data?.checkout_url) window.location.href = data.checkout_url;
      else if (data?.status === "ACTIVE") window.location.reload();
    } catch (err) {
      alert("Payment initialization failed.");
    } finally {
      setPendingTier(null);
    }
  };

  // Using the shared global loader for perfect centering across all devices
  if (isLoading) return <Loader text="Checking Benefits" />;

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Sync Error</h2>
        <button onClick={loadData} className="mt-6 flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 pb-32">
      {/* HEADER */}
      <div className="mb-12 md:mb-16 text-center md:text-left">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff7600] animate-ping" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff7600]">NHN Marketplace</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Health Membership</h1>
        <p className="text-[9px] md:text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Unlock premium healthcare tools and verified status.</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {plans.map((plan) => {
          const isCurrent = user?.subscription_tier === plan.id;
          
          const getFeatures = (id: string) => {
            if (id === "BASIC") return ["Clinic Discovery", "Health Records", "Appointment History"];
            if (id === "PREMIUM") return ["Priority Booking", "Verified Badge", "Cloud Prescriptions", "Premium Support"];
            return ["Family Billing", "Up to 5 Dependents", "Shared Medical Vault", "Emergency Line"];
          };

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white border-[1.5px] rounded-[2.5rem] p-6 md:p-10 flex flex-col justify-between transition-all group ${
                isCurrent 
                ? "border-[#ff7600] shadow-[0_20px_50px_rgba(255,118,0,0.15)] ring-4 ring-orange-50" 
                : "border-gray-100 hover:border-gray-200"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ff7600] text-white text-[8px] md:text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-xl border-2 border-white">
                  <Sparkles size={12} /> Active Plan
                </div>
              )}

              <div>
                <div className={`mb-6 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent ? "bg-orange-50 text-[#ff7600]" : "bg-gray-50 text-gray-400 group-hover:scale-105"
                }`}>
                  {plan.id === "BASIC" && <ShieldCheck size={28} />}
                  {plan.id === "PREMIUM" && <Zap size={28} />}
                  {plan.id === "FAMILY" && <Users size={28} />}
                </div>

                <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{plan.label} Plan</h2>
                
                {/* PRICE - Responsive font sizes prevent overlap on mobile */}
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                    ₦{(plan.amount || 0).toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-black text-[9px] md:text-[10px] uppercase tracking-widest">/ Mo</span>
                </div>

                <div className="my-6 h-[1px] bg-gradient-to-r from-gray-50 via-gray-100 to-transparent w-full" />

                <ul className="space-y-4">
                  {getFeatures(plan.id).map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] md:text-[13px] font-bold text-gray-700 leading-tight">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <Check size={10} className="text-[#ff7600]" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={!!pendingTier || isCurrent}
                className={`w-full mt-10 py-5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-[0.96] ${
                  isCurrent
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-[#ff7600] text-white shadow-lg"
                }`}
              >
                {pendingTier === plan.id ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isCurrent ? "Active Member" : (
                  <>
                    <CreditCard size={18} /> Select Plan
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}