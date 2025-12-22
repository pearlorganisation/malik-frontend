"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoginMutation } from "@/features/auth/authApi";
import { setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Compass } from "lucide-react";
import toast from "react-hot-toast"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password }).unwrap();
      const loggedInUser = response.user;
      dispatch(setUser(loggedInUser));
       toast.success(response.message || "Login successful!");
      router.push("/dashboard");
    } catch (err) {
      const message =
        err?.data?.message ||
        "Login failed. Check your credentials or verify your email first.";
       toast.error(message || "Login failed. Check credentials or verify your email."
    );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 relative overflow-hidden">
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-slate-900/10 blur-3xl" />
      </div>

      {/* CARD */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-6 sm:p-10">
        
        {/* LOGO */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Compass className="text-amber-400" />
            </div>

            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                Dubai<span className="text-amber-500">Tours</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                Premium Portal
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600">Welcome back</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Email address"
            className="
              w-full px-4 py-3 rounded-xl
              border border-slate-200
              text-slate-900 text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-amber-400
              transition disabled:opacity-50
            "
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Password"
            className="
              w-full px-4 py-3 rounded-xl
              border border-slate-200
              text-slate-900 text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-amber-400
              transition disabled:opacity-50
            "
          />

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3 rounded-xl
              bg-slate-900 text-white font-bold
              hover:bg-slate-800
              transition shadow-lg
              disabled:bg-slate-500 disabled:cursor-not-allowed
            "
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isError && (
            <p className="text-red-600 text-center text-sm">
              {error?.data?.message || "Invalid email or password"}
            </p>
          )}
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 sm:mt-8 text-center space-y-2 sm:space-y-3">
          <p className="text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-slate-900 hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <p className="text-sm text-slate-600">
    <Link
      href="/forgot-password"
      className="font-semibold text-amber-500 hover:underline"
    >
      Forgot Password?
    </Link>
  </p>

          <Link
            href="/verify-otp"
            className="text-sm text-slate-500 hover:text-slate-900 underline"
          >
            Verify OTP / Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
