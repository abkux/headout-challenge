import axios from "axios";
import Cookies from "js-cookie";

// added deplyed url
const baseURL = "https://headout-challenge.onrender.com/api";

// const baseURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token and session
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("Authorization");
    const session = Cookies.get("Session");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (session) {
      config.headers["Session"] = session;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If the token is expired or unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error("Token expired or unauthorized. Redirecting to login.");
      logoutAndRedirect();
      return Promise.reject(error);
    }

    // For other errors, log out and redirect to login
    if (
      error.response?.status === 403 || // case: forbidden
      error.response?.status === 500 // case: server error
    ) {
      console.error("Error occurred, redirecting to login.");
      logoutAndRedirect();
    }

    return Promise.reject(error);
  }
);

// Helper function to clear cookies and redirect to login
const logoutAndRedirect = () => {
  Cookies.remove("Authorization");
  Cookies.remove("Session");
  Cookies.remove("Username");
  window.location.href = "/login"; // Redirect to login
};

export default api;
