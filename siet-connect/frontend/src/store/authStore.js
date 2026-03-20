import { create } from "zustand";
import api from "../lib/axios.js";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,

  // Signup new user
  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/signup", formData);
      set({ user: data.data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Login existing user
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/auth/login", credentials);
      set({ user: data.data, isLoading: false });
      return data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Clear local state even if API fails
    }
    set({ user: null });
  },

  // Check if user is already authenticated
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.data, isCheckingAuth: false });
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },

  // Update profile locally after edit
  updateUser: (userData) => {
    set({ user: userData });
  },
}));

export default useAuthStore;
