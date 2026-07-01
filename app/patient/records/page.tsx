"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ClipboardList, 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  Filter,
  Stethoscope,
  Pill,
  Microscope,
  Lock
} from "lucide-react";
import dayjs from "dayjs";

// Mock data for the UI structure
const recordCategories = [
  { id: "all", name: "All Records", icon: ClipboardList },
  { id: "lab", name: "Lab Results", icon: Microscope },
  { id: "prescription", name: "Prescriptions", icon: Pill },
  { id: "visit", name: "Doctor Notes", icon: Stethoscope },
];

const mockRecords = [
  {
    id: "REC-001",
    type: "lab",
    title: "Full Blood Count Analysis",
    provider: "Central Health Lab",
    date: "2026-04-15",
    status: "Finalized",
  },
  {
    id: "REC-002",
    type: "prescription",
    title: "Amoxicillin 500mg Course",
    provider: "Dr. Adebayo Omotayo",
    date: "2026-04-10",
    status: "Active",
  },
  {
    id: "REC-003",
    type: "visit",
    title: "General Wellness Checkup",
    provider: "Clinbox General Hospital",
    date: "2026-03-22",
    status: "Archived",
  },
];

export default function PatientRecordsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = mockRecords.filter(rec => {
    const matchesTab = activeTab === "all" || rec.type === activeTab;
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    /* ✅ Fixed: Removed max-w-6xl wrapper walls to let the records table stretch flat across the workspace */
    <div className="w-full space-y-8 pb-24 pt-4 px-1 md:px-0">
      
      {/* HEADER SECTION */}
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff7600] shadow-[0_0_8px_rgba(255,118,0,0.4)]" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
            Secure Medical Vault
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Clinical Records
        </h1>
        <p className="text-gray-500 font-normal text-xs md:text-sm leading-relaxed max-w-xl mt-1">
          Access your comprehensive medical history, diagnostic results, and prescriptions in one secure place.
        </p>
      </header>

      {/* SEARCH & FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search records by name or provider..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-200 focus:bg-white text-sm font-medium transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="md:col-span-4 flex items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest hover:border-orange-200 active:scale-[0.99] transition-all shadow-sm">
          <Filter size={16} className="text-[#ff7600]" />
          Request New Export
        </button>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {recordCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === cat.id 
              ? "bg-[#ff7600] text-white border-[#ff7600] shadow-md shadow-orange-500/10" 
              : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
            }`}
          >
            <cat.icon size={15} />
            <span className="text-[10px] font-black uppercase tracking-wider">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* RECORDS LIST - Seamlessly expanded edge-to-edge layout bounds */}
      <div className="space-y-4 w-full">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <motion.div 
              layout
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center gap-6 w-full"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                record.type === 'lab' ? 'bg-blue-50 text-blue-500' :
                record.type === 'prescription' ? 'bg-purple-50 text-purple-500' :
                'bg-emerald-50 text-emerald-500'
              }`}>
                {record.type === 'lab' ? <Microscope size={22} /> :
                 record.type === 'prescription' ? <Pill size={22} /> :
                 <FileText size={22} />}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-gray-900 text-base md:text-lg leading-tight group-hover:text-[#ff7600] transition-colors truncate">
                  {record.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                  <span>{record.provider}</span>
                  <span className="h-1 w-1 bg-gray-200 rounded-full hidden sm:block" />
                  <span className="text-gray-500">{dayjs(record.date).format("MMM DD, YYYY")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:border-l md:pl-6 border-gray-50 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#ff7600] rounded-xl transition-all">
                  <Download size={14} />
                  <span className="text-[10px] font-black uppercase">PDF</span>
                </button>
                <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl transition-all">
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 w-full">
             <ClipboardList size={44} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-gray-900 font-black uppercase text-xs tracking-wider">No Records Found</h3>
             <p className="text-gray-400 text-xs mt-1">Refine your search or try a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}