import { OrgTree } from "@/features/org-chart/components/OrgTree";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizational Chart | Brigada Eskwela 2026-2027",
  description: "Official Organizational Structure for Brigada Eskwela 2026-2027",
};

export default function OrganizationPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Decor - Subtle light blue glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-light/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-8">
        {/* Header Section */}
        <header className="pt-12 pb-12 text-center px-4">
          <h2 className="text-blue-primary font-bold tracking-[0.3em] uppercase text-sm mb-4">
            Official Organizational Structure
          </h2>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            BRIGADA <span className="text-blue-primary">ESKWELA</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-blue-primary/20" />
            <p className="text-xl md:text-2xl text-slate-500 font-serif italic">
              School Year 2026 - 2027
            </p>
            <div className="h-px w-12 bg-blue-primary/20" />
          </div>
        </header>

        {/* Org Chart Section */}
        <section className="pb-32">
          <OrgTree />
        </section>

        {/* Footer / Credits */}
        <footer className="py-12 border-t border-slate-100 text-center bg-white">
          <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">
            Project Brigada System &copy; 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
