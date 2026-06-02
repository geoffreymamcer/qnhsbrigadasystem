"use client";

import { useState, useMemo } from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from "recharts";
import { 
  Calendar, 
  Download, 
  Printer, 
  Search, 
  RefreshCw,
  Users2,
  Building2,
  Landmark,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  ClipboardCheck,
  Plus
} from "lucide-react";
import * as XLSX from 'xlsx';
import { cn } from "@/lib/utils/utils";
import { AttendanceInputModal } from "./AttendanceInputModal";
import { saveAttendanceSummary } from "@/features/attendance-summary/services/attendance";

// Subcategory definitions grouped by sector
const SECTORS_CONFIG = [
  {
    key: "private" as const,
    name: "Private Sectors",
    color: "#2563eb", // Vibrant Blue
    bgLight: "bg-blue-50/50",
    textClass: "text-blue-600",
    borderClass: "border-blue-100",
    categories: [
      { id: "ngo", name: "NGO (PTA, SGC, Gawad Kalinga)" }
    ]
  },
  {
    key: "community" as const,
    name: "Community",
    color: "#0d9488", // Teal
    bgLight: "bg-teal-50/50",
    textClass: "text-teal-600",
    borderClass: "border-teal-100",
    categories: [
      { id: "parents", name: "Parents" },
      { id: "alumni", name: "Alumni" },
      { id: "individual", name: "Private Individual" },
      { id: "religious", name: "Religious Organization (youth and adult)" },
      { id: "congressional", name: "Congressional Officials and staffs" }
    ]
  },
  {
    key: "government" as const,
    name: "Government Agencies / National and Local",
    color: "#4f46e5", // Indigo
    bgLight: "bg-indigo-50/50",
    textClass: "text-indigo-600",
    borderClass: "border-indigo-100",
    categories: [
      { id: "provincial_off", name: "Provincial Officials" },
      { id: "city_off", name: "City/Municipal Officials" },
      { id: "barangay_off", name: "Barangay Officials" },
      { id: "sk_off", name: "SK Officials" },
      { id: "gov_emp", name: "Provincial, City, Municipal Employees" },
      { id: "uniformed", name: "BJMP, PNP, BFP" },
      { id: "afp", name: "AFP PA, Marine, Air force, etc" },
      { id: "barangay_work", name: "Barangay Workers" },
      { id: "other_vol", name: "Other Volunteers" }
    ]
  }
];

// Flat list of category names for lookup
const CATEGORIES_FLAT = SECTORS_CONFIG.flatMap(s => s.categories);

// Initial Mock Attendance Data for 6-day Brigada Eskwela
const INITIAL_ATTENDANCE_DATA: Record<string, Record<string, number>> = {
  "2026-05-25": {
    ngo: 12, parents: 110, alumni: 15, individual: 8, religious: 20, congressional: 3,
    provincial_off: 2, city_off: 4, barangay_off: 10, sk_off: 12, gov_emp: 15,
    uniformed: 6, afp: 8, barangay_work: 12, other_vol: 25
  },
  "2026-05-26": {
    ngo: 15, parents: 145, alumni: 22, individual: 12, religious: 18, congressional: 2,
    provincial_off: 1, city_off: 5, barangay_off: 8, sk_off: 15, gov_emp: 10,
    uniformed: 8, afp: 4, barangay_work: 10, other_vol: 30
  },
  "2026-05-27": {
    ngo: 8, parents: 98, alumni: 10, individual: 5, religious: 15, congressional: 0,
    provincial_off: 0, city_off: 2, barangay_off: 6, sk_off: 8, gov_emp: 8,
    uniformed: 4, afp: 0, barangay_work: 8, other_vol: 14
  },
  "2026-05-28": {
    ngo: 10, parents: 120, alumni: 18, individual: 9, religious: 22, congressional: 1,
    provincial_off: 3, city_off: 3, barangay_off: 9, sk_off: 10, gov_emp: 12,
    uniformed: 6, afp: 5, barangay_work: 11, other_vol: 20
  },
  "2026-05-29": {
    ngo: 18, parents: 160, alumni: 28, individual: 14, religious: 30, congressional: 4,
    provincial_off: 2, city_off: 6, barangay_off: 12, sk_off: 22, gov_emp: 20,
    uniformed: 10, afp: 12, barangay_work: 15, other_vol: 45
  },
  "2026-05-30": {
    ngo: 25, parents: 210, alumni: 45, individual: 25, religious: 40, congressional: 5,
    provincial_off: 4, city_off: 8, barangay_off: 15, sk_off: 28, gov_emp: 25,
    uniformed: 12, afp: 15, barangay_work: 18, other_vol: 60
  }
};

