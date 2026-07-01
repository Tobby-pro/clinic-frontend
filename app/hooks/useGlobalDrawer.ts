
// app/hooks/useGlobalDrawer.ts
import { create } from "zustand";

export type DrawerType = "BOOK_APPOINTMENT" | "CHECK_IN" | "REGISTER_PATIENT" | "COLLECT_PAYMENT" | null;

interface GlobalDrawerState {
  isOpen: boolean;
  viewType: DrawerType;
  openDrawer: (view: DrawerType) => void;
  closeDrawer: () => void;
}

export const useGlobalDrawer = create<GlobalDrawerState>((set) => ({
  isOpen: false,
  viewType: null,
  openDrawer: (view) => set({ isOpen: true, viewType: view }),
  closeDrawer: () => set({ isOpen: false, viewType: null }),
}));