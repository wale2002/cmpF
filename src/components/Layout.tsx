

// // src/components/Layout.tsx
// import type { ReactNode } from "react";
// import { useState } from "react"; // FIXED: Add useState import
// import { Button } from "./ui/button";
// import {
//   FileText,
//   Building,
//   Users,
//   BarChart3,
//   LogOut,
//   Shield,
//   User as UserIcon,
// } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import type { User } from "../types";
// import { OrganizationProfileModal } from "./OrganizationProfileModal"; // Import new modal

// interface LayoutProps {
//   children: ReactNode;
//   user?: User;
//   onLogout?: () => void;
// }

// export function Layout({ children, user, onLogout }: LayoutProps) {
//   const [showProfileModal, setShowProfileModal] = useState(false); // Now useState is defined
//   const isAdmin = user?.role.name === "admin";

//   if (!user) {
//     return <div>Loading...</div>; // Or redirect to login
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
//       {/* Header */}
//       <header className="border-b bg-card shadow-soft">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <NavLink to="/dashboard">
//                 <div className="flex items-center gap-2">
//                   <Shield className="h-8 w-8 text-primary" />
//                   <h1 className="text-2xl font-bold text-primary">
//                     ContractHub
//                   </h1>
//                 </div>
//               </NavLink>
//               <div className="hidden md:block ml-8">
//                 <span className="text-sm text-muted-foreground">
//                   Welcome back,{" "}
//                   <span className="font-medium text-foreground">
//                     {user.username || user.fullName}
//                   </span>
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="hidden md:flex items-center gap-2 text-sm">
//                 <span className="text-muted-foreground">Role:</span>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     isAdmin
//                       ? "bg-primary-light text-primary"
//                       : "bg-secondary text-secondary-foreground"
//                   }`}
//                 >
//                   {user.role.name}
//                 </span>
//               </div>
//               {/* New Profile Button */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowProfileModal(true)}
//                 title="Update Profile & Organization"
//               >
//                 <UserIcon className="h-4 w-4 mr-1" />
//                 Profile
//               </Button>
//               <Button variant="ghost" size="sm" onClick={onLogout}>
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex min-h-[calc(100vh-73px)]">
//         {/* Sidebar */}
//         <aside className="w-64 bg-card border-r shadow-soft">
//           <nav className="p-6 space-y-2">
//             <NavLink
//               to="/documents"
//               className={({ isActive }) =>
//                 `w-full flex items-center px-3 py-2 rounded-md transition ${
//                   isActive
//                     ? "bg-accent text-accent-foreground font-medium"
//                     : "hover:bg-accent/50"
//                 }`
//               }
//             >
//               <FileText className="h-4 w-4 mr-3" />
//               Documents
//             </NavLink>

//             <NavLink
//               to="/analytics"
//               className={({ isActive }) =>
//                 `w-full flex items-center px-3 py-2 rounded-md transition ${
//                   isActive
//                     ? "bg-accent text-accent-foreground font-medium"
//                     : "hover:bg-accent/50"
//                 }`
//               }
//             >
//               <BarChart3 className="h-4 w-4 mr-3" />
//               Analytics
//             </NavLink>

//             {isAdmin && (
//               <>
//                 <div className="pt-4 pb-2">
//                   <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
//                     Admin
//                   </h3>
//                 </div>

//                 <NavLink
//                   to="/organizations"
//                   className={({ isActive }) =>
//                     `w-full flex items-center px-3 py-2 rounded-md transition ${
//                       isActive
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "hover:bg-accent/50"
//                     }`
//                   }
//                 >
//                   <Building className="h-4 w-4 mr-3" />
//                   Organizations
//                 </NavLink>

//                 <NavLink
//                   to="/users"
//                   className={({ isActive }) =>
//                     `w-full flex items-center px-3 py-2 rounded-md transition ${
//                       isActive
//                         ? "bg-accent text-accent-foreground font-medium"
//                         : "hover:bg-accent/50"
//                     }`
//                   }
//                 >
//                   <Users className="h-4 w-4 mr-3" />
//                   Users
//                 </NavLink>
//               </>
//             )}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6">{children}</main>
//       </div>

//       {/* New Organization Profile Modal */}
//       <OrganizationProfileModal
//         user={user}
//         isOpen={showProfileModal}
//         onClose={() => setShowProfileModal(false)}
//         onSuccess={() => window.location.reload()} // Refetch context
//       />
//     </div>
//   );
// }

// export default Layout;


// src/components/Layout.tsx
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  FileText,
  Building,
  Users,
  BarChart3,
  LogOut,
  Shield,
  User as UserIcon,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import type { User, Document, Organization } from "../types";
import { useAuthContext } from "../contexts/AuthContext";
import { OrganizationProfileModal } from "./OrganizationProfileModal"; // Import profile modal

