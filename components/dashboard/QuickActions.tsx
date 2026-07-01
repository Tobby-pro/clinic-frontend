// components/dashboard/QuickAction.tsx
"use client";

import React from "react";
import { Plus, UserPlus, CheckSquare, CreditCard, ArrowUpRight } from "lucide-react";
import { useGlobalDrawer, DrawerType } from "@/app/hooks/useGlobalDrawer"; // 🎯 Back to your hook

const BRAND_TEXT = "text-[#ff7600]";
const BRAND_LIGHT_BG = "bg-orange-50/60";
const BRAND_HOVER_BORDER = "hover:border-[#ff7600]/40";

interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  viewType: DrawerType; // 🎯 Matching your store's view types
}

export default function QuickActions() {
  // 🚀 Fire your global drawer hook directly
  const openDrawer = useGlobalDrawer((state) => state.openDrawer);

  const actions: QuickActionItem[] = [
    {
      id: "action-book",
      label: "Book Appointment",
      description: "Launch workspace intake form",
      icon: Plus,
      viewType: "BOOK_APPOINTMENT",
    },
    {
      id: "action-checkin",
      label: "Check-In Patient",
      description: "Move patient into active queue",
      icon: CheckSquare,
      viewType: "CHECK_IN",
    },
    {
      id: "action-register",
      label: "Register Patient",
      description: "Create basic profile record",
      icon: UserPlus,
      viewType: "REGISTER_PATIENT",
    },
    {
      id: "action-billing",
      label: "Collect Payment",
      description: "Process outstanding balances",
      icon: CreditCard,
      viewType: "COLLECT_PAYMENT",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 w-full">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={() => openDrawer(action.viewType)} // 🎯 Slides open the side panel instantly
            className={`group text-left w-full p-4 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-between gap-4 ${BRAND_HOVER_BORDER} hover:shadow-sm outline-none`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-10 h-10 shrink-0 ${BRAND_LIGHT_BG} ${BRAND_TEXT} rounded-xl flex items-center justify-center`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-xs font-black text-gray-900 tracking-tight truncate">
                  {action.label}
                </h4>
                <p className="text-[11px] text-gray-400 font-medium leading-tight truncate">
                  {action.description}
                </p>
              </div>
            </div>

            <ArrowUpRight 
              size={14} 
              className="text-gray-300 group-hover:text-[#ff7600] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" 
              strokeWidth={2.5}
            />
          </button>
        );
      })}
    </div>
  );
}