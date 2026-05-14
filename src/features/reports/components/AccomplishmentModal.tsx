"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ClipboardList, MessageSquare, Loader2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accomplishmentSchema, type AccomplishmentInput } from "../types";
import { createAccomplishment } from "../services/reports";
import { cn } from "@/lib/utils/utils";

interface AccomplishmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccomplishmentModal = ({ isOpen, onClose }: AccomplishmentModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccomplishmentInput>({
    resolver: zodResolver(accomplishmentSchema),
    defaultValues: {
      report_date: new Date().toISOString().split('T')[0],
      status: 'completed'
    }
  });

  useEffect(() => {
    setMounted(true);
    if (isOpen) reset();
    return () => setMounted(false);
  }, [isOpen, reset]);

  const onSubmit = async (data: AccomplishmentInput) => {
    setIsLoading(true);
    try {
      await createAccomplishment(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save accomplishment:", error);
      alert("Failed to save report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 z-10"
        >
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Accomplishment</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Track daily activities and progress.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6">
            {/* Activity Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Activities Conducted</label>
              <div className="relative">
                <ClipboardList className="absolute left-4 top-4 w-4 h-4 text-blue-primary/40" />
                <textarea 
                  {...register("activity")}
                  placeholder="Describe the activity..."
                  rows={3}
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none",
                    errors.activity && "border-rose-200 bg-rose-50"
                  )}
                />
              </div>
              {errors.activity && <p className="text-[10px] text-rose-500 font-bold px-1">{errors.activity.message}</p>}
            </div>

            {/* Status Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
                  { id: 'started but not yet completed', label: 'Ongoing', icon: Clock, color: 'text-amber-500' },
                  { id: 'not done', label: 'Not Done', icon: AlertCircle, color: 'text-rose-500' }
                ].map((s) => (
                  <label key={s.id} className="relative flex-1 cursor-pointer">
                    <input 
                      {...register("status")}
                      type="radio" 
                      value={s.id} 
                      className="peer sr-only" 
                    />
                    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 peer-checked:bg-white peer-checked:border-blue-primary peer-checked:ring-4 peer-checked:ring-blue-primary/5 transition-all text-center">
                      <s.icon className={cn("w-5 h-5", s.color)} />
                      <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 peer-checked:text-blue-primary leading-tight">
                        {s.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Report Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <input 
                    {...register("report_date")}
                    type="date" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Remarks / Recommendations</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-blue-primary/40" />
                <textarea 
                  {...register("remarks")}
                  placeholder="Any additional notes..."
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-blue-primary text-white font-black rounded-2xl shadow-xl shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Report Entry"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
