"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const isInternalPage = 
    pathname.includes("/dashboard") || 
    pathname.includes("/login") || 
    pathname.includes("/register") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/admin");

  if (isInternalPage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[100]">
      {/* THIS IS THE SECRET LAYER:
          We use a very low opacity white (10%) and a massive blur.
          This allows the orange mesh from your page.tsx to "bleed" through.
      */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95">
          <Image 
            src="/images/clin_clinbox01.png"
            alt="Clinbox Logo" 
            width={130} 
            height={36} 
            priority
            className="object-contain"
          />
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-10 text-[14px] font text-slate-700/80">
          <Link href="/#features" className="hover:text-[#ff7600] transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff7600] transition-all group-hover:w-full" />
          </Link>
          <Link href="/solutions" className="hover:text-[#ff7600] transition-colors relative group">
            Solutions
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff7600] transition-all group-hover:w-full" />
          </Link>
          <Link href="/pricing" className="hover:text-[#ff7600] transition-colors relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff7600] transition-all group-hover:w-full" />
          </Link>
          <Link href="/demo" className="text-slate-900 hover:text-[#ff7600] transition-colors">
            Book Demo
          </Link>
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-6">
          <Link
            href="/admin/login"
            className="hidden sm:block text-sm font-bold text-slate-800 hover:text-[#ff7600] transition-colors"
          >
            Sign In
          </Link>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/admin/register"
              className="bg-[#ff7600] text-white px-7 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_10px_20px_-10px_rgba(255,118,0,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(255,118,0,0.6)] hover:bg-[#e56b00]"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}