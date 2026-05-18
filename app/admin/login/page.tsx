// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginUser } from "@/services/api";
import { Poppins } from "next/font/google";
import { ShieldCheck, Loader2, Sparkles, LogIn, Mail, Lock } from "lucide-react";
import Loader from "@/components/ui/Loader";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// LOGIN VALIDATION SCHEMA
const loginSchema = z.object({
  email: z.string().email("Invalid work email"),
  pin: z.string().length(6, "PIN must be 6 digits"),
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const validation = loginSchema.safeParse({ email, pin });

    if (!validation.success) {
      setIsError(true);
      setMessage(validation.error.issues[0].message);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      setIsError(false);

      await loginUser({
        email,
        password: pin,
      });

      setMessage("Authenticated. Redirecting...");

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: any) {
      setIsError(true);

      if (err?.response?.status === 401) {
        setMessage("Invalid credentials. Access Denied.");
      } else {
        setMessage(err.message || "Network sync failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !message) return <Loader text="Verifying Credentials..." />;

  return (
    <AuthLayoutWrapper>
      <section className={`relative min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden ${poppins.className}`}>
        
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/images/grid.png')] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#ff7600]/5 blur-[120px] rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-[460px] bg-white border border-gray-200/60 p-10 md:p-14 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04),0_20px_80px_rgba(0,0,0,0.03)]"
        >
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-[10px] font-black uppercase tracking-wider mb-6">
              <Sparkles size={12} />
              Authorized Personnel
            </div>

            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back.
            </h1>

            <p className="text-[13px] text-slate-400 font-medium mt-2">
              Securely access your clinical node.
            </p>
          </header>

          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                Work Email
              </label>

              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="admin@clinic.com"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] focus:bg-white focus:ring-4 focus:ring-orange-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-medium outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 text-center">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                6-Digit Security Key
              </label>

              <div className="flex justify-center gap-3 py-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      pin.length > i ? "bg-[#ff7600] scale-125 shadow-[0_0_10px_#ff7600]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#ff7600] focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-center text-2xl font-bold tracking-[0.8em] outline-none transition-all"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <ShieldCheck size={16} className="text-[#ff7600] mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              NHN Vault ensures your credentials remain encrypted and local to this workstation.
            </p>
          </div>

            <button
              onClick={handleLogin}
              disabled={isLoading || pin.length < 6}
              className="w-full bg-slate-900 text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#ff7600] transition-all active:scale-[0.96] shadow-xl shadow-slate-200 disabled:opacity-20 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign in to Clinbox
                  <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mt-8 p-4 rounded-2xl text-center text-[11px] font-bold border ${
                isError
                  ? "bg-red-50 text-red-500 border-red-100"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </section>
    </AuthLayoutWrapper>
  );
}