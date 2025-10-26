// // // // // // src/contexts/AuthContext.tsx
// // // // // import {
// // // // //   createContext,
// // // // //   useContext,
// // // // //   useState,
// // // // //   useEffect,
// // // // //   type ReactNode,
// // // // // } from "react";
// // // // // import { authService } from "../lib/api";
// // // // // import type { User, ApiResponse } from "../types";

// // // // // interface AuthContextType {
// // // // //   user: User | null;
// // // // //   isLoading: boolean;
// // // // //   isAuthenticated: boolean;
// // // // //   login: (email: string, password: string) => Promise<void>;
// // // // //   logout: () => Promise<void>;
// // // // // }

// // // // // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // // // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// // // // //   const [user, setUser] = useState<User | null>(null);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// // // // //   useEffect(() => {
// // // // //     const initializeAuth = async () => {
// // // // //       try {
// // // // //         if (authService.isAuthenticated()) {
// // // // //           const response = await authService.getMe();
// // // // //           setUser(response.data.user);
// // // // //           setIsAuthenticated(true);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         authService.clearAuth();
// // // // //       } finally {
// // // // //         setIsLoading(false);
// // // // //       }
// // // // //     };
// // // // //     initializeAuth();
// // // // //   }, []);

// // // // //   const login = async (email: string, password: string) => {
// // // // //     const response = await authService.login(email, password);
// // // // //     setUser(response.data.user);
// // // // //     setIsAuthenticated(true);
// // // // //   };

// // // // //   const logout = async () => {
// // // // //     await authService.logout();
// // // // //     setUser(null);
// // // // //     setIsAuthenticated(false);
// // // // //   };

// // // // //   return (
// // // // //     <AuthContext.Provider
// // // // //       value={{ user, isLoading, isAuthenticated, login, logout }}
// // // // //     >
// // // // //       {children}
// // // // //     </AuthContext.Provider>
// // // // //   );
// // // // // };

// // // // // export const useAuthContext = () => {
// // // // //   const context = useContext(AuthContext);
// // // // //   if (context === undefined) {
// // // // //     throw new Error("useAuthContext must be used within an AuthProvider");
// // // // //   }
// // // // //   return context;
// // // // // };


// // // // import {
// // // //   createContext,
// // // //   useContext,
// // // //   useState,
// // // //   useEffect,
// // // //   type ReactNode,
// // // // } from "react";
// // // // import { authService } from "../lib/api";
// // // // import type { User, ApiResponse } from "../types";

// // // // interface AuthContextType {
// // // //   user: User | null;
// // // //   isLoading: boolean;
// // // //   isAuthenticated: boolean;
// // // //   login: (email: string, password: string) => Promise<void>;
// // // //   logout: () => Promise<void>;
// // // // }

// // // // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// // // //   const [user, setUser] = useState<User | null>(null);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// // // //   useEffect(() => {
// // // //     const initializeAuth = async () => {
// // // //       setIsLoading(true);
// // // //       try {
// // // //         if (authService.isAuthenticated()) {
// // // //           const response = await authService.getMe();
// // // //           // Handle both nested and flat responses
// // // //           const userData = response.data?.user || response.user;
// // // //           if (userData) {
// // // //             setUser(userData);
// // // //             setIsAuthenticated(true);
// // // //             console.log("Auth init success:", { role: userData.role.name }); // Debug
// // // //           } else {
// // // //             console.warn("No user data in getMe response");
// // // //           }
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Auth init error:", error);
// // // //         authService.clearAuth();
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     };
// // // //     initializeAuth();
// // // //   }, []);

// // // //   const login = async (email: string, password: string) => {
// // // //     const response = await authService.login(email, password);
// // // //     // Handle both nested and flat responses
// // // //     const userData = response.data?.user || response.user;
// // // //     if (userData) {
// // // //       setUser(userData);
// // // //       setIsAuthenticated(true);
// // // //     }
// // // //   };

// // // //   const logout = async () => {
// // // //     await authService.logout();
// // // //     setUser(null);
// // // //     setIsAuthenticated(false);
// // // //   };

// // // //   return (
// // // //     <AuthContext.Provider
// // // //       value={{ user, isLoading, isAuthenticated, login, logout }}
// // // //     >
// // // //       {children}
// // // //     </AuthContext.Provider>
// // // //   );
// // // // };

