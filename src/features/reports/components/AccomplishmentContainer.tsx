"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Search, Filter, Plus, FileText, Trash2, ClipboardList, CheckCircle2, Clock, AlertCircle, FileDown } from "lucide-react";
import { AccomplishmentModal } from "./AccomplishmentModal";
import { Accomplishment } from "../types";
import { deleteAccomplishment } from "../services/reports";
import { generateAccomplishmentPDF } from "../utils/accomplishment-pdf";
import { motion, AnimatePresence } from "framer-motion";



interface AccomplishmentContainerProps {
  initialData: Accomplishment[];
}

export const AccomplishmentContainer = ({ initialData }: AccomplishmentContainerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report entry?")) return;
    setIsDeleting(id);
    try {
      await deleteAccomplishment(id);
    } catch (error) {
      alert("Failed to delete record.");
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', 
          icon: CheckCircle2,
          label: 'Completed'
        };
      case 'started but not yet completed':
        return { 
          bg: 'bg-amber-50 text-amber-600 border-amber-100', 
          icon: Clock,
          label: 'Ongoing'
        };
      case 'not done':
        return { 
          bg: 'bg-rose-50 text-rose-600 border-rose-100', 
          icon: AlertCircle,
          label: 'Not Done'
        };
      default:
        return { bg: 'bg-slate-50 text-slate-600 border-slate-100', icon: AlertCircle, label: status };
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-primary" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Accomplishment Reports</h1>
          </div>
          <p className="text-slate-500 font-medium">Monitoring daily progress and school improvement activities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => generateAccomplishmentPDF(initialData)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-primary text-white font-bold text-sm shadow-lg shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

      </div>

      <AccomplishmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/3">Activity Conducted</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-1/4">Remarks</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {initialData.map((report) => {
                  const status = getStatusStyle(report.status);
                  const StatusIcon = status.icon;
                  return (
                    <motion.tr 
                      key={report.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <p className="text-sm font-black text-slate-900 leading-relaxed">{report.activity}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider",
                          status.bg
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-slate-500 italic leading-relaxed">
                        {report.remarks || "—"}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-700">{new Date(report.report_date).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            {new Date(report.report_date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => handleDelete(report.id)}
                          disabled={isDeleting === report.id}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {initialData.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 bg-white">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ClipboardList className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-black text-slate-900 uppercase tracking-widest text-xs">No reports found</p>
              <p className="text-sm font-medium mt-1">Start tracking accomplishments by adding a new entry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
