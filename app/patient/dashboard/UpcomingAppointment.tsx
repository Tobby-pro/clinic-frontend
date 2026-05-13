// app/patient/dashboard/UpcomingAppointment.tsx
"use client";

import { Clock, MapPin, Stethoscope } from "lucide-react";
import useAppointments, { Appointment } from "../../hooks/useAppointments";
import dayjs from "dayjs";

export default function UpcomingAppointment() {
  const { appointments, loading } = useAppointments();

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-400">Loading appointment...</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-400">No upcoming appointments</p>
      </div>
    );
  }

  // 👉 Get the first upcoming appointment
  const appointment: Appointment = appointments[0];

  // 👉 Parse time safely using dayjs, fallback to current time if invalid
  const appointmentTime = appointment.time
    ? dayjs(`1970-01-01T${appointment.time}:00`) // add seconds to avoid invalid parsing
    : dayjs();

  const day = appointmentTime.isValid() ? appointmentTime.date() : dayjs().date();
  const month = appointmentTime.isValid() ? appointmentTime.format("MMM") : dayjs().format("MMM");
  const time = appointmentTime.isValid() ? appointmentTime.format("hh:mm A") : dayjs().format("hh:mm A");

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-50">
        <h2 className="font-bold text-lg text-gray-900">
          Upcoming Appointment
        </h2>
      </div>

      {/* Appointment Card */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-start gap-4">
          
          {/* Date Box */}
          <div className="bg-white w-14 h-14 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100 shrink-0">
            <span className="text-[10px] uppercase font-bold text-gray-400">
              {month}
            </span>
            <span className="text-xl font-black text-[#ff7600]">{day}</span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 truncate">
              {appointment.doctor_name || "Unknown Doctor"}
            </h4>

            {appointment.doctor_specialty && (
              <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                <Stethoscope size={12} /> {appointment.doctor_specialty}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-1">
              {appointment.reason || "General Consultation"}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {time}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={12} /> {appointment.clinic_name || "Clinic"}{" "}
                {appointment.clinic_address ? `- ${appointment.clinic_address}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}