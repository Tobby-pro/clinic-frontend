"use client";

import { Crown, Zap, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";

type TierType = "BASIC" | "PREMIUM" | "FAMILY" | "CORPORATE";

interface TierBadgeProps {
  tier: TierType | string;
  showIcon?: boolean;
  className?: string;
}

export default function TierBadge({ tier, showIcon = true, className = "" }: TierBadgeProps) {
  // Define styles and labels for each tier
  const tierConfig: Record<string, { label: string; icon: any; styles: string }> = {
    CORPORATE: {
      label: "Hospital Grade",
      icon: <Crown size={10} />,
      styles: "bg-[#ff7600] text-white shadow-lg shadow-orange-500/20",
    },
    PREMIUM: {
      label: "Priority Care",
      icon: <Zap size={10} />,
      styles: "bg-slate-900 text-white",
    },
    FAMILY: {
      label: "Family Verified",
      icon: <Star size={10} />,
      styles: "bg-blue-600 text-white",
    },
    BASIC: {
      label: "Standard",
      icon: <ShieldCheck size={10} />,
      styles: "bg-gray-100 text-gray-500 border border-gray-200",
    },
  };

  const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.BASIC;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.styles} ${className}`}
    >
      {showIcon && config.icon}
      {config.label}
    </motion.div>
  );
}