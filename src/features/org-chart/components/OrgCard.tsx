"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { User, Users } from "lucide-react";

interface OrgCardProps {
  name: string;
  role: string;
  isMain?: boolean;
  className?: string;
  delay?: number;
  subNames?: string[];
}

export const OrgCard = ({ name, role, isMain = false, className, delay = 0, subNames }: OrgCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      className={cn(
        "relative flex flex-col items-center p-5 rounded-xl border transition-all duration-300",
        "bg-white shadow-[0_4px_20px_rgba(37,99,235,0.08)]",
        "hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)]",
        isMain ? "border-blue-primary border-2 w-72" : "border-slate-200 w-60",
        className
      )}
    >
      {/* Role / Committee Name at the Top */}
      <p className="text-[10px] text-blue-primary font-black text-center uppercase tracking-[0.15em] mb-4 bg-blue-primary/5 px-3 py-1.5 rounded-lg border border-blue-primary/10 w-full">
        {role}
      </p>

      {/* Icon in the Middle */}
      <div className={cn(
        "mb-4 p-3 rounded-full bg-blue-primary/5 border border-blue-primary/10",
        isMain ? "scale-105" : "scale-90"
      )}>
        {subNames ? (
          <Users className="text-blue-primary w-6 h-6" />
        ) : (
          <User className={cn(
            "text-blue-primary",
            isMain ? "w-8 h-8" : "w-6 h-6"
          )} />
        )}
      </div>
      
      {/* Name at the Bottom */}
      {!subNames ? (
        <h3 className={cn(
          "font-black text-center tracking-tight leading-tight",
          isMain ? "text-xl text-blue-dark" : "text-base text-slate-800"
        )}>
          {name}
        </h3>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          {subNames.map((n, i) => (
            <p key={i} className="text-[11px] font-black text-slate-800 text-center leading-tight">
              {n}
            </p>
          ))}
        </div>
      )}
      
      {/* Decorative Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-blue-primary/10 rounded-tl-xl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-blue-primary/10 rounded-br-xl" />
    </motion.div>
  );
};
