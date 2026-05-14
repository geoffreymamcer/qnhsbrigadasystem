"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Package, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationSchema, type DonationInput } from "../types";
import { createDonation } from "../services/donations";
import { cn } from "@/lib/utils/utils";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      date_received: new Date().toISOString().split('T')[0],
      quantity: 0,
      unit_cost: 0,
      total_cost: 0,
    }
  });

  const quantity = watch("quantity");
  const unitCost = watch("unit_cost");

  // Calculate total cost automatically
  useEffect(() => {
    const total = (Number(quantity) || 0) * (Number(unitCost) || 0);
    setValue("total_cost", total);
  }, [quantity, unitCost, setValue]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) reset();
    return () => setMounted(false);
  }, [isOpen, reset]);

  const onSubmit = async (data: DonationInput) => {
    setIsLoading(true);
    try {
      await createDonation(data);
      onClose();
      reset();
    } catch (error) {
      console.error("Failed to save donation:", error);
      alert("Failed to save donation. Please try again.");
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
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Record New Donation</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Please fill in the donation details below.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item / Materials</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                <input 
                  {...register("item_name")}
                  type="text" 
                  placeholder="e.g. Latex Paint (White)"
                  className={cn(
                    "w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800",
                    errors.item_name && "border-rose-200 bg-rose-50"
                  )}
                />
              </div>
              {errors.item_name && <p className="text-[10px] text-rose-500 font-bold px-1">{errors.item_name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                <input 
                  {...register("quantity")}
                  type="number" 
                  step="0.01"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unit</label>
                <input 
                  {...register("unit")}
                  type="text" 
                  placeholder="e.g. pails"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date Received</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <input 
                    {...register("date_received")}
                    type="date" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Donor Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <input 
                    {...register("donor_name")}
                    type="text" 
                    placeholder="Donor Name"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unit Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₱</span>
                  <input 
                    {...register("unit_cost")}
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-primary">₱</span>
                  <input 
                    {...register("total_cost")}
                    type="number" 
                    readOnly
                    className="w-full pl-8 pr-4 py-3 bg-blue-primary/5 border border-blue-primary/20 rounded-2xl text-sm focus:outline-none font-black text-blue-primary cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-blue-primary text-white font-black rounded-2xl shadow-xl shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Donation Record"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
