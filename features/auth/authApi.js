// services/authApi.js or wherever you keep it
import { baseApi } from "@/services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Register (sends OTP)
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data, // { name, email, phoneNumber, password }
      }),
      invalidatesTags: ["Auth"],
    }),

    // 2. Verify OTP (for registration or forgot password)
    verifyOTP: builder.mutation({
      query: ({ email, otp, type }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp, type }, // type: "REGISTER" or "FORGOT_PASSWORD"
      }),
      invalidatesTags: ["Auth"],
    }),

    // 3. Resend OTP
    resendOTP: builder.mutation({
      query: ({ email, type }) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: { email, type }, // type: "REGISTER" or "FORGOT_PASSWORD"
      }),
    }),

    // 4. Login
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data, // { email, password }
      }),
      invalidatesTags: ["Auth"],
    }),

    // 5. Logout
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    // 6. Get Current User (protected)
    me: builder.query({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    // 7. Forgot Password (sends reset OTP)
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // 8. Reset Password (after OTP verification)
    resetPassword: builder.mutation({
      query: ({ email,otp, newPassword, confirmNewPassword }) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: { email, otp , newPassword, confirmNewPassword },
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

// Export all hooks
export const {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
