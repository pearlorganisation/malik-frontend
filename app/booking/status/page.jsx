import { Suspense } from "react";
import BookingStatusClient from "@/components/booking/BookingStatusClient.jsx";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingStatusClient />
    </Suspense>
  );
}
