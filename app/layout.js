"use client";

import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const showHeader = !pathname?.startsWith("/dashboard");

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <Providers>
          {/* Conditional Header */}
          {showHeader && <Header />}

          {/* Page Content */}
          <main className="mt-0">{children}</main>

          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
