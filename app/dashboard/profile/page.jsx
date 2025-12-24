"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/auth/authApi";
import { Loader2 } from "lucide-react";

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

      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#c5a059]" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-600 text-sm">
          Failed to load profile. Please try again later.
        </p>
      </div>
    );
  }

  const user = profileData?.user;

  return (
    <main className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-lg md:text-xl font-bold text-center mb-10 border-b-4 border-[#c5a059] inline-block pb-3">
          Edit Profile
        </h1>

        <div className="bg-gray-50 rounded-xl shadow-2xl p-6 md:p-10">
          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-full border-8 border-[#c5a059] overflow-hidden shadow-xl">
              <Image
                src="/user-avatar.png"
                alt={user?.name || "User"}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-3 text-sm text-gray-600 font-medium">
              Profile photo (coming soon)
            </p>
          </div>

          {/* Success */}
          {updateSuccess && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-center text-sm font-medium">
              Profile updated successfully! Redirecting...
            </div>
          )}

          {/* Error */}
          {updateError && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-800 rounded-lg text-center text-sm font-medium">
              {updateErrorData?.data?.message || "Failed to update profile"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1 text-gray-800"
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
                minLength={2}
                className="w-full px-4 py-2 border-2 border-black rounded-lg text-sm focus:border-[#c5a059] focus:outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-1 text-gray-800"
              >
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-black rounded-lg text-sm focus:border-[#c5a059] focus:outline-none transition-all"
                placeholder="+1234567890"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-5">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-8 py-3 bg-[#c5a059] text-white text-sm font-semibold rounded-lg hover:bg-black hover:text-[#c5a059] transition-all border-2 border-[#c5a059] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updateLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-8 py-3 border-2 border-black text-black text-sm font-semibold rounded-lg hover:bg-black hover:text-white transition-all"
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
