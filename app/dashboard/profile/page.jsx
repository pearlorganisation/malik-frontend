"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/auth/authApi"; // Adjust this path if needed
import { Loader2 } from "lucide-react"; // Optional spinner icon

export default function EditProfilePage() {
  const router = useRouter();

  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetProfileQuery();

  const [
    updateProfile,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorData,
    },
  ] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  // Populate form when profile data loads
  useEffect(() => {
    if (profileData?.user) {
      setFormData({
        name: profileData.user.name || "",
        phoneNumber: profileData.user.phoneNumber || "",
      });
    }
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      await updateProfile({
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        email: profileData.user.email.trim() || undefined,
      }).unwrap();

      // Redirect after success
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-600 text-xl">
          Failed to load profile. Please try again later.
        </p>
      </div>
    );
  }

  const user = profileData?.user;

  return (
    <main className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 border-b-4 border-[#c5a059] inline-block pb-4">
          Edit Profile
        </h1>

        <div className="bg-gray-50 rounded-xl shadow-2xl p-8 md:p-12">
          {/* Profile Photo Placeholder */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-32 h-32 rounded-full border-8 border-[#c5a059] overflow-hidden shadow-xl">
              <Image
                src="/user-avatar.png" // Replace later with real avatar
                alt={user?.name || "User"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Profile photo (coming soon)
            </p>
          </div>

          {/* Success Message */}
          {updateSuccess && (
            <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center font-semibold">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Error Message */}
          {updateError && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg text-center font-semibold">
              {updateErrorData?.data?.message || "Failed to update profile"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email - Read Only */}
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                className="w-full px-5 py-3 border-2 border-black rounded-lg focus:border-[#c5a059] focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-black rounded-lg focus:border-[#c5a059] focus:outline-none transition-all"
                placeholder="+1234567890"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-10 py-4 bg-[#c5a059] text-white font-bold rounded-lg hover:bg-black hover:text-[#c5a059] transition-all border-2 border-[#c5a059] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {updateLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-10 py-4 border-2 border-black text-black font-bold rounded-lg hover:bg-black hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
