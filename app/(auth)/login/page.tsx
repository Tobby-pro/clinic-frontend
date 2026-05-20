// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

import { loginPatient } from "@/services/api";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function PatientLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (password.length < 6) {
      setIsError(true);
      setMessage("Please enter your full 6-digit PIN.");
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMessage("");

      const response = await loginPatient({
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (response) {
        setMessage("Access granted. Loading your records...");
        
        setTimeout(() => {
          router.push("/patient/dashboard");
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setIsError(true);
      setMessage(err?.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.includes("@") && password.length === 6;

  return (
    <AuthLayoutWrapper>
      <section className={`relative min-h-screen w-full flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden ${poppins.className}`}>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/grid.png')]" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[460px] bg-white border border-gray-200/60 p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-200">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Enter your information to continue.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="e.g. tobby@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 pl-14 pr-6 text-xs font-medium outline-none transition-all"
                />
              </div>
            </div>

            {/* PIN Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Security PIN
                </label>
                <div className="flex gap-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${password.length > i ? "bg-[#ff7600] scale-110" : "bg-slate-200"}`} 
                    />
                  ))}
                </div>
              </div>
              
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] rounded-2xl py-5 text-center text-2xl font-bold tracking-[0.6em] outline-none transition-all"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid || loading}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#ff7600] transition-all disabled:opacity-20 mt-4 shadow-xl shadow-slate-100"
            >
              {loading ? "Authenticating..." : (
                <>
                  Secure Login <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Feedback Messages */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-5 rounded-2xl text-[11px] font-bold text-center border flex items-center justify-center gap-2 ${
                isError 
                  ? "bg-red-50 text-red-500 border-red-100" 
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {isError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
              {message}
            </motion.div>
          )}

          {/* Footer Link */}
          <p className="text-center mt-10 text-[11px] font-medium text-slate-400">
            New patient?{" "}
            <button 
              onClick={() => router.push("/register")}
              className="text-slate-900 font-bold hover:text-[#ff7600] transition-colors"
            >
              Create an account
            </button>
          </p>
        </motion.div>
      </section>
    </AuthLayoutWrapper>
  );
}