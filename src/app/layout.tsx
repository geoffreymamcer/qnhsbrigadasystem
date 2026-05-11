import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { MainContent } from "@/components/layout/MainContent";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brigada Eskwela 2026-2027 | System",
  description: "Official organizational and analytics system for Brigada Eskwela 2026-2027.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fcfcfd] font-sans">
        <SidebarProvider>
          <div className="flex">
            <Sidebar />
            <MainContent>{children}</MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
