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
    <div className="max-w-6xl mx-auto space-y-8 pb-24 px-4 md:px-0 font-sans">
      
      {/* HEADER SECTION */}
      <header className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-xl text-[#ff7600]">
            <Lock size={16} />
          </div>
          <span className="text-[10px] font-black text-[#ff7600] uppercase tracking-[0.3em]">
            Secure Medical Vault
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Clinical Records
        </h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xl">
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
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 transition-all text-sm font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="md:col-span-4 flex items-center justify-center gap-2 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all border ${
              activeTab === cat.id 
              ? "bg-[#ff7600] text-white border-[#ff7600] shadow-lg shadow-orange-200" 
              : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
            }`}
          >
            <cat.icon size={16} />
            <span className="text-[11px] font-black uppercase tracking-wider">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* RECORDS LIST */}
      <div className="space-y-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <motion.div 
              layout
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-[2rem] border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                record.type === 'lab' ? 'bg-blue-50 text-blue-500' :
                record.type === 'prescription' ? 'bg-purple-50 text-purple-500' :
                'bg-emerald-50 text-emerald-500'
              }`}>
                {record.type === 'lab' ? <Microscope size={24} /> :
                 record.type === 'prescription' ? <Pill size={24} /> :
                 <FileText size={24} />}
              </div>

              <div className="flex-1">
                <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-[#ff7600] transition-colors">
                  {record.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">{record.provider}</span>
                  <span className="h-1 w-1 bg-gray-200 rounded-full" />
                  <span className="text-[11px] font-bold text-gray-500">{dayjs(record.date).format("MMM DD, YYYY")}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:border-l md:pl-6 border-gray-50">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#ff7600] rounded-xl transition-all">
                  <Download size={16} />
                  <span className="text-[10px] font-black uppercase">PDF</span>
                </button>
                <button className="p-2.5 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-xl transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
             <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-gray-900 font-black uppercase text-sm">No Records Found</h3>
             <p className="text-gray-400 text-xs mt-1">Refine your search or try a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}