// // // // export const useAuthContext = () => {
// // // //   const context = useContext(AuthContext);
// // // //   if (context === undefined) {
// // // //     throw new Error("useAuthContext must be used within an AuthProvider");
// // // //   }
// // // //   return context;
// // // // };


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
// // //     if (!u) return false;
// // //     const roleName = u.role?.name?.toLowerCase();
// // //     const roleId = typeof u.role === 'string' ? u.role : u.role?._id;
// // //     return ['admin', 'superadmin'].includes(roleName || '') || 
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
// // //             // Fallback: Mock populate if role is ID (remove once backend populates)
// // //             if (typeof userData.role === 'string' && userData.role === '68de5b12e16c2d1d59b09738') {
// // //               userData.role = { name: 'superAdmin' };
// // //               console.log("Fallback: Mocked role to superAdmin"); // Debug
// // //             }
// // //             setUser(userData);
// // //             setIsAuthenticated(true);
// // //             console.log("Auth init success:", { role: userData.role?.name || userData.role }); // Debug
// // //           } else {
// // //             console.warn("No user data in getMe response");
// // //           }
// // //         }
// // //       } catch (error) {
// // //         console.error("Auth init error:", error);
// // //         authService.clearAuth();
// // //       } finally {
// // //         setIsLoading(false);
// // //       }
// // //     };
// // //     initializeAuth();
// // //   }, []);

// // //   const login = async (email: string, password: string) => {
// // //     const response = await authService.login(email, password);
// // //     let userData = response.data?.user || response.user;
// // //     if (userData) {
// // //       // Fallback: Mock populate if role is ID (remove once backend populates)
// // //       if (typeof userData.role === 'string' && userData.role === '68de5b12e16c2d1d59b09738') {
// // //         userData.role = { name: 'superAdmin' };
// // //         console.log("Fallback: Mocked role to superAdmin on login"); // Debug
// // //       }
// // //       setUser(userData);
// // //       setIsAuthenticated(true);
// // //       console.log("Login role:", userData.role?.name || userData.role); // Debug
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


// // // src/contexts/AuthContext.tsx
// // import {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   type ReactNode,
// // } from "react";
// // import { authService } from "../lib/api";
// // import type { User, ApiResponse } from "../types";

// // interface AuthContextType {
// //   user: User | null;
// //   isLoading: boolean;
// //   isAuthenticated: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => Promise<void>;
// //   isAdmin: boolean;  // Computed admin status
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// //   const getIsAdmin = (u: User | null) => {
// //     if (!u) return false;
// //     const roleObj = u.role;
// //     if (!roleObj) return false;  // Explicit null check
// //     const roleName = typeof roleObj === 'string' ? roleObj : roleObj.name?.toLowerCase() || '';
// //     const roleId = typeof roleObj === 'string' ? roleObj : roleObj?._id;
// //     return ['admin', 'superadmin'].includes(roleName) || 
// //            roleId === '68de5b12e16c2d1d59b09738';  // Known superAdmin ID
// //   };

// //   useEffect(() => {
// //     const initializeAuth = async () => {
// //       setIsLoading(true);
// //       try {
// //         if (authService.isAuthenticated()) {
// //           const response = await authService.getMe();
// //           let userData = response.data?.user || response.user;
// //           if (userData) {
// //             // Enhanced fallback (logs for debug)
// //             if (!userData.role || typeof userData.role === 'string') {
// //               console.warn("Role is null/ID, attempting fallback", { role: userData.role });
// //               if (userData.role === '68de5b12e16c2d1d59b09738') {
// //                 userData.role = { _id: userData.role, name: 'superAdmin' };
// //                 console.log("Fallback: Mocked role to superAdmin");
// //               } else if (!userData.role) {
// //                 console.error("Role is null—check DB/user creation");
// //                 // Optionally: Redirect to admin panel to assign role
// //               }
// //             }
// //             setUser(userData);
// //             setIsAuthenticated(true);
// //             console.log("Auth init success:", { role: userData.role?.name || userData.role }); // Debug
// //           } else {
// //             console.warn("No user data in getMe response");
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Auth init error:", error);
// //         authService.clearAuth();
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };
// //     initializeAuth();
// //   }, []);

// //   const login = async (email: string, password: string) => {
// //     const response = await authService.login(email, password);
// //     let userData = response.data?.user || response.user;
// //     if (userData) {
// //       // Enhanced fallback (logs for debug)
// //       if (!userData.role || typeof userData.role === 'string') {
// //         console.warn("Role is null/ID on login, attempting fallback", { role: userData.role });
// //         if (userData.role === '68de5b12e16c2d1d59b09738') {
// //           userData.role = { _id: userData.role, name: 'superAdmin' };
// //           console.log("Fallback: Mocked role to superAdmin on login");
// //         } else if (!userData.role) {
// //           console.error("Role is null on login—check DB/user creation");
// //         }
// //       }
// //       setUser(userData);
// //       setIsAuthenticated(true);
// //       console.log("Login role:", userData.role?.name || userData.role); // Debug
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


