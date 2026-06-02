import { AttendanceSummaryContainer } from "@/features/attendance-summary/components/AttendanceSummaryContainer";
import { getAttendanceSummary } from "@/features/attendance-summary/services/attendance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Attendance Summary | Brigada Eskwela 2026-2027",
  description: "Log daily volunteer attendance and view volunteer summaries.",
};

export default async function AttendanceSummaryPage() {
  const initialData = await getAttendanceSummary();

  return (
    <div className="min-h-screen relative p-8">
      {/* Background Decor - Subtle blue glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-light/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <AttendanceSummaryContainer initialData={initialData} />
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center bg-white mt-20">
        <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">
          Project Brigada System &copy; 2026
        </p>
      </footer>
    </div>
  );
}
