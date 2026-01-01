"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, X, RefreshCw, Mail, Download, AlertCircle } from "lucide-react";
import { useConfirmBookingMutation } from "@/features/booking/bookApi";

/* ---------- Button component ---------- */
const Button = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm hover:shadow",
    secondary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 shadow-sm hover:shadow",
    outline:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm hover:shadow",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

/* ---------- Transaction Card ---------- */
const TransactionCard = ({
  paymentVerified,
  details,
  onRetry,
  onContactSupport,
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden ring-1 ring-slate-900/5">
      <div
        className={`h-2 ${paymentVerified ? "bg-green-500" : "bg-red-500"}`}
      />

      <div className="p-8 pt-10 text-center">
        <div className="relative mb-6 mx-auto w-20 h-20">
          <div
            className={`absolute inset-0 rounded-full opacity-20 ${
              paymentVerified ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <div
            className={`relative flex items-center justify-center w-full h-full rounded-full border-[3px] ${
              paymentVerified
                ? "border-green-100 bg-green-50"
                : "border-red-100 bg-red-50"
            }`}
          >
            {paymentVerified ? (
              <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
            ) : (
              <X className="w-10 h-10 text-red-600" strokeWidth={3} />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {paymentVerified ? "Payment Successful" : "Payment Failed"}
        </h1>

        <div className="text-4xl font-extrabold text-slate-900 my-4">
          {details.amount || "—"}
        </div>

        <p className="text-slate-500 mb-8 text-sm font-medium">
          {paymentVerified
            ? "Thank you! Your transaction has been completed successfully."
            : details.errorMessage ||
              "We couldn’t process your payment. Please try again."}
        </p>

        <div className="space-y-3">
          {paymentVerified ? (
            <>
              <Button fullWidth icon={<Download size={18} />}>
                Download Receipt
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="danger"
                icon={<RefreshCw size={18} />}
                onClick={onRetry}
              >
                Try Again
              </Button>
              <Button
                fullWidth
                variant="ghost"
                icon={<AlertCircle size={18} />}
                onClick={onContactSupport}
              >
                Contact Support
              </Button>
            </>
          )}
        </div>
      </div>

      {paymentVerified && (
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <div className="flex items-center justify-center text-xs text-slate-500 gap-2">
            <Mail size={14} />
            <span>A receipt has been sent to your email.</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- CLIENT LOGIC ---------- */
export default function BookingStatusClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [confirmBooking, { data, isLoading, isError, error }] =
    useConfirmBookingMutation();

  useEffect(() => {
    if (bookingId) {
      confirmBooking({ bookingId });
    }
  }, [bookingId, confirmBooking]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600 font-medium">Verifying payment...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <TransactionCard
          paymentVerified={false}
          details={{
            amount: "",
            errorMessage: error?.data?.message || "Unable to verify payment",
          }}
          onRetry={() => confirmBooking({ bookingId })}
          onContactSupport={() => router.push("/support")}
        />
      </div>
    );
  }

  const paymentVerified = data?.isPaid === true;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <TransactionCard
        paymentVerified={paymentVerified}
        details={{
          amount: data?.amount || "",
          errorMessage: data?.message,
        }}
        onRetry={() => confirmBooking({ bookingId })}
        onContactSupport={() => router.push("/support")}
      />
    </div>
  );
}
