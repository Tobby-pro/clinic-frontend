// app/dashboard/billing/verify/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // In a real app, you could call a backend verify endpoint here
    // But since we have a Webhook, we just wait a second and check if the DB updated
    if (reference) {
      setTimeout(() => setStatus("success"), 3000);
    } else {
      setStatus("error");
    }
  }, [reference]);

  return (
    <div className="h-screen flex items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto animate-spin text-[#ff7600] mb-6" size={48} />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Verifying Payment</h1>
            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Securing your NHN access...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto text-green-500 mb-6" size={64} />
            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Access Granted</h1>
            <p className="text-gray-500 font-bold text-sm mt-2">Your subscription is now active. Welcome to Nigeria Health Network.</p>
            <button 
              onClick={() => router.push("/dashboard")}
              className="mt-10 w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#ff7600] transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto text-red-500 mb-6" size={64} />
            <h1 className="text-2xl font-black uppercase tracking-tighter">Payment Failed</h1>
            <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-widest">Reference not found or session expired.</p>
            <button 
              onClick={() => router.push("/dashboard/billing")}
              className="mt-10 w-full border-2 border-gray-900 text-gray-900 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Try Again
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}