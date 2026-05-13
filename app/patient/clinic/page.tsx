// app/patient/clinics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getClinics } from "@/services/api";
import { useRouter } from "next/navigation";

interface Clinic {
  id: number;
  name: string;
  address?: string;
  phone?: string;
}

export default function ClinicsPage() {
  const router = useRouter();

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getClinics();

      if (Array.isArray(data)) {
        setClinics(data);
      } else {
        setClinics([]);
      }
    } catch (err: any) {
      console.error("Error fetching clinics:", err);
      setError(err.message || "Failed to load clinics");
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleClinicSelect = (clinicId: number | string) => {
    // Ensure clinicId is number
    const id = typeof clinicId === "string" ? Number(clinicId) : clinicId;

    if (isNaN(id)) {
      console.error("Invalid clinic ID", clinicId);
      return;
    }

    // Push to the absolute route for doctors
    router.push(`/clinics/${id}/doctors`);
  };

  return (
    <section className="relative min-h-screen bg-gray-50 px-4 sm:px-6 py-10">
      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#ff7600]/20 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-orange-300/20 blur-[140px] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Choose a Clinic</h1>
          <p className="text-gray-500 mt-1">
            Select a clinic to continue booking your appointment
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading clinics...</p>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : clinics.length === 0 ? (
          <p className="text-gray-500">No clinics available.</p>
        ) : (
          <ul className="space-y-4">
            {clinics.map((clinic) => (
              <motion.li
                key={clinic.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="p-5 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 cursor-pointer transition"
                onClick={() => handleClinicSelect(clinic.id)}
              >
                <h2 className="font-semibold text-lg text-gray-900">
                  {clinic.name}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {clinic.address || "No address provided"}
                </p>

                {clinic.phone && (
                  <p className="text-gray-400 text-xs mt-2">📞 {clinic.phone}</p>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}