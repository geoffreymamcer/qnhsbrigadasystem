"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  trend?: number;
  children: ReactNode;
  className?: string;
}

export const AnalyticsCard = ({ title, subtitle, value, trend, children, className }: AnalyticsCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 shadow-[0_2px_15px_rgba(37,99,235,0.04)]",
      "hover:shadow-[0_8px_25px_rgba(37,99,235,0.08)] transition-all duration-300",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-blue-primary/60 uppercase tracking-widest">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
            trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      {value !== undefined && (
        <div className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
      )}

      <div className="flex-1 w-full min-h-[180px]">
        {children}
      </div>
    </div>
  );
};
