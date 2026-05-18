// app/(patient)/register/page.tsx

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import {
  registerPatient,
  verifyPatientEmail,
  loginPatient,
} from "@/services/api";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PatientRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    pin: "",
  });

  const handleRegister = async () => {
    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      await registerPatient({
        full_name: formData.fullName,
        email: formData.email.toLowerCase().trim(),
        password: formData.pin,
      });

      setStep(3);
      setMessage("Verification code sent to your email.");
    } catch (err: any) {
      setIsError(true);
      const errorMsg = err?.response?.data?.detail || "Registration failed. Try a different email.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setIsError(false);
      setMessage("Verifying code...");

      await verifyPatientEmail({
        email: formData.email.toLowerCase().trim(),
        otp: String(otp).trim(),
      } as any);

      const loginRes = await loginPatient({
        email: formData.email.toLowerCase().trim(),
        password: formData.pin,
      });

      if (loginRes) {
        setMessage("Success! Routing to patient portal...");
        
        setTimeout(() => {
          router.push("/patient/dashboard"); 
          router.refresh(); 
        }, 1500);
      }

    } catch (err: any) {
      setIsError(true);
      setMessage(
        err?.response?.data?.detail || "Invalid code. Please check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  const canContinueStep1 =
    formData.fullName.length >= 2 &&
    formData.email.includes("@") &&
    formData.email.includes(".");

  return (
    <AuthLayoutWrapper showBackButton={step === 1}>
      <section className={`relative min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden ${poppins.className}`}>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid.png')]" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[460px] bg-white border border-gray-200/60 p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex gap-2 mb-12 justify-center">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-700 ${
                  step >= s ? "w-10 bg-[#ff7600]" : "w-3 bg-slate-200"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Patient Identity</h1>
                  <p className="text-xs text-slate-400 mt-1">Enter your legal patient credentials.</p>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinueStep1}
                  className="w-full bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#ff7600] transition-all disabled:opacity-20"
                >
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-orange-50 text-[#ff7600] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Lock size={28} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Security PIN</h1>
                  <p className="text-xs text-slate-400 mt-1">Create your 6-digit access PIN.</p>
                </div>
                <div className="space-y-8">
                  <div className="flex justify-center gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${formData.pin.length > i ? "bg-[#ff7600] scale-125" : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    autoFocus
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-3xl py-6 text-center text-3xl font-bold tracking-[0.8em] outline-none transition-all"
                  />
                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="px-6 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={formData.pin.length < 6 || loading}
                      className="flex-1 bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#ff7600] transition-all disabled:opacity-20"
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="text-center">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={28} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900">Verify Email</h1>
                  <p className="text-xs text-slate-400 mt-1">Enter code sent to <span className="font-bold text-slate-600">{formData.email}</span></p>
                </div>
                <div className="space-y-8">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-3xl py-6 text-center text-3xl font-bold tracking-[0.4em] outline-none transition-all"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={otp.length < 6 || loading}
                    className="w-full bg-emerald-600 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all disabled:opacity-20"
                  >
                    {loading ? "Verifying..." : "Confirm Access"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-8 p-5 rounded-2xl text-[11px] font-bold text-center border ${isError ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </section>
    </AuthLayoutWrapper>
  );
}