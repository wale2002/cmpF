/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
import type {
  ApiResponse,
  AuthResponse,
  User,
  // Document,
  Organization,
  UserMetrics,
  OrganizationMetrics,
  DocumentMetrics,
  CreateUserRequest,
  CreateUserResponse,
  Alert, // Added if not present
} from "../types";

// const BASE_URL = "https://cpm-contracts.onrender.com/api";

const BASE_URL = "http://localhost:5000/api";

const apiFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<any> => {
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // THIS IS THE FIX — ADD THESE 4 LINES
  // === CRITICAL FIX FOR PROFILE PICTURE & DOCUMENT UPLOAD ===
  if (options.body instanceof FormData) {
    delete (config.headers as Record<string, string>)["Content-Type"];
  }

  console.log("API Fetch:", { url: `${BASE_URL}${url}`, hasToken: !!token }); // Debug log

  const response = await fetch(`${BASE_URL}${url}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API Error:", {
      status: response.status,
      message: error.message,
    }); // Debug
    throw new Error(
      error.message || `HTTP ${response.status}: API request failed`,
    );
  }
  return response.json();
};

// Helper for file uploads (multipart/form-data)
const apiUpload = async (url: string, formData: FormData): Promise<any> => {
  const token = localStorage.getItem("token");
  const config: RequestInit = {
    method: "POST",
    body: formData,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };

  const response = await fetch(`${BASE_URL}${url}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}: Upload failed`);
  }
  return response.json();
};

// Helper for downloads (returns blob)
const apiDownload = async (url: string): Promise<Blob> => {
  const token = localStorage.getItem("token");
  const config: RequestInit = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${BASE_URL}${url}`, config);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Download failed`);
  }
  return response.blob();
};
// NEW: FAST GLOBAL DOCUMENTS (used by Dashboard)

// Auth Service
export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // Handle both nested and flat responses
    const token = response.data?.token || response.token;
    const userData = response.data?.user || response.user;
    if (token && userData) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("Login success:", {
        token: token.substring(0, 20) + "...",
        userRole: userData.role?.name || userData.role,
      }); // Debug, handle populated role
    } else {
      throw new Error("Invalid response from server");
    }
    return response;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiFetch("/auth/me");
    // Handle both nested and flat responses
    const userData = response.data?.user || response.user;
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response;
  },

  logout: async (): Promise<ApiResponse> => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("authService: Logout API error", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return {
      status: "success",
      statusCode: 200,
      message: "Logged out",
      data: null,
      documents: [],
    };
  },

  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    return apiFetch("/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (
    resetToken: string,
    newPassword: string,
  ): Promise<ApiResponse> => {
    return apiFetch("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ resetToken, newPassword }),
    });
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ): Promise<ApiResponse> => {
    return apiFetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword,
      }),
    });
  },

  adminResetPassword: async (
    emailAddress: string,
    newPassword: string,
  ): Promise<ApiResponse> => {
    return apiFetch("/auth/admin-reset-password", {
      method: "POST",
      body: JSON.stringify({ emailAddress, newPassword }),
    });
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<
    ApiResponse<{
      auditLogs: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>
  > => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/auth${query ? `?${query}` : ""}`);
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  clearAuth: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// User Service
export const userService = {
  createUser: async (
    data: Omit<CreateUserRequest, "firstName" | "lastName"> & {
      fullName: string;
      Department: string;
      email: string;
      password: string;
      role: string;
      phoneNumber: string;
      status?: string;
      organization?: string;
    },
  ): Promise<ApiResponse<CreateUserResponse>> => {
    // FIXED: Match backend exactly - send only required fields, derive firstName in backend
    const {
      fullName,
      Department,
      email,
      password,
      role,
      phoneNumber,
      status,
      organization,
    } = data;
    const payload = {
      fullName,
      Department,
      email,
      password,
      role,
      phoneNumber,
      status,
      organization,
    }; // Omit firstName/lastName

    const response = await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // Handle both nested and flat responses
    const token = response.data?.token || response.token;
    const userData = response.data?.user || response.user;
    if (token && userData) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    return response;
  },

  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }): Promise<
    ApiResponse<{
      users: User[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > => {
    // UPDATED: Always include a high limit (100) to fetch all users if not specified
    const effectiveParams = {
      ...params,
      limit: params?.limit ?? 100, // Default to 100 for full fetch
      page: params?.page ?? 1,
    };
    const query = new URLSearchParams(effectiveParams as any).toString();
    console.log("getAllUsers Query:", query); // Debug: Log the full query
    return apiFetch(`/users${query ? `?${query}` : ""}`);
  },

  getUserById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    return apiFetch(`/users/${id}`);
  },

  updateUser: async (
    id: string,
    data: Partial<CreateUserRequest>,
  ): Promise<ApiResponse<{ user: User }>> => {
    return apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  // In src/lib/api.ts - Add/Replace in userService
  // selfUpdateProfile: async (
  //   data: Partial<CreateUserRequest>
  // ): Promise<ApiResponse<{ user: User }>> => {
  //   return apiFetch("/users/profile", {
  //     // Matches backend route: PUT /users/profile
  //     method: "PUT", // Or "PATCH" if backend expects it
  //     body: JSON.stringify(data),
  //   });
  // },
  selfUpdateProfile: async (
    data: Partial<CreateUserRequest> | FormData,
  ): Promise<ApiResponse<{ user: User }>> => {
    return apiFetch("/users/profile", {
      method: "PATCH", // ← Changed to PATCH (this fixes the 404)
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/users/${id}`, { method: "DELETE" });
  },

  getUserMetrics: async (): Promise<ApiResponse<{ metrics: UserMetrics }>> => {
    return apiFetch("/users/metrics");
  },

  resetUserPassword: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/users/${id}/reset-password`, {
      method: "POST",
    });
  },

  deactivateUser: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/users/${id}/deactivate`, { method: "PATCH" });
  },

  // Role Management
  createRole: async (data: {
    name: string;
    description: string;
    permissions: any;
  }): Promise<
    ApiResponse<{ role: any; usersAssigned: number; totalPermissions: number }>
  > => {
    return apiFetch("/users/roles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAllRoles: async (): Promise<ApiResponse<{ roles: any[] }>> => {
    return apiFetch("/users/roles");
  },

  updateRole: async (
    id: string,
    data: Partial<{ name: string; description: string; permissions: any }>,
  ): Promise<ApiResponse<{ role: any }>> => {
    return apiFetch(`/users/roles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteRole: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/users/roles/${id}`, { method: "DELETE" });
  },
};

// // FULLY COMPLETE DOCUMENT SERVICE
// export const documentService = {
//   // Per organization (legacy)
//   getDocumentsByOrg: async (
//     orgId: string,
//     params?: {
//       page?: number;
//       limit?: number;
//       search?: string;
//       documentType?: string;
//     },
//   ) => {
//     const query = new URLSearchParams(params as any).toString();
//     return apiFetch(`/documents/${orgId}/documents${query ? `?${query}` : ""}`);
//   },

//   // GLOBAL FAST DOCUMENTS — THIS IS YOUR WINNER
//   getAllDocuments: async (params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     documentType?: string;
//   }) => {
//     const query = new URLSearchParams();
//     if (params?.page) query.append("page", params.page.toString());
//     if (params?.limit) query.append("limit", params.limit.toString());
//     if (params?.search) query.append("search", params.search);
//     if (params?.documentType && params.documentType !== "all")
//       query.append("documentType", params.documentType);

//     return apiFetch(
//       `/documents/documents${query.toString() ? `?${query.toString()}` : ""}`,
//     );
//   },

//   // ADDED: Document Metrics (for Dashboard Stats)
//   getDocumentMetrics: async (): Promise<
//     ApiResponse<{ metrics: DocumentMetrics }>
//   > => {
//     return apiFetch("/documents/metrics"); // SuperAdmin sees global metrics
//   },

//   // ADDED: Global Alerts (expiry + new uploads)
//   getGlobalExpiryAlerts: async (): Promise<
//     ApiResponse<{ alerts: Alert[] }>
//   > => {
//     return apiFetch("/documents/global-alerts");
//   },
//   // Public form submission (no token required)
//   // Public form submission (no token required) - CORRECT PATH
//   submitPublicSchoolVisitReport: async (formData: FormData) => {
//     const response = await fetch(
//       `${BASE_URL}/documents/public/school-visit-report`,
//       {
//         method: "POST",
//         body: formData,
//       },
//     );

//     if (!response.ok) {
//       const error = await response.json().catch(() => ({}));
//       throw new Error(error.message || "Failed to submit report");
//     }
//     return response.json();
//   },
//   getSchoolVisitReports: async () => {
//     const response = await apiFetch("/documents/school-visit-reports");
//     return response.data; // ← this is the clean array your browser page expects
//   },
//   //
//   uploadDocument: async (
//     orgId: string,
//     file: File,
//     name: string,
//     type: string,
//     startDate?: string,
//     expiryDate?: string,
//     negotiatedAmount?: number,
//   ) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentName", name.trim());
//     formData.append("documentType", type);
//     if (startDate) formData.append("startDate", startDate);
//     if (expiryDate) formData.append("expiryDate", expiryDate);
//     if (negotiatedAmount !== undefined && negotiatedAmount !== null)
//       formData.append("negotiatedAmount", negotiatedAmount.toString());

//     return apiUpload(`/documents/${orgId}/upload`, formData);
//   },

//   downloadDocument: async (id: string, filename?: string): Promise<void> => {
//     const blob = await apiDownload(`/documents/download/${id}`);
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename || "document.pdf";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   },

//   deleteDocument: async (id: string) =>
//     apiFetch(`/documents/${id}`, { method: "DELETE" }),

//   updateDocument: async (
//     id: string,
//     data: {
//       name?: string;
//       documentType?: string;
//       negotiatedAmount?: number;
//       startDate?: string;
//       expiryDate?: string;
//     },
//   ) =>
//     apiFetch(`/documents/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     }),

//   approveDocument: async (id: string) =>
//     apiFetch(`/documents/${id}/approve`, { method: "POST" }),

//   getDocumentsByUser: async (userId: string) =>
//     apiFetch(`/documents/user/${userId}`),

//   getNotifications: async (orgId: string) =>
//     apiFetch(`/documents/notifications/${orgId}`),

//   getContractExpiryAlerts: async (orgId: string) =>
//     apiFetch(`/documents/alerts/${orgId}`),

//   getEnhancedContractExpiryAlerts: async (orgId: string) =>
//     apiFetch(`/documents/enhanced-alerts/${orgId}`),
// };

// FULLY COMPLETE DOCUMENT SERVICE (with Invoice & Receipt support)
export const documentService = {
  // Per organization (legacy)
  getDocumentsByOrg: async (
    orgId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      documentType?: string;
    },
  ) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/documents/${orgId}/documents${query ? `?${query}` : ""}`);
  },

  // GLOBAL FAST DOCUMENTS
  getAllDocuments: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    documentType?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    if (params?.documentType && params.documentType !== "all")
      query.append("documentType", params.documentType);

    return apiFetch(
      `/documents/documents${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },

  // NEW: Dedicated Invoice & Receipt methods
  uploadInvoice: async (
    paymentId: string,
    file: File,
    documentName: string,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", documentName.trim());

    return apiUpload(`/documents/payments/${paymentId}/invoice`, formData);
  },

  uploadReceipt: async (
    paymentId: string,
    file: File,
    documentName: string,
    paymentReference?: string,
    paymentMethod?: "Transfer" | "Cash" | "POS",
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", documentName.trim());
    if (paymentReference) formData.append("paymentReference", paymentReference);
    if (paymentMethod) formData.append("paymentMethod", paymentMethod);

    return apiUpload(`/documents/payments/${paymentId}/receipt`, formData);
  },
  // ✅ NEW: Public Quick Invoice (exactly as requested)
  submitPublicQuickInvoice: async (data: any) => {
    const response = await fetch(`${BASE_URL}/documents/public-quick-invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create invoice");
    }
    return response.json();
  },
  // ✅ NEW: Get active officers for dropdown
  getActiveOfficers: async () => {
    return apiFetch("/documents/officers");
  },
  // Public form submission
  submitPublicSchoolVisitReport: async (formData: FormData) => {
    const response = await fetch(
      `${BASE_URL}/documents/public/school-visit-report`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to submit report");
    }
    return response.json();
  },

  getSchoolVisitReports: async () => {
    const response = await apiFetch("/documents/school-visit-reports");
    return response.data;
  },

  // Existing methods (kept unchanged)
  getDocumentMetrics: async (): Promise<
    ApiResponse<{ metrics: DocumentMetrics }>
  > => {
    return apiFetch("/documents/metrics");
  },

  getGlobalExpiryAlerts: async (): Promise<
    ApiResponse<{ alerts: Alert[] }>
  > => {
    return apiFetch("/documents/global-alerts");
  },

  uploadDocument: async (
    orgId: string,
    file: File,
    name: string,
    type: string,
    startDate?: string,
    expiryDate?: string,
    negotiatedAmount?: number,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", name.trim());
    formData.append("documentType", type);
    if (startDate) formData.append("startDate", startDate);
    if (expiryDate) formData.append("expiryDate", expiryDate);
    if (negotiatedAmount !== undefined && negotiatedAmount !== null)
      formData.append("negotiatedAmount", negotiatedAmount.toString());

    return apiUpload(`/documents/${orgId}/upload`, formData);
  },

  downloadDocument: async (id: string, filename?: string): Promise<void> => {
    const blob = await apiDownload(`/documents/download/${id}`);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  deleteDocument: async (id: string) =>
    apiFetch(`/documents/${id}`, { method: "DELETE" }),

  updateDocument: async (
    id: string,
    data: {
      name?: string;
      documentType?: string;
      negotiatedAmount?: number;
      startDate?: string;
      expiryDate?: string;
    },
  ) =>
    apiFetch(`/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  approveDocument: async (id: string) =>
    apiFetch(`/documents/${id}/approve`, { method: "POST" }),

  getDocumentsByUser: async (userId: string) =>
    apiFetch(`/documents/user/${userId}`),

  getNotifications: async (orgId: string) =>
    apiFetch(`/documents/notifications/${orgId}`),

  getContractExpiryAlerts: async (orgId: string) =>
    apiFetch(`/documents/alerts/${orgId}`),
  // ====================== EXECUTIVE REPORTING DASHBOARD ======================
  // ====================== EXECUTIVE REPORTING DASHBOARD ======================
  getDashboardMetrics: async (): Promise<any> => {
    return apiFetch("/documents/dashboard/metrics"); // ← CHANGED to match your document router
  },

  getEnhancedContractExpiryAlerts: async (orgId: string) =>
    apiFetch(`/documents/enhanced-alerts/${orgId}`),
};
// export const documentService = {
//   getDocumentsByOrg: async (
//     orgId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<
//     ApiResponse<{
//       documents: Document[];
//       total: number;
//       page: number;
//       totalPages: number;
//     }>
//   > => {
//     const query = new URLSearchParams(params as any).toString();
//     return apiFetch(`/documents/${orgId}/documents${query ? `?${query}` : ""}`);
//   },
//   getAllDocuments: async (params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//     documentType?: string;
//   }): Promise<
//     ApiResponse<{
//       documents: Document[];
//       total: number;
//       page: number;
//       totalPages: number;
//     }>
//   > => {
//     const query = new URLSearchParams(params as any).toString();
//     return apiFetch(`/documents/documents${query ? `?${query}` : ""}`);
//   },

//   uploadDocument: async (
//     orgId: string,
//     file: File,
//     name: string,
//     type: string,
//     startDate?: string,
//     expiryDate?: string,
//     negotiatedAmount?: number // NEW: Optional negotiated amount
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentName", name);
//     formData.append("documentType", type);
//     if (startDate) formData.append("startDate", startDate);
//     if (expiryDate) formData.append("expiryDate", expiryDate);
//     if (negotiatedAmount !== undefined && negotiatedAmount !== null) {
//       formData.append("negotiatedAmount", negotiatedAmount.toString());
//     }

//     return apiUpload(`/documents/${orgId}/upload`, formData);
//   },

//   downloadDocument: async (id: string, filename?: string): Promise<void> => {
//     try {
//       const blob = await apiDownload(`/documents/download/${id}`);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = filename || "document.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       throw error;
//     }
//   },

//   deleteDocument: async (id: string): Promise<ApiResponse> => {
//     return apiFetch(`/documents/${id}`, { method: "DELETE" });
//   },

//   updateDocument: async (
//     id: string,
//     data: { name?: string; documentType?: string; negotiatedAmount?: number } // NEW: Add negotiatedAmount to update
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     return apiFetch(`/documents/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     });
//   },

//   approveDocument: async (
//     id: string
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     return apiFetch(`/documents/${id}/approve`, { method: "POST" });
//   },

//   getDocumentsByUser: async (
//     userId: string
//   ): Promise<ApiResponse<{ documents: Document[] }>> => {
//     return apiFetch(`/documents/user/${userId}`);
//   },

//   getDocumentMetrics: async (
//     orgId: string
//   ): Promise<
//     ApiResponse<{
//       metrics: DocumentMetrics;
//     }>
//   > => {
//     return apiFetch(`/documents/metrics/${orgId}`);
//   },

//   getNotifications: async (
//     orgId: string
//   ): Promise<ApiResponse<{ notifications: any[] }>> => {
//     return apiFetch(`/documents/notifications/${orgId}`);
//   },

//   getContractExpiryAlerts: async (
//     orgId: string
//   ): Promise<ApiResponse<{ alerts: any[] }>> => {
//     return apiFetch(`/documents/alerts/${orgId}`);
//   },

//   getEnhancedContractExpiryAlerts: async (
//     orgId: string
//   ): Promise<ApiResponse<{ alerts: Alert[] }>> => {
//     return apiFetch(`/documents/enhanced-alerts/${orgId}`);
//   },

//   getGlobalExpiryAlerts: async (): Promise<
//     ApiResponse<{ alerts: Alert[] }>
//   > => {
//     return apiFetch(`/documents/global-alerts`);
//   },
// };
// // Document Service
// export const documentService = {
//   getDocumentsByOrg: async (
//     orgId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<
//     ApiResponse<{
//       documents: Document[];
//       total: number;
//       page: number;
//       totalPages: number;
//     }>
//   > => {
//     const query = new URLSearchParams(params as any).toString();
//     return apiFetch(`/documents/${orgId}/documents${query ? `?${query}` : ""}`);
//   },

//   uploadDocument: async (
//     orgId: string,
//     file: File,
//     name: string,
//     type: string,
//     startDate?: string,
//     expiryDate?: string
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("documentName", name);
//     formData.append("documentType", type);
//     if (startDate) formData.append("startDate", startDate);
//     if (expiryDate) formData.append("expiryDate", expiryDate);

//     return apiUpload(`/documents/${orgId}/upload`, formData);
//   },

//   downloadDocument: async (id: string, filename?: string): Promise<void> => {
//     try {
//       const blob = await apiDownload(`/documents/download/${id}`);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = filename || "document.pdf";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//       throw error;
//     }
//   },

//   deleteDocument: async (id: string): Promise<ApiResponse> => {
//     return apiFetch(`/documents/${id}`, { method: "DELETE" });
//   },

//   updateDocument: async (
//     id: string,
//     data: { name?: string; documentType?: string }
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     return apiFetch(`/documents/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     });
//   },

//   approveDocument: async (
//     id: string
//   ): Promise<ApiResponse<{ document: Document }>> => {
//     return apiFetch(`/documents/${id}/approve`, { method: "POST" });
//   },

//   getDocumentsByUser: async (
//     userId: string
//   ): Promise<ApiResponse<{ documents: Document[] }>> => {
//     return apiFetch(`/documents/user/${userId}`);
//   },

//   getDocumentMetrics: async (
//     orgId: string
//   ): Promise<
//     ApiResponse<{
//       metrics: DocumentMetrics;
//     }>
//   > => {
//     return apiFetch(`/documents/metrics/${orgId}`);
//   },

//   getNotifications: async (
//     orgId: string
//   ): Promise<ApiResponse<{ notifications: any[] }>> => {
//     return apiFetch(`/documents/notifications/${orgId}`);
//   },

//   getContractExpiryAlerts: async (
//     orgId: string
//   ): Promise<ApiResponse<{ alerts: any[] }>> => {
//     return apiFetch(`/documents/alerts/${orgId}`);
//   },

//   getEnhancedContractExpiryAlerts: async (
//     orgId: string
//   ): Promise<ApiResponse<{ alerts: Alert[] }>> => {
//     return apiFetch(`/documents/enhanced-alerts/${orgId}`);
//   },

//   getGlobalExpiryAlerts: async (): Promise<
//     ApiResponse<{ alerts: Alert[] }>
//   > => {
//     return apiFetch(`/documents/global-alerts`);
//   },
// };

// Organization Service
export const organizationService = {
  getOrganizations: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<
    ApiResponse<{
      organizations: Organization[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/organizations${query ? `?${query}` : ""}`);
  },

  getOrganization: async (
    id: string,
  ): Promise<ApiResponse<{ organization: Organization }>> => {
    return apiFetch(`/organizations/${id}`);
  },

  createOrganization: async (data: {
    name: string;
    organizationType: string;
  }): Promise<ApiResponse<{ organization: Organization }>> => {
    return apiFetch("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateOrganization: async (
    id: string,
    data: Partial<{ name: string; organizationType: string }>,
  ): Promise<ApiResponse<{ organization: Organization }>> => {
    return apiFetch(`/organizations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteOrganization: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/organizations/${id}`, { method: "DELETE" });
  },

  getOrganizationMetrics: async (): Promise<
    ApiResponse<{ metrics: OrganizationMetrics }>
  > => {
    return apiFetch("/organizations/metrics");
  },
};
