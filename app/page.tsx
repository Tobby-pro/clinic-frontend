"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import { Poppins } from "next/font/google";
import { CheckCircle2, Users, Calendar, Sparkles } from "lucide-react"; 
import FeaturesSection from "@/components/marketing/FeaturesSection";
import PatientExperience from "@/components/marketing/PatientExperience";
import Footer from "@/components/layout/Footer"; 
import CTASection from "@/components/marketing/CTASection";
import FloatingTrustCard from "@/components/marketing/FloatingTrustCard";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function HomePage() {
  const sectionRef = useRef(null);

  /* ---------------- SCROLL PARALLAX ---------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  /* ---------------- MAGNETIC CTA ---------------- */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 12 });
  const springY = useSpring(y, { stiffness: 150, damping: 12 });

  function handleMouseMove(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX * 0.15); 
    y.set(offsetY * 0.15);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  /* ---------------- WORD REVEAL ---------------- */
  const heading = "Transform Your Clinic Operations With Intelligent Scheduling.";
  const words = heading.split(" ");

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-40 min-h-screen flex items-center overflow-visible bg-[url('/images/grid-background-mobile.png')] bg-cover bg-center bg-no-repeat md:bg-[url('/images/grid-background-desktop.png')] lg:bg-top 
        pt-24 pb-20 md:pt-40 lg:pt-48"
      >
        {/* ENHANCED GRADIENT MESH */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute top-[-5%] left-[-5%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#ff7600]/20 blur-[100px] md:blur-[130px] rounded-full animate-pulse opacity-70"></div>
          <div className="absolute bottom-[-5%] right-[0%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-orange-300/30 blur-[80px] md:blur-[110px] rounded-full opacity-60"></div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* LEFT SIDE: CONTENT */}
            <div className="text-center lg:text-left z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/80 backdrop-blur-sm border border-orange-100 text-[#ff7600] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6"
              >
                <Sparkles size={14} className="animate-spin-slow" />
                V2.0 AI Integration Ready
              </motion.div>

              <h1 className={`${poppins.className} font-extrabold tracking-tight text-[32px] leading-[1.1] sm:text-5xl md:text-5xl lg:text-6xl text-indigo-950`}>
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.5 }}
                    className={word === "Scheduling." ? "text-[#ff7600] inline-block mr-1 md:mr-2" : "inline-block mr-1 md:mr-2"}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-6 text-sm md:text-lg lg:text-md text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 md:px-0"
              >
                The ultimate workspace for modern clinics. Centralize your data, automate patient bookings, and reclaim your time.
              </motion.p>

              {/* BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-4 mt-10 sm:flex-row sm:items-center sm:justify-center lg:justify-start px-4 md:px-0"
              >
                <motion.div
                  style={{ x: springX, y: springY }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="relative group w-full sm:w-auto"
                >
                  <Link
                    href="/admin/register"
                    className="w-full bg-[#ff7600] text-white py-4 px-8 rounded-2xl text-base font-bold transition-all duration-300 hover:bg-[#e56b00] shadow-[0_10px_20px_-10px_rgba(255,118,0,0.5)] text-center block"
                  >
                    Get Started Free
                  </Link>
                </motion.div>

                <Link
                  href="/admin/login"
                  className="w-full sm:w-auto border-2 border-slate-200 text-slate-700 py-4 px-8 rounded-2xl text-base font-bold transition-all duration-300 hover:bg-white/50 backdrop-blur-sm text-center"
                >
                  Admin Login
                </Link>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.2 }}
                 className="mt-8 flex items-center justify-center lg:justify-start gap-2"
              >
                <Link href="/register" className="text-sm font-semibold text-[#ff7600] hover:underline flex items-center gap-1 group">
                  <Calendar size={16} className="group-hover:scale-110 transition-transform" /> Patient Booking Portal
                </Link>
              </motion.div>
            </div>

            {/* RIGHT SIDE: IMAGE */}
            <div className="relative flex justify-center items-center lg:h-[600px] mt-12 lg:mt-0">
              <motion.div
                style={{ y: imageY }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Image
                  src="/images/new-doc05.png"
                  alt="3D clinic illustration"
                  width={600}
                  height={600}
                  priority
                  className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] w-[75%] md:w-[85%] max-w-[500px] lg:w-auto mx-auto"
                />

                {/* STATUS CARD 1: INDIGO THEME */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-4 -left-2 md:-left-12 bg-white/60 backdrop-blur-xl border border-white/40 p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
                >
                  <div className="bg-indigo-950 p-1.5 md:p-2 rounded-full text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500">Booking Confirmed</p>
                    <p className="text-xs md:text-sm font-bold text-indigo-950">New Patient Scheduled</p>
                  </div>
                </motion.div>

                {/* STATUS CARD 2: ORANGE THEME */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -bottom-6 -right-2 md:-right-8 bg-white/60 backdrop-blur-xl border border-white/40 p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
                >
                  <div className="bg-[#ff7600] p-1.5 md:p-2 rounded-full text-white">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500">Doctor Status</p>
                    <p className="text-xs md:text-sm font-bold text-indigo-950">12 Active Today</p>
                  </div>
                </motion.div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-[#ff7600]/25 blur-[80px] md:blur-[100px] rounded-full -z-10 animate-pulse"></div>
              </motion.div>
            </div>
          </div>
        </div>

        <FloatingTrustCard />
      </section>

      <FeaturesSection />
      <PatientExperience />
      <CTASection />
      <Footer />
    </>
  );
}