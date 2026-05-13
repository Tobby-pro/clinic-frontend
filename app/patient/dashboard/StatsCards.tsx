"use client";

import { Calendar, CreditCard, MapPin } from "lucide-react";
import useUser from "@/app/hooks/useUser";
import useAppointments from "@/app/hooks/useAppointments";

export default function StatsCards() {
  const { user, loading: userLoading } = useUser();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  
  const upcomingCount = appointments ? appointments.length : 0;
  const isPending = user?.subscription_status === "pending";
  const tierName = user?.subscription_tier || "Basic";
  const primaryClinic = user?.clinic?.name || appointments?.[0]?.clinic_name || "No Clinic Linked";

  const isLoading = userLoading || appointmentsLoading;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      
      {/* 1. UPCOMING APPOINTMENTS */}
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Calendar size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Upcoming</p>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 tracking-tight">
            {isLoading ? "..." : upcomingCount} 
          </h3>
        </div>
      </div>

      {/* 2. DYNAMIC BILLING & STATUS */}
      <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          isPending ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}>
          <CreditCard size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            {isPending ? "Action Required" : "Account Plan"}
          </p>
          <h3 className={`text-lg md:text-xl font-black mt-1 tracking-tight uppercase truncate ${
            isPending ? "text-red-600" : "text-gray-900"
          }`}>
            {isLoading ? "..." : isPending ? "Pay Due" : tierName}
          </h3>
        </div>
      </div>

      {/* 3. PRIMARY CLINIC - Sleek & Adaptive */}
      <div className="col-span-2 md:col-span-1 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center md:items-start gap-4 md:flex-col justify-center md:justify-between min-h-[140px]">
        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff7600] shrink-0">
          <MapPin size={20} />
        </div>
        <div className="min-w-0 w-full">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Primary Clinic</p>
          <h3 className="text-[13px] md:text-[15px] font-bold text-gray-900 mt-1 leading-tight break-words line-clamp-2 md:line-clamp-none">
            {isLoading ? "..." : primaryClinic}
          </h3>
        </div>
      </div>
    </div>
  );
}