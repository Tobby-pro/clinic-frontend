// app/dashboard/billing/verify/page.tsx

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyBillingContent() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const status = searchParams.get("status");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-lg border">

        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Billing Verification
        </h1>

        <div className="space-y-4">

          <div className="bg-slate-50 border rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Payment Reference
            </p>

            <p className="font-semibold text-slate-800">
              {reference || "No reference found"}
            </p>
          </div>

          <div className="bg-slate-50 border rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Payment Status
            </p>

            <p className="font-semibold text-slate-800">
              {status || "Unknown"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function VerifyBillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading verification...
        </div>
      }
    >
      <VerifyBillingContent />
    </Suspense>
  );
}