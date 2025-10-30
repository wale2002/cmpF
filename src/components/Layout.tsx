// import type { ReactNode } from "react";
// import { useState } from "react";
// import { Button } from "./ui/button";
// import {
//   FileText,
//   Users,
//   BarChart3,
//   LogOut,
//   Shield,
//   Menu,
//   X,
//   User as UserIcon,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import type { User } from "../types";
// import { useAuthContext } from "../contexts/AuthContext";
// import { OrganizationProfileModal } from "./OrganizationProfileModal";

// interface LayoutProps {
//   children: ReactNode;
//   user?: User;
//   onLogout?: () => void;
// }

// export function Layout({ children, user, onLogout }: LayoutProps) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const { user: authUser } = useAuthContext(); // Use context for full user data
//   const currentUser = user || authUser;
//   const isSuperAdmin = currentUser?.role?.name?.toLowerCase() === "superadmin";
//   const permissions = currentUser?.role?.permissions || {};
//   const canViewAnalytics =
//     isSuperAdmin ||
//     permissions.OrganizationManagement?.viewOrganizations ||
//     permissions.UserManagement?.viewUsers ||
//     false;
//   const canViewUsers =
//     isSuperAdmin || permissions.UserManagement?.viewUsers || false;
//   const canManageUserRoles =
//     isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;

//   const isAdmin = currentUser?.role?.name === "admin" || isSuperAdmin;

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleProfileSuccess = () => {
//     setShowProfileModal(false);
//     window.location.reload();
//   };

//   if (!currentUser) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={toggleMobileMenu}
//         />
//       )}

//       {/* Mobile sidebar menu */}
//       <div
//         className={`fixed top-0 left-0 h-full w-48 bg-card border-r shadow-lg z-50 transform transition-transform md:hidden ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-3 border-b">
//           <Button
//             variant="ghost"
//             size="sm"
//             className="w-full justify-start"
//             onClick={toggleMobileMenu}
//           >
//             <X className="h-3.5 w-3.5 mr-2" />
//             Close
//           </Button>
//         </div>
//         {/* Profile section for mobile sidebar */}
//         <div className="p-3 border-b bg-muted/30">
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//               <UserIcon className="h-4 w-4 text-primary" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-medium text-xs truncate">
//                 {currentUser.fullName}
//               </p>
//               <p className="text-xs text-muted-foreground truncate">
//                 {currentUser.role?.name}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="w-full"
//             onClick={() => {
//               setShowProfileModal(true);
//               setIsMobileMenuOpen(false);
//             }}
//           >
//             <UserIcon className="h-3.5 w-3.5 mr-2" />
//             Edit Profile
//           </Button>
//         </div>
//         <nav className="p-3 space-y-1">
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) =>
//               `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                 isActive
//                   ? "bg-accent text-accent-foreground font-medium"
//                   : "hover:bg-accent/50"
//               }`
//             }
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <FileText className="h-3.5 w-3.5 mr-2" />
//             Dashboard
//           </NavLink>

//           <NavLink
//             to="/documents"
//             className={({ isActive }) =>
//               `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                 isActive
//                   ? "bg-accent text-accent-foreground font-medium"
//                   : "hover:bg-accent/50"
//               }`
//             }
//             onClick={() => setIsMobileMenuOpen(false)}
//           >
//             <FileText className="h-3.5 w-3.5 mr-2" />
//             Documents
//           </NavLink>

//           {canViewAnalytics && (
//             <NavLink
//               to="/analytics"
//               className={({ isActive }) =>
//                 `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                   isActive
//                     ? "bg-accent text-accent-foreground font-medium"
//                     : "hover:bg-accent/50"
//                 }`
//               }
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               <BarChart3 className="h-3.5 w-3.5 mr-2" />
//               Analytics
//             </NavLink>
//           )}

//           {isAdmin && (
//             <>
//               <div className="pt-3 pb-1">
//                 <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
//                   Admin
//                 </h3>
//               </div>

//               {canViewUsers && (
//                 <NavLink
//                   to="/users"
//                   className={({ isActive }) =>
//                     `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                       isActive
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "hover:bg-accent/50"
//                     }`
//                   }
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <Users className="h-3.5 w-3.5 mr-2" />
//                   Users
//                 </NavLink>
//               )}

//               {canManageUserRoles && (
//                 <NavLink
//                   to="/roles"
//                   className={({ isActive }) =>
//                     `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                       isActive
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "hover:bg-accent/50"
//                     }`
//                   }
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   <Shield className="h-3.5 w-3.5 mr-2" />
//                   Roles
//                 </NavLink>
//               )}
//             </>
//           )}

//           <Button
//             variant="destructive"
//             size="sm"
//             className="w-full mt-3 text-xs"
//             onClick={() => {
//               onLogout?.();
//               setIsMobileMenuOpen(false);
//             }}
//           >
//             <LogOut className="h-3.5 w-3.5 mr-2" />
//             Logout
//           </Button>
//         </nav>
//       </div>

