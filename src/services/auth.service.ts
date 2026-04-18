// import type { User, AuthResponse } from "../types"; // Adjust path if needed
// import axios from "axios"; // Assume axios for API calls

// // const API_BASE = "https://cpm-contracts.onrender.com/api";
// // const API_BASE = "http://localhost:5000/api"; // Adjust
// const API_BASE = "https://contract-i.onrender.com/api"; // Adjust
// export const authService = {
//   isAuthenticated: (): boolean => {
//     return !!localStorage.getItem("token");
//   },

//   getToken: (): string | null => {
//     return localStorage.getItem("token");
//   },

//   clearAuth: (): void => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   },

//   login: async (email: string, password: string): Promise<AuthResponse> => {
//     const response = await axios.post(`${API_BASE}/auth/login`, {
//       email,
//       password,
//     });
//     const { token, user } = response.data;
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     return { token, user };
//   },

//   getMe: async (): Promise<{ data: { user: User } }> => {
//     const token = authService.getToken();
//     const response = await axios.get(`${API_BASE}/auth/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   },

//   getCurrentUser: async (): Promise<User> => {
//     const response = await authService.getMe();
//     return response.data.user;
//   },

//   logout: async (): Promise<void> => {
//     const token = authService.getToken();
//     await axios.post(
//       `${API_BASE}/auth/logout`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       },
//     );
//     authService.clearAuth();
//   },
// };

// src/services/auth.service.ts
import type { User, AuthResponse } from "../types";

const API_BASE = "https://contract-i.onrender.com/api";
// const API_BASE = "http://localhost:5000/api";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ← Important for httpOnly cookie
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  // ← NEW: Google Login (uses the endpoint we added in backend)
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
      credentials: "include", // ← httpOnly cookie
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google login failed");
    return data;
  },

  getMe: async (): Promise<{ data: { user: User } }> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch user");
    return data;
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    // No localStorage cleanup needed anymore (cookie is httpOnly)
  },
};
