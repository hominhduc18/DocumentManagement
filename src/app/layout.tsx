import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tài liệu API Hóa đơn điện tử VNPT v6.0",
  description:
    "Tra cứu và quản lý tài liệu API Hóa đơn điện tử VNPT — PublishService, PortalService, BusinessService, TT78, CTT, MTT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased relative bg-slate-100 text-slate-900 overflow-hidden" suppressHydrationWarning>
        {/* 3D Mesh Gradient Blobs */}
        <div className="pointer-events-none fixed top-[-10%] left-[-5%] z-0 h-[600px] w-[600px] animate-blob rounded-full bg-blue-400 opacity-50 mix-blend-multiply blur-3xl filter"></div>
        <div className="animation-delay-2000 pointer-events-none fixed top-[10%] right-[-5%] z-0 h-[600px] w-[600px] animate-blob rounded-full bg-emerald-400 opacity-50 mix-blend-multiply blur-3xl filter"></div>
        <div className="animation-delay-4000 pointer-events-none fixed bottom-[-10%] left-[20%] z-0 h-[600px] w-[600px] animate-blob rounded-full bg-indigo-400 opacity-50 mix-blend-multiply blur-3xl filter"></div>
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
