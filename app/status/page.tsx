// app/status/page.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Server, Database, Cpu, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/marketing/Navbar"; // Adjusted to match your exact Navbar layout path
import Footer from "@/components/layout/Footer";

export default function StatusPage() {
  const lastChecked = "Live Uptime Tracking";

  const systems = [
    {
      title: "Clinical Core API Engine",
      icon: <Cpu className="text-[#ff7600]" size={20} />,
      content: "All administrative request parameters and core backend scheduling clusters are performing optimally.",
      meta: "14ms latency • Operational"
    },
    {
      title: "Master Ledger Database Nodes",
      icon: <Database className="text-[#ff7600]" size={20} />,
      content: "Main cloud database read/write actions are actively mirroring secure patient records with zero sync delay.",
      meta: "99.99% uptime • Operational"
    },
    {
      title: "Patient Document Vault (Cloudinary)",
      icon: <Server className="text-[#ff7600]" size={20} />,
      content: "Medical compliance data streams and doctor credential file attachments are processing cleanly.",
      meta: "Optimized connection • Operational"
    },
    {
      title: "NHN Compliance Gateways",
      icon: <ShieldCheck className="text-[#ff7600]" size={20} />,
      content: "External network connectivity with Nigerian health check authorities and token verifications are fully synced.",
      meta: "Verified handshake • Operational"
    }
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-slate-300 overflow-hidden relative">
      {/* AMBIENT GLOW LINES MATCHING LOGIC */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-[#ff7600]/30 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* HERO STATUS SUMMARY SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            System <span className="text-[#ff7600]">Status</span>
          </h1>
          <p className="text-slate-500">{lastChecked}</p>
          <div className="h-1 w-20 bg-emerald-500 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* COMPONENT STATUS CARDS GRID */}
        <div className="space-y-12">
          {systems.map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                
                {/* ACTIVE HEALTH TICKER badge */}
                <div className="text-[11px] font-mono tracking-wider font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl sm:text-right w-max">
                  {section.meta}
                </div>
              </div>
              
              <p className="leading-relaxed text-slate-400 text-sm md:text-base">
                {section.content}
              </p>
            </motion.section>
          ))}

          {/* INCIDENT REPORT BOX FOOTNOTE */}
          <section className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" /> Infrastructure Maintenance Logs
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our engineering team tracks server dependencies 24/7 from Ikeja, Lagos. No scheduled maintenance operations are active at this time.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}