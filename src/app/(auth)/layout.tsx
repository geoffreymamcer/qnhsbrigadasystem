import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | Brigada System',
  description: 'Secure access to the school management system',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative">
      <main className="relative z-10 w-full min-h-screen">
        {children}
      </main>
      
      {/* Absolute footer overlay for desktop - subtle */}
      <div className="hidden lg:block absolute bottom-8 right-8 z-20 text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mix-blend-difference">
        &copy; 2026 Brigada System &bull; v2.4.0
      </div>
    </div>
  );
}
