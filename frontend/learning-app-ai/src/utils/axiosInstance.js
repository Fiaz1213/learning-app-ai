// API CLIENT/HTTP LAYER

// ==========================================================
// AXIOS INSTANCE - CENTRALIZED HTTP CLIENT
// ==========================================================
//
// ARCHITECTURE OVERVIEW:
// This file is part of a layered frontend architecture:
//
// Component → Service Layer → Axios Instance → Backend API
//
// - Components call service functions (e.g., authService)
// - Services call axiosInstance
// - axiosInstance handles all HTTP concerns (headers, auth, errors)
//
// ==========================================================

import axios from "axios";

import { BASE_URL } from "./apiPaths";

// This creates a reusable HTTP client with:
// - Base URL (centralized API endpoint)
// - Default headers
// - Timeout configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ==========================================================
// Request Interceptor
// ==========================================================
//
// PURPOSE: // Automatically attach JWT token to every outgoing request.
//
// WHY?
// HTTP is stateless → server does NOT remember the user.
// So every request must include proof of identity.
//
// WHAT IS HAPPENING?
// - We read token from localStorage
// - Attach it as Authorization header
//
// RESULT:
// Every request becomes:
// Authorization: Bearer <token>
// This is called "Bearer Token Authentication" → Whoever holds (bears) the token is considered authenticated
// ==========================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================================
// Response Interceptor
// ==========================================================
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
        console.error("Server error. Please try again later");
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout. Please try again");
      }
    }
    return Promise.reject(error);
  },
);

// ==========================================================
// SECURITY NOTES
// ==========================================================
//
// CURRENT IMPLEMENTATION:
// - Token stored in localStorage
// - Accessible via JavaScript
// - Vulnerable to XSS attacks
//
// XSS (Cross-Site Scripting):
// If attacker injects malicious JS, they can do:
// localStorage.getItem("token")
// → steal user token
//
// RECOMMENDED (PRODUCTION):
// - Store token in HttpOnly cookies instead
// - Cookies are NOT accessible via JavaScript
// - Browser sends them automatically
//
// IF USING HttpOnly COOKIES:
// - Remove Authorization header logic
// - Enable `withCredentials: true`
// - Backend reads token from cookies instead of headers
// ==========================================================

export default axiosInstance;
