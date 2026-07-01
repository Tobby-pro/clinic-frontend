"use client";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * =========================================================
 * SLOT DTO (FRONTEND SINGLE SOURCE OF TRUTH)
 * =========================================================
 */
export interface SlotDTO {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  formatted: {
    time: string;
    date: string;
  };
}

interface ActivatePortalPayload {
  patient_id?: number;
  clinic_id?: number;
  phone?: string;
  password?: string;
}

interface VerifyPhonePayload {
  phone: string;
  token?: string; // Component style
  otp?: string;   // Backend style
}

/* =========================================================
   🏥 CLINIC ADMIN AUTH (STABLE - DO NOT CHANGE BACKEND CONTRACT)
   ========================================================= */

/**
 * ---------------------------------------------------------
 * REGISTER CLINIC ADMIN (CLAIM FLOW)
 * ---------------------------------------------------------
 */
export async function registerUser(data: {
  clinic_name: string;
  clinic_id?: number | null;
  admin_name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Registration failed");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * CLINIC ADMIN LOGIN
 * ---------------------------------------------------------
 */
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Login failed");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * VERIFY CLINIC ADMIN OTP
 * ---------------------------------------------------------
 */
export async function verifyAdminOTP(data: {
  email: string;
  otp: string;
}) {
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "OTP verification failed");
  }

  return json;
}

/* =========================================================
   🧍 PATIENT AUTH (CLEAN SaaS FLOW - EMAIL BASED)
   ========================================================= */

/**
 * ---------------------------------------------------------
 * PATIENT SIGNUP (PHONE + PASSWORD ✅)
 * ---------------------------------------------------------
 */