//       <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
//         {/* Header */}
//         <header className="border-b bg-card shadow-soft">
//           <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2 flex-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={toggleMobileMenu}
//                   className="md:hidden"
//                 >
//                   <Menu className="h-5 w-5" />
//                 </Button>
//                 <NavLink to="/dashboard" className="flex-shrink-0">
//                   <div className="flex items-center gap-2">
//                     <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
//                     <h1 className="text-lg sm:text-xl font-bold text-primary hidden sm:block">
//                       ContractHub
//                     </h1>
//                     <h1 className="text-base font-bold text-primary sm:hidden">
//                       CH
//                     </h1>
//                   </div>
//                 </NavLink>
//                 <div className="hidden md:block ml-3 sm:ml-6">
//                   <span className="text-xs sm:text-sm text-muted-foreground">
//                     Welcome back,{" "}
//                     <span className="font-medium text-foreground">
//                       {currentUser.username || currentUser.fullName}
//                     </span>
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1 sm:gap-2">
//                 <div className="hidden md:flex items-center gap-2 text-xs">
//                   <span className="text-muted-foreground">Role:</span>
//                   <span
//                     className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
//                       isAdmin
//                         ? "bg-primary-light text-primary"
//                         : "bg-secondary text-secondary-foreground"
//                     }`}
//                   >
//                     {currentUser.role?.name}
//                   </span>
//                 </div>
//                 {/* New Profile Button */}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowProfileModal(true)}
//                   className="hidden sm:inline-flex"
//                   title="Update Profile & Organization"
//                 >
//                   <UserIcon className="h-3.5 w-3.5 mr-1" />
//                   Profile
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onLogout}
//                   className="hidden sm:inline-flex"
//                 >
//                   <LogOut className="h-3.5 w-3.5 mr-1" />
//                   Logout
//                 </Button>
//                 {/* Mobile profile and logout buttons */}
//                 <div className="flex gap-1 sm:hidden">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setShowProfileModal(true)}
//                   >
//                     <UserIcon className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button variant="ghost" size="sm" onClick={onLogout}>
//                     <LogOut className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4.5rem)]">
//           {/* Desktop Sidebar - Hidden on mobile */}
//           <aside className="hidden md:block w-48 bg-card border-r shadow-soft flex-shrink-0">
//             <nav className="p-4 space-y-1">
//               <NavLink
//                 to="/dashboard"
//                 className={({ isActive }) =>
//                   `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                     isActive
//                       ? "bg-accent text-accent-foreground font-medium"
//                       : "hover:bg-accent/50"
//                   }`
//                 }
//               >
//                 <FileText className="h-3.5 w-3.5 mr-2" />
//                 Dashboard
//               </NavLink>

//               <NavLink
//                 to="/documents"
//                 className={({ isActive }) =>
//                   `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                     isActive
//                       ? "bg-accent text-accent-foreground font-medium"
//                       : "hover:bg-accent/50"
//                   }`
//                 }
//               >
//                 <FileText className="h-3.5 w-3.5 mr-2" />
//                 Documents
//               </NavLink>

//               {canViewAnalytics && (
//                 <NavLink
//                   to="/analytics"
//                   className={({ isActive }) =>
//                     `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                       isActive
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "hover:bg-accent/50"
//                     }`
//                   }
//                 >
//                   <BarChart3 className="h-3.5 w-3.5 mr-2" />
//                   Analytics
//                 </NavLink>
//               )}

//               {isAdmin && (
//                 <>
//                   <div className="pt-3 pb-1">
//                     <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
//                       Admin
//                     </h3>
//                   </div>

//                   {canViewUsers && (
//                     <NavLink
//                       to="/users"
//                       className={({ isActive }) =>
//                         `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                           isActive
//                             ? "bg-accent text-accent-foreground font-medium"
//                             : "hover:bg-accent/50"
//                         }`
//                       }
//                     >
//                       <Users className="h-3.5 w-3.5 mr-2" />
//                       Users
//                     </NavLink>
//                   )}

//                   {canManageUserRoles && (
//                     <NavLink
//                       to="/roles"
//                       className={({ isActive }) =>
//                         `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
//                           isActive
//                             ? "bg-accent text-accent-foreground font-medium"
//                             : "hover:bg-accent/50"
//                         }`
//                       }
//                     >
//                       <Shield className="h-3.5 w-3.5 mr-2" />
//                       Roles
//                     </NavLink>
//                   )}
//                 </>
//               )}

//               <Button
//                 variant="destructive"
//                 size="sm"
//                 className="w-full mt-3 text-xs"
//                 onClick={onLogout}
//               >
//                 <LogOut className="h-3.5 w-3.5 mr-2" />
//                 Logout
//               </Button>
//             </nav>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 p-3 sm:p-4 overflow-auto">{children}</main>
//         </div>

//         {/* Organization Profile Modal */}
//         <OrganizationProfileModal
//           user={currentUser}
//           isOpen={showProfileModal}
//           onClose={() => setShowProfileModal(false)}
//           onSuccess={handleProfileSuccess}
//         />
//       </div>
//     </>
//   );
// }

// export default Layout;

// export default Layout;

