// // // src/types/index.ts
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // export interface ApiResponse<T = any> {
// //   status: "success" | "error";
// //   statusCode: number;
// //   message: string;
// //   data: T;
// // }

// // export interface AuthResponse {
// //   token: string;
// //   user: User;
// // }

// // export interface User {
// //   _id: string;
// //   fullName: string;
// //   email: string;
// //   role: { _id: string; name: string; permissions: any };
// //   organization: string | null;
// //   status: "Active" | "InActive";
// // }

// // export interface Document {
// //   _id: string;
// //   name: string;
// //   documentType: "Contract" | "SLA" | "NDA" | "Other";
// //   fileUrl: string;
// //   organization: string;
// //   uploadedBy: string;
// //   accessCount: number;
// //   createdAt: string;
// // }

// // export interface Organization {
// //   _id: string;
// //   name: string;
// //   organizationType: string;
// //   documentCount?: number;
// // }

// // export interface UserMetrics {
// //   totalUsers: number;
// //   adminUsers?: number;
// // }

// // export interface OrganizationMetrics {
// //   totalOrganizations: number;
// // }

// // export interface DocumentMetrics {
// //   mostPopular: Document[];
// //   newReports: Document[];
// //   accessedReports: Document[];
// //   othersReports: Document[];
// // }

// // export interface CreateUserRequest {
// //   fullName: string;
// //   firstName?: string;
// //   lastName?: string;
// //   Department: string;
// //   email: string;
// //   password: string;
// //   role: string;
// //   phoneNumber: string;
// //   status?: "Active" | "InActive";
// //   organization?: string;
// // }

// // export interface CreateUserResponse {
// //   message: string;
// //   token: string;
// //   user: User;
// // }

// // export interface Alert {
// //   _id: string;
// //   name: string;
// //   documentType: string;
// //   uploadedBy: string;
// //   expiryDate: string;
// // }


// // src/types/index.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
// export interface ApiResponse<T = any> {
//   status: "success" | "error";
//   statusCode: number;
//   message: string;
//   data: T;
// }

// export interface AuthResponse {
//   token: string;
//   user: User;
// }

// export interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   role: { _id: string; name: string; permissions: any };
//   organization: string | null;
//   status: "Active" | "InActive";
// }

// export interface Document {
//   _id: string;
//   name: string;
//   documentType: "Contract" | "SLA" | "NDA" | "Other";
//   fileUrl: string;
//   organization: string;
//   uploadedBy: string;
//   accessCount?: number;
//   createdAt: string;
//   isApproved: boolean;
//   approvedBy?: string;
//   startDate?: string;
//   expiryDate?: string;
//   sizeMB?: number;
// }

// export interface Organization {
//   _id: string;
//   name: string;
//   organizationType: string;
//   documentCount?: number;
// }

// export interface UserMetrics {
//   totalUsers: number;
//   adminUsers?: number;
// }

// export interface OrganizationMetrics {
//   totalOrganizations: number;
// }

// export interface DocumentMetrics {
//   mostPopular: Document[];
//   newReports: Document[];
//   accessedReports: Document[];
//   othersReports: Document[];
// }

// export interface CreateUserRequest {
//   fullName: string;
//   firstName?: string;
//   lastName?: string;
//   Department: string;
//   email: string;
//   password: string;
//   role: string;
//   phoneNumber: string;
//   status?: "Active" | "InActive";
//   organization?: string;
// }

// export interface CreateUserResponse {
//   message: string;
//   token: string;
//   user: User;
// }

// export interface Alert {
//   _id: string;
//   name: string;
//   documentType: string;
//   uploadedBy: string;
//   expiryDate?: string;
//   createdAt?: string;
//   daysToExpiry?: number;
//   daysSinceUpload?: number;
//   flagColor: string;
//   alertType: "expiry" | "new-upload";
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// NEW: Define Permissions interface for strict typing
export interface Permissions {
  DocumentManagement?: {
    viewDocuments?: boolean;
    uploadDocuments?: boolean;
    editDocuments?: boolean;
    deleteDocuments?: boolean;
    approveDocuments?: boolean;
  };
  UserManagement?: {
    viewUsers?: boolean;
    createUsers?: boolean;
    editUsers?: boolean;
    deleteUsers?: boolean;
    manageUserRoles?: boolean;
  };
  OrganizationManagement?: {
    viewOrganizations?: boolean;
    createOrganizations?: boolean;
    editOrganizations?: boolean;
    deleteOrganizations?: boolean;
  };
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: { _id: string; name: string; permissions: Permissions };
  organization: string | null;
  status: "Active" | "InActive";
}

export interface Document {
  _id: string;
  name: string;
  documentType: "Contract" | "SLA" | "NDA" | "Other";
  fileUrl: string;
  organization: string;
  uploadedBy: string; // CHANGED: Clarify this is a user ID
  accessCount?: number;
  createdAt: string;
  isApproved: boolean;
  approvedBy?: string;
  startDate?: string;
  expiryDate?: string;
  sizeMB?: number;
}

export interface Organization {
  _id: string;
  name: string;
  organizationType: string;
  documentCount?: number;
}

export interface UserMetrics {
  totalUsers: number;
  adminUsers?: number;
}

export interface OrganizationMetrics {
  totalOrganizations: number;
}

export interface DocumentMetrics {
  mostPopular: Document[];
  newReports: Document[];
  accessedReports: Document[];
  othersReports: Document[];
}

export interface CreateUserRequest {
  fullName: string;
  firstName?: string;
  lastName?: string;
  Department: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  status?: "Active" | "InActive";
  organization?: string;
}

export interface CreateUserResponse {
  message: string;
  token: string;
  user: User;
}

export interface Alert {
  _id: string;
  name: string;
  documentType: string;
  uploadedBy: string;
  expiryDate?: string;
  createdAt?: string;
  daysToExpiry?: number;
  daysSinceUpload?: number;
  flagColor: string;
  alertType: "expiry" | "new-upload";
}