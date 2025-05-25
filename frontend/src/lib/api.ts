import axios from "axios";
import { supabase } from "@/lib/supabase";

// API Base URL - Using relative URL to leverage Next.js proxy
const API_BASE_URL = "/api"; // Empty string for relative paths

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(async (config) => {
  // Only add token in browser environment
  if (typeof window !== "undefined") {
    try {
      // Supabase token'ını al
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Supabase token:", error);
    }
  }

  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Only redirect in browser environment
      if (typeof window !== "undefined") {
        // Supabase session'ını temizle
        await supabase.auth.signOut();

        // Eski localStorage verilerini temizle
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        localStorage.removeItem("supabase_user");
        localStorage.removeItem("user_profile");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
