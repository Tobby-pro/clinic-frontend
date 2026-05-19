// app/demo/page.tsx

"use client";

import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { 
  Sparkles, 
  Video, 
  Layers, 
  Zap, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";
import AuthLayoutWrapper from "@/components/ui/AuthLayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function BookDemoPage() {
  const valueProps = [
    {
      icon: <Video className="text-[#ff7600]" size={18} />,
      title: "Personalized 15-Min Walkthrough",
      desc: "No generic slide decks. See exactly how Clinbox manages your specific clinical workflows.",
    },
    {
      icon: <Layers className="text-[#ff7600]" size={18} />,
      title: "Live Architecture Deep-Dive",
      desc: "Explore the Clinical Master Ledger, automated billing tracks, and patient self-scheduling engine.",
    },
    {
      icon: <Zap className="text-[#ff7600]" size={18} />,
      title: "Custom Migration Strategy",
      desc: "Learn how we seamlessly transfer your active patient records from legacy software with zero downtime.",
    },
  ];

  return (
    <AuthLayoutWrapper showBackButton={true}>
      <main className={`relative min-h-screen bg-slate-50 pt-32 pb-20 overflow-hidden ${poppins.className}`}>
        
        {/* BRANDED GRAPHIC BACKGROUND */}
        <div className="absolute inset-0 z-0 opacity-[0.2] bg-[url('/images/grid-background-desktop.png')] bg-top pointer-events-none" />
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#ff7600]/10 blur-[120px] rounded-full pointer-events-none" />

        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT SIDE: VALUE PROPOSITION */}
            <div className="lg:col-span-5 text-center lg:text-left mt-4 lg:mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#ff7600] text-[10px] font-black uppercase tracking-wider mb-6"
              >
                <Sparkles size={12} />
                Experience Clinbox Live
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-tight leading-[1.1] mb-6"
              >
                See how we power <span className="text-[#ff7600]">modern</span> clinics.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm md:text-base text-slate-600 leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0"
              >
                Discover how our intelligent scheduling platform eliminates administrative gridlock, manages role scopes securely, and cuts patient wait times by up to 40%.
              </motion.p>

              {/* STYLED BENEFITS LIST */}
              <div className="space-y-6 text-left max-w-xl mx-auto lg:mx-0">
                {valueProps.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 rounded-2xl bg-white/60 border border-slate-100 shadow-sm backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-indigo-950 mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* COMPLIANCE FOOTER NOTE */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10 flex items-center justify-center lg:justify-start gap-4 opacity-60 px-4"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-[#ff7600]" /> NHN Compliant Node
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-[#ff7600]" /> NDPR Data Encrypted
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: THE SCHEDULING INTERFACE LAYER */}
            <div className="lg:col-span-7 w-full flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="w-full max-w-[680px] bg-white border border-slate-200/80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden min-h-[600px] relative"
              >
                {/* CALENDLY / CAL.COM INTEGRATION IFRAME PLACEHOLDER */}
                {/* Once you have your booking link setup, swap this div out with your Cal/Calendly embed iframe */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-orange-100/80 flex items-center justify-center mb-4 text-[#ff7600] animate-bounce">
                    <Video size={28} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Calendar Interface Wrapper Ready</h3>
                  <p className="text-xs text-slate-400 font-medium text-center max-w-sm mb-6">
                    Drop your preferred third-party engine iframe code (Cal.com or Calendly) inside this structural module tree.
                  </p>
                  
                  {/* Visual mockup representation of internal calendar blocks */}
                  <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-4 space-y-3 opacity-40 shadow-inner select-none pointer-events-none">
                    <div className="h-4 bg-slate-100 rounded-md w-1/3 mb-4" />
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(8)].map((_, idx) => (
                        <div key={idx} className="h-10 bg-slate-50 border border-slate-100 rounded-lg" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real Inline Cal Embed Container Template if preferred */}
                {/* 
                <iframe
                  src="https://cal.com/your-clinic-link/demo"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0"
                /> 
                */}
              </motion.div>
            </div>

          </div>
        </section>
      </main>
    </AuthLayoutWrapper>
  );
}