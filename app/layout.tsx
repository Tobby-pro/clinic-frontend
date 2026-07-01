// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/marketing/Navbar";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clinbox",
  description: "Smart scheduling system for modern clinics",
icons: {
  icon: "/images/clinbox_logo98.svg",
}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        className={`${geistSans.variable} font-sans antialiased bg-white`}
      >
        <Navbar />
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}