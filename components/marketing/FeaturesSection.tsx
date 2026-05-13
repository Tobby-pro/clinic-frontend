// app/components/marketing/FeaturesSection.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Calendar, 
  Activity, 
  LayoutDashboard, 
  Clock,
  ChevronRight
} from "lucide-react";

const features = [
  {
    title: "Smart Scheduling",
    description: "Automate doctor slots and avoid double bookings with our AI-driven engine.",
    icon: <Calendar className="w-6 h-6" />,
    className: "md:col-span-2",
  },
  {
    title: "Patient Insight",
    description: "Detailed consultation history and visit records at a glance.",
    icon: <Activity className="w-6 h-6" />,
    className: "md:col-span-1",
  },
  {
    title: "Admin Dashboard",
    description: "A command center built for efficiency and real-time clinic control.",
    icon: <LayoutDashboard className="w-6 h-6" />,
    className: "md:col-span-1",
  },
  {
    title: "Real-Time Sync",
    description: "Instantly view open slots so your reception books in seconds.",
    icon: <Clock className="w-6 h-6" />,
    className: "md:col-span-2",
  },
];

export default function FeaturesSection() {
  return (
    /* ✅ Lower z-index (z-10) ensures it stays UNDER the floating card from the section above */
    <section id="features" className="relative z-10 py-24 bg-[#020617] overflow-hidden w-full">
      
      <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.1] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff7600]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col items-center mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="px-4 py-1 mb-4 border rounded-full bg-white/5 border-white/10 backdrop-blur-md"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
              Platform Features
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">future of clinic management.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/50 p-8 hover:bg-slate-900/80 transition-all duration-500 ${feature.className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-500 mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
            {feature.icon}
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
          <p className="text-slate-400 text-lg leading-relaxed">{feature.description}</p>
        </div>
        
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/5 blur-3xl group-hover:bg-orange-500/20 transition-colors" />
    </motion.div>
  );
}