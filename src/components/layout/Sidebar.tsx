"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  Heart,
  FolderDown,
  Settings, 
  Bell, 
  HelpCircle,
  ChevronRight
} from "lucide-react";

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50">
      {/* Brand */}
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-primary/20">
            <span className="text-white font-black text-sm tracking-tighter">BS</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-tight uppercase leading-none">Brigada</span>
            <span className="text-blue-primary font-black text-sm tracking-tight uppercase leading-none">System</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 flex flex-col gap-8 mt-4">
        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-blue-primary text-white shadow-md shadow-blue-primary/10" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-blue-primary"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-primary")} />
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preferences</p>
          <div className="flex flex-col gap-1">
            {SECONDARY_NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-blue-primary transition-all group"
              >
                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-primary" />
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile / Notifications */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-primary/10 border border-blue-primary/20 flex items-center justify-center">
              <span className="text-blue-primary font-black text-xs uppercase">JH</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-700">Joseph H.</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Principal</span>
            </div>
          </div>
          <Bell className="w-4 h-4 text-slate-300 group-hover:text-blue-primary transition-colors" />
        </div>
      </div>
    </aside>
  );
};
