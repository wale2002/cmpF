// // /* eslint-disable react-refresh/only-export-components */
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // import {
// // //   createContext,
// // //   useContext,
// // //   useState,
// // //   useEffect,
// // //   type ReactNode,
// // // } from "react";
// // // import { authService } from "../lib/api";
// // // import type { User, ApiResponse } from "../types";

// // // interface AuthContextType {
// // //   user: User | null;
// // //   isLoading: boolean;
// // //   isAuthenticated: boolean;
// // //   login: (email: string, password: string) => Promise<void>;
// // //   logout: () => Promise<void>;
// // //   isAdmin: boolean;  // Computed admin status
// // // }

// // // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// // //   const [user, setUser] = useState<User | null>(null);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// // //   const getIsAdmin = (u: User | null) => {
// // //     if (!u?.role) return false;
// // //     const roleName = u.role.name?.toLowerCase() || '';
// // //     const roleId = u.role._id;
// // //     return ['admin', 'superadmin'].includes(roleName) ||
// // //            roleId === '68de5b12e16c2d1d59b09738';  // Known superAdmin ID
// // //   };

// // //   useEffect(() => {
// // //     const initializeAuth = async () => {
// // //       setIsLoading(true);
// // //       try {
// // //         if (authService.isAuthenticated()) {
// // //           const response = await authService.getMe();
// // //           let userData = response.data?.user || response.user;
// // //           if (userData) {
// // //             // Enhanced fallback (logs for debug)
// // //             if (!userData.role || typeof userData.role === 'string') {
// // //               console.warn("Role is null/ID, attempting fallback", { role: userData.role });
// // //               if (userData.role === '68de5b12e16c2d1d59b09738') {
// // //                 userData.role = { _id: userData.role, name: 'superAdmin' };
// // //                 console.log("Fallback: Mocked role to superAdmin");
// // //               } else if (!userData.role) {
// // //                 console.error("Role is null—check DB/user creation");
// // //                 // Optionally: Redirect to admin panel to assign role
// // //               }
// // //             }
// // //             // NEW: Handle organization optional - do not throw error if null
// // //             if (!userData.organization) {
// // //               console.warn("User has no organization assigned. Proceeding with null organization.");
// // //               // Do not throw error; allow null organization for users without org
// // //             }
// // //             setUser(userData);
// // //             setIsAuthenticated(true);
// // //             console.log("Auth init success:", { role: userData.role?.name || userData.role }); // Debug
// // //           } else {
// // //             console.warn("No user data in getMe response");
// // //           }
// // //         }
// // //       } catch (error: any) {
// // //         // FIXED: Handle specific organization error gracefully
// // //         if (error.message?.includes("no organization assigned")) {
// // //           console.warn("User has no organization assigned. Proceeding without org assignment.");
// // //           // Optionally, fetch user without org requirement or set default
// // //           // For now, clear auth and prompt login
// // //           authService.clearAuth();
// // //           setIsAuthenticated(false);
// // //         } else {
// // //           console.error("Auth init error:", error);
// // //           authService.clearAuth();
// // //         }
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };
// // //     initializeAuth();
// // //   }, []);

// // //   const login = async (email: string, password: string) => {
// // //     try {
// // //       const response = await authService.login(email, password);
// // //       let userData = response.data?.user || response.user;
// // //       if (userData) {
// // //         // Enhanced fallback (logs for debug)
// // //         if (!userData.role || typeof userData.role === 'string') {
// // //           console.warn("Role is null/ID on login, attempting fallback", { role: userData.role });
// // //           if (userData.role === '68de5b12e16c2d1d59b09738') {
// // //             userData.role = { _id: userData.role, name: 'superAdmin' };
// // //             console.log("Fallback: Mocked role to superAdmin on login");
// // //           } else if (!userData.role) {
// // //             console.error("Role is null on login—check DB/user creation");
// // //           }
// // //         }
// // //         // NEW: Handle organization optional - do not throw error if null
// // //         if (!userData.organization) {
// // //           console.warn("User has no organization assigned during login. Proceeding with null.");
// // //         }
// // //         setUser(userData);
// // //         setIsAuthenticated(true);
// // //         console.log("Login role:", userData.role?.name || userData.role); // Debug
// // //       }
// // //     } catch (error: any) {
// // //       // FIXED: Handle specific organization error gracefully
// // //       if (error.message?.includes("no organization assigned")) {
// // //         console.warn("User has no organization assigned during login. Please contact support to assign one.");
// // //         throw new Error("User has no organization assigned. Please contact support.");
// // //       }
// // //       console.error("Login error:", error);
// // //       throw error;
// // //     }
// // //   };

