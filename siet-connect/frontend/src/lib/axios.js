import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "/api" : "/api",
  timeout: 8000,
  withCredentials: true,
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const url = error.config?.url || "";
      if (error.response.status === 401) {
        // Skip redirect for auth check — let authStore handle it
        if (!url.includes("/auth/me")) {
          toast.error("Session expired — please log in again");
          window.location.href = "/login";
        }
      } else if (error.response.status === 429) {
        toast.error("Too many requests — please slow down");
      } else if (error.response.data?.message) {
        toast.error(error.response.data.message);
      }
    } else if (error.request) {
      toast.error("Connection lost — check your internet");
    }
    return Promise.reject(error);
  }
);

export default api;
