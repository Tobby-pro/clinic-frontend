// components/layout/Navbar.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll coordinates to flip navbar theme states dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Automatically secure and close mobile menu if layout changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

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
    <header className="fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300">
      {/* 🔮 DYNAMIC BACKGROUND: Shifts from light glassmorphism to dark solid luxury glass */}
      <div 
        className={`absolute inset-0 border-b transition-all duration-300 backdrop-blur-2xl ${
          isScrolled 
            ? "bg-slate-950/85 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]" 
            : "bg-white/10 border-white/20 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
        }`} 
      />
      
      <div className="relative max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO SECTION - Color turns crisp white via invert style filter when scrolled over dark regions */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95 z-50">
          <Image 
            src="/images/clin_clinbox01.png"
            alt="Clinbox Logo" 
            width={130} 
            height={36} 
            priority
            className={`object-contain w-[115px] h-auto md:w-[130px] transition-all duration-300 ${
              isScrolled ? "brightness-0 invert" : ""
            }`}
          />
        </Link>

        {/* DESKTOP NAV LINKS - Text switches color states gracefully based on scroll timeline positions */}
        <nav className={`hidden md:flex items-center gap-10 text-[14px] font-medium transition-colors duration-300 ${
          isScrolled ? "text-slate-200" : "text-slate-700/80"
        }`}>
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
          <Link href="/demo" className={`transition-colors font-bold ${isScrolled ? "text-white hover:text-[#ff7600]" : "text-slate-900 hover:text-[#ff7600]"}`}>
            Book Demo
          </Link>
        </nav>

        {/* ACTIONS / MOBILE TOGGLE CONTAINER */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="/admin/login"
            className={`hidden sm:block text-sm font-bold transition-colors duration-300 ${
              isScrolled ? "text-slate-300 hover:text-[#ff7600]" : "text-slate-800 hover:text-[#ff7600]"
            }`}
          >
            Sign In
          </Link>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <Link
              href="/admin/register"
              className="bg-[#ff7600] text-white px-7 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_10px_20px_-10px_rgba(255,118,0,0.5)] hover:bg-[#e56b00]"
            >
              Get Started
            </Link>
          </motion.div>

          {/* MOBILE TRIGGER HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 transition-colors md:hidden z-50 relative ${
              isScrolled || isOpen ? "text-white hover:text-[#ff7600]" : "text-slate-800 hover:text-[#ff7600]"
            }`}
            aria-label="Toggle navigation view"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL SCREEN NAV UNDERLAY DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full min-h-screen bg-[#020617]/95 backdrop-blur-3xl z-40 border-b border-white/5 px-6 pt-28 pb-10 flex flex-col justify-between md:hidden shadow-2xl"
          >
            {/* BACKGROUND LAYER DECORATION FOR BLUR DEPTH */}
            <div className="absolute inset-0 z-0 opacity-[0.02] bg-[url('/images/grid.png')] pointer-events-none" />
            <div className="absolute top-[15%] right-[-10%] w-[300px] h-[300px] bg-[#ff7600]/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff7600] text-[9px] font-black uppercase tracking-widest w-max mb-2">
                <Sparkles size={10} /> Intelligent Infrastructure
              </div>
              
              <Link 
                href="/#features" 
                onClick={closeMobileMenu}
                className="text-2xl font-black text-white hover:text-[#ff7600] transition-colors py-2 border-b border-white/5"
              >
                Features
              </Link>
              <Link 
                href="/solutions" 
                onClick={closeMobileMenu}
                className="text-2xl font-black text-white hover:text-[#ff7600] transition-colors py-2 border-b border-white/5"
              >
                Solutions
              </Link>
              <Link 
                href="/pricing" 
                onClick={closeMobileMenu}
                className="text-2xl font-black text-white hover:text-[#ff7600] transition-colors py-2 border-b border-white/5"
              >
                Pricing
              </Link>
              <Link 
                href="/demo" 
                onClick={closeMobileMenu}
                className="text-2xl font-black text-[#ff7600] transition-colors py-2 flex items-center justify-between"
              >
                Book Demo <ArrowRight size={20} />
              </Link>
            </div>

            {/* LOWER SHEET ACTION BLOCK */}
            <div className="relative z-10 space-y-4 mt-8">
              <Link
                href="/admin/login"
                onClick={closeMobileMenu}
                className="block w-full py-4 text-center rounded-2xl text-sm font-bold text-slate-300 bg-white/5 border border-white/10 transition-all active:scale-[0.98]"
              >
                Sign In to Account
              </Link>
              <Link
                href="/admin/register"
                onClick={closeMobileMenu}
                className="block w-full py-4 text-center rounded-2xl text-sm font-bold text-white bg-[#ff7600] hover:bg-[#e56b00] shadow-xl shadow-orange-500/20 transition-all active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}