// // src/pages/UsersPage.tsx (Updated: Users-only page with UserManagement)
// import { useAuthContext } from "../contexts/AuthContext";
// import { Layout } from "../components/Layout";
// import { UserManagement } from "../components/UserManagement";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// const UsersPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   console.log("UsersPage: Auth state", { isAuthenticated, userRole: user?.role?.name }); // Debug: Check role

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (authLoading) {
//     console.log("UsersPage: Loading auth..."); // Debug
//     return (
//       <Layout user={user} onLogout={handleLogout}>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     console.log("UsersPage: Not authenticated"); // Debug
//     return null;
//   }

//   const isAdmin = ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '');
//   console.log("UsersPage: isAdmin check", { role: user.role.name?.toLowerCase(), isAdmin }); // Debug

//   if (!isAdmin) {
//     console.log("UsersPage: Access denied"); // Debug
//     return (
//       <Layout user={user} onLogout={handleLogout}>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">
//             Access denied. Admin privileges required. (Current role: {user.role.name})
//           </p>
//         </div>
//       </Layout>
//     );
//   }

//   console.log("UsersPage: Rendering UserManagement"); // Debug

//   return (
//     <Layout user={user} onLogout={handleLogout}>
//       <div className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">
//               User Management
//             </h1>
//             <p className="text-muted-foreground">
//               Manage all users in the system
//             </p>
//           </div>
//         </div>

//         <UserManagement />
//       </div>
//     </Layout>
//   );
// };

// export default UsersPage;

// // src/pages/UsersPage.tsx (Updated: Users-only page with UserManagement)
// import { useAuthContext } from "../contexts/AuthContext";
// import { Layout } from "../components/Layout";
// import { UserManagement } from "../components/UserManagement";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// const UsersPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   console.log("UsersPage: Auth state", { isAuthenticated, userRole: user?.role?.name }); // Debug: Check role

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (authLoading) {
//     console.log("UsersPage: Loading auth..."); // Debug
//     return (
//       <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     console.log("UsersPage: Not authenticated"); // Debug
//     return null;
//   }

//   const isAdmin = ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '');
//   console.log("UsersPage: isAdmin check", { role: user.role.name?.toLowerCase(), isAdmin }); // Debug

//   if (!isAdmin) {
//     console.log("UsersPage: Access denied"); // Debug
//     return (
//       <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">
//             Access denied. Admin privileges required. (Current role: {user.role.name})
//           </p>
//         </div>
//       </Layout>
//     );
//   }

//   console.log("UsersPage: Rendering UserManagement"); // Debug

//   return (
//     <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
//       <div className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">
//               User Management
//             </h1>
//             <p className="text-muted-foreground">
//               Manage all users in the system
//             </p>
//           </div>
//         </div>

//         <UserManagement />
//       </div>
//     </Layout>
//   );
// };

// export default UsersPage;

import { useAuthContext } from "../contexts/AuthContext";
import { Layout } from "../components/Layout";
import { UserManagement } from "../components/UserManagement";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import { motion } from "framer-motion";
import { ShieldAlert, Users, Loader2 } from "lucide-react";

const UsersPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading) {
    return (
      <Layout user={user || undefined} onLogout={handleLogout}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Authenticating Session
          </p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = ["admin", "superadmin"].includes(
    user.role.name?.toLowerCase() || "",
  );

  if (!isAdmin) {
    return (
      <Layout user={user || undefined} onLogout={handleLogout}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-zinc-500 max-w-md leading-relaxed mb-8">
            This workspace is reserved for administrative personnel. Please
            contact your system architect if you believe this is an error.
          </p>
          <div className="px-6 py-2 bg-white/5 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              Current Identity: {user.role.name || "Unknown"}
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user || undefined} onLogout={handleLogout}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-12 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                Administrative Hub
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-white">
              Identity Management
            </h1>
            <p className="text-zinc-500 text-lg font-light max-w-xl">
              Govern user access, orchestrate organizational roles, and monitor
              system-wide identity lifecycles.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Subtle Background Glow */}
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-1 lg:p-2 backdrop-blur-sm">
            <UserManagement />
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default UsersPage;
