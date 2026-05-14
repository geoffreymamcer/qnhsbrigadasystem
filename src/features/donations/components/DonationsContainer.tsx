"use client";

import { useState } from "react";
import { Search, Filter, Plus, Heart, Trash2, Package, FileDown } from "lucide-react";
import { DonationModal } from "./DonationModal";
import { Donation } from "../types";
import { deleteDonation } from "../services/donations";
import { generateDonationsPDF } from "../utils/pdf-generator";
import { motion, AnimatePresence } from "framer-motion";


interface DonationsContainerProps {
  initialData: Donation[];
}

export const DonationsContainer = ({ initialData }: DonationsContainerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setIsDeleting(id);
    try {
      await deleteDonation(id);
    } catch (error) {
      alert("Failed to delete record.");
    } finally {
      setIsDeleting(null);
    }
  };

  const totalValue = initialData.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0);
  const uniqueDonors = new Set(initialData.map(d => d.donor_name)).size;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Donation Records</h1>
          </div>
          <p className="text-slate-500 font-medium">Tracking all received materials and their estimated values.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => generateDonationsPDF(initialData)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            Export to PDF
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-primary text-white font-bold text-sm shadow-lg shadow-blue-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Record New Donation
          </button>
        </div>

      </div>

      <DonationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Received Value</p>
          <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalValue)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entries</p>
          <h3 className="text-2xl font-black text-slate-900">{initialData.length} Records</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Donors</p>
          <h3 className="text-2xl font-black text-slate-900">{uniqueDonors} Unique Donors</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Item / Materials</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date Received</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Donor</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Unit Cost</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Total Cost</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {initialData.map((donation) => (
                  <motion.tr 
                    key={donation.id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-primary transition-colors">{donation.item_name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-600">{donation.quantity} {donation.unit}</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-500">{new Date(donation.date_received).toLocaleDateString()}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-700">{donation.donor_name}</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600 text-right">{formatCurrency(Number(donation.unit_cost))}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-black text-blue-primary">{formatCurrency(Number(donation.total_cost))}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => handleDelete(donation.id)}
                        disabled={isDeleting === donation.id}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {initialData.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white">
              <Package className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-bold">No donation records found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
