// // // // src/types/index.ts
// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // export interface ApiResponse<T = any> {
// // //   status: "success" | "error";
// // //   statusCode: number;
// // //   message: string;
// // //   data: T;
// // // }

// // // export interface AuthResponse {
// // //   token: string;
// // //   user: User;
// // // }

// // // export interface User {
// // //   _id: string;
// // //   fullName: string;
// // //   email: string;
// // //   role: { _id: string; name: string; permissions: any };
// // //   organization: string | null;
// // //   status: "Active" | "InActive";
// // // }

// // // export interface Document {
// // //   _id: string;
// // //   name: string;
// // //   documentType: "Contract" | "SLA" | "NDA" | "Other";
// // //   fileUrl: string;
// // //   organization: string;
// // //   uploadedBy: string;
// // //   accessCount: number;
// // //   createdAt: string;
// // // }

// // // export interface Organization {
// // //   _id: string;
// // //   name: string;
// // //   organizationType: string;
// // //   documentCount?: number;
// // // }

// // // export interface UserMetrics {
// // //   totalUsers: number;
// // //   adminUsers?: number;
// // // }

// // // export interface OrganizationMetrics {
// // //   totalOrganizations: number;
// // // }

// // // export interface DocumentMetrics {
// // //   mostPopular: Document[];
// // //   newReports: Document[];
// // //   accessedReports: Document[];
// // //   othersReports: Document[];
// // // }

// // // export interface CreateUserRequest {
// // //   fullName: string;
// // //   firstName?: string;
// // //   lastName?: string;
// // //   Department: string;
// // //   email: string;
// // //   password: string;
// // //   role: string;
// // //   phoneNumber: string;
// // //   status?: "Active" | "InActive";
// // //   organization?: string;
// // // }

// // // export interface CreateUserResponse {
// // //   message: string;
// // //   token: string;
// // //   user: User;
// // // }

// // // export interface Alert {
// // //   _id: string;
// // //   name: string;
// // //   documentType: string;
// // //   uploadedBy: string;
// // //   expiryDate: string;
// // // }

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
// //   accessCount?: number;
// //   createdAt: string;
// //   isApproved: boolean;
// //   approvedBy?: string;
// //   startDate?: string;
// //   expiryDate?: string;
// //   sizeMB?: number;
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
// //   expiryDate?: string;
// //   createdAt?: string;
// //   daysToExpiry?: number;
// //   daysSinceUpload?: number;
// //   flagColor: string;
// //   alertType: "expiry" | "new-upload";
// // }

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

// // Define Permissions interface for strict typing
// export interface Permissions {
//   DocumentManagement?: {
//     viewDocuments?: boolean;
//     uploadDocuments?: boolean;
//     editDocuments?: boolean;
//     deleteDocuments?: boolean;
//     approveDocuments?: boolean;
//   };
//   UserManagement?: {
//     viewUsers?: boolean;
//     createUsers?: boolean;
//     editUsers?: boolean;
//     deleteUsers?: boolean;
//     manageUserRoles?: boolean;
//   };
//   OrganizationManagement?: {
//     viewOrganizations?: boolean;
//     createOrganizations?: boolean;
//     editOrganizations?: boolean;
//     deleteOrganizations?: boolean;
//   };
// }

// // UPDATED: Simplified User interface for role users (without full role object, as it's for display)
// export interface RoleUser {
//   _id: string;
//   fullName: string;
//   email: string;
//   Department: string;
//   organization: string | null;
// }

// // NEW: Role interface with users array
// export interface Role {
//   _id: string;
//   name: string;
//   description: string;
//   permissions: Permissions;
//   createdBy?: string | null;
//   createdAt: string;
//   __v: number;
//   usersAssigned: number;
//   users: RoleUser[]; // Array of users assigned to this role
//   totalPermissions: number;
// }

// // UPDATED: User interface (role is populated with full Role details)
// export interface User {
//   _id: string;
//   fullName: string;
//   email: string;
//   role: Role; // UPDATED: Use full Role type
//   organization: string | null;
//   status: "Active" | "InActive";
//   Department?: string; // ADDED: For consistency with backend
//   phoneNumber?: string;
//   // Add other fields as needed
// }

// export interface Document {
//   _id: string;
//   name: string;
//   documentType: "Contract" | "SLA" | "NDA" | "Other";
//   fileUrl: string;
//   organization: string;
//   uploadedBy: string; // Clarified: This is a user ID
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
  documents: Document[];
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Define Permissions interface for strict typing
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

// UPDATED: Simplified User interface for role users (without full role object, as it's for display)
export interface RoleUser {
  _id: string;
  fullName: string;
  email: string;
  Department: string;
  organization: string | null;
}

// NEW: Role interface with users array
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: Permissions;
  createdBy?: string | null;
  createdAt: string;
  __v: number;
  usersAssigned: number;
  users: RoleUser[]; // Array of users assigned to this role
  totalPermissions: number;
}

// UPDATED: User interface (role is populated with full Role details) - Added missing fields for profile editing
export interface User {
  username: string;
  _id: string;
  fullName: string;
  firstName?: string; // ADDED: For first name
  lastName?: string; // ADDED: For last name
  email: string;
  role: Role; // UPDATED: Use full Role type
  organization: string | null;
  status: "Active" | "InActive";
  Department?: string; // ADDED: For consistency with backend
  phoneNumber?: string;
  profilePicture?: string; // ADDED: For profile picture URL
  jobTitle?: string; // ADDED: For job title
  location?: string; // ADDED: For location
  timezone?: string; // ADDED: For timezone
  language?: string; // ADDED: For language code (e.g., "en")
  dateFormat?: string; // ADDED: For date format preference
  // Add other fields as needed
}

export interface Document {
  uploadDate: string;
  _id: string;
  name: string;
  documentType: "Contract" | "SLA" | "NDA" | "Other";
  fileUrl: string;
  organization: string;
  uploadedBy: string; // Clarified: This is a user ID
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

// NEW: Add Notification interface (imported but not defined earlier)
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
  relatedId?: string; // e.g., document or user ID
}
