"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ClipboardList, MessageSquare, Wrench, Package, Users, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facilityNeedSchema, type FacilityNeedInput, type FacilityNeed } from "../types";
import { cn } from "@/lib/utils/utils";

interface FacilityNeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FacilityNeed, "id">) => Promise<void> | void;
  initialData: FacilityNeed | null;
}

const PRESET_FACILITIES = [
  "Roofs/Gutters",
  "Ceilings",
  "Walls",
  "Blackboards",
  "Chairs/desks/tables",
  "Water facilities",
  "Drainage System",
  "Signages",
  "School garden",
  "Lighting",
  "Windows",
  "Doors",
  "Comfort Rooms",
  "School Grounds",
  "School Canteen/Clinic",
  "School Fence/ wall",
  "Electricity",
  "Alternative gate",
  "Reference Materials",
  "Laboratory equipment",
  "Other / Custom"
];

export const FacilityNeedModal = ({ isOpen, onClose, onSubmit, initialData }: FacilityNeedModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FacilityNeedInput>({
    resolver: zodResolver(facilityNeedSchema),
    defaultValues: {
      facility_name: "",
      condition: "satisfactory",
      remarks: "",
      improvement_needed: "",
      materials_needed: "",
      manpower_needed: "",
      assessment_date: new Date().toISOString().split("T")[0]
    }
  });

  const selectedFacility = watch("facility_name");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          facility_name: initialData.facility_name,
          condition: initialData.condition,
          remarks: initialData.remarks || "",
          improvement_needed: initialData.improvement_needed || "",
          materials_needed: initialData.materials_needed || "",
          manpower_needed: initialData.manpower_needed || "",
          assessment_date: initialData.assessment_date
        });
        
        // Check if current facility name is in presets
        if (!PRESET_FACILITIES.includes(initialData.facility_name)) {
          setShowCustomInput(true);
        } else {
          setShowCustomInput(false);
        }
      } else {
        reset({
          facility_name: "",
          condition: "satisfactory",
          remarks: "",
          improvement_needed: "",
          materials_needed: "",
          manpower_needed: "",
          assessment_date: new Date().toISOString().split("T")[0]
        });
        setShowCustomInput(false);
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFacilitySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "Other / Custom") {
      setShowCustomInput(true);
      setValue("facility_name", "");
    } else {
      setShowCustomInput(false);
      setValue("facility_name", val);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FacilityNeedInput) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md fixed"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {initialData ? "Edit Needs Assessment" : "Add Needs Assessment"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Physical Facilities & Maintenance Needs (BE Form 01)</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 md:p-8 flex flex-col gap-5 max-h-[75vh] overflow-y-auto no-scrollbar">
            
            {/* Facility Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Physical Facility</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <select 
                    onChange={handleFacilitySelectChange}
                    value={showCustomInput ? "Other / Custom" : (PRESET_FACILITIES.includes(selectedFacility) ? selectedFacility : "")}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select a facility...</option>
                    {PRESET_FACILITIES.map((facility) => (
                      <option key={facility} value={facility}>{facility}</option>
                    ))}
                  </select>
                </div>
                
                {showCustomInput && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="relative"
                  >
                    <input 
                      {...register("facility_name")}
                      type="text" 
                      placeholder="Enter custom facility name..."
                      className={cn(
                        "w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800",
                        errors.facility_name && "border-rose-200 bg-rose-50"
                      )}
                    />
                  </motion.div>
                )}
              </div>
              {errors.facility_name && <p className="text-[10px] text-rose-500 font-bold px-1">{errors.facility_name.message}</p>}
            </div>

            {/* Condition & Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Condition */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Condition Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'satisfactory', label: 'Satisfactory', icon: CheckCircle, color: 'text-emerald-500', peerCheckBorder: 'peer-checked:border-emerald-500 peer-checked:ring-emerald-500/5' },
                    { id: 'unsatisfactory', label: 'Needs Action', icon: AlertTriangle, color: 'text-rose-500', peerCheckBorder: 'peer-checked:border-rose-500 peer-checked:ring-rose-500/5' }
                  ].map((s) => (
                    <label key={s.id} className="relative flex-1 cursor-pointer">
                      <input 
                        {...register("condition")}
                        type="radio" 
                        value={s.id} 
                        className="peer sr-only" 
                      />
                      <div className={cn(
                        "flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 peer-checked:bg-white peer-checked:border-blue-primary peer-checked:ring-4 peer-checked:ring-blue-primary/5 transition-all text-center",
                        s.peerCheckBorder
                      )}>
                        <s.icon className={cn("w-4 h-4", s.color)} />
                        <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 peer-checked:text-slate-800">
                          {s.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Assessment Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Assessment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <input 
                    {...register("assessment_date")}
                    type="date" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Remarks / Specific Issue</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-blue-primary/40" />
                <textarea 
                  {...register("remarks")}
                  placeholder="Describe the issue if unsatisfactory (e.g. Broken hinges, leaking valves)..."
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Nature of Improvement Needed */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nature of Improvement Needed</label>
              <div className="relative">
                <Wrench className="absolute left-4 top-3.5 w-4 h-4 text-blue-primary/40" />
                <textarea 
                  {...register("improvement_needed")}
                  placeholder="Specify type of maintenance required (e.g. Painting, replacement, plumbing repair)..."
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Material & Manpower Resources (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Material resources */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Material Resources Needed</label>
                <div className="relative">
                  <Package className="absolute left-4 top-3.5 w-4 h-4 text-blue-primary/40" />
                  <textarea 
                    {...register("materials_needed")}
                    placeholder="List materials (e.g. 5 bags of cement, 1 pail paint)..."
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none"
                  />
                </div>
              </div>

              {/* Manpower */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Manpower Needed</label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 w-4 h-4 text-blue-primary/40" />
                  <textarea 
                    {...register("manpower_needed")}
                    placeholder="List laborers needed (e.g. 1 plumber, 2 painters)..."
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-blue-primary text-white font-black rounded-2xl shadow-xl shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                initialData ? "Update Assessment Entry" : "Save Assessment Entry"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
