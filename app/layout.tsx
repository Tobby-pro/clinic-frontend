// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/marketing/Navbar";
import { Toaster } from "sonner"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // ✅ Forces the font to load faster
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Clinbox",
  description: "Smart scheduling system for modern clinics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* ✅ We added the variables to <html> AND <body> to be safe */}
      <body className={`${geistSans.variable} font-sans antialiased bg-white`}>
        <Navbar />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}