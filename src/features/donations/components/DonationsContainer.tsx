"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Search, Filter, Plus, Heart } from "lucide-react";
import { DonationModal } from "./DonationModal";

const DONATIONS_DATA = [
  {
    id: "DON-001",
    item: "Latex Paint (White)",
    quantity: 10,
    unit: "pails",
    dateReceived: "05/01/2026",
    donor: "Boysen Philippines",
    unitCost: 2500,
    totalCost: 25000,
  },
  {
    id: "DON-002",
    item: "Cement (40kg)",
    quantity: 50,
    unit: "bags",
    dateReceived: "05/03/2026",
    donor: "Republic Cement",
    unitCost: 280,
    totalCost: 14000,
  },
  {
    id: "DON-003",
    item: "Fluorescent Bulbs (LED)",
    quantity: 100,
    unit: "pcs",
    dateReceived: "05/04/2026",
    donor: "Firefly Electric",
    unitCost: 180,
    totalCost: 18000,
  },
  {
    id: "DON-004",
    item: "Plywood (1/4)",
    quantity: 20,
    unit: "sheets",
    dateReceived: "05/05/2026",
    donor: "Local Alumni Batch '95",
    unitCost: 450,
    totalCost: 9000,
  },
  {
    id: "DON-005",
    item: "Corrugated Roofing",
    quantity: 30,
    unit: "sheets",
    dateReceived: "05/06/2026",
    donor: "Rotary Club of San Pablo",
    unitCost: 1200,
    totalCost: 36000,
  },
];

export const DonationsContainer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header Area */}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Received Value</p>
          <h3 className="text-2xl font-black text-slate-900">{formatCurrency(102000)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entries</p>
          <h3 className="text-2xl font-black text-slate-900">5 Records</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Donors</p>
          <h3 className="text-2xl font-black text-slate-900">5 Unique Donors</h3>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by donor or material..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-primary/20 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4" />
          Filter Date
        </button>
      </div>

      {/* Donations Table */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {DONATIONS_DATA.map((donation) => (
                <tr key={donation.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-slate-900 group-hover:text-blue-primary transition-colors">{donation.item}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{donation.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-slate-600">{donation.quantity} {donation.unit}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-500">{donation.dateReceived}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-primary/5 flex items-center justify-center">
                        <span className="text-[10px] font-black text-blue-primary">{donation.donor.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{donation.donor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600 text-right">{formatCurrency(donation.unitCost)}</td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-blue-primary">{formatCurrency(donation.totalCost)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
