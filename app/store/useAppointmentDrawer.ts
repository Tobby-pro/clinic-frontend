// app/store/useAppointmentDrawer.ts

import { create } from "zustand";

interface Appointment {
  id: number;
  patient_id?: number;
  patient_name?: string;
  doctor_name?: string;
  time?: string;
  date?: string;
  status?: string;
  reason?: string;
  // Adding flexible fields for patient-side normalization
  doctor_specialty?: string;
  clinic_name?: string;
  clinic_address?: string;
}

interface DrawerState {
  selectedAppt: Appointment | null;
  openDrawer: (appt: Appointment) => void;
  closeDrawer: () => void;
}

export const useAppointmentDrawer = create<DrawerState>((set) => ({
  selectedAppt: null,

  // We spread the appt object {...appt} to ensure Zustand detects a 
  // state change and triggers an immediate re-render of the drawer.
  openDrawer: (appt) => {
    console.log("🛠️ [STORE] Opening drawer for ID:", appt.id);
    set({ selectedAppt: { ...appt } });
  },

  closeDrawer: () => {
    console.log("🛠️ [STORE] Closing drawer");
    set({ selectedAppt: null });
  },
}));