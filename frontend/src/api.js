import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const apiBaseURL = rawBaseURL.replace(/\/$/, "");

const API = axios.create({
  baseURL: `${apiBaseURL}/api`,
  timeout: 15000 // 15 seconds timeout
});

// Request Interceptor to append Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crop_advisor_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to capture token expiration (401)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials from storage
      localStorage.removeItem("crop_advisor_token");
      localStorage.removeItem("crop_advisor_user");
      
      // Redirect to login page with expired flag if not already on the login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
