// // src/pages/RolesPage.tsx (New: Dedicated Roles-only page with RoleManagement)
// import { useAuthContext } from "../contexts/AuthContext";
// import { Layout } from "../components/Layout";
// import { RoleManagement } from "../components/RoleManagement";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// const RolesPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   console.log("RolesPage: Auth state", { isAuthenticated, userRole: user?.role?.name }); // Debug: Check role

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.success("Logged out successfully");
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (authLoading) {
//     console.log("RolesPage: Loading auth..."); // Debug
//     return (
//       <Layout user={user} onLogout={handleLogout}>
//         <div className="flex items-center justify-center h-64">
//           <p className="text-muted-foreground">Loading...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     console.log("RolesPage: Not authenticated"); // Debug
//     return null;
//   }

//   const isAdmin = ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '');
//   console.log("RolesPage: isAdmin check", { role: user.role.name?.toLowerCase(), isAdmin }); // Debug

//   if (!isAdmin) {
//     console.log("RolesPage: Access denied"); // Debug
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

//   console.log("RolesPage: Rendering RoleManagement"); // Debug

//   return (
//     <Layout user={user} onLogout={handleLogout}>
//       <div className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground">
//               Role Management
//             </h1>
//             <p className="text-muted-foreground">
//               Manage roles and permissions in the system
//             </p>
//           </div>
//         </div>

//         <RoleManagement />
//       </div>
//     </Layout>
//   );
// };

// export default RolesPage;


// src/pages/RolesPage.tsx (New: Dedicated Roles-only page with RoleManagement)
import { useAuthContext } from "../contexts/AuthContext";
import { Layout } from "../components/Layout";
import { RoleManagement } from "../components/RoleManagement";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

const RolesPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();

  console.log("RolesPage: Auth state", { isAuthenticated, userRole: user?.role?.name }); // Debug: Check role

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading) {
    console.log("RolesPage: Loading auth..."); // Debug
    return (
      <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("RolesPage: Not authenticated"); // Debug
    return null;
  }

  const isAdmin = ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '');
  console.log("RolesPage: isAdmin check", { role: user.role.name?.toLowerCase(), isAdmin }); // Debug

  if (!isAdmin) {
    console.log("RolesPage: Access denied"); // Debug
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

  console.log("RolesPage: Rendering RoleManagement"); // Debug

  return (
    <Layout user={user || undefined} onLogout={handleLogout}> {/* Fixed: Handle null/undefined */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Role Management
            </h1>
            <p className="text-muted-foreground">
              Manage roles and permissions in the system
            </p>
          </div>
        </div>

        <RoleManagement />
      </div>
    </Layout>
  );
};

export default RolesPage;