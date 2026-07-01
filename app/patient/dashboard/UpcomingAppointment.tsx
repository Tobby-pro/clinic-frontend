"use client";

import { Clock, MapPin, Stethoscope } from "lucide-react";
import useAppointments, { Appointment } from "../../hooks/useAppointments";
import dayjs from "dayjs";

export default function UpcomingAppointment() {
  const { appointments, loading } = useAppointments();

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider animate-pulse">Loading appointment data...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No upcoming appointments scheduled</p>
      </div>
    );
  }

  const appointment: Appointment = appointments[0];

  // ✅ Fixed: Brought back the precise :00 seconds concatenation to ensure dayjs never marks the time string as invalid
  const appointmentTime = appointment.time
    ? dayjs(`1970-01-01T${appointment.time}:00`) 
    : dayjs();

  const day = appointmentTime.isValid() ? appointmentTime.date() : dayjs().date();
  const month = appointmentTime.isValid() ? appointmentTime.format("MMM") : dayjs().format("MMM");
  const time = appointmentTime.isValid() ? appointmentTime.format("hh:mm A") : appointment.time;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h2 className="font-black text-base text-gray-900 tracking-tight">
          Next Scheduled Visit
        </h2>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-2xl p-4 md:p-5 border border-gray-100 flex items-start gap-4">
          
          {/* Date Container - Restored to your bold, premium structural layout */}
          <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-400">
              {month}
            </span>
            <span className="text-xl font-black text-[#ff7600] leading-none mt-0.5">{day}</span>
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <h4 className="font-bold text-sm md:text-base text-gray-900 truncate">
              {appointment.doctor_name || "General Practitioner"}
            </h4>

            {appointment.doctor_specialty && (
              <p className="text-xs text-gray-400 font-medium truncate flex items-center gap-1">
                <Stethoscope size={12} className="text-[#ff7600]" /> {appointment.doctor_specialty}
              </p>
            )}

            <p className="text-xs text-gray-500 pt-1 font-medium">
              &ldquo;{appointment.reason || "General Consultation"}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              <span className="flex items-center gap-1 shrink-0">
                <Clock size={12} className="text-[#ff7600]" /> {time}
              </span>

              <span className="flex items-center gap-1 min-w-0 max-w-[200px] sm:max-w-none">
                <MapPin size={12} className="text-[#ff7600] shrink-0" /> 
                <span className="truncate">{appointment.clinic_name || "Medical Center"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}