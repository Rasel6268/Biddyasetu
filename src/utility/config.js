import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
  timeout: 15000,
});

// Request Interceptor: Attach bearer token from localStorage if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("biddyasetu_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract readable backend error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      "An unexpected network or server error occurred.";

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

export default api;