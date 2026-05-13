// services/api.ts

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
 * PATIENT SIGNUP (EMAIL + PASSWORD)
 * ---------------------------------------------------------
 */
export async function registerPatient(data: {
  full_name: string;
  email: string;
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
 * PATIENT EMAIL VERIFICATION (OPTIONAL FLOW STEP)
 * ---------------------------------------------------------
 */
export async function verifyPatientEmail(data: {
  email: string;
  token: string;
}) {
  const res = await fetch(`${API_URL}/patient/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Email verification failed");
  }

  return json;
}

/**
 * ---------------------------------------------------------
 * PATIENT LOGIN
 * ---------------------------------------------------------
 */
export async function loginPatient(data: {
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/patient/login`, {
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
 * FETCH DOCTORS (Global - Try removing the slash)
 * ---------------------------------------------------------
 */
export async function getDoctors() {
  console.log("Fetching doctors...");

  // Removed the trailing slash after "doctors"
  const res = await fetch(`${API_URL}/doctors`, { 
    credentials: "include",
  });

  // If this still 404s, it means your backend REQUIRES a clinic ID.
  // In that case, use getDoctorsByClinic(user.clinic_id) instead.

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

  // ✅ FIX: use correct key from backend (data.slots)
  return {
    doctor_id: data.doctor_id,
    doctor_name: data.doctor_name,
    date: data.date,
    slots: data.slots || [], // 🔥 THIS IS THE FIX
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

/**
 * ---------------------------------------------------------
 * CREATE APPOINTMENT (Remove trailing slash here too)
 * ---------------------------------------------------------
 */
export async function createAppointment(payload: AppointmentPayload) {
  // Changed "/appointments/" to "/appointments"
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
  patient_phone: string; // ✅ added
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
    // 🚨 IMPORTANT: You must include credentials to send/receive cookies
    credentials: "include", 
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

/**
 * ---------------------------------------------------------
 * FETCH CLINIC SETTINGS (Now matches the new GET route)
 * ---------------------------------------------------------
 */
export async function getClinicSettings(clinicId: number) {
  const res = await fetch(`${API_URL}/clinics/${clinicId}`, {
    method: "GET", // Default is GET, but being explicit is fine
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
    method: "PATCH",
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

// services/api.ts

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
    credentials: "include", // Required for auth cookies
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
// services/api.ts

export async function getClinicSummary() {
  // Added /appointments/ to the path since it's in the appointments router
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

/**
 * Fetches all clinic admins that are currently in 'PENDING' status.
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

/**
 * Approves a clinic and sets status to VERIFIED (The Big Green Button)
 */
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

/**
 * Rejects a clinic verification request
 */
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



/**
 * ---------------------------------------------------------
 * NOTIFICATIONS SYSTEM 🔔
 * ---------------------------------------------------------
 */

/**
 * Fetches the count of unread notifications.
 * Added trailing slash and status safety to prevent 307/401 issues.
 */
export async function getUnreadNotificationCount() {
  try {
    const res = await fetch(`${API_URL}/notifications/unread-count/`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (res.status === 401 || res.status === 404) return 0;

    const data = await res.json();
    if (!res.ok) return 0;

    return data.unread_count ?? 0;
  } catch (err) {
    console.error("Network error fetching notification count:", err);
    return 0;
  }
}

/**
 * Fetches the latest notifications.
 * FIX: Added "/" before the "?" to match the backend router exactly.
 */
export async function getNotifications(limit: number = 20) {
  try {
    const res = await fetch(`${API_URL}/notifications/?limit=${limit}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (res.status === 401 || res.status === 404) return [];

    const data = await res.json();

    if (!res.ok) {
      console.error("Fetch notifications error:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    return [];
  }
}

/**
 * Marks a specific notification as read
 */
export async function markNotificationRead(notificationId: number) {
  const res = await fetch(`${API_URL}/notifications/${notificationId}/read/`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to update notification");
  return data;
}

/**
 * Marks all notifications as read at once
 */
export async function markAllNotificationsRead() {
  const res = await fetch(`${API_URL}/notifications/mark-all-read/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to clear notifications");
  return data;
}




/**
 * ---------------------------------------------------------
 * APPOINTMENT ACTIONS (Sleek Slide/Protocol System) 🏥
 * ---------------------------------------------------------
 */

/**
 * Fetches a single appointment detail (UPDATED → utils route)
 */
export async function getAppointmentById(id: string | number) {
  const res = await fetch(`${API_URL}/appointments/utils/detail/${id}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Fetch appointment detail error:", data);
    throw new Error(data.detail || "Failed to fetch appointment record");
  }

  return data;
}

/**
 * Approves a pending booking (UPDATED → utils route)
 */
export async function confirmAppointment(id: string | number) {
  const res = await fetch(`${API_URL}/appointments/utils/detail/${id}/confirm`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Confirm appointment error:", data);
    throw new Error(data.detail || "Failed to validate booking");
  }

  return data;
}

/**
 * ⚠️ OPTIONAL: cancel route (ONLY if you implement it in utils)
 * If you don't have backend support yet, leave unused.
 */
export async function cancelAppointment(
  id: string | number,
  reason: string = "Doctor unavailable"
) {
  const res = await fetch(
    `${API_URL}/appointments/utils/detail/${id}/cancel?reason=${encodeURIComponent(reason)}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cancel appointment error:", data);
    throw new Error(data.detail || "Failed to void record");
  }

  return data;
}


/**
 * =========================================================
 * 🏥 SUBSCRIPTIONS & BILLING (CLINIC-OWNED SYSTEM)
 * =========================================================
 */


/**
 * Fetch all available subscription plans
 */
export async function getSubscriptionPlans() {
  const res = await fetch(`${API_URL}/subscriptions/plans`, {
    credentials: "include",
    headers: { 
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "Failed to fetch plans");

  return data;
}

/**
 * Clinic subscribes / upgrades plan
 */
export async function subscribeClinicToPlan(tier: string) {
  const res = await fetch(
    `${API_URL}/subscriptions/subscribe/${tier}`,
    {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Subscription error:", data);
    throw new Error(data.detail || "Subscription failed");
  }

  return data;
}

/**
 * Fetch subscription for a clinic (PUBLIC MARKETPLACE VIEW)
 * This is what patients use to see plan info
 */
export async function getClinicSubscription(clinicId: number) {
  // Safety check to prevent broken URLs
  if (!clinicId) {
    console.warn("getClinicSubscription: clinicId is required");
    return null;
  }

  const res = await fetch(
    `${API_URL}/subscriptions/clinics/${clinicId}/subscription`,
    {
      method: "GET",
      credentials: "include",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Clinic subscription error:", data);
    // We return null instead of throwing so the UI can fallback gracefully
    return null; 
  }

  return data;
}
/**
 * ---------------------------------------------------------
 * FETCH UPCOMING APPOINTMENTS (Patient)
 * ---------------------------------------------------------
 */
export async function getPatientUpcomingAppointments() {
  const res = await fetch(`${API_URL}/appointments/upcoming`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Upcoming appointments error:", data);
    throw new Error(data.detail || "Failed to fetch upcoming schedule");
  }

  return data;
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/me/`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (res.status === 401) return null;

  const data = await res.json();

  if (!res.ok) return null;

  return data;
}