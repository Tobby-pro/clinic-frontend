// app/privacy-policy/page.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPolicy() {
  const lastUpdated = "May 2026";

  const sections = [
    {
      title: "1. Data Collection",
      icon: <Eye className="text-[#ff7600]" size={20} />,
      content: "We collect personal information such as names, contact details, and sensitive health data provided by healthcare providers and patients for clinical scheduling and management purposes."
    },
    {
      title: "2. NDPR Compliance",
      icon: <ShieldCheck className="text-[#ff7600]" size={20} />,
      content: "In accordance with the Nigeria Data Protection Regulation (NDPR), we implement strict technical and organizational measures to ensure the safety of Nigerian citizens' data."
    },
    {
      title: "3. Data Usage",
      icon: <FileText className="text-[#ff7600]" size={20} />,
      content: "Information is used solely to facilitate clinic operations, appointment reminders, and medical record management. We do not sell data to third-party advertisers."
    },
    {
      title: "4. Security measures",
      icon: <Lock className="text-[#ff7600]" size={20} />,
      content: "All health data is encrypted at rest and in transit. Access is restricted to authorized medical personnel only, protected by multi-factor authentication."
    }
  ];

  return (
    <div className="bg-[#020617] min-h-screen text-slate-300">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy <span className="text-[#ff7600]">Policy</span>
          </h1>
          <p className="text-slate-500">Last Updated: {lastUpdated}</p>
          <div className="h-1 w-20 bg-[#ff7600] mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ff7600]/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <p className="leading-relaxed text-slate-400">
                {section.content}
              </p>
            </motion.section>
          ))}

          <section className="bg-orange-500/5 border border-[#ff7600]/20 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Contact our Data Protection Officer</h2>
            <p className="text-slate-400 mb-4">
              If you have questions regarding your data rights under the NDPR, please reach out to our team in Ikeja, Lagos.
            </p>
            <a href="mailto:privacy@clinbox.com" className="text-[#ff7600] font-bold hover:underline">
              privacy@clinbox.com
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}