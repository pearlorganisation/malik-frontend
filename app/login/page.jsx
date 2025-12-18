"use client";

import Link from "next/link";
import { useState } from "react";
import { useLoginMutation } from "@/features/auth/authApi";
import { setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

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
      console.log("Login response:", response);
      const loggedInUser = response.user;
      console.log("Logged in user:", loggedInUser);
      // Save user to Redux state so Header updates instantly
      dispatch(setUser(loggedInUser));
      alert("Login successful!");
      router.push("/dashboard"); // or "/" or your main app route
    } catch (err) {
      const message =
        err?.data?.message ||
        "Login failed. Check your credentials or verify your email first.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black"></div>
        <div className="absolute top-0 left-0 w-96 h-96 border-l-8 border-t-8 border-black -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-r-8 border-b-8 border-black translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative w-full max-w-md p-10 bg-white shadow-2xl border border-gray-200 rounded-none">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black tracking-wider">LOGO</h1>
          <p className="text-sm text-gray-600 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Email address"
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Password"
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black text-white text-lg font-medium tracking-wide hover:bg-gray-900 transition-all duration-300 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isError && (
            <p className="text-red-600 text-center text-sm -mt-4">
              {error?.data?.message || "Invalid email or password"}
            </p>
          )}
        </form>

        <p className="mt-10 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-black underline hover:text-gray-800 transition"
          >
            Sign Up
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link
            href="/verify-otp"
            className="text-black underline hover:text-gray-800"
          >
            Verify OTP / Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
}
