"use client";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { Compass } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "OTP sent to your email!");
      // Redirect to reset-password page after success, pass email in query
      router.push(`/reset-password`);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-100 sm:w-125 h-100 sm:h-125 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-100 sm:w-125 h-100 sm:h-125 rounded-full bg-slate-900/10 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-6 sm:p-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
            <Compass className="text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Forgot Password</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center">
            Enter your registered email to receive a password reset OTP
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition shadow-lg disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-amber-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
