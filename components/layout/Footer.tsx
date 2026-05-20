"use client";

import Link from "next/link";
import { Twitter, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020617] border-t border-white/10 pt-20 pb-10 overflow-hidden">
      {/* 🎇 SLEEK BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#ff7600]/50 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#ff7600]/5 blur-[120px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          
          {/* BRAND COLUMN */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
              <Image 
                src="/images/clin_clinbox01.png"
                alt="Clinbox Logo" 
                width={130} 
                height={36} 
                priority
                className="object-contain brightness-0 invert" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The ultimate workspace for modern clinics. Centralize your data, automate patient bookings, and reclaim your time.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#ff7600] hover:text-white hover:border-[#ff7600] transition-all duration-300">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* QUICK LINKS (Synced with Navbar) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Features", href: "/#features" },
                { name: "Solutions", href: "/solutions" },
                { name: "Pricing", href: "/pricing" },
                { name: "Book Demo", href: "/demo" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 hover:text-[#ff7600] text-sm transition-colors flex items-center gap-2 group">
                    <div className="h-1 w-0 bg-[#ff7600] group-hover:w-2 transition-all rounded-full" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SUPPORT (Fixed Privacy Link) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Support</h4>
            <ul className="flex flex-col gap-4">
              {["System Status", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === "Privacy Policy" ? "/privacy-policy" : "/status"} 
                    className="text-slate-400 hover:text-[#ff7600] text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Get in Touch</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-slate-400 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#ff7600]/50 transition-colors">
                  <MapPin size={16} className="text-[#ff7600]" />
                </div>
                <span className="text-sm">Ikeja, Lagos,<br/>Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#ff7600]/50 transition-colors">
                  <Mail size={16} className="text-[#ff7600]" />
                </div>
                <span className="text-sm">support@clinbox.com.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs tracking-wide uppercase">
            © {currentYear} CLINBOX SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}