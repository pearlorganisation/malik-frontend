// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadUserFromStorage = () => {
  if (typeof window === "undefined") return null; // SSR safety
  try {
    const serialized = localStorage.getItem("authUser");
    if (serialized === null) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn("Failed to load user from localStorage", err);
    return null;
  }
};

const initialState = {
  user: loadUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      // Save to localStorage
      try {
        if (action.payload) {
          localStorage.setItem("authUser", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("authUser");
        }
      } catch (err) {
        console.warn("Failed to save user to localStorage", err);
      }
    },
    logout(state) {
      state.user = null;
      // Clear from localStorage
      try {
        localStorage.removeItem("authUser");
      } catch (err) {
        console.warn("Failed to remove user from localStorage", err);
      }
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
