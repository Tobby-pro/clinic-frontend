// app/dashboard/test-cookie/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function TestCookiePage() {
  const [status, setStatus] = useState<string>("Checking cookie...");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await fetch("http://localhost:8000/dashboard/stats", {
          method: "GET",
          credentials: "include", // ✅ sends the HTTP-only access_token cookie
        });

        if (res.status === 401) {
          setStatus("Unauthorized: cookie not valid or missing");
          return;
        }

        if (!res.ok) throw new Error("Server error");

        const json = await res.json();
        setData(json);
        setStatus("Success! Cookie is working.");
      } catch (err: any) {
        setStatus("Error: " + err.message);
      }
    };

    fetchProtected();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">HTTP-Only Cookie Test</h1>
      <p className="mb-2">{status}</p>

      {data && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}