"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  // ---------------- MAGNETIC BUTTON ----------------
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 12 });
  const springY = useSpring(y, { stiffness: 150, damping: 12 });

  const handleMouseMove = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // ---------------- VERIFY EMAIL ----------------
  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await fetch(`/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, []);

  // ---------------- AUTO REDIRECT ----------------
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => router.push("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-6">
      {/* GRADIENT BACKGROUND */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#ff7600]/20 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-300/20 blur-[140px] rounded-full"></div>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-xl backdrop-blur-xl bg-white/70 border border-white/40 p-8 sm:p-10 rounded-2xl shadow-2xl text-center"
      >
        {/* HEADING */}
        <h1
          className={`${poppins.className} text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6`}
        >
          {status === "loading" && "Verifying Email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </h1>

        {/* MESSAGE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm sm:text-base ${
            status === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message}
        </motion.p>

        {/* BUTTON TO LOGIN */}
        {status !== "loading" && (
          <motion.div
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="mt-8"
          >
            <button
              onClick={() => router.push("/login")}
              className="bg-[#ff7600] text-white py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 hover:bg-[#e56b00] active:scale-[0.97] shadow-md hover:shadow-xl"
            >
              Go to Login
            </button>
          </motion.div>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Redirecting to login automatically...
        </p>
      </motion.div>
    </section>
  );
}