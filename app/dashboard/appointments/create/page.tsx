// app/dashboard/appointments/create/page.tsx

"use client";

import Link from "next/link";
import { Suspense } from "react";

import AppointmentForm from "@/components/dashboard/AppointmentForm";

function AppointmentFormWrapper() {
  return <AppointmentForm />;
}

export default function CreateAppointmentPage() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Create Appointment
        </h1>

        <Link
          href="/dashboard/appointments"
          className="text-sm text-[#ff7600] font-semibold hover:underline"
        >
          ← Back to Appointments
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <Suspense
          fallback={
            <div className="py-10 text-center text-sm text-gray-500">
              Loading appointment form...
            </div>
          }
        >
          <AppointmentFormWrapper />
        </Suspense>

      </div>

    </div>
  );
}