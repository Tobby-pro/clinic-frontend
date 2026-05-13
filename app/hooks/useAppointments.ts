// app/hooks/useAppointments.ts
"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/services/api";

// ---------------------------
// Appointment interface
// ---------------------------
export interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  doctor_specialty?: string;
  clinic_name?: string;
  clinic_address?: string;
  time: string;          // HH:MM format
  status: string;
  reason?: string;
}

// ---------------------------
// Custom Hook
// ---------------------------
export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        // 🔹 Fetch upcoming appointments for the current patient
        const res = await fetch(`${API_URL}/appointments/upcoming`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch appointments: ${res.status}`);
        }

        const data: Appointment[] = await res.json();

        // 🔹 Optional: ensure sorted by slot time ascending
        data.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.time}`);
          const timeB = new Date(`1970-01-01T${b.time}`);
          return timeA.getTime() - timeB.getTime();
        });

        setAppointments(data);
      } catch (err) {
        console.error("Appointments hook error:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  return { appointments, loading };
}