"use client";

import { Calendar, Award, MapPin } from "lucide-react";
import useUser from "@/app/hooks/useUser";
import useAppointments from "@/app/hooks/useAppointments";

export default function StatsCards() {
  const { user, loading: userLoading } = useUser();
  const { appointments, loading: appointmentsLoading } = useAppointments();
  
  const upcomingCount = appointments ? appointments.length : 0;
  const isLoading = userLoading || appointmentsLoading;

  // Best Practice: Derive profile statuses securely using mapped type contracts
  const isVerified = user?.verification_status === "verified" || user?.is_verified;
  const profileStatus = isVerified ? "Verified Account" : "Standard Profile";
  
  const primaryClinic = user?.clinic?.name || appointments?.[0]?.clinic_name || "No Linked Clinic";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      
      {/* 1. UPCOMING APPOINTMENTS */}
      <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Calendar size={20} />
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Upcoming Visits</p>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mt-1 tracking-tight">
            {isLoading ? "..." : upcomingCount} 
          </h3>
        </div>
      </div>

      {/* 2. PROFILE VERIFICATION LEVEL */}
      <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          isVerified ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-[#ff7600]"
        }`}>
          <Award size={20} />
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Account Type</p>
          <h3 className="text-sm md:text-base font-black mt-1 tracking-tight text-gray-900 uppercase truncate">
            {isLoading ? "..." : profileStatus}
          </h3>
        </div>
      </div>

      {/* 3. PRIMARY CLINIC LINK */}
      <div className="col-span-2 md:col-span-1 bg-white p-5 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center md:items-start gap-4 md:flex-col justify-center md:justify-between min-h-[140px]">
        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
          <MapPin size={20} />
        </div>
        <div className="min-w-0 w-full md:mt-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Primary Center</p>
          <h3 className="text-xs md:text-sm font-bold text-gray-900 mt-1 leading-tight break-words line-clamp-2">
            {isLoading ? "..." : primaryClinic}
          </h3>
        </div>
      </div>
    </div>
  );
}