interface AttendanceSummaryContainerProps {
  initialData: Record<string, Record<string, number>>;
  availableDates: string[];
}

export const AttendanceSummaryContainer = ({ initialData, availableDates }: AttendanceSummaryContainerProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const defaultSelectedDate = availableDates.includes(today)
    ? today
    : availableDates[0] || Object.keys(initialData)[0] || "2026-05-25";
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [attendance, setAttendance] = useState<Record<string, Record<string, number>>>(() => {
    const base = { ...INITIAL_ATTENDANCE_DATA };
    Object.entries(initialData || {}).forEach(([date, counts]) => {
      base[date] = {
        ...(base[date] || {}),
        ...counts
      };
    });
    return base;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateOptions = availableDates.length > 0
    ? availableDates
    : Object.keys(attendance).sort();

  // Notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Active day counts
  const currentCounts = useMemo(() => {
    return attendance[selectedDate] || 
      Object.fromEntries(CATEGORIES_FLAT.map(c => [c.id, 0]));
  }, [attendance, selectedDate]);

  // Calculate sector breakdowns
  const sectorData = useMemo(() => {
    return SECTORS_CONFIG.map(sector => {
      const volunteersCount = sector.categories.reduce((acc, cat) => acc + (currentCounts[cat.id] || 0), 0);
      return {
        ...sector,
        volunteersCount
      };
    });
  }, [currentCounts]);

  // Overall totals
  const totalVolunteers = useMemo(() => {
    return sectorData.reduce((acc, s) => acc + s.volunteersCount, 0);
  }, [sectorData]);

  // Trend chart data calculation
  const historicalTrendData = useMemo(() => {
    return dateOptions.map(date => {
      const counts = attendance[date] || {};
      
      const dayData: Record<string, any> = {
        dateString: date,
        label: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };

      let dayTotal = 0;
      SECTORS_CONFIG.forEach(sec => {
        const secVolCount = sec.categories.reduce((sum, cat) => sum + (counts[cat.id] || 0), 0);
        dayData[sec.name] = secVolCount;
        dayTotal += secVolCount;
      });

      dayData["Total Volunteers"] = dayTotal;

      return dayData;
    });
  }, [attendance]);

  // Distribution chart data
  const pieChartData = useMemo(() => {
    return sectorData.map(s => ({
      name: s.name,
      value: s.volunteersCount,
      color: s.color
    })).filter(item => item.value > 0);
  }, [sectorData]);

  // Modal Save Callback
  const handleSaveModalData = async (date: string, newCounts: Record<string, number>) => {
    showToast("Saving attendance summary...", "info");
    try {
      setAttendance(prev => ({
        ...prev,
        [date]: newCounts
      }));
      
      // Auto-navigate to that date if it differs from current date
      if (date !== selectedDate) {
        setSelectedDate(date);
      }
      
      await saveAttendanceSummary(date, newCounts);
      showToast(`Successfully saved volunteer attendance for ${new Date(date).toLocaleDateString()}`, "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to save attendance summary", "info");
    }
  };

  // Fast filling for demonstrating
  const handleRandomize = () => {
    const randomized = { ...currentCounts };
    Object.keys(randomized).forEach(key => {
      if (key === "parents") randomized[key] = Math.floor(Math.random() * 80) + 80;
      else if (key === "ngo" || key === "other_vol" || key === "religious") randomized[key] = Math.floor(Math.random() * 25) + 10;
      else randomized[key] = Math.floor(Math.random() * 15);
    });

    setAttendance(prev => ({
      ...prev,
      [selectedDate]: randomized
    }));
    showToast("Simulated counts updated for " + selectedDate, "info");
  };

  const handleReset = () => {
    setAttendance(prev => ({
      ...prev,
      [selectedDate]: Object.fromEntries(CATEGORIES_FLAT.map(c => [c.id, 0]))
    }));
    showToast("Cleared all category values for " + selectedDate, "info");
  };

  // Export report
  const handleExportCSV = () => {
    const defaultValue = selectedDate;
    const promptText = `Enter dates to export (comma-separated).\nLeave blank to export the current selected date (${selectedDate}).\n\nAvailable dates:\n${dateOptions.join('\n')}`;
    const input = window.prompt(promptText, defaultValue);
    const selected = (input || "").split(',').map(s => s.trim()).filter(Boolean);
    const datesToExport = selected.length > 0 ? selected : [selectedDate];

    const rows: any[] = [];
    rows.push(["Date", "Sector", "Volunteer Category", "Volunteer Count"]);

    datesToExport.forEach((date) => {
      const counts = attendance[date] || {};
      SECTORS_CONFIG.forEach(sec => {
        sec.categories.forEach(cat => {
          const count = counts[cat.id] || 0;
          rows.push([date, sec.name, cat.name, count]);
        });
      });
    });

    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Summary');
      XLSX.writeFile(wb, `brigada-attendance-summary-report.xlsx`);
      showToast("Exported attendance summary to Excel", "success");
    } catch (err) {
      console.error('Export Excel error', err);
      showToast('Failed to export Excel file', 'info');
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* Toast Alert */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 bg-white rounded-2xl shadow-xl border animate-bounce",
          toast.type === "success" 
            ? "border-emerald-200 text-emerald-800" 
            : "border-blue-200 text-blue-800"
        )}>
          {toast.type === "success" ? <Sparkles className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-blue-600" />}
          <div className="text-sm font-black tracking-tight">{toast.message}</div>
        </div>
      )}

      {/* Input Modal */}
        <AttendanceInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveModalData}
        initialCounts={currentCounts}
        availableDates={dateOptions}
      />

      {/* Printable Report Header (Hidden in regular screen browser) */}
      <div className="hidden print:flex flex-col gap-4 border-b pb-6 mb-8 text-center items-center justify-center">
        <h1 className="text-2xl font-black text-slate-900 uppercase">Brigada Eskwela System</h1>
        <h2 className="text-lg font-bold text-slate-600">Daily Volunteer Attendance Summary Report</h2>
        <p className="text-sm text-slate-500 font-medium">Record Date: <span className="font-bold text-slate-800">{new Date(selectedDate).toDateString()}</span></p>
        <div className="flex gap-12 mt-4 text-left">
          <div>
            <p className="text-xs text-slate-400 font-black uppercase">Total Volunteers Logged</p>
            <p className="text-xl font-bold text-slate-800">{totalVolunteers} Pax</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase">Private Sector Volunteers</p>
            <p className="text-xl font-bold text-blue-primary">{sectorData[0].volunteersCount} Pax</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase">Community Volunteers</p>
            <p className="text-xl font-bold text-teal-600">{sectorData[1].volunteersCount} Pax</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-black uppercase">Government Volunteers</p>
            <p className="text-xl font-bold text-indigo-600">{sectorData[2].volunteersCount} Pax</p>
          </div>
        </div>
      </div>

      {/* Screen Layout: Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-blue-primary" /> Daily Attendance Summary
          </h1>
          <p className="text-slate-500 font-medium">
            Log and review volunteer presence and participation breakdowns across sectors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Quick Date Switcher */}
          <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-black text-slate-700 focus:outline-none pr-6 cursor-pointer"
            >
              {dateOptions.map(d => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-3 bg-blue-primary hover:bg-blue-dark text-white rounded-2xl text-xs font-black shadow-md shadow-blue-primary/15 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Daily Attendance
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-primary border border-slate-200 rounded-2xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Export Excel report"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Report
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-primary border border-slate-200 rounded-2xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Print Attendance Report"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Screen Layout: Main Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
        
        {/* KPI: Total Volunteers */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-[0_2px_15px_rgba(37,99,235,0.02)] relative overflow-hidden group hover:border-blue-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="p-3.5 bg-blue-primary/10 rounded-2xl text-blue-primary">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Volunteers</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalVolunteers} Pax</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Logged on selected date</p>
          </div>
        </div>

        {/* KPI: Private Sectors */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-[0_2px_15px_rgba(37,99,235,0.02)] relative overflow-hidden group hover:border-blue-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50/50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Private Sectors</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{sectorData[0].volunteersCount} Pax</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{Math.round(totalVolunteers ? (sectorData[0].volunteersCount / totalVolunteers) * 100 : 0)}% of total distribution</p>
          </div>
        </div>

        {/* KPI: Community */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-[0_2px_15px_rgba(37,99,235,0.02)] relative overflow-hidden group hover:border-teal-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50/50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="p-3.5 bg-teal-600/10 rounded-2xl text-teal-600">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Community</p>
            <p className="text-2xl font-black text-teal-600 mt-1">{sectorData[1].volunteersCount} Pax</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{Math.round(totalVolunteers ? (sectorData[1].volunteersCount / totalVolunteers) * 100 : 0)}% of total distribution</p>
          </div>
        </div>

        {/* KPI: Government */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 shadow-[0_2px_15px_rgba(37,99,235,0.02)] relative overflow-hidden group hover:border-indigo-200 transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50/50 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
          <div className="p-3.5 bg-indigo-600/10 rounded-2xl text-indigo-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Government Agencies</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{sectorData[2].volunteersCount} Pax</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{Math.round(totalVolunteers ? (sectorData[2].volunteersCount / totalVolunteers) * 100 : 0)}% of total distribution</p>
          </div>
        </div>

      </div>

      {/* Configuration & Charts Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        
        {/* Helper Instructions card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_15px_rgba(37,99,235,0.02)] flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-5 h-5 text-blue-primary" /> Logging Guide
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold mb-3">
              This dashboard records the physical presence of volunteers during the Brigada Eskwela weeks.
            </p>
            <ul className="text-[11px] text-slate-400 font-bold flex flex-col gap-2.5 list-disc pl-4 leading-relaxed">
              <li>Open the <span className="text-blue-primary">Log Daily Attendance</span> modal to record new statistics.</li>
              <li>Input positive numbers representing the headcount for each group.</li>
              <li>The system automatically computes percentages and generates analytical visualisations.</li>
              <li>You can search and filter categories by typing keywords below.</li>
            </ul>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Status: Active</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-black text-blue-primary hover:text-blue-dark flex items-center gap-1 cursor-pointer"
            >
              Open Form Modal &rarr;
            </button>
          </div>
        </div>

        {/* Chart 1: Donut Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_15px_rgba(37,99,235,0.02)] flex flex-col">
          <h3 className="font-black text-slate-900 mb-4">Sector Distribution</h3>
          {pieChartData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 min-h-[180px]">
              <AlertCircle className="w-8 h-8 opacity-40" />
              <p className="text-xs font-bold">No volunteers logged for this day</p>
            </div>
          ) : (
            <div className="flex-1 min-h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Pax`, "Volunteers"]} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{totalVolunteers}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Volunteers</span>
              </div>
            </div>
          )}
          
          {/* Pie Chart Legend */}
          <div className="flex flex-col gap-1.5 mt-3">
            {sectorData.map(sec => (
              <div key={sec.key} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                  <span className="font-bold text-slate-600 truncate max-w-[130px]">{sec.name}</span>
                </div>
                <span className="font-black text-slate-800">{sec.volunteersCount} Pax ({Math.round(totalVolunteers ? (sec.volunteersCount / totalVolunteers) * 100 : 0)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Daily Trend bar chart */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_15px_rgba(37,99,235,0.02)] flex flex-col">
          <h3 className="font-black text-slate-900 mb-4">6-Day Attendance Timeline</h3>
          <div className="flex-1 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} style={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: 10, fontWeight: "bold", fill: "#94a3b8" }} />
                <Tooltip formatter={(value: any, name: any) => [`${value} Pax`, name]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Bar dataKey="Private Sectors" fill="#2563eb" stackId="a" />
                <Bar dataKey="Community" fill="#0d9488" stackId="a" />
                <Bar dataKey="Government Agencies / National and Local" fill="#4f46e5" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Data Entries Tables */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_15px_rgba(37,99,235,0.02)] print:border-none print:shadow-none print:p-0">
        
        {/* Table Search & Tools */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category (e.g. parents, NGO, SK...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-blue-primary/10 focus:border-blue-primary font-bold text-slate-800 transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all hover:bg-slate-100 active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate Counts
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100 active:scale-95 cursor-pointer"
            >
              Clear Current Day
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-primary hover:bg-blue-dark text-white rounded-xl text-xs font-black transition-all active:scale-95 shadow-md shadow-blue-primary/15 cursor-pointer ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Log/Edit Attendance
            </button>
          </div>
        </div>

        {/* Grouped Sector Blocks */}
        <div className="flex flex-col gap-10">
          {SECTORS_CONFIG.map((sector) => {
            // Filter categories based on search query
            const filteredCategories = sector.categories.filter(cat => 
              cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Hide the sector entirely if search is active and yields no categories
            if (searchQuery && filteredCategories.length === 0) return null;

            const matchingSectorCalculations = sectorData.find(sd => sd.key === sector.key);
            const count = matchingSectorCalculations?.volunteersCount || 0;

            return (
              <div key={sector.key} className="flex flex-col gap-4">
                {/* Sector Section Title Banner */}
                <div className={cn("p-4 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2", sector.bgLight, sector.borderClass)}>
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className={cn("w-5 h-5", sector.textClass)} />
                    <div>
                      <h4 className="text-sm font-black text-slate-800">{sector.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Volunteers Category Log</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-col md:items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Sector Total</span>
                      <span className={cn("text-xs font-black", sector.textClass)}>{count} Volunteers</span>
                    </div>

                    <div className="w-px h-6 bg-slate-200 hidden md:block" />

                    <div className="flex flex-col md:items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Distribution Share</span>
                      <span className="text-xs font-bold text-slate-700">
                        {Math.round(totalVolunteers ? (count / totalVolunteers) * 100 : 0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories Table */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white/50">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-12">#</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Attendance Subcategory</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center w-64">Number of Volunteers</th>
                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right w-64">Distribution Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.map((cat, idx) => {
                        const countVal = currentCounts[cat.id] || 0;
                        const percentage = totalVolunteers ? Math.round((countVal / totalVolunteers) * 100) : 0;
                        
                        return (
                          <tr key={cat.id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-slate-400">{idx + 1}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-700 group-hover:text-blue-primary transition-colors">
                              {cat.name}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-black text-sm text-slate-800">{countVal} Pax</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                {percentage}% of day
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Total Row for Print Mode */}
        <div className="hidden print:flex flex-row justify-between items-center border-t-2 border-slate-800 pt-6 mt-8 font-black text-lg">
          <span>GRAND TOTAL (Volunteers & Distribution):</span>
          <div className="flex gap-12">
            <span>{totalVolunteers} Volunteers</span>
            <span>100% Share</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};
