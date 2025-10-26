// import { useState, useEffect } from "react";
// import { authService } from "../services/auth.service";
// import type { User } from "../types/index";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const initAuth = () => {
//       const currentUser = authService.getCurrentUser();
//       const token = authService.getToken();

//       console.log("Initial auth check:", { currentUser, token });

//       if (currentUser && token) {
//         setUser(currentUser);
//         setIsAuthenticated(true);
//       }

//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (username: string, password: string) => {
//     if (!username.trim() || !password.trim()) {
//       throw new Error("Username and password are required");
//     }
//     setIsLoading(true);
//     try {
//       console.log("Attempting login with:", {
//         username: username.trim(),
//         password: password.trim(),
//       });
//       const response = await authService.login(
//         username.trim(),
//         password.trim()
//       );
//       console.log("API response:", response.data);
//       if (!response.data.user) {
//         throw new Error("Invalid user data in response");
//       }
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//       console.log("localStorage after login:", {
//         token: localStorage.getItem("token"),
//         user: localStorage.getItem("user"),
//       });
//       return response;
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Invalid user credentials";
//       console.error("Login error:", errorMessage, error);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     logout,
//   };
// };

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/auth.service";
// import type { User } from "../types";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = authService.getToken();
//       console.log("useAuth: Initial auth check", { token });

//       if (token) {
//         try {
//           const currentUser = await authService.getCurrentUser();
//           console.log("useAuth: User fetched", { userId: currentUser?.id });
//           setUser(currentUser);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("useAuth: Failed to fetch user", error);
//           authService.clearAuth(); // Clear invalid token
//           navigate("/login");
//         }
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, [navigate]);

//   const login = async (username: string, password: string) => {
//     if (!username.trim() || !password.trim()) {
//       throw new Error("Username and password are required");
//     }
//     setIsLoading(true);
//     try {
//       console.log("useAuth: Attempting login", { username });
//       const response = await authService.login(
//         username.trim(),
//         password.trim()
//       );
//       console.log("useAuth: Login response", response.data);
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//       console.log("useAuth: localStorage after login", {
//         token: localStorage.getItem("token"),
//         user: localStorage.getItem("user"),
//       });
//       navigate("/dashboard");
//       return response;
//     } catch (error) {
//       const errorMessage =
//         (error as any).response?.data?.message ||
//         (error as Error).message ||
//         "Invalid user credentials";
//       console.error("useAuth: Login error", errorMessage, error);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       console.log("useAuth: Logging out");
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//       navigate("/login");
//     } catch (error) {
//       console.error("useAuth: Logout error", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     logout,
//   };
// };

// import { useState, useEffect } from "react";
// import { authService } from "../services/auth.service";
// import type { User } from "../types";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = authService.getToken();
//       console.log("useAuth: Initial auth check", { token });

//       if (token) {
//         try {
//           const currentUser = await authService.getCurrentUser();
//           console.log("useAuth: User fetched", { userId: currentUser?.id });
//           setUser(currentUser);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("useAuth: Failed to fetch user", error);
//           authService.clearAuth();
//         }
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (username: string, password: string) => {
//     if (!username.trim() || !password.trim()) {
//       throw new Error("Username and password are required");
//     }
//     setIsLoading(true);
//     try {
//       console.log("useAuth: Attempting login", { username });
//       const response = await authService.login(
//         username.trim(),
//         password.trim()
//       );
//       console.log("useAuth: Login response", response.data);
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//       console.log("useAuth: localStorage after login", {
//         token: localStorage.getItem("token"),
//         user: localStorage.getItem("user"),
//       });
//       return response;
//     } catch (error) {
//       const errorMessage =
//         (error as any).response?.data?.message ||
//         (error as Error).message ||
//         "Invalid user credentials";
//       console.error("useAuth: Login error", errorMessage, error);
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async () => {
//     setIsLoading(true);
//     try {
//       console.log("useAuth: Logging out");
//       await authService.logout();
//       setUser(null);
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error("useAuth: Logout error", error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     logout,
//   };
// };

// // useAuth.ts
// import { useState, useEffect } from "react";
// import { authService } from "../services/auth.service";
// import type { User } from "../types";

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = authService.getToken();
//       console.log("useAuth: Initial auth check", { token });

//       if (token) {
//         try {
//           const currentUser = await authService.getCurrentUser();
//           console.log("useAuth: User fetched", { userId: currentUser?.id });
//           setUser(currentUser);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("useAuth: Failed to fetch user", error);
//           authService.clearAuth();
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       } else {
//         authService.clearAuth();
//       }
//       setIsLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (username: string, password: string) => {
//     if (!username.trim() || !password.trim()) {
//       throw new Error("Username and password are required");
//     }
//     setIsLoading(true);
//     try {
//       console.log("useAuth: Attempting login", { username });
//       authService.clearAuth();
//       const response = await authService.login(
//         username.trim(),
//         password.trim()
//       );
//       console.log("useAuth: Login response", response);
//       setUser(response.data.user);
//       setIsAuthenticated(true);
//       console.log("useAuth: localStorage after login", {
//         token: localStorage.getItem("token"),
//         user: localStorage.getItem("user"),
//       });
//       return response;
//     } catch (error) {
//       const errorMessage =
//         (error as any).response?.data?.message ||
//         (error as Error).message ||
//         "Invalid user credentials";
//       console.error("useAuth: Login error", errorMessage, error);
//       authService.clearAuth();
//       throw new Error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async (): Promise<void> => {
//     console.log("useAuth: Logging out");
//     authService.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//     setIsLoading(false);
//     return Promise.resolve(); // Explicitly return a resolved Promise
//   };

//   return {
//     user,
//     isLoading,
//     isAuthenticated,
//     login,
//     logout,
//   };
// };

import { useState, useEffect, useMemo } from "react";
import { authService } from "../services/auth.service";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const token = authService.getToken();
      console.log("useAuth: Initial auth check", { token });

      if (token && isMounted) {
        try {
          const currentUser = await authService.getCurrentUser();
          console.log("useAuth: User fetched", { userId: currentUser?.id });
          if (isMounted) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("useAuth: Failed to fetch user", error);
          if (isMounted) {
            authService.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else if (isMounted) {
        authService.clearAuth();
        setUser(null);
        setIsAuthenticated(false);
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      throw new Error("Username and password are required");
    }
    setIsLoading(true);
    try {
      console.log("useAuth: Attempting login", { username });
      authService.clearAuth();
      const response = await authService.login(
        username.trim(),
        password.trim()
      );
      console.log("useAuth: Login response", response);
      setUser(response.data.user);
      setIsAuthenticated(true);
      console.log("useAuth: localStorage after login", {
        token: localStorage.getItem("token"),
        user: localStorage.getItem("user"),
      });
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as Error).message ||
        "Invalid user credentials";
      console.error("useAuth: Login error", errorMessage, error);
      authService.clearAuth();
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    console.log("useAuth: Logging out");
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isLoading, isAuthenticated]
  );
};
