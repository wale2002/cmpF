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

// src/pages/UsersPage.tsx (Updated: Users-only page with UserManagement)
import { useAuthContext } from "../contexts/AuthContext";
import { Layout } from "../components/Layout";
import { UserManagement } from "../components/UserManagement";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

const UsersPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();

  console.log("UsersPage: Auth state", { isAuthenticated, userRole: user?.role?.name }); // Debug: Check role

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading) {
    console.log("UsersPage: Loading auth..."); // Debug
    return (
      <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("UsersPage: Not authenticated"); // Debug
    return null;
  }

  const isAdmin = ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '');
  console.log("UsersPage: isAdmin check", { role: user.role.name?.toLowerCase(), isAdmin }); // Debug

  if (!isAdmin) {
    console.log("UsersPage: Access denied"); // Debug
    return (
      <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Access denied. Admin privileges required. (Current role: {user.role.name})
          </p>
        </div>
      </Layout>
    );
  }

  console.log("UsersPage: Rendering UserManagement"); // Debug

  return (
    <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all users in the system
            </p>
          </div>
        </div>

        <UserManagement />
      </div>
    </Layout>
  );
};

export default UsersPage;