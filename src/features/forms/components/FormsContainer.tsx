"use client";

import { cn } from "@/lib/utils/utils";
import { FileText, Download, Search, Info } from "lucide-react";

const FORMS_DATA = [
  {
    id: "BE-01",
    title: "Physical Facilities and Maintenance Needs Assessment Form",
    filename: "BE-Form-1-PHYSICAL-FACILITIES-AND-MAINTENANCE-NEEDS-ASSESSMENT-FORM.doc",
    description: "Used to assess the physical status of the school and identify maintenance needs.",
    category: "Assessment",
  },
  {
    id: "BE-02",
    title: "School Work Plan",
    filename: "BE-Form-2-SCHOOL-WORK-PLAN.doc",
    description: "Outlines the specific tasks, schedules, and responsibilities for the project.",
    category: "Planning",
  },
  {
    id: "BE-03",
    title: "Resource Mobilization Form 1",
    filename: "BE-Form-3-RESOURCE-MOBILIZATION-FORM-1.doc",
    description: "Tracks the resources needed and potential sources of donations.",
    category: "Mobilization",
  },
  {
    id: "BE-04",
    title: "Daily Attendance of Volunteers",
    filename: "BE-Form-4-DAILY-ATTENDANCE-OF-VOLUNTEERS.doc",
    description: "Official record of volunteer participation on a daily basis.",
    category: "Attendance",
  },
  {
    id: "BE-05",
    title: "Record of Donations Received",
    filename: "BE-Form-5-RECORD-OF-DONATIONS-RECEIVED (1).doc",
    description: "Centralized log for all materials, equipment, and cash donations.",
    category: "Donations",
  },
  {
    id: "BE-06",
    title: "Daily Accomplishment Report",
    filename: "BE-Form-6-DAILY-ACCOMPLISHMENT-REPORT.doc",
    description: "Summary of tasks completed at the end of each work day.",
    category: "Reporting",
  },
  {
    id: "BE-07",
    title: "School Accomplishment Report",
    filename: "BE-Form-7-SCHOOL-ACCOMPLISHMENT-REPORT.doc",
    description: "Final comprehensive report of all achievements during the Brigada period.",
    category: "Final Reporting",
  },
];

export const FormsContainer = () => {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Official Downloadable Forms</h1>
          <p className="text-slate-500 font-medium italic">Complete documentation for Brigada Eskwela 2026-2027.</p>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-primary/5 rounded-2xl border border-blue-primary/10">
          <Info className="w-5 h-5 text-blue-primary" />
          <p className="text-xs font-bold text-blue-dark leading-tight">
            All files are in <span className="text-blue-primary">.doc</span> format. <br/>
            Click the download button to save to your device.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for forms by title or category..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary shadow-sm transition-all font-bold text-slate-800"
        />
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FORMS_DATA.map((form) => (
          <div 
            key={form.id} 
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-primary/5 rounded-2xl text-blue-primary group-hover:bg-blue-primary group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  {form.category}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-primary transition-colors">
                {form.title}
              </h3>
              
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                {form.description}
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                Ref: {form.id}
              </span>
              <a 
                href={`/forms/${form.filename}`} 
                download
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-blue-primary hover:text-white hover:border-blue-primary transition-all shadow-sm active:scale-95"
              >
                <Download className="w-3 h-3" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
