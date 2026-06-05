"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Building2, Users2, Landmark, HelpCircle, Save, RotateCcw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/utils";

// Sector configurations for rendering sections inside the form modal
const SECTORS_CONFIG = [
  {
    key: "private" as const,
    name: "Private Sectors",
    icon: Building2,
    colorClass: "text-blue-600 border-blue-100 bg-blue-50/50",
    categories: [
      { id: "ngo", name: "NGO (PTA, SGC, Gawad Kalinga)", placeholder: "NGO volunteers" },
      { id: "corporation", name: "Corporation", placeholder: "Corporate sponsors/volunteers" }
    ]
  },
  {
    key: "community" as const,
    name: "Community",
    icon: Users2,
    colorClass: "text-teal-600 border-teal-100 bg-teal-50/50",
    categories: [
      { id: "parents", name: "Parents", placeholder: "Parent volunteers" },
      { id: "alumni", name: "Alumni", placeholder: "Alumni members" },
      { id: "individual", name: "Private Individual", placeholder: "Individual citizens" },
      { id: "religious", name: "Religious Organization (youth & adult)", placeholder: "Religious group reps" },
      { id: "congressional", name: "Congressional Officials and staffs", placeholder: "Congressional team members" }
    ]
  },
  {
    key: "government" as const,
    name: "Government Agencies / National and Local",
    icon: Landmark,
    colorClass: "text-indigo-600 border-indigo-100 bg-indigo-50/50",
    categories: [
      { id: "provincial_off", name: "Provincial Officials", placeholder: "Provincial reps" },
      { id: "city_off", name: "City/Municipal Officials", placeholder: "City hall officials" },
      { id: "barangay_off", name: "Barangay Officials", placeholder: "Barangay council" },
      { id: "sk_off", name: "SK Officials", placeholder: "Sangguniang Kabataan" },
      { id: "gov_emp", name: "Provincial, City, Municipal Employees", placeholder: "LGU employees" },
      { id: "uniformed", name: "BJMP, PNP, BFP", placeholder: "Uniformed services" },
      { id: "afp", name: "AFP PA, Marine, Air force, etc", placeholder: "Armed forces reps" },
      { id: "barangay_work", name: "Barangay Workers", placeholder: "BHWs, tanods, cleaners" },
      { id: "other_vol", name: "Other Volunteers", placeholder: "Misc government volunteers" }
    ]
  }
];

const CATEGORIES_FLAT = SECTORS_CONFIG.flatMap(s => s.categories);

interface AttendanceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSave: (date: string, counts: Record<string, number>) => void;
  initialCounts: Record<string, number>;
  availableDates: string[];
}

export const AttendanceInputModal = ({
  isOpen,
  onClose,
  selectedDate,
  onSave,
  initialCounts,
  availableDates
}: AttendanceInputModalProps) => {
  const [modalDate, setModalDate] = useState(selectedDate);
  const [counts, setCounts] = useState<Record<string, number>>(() => 
    Object.fromEntries(CATEGORIES_FLAT.map(c => [c.id, 0]))
  );
  const [dateError, setDateError] = useState("");
  const availableDatesKey = availableDates.join(',');

  const today = new Date().toISOString().slice(0, 10);

  const isValidDate = (value: string) => {
    const parsed = new Date(value);
    return value.length === 10 && !Number.isNaN(parsed.getTime());
  };

  // Sync state with open events
  useEffect(() => {
    if (isOpen) {
      setModalDate(today);
      // Clone initial counts
      const initialMap: Record<string, number> = {};
      CATEGORIES_FLAT.forEach(c => {
        initialMap[c.id] = initialCounts[c.id] || 0;
      });
      setCounts(initialMap);
    }
  }, [isOpen, initialCounts, availableDatesKey, today]);

  const handleInputChange = (id: string, value: string) => {
    const parsed = Math.max(0, parseInt(value) || 0);
    setCounts(prev => ({
      ...prev,
      [id]: parsed
    }));
  };

  const handleClear = () => {
    const cleared: Record<string, number> = {};
    CATEGORIES_FLAT.forEach(c => {
      cleared[c.id] = 0;
    });
    setCounts(cleared);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidDate(modalDate)) {
      setDateError('Please select a valid attendance date.');
      return;
    }
    setDateError("");
    onSave(modalDate, counts);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Log Attendance Summary
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Fill in the volunteer counts for each sector and category.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Date Input Pickers */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-primary" />
                  <div>
                    <label className="text-xs font-black text-slate-600 block">Attendance Date</label>
                    <span className="text-[10px] text-slate-400 font-bold">Select the Brigada date to log</span>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <input
                    type="date"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full md:w-60 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary"
                  />
                  {dateError && <p className="mt-2 text-xs text-rose-600 font-bold">{dateError}</p>}
                </div>
              </div>

              {/* Sectors Inputs Group */}
              <div className="flex flex-col gap-6">
                {SECTORS_CONFIG.map((sector) => {
                  const IconComponent = sector.icon;
                  return (
                    <div key={sector.key} className="border border-slate-100 rounded-3xl p-5 bg-white flex flex-col gap-4 shadow-[0_2px_12px_rgba(37,99,235,0.01)]">
                      {/* Section Banner */}
                      <div className={cn("p-3 rounded-2xl flex items-center gap-3 border", sector.colorClass)}>
                        <IconComponent className="w-5 h-5" />
                        <h3 className="text-xs font-black uppercase tracking-wider">{sector.name}</h3>
                      </div>

                      {/* Inputs Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sector.categories.map((cat) => {
                          const value = counts[cat.id];
                          return (
                            <div key={cat.id} className="flex flex-col gap-1.5 p-3 rounded-2xl hover:bg-slate-50/50 transition-colors border border-transparent hover:border-slate-50">
                              <label className="text-xs font-bold text-slate-700 leading-tight">
                                {cat.name}
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min={0}
                                  value={value === undefined || value === 0 ? "" : value}
                                  placeholder="0"
                                  onChange={(e) => handleInputChange(cat.id, e.target.value)}
                                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-black text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary transition-all"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                  Pax
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>

            {/* Footer buttons */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-100 rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Fields
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-primary hover:bg-blue-dark text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-md shadow-blue-primary/15 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Summary
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
