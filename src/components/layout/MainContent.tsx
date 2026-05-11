"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils/utils";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <main className={cn(
      "flex-1 min-h-screen relative overflow-x-hidden transition-all duration-300",
      isCollapsed ? "ml-20" : "ml-64"
    )}>
      {children}
    </main>
  );
}
