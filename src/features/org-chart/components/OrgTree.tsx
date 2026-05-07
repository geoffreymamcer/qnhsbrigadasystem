"use client";

import { BRIGADA_DATA } from "../services/orgChartData";
import { OrgCard } from "./OrgCard";
import { motion } from "framer-motion";

export const OrgTree = () => {
  return (
    <div className="flex flex-col items-center gap-16 py-12 px-4 w-full overflow-x-hidden">
      {/* Level 1: Principal */}
      <div className="relative">
        <OrgCard 
          name={BRIGADA_DATA.principal.name} 
          role={BRIGADA_DATA.principal.role} 
          isMain 
        />
        {/* Connection Line to Level 2 */}
        <div className="absolute -bottom-16 left-1/2 w-px h-16 bg-blue-primary/30 -translate-x-1/2" />
      </div>

      {/* Level 2: Coordinator */}
      <div className="relative mt-0">
        <OrgCard 
          name={BRIGADA_DATA.coordinator.name} 
          role={BRIGADA_DATA.coordinator.role} 
          delay={0.2}
        />
        {/* Connection Line to Level 3 */}
        <div className="absolute -bottom-16 left-1/2 w-px h-16 bg-blue-primary/30 -translate-x-1/2" />
      </div>

      {/* Level 3: Committee Heads (The same level) */}
      <div className="w-full relative mt-0 overflow-x-auto pb-12 hide-scrollbar">
        {/* Horizontal Connection Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-blue-primary/20 hidden lg:block" />
        
        <div className="flex flex-nowrap lg:justify-center gap-6 min-w-max lg:min-w-0 px-8">
          {BRIGADA_DATA.committees.map((committee, index) => (
            <div key={committee.name} className="flex flex-col items-center gap-6 relative">
              {/* Vertical line connecting to level above */}
              <div className="absolute -top-16 left-1/2 w-px h-16 bg-blue-primary/20 -translate-x-1/2 hidden lg:block" />
              
              <OrgCard 
                name={committee.head} 
                role={committee.name} 
                delay={0.3 + index * 0.1}
                className="w-56"
                subNames={committee.gradeHeads?.map(gh => gh.name)}
              />

              {/* Committee Members Consolidated Container */}
              {committee.subHeads && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-white border border-slate-200 rounded-xl p-4 w-56 mt-4 shadow-sm"
                >
                  <p className="text-[9px] uppercase tracking-widest text-blue-primary font-black mb-3 border-b border-slate-100 pb-2 leading-relaxed">
                    {committee.name} MEMBERS:
                  </p>
                  <div className="flex flex-col gap-2">
                    {committee.subHeads.map((sub, sIdx) => (
                      <p 
                        key={`${sub.name}-${sIdx}`}
                        className="text-slate-800 text-[11px] font-bold leading-tight hover:text-blue-primary transition-colors cursor-default"
                      >
                        {sub.name}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