export async function registerPatient(data: {
  full_name: string;
  phone: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/patient/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Signup failed");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * SEARCH CLINICS (FIXED - BACKEND FILTERING)
 * ---------------------------------------------------------
 */
export async function searchClinics(query: string) {
  const res = await fetch(
    `${API_URL}/clinics?search=${encodeURIComponent(query)}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Search clinics error:", data);
    throw new Error("Search failed");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * DASHBOARD STATS
 * ---------------------------------------------------------
 */
export async function getDashboardStats() {
  console.log("Fetching dashboard stats...");

  const res = await fetch(`${API_URL}/dashboard/stats`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  let data;

  try {
    data = await res.json();
  } catch (err) {
    console.error("Dashboard stats invalid JSON:", err);
    throw new Error(`Unexpected response: ${res.status}`);
  }

  console.log("Dashboard stats response:", data);

  if (!res.ok) {
    console.error("Dashboard stats error:", data);
    throw new Error(data.detail || "Failed to fetch stats");
  }

  return {
    todaysAppointments: data.todaysAppointments || 0,
    doctorsAvailable: data.doctorsAvailable || 0,
    pendingRequests: data.pendingRequests || 0,
  };
}

/**
 * ---------------------------------------------------------
 * FETCH DOCTORS
 * ---------------------------------------------------------
 */
export async function getDoctors() {
  console.log("Fetching doctors...");

  const res = await fetch(`${API_URL}/doctors`, { 
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch doctors");
  }
  return data;
}

/**
 * ---------------------------------------------------------
 * FETCH AVAILABLE TIME SLOTS
 * ---------------------------------------------------------
 */
export async function getAvailableSlots(doctorId: number, day: string) {
  const url = `${API_URL}/appointments/available-slots?doctor_id=${doctorId}&day=${day}`;
  console.log("Fetching slots:", url);

  const res = await fetch(url, { credentials: "include" });

  const data = await res.json();

  console.log("Slots response:", data);

  if (!res.ok) {
    console.error("Slots error:", data);
    throw new Error(data.detail || "Failed to fetch slots");
  }

  const slots: SlotDTO[] = (data.slots || []).map((slot: any) => ({
    id: slot.id,
    startTime: slot.startTime || slot.start_time || slot.start,
    endTime: slot.endTime || slot.end_time || slot.end,
    isAvailable: slot.isAvailable ?? true,
    formatted: {
      time: slot.formatted?.time || "",
      date: slot.formatted?.date || "",
    },
  }));

  return {
    doctor_id: data.doctor_id,
    doctor_name: data.doctor_name,
    date: data.date,
    slots,
  };
}

/**
 * ---------------------------------------------------------
 * CREATE APPOINTMENT (SLOT-BASED ✅)
 * ---------------------------------------------------------
 */
interface AppointmentPayload {
  slot_id: number;
  reason?: string;
  patient_name?: string;
  patient_phone?: string;
}

export async function createAppointment(payload: AppointmentPayload) {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to create appointment");
  }
  return data;
}

/**
 * ---------------------------------------------------------
 * CREATE APPOINTMENT (ADMIN)
 * ---------------------------------------------------------
 */
export async function createAppointmentAdmin(payload: {
  slot_id: number;
  patient_name: string;
  patient_phone: string;
  reason?: string;
}) {
  const res = await fetch(`${API_URL}/appointments/admin`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Admin create appointment error:", data);
    throw new Error(data.detail || "Failed to create appointment");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * GET TODAY'S APPOINTMENTS
 * ---------------------------------------------------------
 */
export async function getTodayAppointments() {
  const url = `${API_URL}/appointments/today`;
  console.log("Fetching today's appointments:", url);

  const res = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Invalid JSON response:", err);
    throw new Error(`Invalid response from server (${res.status})`);
  }

  console.log("Today's appointments response:", data);

  if (!res.ok) {
    console.error("Today's appointments error:", data);
    const errorMessage =
      typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data.detail);
    throw new Error(errorMessage || "Failed to fetch today's appointments");
  }

  return data.map((appt: any) => ({
    id: appt.id,
    patient_name: appt.patient_name,
    doctor_name: appt.doctor_name,
    time: appt.time,
    status: appt.status,
  }));
}

/**
 * ---------------------------------------------------------
 * FETCH CLINICS
 * ---------------------------------------------------------
 */
export async function getClinics() {
  const res = await fetch(`${API_URL}/clinics`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Clinics error:", data);
    throw new Error(data.detail || "Failed to fetch clinics");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * CREATE DOCTOR (Admin)
 * ---------------------------------------------------------
 */
export async function createDoctor(data: { name: string; specialty: string }) {
  const res = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Create doctor error:", json);
    throw new Error(json.detail || "Failed to create doctor");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * FETCH DOCTORS BY CLINIC (Patient)
 * ---------------------------------------------------------
 */
export async function getDoctorsByClinic(clinicId: number) {
  const res = await fetch(`${API_URL}/clinics/${clinicId}/doctors`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Doctors by clinic error:", data);
    throw new Error(data.detail || "Failed to fetch doctors");
  }

  return data;
}

export async function createSlots(payload: {
  doctor_id: number;
  date: string;
  times: string[];
}) {
  const res = await fetch(`${API_URL}/appointments/slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Create slots error:", data);
    throw new Error(data.detail || "Failed to create slots");
  }

  return data;
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

/**
 * ---------------------------------------------------------
 * FETCH CLINIC SETTINGS
 * ---------------------------------------------------------
 */
export async function getClinicSettings(clinicId: number) {
  const res = await fetch(`${API_URL}/clinics/${clinicId}`, {
    method: "GET",
    credentials: "include",
    headers: { 
      "Accept": "application/json" 
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch clinic settings error:", data);
    throw new Error(data.detail || "Failed to fetch clinic settings");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * UPDATE CLINIC SETTINGS ✅
 * ---------------------------------------------------------
 */
export async function updateClinicSettings(clinicId: number, data: any) {
  const res = await fetch(`${API_URL}/clinics/${clinicId}`, {
    method: "UPDATE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Update clinic settings error:", json);
    throw new Error(json.detail || "Failed to update settings");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * GET PATIENT APPOINTMENTS
 * ---------------------------------------------------------
 */
export async function getAppointments() {
  const res = await fetch(`${API_URL}/appointments`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Appointments error:", data);
    throw new Error(data.detail || "Failed to fetch appointments");
  }

  return data;
}

export async function getAdminTodayAppointments() {
  const res = await fetch(`${API_URL}/appointments/admin/today`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Admin appointments error:", data);
    throw new Error(data.detail || "Failed to fetch admin appointments");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * UPDATE APPOINTMENT STATUS
 * ---------------------------------------------------------
 */
export async function updateAppointmentStatus(appointmentId: number, status: string) {
  const res = await fetch(`${API_URL}/appointments/${appointmentId}?status=${status}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Update status error:", json);
    throw new Error(json.detail || "Failed to update status");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * CLINIC SUMMARY (For Dashboard Stats)
 * ---------------------------------------------------------
 */
export async function getClinicSummary() {
  const res = await fetch(`${API_URL}/appointments/summary`, { 
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Clinic summary error:", data);
    throw new Error(data.detail || "Failed to fetch summary");
  }

  return data; 
}

/**
 * ---------------------------------------------------------
 * PATIENT MASTER INDEX (FETCH ALL)
 * ---------------------------------------------------------
 */
export async function getPatients() {
  const res = await fetch(`${API_URL}/patients`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch patients error:", data);
    throw new Error(data.detail || "Failed to fetch patient list");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * GET SINGLE PATIENT DOSSIER
 * ---------------------------------------------------------
 */
export async function getPatientById(id: string | string[]) {
  const res = await fetch(`${API_URL}/patients/${id}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch patient detail error:", data);
    throw new Error(data.detail || "Failed to fetch patient profile");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * GET PATIENT APPOINTMENT HISTORY
 * ---------------------------------------------------------
 */
export async function getPatientHistory(id: string | string[]) {
  const res = await fetch(`${API_URL}/patients/${id}/history`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch patient history error:", data);
    throw new Error(data.detail || "Failed to fetch history");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * ADMIN COMPLIANCE & TRUST TERMINAL
 * ---------------------------------------------------------
 */
export async function getPendingVerifications() {
  const res = await fetch(`${API_URL}/admin/compliance/pending`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch pending error:", data);
    throw new Error(data.detail || "Failed to fetch compliance registry");
  }

  return data;
}

export async function approveClinic(adminId: number) {
  const res = await fetch(`${API_URL}/admin/compliance/approve/${adminId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Approval error:", data);
    throw new Error(data.detail || "Failed to authorize clinic");
  }

  return data;
}

export async function rejectClinic(adminId: number) {
  const res = await fetch(`${API_URL}/admin/compliance/reject/${adminId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Rejection error:", data);
    throw new Error(data.detail || "Failed to process rejection");
  }

  return data;
}

/**
 * ---------------------------------------------------------
 * FETCH NEARBY CLINICS (Discovery)
 * ---------------------------------------------------------
 */
export async function getNearbyClinics(lat: number, lng: number, limit: number = 10) {
  const res = await fetch(
    `${API_URL}/api/discovery/nearby?lat=${lat}&lng=${lng}&limit=${limit}`,
    {
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Nearby discovery error:", data);
    throw new Error(data.detail || "Failed to find nearby clinics");
  }

  return data;
}

/* =========================================================
   🔔 NOTIFICATIONS (CLEAN + BACKEND ALIGNED)
   ========================================================= */

export async function getUnreadNotificationCount() {
  try {
    const res = await fetch(`${API_URL}/notifications/me/unread-count`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (res.status === 401 || res.status === 404) return 0;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return 0;

    return data.unread_count ?? 0;
  } catch {
    return 0;
  }
}


export async function getNotifications(limit: number = 20) {
  try {
    const res = await fetch(
      `${API_URL}/notifications/me?limit=${limit}`,
      {
        credentials: "include",
        headers: { Accept: "application/json" },
      }
    );

    if (res.status === 401 || res.status === 404) return [];

    const data = await res.json().catch(() => []);
    if (!res.ok) return [];

    return data;
  } catch {
    return [];
  }
}


export async function markNotificationRead(notificationId: number) {
  const res = await fetch(
    `${API_URL}/notifications/me/${notificationId}/read`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || "Failed to update notification");
  }

  return data;
}


export async function markAllNotificationsRead() {
  const res = await fetch(
    `${API_URL}/notifications/me/mark-all-read`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || "Failed to clear notifications");
  }

  return data;
}

export async function getAppointmentById(id: string | number) {
  const res = await fetch(`${API_URL}/appointments/utils/detail/${id}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch appointment record");
  return data;
}

export async function confirmAppointment(id: string | number) {
  const res = await fetch(`${API_URL}/appointments/utils/detail/${id}/confirm`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to validate booking");
  return data;
}

export async function cancelAppointment(id: string | number, reason: string = "Doctor unavailable") {
  const res = await fetch(
    `${API_URL}/appointments/utils/detail/${id}/cancel?reason=${encodeURIComponent(reason)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to void record");
  return data;
}

export async function getSubscriptionPlans() {
  const res = await fetch(`${API_URL}/subscriptions/plans`, {
    credentials: "include",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Failed to fetch plans");
  return data;
}

export async function subscribeClinicToPlan(tier: string) {
  const res = await fetch(`${API_URL}/subscriptions/subscribe/${tier}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Subscription failed");
  return data;
}

export async function getClinicSubscription(clinicId: number) {
  if (!clinicId) return null;
  const res = await fetch(`${API_URL}/subscriptions/clinics/${clinicId}/subscription`, {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data;
}

export async function getPatientUpcomingAppointments() {
  const res = await fetch(`${API_URL}/appointments/upcoming`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to fetch upcoming schedule");
  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/me/`, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (res.status === 401) return null;
  const data = await res.json();
  if (!res.ok) return null;
  return data;
}

/**
 * ---------------------------------------------------------
 * PUBLIC PATIENT TRANSACTIONAL BOOKING (WIZARD FLOW ✅ - NO EMAIL)
 * ---------------------------------------------------------
 */
export interface PublicBookingPayload {
  clinic_id: number;
  doctor_id: number;
  slot_id: number;
  full_name: string;
  phone: string;
  reason?: string;
}

export async function bookPublicAppointment(payload: PublicBookingPayload) {
  const res = await fetch(`${API_URL}/public/book-appointment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Booking transaction declined.");
  return data;
}


/* =========================================================
   🔥 FIXED & REALIGNED ONBOARDING DISPATCHERS
   ========================================================= */

/**
 * ---------------------------------------------------------
 * ACTIVATE PORTAL / INIT CREDENTIALS
 * ---------------------------------------------------------
 */
export async function activatePatientPortal(payload: ActivatePortalPayload) {
  // ✅ Corrected route contract maps directly to your new activate-portal endpoint
  const res = await fetch(`${API_URL}/public/activate-portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patient_id: payload.patient_id,
      password: payload.password
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to establish secure credentials.");
  return data;
}

/**
 * ---------------------------------------------------------
 * VERIFY PHONE WITH OTP (BACKEND ALIGNED WITH FRONTEND COMPATIBILITY)
 * ---------------------------------------------------------
 */
export async function verifyPatientPhone(payload: VerifyPhonePayload) {
  const backendPayload = {
    phone: payload.phone.trim(),
    otp: (payload.otp || payload.token || "").trim()
  };

  const res = await fetch(`${API_URL}/public/verify-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backendPayload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Invalid verification code.");
  return data;
}

/**
/*
 * ---------------------------------------------------------
/**
 * PATIENT LOGIN SESSION DISPATCH (UNIFIED VERSION)
 * ---------------------------------------------------------
 */
export async function loginPatient(payload: {
  login_id: string; // ✅ Updated type signature to match unified backend standard
  password: string;
}) {
  // Safe extraction helper: fallback to an empty string if login_id isn't present
  const identifier = (payload.login_id || "").trim();

  const res = await fetch(`${API_URL}/patient/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 🔑 CRITICAL: Tells the browser to store the HttpOnly cookie
    body: JSON.stringify({
      login_id: identifier, // ✅ Safe, cleaned, and properly formatted string
      password: payload.password
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Authentication session failed.");
  return data;
}

