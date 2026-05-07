"use client";

import { useState, useMemo } from "react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend 
} from "recharts";
import { TimeFilter } from "../types";
import { getMockAnalytics } from "../services/analyticsData";
import { AnalyticsCard } from "./AnalyticsCard";
import { cn } from "@/lib/utils/utils";
import { Calendar, Filter, MoreHorizontal } from "lucide-react";

const FILTERS: TimeFilter[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export const DashboardContainer = () => {
  const [filter, setFilter] = useState<TimeFilter>("Monthly");
  const data = useMemo(() => getMockAnalytics(filter), [filter]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto py-8 px-4">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Analytics</h1>
          <p className="text-slate-500 font-medium">Real-time donation tracking and performance metrics.</p>
        </div>
        
        <div className="flex items-center bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                filter === f ? "bg-blue-primary text-white shadow-md" : "text-slate-400 hover:text-blue-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 10 Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Total Donations (Line) */}
        <AnalyticsCard 
          title="Total Donations Received" 
          value={data.totalDonations.count.toLocaleString()}
          trend={data.totalDonations.trend}
        >
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.totalDonations.history}>
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 2. Total Donation Value (Area) */}
        <AnalyticsCard 
          title="Total Donation Value" 
          value={formatCurrency(data.totalValue.amount)}
          trend={data.totalValue.trend}
        >
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.totalValue.history}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 3. Total Quantity (Bar) */}
        <AnalyticsCard title="Total Quantity of Items" value={data.totalQuantity.count.toLocaleString()}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.totalQuantity.history}>
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <XAxis dataKey="name" hide />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 4. Active Donors (Line) */}
        <AnalyticsCard title="Number of Active Donors" value={data.activeDonors.count.toLocaleString()}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.activeDonors.history}>
              <Line type="stepAfter" dataKey="value" stroke="#60a5fa" strokeWidth={3} dot={true} />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 5. Top Donors (Horizontal Bar) */}
        <AnalyticsCard title="Top Donors" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart layout="vertical" data={data.topDonors} margin={{ left: 40 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 6. Most Donated Items (Bar) */}
        <AnalyticsCard title="Most Donated Items">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.mostDonatedItems}>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Bar dataKey="value" fill="#93c5fd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 7. Category Distribution (Donut) */}
        <AnalyticsCard title="Donation Category Distribution">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data.categoryDistribution}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {data.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 8. Donation Trend Over Time (Line) */}
        <AnalyticsCard title="Donation Trend Over Time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data.trendOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="basis" dataKey="value" stroke="#2563eb" strokeWidth={4} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 9. Average Donation Value (KPI + Trend) */}
        <AnalyticsCard title="Average Donation Value" value={formatCurrency(data.avgDonationValue.amount)}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.avgDonationValue.history}>
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* 10. Highest Value Donations (Ranked Table) */}
        <AnalyticsCard title="Highest Value Donations" className="lg:col-span-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.highestValueDonations.map((item, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-700">{item.name}</td>
                    <td className="py-4 text-sm font-black text-blue-primary text-right">{formatCurrency(item.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnalyticsCard>

      </div>
    </div>
  );
};
