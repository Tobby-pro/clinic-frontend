"use client";

import { useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  role: string;
  clinic_id?: number;  
  clinicId?: number;   
  blood_group?: string;
  emergency_contact?: string;
  address?: string;
  subscription_tier?: string; 
  subscription_status?: "pending" | "active" | "expired" | "none"; 
  verification_status?: "pending" | "verified" | "rejected" | "idle";
  is_verified?: boolean;
  clinic?: {
    status: string;
    name?: string;
  };
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // 🛠️ LOG TRACE CHECK: Drop silent return if executing mid-auth on client
    if (typeof window !== "undefined" && window.location.pathname.includes("/register")) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/me/", {
        credentials: "include", 
      });

      // Quietly exit without shouting errors if the session cookie is unassigned
      if (res.status === 401) {
        setUser(null);
        return;
      }

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();
      
      const actualId = data.clinicId || data.clinic_id || data.clinic?.id;

      const cleanStatus = (s: any): string => {
        if (!s) return "idle";
        const str = String(s).toLowerCase();
        const parts = str.split('.');
        return parts[parts.length - 1]; 
      };

      const rawVerification = cleanStatus(
        data.verification_status || 
        data.clinic?.status ||       
        "idle"
      );

      const rawSubsStatus = cleanStatus(
        data.subscription_status || 
        data.subscription?.status || 
        "none"
      );

      const mappedUser: User = {
        ...data,
        name: data.name || data.full_name || "User",
        clinic_id: actualId,
        clinicId: actualId,
        subscription_tier: data.subscription_tier || data.subscription?.tier || "BASIC",
        subscription_status: rawSubsStatus as any,
        verification_status: rawVerification as any,
        is_verified: rawVerification === "verified"
      };

      setUser(mappedUser);
    } catch (err) {
      // Clean fallback layout log instead of a raw stack dump
      console.warn("User dashboard session is currently unauthenticated.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { 
    user, 
    loading, 
    refreshUser: fetchUser 
  };
}