// src/components/Layout.tsx
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  FileText,
  Users,
  BarChart3,
  LogOut,
  Shield,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { User } from "../types";
import { useAuthContext } from "../contexts/AuthContext";
import { OrganizationProfileModal } from "./OrganizationProfileModal";

interface LayoutProps {
  children: ReactNode;
  user?: User;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user: authUser } = useAuthContext(); // Use context for full user data
  const currentUser = user || authUser;
  const isSuperAdmin = currentUser?.role?.name?.toLowerCase() === "superadmin";
  const permissions = currentUser?.role?.permissions || {};
  const canViewAnalytics =
    isSuperAdmin ||
    permissions.OrganizationManagement?.viewOrganizations ||
    permissions.UserManagement?.viewUsers ||
    false;
  const canViewUsers =
    isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const canManageUserRoles =
    isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;

  const isAdmin = currentUser?.role?.name === "admin" || isSuperAdmin;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleProfileSuccess = () => {
    setShowProfileModal(false);
    window.location.reload();
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile sidebar menu */}
      <div
        className={`fixed top-0 left-0 h-full w-48 bg-card border-r shadow-lg z-50 transform transition-transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-3 border-b">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleMobileMenu}
          >
            <X className="h-3.5 w-3.5 mr-2" />
            Close
          </Button>
        </div>
        {/* Profile section for mobile sidebar */}
        <div className="p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs truncate">
                {currentUser.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.role?.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setShowProfileModal(true);
              setIsMobileMenuOpen(false);
            }}
          >
            <UserIcon className="h-3.5 w-3.5 mr-2" />
            Edit Profile
          </Button>
        </div>
        <nav className="p-3 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText className="h-3.5 w-3.5 mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText className="h-3.5 w-3.5 mr-2" />
            Documents
          </NavLink>

          {canViewAnalytics && (
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/50"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="h-3.5 w-3.5 mr-2" />
              Analytics
            </NavLink>
          )}

          {isAdmin && (
            <>
              <div className="pt-3 pb-1">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                  Admin
                </h3>
              </div>

              {canViewUsers && (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-3.5 w-3.5 mr-2" />
                  Users
                </NavLink>
              )}

              {canManageUserRoles && (
                <NavLink
                  to="/roles"
                  className={({ isActive }) =>
                    `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-3.5 w-3.5 mr-2" />
                  Roles
                </NavLink>
              )}
            </>
          )}

          <Button
            variant="destructive"
            size="sm"
            className="w-full mt-3 text-xs"
            onClick={() => {
              onLogout?.();
              setIsMobileMenuOpen(false);
            }}
          >
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Logout
          </Button>
        </nav>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        {/* Header */}
        <header className="border-b bg-card shadow-soft">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <NavLink to="/dashboard" className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    <h1 className="text-lg sm:text-xl font-bold text-primary hidden sm:block">
                      ContractHub
                    </h1>
                    <h1 className="text-base font-bold text-primary sm:hidden">
                      CH
                    </h1>
                  </div>
                </NavLink>
                <div className="hidden md:block ml-3 sm:ml-6">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Welcome back,{" "}
                    <span className="font-medium text-foreground">
                      {currentUser.username || currentUser.fullName}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      isAdmin
                        ? "bg-primary-light text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {currentUser.role?.name}
                  </span>
                </div>
                {/* New Profile Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                  className="hidden sm:inline-flex"
                  title="Update Profile & Organization"
                >
                  <UserIcon className="h-3.5 w-3.5 mr-1" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="hidden sm:inline-flex"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </Button>
                {/* Mobile profile and logout buttons */}
                <div className="flex gap-1 sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onLogout}>
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4.5rem)]">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden md:block w-48 bg-card border-r shadow-soft flex-shrink-0">
            <nav className="p-4 space-y-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <FileText className="h-3.5 w-3.5 mr-2" />
                Dashboard
              </NavLink>

              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <FileText className="h-3.5 w-3.5 mr-2" />
                Documents
              </NavLink>

              {canViewAnalytics && (
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-2" />
                  Analytics
                </NavLink>
              )}

              {isAdmin && (
                <>
                  <div className="pt-3 pb-1">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                      Admin
                    </h3>
                  </div>

                  {canViewUsers && (
                    <NavLink
                      to="/users"
                      className={({ isActive }) =>
                        `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        }`
                      }
                    >
                      <Users className="h-3.5 w-3.5 mr-2" />
                      Users
                    </NavLink>
                  )}

                  {canManageUserRoles && (
                    <NavLink
                      to="/roles"
                      className={({ isActive }) =>
                        `w-full flex items-center px-2 py-1.5 rounded-md transition text-xs ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        }`
                      }
                    >
                      <Shield className="h-3.5 w-3.5 mr-2" />
                      Roles
                    </NavLink>
                  )}
                </>
              )}

              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-3 text-xs"
                onClick={onLogout}
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Logout
              </Button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 overflow-auto">{children}</main>
        </div>

        {/* Organization Profile Modal */}
        <OrganizationProfileModal
          user={currentUser}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onSuccess={handleProfileSuccess}
        />
      </div>
    </>
  );
}

export default Layout;