// // //   const logout = async () => {
// // //     await authService.logout();
// // //     setUser(null);
// // //     setIsAuthenticated(false);
// // //   };

// // //   const isAdmin = getIsAdmin(user);

// // //   return (
// // //     <AuthContext.Provider
// // //       value={{ user, isLoading, isAuthenticated, login, logout, isAdmin }}
// // //     >
// // //       {children}
// // //     </AuthContext.Provider>
// // //   );
// // // };

// // // export const useAuthContext = () => {
// // //   const context = useContext(AuthContext);
// // //   if (context === undefined) {
// // //     throw new Error("useAuthContext must be used within an AuthProvider");
// // //   }
// // //   return context;
// // // };

// // import {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   type ReactNode,
// // } from "react";
// // import { authService } from "../lib/api"; // FIXED: Path adjustment if needed
// // import type { User } from "../types"; // FIXED: Removed unused ApiResponse

// // interface AuthContextType {
// //   user: User | null;
// //   isLoading: boolean;
// //   isAuthenticated: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => Promise<void>;
// //   isAdmin: boolean; // Computed admin status
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   const getIsAdmin = (u: User | null) => {
// //     if (!u?.role) return false;
// //     const roleName = u.role.name?.toLowerCase() || "";
// //     const roleId = u.role._id;
// //     return (
// //       ["admin", "superadmin"].includes(roleName) ||
// //       roleId === "68de5b12e16c2d1d59b09738"
// //     ); // Known superAdmin ID
// //   };

// //   useEffect(() => {
// //     const initializeAuth = async () => {
// //       setIsLoading(true);
// //       try {
// //         if (authService.isAuthenticated()) {
// //           const response = await authService.getMe(); // Assume returns ApiResponse<User>
// //           const userData = response.data.user; // FIXED: Direct access
// //           if (userData) {
// //             // Enhanced fallback (logs for debug)
// //             if (!userData.role || typeof userData.role === "string") {
// //               console.warn("Role is null/ID, attempting fallback", {
// //                 role: userData.role,
// //               });
// //               if (userData.role === "68de5b12e16c2d1d59b09738") {
// //                 userData.role = { _id: userData.role, name: "superAdmin" };
// //                 console.log("Fallback: Mocked role to superAdmin");
// //               } else if (!userData.role) {
// //                 console.error("Role is null—check DB/user creation");
// //                 // Optionally: Redirect to admin panel to assign role
// //               }
// //             }
// //             // NEW: Handle organization optional - do not throw error if null
// //             if (!userData.organization) {
// //               console.warn(
// //                 "User has no organization assigned. Proceeding with null organization."
// //               );
// //               // Do not throw error; allow null organization for users without org
// //             }
// //             setUser(userData);
// //             setIsAuthenticated(true);
// //             console.log("Auth init success:", {
// //               role: userData.role?.name || userData.role,
// //             }); // Debug
// //           } else {
// //             console.warn("No user data in getMe response");
// //           }
// //         }
// //       } catch (error: any) {
// //         // FIXED: Handle specific organization error gracefully
// //         if (error.message?.includes("no organization assigned")) {
// //           console.warn(
// //             "User has no organization assigned. Proceeding without org assignment."
// //           );
// //           // Optionally, fetch user without org requirement or set default
// //           // For now, clear auth and prompt login
// //           authService.clearAuth();
// //           setIsAuthenticated(false);
// //         } else {
// //           console.error("Auth init error:", error);
// //           authService.clearAuth();
// //         }
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     initializeAuth();
// //   }, []);

// //   const login = async (email: string, password: string) => {
// //     try {
// //       const response = await authService.login(email, password); // Assume ApiResponse<AuthResponse>
// //       const userData = response.data.user; // FIXED: Direct access
// //       if (userData) {
// //         // Enhanced fallback (logs for debug)
// //         if (!userData.role || typeof userData.role === "string") {
// //           console.warn("Role is null/ID on login, attempting fallback", {
// //             role: userData.role,
// //           });
// //           if (userData.role === "68de5b12e16c2d1d59b09738") {
// //             userData.role = { _id: userData.role, name: "superAdmin" };
// //             console.log("Fallback: Mocked role to superAdmin on login");
// //           } else if (!userData.role) {
// //             console.error("Role is null on login—check DB/user creation");
// //           }
// //         }
// //         // NEW: Handle organization optional - do not throw error if null
// //         if (!userData.organization) {
// //           console.warn(
// //             "User has no organization assigned during login. Proceeding with null."
// //           );
// //         }
// //         setUser(userData);
// //         setIsAuthenticated(true);
// //         console.log("Login role:", userData.role?.name || userData.role); // Debug
// //       }
// //     } catch (error: any) {
// //       // FIXED: Handle specific organization error gracefully
// //       if (error.message?.includes("no organization assigned")) {
// //         console.warn(
// //           "User has no organization assigned during login. Please contact support to assign one."
// //         );
// //         throw new Error(
// //           "User has no organization assigned. Please contact support."
// //         );
// //       }
// //       console.error("Login error:", error);
// //       throw error;
// //     }
// //   };

// //   const logout = async () => {
// //     await authService.logout();
// //     setUser(null);
// //     setIsAuthenticated(false);
// //   };

// //   const isAdmin = getIsAdmin(user);

// //   return (
// //     <AuthContext.Provider
// //       value={{ user, isLoading, isAuthenticated, login, logout, isAdmin }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuthContext = () => {
// //   const context = useContext(AuthContext);
// //   if (context === undefined) {
// //     throw new Error("useAuthContext must be used within an AuthProvider");
// //   }
// //   return context;
// // };

// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   type ReactNode,
// } from "react";
// import { authService } from "../lib/api";
// import type { User, Role } from "../types"; // FIXED: Import Role

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean; // Computed admin status
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const getIsAdmin = (u: User | null) => {
//     if (!u?.role) return false;
//     const roleName = u.role.name?.toLowerCase() || "";
//     const roleId = u.role._id;
//     return (
//       ["admin", "superadmin"].includes(roleName) ||
//       roleId === "68de5b12e16c2d1d59b09738"
//     ); // Known superAdmin ID
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true);
//       try {
//         if (authService.isAuthenticated()) {
//           const response = await authService.getMe(); // Assume returns ApiResponse<User>
//           const userData = response.data.user; // FIXED: Direct access
//           if (userData) {
//             // Enhanced fallback (logs for debug)
//             if (!userData.role || typeof userData.role === "string") {
//               console.warn("Role is null/ID, attempting fallback", {
//                 role: userData.role,
//               });
//               if (userData.role === "68de5b12e16c2d1d59b09738") {
//                 // FIXED: Create full Role object
//                 userData.role = {
//                   _id: userData.role as string,
//                   name: "superAdmin",
//                   description: "Super administrator with full access",
//                   permissions: {
//                     DocumentManagement: { viewDocuments: true, uploadDocuments: true, editDocuments: true, deleteDocuments: true, approveDocuments: true },
//                     UserManagement: { viewUsers: true, createUsers: true, editUsers: true, deleteUsers: true, manageUserRoles: true },
//                     OrganizationManagement: { viewOrganizations: true, createOrganizations: true, editOrganizations: true, deleteOrganizations: true },
//                   },
//                   createdAt: new Date().toISOString(),
//                   updatedAt: new Date().toISOString(),
//                   __v: 0,
//                   usersAssigned: 0,
//                   users: [],
//                   totalPermissions: 12, // Example count
//                   createdBy: null,
//                 } as Role;
//                 console.log("Fallback: Mocked role to superAdmin");
//               } else if (!userData.role) {
//                 console.error("Role is null—check DB/user creation");
//                 // Optionally: Redirect to admin panel to assign role
//               }
//             }
//             // NEW: Handle organization optional - do not throw error if null
//             if (!userData.organization) {
//               console.warn(
//                 "User has no organization assigned. Proceeding with null organization."
//               );
//               // Do not throw error; allow null organization for users without org
//             }
//             setUser(userData);
//             setIsAuthenticated(true);
//             console.log("Auth init success:", {
//               role: userData.role?.name || userData.role,
//             }); // Debug
//           } else {
//             console.warn("No user data in getMe response");
//           }
//         }
//       } catch (error: any) {
//         // FIXED: Handle specific organization error gracefully
//         if (error.message?.includes("no organization assigned")) {
//           console.warn(
//             "User has no organization assigned. Proceeding without org assignment."
//           );
//           // Optionally, fetch user without org requirement or set default
//           // For now, clear auth and prompt login
//           authService.clearAuth();
//           setIsAuthenticated(false);
//         } else {
//           console.error("Auth init error:", error);
//           authService.clearAuth();
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await authService.login(email, password); // Assume ApiResponse<AuthResponse>
//       const userData = response.data.user; // FIXED: Direct access
//       if (userData) {
//         // Enhanced fallback (logs for debug)
//         if (!userData.role || typeof userData.role === "string") {
//           console.warn("Role is null/ID on login, attempting fallback", {
//             role: userData.role,
//           });
//           if (userData.role === "68de5b12e16c2d1d59b09738") {
//             // FIXED: Create full Role object (same as above)
//             userData.role = {
//               _id: userData.role as string,
//               name: "superAdmin",
//               description: "Super administrator with full access",
//               permissions: {
//                 DocumentManagement: { viewDocuments: true, uploadDocuments: true, editDocuments: true, deleteDocuments: true, approveDocuments: true },
//                 UserManagement: { viewUsers: true, createUsers: true, editUsers: true, deleteUsers: true, manageUserRoles: true },
//                 OrganizationManagement: { viewOrganizations: true, createOrganizations: true, editOrganizations: true, deleteOrganizations: true },
//               },
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//               __v: 0,
//               usersAssigned: 0,
//               users: [],
//               totalPermissions: 12,
//               createdBy: null,
//             } as Role;
//             console.log("Fallback: Mocked role to superAdmin on login");
//           } else if (!userData.role) {
//             console.error("Role is null on login—check DB/user creation");
//           }
//         }
//         // NEW: Handle organization optional - do not throw error if null
//         if (!userData.organization) {
//           console.warn(
//             "User has no organization assigned during login. Proceeding with null."
//           );
//         }
//         setUser(userData);
//         setIsAuthenticated(true);
//         console.log("Login role:", userData.role?.name || userData.role); // Debug
//       }
//     } catch (error: any) {
//       // FIXED: Handle specific organization error gracefully
//       if (error.message?.includes("no organization assigned")) {
//         console.warn(
//           "User has no organization assigned during login. Please contact support to assign one."
//         );
//         throw new Error(
//           "User has no organization assigned. Please contact support."
//         );
//       }
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     await authService.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const isAdmin = getIsAdmin(user);

//   return (
//     <AuthContext.Provider
//       value={{ user, isLoading, isAuthenticated, login, logout, isAdmin }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "../lib/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getIsAdmin = (u: User | null): boolean => {
    return true; // ← Everyone is superadmin for now
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const response = await authService.getMe();
        const userData = response.data?.user || response.user;
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn("No active session");
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const userData = response.data?.user || response.user;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const googleLogin = async (credential: string) => {
    const response = await authService.googleLogin(credential);
    const userData = response.data?.user || response.user;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = getIsAdmin(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        googleLogin,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
