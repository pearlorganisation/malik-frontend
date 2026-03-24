"use client";

import Providers from "./providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import InquiryModal from "@/components/Inquiry/InquiryModel.jsx";
import React, { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export default function RootLayout({ children }) {
//   const pathname = usePathname();
//   const showHeader = !pathname?.startsWith("/dashboard");
//   const addHeaderSpacing = showHeader && pathname !== "/";

//     const [isInquiryOpen, setIsInquiryOpen] = useState(false);



//   return (
//     <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
//       <body className="font-sans">
//         <Providers>
//           {/* Toast Provider (GLOBAL) */}
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 borderRadius: "12px",
//                 background: "#0f172a", // slate-900
//                 color: "#fff",
//               },
//               success: {
//                 iconTheme: {
//                   primary: "#22c55e",
//                   secondary: "#ffffff",
//                 },
//               },
//               error: {
//                 iconTheme: {
//                   primary: "#ef4444",
//                   secondary: "#ffffff",
//                 },
//               },
//             }}
//           />

//           {/* Header */}
//           {showHeader && <Header />}

//           {/* Page Content */}
//          <main
//             className={`transition-all ${
//               addHeaderSpacing ? "pt-16 sm:pt-20" : "pt-0"
//             }`}
//           >
//             {/* {children} */}
//             {React.cloneElement(children, {
//   onPlanTripClick: () => setIsInquiryOpen(true),
// })}
//           </main>

//           {/* Footer */}
//            <Footer onPlanTripClick={() => setIsInquiryOpen(true)} />

//       <InquiryModal
//         isOpen={isInquiryOpen}
//         onClose={() => setIsInquiryOpen(false)}
//         selectedTour={null}   // optional, can pass real data later
//       />
//         </Providers>
//       </body>
//     </html>
//   );
// }

import { InquiryContext } from "@/context/InquiryContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showHeader = !pathname?.startsWith("/dashboard");
  const [selectedTour, setSelectedTour] = useState(null);
  const addHeaderSpacing = showHeader && pathname !== "/";
const openInquiry = (tour = null) => {
  setSelectedTour(tour);
  setIsInquiryOpen(true);
};
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  // const openInquiry = () => setIsInquiryOpen(true);
  const closeInquiry = () => setIsInquiryOpen(false);

  return (
    // <html lang="en">
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <Providers>

          {/* <InquiryContext.Provider value={{ openInquiry }}> */}
          <InquiryContext.Provider 
  value={{ 
    openInquiry, 
    closeInquiry, 
    isInquiryOpen 
  }}
>

            {/* <Toaster position="top-right" /> */}
            <Toaster
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      borderRadius: "12px",
      background: "#0f172a",
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

            {showHeader && <Header />}

            <main
              className={`transition-all ${
                addHeaderSpacing ? "pt-16 sm:pt-20" : "pt-0"
              }`}
            >
              {children}   {/* ✅ NORMAL render */}
            </main>

            <Footer onPlanTripClick={openInquiry} />

            <InquiryModal
              isOpen={isInquiryOpen}
              onClose={closeInquiry}
              // selectedTour={null}
               selectedTour={selectedTour}
            />

          </InquiryContext.Provider>

        </Providers>
      </body>
    </html>
  );
}