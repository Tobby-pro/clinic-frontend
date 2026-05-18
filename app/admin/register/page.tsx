// app/(auth)/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod"; 
import { registerUser, loginUser, searchClinics, verifyAdminOTP } from "@/services/api";
import { Poppins } from "next/font/google";
import { 
  Search, Building2, Sparkles, User, Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const registerSchema = z.object({
  clinicName: z.string().min(3, "Clinic name too short"),
  adminName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid work email"),
  pin: z.string().length(6, "PIN must be exactly 6 digits").regex(/^\d+$/, "PIN must be numeric"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    selectedClinicId: null as number | null,
    adminName: "",
    email: "",
    pin: "",
  });
  const [otp, setOtp] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (formData.clinicName.length <= 2 || formData.selectedClinicId) {
      setSuggestions([]);
      return;
    }
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchClinics(formData.clinicName);
        setSuggestions(results);
      } catch (err) { console.error("Search failed", err); }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.clinicName, formData.selectedClinicId]);

  const canContinueStep1 = formData.clinicName.length >= 3;
  const canContinueStep2 = z.string().min(2).safeParse(formData.adminName).success && 
                           z.string().email().safeParse(formData.email).success;

  const handleRegister = async () => {
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setIsError(true);
      setMessage(result.error.issues[0].message);
      return;
    }
    setMessage("");
    setIsError(false);
    setLoading(true);
    try {
      await registerUser({
        clinic_name: formData.clinicName,
        clinic_id: formData.selectedClinicId,
        admin_name: formData.adminName,
        email: formData.email,
        password: formData.pin,
      });
      setLoading(false);
      setStep(4);
      setMessage("Verification code sent to your email.");
    } catch (err: any) {
      setIsError(true);
      setMessage(err?.message || "Registration failed.");
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setIsError(false);
    try {
        await verifyAdminOTP({ email: formData.email, otp: otp } as any);
        setMessage("Email Verified! Finalizing setup...");
        await loginUser({ email: formData.email, password: formData.pin });
        router.push("/dashboard");
    } catch (err: any) {
        setIsError(true);
        setMessage(err?.message || "Invalid or expired code.");
        setLoading(false);
    }
  };

  if (loading) return <Loader text="Synchronizing with NHN Registry..." />;

  return (
    <AuthLayoutWrapper showBackButton={step === 1}>
      <section className={`relative min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden ${poppins.className}`}>
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/images/grid.png')] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ff7600]/5 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[460px] bg-white border border-gray-200/60 p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_80px_rgba(0,0,0,0.03)]"
        >
          <div className="flex gap-2 mb-12 justify-center">
              {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1 rounded-full transition-all duration-700 ${step >= s ? 'w-10 bg-[#ff7600]' : 'w-3 bg-slate-100'}`} />
              ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinic Entity</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Locate your seeded workspace in the NHN registry.</p>
                </div>
                <div className="relative">
                  <div className="relative">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                          type="text"
                          placeholder="Search clinic name..."
                          className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all"
                          value={formData.clinicName}
                          onChange={(e) => setFormData({...formData, clinicName: e.target.value, selectedClinicId: null})}
                      />
                  </div>
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div className="absolute z-50 w-full bg-white mt-3 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {suggestions.map((c) => (
                          <button key={c.id} onClick={() => { setFormData({...formData, clinicName: c.name, selectedClinicId: c.id}); setSuggestions([]); }} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 text-left border-b border-slate-50 last:border-none">
                            <div className="flex items-center gap-3">
                              <Building2 size={16} className="text-[#ff7600]" />
                              <span className="text-sm font-semibold text-slate-700">{c.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#ff7600] uppercase tracking-wider">Claim</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button disabled={!canContinueStep1} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#ff7600] transition-all disabled:opacity-20">
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrator</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Provide legal credentials for this node.</p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" placeholder="Full legal name" className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all" value={formData.adminName} onChange={(e)=>setFormData({...formData, adminName: e.target.value})} />
                  </div>
                  <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="email" placeholder="Work email address" className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-6 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 border border-slate-100 transition-all"><ArrowLeft size={18} /></button>
                  <button onClick={() => setStep(3)} disabled={!canContinueStep2} className="flex-1 bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#ff7600] transition-all disabled:opacity-20">
                    Set Security PIN <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-50 text-[#ff7600] rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Lock size={28} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Registry PIN</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Create your 6-digit terminal access key.</p>
                </div>
                <div className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${formData.pin.length > i ? 'bg-[#ff7600] scale-125' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <input type="password" maxLength={6} autoFocus className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-3xl py-6 text-center text-3xl font-bold tracking-[0.8em] outline-none transition-all" value={formData.pin} onChange={(e) => setFormData({...formData, pin: e.target.value.replace(/\D/g, "")})} />
                  <div className="flex gap-4">
                      <button onClick={() => setStep(2)} className="px-6 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 transition-all"><ArrowLeft size={18} /></button>
                      <button onClick={handleRegister} disabled={formData.pin.length < 6} className="flex-1 bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-20">
                          Deploy Node <Sparkles size={16} />
                      </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 size={28} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Email</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Enter the 6-digit code sent to <br/><span className="text-slate-600 font-bold">{formData.email}</span></p>
                </div>
                <div className="space-y-8">
                  <input type="text" maxLength={6} placeholder="000000" className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-3xl py-6 text-center text-3xl font-bold tracking-[0.4em] outline-none transition-all" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
                  <button onClick={handleVerifyOTP} disabled={otp.length < 6} className="w-full bg-emerald-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all disabled:opacity-20">
                      Confirm Access <ArrowRight size={16} />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-semibold cursor-pointer hover:text-[#ff7600]" onClick={() => setStep(2)}>Wrong email? Go back</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-8 p-5 rounded-2xl text-[11px] font-bold text-center border ${isError ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
              {message}
            </motion.div>
          )}
        </motion.div>
      </section>
    </AuthLayoutWrapper>
  );
}