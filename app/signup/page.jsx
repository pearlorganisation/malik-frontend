"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} from "@/features/auth/authApi"; // Adjust path if needed
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Control which step to show
  const [isOtpStep, setIsOtpStep] = useState(false);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!name || !email || !phoneNumber || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await register({
        name,
        email,
        phoneNumber,
        password,
      }).unwrap();

      alert("OTP sent successfully! Check your email.");
      setIsOtpStep(true); // Switch to OTP verification
    } catch (err) {
      alert(
        err?.data?.message ||
          "Failed to send OTP. If you already registered, an OTP has been resent."
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 4) {
      alert("Please enter the 4-digit OTP");
      return;
    }

    try {
      await verifyOTP({
        email,
        otp,
        type: "REGISTER",
      }).unwrap();

      alert("Account verified successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      alert(err?.data?.message || "Invalid or expired OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOTP({
        email,
        type: "REGISTER",
      }).unwrap();

      alert("New OTP sent to your email!");
    } catch (err) {
      alert(err?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black"></div>
        <div className="absolute top-0 left-0 w-96 h-96 border-l-8 border-t-8 border-black -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-r-8 border-b-8 border-black translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative w-full max-w-md p-10 bg-white shadow-2xl border border-gray-200 rounded-none">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black tracking-wider">LOGO</h1>
          <p className="text-sm text-gray-600 mt-2">
            {isOtpStep ? "Verify your email" : "Create your account"}
          </p>
        </div>

        {/* Registration Form */}
        {!isOtpStep ? (
          <form onSubmit={handleRegister} className="space-y-8">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isRegistering}
                placeholder="Full Name"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isRegistering}
                placeholder="Email address"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isRegistering}
                placeholder="Phone Number"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isRegistering}
                placeholder="Password"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isRegistering}
                placeholder="Confirm Password"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-4 bg-black text-white text-lg font-medium tracking-wide hover:bg-gray-900 transition-all duration-300 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isRegistering ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div>
              <p className="text-center text-sm text-gray-600 mb-4">
                An OTP has been sent to{" "}
                <span className="font-semibold">{email}</span>
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                maxLength={6}
                disabled={isVerifying}
                placeholder="Enter 6-digit OTP"
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-400 text-black text-lg text-center tracking-widest focus:outline-none focus:border-black transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-black text-white text-lg font-medium tracking-wide hover:bg-gray-900 transition-all duration-300 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="w-full text-center text-sm text-gray-700 underline hover:text-black transition"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </form>
        )}

        <p className="mt-10 text-center text-sm text-gray-700">
          {isOtpStep ? "Already verified?" : "Already have an account?"}{" "}
          <Link
            href="/login"
            className="font-semibold text-black underline hover:text-gray-800 transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
