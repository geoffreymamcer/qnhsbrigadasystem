"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Package, User } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    dateReceived: "",
    donorName: "",
    unitCost: "",
    totalCost: "",
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Automatically calculate total cost when quantity or unit cost changes
  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const unit = parseFloat(formData.unitCost) || 0;
    if (qty > 0 && unit > 0) {
      setFormData(prev => ({ ...prev, totalCost: (qty * unit).toString() }));
    }
  }, [formData.quantity, formData.unitCost]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Global Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 z-10"
        >
          {/* Header */}
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

          {/* Form */}
          <div className="p-8 flex flex-col gap-6">
            {/* Item Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item / Materials</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                <input 
                  type="text" 
                  placeholder="e.g. Latex Paint (White)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              {/* Date Received */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date Received</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                  <input 
                    type="text" 
                    placeholder="MM/DD/YYYY"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                    value={formData.dateReceived}
                    onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Donor Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Donor Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-primary/40" />
                <input 
                  type="text" 
                  placeholder="e.g. Local Alumni Batch '95"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Unit Cost */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unit Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₱</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all font-bold text-slate-800"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                  />
                </div>
              </div>

              {/* Total Cost */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Cost</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-blue-primary">₱</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    readOnly
                    className="w-full pl-8 pr-4 py-3 bg-blue-primary/5 border border-blue-primary/20 rounded-2xl text-sm focus:outline-none font-black text-blue-primary"
                    value={formData.totalCost}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button 
              onClick={onClose}
              className="w-full py-4 mt-4 bg-blue-primary text-white font-black rounded-2xl shadow-xl shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Save Donation Record
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