// import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
// import { authService } from "../lib/api";
// import type { User, ApiResponse } from "../types";

// interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
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
//     );
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true);
//       try {
//         if (authService.isAuthenticated()) {
//           const response = await authService.getMe();
//           let userData = response.data?.user || response.user;
//           if (userData) {
//             // NEW: Ensure permissions object exists
//             if (!userData.role?.permissions) {
//               console.warn("User role permissions missing, defaulting to empty", {
//                 userId: userData._id,
//                 role: userData.role,
//               });
//               userData.role = {
//                 ...userData.role,
//                 permissions: {},
//               };
//             }
//             setUser(userData);
//             setIsAuthenticated(true);
//             console.log("Auth init success:", {
//               role: userData.role?.name,
//               permissions: userData.role?.permissions,
//             });
//           } else {
//             console.warn("No user data in getMe response");
//             authService.clearAuth();
//           }
//         }
//       } catch (error) {
//         console.error("Auth init error:", error);
//         authService.clearAuth();
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     initializeAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const response = await authService.login(email, password);
//       let userData = response.data?.user || response.user;
//       if (userData) {
//         // NEW: Ensure permissions object exists
//         if (!userData.role?.permissions) {
//           console.warn("User role permissions missing on login, defaulting to empty", {
//             userId: userData._id,
//             role: userData.role,
//           });
//           userData.role = {
//             ...userData.role,
//             permissions: {},
//           };
//         }
//         setUser(userData);
//         setIsAuthenticated(true);
//         console.log("Login success:", {
//           role: userData.role?.name,
//           permissions: userData.role?.permissions,
//         });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
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
import type { User, ApiResponse } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;  // Computed admin status
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getIsAdmin = (u: User | null) => {
    if (!u?.role) return false;
    const roleName = u.role.name?.toLowerCase() || '';
    const roleId = u.role._id;
    return ['admin', 'superadmin'].includes(roleName) || 
           roleId === '68de5b12e16c2d1d59b09738';  // Known superAdmin ID
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getMe();
          let userData = response.data?.user || response.user;
          if (userData) {
            // Enhanced fallback (logs for debug)
            if (!userData.role || typeof userData.role === 'string') {
              console.warn("Role is null/ID, attempting fallback", { role: userData.role });
              if (userData.role === '68de5b12e16c2d1d59b09738') {
                userData.role = { _id: userData.role, name: 'superAdmin' };
                console.log("Fallback: Mocked role to superAdmin");
              } else if (!userData.role) {
                console.error("Role is null—check DB/user creation");
                // Optionally: Redirect to admin panel to assign role
              }
            }
            // NEW: Handle organization optional - do not throw error if null
            if (!userData.organization) {
              console.warn("User has no organization assigned. Proceeding with null organization.");
              // Do not throw error; allow null organization for users without org
            }
            setUser(userData);
            setIsAuthenticated(true);
            console.log("Auth init success:", { role: userData.role?.name || userData.role }); // Debug
          } else {
            console.warn("No user data in getMe response");
          }
        }
      } catch (error: any) {
        // FIXED: Handle specific organization error gracefully
        if (error.message?.includes("no organization assigned")) {
          console.warn("User has no organization assigned. Proceeding without org assignment.");
          // Optionally, fetch user without org requirement or set default
          // For now, clear auth and prompt login
          authService.clearAuth();
          setIsAuthenticated(false);
        } else {
          console.error("Auth init error:", error);
          authService.clearAuth();
        }
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      let userData = response.data?.user || response.user;
      if (userData) {
        // Enhanced fallback (logs for debug)
        if (!userData.role || typeof userData.role === 'string') {
          console.warn("Role is null/ID on login, attempting fallback", { role: userData.role });
          if (userData.role === '68de5b12e16c2d1d59b09738') {
            userData.role = { _id: userData.role, name: 'superAdmin' };
            console.log("Fallback: Mocked role to superAdmin on login");
          } else if (!userData.role) {
            console.error("Role is null on login—check DB/user creation");
          }
        }
        // NEW: Handle organization optional - do not throw error if null
        if (!userData.organization) {
          console.warn("User has no organization assigned during login. Proceeding with null.");
        }
        setUser(userData);
        setIsAuthenticated(true);
        console.log("Login role:", userData.role?.name || userData.role); // Debug
      }
    } catch (error: any) {
      // FIXED: Handle specific organization error gracefully
      if (error.message?.includes("no organization assigned")) {
        console.warn("User has no organization assigned during login. Please contact support to assign one.");
        throw new Error("User has no organization assigned. Please contact support.");
      }
      console.error("Login error:", error);
      throw error;
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
      value={{ user, isLoading, isAuthenticated, login, logout, isAdmin }}
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