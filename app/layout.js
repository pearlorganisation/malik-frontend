"use client";

import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import InquiryModal from "@/components/Inquiry/InquiryModel.jsx";
import { useState } from "react";

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
  const addHeaderSpacing = showHeader && pathname !== "/";

    const [isInquiryOpen, setIsInquiryOpen] = useState(false);



  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <Providers>
          {/* Toast Provider (GLOBAL) */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background: "#0f172a", // slate-900
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />

          {/* Header */}
          {showHeader && <Header />}

          {/* Page Content */}
         <main
            className={`transition-all ${
              addHeaderSpacing ? "pt-16 sm:pt-20" : "pt-0"
            }`}
          >
            {children}
          </main>

          {/* Footer */}
           <Footer onPlanTripClick={() => setIsInquiryOpen(true)} />

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        selectedTour={null}   // optional, can pass real data later
      />
        </Providers>
      </body>
    </html>
  );
}
