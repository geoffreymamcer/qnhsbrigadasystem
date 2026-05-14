"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { useSidebar } from "@/context/SidebarContext";
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Heart,
  FolderDown,
  Settings, 
  Bell, 
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Menu,
  LogOut
} from "lucide-react";
import { logout } from "@/features/auth/services/auth";
import { useState } from "react";


const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Organization", href: "/organization", icon: Users },
  { name: "Donations", href: "/donations", icon: Heart },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Forms", href: "/forms", icon: FolderDown },
];

const SECONDARY_NAV = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Support", href: "/support", icon: HelpCircle },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[60] transition-all duration-300 shadow-sm",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Brand & Toggle */}
      <div className={cn(
        "p-6 border-b border-slate-50 flex items-center justify-between transition-all",
        isCollapsed ? "px-4" : "px-6"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-primary rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-primary/20">
              <span className="text-white font-black text-sm tracking-tighter">BS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight uppercase leading-none">Brigada</span>
              <span className="text-blue-primary font-black text-sm tracking-tight uppercase leading-none">System</span>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 bg-blue-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-primary/20 mx-auto">
            <span className="text-white font-black text-sm tracking-tighter">BS</span>
          </div>
        )}
        
        <button 
          onClick={toggleSidebar}
          className={cn(
            "p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-blue-primary group",
            isCollapsed ? "absolute -right-3 top-20 bg-white border border-slate-100 shadow-md" : ""
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-8 mt-4 overflow-y-auto no-scrollbar">
        <div>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          )}
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-blue-primary text-white shadow-md shadow-blue-primary/10" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-blue-primary",
                    isCollapsed ? "justify-center px-0" : "justify-between"
                  )}
                  title={isCollapsed ? item.name : ""}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-primary")} />
                    {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
                  </div>
                  {!isCollapsed && isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                  
                  {isCollapsed && isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preferences</p>
          )}
          <div className="flex flex-col gap-1">
            {SECONDARY_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-blue-primary transition-all group",
                  isCollapsed ? "justify-center px-0" : ""
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-primary" />
                {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* Logout at the bottom of nav */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          <button
            onClick={async () => {
              await logout();
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-rose-500 hover:bg-rose-50 transition-all group",
              isCollapsed ? "justify-center px-0" : ""
            )}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-500" />
            {!isCollapsed && <span className="font-bold text-sm whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </nav>


      {/* User Profile */}
      <div className={cn(
        "p-4 border-t border-slate-50 bg-slate-50/50 transition-all",
        isCollapsed ? "px-2" : "px-4"
      )}>
        <div className={cn(
          "flex items-center p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-primary/10 border border-blue-primary/20 flex-shrink-0 flex items-center justify-center">
              <span className="text-blue-primary font-black text-xs uppercase">JH</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black text-slate-700 whitespace-nowrap">Joseph H.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Principal</span>
              </div>
            )}
          </div>
          {!isCollapsed && <Bell className="w-4 h-4 text-slate-300 group-hover:text-blue-primary transition-colors" />}
        </div>
      </div>
    </aside>
  );
};
