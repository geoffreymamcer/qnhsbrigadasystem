"use client";

import { cn } from "@/lib/utils/utils";
import { CheckCircle2, Clock, AlertCircle, Search, Filter, Plus } from "lucide-react";

const REPORTS_DATA = [
  {
    id: "REP-001",
    date: "2026-05-07",
    activity: "Repainting of Grade 7 Classrooms",
    committee: "Program Implementation",
    lead: "Maria Teresa J. Macatangay",
    status: "Completed",
  },
  {
    id: "REP-002",
    date: "2026-05-07",
    activity: "Repair of Perimeter Fence (Phase 1)",
    committee: "Physical Facilities",
    lead: "Edwin G. Signo Jr",
    status: "In Progress",
  },
  {
    id: "REP-003",
    date: "2026-05-06",
    activity: "Donation Sorting and Inventory",
    committee: "Resource Mobilization",
    lead: "Shane S. Leynes",
    status: "Completed",
  },
  {
    id: "REP-004",
    date: "2026-05-06",
    activity: "Social Media Advocacy Campaign Launch",
    committee: "Advocacy & Marketing",
    lead: "Arlen P. Baldovino",
    status: "Completed",
  },
  {
    id: "REP-005",
    date: "2026-05-05",
    activity: "Electrical Wiring Inspection",
    committee: "Physical Facilities",
    lead: "Edwin G. Signo Jr",
    status: "Pending",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Completed": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "In Progress": return "bg-amber-50 text-amber-600 border-amber-100";
    case "Pending": return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-3 h-3" />;
    case "In Progress": return <Clock className="w-3 h-3" />;
    case "Pending": return <AlertCircle className="w-3 h-3" />;
    default: return null;
  }
};

export const ReportsContainer = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Accomplishments</h1>
          <p className="text-slate-500 font-medium">Tracking daily progress and committee reports.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-primary text-white font-bold text-sm shadow-lg shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          Create New Report
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports or activities..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <select className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
            <option>All Committees</option>
            <option>Program Implementation</option>
            <option>Physical Facilities</option>
            <option>Resource Mobilization</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Committee</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Lead Person</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {REPORTS_DATA.map((report) => (
                <tr key={report.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-xs font-bold text-slate-400">{report.id}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">{report.date}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-primary transition-colors">{report.activity}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-md bg-blue-primary/5 text-blue-primary text-[10px] font-black uppercase tracking-wider border border-blue-primary/10">
                      {report.committee}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">{report.lead}</td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-tight",
                      getStatusStyles(report.status)
                    )}>
                      {getStatusIcon(report.status)}
                      {report.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
          <button className="text-xs font-black text-blue-primary uppercase tracking-widest hover:underline transition-all">
            View All Reports
          </button>
        </div>
      </div>
    </div>
  );
};
