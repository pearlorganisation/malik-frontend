"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} from "@/features/auth/authApi";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)  return toast.error("Passwords do not match");
    if (!name || !email || !phoneNumber || !password)
      return toast.error("All fields are required");

    try {
      await register({ 
        name,
         email,
          phoneNumber,
           password,
           }).unwrap();
      toast.success("OTP sent successfully! Check your email.");
      setIsOtpStep(true);
    } catch (err) {
       toast.error(
        err?.data?.message || "Failed to send OTP. If already registered, OTP resent."
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) return toast.error("Enter valid OTP")

    try {
      await verifyOTP({ email, otp, type: "REGISTER" }).unwrap();
       toast.success("OTP verified. User registered successfully.");
      router.push("/login");
    } catch (err) {
       toast.error(err?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOTP({ email, type: "REGISTER" }).unwrap();
       toast.success("OTP resent successfully. Please verify your email.");
    } catch (err) {
       toast.error(err?.data?.message || "Failed to resend OTP");;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full bg-slate-900/10 blur-3xl" />
      </div>

      {/* CARD */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-slate-100 p-6 sm:p-10">
        
        {/* LOGO */}
        <Link href="/" className="flex justify-center mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
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
        </Link>

        {/* TITLE */}
        <p className="text-center text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
          {isOtpStep ? "Verify your email address" : "Create your account"}
        </p>

        {/* FORM */}
        {!isOtpStep ? (
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            {[
              { type: "text", value: name, set: setName, placeholder: "Full Name" },
              { type: "email", value: email, set: setEmail, placeholder: "Email Address" },
              { type: "tel", value: phoneNumber, set: setPhoneNumber, placeholder: "Phone Number" },
              { type: "password", value: password, set: setPassword, placeholder: "Password" },
              {
                type: "password",
                value: confirmPassword,
                set: setConfirmPassword,
                placeholder: "Confirm Password",
              },
            ].map((field, i) => (
              <input
                key={i}
                type={field.type}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                disabled={isRegistering}
                required
                placeholder={field.placeholder}
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-slate-200
                  text-slate-900 text-sm sm:text-base
                  focus:outline-none focus:ring-2 focus:ring-amber-400
                  transition disabled:opacity-50
                "
              />
            ))}

            <button
              type="submit"
              disabled={isRegistering}
              className="
                w-full py-3 rounded-xl
                bg-slate-900 text-white font-bold
                hover:bg-slate-800
                transition shadow-lg
                disabled:bg-slate-500
              "
            >
              {isRegistering ? "Sending OTP..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5 sm:space-y-6">
            <p className="text-center text-sm text-slate-600">
              OTP sent to <span className="font-semibold break-all">{email}</span>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={isVerifying}
              placeholder="Enter OTP"
              className="
                w-full px-4 py-3 rounded-xl
                border border-slate-200
                text-center tracking-widest text-sm sm:text-base
                focus:outline-none focus:ring-2 focus:ring-amber-400
                transition disabled:opacity-50
              "
            />

            <button
              type="submit"
              disabled={isVerifying}
              className="
                w-full py-3 rounded-xl
                bg-slate-900 text-white font-bold
                hover:bg-slate-800
                transition shadow-lg
                disabled:bg-slate-500
              "
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="w-full text-sm text-slate-500 hover:text-slate-900 transition underline"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </form>
        )}

        {/* FOOTER */}
        <p className="mt-6 sm:mt-8 text-center text-sm text-slate-600">
          {isOtpStep ? "Already verified?" : "Already have an account?"}{" "}
          <Link href="/login" className="font-semibold text-slate-900 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
