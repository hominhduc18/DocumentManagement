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
    <html lang="vi" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
