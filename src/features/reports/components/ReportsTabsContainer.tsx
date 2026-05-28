"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { FileText, ClipboardList } from "lucide-react";
import { AccomplishmentContainer } from "./AccomplishmentContainer";
import { FacilityNeedsContainer } from "./FacilityNeedsContainer";
import { Accomplishment, FacilityNeed } from "../types";
import { motion } from "framer-motion";

interface ReportsTabsContainerProps {
  initialAccomplishments: Accomplishment[];
  initialFacilityNeeds: FacilityNeed[];
}

type TabType = "accomplishments" | "needs";

export const ReportsTabsContainer = ({ 
  initialAccomplishments, 
  initialFacilityNeeds 
}: ReportsTabsContainerProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("accomplishments");

  const tabs = [
    { id: "accomplishments" as TabType, label: "Accomplishment Reports", icon: FileText },
    { id: "needs" as TabType, label: "Needs Assessment", icon: ClipboardList }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Tabs Header Navigation */}
      <div className="w-full bg-white/60 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 py-5 text-xs font-black uppercase tracking-widest relative transition-all duration-300 focus:outline-none",
                    isActive ? "text-blue-primary" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Icon className={cn("w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
                  {tab.label}
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeReportTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-primary rounded-t-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content rendering area */}
      <div className="flex-1 bg-slate-50/50">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "accomplishments" ? (
            <AccomplishmentContainer initialData={initialAccomplishments} />
          ) : (
            <FacilityNeedsContainer initialData={initialFacilityNeeds} />
          )}
        </motion.div>
      </div>
    </div>
  );
};