interface LayoutProps {
  children: ReactNode;
  user?: User;
  onLogout?: () => void;
  documents?: Document[]; // Optional: Pass documents if available
  organizations?: Organization[]; // Optional: Pass organizations if available
  onDocumentAction?: (action: string, doc: Document) => void;
  onCreateFolder?: (name: string, organizationType: string) => Promise<void>;
  onDeleteFolder?: (folderId: string) => Promise<void>;
  onRenameFolder?: (folderId: string, newName: string) => Promise<void>;
}

export function Layout({
  children,
  user,
  onLogout,
  documents = [],
  organizations = [],
  onDocumentAction = () => {},
  onCreateFolder = async () => {},
  onDeleteFolder = async () => {},
  onRenameFolder = async () => {},
}: LayoutProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: authUser } = useAuthContext(); // Use context for full user data
  const currentUser = user || authUser;
  const isSuperAdmin = currentUser?.role?.name?.toLowerCase() === 'superadmin';
  const permissions = currentUser?.role?.permissions || {};
  const canViewAnalytics = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || permissions.UserManagement?.viewUsers || false;
  const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const canManageUserRoles = isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;
  const canViewOrganizations = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;
  const isAdmin = currentUser?.role?.name === "admin" || isSuperAdmin;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleProfileSuccess = () => {
    setShowProfileModal(false);
    window.location.reload();
  };

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
      <div className={`fixed top-0 left-0 h-full w-64 bg-card border-r shadow-lg z-50 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start"
            onClick={toggleMobileMenu}
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        {/* NEW: Profile section for mobile sidebar */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{currentUser.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.role?.name}</p>
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
            <UserIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-full flex items-center px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText className="h-4 w-4 mr-3" />
            Dashboard
          </NavLink>

          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `w-full flex items-center px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent/50"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FileText className="h-4 w-4 mr-3" />
            Documents
          </NavLink>

          {canViewAnalytics && (
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `w-full flex items-center px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/50"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Analytics
            </NavLink>
          )}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-3">
                  Admin
                </h3>
              </div>

              {canViewUsers && (
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `w-full flex items-center px-3 py-2 rounded-md transition ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-4 w-4 mr-3" />
                  Users
                </NavLink>
              )}

              {canManageUserRoles && (
                <NavLink
                  to="/roles"
                  className={({ isActive }) =>
                    `w-full flex items-center px-3 py-2 rounded-md transition ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Roles
                </NavLink>
              )}
            </>
          )}

          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full mt-4"
            onClick={() => {
              onLogout?.();
              setIsMobileMenuOpen(false);
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </nav>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
        {/* Header */}
        <header className="border-b bg-card shadow-soft">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMobileMenu}
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <NavLink to="/dashboard" className="flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    <h1 className="text-xl sm:text-2xl font-bold text-primary hidden sm:block">
                      ContractHub
                    </h1>
                    <h1 className="text-lg font-bold text-primary sm:hidden">
                      CH
                    </h1>
                  </div>
                </NavLink>
                <div className="hidden md:block ml-4 sm:ml-8">
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Welcome back,{" "}
                    <span className="font-medium text-foreground">
                      {currentUser.username || currentUser.fullName}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-muted-foreground">Role:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin
                        ? "bg-primary-light text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {currentUser.role?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                  className="hidden sm:inline-flex"
                  title="Update Profile & Organization"
                >
                  <UserIcon className="h-4 w-4 mr-1" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="hidden sm:inline-flex"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
                {/* Mobile profile and logout buttons */}
                <div className="flex gap-1 sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <UserIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden md:block w-64 bg-card border-r shadow-soft flex-shrink-0">
            <nav className="p-6 space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <FileText className="h-4 w-4 mr-3" />
                Dashboard
              </NavLink>

              <NavLink
                to="/documents"
                className={({ isActive }) =>
                  `w-full flex items-center px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-accent/50"
                  }`
                }
              >
                <FileText className="h-4 w-4 mr-3" />
                Documents
              </NavLink>

              {canViewAnalytics && (
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `w-full flex items-center px-3 py-2 rounded-md transition ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    }`
                  }
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Analytics
                </NavLink>
              )}

              {isAdmin && (
                <>
                  <div className="pt-4 pb-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-3">
                      Admin
                    </h3>
                  </div>

                  {canViewUsers && (
                    <NavLink
                      to="/users"
                      className={({ isActive }) =>
                        `w-full flex items-center px-3 py-2 rounded-md transition ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        }`
                      }
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Users
                    </NavLink>
                  )}

                  {canManageUserRoles && (
                    <NavLink
                      to="/roles"
                      className={({ isActive }) =>
                        `w-full flex items-center px-3 py-2 rounded-md transition ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        }`
                      }
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Roles
                    </NavLink>
                  )}
                </>
              )}

              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full mt-4"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
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