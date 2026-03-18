"use client";
import { useState } from "react";
import { useResetPasswordMutation } from "@/features/auth/authApi";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(formData).unwrap();
      toast.success(res.message || "Password reset successfully!");
      setTimeout(() => router.push("/login"), 2000); // redirect to login
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Reset Password</h2>
          <p className="text-sm sm:text-base text-slate-600 text-center">
            Enter your email, OTP, and new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Registered Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:opacity-50"
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:opacity-50"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:opacity-50"
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 transition disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition shadow-lg disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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
