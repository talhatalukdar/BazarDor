import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: { default: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে", template: "%s | বাজার দর" },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজার দর, দাম বাড়া-কমার তথ্য এবং বাজারভিত্তিক বিস্তারিত।",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- loaded at runtime so builds work offline */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <Suspense fallback={<div aria-hidden="true" className="h-[45px] border-b border-line bg-card" />}>
          <PriceTicker />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Providers />
      </body>
    </html>
  );
}
