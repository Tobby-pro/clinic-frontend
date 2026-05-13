// patient/dashbaord/HealthBanner.tsx
"use client";

export default function HealthBanner() {
  return (
    <div className="bg-[#ff7600] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center text-white shadow-xl shadow-orange-100">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Drink more water! 💧</h2>
        <p className="text-orange-50 opacity-90 max-w-[280px]">Staying hydrated improves your focus and overall health. Aim for 8 glasses today.</p>
        <button className="mt-6 bg-white text-[#ff7600] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors">
          Read Health Tips
        </button>
      </div>
      {/* Abstract circles */}
      <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-[-10%] left-[40%] w-24 h-24 bg-black/10 rounded-full blur-xl"></div>
    </div>
  );
}