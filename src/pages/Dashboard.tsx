// // // // src/pages/Dashboard.tsx
// // // import { useState, useEffect, useMemo } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // import { AnalyticsCharts } from "../components/AnalyticsCharts";
// // // import DashboardStats from "../components/DashboardStats";
// // // import DocumentCard from "../components/DocumentCard";
// // // import DocumentUpload from "../components/DocumentUpload";
// // // import { Layout } from "../components/Layout";
// // // import NotificationsModal from "../components/NotificationsModal";
// // // import OrganizationFolders from "../components/OrganizationFolders";
// // // import OrganizationCard from "../components/OrganizationCard";
// // // import { RoleManagement } from "../components/RoleManagement";
// // // import { UserManagement } from "../components/UserManagement";
// // // import type { Document } from "../types/index";
// // // import { Button } from "../components/ui/button";
// // // import { Input } from "../components/ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "../components/ui/select";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogFooter,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "../components/ui/dialog";
// // // import { Label } from "../components/ui/label";
// // // import { toast } from "sonner";
// // // import {
// // //   Search,
// // //   Filter,
// // //   FolderOpen,
// // //   Grid3X3,
// // //   Building,
// // //   FileText,
// // //   Upload,
// // //   BarChart3,
// // //   Users,
// // //   Shield,
// // //   Plus,
// // //   Menu,
// // //   X,
// // //   ChevronLeft,
// // //   ChevronRight,
// // // } from "lucide-react";
// // // import { useAuthContext } from "../contexts/AuthContext";
// // // import { documentService, organizationService } from "../lib/api";

// // // const DOCS_PAGE_SIZE = 36;

// // // const Dashboard = () => {
// // //   const queryClient = useQueryClient();
// // //   const {
// // //     user,
// // //     logout,
// // //     isLoading: authLoading,
// // //     isAuthenticated,
// // //   } = useAuthContext();
// // //   const navigate = useNavigate();

// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [filterType, setFilterType] = useState("all");
// // //   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
// // //     "grid"
// // //   );
// // //   const [activeTab, setActiveTab] = useState("documents");
// // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // //   const [currentPage, setCurrentPage] = useState(1);

// // //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// // //   const [newFolderName, setNewFolderName] = useState("");
// // //   const [newFolderType, setNewFolderType] = useState("tech");

// // //   const roleNameLower = user?.role?.name?.toLowerCase() || "";
// // //   const isSuperAdmin = roleNameLower.includes("superadmin");
// // //   const permissions = user?.role?.permissions || {};

// // //   const canViewDocuments =
// // //     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
// // //   const canUploadDocuments =
// // //     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
// // //   const canDeleteDocuments =
// // //     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
// // //   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
// // //   const canManageUserRoles =
// // //     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
// // //   const canViewOrganizations =
// // //     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
// // //   const canCreateOrganizations =
// // //     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;
// // //   const canEditOrganizations =
// // //     isSuperAdmin || permissions.OrganizationManagement?.editOrganizations;
// // //   const canDeleteOrganizations =
// // //     isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations;
// // //   const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

// // //   useEffect(() => {
// // //     setCurrentPage(1);
// // //   }, [searchTerm, filterType]);

// // //   useEffect(() => {
// // //     if (!authLoading && !isAuthenticated) {
// // //       toast.error("Please log in to access the dashboard");
// // //       navigate("/login", { replace: true });
// // //     }
// // //   }, [authLoading, isAuthenticated, navigate]);

// // //   useEffect(() => {
// // //     if (!user || authLoading) return;
// // //     const saved = localStorage.getItem("dashboardTab");
// // //     const validTabs = [
// // //       "documents",
// // //       canUploadDocuments && "upload",
// // //       canViewAnalytics && "analytics",
// // //       canViewUsers && "users",
// // //       canManageUserRoles && "roles",
// // //     ].filter(Boolean) as string[];
// // //     setActiveTab(validTabs.includes(saved!) ? saved! : "documents");
// // //   }, [
// // //     user,
// // //     authLoading,
// // //     canViewAnalytics,
// // //     canUploadDocuments,
// // //     canViewUsers,
// // //     canManageUserRoles,
// // //   ]);

// // //   const { data: notificationsData } = useQuery({
// // //     queryKey: ["notifications", user?.organization?._id],
// // //     queryFn: () =>
// // //       documentService.getNotifications(user?.organization?._id || ""),
// // //     enabled: !!user?.organization?._id && canViewDocuments,
// // //   });

// // //   const unreadCount = useMemo(
// // //     () =>
// // //       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
// // //         .length,
// // //     [notificationsData]
// // //   );

// // //   // Organizations for folders/management
// // //   const { data: organizationsData } = useQuery({
// // //     queryKey: ["organizations"],
// // //     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
// // //     enabled: canViewOrganizations,
// // //   });

// // //   const organizations = useMemo(() => {
// // //     const orgs = organizationsData?.data?.organizations || [];
// // //     return canViewOrganizations
// // //       ? orgs
// // //       : user?.organization
// // //       ? [user.organization]
// // //       : [];
// // //   }, [organizationsData, user?.organization, canViewOrganizations]);

// // //   // FAST & WORKING: Uses your actual working endpoint /api/documents/documents
// // //   // Replace the entire useQuery block with this:
// // //   const { data: docsResponse, isLoading: docsLoading } = useQuery({
// // //     queryKey: ["allDocuments", currentPage, searchTerm, filterType],
// // //     queryFn: () =>
// // //       documentService.getAllDocuments({
// // //         page: currentPage,
// // //         limit: DOCS_PAGE_SIZE,
// // //         search: searchTerm || undefined,
// // //         documentType: filterType !== "all" ? filterType : undefined,
// // //       }),
// // //     enabled: !!user && canViewDocuments,
// // //     // keepPreviousData removed — not supported in newer React Query
// // //   });

// // //   // Add proper typing:
// // //   const docsData = docsResponse?.data;
// // //   const documents: Document[] = docsData?.documents || [];
// // //   const totalPages = docsData?.totalPages || 1;
// // //   const totalDocuments = docsData?.total || 0;

// // //   const handleCreateFolder = async () => {
// // //     if (!newFolderName.trim()) return toast.error("Folder name required");
// // //     try {
// // //       await organizationService.createOrganization({
// // //         name: newFolderName.trim(),
// // //         organizationType: newFolderType,
// // //       });
// // //       queryClient.invalidateQueries({ queryKey: ["organizations"] });
// // //       toast.success(`Folder "${newFolderName}" created`);
// // //       setIsCreateOpen(false);
// // //       setNewFolderName("");
// // //     } catch (err: any) {
// // //       toast.error(err.response?.data?.message || "Failed to create folder");
// // //     }
// // //   };

// // //   const handleTabChange = (tab: string) => {
// // //     setActiveTab(tab);
// // //     localStorage.setItem("dashboardTab", tab);
// // //     setMobileMenuOpen(false);
// // //   };

// // //   if (authLoading || !user) {
// // //     return (
// // //       <Layout user={undefined}>
// // //         <div className="flex items-center justify-center h-64">
// // //           <div className="text-muted-foreground">Loading dashboard...</div>
// // //         </div>
// // //       </Layout>
// // //     );
// // //   }

// // //   return (
// // //     <Layout user={user} onLogout={logout}>
// // //       <div className="min-h-screen bg-background">
// // //         {/* Top Bar */}
// // //         <div className="border-b bg-card sticky top-0 z-40">
// // //           <div className="flex items-center justify-between h-16 px-4">
// // //             <div className="flex items-center gap-4 flex-1">
// // //               <button
// // //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // //                 className="lg:hidden"
// // //               >
// // //                 {mobileMenuOpen ? (
// // //                   <X className="h-5 w-5" />
// // //                 ) : (
// // //                   <Menu className="h-5 w-5" />
// // //                 )}
// // //               </button>
// // //               <h1 className="text-xl font-semibold">Dashboard</h1>
// // //             </div>
// // //             <div className="flex items-center gap-3">
// // //               <NotificationsModal unreadCount={unreadCount} />
// // //               <div className="hidden sm:block text-sm text-muted-foreground">
// // //                 {user.fullName || user.email}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="flex flex-1">
// // //           <aside
// // //             className={`${
// // //               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
// // //             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 pt-20 lg:pt-6`}
// // //           >
// // //             <nav className="space-y-1 px-3">
// // //               {[
// // //                 {
// // //                   id: "documents",
// // //                   label: "Documents",
// // //                   icon: FileText,
// // //                   show: true,
// // //                 },
// // //                 {
// // //                   id: "upload",
// // //                   label: "Upload",
// // //                   icon: Upload,
// // //                   show: canUploadDocuments,
// // //                 },
// // //                 {
// // //                   id: "analytics",
// // //                   label: "Analytics",
// // //                   icon: BarChart3,
// // //                   show: canViewAnalytics,
// // //                 },
// // //                 {
// // //                   id: "users",
// // //                   label: "Users",
// // //                   icon: Users,
// // //                   show: canViewUsers,
// // //                 },
// // //                 {
// // //                   id: "roles",
// // //                   label: "Roles & Permissions",
// // //                   icon: Shield,
// // //                   show: canManageUserRoles,
// // //                 },
// // //               ]
// // //                 .filter((item) => item.show)
// // //                 .map(({ id, label, icon: Icon }) => (
// // //                   <button
// // //                     key={id}
// // //                     onClick={() => handleTabChange(id)}
// // //                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
// // //                       activeTab === id
// // //                         ? "bg-primary text-primary-foreground"
// // //                         : "hover:bg-muted"
// // //                     }`}
// // //                   >
// // //                     <Icon className="h-4 w-4" />
// // //                     <span className="text-sm font-medium">{label}</span>
// // //                   </button>
// // //                 ))}
// // //             </nav>
// // //           </aside>

// // //           <main className="flex-1 p-4 lg:p-8 overflow-auto">
// // //             {activeTab === "documents" && (
// // //               <>
// // //                 <div className="mb-6">
// // //                   <DashboardStats
// // //                     totalDocuments={totalDocuments}
// // //                     recentUploads={
// // //                       documents.filter(
// // //                         (d: Document) =>
// // //                           new Date(d.createdAt) >
// // //                           new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
// // //                       ).length
// // //                     }
// // //                     isAdmin={canViewUsers || canManageUserRoles}
// // //                   />
// // //                 </div>

// // //                 <div className="space-y-6">
// // //                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
// // //                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
// // //                       <div className="relative">
// // //                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// // //                         <Input
// // //                           placeholder="Search documents..."
// // //                           value={searchTerm}
// // //                           onChange={(e) => setSearchTerm(e.target.value)}
// // //                           className="pl-10 w-full sm:w-80"
// // //                         />
// // //                       </div>
// // //                       <Select value={filterType} onValueChange={setFilterType}>
// // //                         <SelectTrigger className="w-full sm:w-48">
// // //                           <Filter className="h-4 w-4 mr-2" />
// // //                           <SelectValue />
// // //                         </SelectTrigger>
// // //                         <SelectContent>
// // //                           <SelectItem value="all">All Types</SelectItem>
// // //                           <SelectItem value="Contract">Contracts</SelectItem>
// // //                           <SelectItem value="SLA">SLAs</SelectItem>
// // //                           <SelectItem value="NDA">NDAs</SelectItem>
// // //                           <SelectItem value="Other">Other</SelectItem>
// // //                         </SelectContent>
// // //                       </Select>
// // //                     </div>

// // //                     <div className="flex gap-2">
// // //                       {canCreateOrganizations && (
// // //                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
// // //                           <Plus className="h-4 w-4 mr-2" />
// // //                           New Folder
// // //                         </Button>
// // //                       )}
// // //                       <div className="flex bg-muted rounded-lg p-1">
// // //                         <Button
// // //                           variant={viewMode === "grid" ? "default" : "ghost"}
// // //                           size="sm"
// // //                           onClick={() => setViewMode("grid")}
// // //                         >
// // //                           <Grid3X3 className="h-4 w-4" />
// // //                         </Button>
// // //                         <Button
// // //                           variant={viewMode === "folders" ? "default" : "ghost"}
// // //                           size="sm"
// // //                           onClick={() => setViewMode("folders")}
// // //                           disabled={!canViewOrganizations}
// // //                         >
// // //                           <FolderOpen className="h-4 w-4" />
// // //                         </Button>
// // //                         <Button
// // //                           variant={
// // //                             viewMode === "management" ? "default" : "ghost"
// // //                           }
// // //                           size="sm"
// // //                           onClick={() => setViewMode("management")}
// // //                           disabled={!canViewOrganizations}
// // //                         >
// // //                           <Building className="h-4 w-4" />
// // //                         </Button>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {docsLoading ? (
// // //                     <div className="text-center py-12 text-muted-foreground">
// // //                       Loading documents...
// // //                     </div>
// // //                   ) : viewMode === "management" ? (
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// // //                       {organizations.map((org) => (
// // //                         <OrganizationCard
// // //                           key={org._id}
// // //                           organization={org}
// // //                           canEditOrganizations={canEditOrganizations}
// // //                           canDeleteOrganizations={canDeleteOrganizations}
// // //                           onDelete={() =>
// // //                             organizationService
// // //                               .deleteOrganization(org._id)
// // //                               .then(() => {
// // //                                 queryClient.invalidateQueries({
// // //                                   queryKey: ["organizations"],
// // //                                 });
// // //                                 toast.success("Folder deleted");
// // //                               })
// // //                           }
// // //                           onUpdate={() =>
// // //                             queryClient.invalidateQueries({
// // //                               queryKey: ["organizations"],
// // //                             })
// // //                           }
// // //                         />
// // //                       ))}
// // //                     </div>
// // //                   ) : viewMode === "folders" ? (
// // //                     <OrganizationFolders
// // //                       documents={documents}
// // //                       organizations={organizations}
// // //                       currentUser={user}
// // //                     />
// // //                   ) : (
// // //                     <>
// // //                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// // //                         {documents.map((doc: Document) => (
// // //                           <DocumentCard
// // //                             key={doc._id}
// // //                             document={doc}
// // //                             canEditDocuments={
// // //                               isSuperAdmin || canDeleteDocuments
// // //                             }
// // //                             canDeleteDocuments={canDeleteDocuments}
// // //                             onView={() => window.open(doc.fileUrl, "_blank")}
// // //                             onDownload={() =>
// // //                               documentService.downloadDocument(
// // //                                 doc._id,
// // //                                 doc.name
// // //                               )
// // //                             }
// // //                             onDelete={async () => {
// // //                               await documentService.deleteDocument(doc._id);
// // //                               queryClient.invalidateQueries({
// // //                                 queryKey: ["allDocuments"],
// // //                               });
// // //                               toast.success("Document deleted");
// // //                             }}
// // //                           />
// // //                         ))}
// // //                       </div>

// // //                       {totalPages > 1 && (
// // //                         <div className="flex items-center justify-center gap-4 mt-10">
// // //                           <Button
// // //                             variant="outline"
// // //                             size="sm"
// // //                             disabled={currentPage === 1}
// // //                             onClick={() => setCurrentPage((p) => p - 1)}
// // //                           >
// // //                             <ChevronLeft className="h-4 w-4" /> Previous
// // //                           </Button>
// // //                           <span className="text-sm text-muted-foreground">
// // //                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
// // //                             total)
// // //                           </span>
// // //                           <Button
// // //                             variant="outline"
// // //                             size="sm"
// // //                             disabled={currentPage === totalPages}
// // //                             onClick={() => setCurrentPage((p) => p + 1)}
// // //                           >
// // //                             Next <ChevronRight className="h-4 w-4" />
// // //                           </Button>
// // //                         </div>
// // //                       )}
// // //                     </>
// // //                   )}

// // //                   {documents.length === 0 && !docsLoading && (
// // //                     <div className="text-center py-16 text-muted-foreground">
// // //                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
// // //                       <p>No documents found</p>
// // //                       {canUploadDocuments && (
// // //                         <Button
// // //                           onClick={() => handleTabChange("upload")}
// // //                           className="mt-4"
// // //                         >
// // //                           Upload Your First Document
// // //                         </Button>
// // //                       )}
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </>
// // //             )}

// // //             {activeTab === "upload" && canUploadDocuments && (
// // //               <DocumentUpload
// // //                 onUpload={async (file, name, type, orgId, start, expiry) => {
// // //                   await documentService.uploadDocument(
// // //                     orgId,
// // //                     file,
// // //                     name,
// // //                     type,
// // //                     start,
// // //                     expiry
// // //                   );
// // //                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
// // //                   toast.success("Uploaded successfully!");
// // //                 }}
// // //                 organizations={organizations}
// // //                 currentUserOrg={user.organization?._id}
// // //               />
// // //             )}

// // //             {activeTab === "analytics" && canViewAnalytics && (
// // //               <AnalyticsCharts
// // //                 allUsers={[]}
// // //                 allDocuments={documents}
// // //                 allOrganizations={organizations}
// // //                 userMetrics={{ totalUsers: 42 }}
// // //                 orgMetrics={{ totalOrganizations: organizations.length }}
// // //               />
// // //             )}

// // //             {activeTab === "users" && canViewUsers && <UserManagement />}
// // //             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
// // //           </main>
// // //         </div>

// // //         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
// // //           <DialogContent>
// // //             <DialogHeader>
// // //               <DialogTitle>Create New Folder</DialogTitle>
// // //               <DialogDescription>
// // //                 Organize your documents into folders (organizations)
// // //               </DialogDescription>
// // //             </DialogHeader>
// // //             <form
// // //               onSubmit={(e) => {
// // //                 e.preventDefault();
// // //                 handleCreateFolder();
// // //               }}
// // //               className="space-y-4"
// // //             >
// // //               <div>
// // //                 <Label>Folder Name</Label>
// // //                 <Input
// // //                   value={newFolderName}
// // //                   onChange={(e) => setNewFolderName(e.target.value)}
// // //                   placeholder="e.g. Vendor Contracts 2025"
// // //                   required
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Label>Type</Label>
// // //                 <Select value={newFolderType} onValueChange={setNewFolderType}>
// // //                   <SelectTrigger>
// // //                     <SelectValue />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="tech">Tech</SelectItem>
// // //                     <SelectItem value="admin">Admin</SelectItem>
// // //                     <SelectItem value="analytics">Analytics</SelectItem>
// // //                     <SelectItem value="infra">Infrastructure</SelectItem>
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>
// // //               <DialogFooter>
// // //                 <Button
// // //                   type="button"
// // //                   variant="outline"
// // //                   onClick={() => setIsCreateOpen(false)}
// // //                 >
// // //                   Cancel
// // //                 </Button>
// // //                 <Button type="submit">Create Folder</Button>
// // //               </DialogFooter>
// // //             </form>
// // //           </DialogContent>
// // //         </Dialog>
// // //       </div>
// // //     </Layout>
// // //   );
// // // };

// // // export default Dashboard;

// // // // // // // // src/pages/Dashboard.tsx (FULL UPDATED VERSION WITH TS FIXES)
// // // // // // // import { useState, useEffect, useMemo } from "react";
// // // // // // // import { useNavigate } from "react-router-dom";
// // // // // // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // // // // // import { AnalyticsCharts } from "../components/AnalyticsCharts";
// // // // // // // import DashboardStats from "../components/DashboardStats";
// // // // // // // import DocumentCard from "../components/DocumentCard";
// // // // // // // import DocumentUpload from "../components/DocumentUpload";
// // // // // // // import { Layout } from "../components/Layout";
// // // // // // // import NotificationsModal from "../components/NotificationsModal";
// // // // // // // import OrganizationFolders from "../components/OrganizationFolders";
// // // // // // // import OrganizationCard from "../components/OrganizationCard";
// // // // // // // import { RoleManagement } from "../components/RoleManagement";
// // // // // // // import { UserManagement } from "../components/UserManagement";
// // // // // // // import type { Document } from "../types/index";
// // // // // // // import { Button } from "../components/ui/button";
// // // // // // // import { Input } from "../components/ui/input";
// // // // // // // import {
// // // // // // //   Select,
// // // // // // //   SelectContent,
// // // // // // //   SelectItem,
// // // // // // //   SelectTrigger,
// // // // // // //   SelectValue,
// // // // // // // } from "../components/ui/select";
// // // // // // // import {
// // // // // // //   Dialog,
// // // // // // //   DialogContent,
// // // // // // //   DialogDescription,
// // // // // // //   DialogFooter,
// // // // // // //   DialogHeader,
// // // // // // //   DialogTitle,
// // // // // // // } from "../components/ui/dialog";
// // // // // // // import { Label } from "../components/ui/label";
// // // // // // // import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// // // // // // // import { Badge } from "../components/ui/badge";
// // // // // // // import { toast } from "sonner";
// // // // // // // import {
// // // // // // //   Search,
// // // // // // //   Filter,
// // // // // // //   FolderOpen,
// // // // // // //   Grid3X3,
// // // // // // //   Building,
// // // // // // //   FileText,
// // // // // // //   Upload,
// // // // // // //   BarChart3,
// // // // // // //   Users,
// // // // // // //   Shield,
// // // // // // //   Plus,
// // // // // // //   Menu,
// // // // // // //   X,
// // // // // // //   ChevronLeft,
// // // // // // //   ChevronRight,
// // // // // // // } from "lucide-react"; // FIXED: Removed unused UserCircle2 import
// // // // // // // import { useAuthContext } from "../contexts/AuthContext";
// // // // // // // import { documentService, organizationService } from "../lib/api";

// // // // // // // // FIXED: Define proper response type for documents
// // // // // // // type DocumentsResponse = {
// // // // // // //   documents: Document[];
// // // // // // //   total: number;
// // // // // // //   totalPages: number;
// // // // // // // };

// // // // // // // const DOCS_PAGE_SIZE = 36;

// // // // // // // const Dashboard = () => {
// // // // // // //   const queryClient = useQueryClient();
// // // // // // //   const {
// // // // // // //     user,
// // // // // // //     logout,
// // // // // // //     isLoading: authLoading,
// // // // // // //     isAuthenticated,
// // // // // // //   } = useAuthContext();
// // // // // // //   const navigate = useNavigate();

// // // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // // //   const [filterType, setFilterType] = useState("all");
// // // // // // //   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
// // // // // // //     "grid"
// // // // // // //   );
// // // // // // //   const [activeTab, setActiveTab] = useState("documents");
// // // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // // // // // //   const [currentPage, setCurrentPage] = useState(1);

// // // // // // //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// // // // // // //   const [newFolderName, setNewFolderName] = useState("");
// // // // // // //   const [newFolderType, setNewFolderType] = useState("tech");

// // // // // // //   const roleNameLower = user?.role?.name?.toLowerCase() || "";
// // // // // // //   const isSuperAdmin = roleNameLower.includes("superadmin");
// // // // // // //   const permissions = user?.role?.permissions || {};

// // // // // // //   const canViewDocuments =
// // // // // // //     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
// // // // // // //   const canUploadDocuments =
// // // // // // //     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
// // // // // // //   const canDeleteDocuments =
// // // // // // //     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
// // // // // // //   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
// // // // // // //   const canManageUserRoles =
// // // // // // //     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
// // // // // // //   const canViewOrganizations =
// // // // // // //     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
// // // // // // //   const canCreateOrganizations =
// // // // // // //     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;
// // // // // // //   const canEditOrganizations =
// // // // // // //     isSuperAdmin || permissions.OrganizationManagement?.editOrganizations;
// // // // // // //   const canDeleteOrganizations =
// // // // // // //     isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations;
// // // // // // //   const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

// // // // // // //   const isAdmin =
// // // // // // //     isSuperAdmin ||
// // // // // // //     canViewUsers ||
// // // // // // //     canManageUserRoles ||
// // // // // // //     canCreateOrganizations;

// // // // // // //   useEffect(() => {
// // // // // // //     setCurrentPage(1);
// // // // // // //   }, [searchTerm, filterType]);

// // // // // // //   useEffect(() => {
// // // // // // //     if (!authLoading && !isAuthenticated) {
// // // // // // //       toast.error("Please log in to access the dashboard");
// // // // // // //       navigate("/login", { replace: true });
// // // // // // //     }
// // // // // // //   }, [authLoading, isAuthenticated, navigate]);

// // // // // // //   useEffect(() => {
// // // // // // //     if (!user || authLoading) return;
// // // // // // //     const saved = localStorage.getItem("dashboardTab");
// // // // // // //     const validTabs = [
// // // // // // //       "documents",
// // // // // // //       canUploadDocuments && "upload",
// // // // // // //       canViewAnalytics && "analytics",
// // // // // // //       canViewUsers && "users",
// // // // // // //       canManageUserRoles && "roles",
// // // // // // //     ].filter(Boolean) as string[];
// // // // // // //     setActiveTab(validTabs.includes(saved!) ? saved! : "documents");
// // // // // // //   }, [
// // // // // // //     user,
// // // // // // //     authLoading,
// // // // // // //     canViewAnalytics,
// // // // // // //     canUploadDocuments,
// // // // // // //     canViewUsers,
// // // // // // //     canManageUserRoles,
// // // // // // //   ]);

// // // // // // //   const { data: notificationsData } = useQuery({
// // // // // // //     queryKey: ["notifications", user?.organization?._id],
// // // // // // //     queryFn: () =>
// // // // // // //       documentService.getNotifications(user?.organization?._id || ""),
// // // // // // //     enabled: !!user?.organization?._id && canViewDocuments,
// // // // // // //   });

// // // // // // //   const unreadCount = useMemo(
// // // // // // //     () =>
// // // // // // //       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
// // // // // // //         .length,
// // // // // // //     [notificationsData]
// // // // // // //   );

// // // // // // //   const { data: organizationsData } = useQuery({
// // // // // // //     queryKey: ["organizations"],
// // // // // // //     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
// // // // // // //     enabled: canViewOrganizations || !!user?.organization,
// // // // // // //   });

// // // // // // //   const organizations = useMemo(() => {
// // // // // // //     const orgs = organizationsData?.data?.organizations || [];
// // // // // // //     return canViewOrganizations
// // // // // // //       ? orgs
// // // // // // //       : user?.organization
// // // // // // //       ? [user.organization]
// // // // // // //       : [];
// // // // // // //   }, [organizationsData, user?.organization, canViewOrganizations]);

// // // // // // //   // FIXED: Proper typing and removed keepPreviousData (not supported in v3; use staleTime if needed)
// // // // // // //   const { data: docsResponse, isLoading: docsLoading } =
// // // // // // //     useQuery<DocumentsResponse>({
// // // // // // //       queryKey: [
// // // // // // //         "allDocuments",
// // // // // // //         activeTab,
// // // // // // //         currentPage,
// // // // // // //         searchTerm,
// // // // // // //         filterType,
// // // // // // //       ],
// // // // // // //       queryFn: () =>
// // // // // // //         documentService
// // // // // // //           .getAllDocuments({
// // // // // // //             page: currentPage,
// // // // // // //             limit: DOCS_PAGE_SIZE,
// // // // // // //             search: searchTerm || undefined,
// // // // // // //             documentType: filterType !== "all" ? filterType : undefined,
// // // // // // //           })
// // // // // // //           .then((res) => res.data), // FIXED: Extract .data from ApiResponse
// // // // // // //       enabled: !!user && canViewDocuments && activeTab === "documents",
// // // // // // //       staleTime: 5 * 60 * 1000, // FIXED: Cache for 5 min instead of keepPreviousData
// // // // // // //     });

// // // // // // //   const documents: Document[] = docsResponse?.documents || []; // FIXED: Direct access with typing
// // // // // // //   const totalPages = docsResponse?.totalPages || 1;
// // // // // // //   const totalDocuments = docsResponse?.total || 0;

// // // // // // //   const handleCreateFolder = async (e?: React.FormEvent) => {
// // // // // // //     e?.preventDefault();
// // // // // // //     if (!newFolderName.trim()) return toast.error("Folder name required");
// // // // // // //     try {
// // // // // // //       await organizationService.createOrganization({
// // // // // // //         name: newFolderName.trim(),
// // // // // // //         organizationType: newFolderType,
// // // // // // //       });
// // // // // // //       queryClient.invalidateQueries({ queryKey: ["organizations"] });
// // // // // // //       toast.success(`Folder "${newFolderName}" created`);
// // // // // // //       setIsCreateOpen(false);
// // // // // // //       setNewFolderName("");
// // // // // // //       setNewFolderType("tech");
// // // // // // //     } catch (err: any) {
// // // // // // //       console.error("Create folder error:", err);
// // // // // // //       toast.error(err.response?.data?.message || "Failed to create folder");
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleTabChange = (tab: string) => {
// // // // // // //     setActiveTab(tab);
// // // // // // //     localStorage.setItem("dashboardTab", tab);
// // // // // // //     setMobileMenuOpen(false);
// // // // // // //     if (tab === "documents") {
// // // // // // //       setViewMode("grid");
// // // // // // //     }
// // // // // // //   };

// // // // // // //   if (authLoading || !user) {
// // // // // // //     return (
// // // // // // //       <Layout user={undefined}>
// // // // // // //         <div className="flex items-center justify-center h-64">
// // // // // // //           <div className="text-muted-foreground">Loading dashboard...</div>
// // // // // // //         </div>
// // // // // // //       </Layout>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <Layout user={user} onLogout={logout}>
// // // // // // //       <div className="min-h-screen bg-background">
// // // // // // //         {/* Top Bar */}
// // // // // // //         <div className="border-b bg-card sticky top-0 z-40">
// // // // // // //           <div className="flex items-center justify-between h-16 px-4">
// // // // // // //             <div className="flex items-center gap-4 flex-1">
// // // // // // //               <button
// // // // // // //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // // //                 className="lg:hidden"
// // // // // // //               >
// // // // // // //                 {mobileMenuOpen ? (
// // // // // // //                   <X className="h-5 w-5" />
// // // // // // //                 ) : (
// // // // // // //                   <Menu className="h-5 w-5" />
// // // // // // //                 )}
// // // // // // //               </button>
// // // // // // //               <h1 className="text-xl font-semibold">Dashboard</h1>
// // // // // // //             </div>
// // // // // // //             <div className="flex items-center gap-3">
// // // // // // //               <NotificationsModal unreadCount={unreadCount} />
// // // // // // //               <div className="hidden sm:block text-sm text-muted-foreground">
// // // // // // //                 {user.fullName || user.email}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         <div className="flex flex-1">
// // // // // // //           <aside
// // // // // // //             className={`${
// // // // // // //               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
// // // // // // //             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 pt-20 lg:pt-6`}
// // // // // // //           >
// // // // // // //             <nav className="space-y-1 px-3">
// // // // // // //               {[
// // // // // // //                 {
// // // // // // //                   id: "documents",
// // // // // // //                   label: "Documents",
// // // // // // //                   icon: FileText,
// // // // // // //                   show: true,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                   id: "upload",
// // // // // // //                   label: "Upload",
// // // // // // //                   icon: Upload,
// // // // // // //                   show: canUploadDocuments,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                   id: "analytics",
// // // // // // //                   label: "Analytics",
// // // // // // //                   icon: BarChart3,
// // // // // // //                   show: canViewAnalytics,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                   id: "users",
// // // // // // //                   label: "Users",
// // // // // // //                   icon: Users,
// // // // // // //                   show: canViewUsers,
// // // // // // //                 },
// // // // // // //                 {
// // // // // // //                   id: "roles",
// // // // // // //                   label: "Roles & Permissions",
// // // // // // //                   icon: Shield,
// // // // // // //                   show: canManageUserRoles,
// // // // // // //                 },
// // // // // // //               ]
// // // // // // //                 .filter((item) => item.show)
// // // // // // //                 .map(({ id, label, icon: Icon }) => (
// // // // // // //                   <button
// // // // // // //                     key={id}
// // // // // // //                     onClick={() => handleTabChange(id)}
// // // // // // //                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
// // // // // // //                       activeTab === id
// // // // // // //                         ? "bg-primary text-primary-foreground"
// // // // // // //                         : "hover:bg-muted"
// // // // // // //                     }`}
// // // // // // //                   >
// // // // // // //                     <Icon className="h-4 w-4" />
// // // // // // //                     <span className="text-sm font-medium">{label}</span>
// // // // // // //                   </button>
// // // // // // //                 ))}
// // // // // // //             </nav>
// // // // // // //           </aside>

// // // // // // //           <main className="flex-1 p-4 lg:p-8 overflow-auto">
// // // // // // //             {/* === WELCOME + PROFILE CARD === */}
// // // // // // //             <div className="mb-10 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-8 shadow-lg border">
// // // // // // //               <div className="flex flex-col sm:flex-row items-center gap-8">
// // // // // // //                 <Avatar className="h-28 w-28 ring-4 ring-primary/20">
// // // // // // //                   <AvatarImage src={user.profilePicture || undefined} />
// // // // // // //                   <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
// // // // // // //                     {user.fullName
// // // // // // //                       .split(" ")
// // // // // // //                       .map((n) => n[0])
// // // // // // //                       .join("")
// // // // // // //                       .toUpperCase() || "U"}
// // // // // // //                   </AvatarFallback>
// // // // // // //                 </Avatar>
// // // // // // //                 <div className="text-center sm:text-left">
// // // // // // //                   <h2 className="text-3xl font-bold text-foreground">
// // // // // // //                     Welcome back, {user.fullName} 👋
// // // // // // //                   </h2>
// // // // // // //                   <p className="text-lg text-muted-foreground mt-1">
// // // // // // //                     {user.email}
// // // // // // //                   </p>
// // // // // // //                   <div className="flex flex-wrap items-center gap-3 mt-3">
// // // // // // //                     <Badge variant="secondary" className="text-sm">
// // // // // // //                       {user.role?.name || "User"}
// // // // // // //                     </Badge>
// // // // // // //                     {user.organization && (
// // // // // // //                       <Badge variant="outline" className="text-sm">
// // // // // // //                         <Building className="h-3 w-3 mr-1" />
// // // // // // //                         {user.organization.name}
// // // // // // //                       </Badge>
// // // // // // //                     )}
// // // // // // //                     {isSuperAdmin && (
// // // // // // //                       <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
// // // // // // //                         Super Admin
// // // // // // //                       </Badge>
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             </div>

// // // // // // //             {/* === ADMIN QUICK ACTIONS === */}
// // // // // // //             {isAdmin && (
// // // // // // //               <div className="mb-12">
// // // // // // //                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
// // // // // // //                   <Shield className="h-5 w-5 text-primary" />
// // // // // // //                   Admin Quick Actions
// // // // // // //                 </h3>

// // // // // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
// // // // // // //                   {canViewUsers && (
// // // // // // //                     <button
// // // // // // //                       onClick={() => handleTabChange("users")}
// // // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // // //                     >
// // // // // // //                       <Users className="h-12 w-12 mb-4 opacity-90" />
// // // // // // //                       <p className="text-xl font-bold">Create User</p>
// // // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // // //                         Add new team member
// // // // // // //                       </p>
// // // // // // //                     </button>
// // // // // // //                   )}

// // // // // // //                   {canUploadDocuments && (
// // // // // // //                     <button
// // // // // // //                       onClick={() => handleTabChange("upload")}
// // // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // // //                     >
// // // // // // //                       <Upload className="h-12 w-12 mb-4 opacity-90" />
// // // // // // //                       <p className="text-xl font-bold">Upload Document</p>
// // // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // // //                         Add contract, NDA, SLA...
// // // // // // //                       </p>
// // // // // // //                     </button>
// // // // // // //                   )}

// // // // // // //                   {canManageUserRoles && (
// // // // // // //                     <button
// // // // // // //                       onClick={() => handleTabChange("roles")}
// // // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // // //                     >
// // // // // // //                       <Shield className="h-12 w-12 mb-4 opacity-90" />
// // // // // // //                       <p className="text-xl font-bold">Create Role</p>
// // // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // // //                         Define permissions
// // // // // // //                       </p>
// // // // // // //                     </button>
// // // // // // //                   )}

// // // // // // //                   {canCreateOrganizations && (
// // // // // // //                     <button
// // // // // // //                       onClick={() => setIsCreateOpen(true)}
// // // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // // //                     >
// // // // // // //                       <Building className="h-12 w-12 mb-4 opacity-90" />
// // // // // // //                       <p className="text-xl font-bold">New Folder</p>
// // // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // // //                         Create organization unit
// // // // // // //                       </p>
// // // // // // //                     </button>
// // // // // // //                   )}
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //             )}

// // // // // // //             {/* === DOCUMENTS TAB CONTENT === */}
// // // // // // //             {activeTab === "documents" && (
// // // // // // //               <>
// // // // // // //                 {!isAdmin && (
// // // // // // //                   <div className="mb-6">
// // // // // // //                     <DashboardStats
// // // // // // //                       totalDocuments={totalDocuments}
// // // // // // //                       recentUploads={
// // // // // // //                         documents.filter(
// // // // // // //                           (d: Document) =>
// // // // // // //                             new Date(d.createdAt) >
// // // // // // //                             new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
// // // // // // //                         ).length
// // // // // // //                       }
// // // // // // //                       isAdmin={isAdmin}
// // // // // // //                     />
// // // // // // //                   </div>
// // // // // // //                 )}

// // // // // // //                 <div className="space-y-6">
// // // // // // //                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
// // // // // // //                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
// // // // // // //                       <div className="relative">
// // // // // // //                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// // // // // // //                         <Input
// // // // // // //                           placeholder="Search documents..."
// // // // // // //                           value={searchTerm}
// // // // // // //                           onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // //                           className="pl-10 w-full sm:w-80"
// // // // // // //                         />
// // // // // // //                       </div>
// // // // // // //                       <Select value={filterType} onValueChange={setFilterType}>
// // // // // // //                         <SelectTrigger className="w-full sm:w-48">
// // // // // // //                           <Filter className="h-4 w-4 mr-2" />
// // // // // // //                           <SelectValue />
// // // // // // //                         </SelectTrigger>
// // // // // // //                         <SelectContent>
// // // // // // //                           <SelectItem value="all">All Types</SelectItem>
// // // // // // //                           <SelectItem value="Contract">Contracts</SelectItem>
// // // // // // //                           <SelectItem value="SLA">SLAs</SelectItem>
// // // // // // //                           <SelectItem value="NDA">NDAs</SelectItem>
// // // // // // //                           <SelectItem value="Other">Other</SelectItem>
// // // // // // //                         </SelectContent>
// // // // // // //                       </Select>
// // // // // // //                     </div>

// // // // // // //                     <div className="flex gap-2">
// // // // // // //                       {canCreateOrganizations && (
// // // // // // //                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
// // // // // // //                           <Plus className="h-4 w-4 mr-2" />
// // // // // // //                           New Folder
// // // // // // //                         </Button>
// // // // // // //                       )}
// // // // // // //                       <div className="flex bg-muted rounded-lg p-1">
// // // // // // //                         <Button
// // // // // // //                           variant={viewMode === "grid" ? "default" : "ghost"}
// // // // // // //                           size="sm"
// // // // // // //                           onClick={() => setViewMode("grid")}
// // // // // // //                         >
// // // // // // //                           <Grid3X3 className="h-4 w-4" />
// // // // // // //                         </Button>
// // // // // // //                         <Button
// // // // // // //                           variant={viewMode === "folders" ? "default" : "ghost"}
// // // // // // //                           size="sm"
// // // // // // //                           onClick={() => setViewMode("folders")}
// // // // // // //                           disabled={!canViewOrganizations}
// // // // // // //                         >
// // // // // // //                           <FolderOpen className="h-4 w-4" />
// // // // // // //                         </Button>
// // // // // // //                         <Button
// // // // // // //                           variant={
// // // // // // //                             viewMode === "management" ? "default" : "ghost"
// // // // // // //                           }
// // // // // // //                           size="sm"
// // // // // // //                           onClick={() => setViewMode("management")}
// // // // // // //                           disabled={!canViewOrganizations}
// // // // // // //                         >
// // // // // // //                           <Building className="h-4 w-4" />
// // // // // // //                         </Button>
// // // // // // //                       </div>
// // // // // // //                     </div>
// // // // // // //                   </div>

// // // // // // //                   {docsLoading ? (
// // // // // // //                     <div className="text-center py-12 text-muted-foreground">
// // // // // // //                       Loading documents...
// // // // // // //                     </div>
// // // // // // //                   ) : viewMode === "management" ? (
// // // // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// // // // // // //                       {organizations.map((org) => (
// // // // // // //                         <OrganizationCard
// // // // // // //                           key={org._id}
// // // // // // //                           organization={org}
// // // // // // //                           canEditOrganizations={canEditOrganizations}
// // // // // // //                           canDeleteOrganizations={canDeleteOrganizations}
// // // // // // //                           onDelete={() =>
// // // // // // //                             organizationService
// // // // // // //                               .deleteOrganization(org._id)
// // // // // // //                               .then(() => {
// // // // // // //                                 queryClient.invalidateQueries({
// // // // // // //                                   queryKey: ["organizations"],
// // // // // // //                                 });
// // // // // // //                                 toast.success("Folder deleted");
// // // // // // //                               })
// // // // // // //                           }
// // // // // // //                           onUpdate={() =>
// // // // // // //                             queryClient.invalidateQueries({
// // // // // // //                               queryKey: ["organizations"],
// // // // // // //                             })
// // // // // // //                           }
// // // // // // //                         />
// // // // // // //                       ))}
// // // // // // //                     </div>
// // // // // // //                   ) : viewMode === "folders" ? (
// // // // // // //                     <OrganizationFolders
// // // // // // //                       documents={documents}
// // // // // // //                       organizations={organizations}
// // // // // // //                       currentUser={user}
// // // // // // //                     />
// // // // // // //                   ) : (
// // // // // // //                     <>
// // // // // // //                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// // // // // // //                         {documents.map((doc: Document) => (
// // // // // // //                           <DocumentCard
// // // // // // //                             key={doc._id}
// // // // // // //                             document={doc}
// // // // // // //                             canEditDocuments={
// // // // // // //                               isSuperAdmin || canDeleteDocuments
// // // // // // //                             }
// // // // // // //                             canDeleteDocuments={canDeleteDocuments}
// // // // // // //                             onView={() => window.open(doc.fileUrl, "_blank")}
// // // // // // //                             onDownload={() =>
// // // // // // //                               documentService.downloadDocument(
// // // // // // //                                 doc._id,
// // // // // // //                                 doc.name
// // // // // // //                               )
// // // // // // //                             }
// // // // // // //                             onDelete={async () => {
// // // // // // //                               await documentService.deleteDocument(doc._id);
// // // // // // //                               queryClient.invalidateQueries({
// // // // // // //                                 queryKey: ["allDocuments"],
// // // // // // //                               });
// // // // // // //                               toast.success("Document deleted");
// // // // // // //                             }}
// // // // // // //                           />
// // // // // // //                         ))}
// // // // // // //                       </div>

// // // // // // //                       {totalPages > 1 && (
// // // // // // //                         <div className="flex items-center justify-center gap-4 mt-10">
// // // // // // //                           <Button
// // // // // // //                             variant="outline"
// // // // // // //                             size="sm"
// // // // // // //                             disabled={currentPage === 1}
// // // // // // //                             onClick={() => setCurrentPage((p) => p - 1)}
// // // // // // //                           >
// // // // // // //                             <ChevronLeft className="h-4 w-4" /> Previous
// // // // // // //                           </Button>
// // // // // // //                           <span className="text-sm text-muted-foreground">
// // // // // // //                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
// // // // // // //                             total)
// // // // // // //                           </span>
// // // // // // //                           <Button
// // // // // // //                             variant="outline"
// // // // // // //                             size="sm"
// // // // // // //                             disabled={currentPage === totalPages}
// // // // // // //                             onClick={() => setCurrentPage((p) => p + 1)}
// // // // // // //                           >
// // // // // // //                             Next <ChevronRight className="h-4 w-4" />
// // // // // // //                           </Button>
// // // // // // //                         </div>
// // // // // // //                       )}
// // // // // // //                     </>
// // // // // // //                   )}

// // // // // // //                   {documents.length === 0 && !docsLoading && (
// // // // // // //                     <div className="text-center py-16 text-muted-foreground">
// // // // // // //                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
// // // // // // //                       <p>No documents found</p>
// // // // // // //                       {canUploadDocuments && (
// // // // // // //                         <Button
// // // // // // //                           onClick={() => handleTabChange("upload")}
// // // // // // //                           className="mt-4"
// // // // // // //                         >
// // // // // // //                           Upload Your First Document
// // // // // // //                         </Button>
// // // // // // //                       )}
// // // // // // //                     </div>
// // // // // // //                   )}
// // // // // // //                 </div>
// // // // // // //               </>
// // // // // // //             )}

// // // // // // //             {activeTab === "upload" && canUploadDocuments && (
// // // // // // //               <DocumentUpload
// // // // // // //                 onUpload={async (file, name, type, orgId, start, expiry) => {
// // // // // // //                   await documentService.uploadDocument(
// // // // // // //                     orgId,
// // // // // // //                     file,
// // // // // // //                     name,
// // // // // // //                     type,
// // // // // // //                     start,
// // // // // // //                     expiry
// // // // // // //                   );
// // // // // // //                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
// // // // // // //                   toast.success("Uploaded successfully!");
// // // // // // //                 }}
// // // // // // //                 organizations={organizations}
// // // // // // //                 currentUserOrg={user.organization?._id}
// // // // // // //               />
// // // // // // //             )}

// // // // // // //             {activeTab === "analytics" && canViewAnalytics && (
// // // // // // //               <AnalyticsCharts
// // // // // // //                 allUsers={[]}
// // // // // // //                 allDocuments={documents}
// // // // // // //                 allOrganizations={organizations}
// // // // // // //                 userMetrics={{ totalUsers: 42 }}
// // // // // // //                 orgMetrics={{ totalOrganizations: organizations.length }}
// // // // // // //               />
// // // // // // //             )}

// // // // // // //             {activeTab === "users" && canViewUsers && <UserManagement />}
// // // // // // //             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
// // // // // // //           </main>
// // // // // // //         </div>

// // // // // // //         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
// // // // // // //           <DialogContent>
// // // // // // //             <DialogHeader>
// // // // // // //               <DialogTitle>Create New Folder</DialogTitle>
// // // // // // //               <DialogDescription>
// // // // // // //                 Organize your documents into folders (organizations)
// // // // // // //               </DialogDescription>
// // // // // // //             </DialogHeader>
// // // // // // //             <form onSubmit={handleCreateFolder} className="space-y-4">
// // // // // // //               <div>
// // // // // // //                 <Label>Folder Name</Label>
// // // // // // //                 <Input
// // // // // // //                   value={newFolderName}
// // // // // // //                   onChange={(e) => setNewFolderName(e.target.value)}
// // // // // // //                   placeholder="e.g. Vendor Contracts 2025"
// // // // // // //                   required
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //               <div>
// // // // // // //                 <Label>Type</Label>
// // // // // // //                 <Select value={newFolderType} onValueChange={setNewFolderType}>
// // // // // // //                   <SelectTrigger>
// // // // // // //                     <SelectValue />
// // // // // // //                   </SelectTrigger>
// // // // // // //                   <SelectContent>
// // // // // // //                     <SelectItem value="tech">Tech</SelectItem>
// // // // // // //                     <SelectItem value="admin">Admin</SelectItem>
// // // // // // //                     <SelectItem value="analytics">Analytics</SelectItem>
// // // // // // //                     <SelectItem value="infra">Infrastructure</SelectItem>
// // // // // // //                   </SelectContent>
// // // // // // //                 </Select>
// // // // // // //               </div>
// // // // // // //               <DialogFooter>
// // // // // // //                 <Button
// // // // // // //                   type="button"
// // // // // // //                   variant="outline"
// // // // // // //                   onClick={() => setIsCreateOpen(false)}
// // // // // // //                 >
// // // // // // //                   Cancel
// // // // // // //                 </Button>
// // // // // // //                 <Button type="submit">Create Folder</Button>
// // // // // // //               </DialogFooter>
// // // // // // //             </form>
// // // // // // //           </DialogContent>
// // // // // // //         </Dialog>
// // // // // // //       </div>
// // // // // // //     </Layout>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Dashboard;

// // // // // // // src/pages/Dashboard.tsx (FULL UPDATED VERSION WITH WELCOME REMOVED)
// // // // // // import { useState, useEffect, useMemo } from "react";
// // // // // // import { useNavigate } from "react-router-dom";
// // // // // // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // // // // // import { AnalyticsCharts } from "../components/AnalyticsCharts";
// // // // // // import DashboardStats from "../components/DashboardStats";
// // // // // // import DocumentCard from "../components/DocumentCard";
// // // // // // import DocumentUpload from "../components/DocumentUpload";
// // // // // // import { Layout } from "../components/Layout";
// // // // // // import NotificationsModal from "../components/NotificationsModal";
// // // // // // import OrganizationFolders from "../components/OrganizationFolders";
// // // // // // import OrganizationCard from "../components/OrganizationCard";
// // // // // // import { RoleManagement } from "../components/RoleManagement";
// // // // // // import { UserManagement } from "../components/UserManagement";
// // // // // // import type { Document } from "../types/index";
// // // // // // import { Button } from "../components/ui/button";
// // // // // // import { Input } from "../components/ui/input";
// // // // // // import {
// // // // // //   Select,
// // // // // //   SelectContent,
// // // // // //   SelectItem,
// // // // // //   SelectTrigger,
// // // // // //   SelectValue,
// // // // // // } from "../components/ui/select";
// // // // // // import {
// // // // // //   Dialog,
// // // // // //   DialogContent,
// // // // // //   DialogDescription,
// // // // // //   DialogFooter,
// // // // // //   DialogHeader,
// // // // // //   DialogTitle,
// // // // // // } from "../components/ui/dialog";
// // // // // // import { Label } from "../components/ui/label";
// // // // // // import { toast } from "sonner";
// // // // // // import {
// // // // // //   Search,
// // // // // //   Filter,
// // // // // //   FolderOpen,
// // // // // //   Grid3X3,
// // // // // //   Building,
// // // // // //   FileText,
// // // // // //   Upload,
// // // // // //   BarChart3,
// // // // // //   Users,
// // // // // //   Shield,
// // // // // //   Plus,
// // // // // //   Menu,
// // // // // //   X,
// // // // // //   ChevronLeft,
// // // // // //   ChevronRight,
// // // // // // } from "lucide-react";
// // // // // // import { useAuthContext } from "../contexts/AuthContext";
// // // // // // import { documentService, organizationService } from "../lib/api";

// // // // // // // FIXED: Define proper response type for documents
// // // // // // type DocumentsResponse = {
// // // // // //   documents: Document[];
// // // // // //   total: number;
// // // // // //   totalPages: number;
// // // // // // };

// // // // // // const DOCS_PAGE_SIZE = 36;

// // // // // // const Dashboard = () => {
// // // // // //   const queryClient = useQueryClient();
// // // // // //   const {
// // // // // //     user,
// // // // // //     logout,
// // // // // //     isLoading: authLoading,
// // // // // //     isAuthenticated,
// // // // // //   } = useAuthContext();
// // // // // //   const navigate = useNavigate();

// // // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // // //   const [filterType, setFilterType] = useState("all");
// // // // // //   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
// // // // // //     "grid"
// // // // // //   );
// // // // // //   const [activeTab, setActiveTab] = useState("documents");
// // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// // // // // //   const [currentPage, setCurrentPage] = useState(1);

// // // // // //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// // // // // //   const [newFolderName, setNewFolderName] = useState("");
// // // // // //   const [newFolderType, setNewFolderType] = useState("tech");

// // // // // //   const roleNameLower = user?.role?.name?.toLowerCase() || "";
// // // // // //   const isSuperAdmin = roleNameLower.includes("superadmin");
// // // // // //   const permissions = user?.role?.permissions || {};

// // // // // //   const canViewDocuments =
// // // // // //     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
// // // // // //   const canUploadDocuments =
// // // // // //     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
// // // // // //   const canDeleteDocuments =
// // // // // //     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
// // // // // //   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
// // // // // //   const canManageUserRoles =
// // // // // //     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
// // // // // //   const canViewOrganizations =
// // // // // //     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
// // // // // //   const canCreateOrganizations =
// // // // // //     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;
// // // // // //   const canEditOrganizations =
// // // // // //     isSuperAdmin || permissions.OrganizationManagement?.editOrganizations;
// // // // // //   const canDeleteOrganizations =
// // // // // //     isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations;
// // // // // //   const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

// // // // // //   const isAdmin =
// // // // // //     isSuperAdmin ||
// // // // // //     canViewUsers ||
// // // // // //     canManageUserRoles ||
// // // // // //     canCreateOrganizations;

// // // // // //   useEffect(() => {
// // // // // //     setCurrentPage(1);
// // // // // //   }, [searchTerm, filterType]);

// // // // // //   useEffect(() => {
// // // // // //     if (!authLoading && !isAuthenticated) {
// // // // // //       toast.error("Please log in to access the dashboard");
// // // // // //       navigate("/login", { replace: true });
// // // // // //     }
// // // // // //   }, [authLoading, isAuthenticated, navigate]);

// // // // // //   useEffect(() => {
// // // // // //     if (!user || authLoading) return;
// // // // // //     const saved = localStorage.getItem("dashboardTab");
// // // // // //     const validTabs = [
// // // // // //       "documents",
// // // // // //       canUploadDocuments && "upload",
// // // // // //       canViewAnalytics && "analytics",
// // // // // //       canViewUsers && "users",
// // // // // //       canManageUserRoles && "roles",
// // // // // //     ].filter(Boolean) as string[];
// // // // // //     setActiveTab(validTabs.includes(saved!) ? saved! : "documents");
// // // // // //   }, [
// // // // // //     user,
// // // // // //     authLoading,
// // // // // //     canViewAnalytics,
// // // // // //     canUploadDocuments,
// // // // // //     canViewUsers,
// // // // // //     canManageUserRoles,
// // // // // //   ]);

// // // // // //   const { data: notificationsData } = useQuery({
// // // // // //     queryKey: ["notifications", user?.organization?._id],
// // // // // //     queryFn: () =>
// // // // // //       documentService.getNotifications(user?.organization?._id || ""),
// // // // // //     enabled: !!user?.organization?._id && canViewDocuments,
// // // // // //   });

// // // // // //   const unreadCount = useMemo(
// // // // // //     () =>
// // // // // //       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
// // // // // //         .length,
// // // // // //     [notificationsData]
// // // // // //   );

// // // // // //   const { data: organizationsData } = useQuery({
// // // // // //     queryKey: ["organizations"],
// // // // // //     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
// // // // // //     enabled: canViewOrganizations || !!user?.organization,
// // // // // //   });

// // // // // //   const organizations = useMemo(() => {
// // // // // //     const orgs = organizationsData?.data?.organizations || [];
// // // // // //     return canViewOrganizations
// // // // // //       ? orgs
// // // // // //       : user?.organization
// // // // // //       ? [user.organization]
// // // // // //       : [];
// // // // // //   }, [organizationsData, user?.organization, canViewOrganizations]);

// // // // // //   const { data: docsResponse, isLoading: docsLoading } =
// // // // // //     useQuery<DocumentsResponse>({
// // // // // //       queryKey: [
// // // // // //         "allDocuments",
// // // // // //         activeTab,
// // // // // //         currentPage,
// // // // // //         searchTerm,
// // // // // //         filterType,
// // // // // //       ],
// // // // // //       queryFn: () =>
// // // // // //         documentService
// // // // // //           .getAllDocuments({
// // // // // //             page: currentPage,
// // // // // //             limit: DOCS_PAGE_SIZE,
// // // // // //             search: searchTerm || undefined,
// // // // // //             documentType: filterType !== "all" ? filterType : undefined,
// // // // // //           })
// // // // // //           .then((res) => res.data),
// // // // // //       enabled: !!user && canViewDocuments && activeTab === "documents",
// // // // // //       staleTime: 5 * 60 * 1000,
// // // // // //     });

// // // // // //   const documents: Document[] = docsResponse?.documents || [];
// // // // // //   const totalPages = docsResponse?.totalPages || 1;
// // // // // //   const totalDocuments = docsResponse?.total || 0;

// // // // // //   const handleCreateFolder = async (e?: React.FormEvent) => {
// // // // // //     e?.preventDefault();
// // // // // //     if (!newFolderName.trim()) return toast.error("Folder name required");
// // // // // //     try {
// // // // // //       await organizationService.createOrganization({
// // // // // //         name: newFolderName.trim(),
// // // // // //         organizationType: newFolderType,
// // // // // //       });
// // // // // //       queryClient.invalidateQueries({ queryKey: ["organizations"] });
// // // // // //       toast.success(`Folder "${newFolderName}" created`);
// // // // // //       setIsCreateOpen(false);
// // // // // //       setNewFolderName("");
// // // // // //       setNewFolderType("tech");
// // // // // //     } catch (err: any) {
// // // // // //       console.error("Create folder error:", err);
// // // // // //       toast.error(err.response?.data?.message || "Failed to create folder");
// // // // // //     }
// // // // // //   };

// // // // // //   const handleTabChange = (tab: string) => {
// // // // // //     setActiveTab(tab);
// // // // // //     localStorage.setItem("dashboardTab", tab);
// // // // // //     setMobileMenuOpen(false);
// // // // // //     if (tab === "documents") {
// // // // // //       setViewMode("grid");
// // // // // //     }
// // // // // //   };

// // // // // //   if (authLoading || !user) {
// // // // // //     return (
// // // // // //       <Layout user={undefined}>
// // // // // //         <div className="flex items-center justify-center h-64">
// // // // // //           <div className="text-muted-foreground">Loading dashboard...</div>
// // // // // //         </div>
// // // // // //       </Layout>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <Layout user={user} onLogout={logout}>
// // // // // //       <div className="min-h-screen bg-background">
// // // // // //         {/* Top Bar */}
// // // // // //         <div className="border-b bg-card sticky top-0 z-40">
// // // // // //           <div className="flex items-center justify-between h-16 px-4">
// // // // // //             <div className="flex items-center gap-4 flex-1">
// // // // // //               <button
// // // // // //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // //                 className="lg:hidden"
// // // // // //               >
// // // // // //                 {mobileMenuOpen ? (
// // // // // //                   <X className="h-5 w-5" />
// // // // // //                 ) : (
// // // // // //                   <Menu className="h-5 w-5" />
// // // // // //                 )}
// // // // // //               </button>
// // // // // //               <h1 className="text-xl font-semibold">Dashboard</h1>
// // // // // //             </div>
// // // // // //             <div className="flex items-center gap-3">
// // // // // //               <NotificationsModal unreadCount={unreadCount} />
// // // // // //               <div className="hidden sm:block text-sm text-muted-foreground">
// // // // // //                 {user.fullName || user.email}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div className="flex flex-1">
// // // // // //           <aside
// // // // // //             className={`${
// // // // // //               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
// // // // // //             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 pt-20 lg:pt-6`}
// // // // // //           >
// // // // // //             <nav className="space-y-1 px-3">
// // // // // //               {[
// // // // // //                 {
// // // // // //                   id: "documents",
// // // // // //                   label: "Documents",
// // // // // //                   icon: FileText,
// // // // // //                   show: true,
// // // // // //                 },
// // // // // //                 {
// // // // // //                   id: "upload",
// // // // // //                   label: "Upload",
// // // // // //                   icon: Upload,
// // // // // //                   show: canUploadDocuments,
// // // // // //                 },
// // // // // //                 {
// // // // // //                   id: "analytics",
// // // // // //                   label: "Analytics",
// // // // // //                   icon: BarChart3,
// // // // // //                   show: canViewAnalytics,
// // // // // //                 },
// // // // // //                 {
// // // // // //                   id: "users",
// // // // // //                   label: "Users",
// // // // // //                   icon: Users,
// // // // // //                   show: canViewUsers,
// // // // // //                 },
// // // // // //                 {
// // // // // //                   id: "roles",
// // // // // //                   label: "Roles & Permissions",
// // // // // //                   icon: Shield,
// // // // // //                   show: canManageUserRoles,
// // // // // //                 },
// // // // // //               ]
// // // // // //                 .filter((item) => item.show)
// // // // // //                 .map(({ id, label, icon: Icon }) => (
// // // // // //                   <button
// // // // // //                     key={id}
// // // // // //                     onClick={() => handleTabChange(id)}
// // // // // //                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
// // // // // //                       activeTab === id
// // // // // //                         ? "bg-primary text-primary-foreground"
// // // // // //                         : "hover:bg-muted"
// // // // // //                     }`}
// // // // // //                   >
// // // // // //                     <Icon className="h-4 w-4" />
// // // // // //                     <span className="text-sm font-medium">{label}</span>
// // // // // //                   </button>
// // // // // //                 ))}
// // // // // //             </nav>
// // // // // //           </aside>

// // // // // //           <main className="flex-1 p-4 lg:p-8 overflow-auto">
// // // // // //             {/* === ADMIN QUICK ACTIONS (Only shown to admins) === */}
// // // // // //             {isAdmin && (
// // // // // //               <div className="mb-12">
// // // // // //                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
// // // // // //                   <Shield className="h-5 w-5 text-primary" />
// // // // // //                   Admin Quick Actions
// // // // // //                 </h3>

// // // // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
// // // // // //                   {canViewUsers && (
// // // // // //                     <button
// // // // // //                       onClick={() => handleTabChange("users")}
// // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // //                     >
// // // // // //                       <Users className="h-12 w-12 mb-4 opacity-90" />
// // // // // //                       <p className="text-xl font-bold">Create User</p>
// // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // //                         Add new team member
// // // // // //                       </p>
// // // // // //                     </button>
// // // // // //                   )}

// // // // // //                   {canUploadDocuments && (
// // // // // //                     <button
// // // // // //                       onClick={() => handleTabChange("upload")}
// // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // //                     >
// // // // // //                       <Upload className="h-12 w-12 mb-4 opacity-90" />
// // // // // //                       <p className="text-xl font-bold">Upload Document</p>
// // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // //                         Add contract, NDA, SLA...
// // // // // //                       </p>
// // // // // //                     </button>
// // // // // //                   )}

// // // // // //                   {canManageUserRoles && (
// // // // // //                     <button
// // // // // //                       onClick={() => handleTabChange("roles")}
// // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // //                     >
// // // // // //                       <Shield className="h-12 w-12 mb-4 opacity-90" />
// // // // // //                       <p className="text-xl font-bold">Create Role</p>
// // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // //                         Define permissions
// // // // // //                       </p>
// // // // // //                     </button>
// // // // // //                   )}

// // // // // //                   {canCreateOrganizations && (
// // // // // //                     <button
// // // // // //                       onClick={() => setIsCreateOpen(true)}
// // // // // //                       className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all"
// // // // // //                     >
// // // // // //                       <Building className="h-12 w-12 mb-4 opacity-90" />
// // // // // //                       <p className="text-xl font-bold">New Folder</p>
// // // // // //                       <p className="text-sm opacity-80 mt-1">
// // // // // //                         Create organization unit
// // // // // //                       </p>
// // // // // //                     </button>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             {/* === DOCUMENTS TAB CONTENT === */}
// // // // // //             {activeTab === "documents" && (
// // // // // //               <>
// // // // // //                 {!isAdmin && (
// // // // // //                   <div className="mb-6">
// // // // // //                     <DashboardStats
// // // // // //                       totalDocuments={totalDocuments}
// // // // // //                       recentUploads={
// // // // // //                         documents.filter(
// // // // // //                           (d: Document) =>
// // // // // //                             new Date(d.createdAt) >
// // // // // //                             new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
// // // // // //                         ).length
// // // // // //                       }
// // // // // //                       isAdmin={isAdmin}
// // // // // //                     />
// // // // // //                   </div>
// // // // // //                 )}

// // // // // //                 <div className="space-y-6">
// // // // // //                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
// // // // // //                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
// // // // // //                       <div className="relative">
// // // // // //                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// // // // // //                         <Input
// // // // // //                           placeholder="Search documents..."
// // // // // //                           value={searchTerm}
// // // // // //                           onChange={(e) => setSearchTerm(e.target.value)}
// // // // // //                           className="pl-10 w-full sm:w-80"
// // // // // //                         />
// // // // // //                       </div>
// // // // // //                       <Select value={filterType} onValueChange={setFilterType}>
// // // // // //                         <SelectTrigger className="w-full sm:w-48">
// // // // // //                           <Filter className="h-4 w-4 mr-2" />
// // // // // //                           <SelectValue />
// // // // // //                         </SelectTrigger>
// // // // // //                         <SelectContent>
// // // // // //                           <SelectItem value="all">All Types</SelectItem>
// // // // // //                           <SelectItem value="Contract">Contracts</SelectItem>
// // // // // //                           <SelectItem value="SLA">SLAs</SelectItem>
// // // // // //                           <SelectItem value="NDA">NDAs</SelectItem>
// // // // // //                           <SelectItem value="Other">Other</SelectItem>
// // // // // //                         </SelectContent>
// // // // // //                       </Select>
// // // // // //                     </div>

// // // // // //                     <div className="flex gap-2">
// // // // // //                       {canCreateOrganizations && (
// // // // // //                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
// // // // // //                           <Plus className="h-4 w-4 mr-2" />
// // // // // //                           New Folder
// // // // // //                         </Button>
// // // // // //                       )}
// // // // // //                       <div className="flex bg-muted rounded-lg p-1">
// // // // // //                         <Button
// // // // // //                           variant={viewMode === "grid" ? "default" : "ghost"}
// // // // // //                           size="sm"
// // // // // //                           onClick={() => setViewMode("grid")}
// // // // // //                         >
// // // // // //                           <Grid3X3 className="h-4 w-4" />
// // // // // //                         </Button>
// // // // // //                         <Button
// // // // // //                           variant={viewMode === "folders" ? "default" : "ghost"}
// // // // // //                           size="sm"
// // // // // //                           onClick={() => setViewMode("folders")}
// // // // // //                           disabled={!canViewOrganizations}
// // // // // //                         >
// // // // // //                           <FolderOpen className="h-4 w-4" />
// // // // // //                         </Button>
// // // // // //                         <Button
// // // // // //                           variant={
// // // // // //                             viewMode === "management" ? "default" : "ghost"
// // // // // //                           }
// // // // // //                           size="sm"
// // // // // //                           onClick={() => setViewMode("management")}
// // // // // //                           disabled={!canViewOrganizations}
// // // // // //                         >
// // // // // //                           <Building className="h-4 w-4" />
// // // // // //                         </Button>
// // // // // //                       </div>
// // // // // //                     </div>
// // // // // //                   </div>

// // // // // //                   {docsLoading ? (
// // // // // //                     <div className="text-center py-12 text-muted-foreground">
// // // // // //                       Loading documents...
// // // // // //                     </div>
// // // // // //                   ) : viewMode === "management" ? (
// // // // // //                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// // // // // //                       {organizations.map((org) => (
// // // // // //                         <OrganizationCard
// // // // // //                           key={org._id}
// // // // // //                           organization={org}
// // // // // //                           canEditOrganizations={canEditOrganizations}
// // // // // //                           canDeleteOrganizations={canDeleteOrganizations}
// // // // // //                           onDelete={() =>
// // // // // //                             organizationService
// // // // // //                               .deleteOrganization(org._id)
// // // // // //                               .then(() => {
// // // // // //                                 queryClient.invalidateQueries({
// // // // // //                                   queryKey: ["organizations"],
// // // // // //                                 });
// // // // // //                                 toast.success("Folder deleted");
// // // // // //                               })
// // // // // //                           }
// // // // // //                           onUpdate={() =>
// // // // // //                             queryClient.invalidateQueries({
// // // // // //                               queryKey: ["organizations"],
// // // // // //                             })
// // // // // //                           }
// // // // // //                         />
// // // // // //                       ))}
// // // // // //                     </div>
// // // // // //                   ) : viewMode === "folders" ? (
// // // // // //                     <OrganizationFolders
// // // // // //                       documents={documents}
// // // // // //                       organizations={organizations}
// // // // // //                       currentUser={user}
// // // // // //                     />
// // // // // //                   ) : (
// // // // // //                     <>
// // // // // //                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// // // // // //                         {documents.map((doc: Document) => (
// // // // // //                           <DocumentCard
// // // // // //                             key={doc._id}
// // // // // //                             document={doc}
// // // // // //                             canEditDocuments={
// // // // // //                               isSuperAdmin || canDeleteDocuments
// // // // // //                             }
// // // // // //                             canDeleteDocuments={canDeleteDocuments}
// // // // // //                             onView={() => window.open(doc.fileUrl, "_blank")}
// // // // // //                             onDownload={() =>
// // // // // //                               documentService.downloadDocument(
// // // // // //                                 doc._id,
// // // // // //                                 doc.name
// // // // // //                               )
// // // // // //                             }
// // // // // //                             onDelete={async () => {
// // // // // //                               await documentService.deleteDocument(doc._id);
// // // // // //                               queryClient.invalidateQueries({
// // // // // //                                 queryKey: ["allDocuments"],
// // // // // //                               });
// // // // // //                               toast.success("Document deleted");
// // // // // //                             }}
// // // // // //                           />
// // // // // //                         ))}
// // // // // //                       </div>

// // // // // //                       {totalPages > 1 && (
// // // // // //                         <div className="flex items-center justify-center gap-4 mt-10">
// // // // // //                           <Button
// // // // // //                             variant="outline"
// // // // // //                             size="sm"
// // // // // //                             disabled={currentPage === 1}
// // // // // //                             onClick={() => setCurrentPage((p) => p - 1)}
// // // // // //                           >
// // // // // //                             <ChevronLeft className="h-4 w-4" /> Previous
// // // // // //                           </Button>
// // // // // //                           <span className="text-sm text-muted-foreground">
// // // // // //                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
// // // // // //                             total)
// // // // // //                           </span>
// // // // // //                           <Button
// // // // // //                             variant="outline"
// // // // // //                             size="sm"
// // // // // //                             disabled={currentPage === totalPages}
// // // // // //                             onClick={() => setCurrentPage((p) => p + 1)}
// // // // // //                           >
// // // // // //                             Next <ChevronRight className="h-4 w-4" />
// // // // // //                           </Button>
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                     </>
// // // // // //                   )}

// // // // // //                   {documents.length === 0 && !docsLoading && (
// // // // // //                     <div className="text-center py-16 text-muted-foreground">
// // // // // //                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
// // // // // //                       <p>No documents found</p>
// // // // // //                       {canUploadDocuments && (
// // // // // //                         <Button
// // // // // //                           onClick={() => handleTabChange("upload")}
// // // // // //                           className="mt-4"
// // // // // //                         >
// // // // // //                           Upload Your First Document
// // // // // //                         </Button>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               </>
// // // // // //             )}

// // // // // //             {activeTab === "upload" && canUploadDocuments && (
// // // // // //               <DocumentUpload
// // // // // //                 onUpload={async (file, name, type, orgId, start, expiry) => {
// // // // // //                   await documentService.uploadDocument(
// // // // // //                     orgId,
// // // // // //                     file,
// // // // // //                     name,
// // // // // //                     type,
// // // // // //                     start,
// // // // // //                     expiry
// // // // // //                   );
// // // // // //                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
// // // // // //                   toast.success("Uploaded successfully!");
// // // // // //                 }}
// // // // // //                 organizations={organizations}
// // // // // //                 currentUserOrg={user.organization?._id}
// // // // // //               />
// // // // // //             )}

// // // // // //             {activeTab === "analytics" && canViewAnalytics && (
// // // // // //               <AnalyticsCharts
// // // // // //                 allUsers={[]}
// // // // // //                 allDocuments={documents}
// // // // // //                 allOrganizations={organizations}
// // // // // //                 userMetrics={{ totalUsers: 42 }}
// // // // // //                 orgMetrics={{ totalOrganizations: organizations.length }}
// // // // // //               />
// // // // // //             )}

// // // // // //             {activeTab === "users" && canViewUsers && <UserManagement />}
// // // // // //             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
// // // // // //           </main>
// // // // // //         </div>

// // // // // //         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
// // // // // //           <DialogContent>
// // // // // //             <DialogHeader>
// // // // // //               <DialogTitle>Create New Folder</DialogTitle>
// // // // // //               <DialogDescription>
// // // // // //                 Organize your documents into folders (organizations)
// // // // // //               </DialogDescription>
// // // // // //             </DialogHeader>
// // // // // //             <form onSubmit={handleCreateFolder} className="space-y-4">
// // // // // //               <div>
// // // // // //                 <Label>Folder Name</Label>
// // // // // //                 <Input
// // // // // //                   value={newFolderName}
// // // // // //                   onChange={(e) => setNewFolderName(e.target.value)}
// // // // // //                   placeholder="e.g. Vendor Contracts 2025"
// // // // // //                   required
// // // // // //                 />
// // // // // //               </div>
// // // // // //               <div>
// // // // // //                 <Label>Type</Label>
// // // // // //                 <Select value={newFolderType} onValueChange={setNewFolderType}>
// // // // // //                   <SelectTrigger>
// // // // // //                     <SelectValue />
// // // // // //                   </SelectTrigger>
// // // // // //                   <SelectContent>
// // // // // //                     <SelectItem value="tech">Tech</SelectItem>
// // // // // //                     <SelectItem value="admin">Admin</SelectItem>
// // // // // //                     <SelectItem value="analytics">Analytics</SelectItem>
// // // // // //                     <SelectItem value="infra">Infrastructure</SelectItem>
// // // // // //                   </SelectContent>
// // // // // //                 </Select>
// // // // // //               </div>
// // // // // //               <DialogFooter>
// // // // // //                 <Button
// // // // // //                   type="button"
// // // // // //                   variant="outline"
// // // // // //                   onClick={() => setIsCreateOpen(false)}
// // // // // //                 >
// // // // // //                   Cancel
// // // // // //                 </Button>
// // // // // //                 <Button type="submit">Create Folder</Button>
// // // // // //               </DialogFooter>
// // // // // //             </form>
// // // // // //           </DialogContent>
// // // // // //         </Dialog>
// // // // // //       </div>
// // // // // //     </Layout>
// // // // // //   );
// // // // // // };

// // // // // // export default Dashboard;

// // // src/pages/Dashboard.tsx
// // import { useState, useEffect, useMemo } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useQuery, useQueryClient } from "@tanstack/react-query";
// // import { AnalyticsCharts } from "../components/AnalyticsCharts";
// // import DashboardStats from "../components/DashboardStats";
// // import DocumentCard from "../components/DocumentCard";
// // import DocumentUpload from "../components/DocumentUpload";
// // import { Layout } from "../components/Layout";
// // import NotificationsModal from "../components/NotificationsModal";
// // import OrganizationFolders from "../components/OrganizationFolders";
// // import OrganizationCard from "../components/OrganizationCard";
// // import { RoleManagement } from "../components/RoleManagement";
// // import { UserManagement } from "../components/UserManagement";
// // import type { Document } from "../types/index";
// // import { Button } from "../components/ui/button";
// // import { Input } from "../components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "../components/ui/select";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "../components/ui/dialog";
// // import { Label } from "../components/ui/label";
// // import { toast } from "sonner";
// // import {
// //   Search,
// //   Filter,
// //   FolderOpen,
// //   Grid3X3,
// //   Building,
// //   FileText,
// //   Upload,
// //   BarChart3,
// //   Users,
// //   Shield,
// //   Plus,
// //   Menu,
// //   X,
// //   ChevronLeft,
// //   ChevronRight,
// // } from "lucide-react";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { documentService, organizationService } from "../lib/api";

// // const DOCS_PAGE_SIZE = 12;

// // const Dashboard = () => {
// //   const queryClient = useQueryClient();
// //   const {
// //     user,
// //     logout,
// //     isLoading: authLoading,
// //     isAuthenticated,
// //   } = useAuthContext();
// //   const navigate = useNavigate();

// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterType, setFilterType] = useState("all");
// //   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
// //     "grid",
// //   );
// //   const [activeTab, setActiveTab] = useState("documents");
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const [isCreateOpen, setIsCreateOpen] = useState(false);
// //   const [newFolderName, setNewFolderName] = useState("");
// //   const [newFolderType, setNewFolderType] = useState("tech");

// //   const roleNameLower = user?.role?.name?.toLowerCase() || "";
// //   const isSuperAdmin = roleNameLower.includes("superadmin");
// //   const permissions = user?.role?.permissions || {};

// //   const canViewDocuments =
// //     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
// //   const canUploadDocuments =
// //     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
// //   const canDeleteDocuments =
// //     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
// //   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
// //   const canManageUserRoles =
// //     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
// //   const canViewOrganizations =
// //     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
// //   const canCreateOrganizations =
// //     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;
// //   const canEditOrganizations =
// //     isSuperAdmin || permissions.OrganizationManagement?.editOrganizations;
// //   const canDeleteOrganizations =
// //     isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations;
// //   const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, filterType]);

// //   useEffect(() => {
// //     if (!authLoading && !isAuthenticated) {
// //       toast.error("Please log in to access the dashboard");
// //       navigate("/login", { replace: true });
// //     }
// //   }, [authLoading, isAuthenticated, navigate]);

// //   useEffect(() => {
// //     if (!user || authLoading) return;
// //     const saved = localStorage.getItem("dashboardTab");
// //     const validTabs = [
// //       "documents",
// //       canUploadDocuments && "upload",
// //       canViewAnalytics && "analytics",
// //       canViewUsers && "users",
// //       canManageUserRoles && "roles",
// //     ].filter(Boolean) as string[];
// //     setActiveTab(validTabs.includes(saved!) ? saved! : "documents");
// //   }, [
// //     user,
// //     authLoading,
// //     canViewAnalytics,
// //     canUploadDocuments,
// //     canViewUsers,
// //     canManageUserRoles,
// //   ]);

// //   const { data: notificationsData } = useQuery({
// //     queryKey: ["notifications", user?.organization?._id],
// //     queryFn: () =>
// //       documentService.getNotifications(user?.organization?._id || ""),
// //     enabled: !!user?.organization?._id && canViewDocuments,
// //   });

// //   const unreadCount = useMemo(
// //     () =>
// //       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
// //         .length,
// //     [notificationsData],
// //   );

// //   const { data: organizationsData } = useQuery({
// //     queryKey: ["organizations"],
// //     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
// //     enabled: canViewOrganizations,
// //   });

// //   const organizations = useMemo(() => {
// //     const orgs = organizationsData?.data?.organizations || [];
// //     return canViewOrganizations
// //       ? orgs
// //       : user?.organization
// //         ? [user.organization]
// //         : [];
// //   }, [organizationsData, user?.organization, canViewOrganizations]);

// //   const { data: docsResponse, isLoading: docsLoading } = useQuery({
// //     queryKey: ["allDocuments", currentPage, searchTerm, filterType],
// //     queryFn: () =>
// //       documentService.getAllDocuments({
// //         page: currentPage,
// //         limit: DOCS_PAGE_SIZE,
// //         search: searchTerm || undefined,
// //         documentType: filterType !== "all" ? filterType : undefined,
// //       }),
// //     enabled: !!user && canViewDocuments,
// //   });

// //   const docsData = docsResponse?.data;
// //   const documents: Document[] = docsData?.documents || [];
// //   const totalPages = docsData?.totalPages || 1;
// //   const totalDocuments = docsData?.total || 0;

// //   const handleCreateFolder = async () => {
// //     if (!newFolderName.trim()) return toast.error("Folder name required");
// //     try {
// //       await organizationService.createOrganization({
// //         name: newFolderName.trim(),
// //         organizationType: newFolderType,
// //       });
// //       queryClient.invalidateQueries({ queryKey: ["organizations"] });
// //       toast.success(`Folder "${newFolderName}" created`);
// //       setIsCreateOpen(false);
// //       setNewFolderName("");
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.message || "Failed to create folder");
// //     }
// //   };

// //   const handleTabChange = (tab: string) => {
// //     setActiveTab(tab);
// //     localStorage.setItem("dashboardTab", tab);
// //     setMobileMenuOpen(false);
// //   };

// //   if (authLoading || !user) {
// //     return (
// //       <Layout user={undefined}>
// //         <div className="flex items-center justify-center h-64">
// //           <div className="text-muted-foreground">Loading dashboard...</div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout user={user} onLogout={logout}>
// //       {/* FIXED HEIGHT WRAPPER */}
// //       <div className="h-screen flex flex-col overflow-hidden bg-background">
// //         {/* Top Bar */}
// //         <div className="border-b bg-card sticky top-0 z-40">
// //           <div className="flex items-center justify-between h-16 px-4">
// //             <div className="flex items-center gap-4 flex-1">
// //               <button
// //                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //                 className="lg:hidden"
// //               >
// //                 {mobileMenuOpen ? (
// //                   <X className="h-5 w-5" />
// //                 ) : (
// //                   <Menu className="h-5 w-5" />
// //                 )}
// //               </button>
// //               <h1 className="text-xl font-semibold">Dashboard</h1>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <NotificationsModal unreadCount={unreadCount} />
// //               <div className="hidden sm:block text-sm text-muted-foreground">
// //                 {user.fullName || user.email}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* FLEX ROW BELOW TOP BAR - NO PAGE SCROLLING */}
// //         <div className="flex flex-1 overflow-hidden">
// //           {/* SIDEBAR */}
// //           <aside
// //             className={`${
// //               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
// //             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 pt-20 lg:pt-6`}
// //           >
// //             <nav className="space-y-1 px-3">
// //               {[
// //                 {
// //                   id: "documents",
// //                   label: "Documents",
// //                   icon: FileText,
// //                   show: true,
// //                 },
// //                 {
// //                   id: "upload",
// //                   label: "Upload",
// //                   icon: Upload,
// //                   show: canUploadDocuments,
// //                 },
// //                 {
// //                   id: "analytics",
// //                   label: "Analytics",
// //                   icon: BarChart3,
// //                   show: canViewAnalytics,
// //                 },
// //                 {
// //                   id: "users",
// //                   label: "Users",
// //                   icon: Users,
// //                   show: canViewUsers,
// //                 },
// //                 {
// //                   id: "roles",
// //                   label: "Roles & Permissions",
// //                   icon: Shield,
// //                   show: canManageUserRoles,
// //                 },
// //               ]
// //                 .filter((item) => item.show)
// //                 .map(({ id, label, icon: Icon }) => (
// //                   <button
// //                     key={id}
// //                     onClick={() => handleTabChange(id)}
// //                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
// //                       activeTab === id
// //                         ? "bg-primary text-primary-foreground"
// //                         : "hover:bg-muted"
// //                     }`}
// //                   >
// //                     <Icon className="h-4 w-4" />
// //                     <span className="text-sm font-medium">{label}</span>
// //                   </button>
// //                 ))}
// //             </nav>
// //           </aside>

// //           {/* MAIN SCROLLABLE CONTENT */}
// //           <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
// //             {activeTab === "documents" && (
// //               <>
// //                 <div className="mb-6">
// //                   <DashboardStats
// //                     totalDocuments={totalDocuments}
// //                     recentUploads={
// //                       documents.filter(
// //                         (d: Document) =>
// //                           new Date(d.createdAt) >
// //                           new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
// //                       ).length
// //                     }
// //                     isAdmin={canViewUsers || canManageUserRoles}
// //                   />
// //                 </div>

// //                 <div className="space-y-6">
// //                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
// //                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
// //                       <div className="relative">
// //                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                         <Input
// //                           placeholder="Search documents..."
// //                           value={searchTerm}
// //                           onChange={(e) => setSearchTerm(e.target.value)}
// //                           className="pl-10 w-full sm:w-80"
// //                         />
// //                       </div>
// //                       <Select value={filterType} onValueChange={setFilterType}>
// //                         <SelectTrigger className="w-full sm:w-48">
// //                           <Filter className="h-4 w-4 mr-2" />
// //                           <SelectValue />
// //                         </SelectTrigger>
// //                         <SelectContent>
// //                           <SelectItem value="all">All Types</SelectItem>
// //                           <SelectItem value="Contract">Contracts</SelectItem>
// //                           <SelectItem value="SLA">SLAs</SelectItem>
// //                           <SelectItem value="NDA">NDAs</SelectItem>
// //                           <SelectItem value="Other">Other</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                     </div>

// //                     <div className="flex gap-2">
// //                       {canCreateOrganizations && (
// //                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
// //                           <Plus className="h-4 w-4 mr-2" />
// //                           New Folder
// //                         </Button>
// //                       )}
// //                       <div className="flex bg-muted rounded-lg p-1">
// //                         <Button
// //                           variant={viewMode === "grid" ? "default" : "ghost"}
// //                           size="sm"
// //                           onClick={() => setViewMode("grid")}
// //                         >
// //                           <Grid3X3 className="h-4 w-4" />
// //                         </Button>
// //                         <Button
// //                           variant={viewMode === "folders" ? "default" : "ghost"}
// //                           size="sm"
// //                           onClick={() => setViewMode("folders")}
// //                           disabled={!canViewOrganizations}
// //                         >
// //                           <FolderOpen className="h-4 w-4" />
// //                         </Button>
// //                         <Button
// //                           variant={
// //                             viewMode === "management" ? "default" : "ghost"
// //                           }
// //                           size="sm"
// //                           onClick={() => setViewMode("management")}
// //                           disabled={!canViewOrganizations}
// //                         >
// //                           <Building className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {docsLoading ? (
// //                     <div className="text-center py-12 text-muted-foreground">
// //                       Loading documents...
// //                     </div>
// //                   ) : viewMode === "management" ? (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
// //                       {organizations.map((org) => (
// //                         <OrganizationCard
// //                           key={org._id}
// //                           organization={org}
// //                           canEditOrganizations={canEditOrganizations}
// //                           canDeleteOrganizations={canDeleteOrganizations}
// //                           onDelete={() =>
// //                             organizationService
// //                               .deleteOrganization(org._id)
// //                               .then(() => {
// //                                 queryClient.invalidateQueries({
// //                                   queryKey: ["organizations"],
// //                                 });
// //                                 toast.success("Folder deleted");
// //                               })
// //                           }
// //                           onUpdate={() =>
// //                             queryClient.invalidateQueries({
// //                               queryKey: ["organizations"],
// //                             })
// //                           }
// //                         />
// //                       ))}
// //                     </div>
// //                   ) : viewMode === "folders" ? (
// //                     <OrganizationFolders
// //                       documents={documents}
// //                       organizations={organizations}
// //                       currentUser={user}
// //                     />
// //                   ) : (
// //                     <>
// //                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //                         {documents.map((doc: Document) => (
// //                           <DocumentCard
// //                             key={doc._id}
// //                             document={doc}
// //                             canEditDocuments={
// //                               isSuperAdmin || canDeleteDocuments
// //                             }
// //                             canDeleteDocuments={canDeleteDocuments}
// //                             onView={() => window.open(doc.fileUrl, "_blank")}
// //                             onDownload={() =>
// //                               documentService.downloadDocument(
// //                                 doc._id,
// //                                 doc.name,
// //                               )
// //                             }
// //                             onDelete={async () => {
// //                               await documentService.deleteDocument(doc._id);
// //                               queryClient.invalidateQueries({
// //                                 queryKey: ["allDocuments"],
// //                               });
// //                               toast.success("Document deleted");
// //                             }}
// //                           />
// //                         ))}
// //                       </div>

// //                       {totalPages > 1 && (
// //                         <div className="flex items-center justify-center gap-4 mt-10">
// //                           <Button
// //                             variant="outline"
// //                             size="sm"
// //                             disabled={currentPage === 1}
// //                             onClick={() => setCurrentPage((p) => p - 1)}
// //                           >
// //                             <ChevronLeft className="h-4 w-4" /> Previous
// //                           </Button>
// //                           <span className="text-sm text-muted-foreground">
// //                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
// //                             total)
// //                           </span>
// //                           <Button
// //                             variant="outline"
// //                             size="sm"
// //                             disabled={currentPage === totalPages}
// //                             onClick={() => setCurrentPage((p) => p + 1)}
// //                           >
// //                             Next <ChevronRight className="h-4 w-4" />
// //                           </Button>
// //                         </div>
// //                       )}
// //                     </>
// //                   )}

// //                   {documents.length === 0 && !docsLoading && (
// //                     <div className="text-center py-16 text-muted-foreground">
// //                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
// //                       <p>No documents found</p>
// //                       {canUploadDocuments && (
// //                         <Button
// //                           onClick={() => handleTabChange("upload")}
// //                           className="mt-4"
// //                         >
// //                           Upload Your First Document
// //                         </Button>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               </>
// //             )}

// //             {activeTab === "upload" && canUploadDocuments && (
// //               <DocumentUpload
// //                 onUpload={async (file, name, type, orgId, start, expiry) => {
// //                   await documentService.uploadDocument(
// //                     orgId,
// //                     file,
// //                     name,
// //                     type,
// //                     start,
// //                     expiry,
// //                   );
// //                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
// //                   toast.success("Uploaded successfully!");
// //                 }}
// //                 organizations={organizations}
// //                 currentUserOrg={user.organization?._id}
// //               />
// //             )}

// //             {activeTab === "analytics" && canViewAnalytics && (
// //               <AnalyticsCharts
// //                 allUsers={[]}
// //                 allDocuments={documents}
// //                 allOrganizations={organizations}
// //                 userMetrics={{ totalUsers: 42 }}
// //                 orgMetrics={{ totalOrganizations: organizations.length }}
// //               />
// //             )}

// //             {activeTab === "users" && canViewUsers && <UserManagement />}
// //             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
// //           </main>
// //         </div>

// //         {/* Create Folder Modal */}
// //         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
// //           <DialogContent>
// //             <DialogHeader>
// //               <DialogTitle>Create New Folder</DialogTitle>
// //               <DialogDescription>
// //                 Organize your documents into folders (organizations)
// //               </DialogDescription>
// //             </DialogHeader>
// //             <form
// //               onSubmit={(e) => {
// //                 e.preventDefault();
// //                 handleCreateFolder();
// //               }}
// //               className="space-y-4"
// //             >
// //               <div>
// //                 <Label>Folder Name</Label>
// //                 <Input
// //                   value={newFolderName}
// //                   onChange={(e) => setNewFolderName(e.target.value)}
// //                   placeholder="e.g. Vendor Contracts 2025"
// //                   required
// //                 />
// //               </div>
// //               <div>
// //                 <Label>Type</Label>
// //                 <Select value={newFolderType} onValueChange={setNewFolderType}>
// //                   <SelectTrigger>
// //                     <SelectValue />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="tech">Tech</SelectItem>
// //                     <SelectItem value="admin">Admin</SelectItem>
// //                     <SelectItem value="analytics">Analytics</SelectItem>
// //                     <SelectItem value="infra">Infrastructure</SelectItem>
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //               <DialogFooter>
// //                 <Button
// //                   type="button"
// //                   variant="outline"
// //                   onClick={() => setIsCreateOpen(false)}
// //                 >
// //                   Cancel
// //                 </Button>
// //                 <Button type="submit">Create Folder</Button>
// //               </DialogFooter>
// //             </form>
// //           </DialogContent>
// //         </Dialog>
// //       </div>
// //     </Layout>
// //   );
// // };

// export default Dashboard;
// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Layout } from "../components/Layout";
import NotificationsModal from "../components/NotificationsModal";
import OrganizationFolders from "../components/OrganizationFolders";
import OrganizationCard from "../components/OrganizationCard";
import { RoleManagement } from "../components/RoleManagement";
import { UserManagement } from "../components/UserManagement";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import DashboardStats from "../components/DashboardStats";

import type { Document } from "../types/index";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

import {
  Search,
  Filter,
  FolderOpen,
  Grid3X3,
  Building,
  FileText,
  Upload,
  BarChart3,
  Users,
  Shield,
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Download,
} from "lucide-react";

import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";

// Recharts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DOCS_PAGE_SIZE = 12;

export default function Dashboard() {
  const queryClient = useQueryClient();
  const {
    user,
    logout,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
    "grid",
  );
  const [activeTab, setActiveTab] = useState<
    "documents" | "upload" | "analytics" | "users" | "roles"
  >("documents");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState("tech");

  const isSuperAdmin =
    user?.role?.name?.toLowerCase().includes("superadmin") || false;
  const permissions = user?.role?.permissions || {};

  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
  const canDeleteDocuments =
    isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
  const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
  const canManageUserRoles =
    isSuperAdmin || permissions.UserManagement?.manageUserRoles;
  const canViewOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
  const canCreateOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;

  // ====================== REAL REPORTING DATA FROM BACKEND ======================
  const { data: reportingResponse } = useQuery({
    queryKey: ["reporting-dashboard"],
    queryFn: () => documentService.getDashboardMetrics(),
    enabled: !!user,
  });

  const reportingData = reportingResponse?.data || {};

  // ====================== EXISTING QUERIES ======================
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", user?.organization?._id],
    queryFn: () =>
      documentService.getNotifications(user?.organization?._id || ""),
    enabled: !!user?.organization?._id && canViewDocuments,
  });

  const unreadCount = useMemo(
    () =>
      (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
        .length,
    [notificationsData],
  );

  const { data: organizationsData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
    enabled: canViewOrganizations,
  });

  const organizations = useMemo(() => {
    const orgs = organizationsData?.data?.organizations || [];
    return canViewOrganizations
      ? orgs
      : user?.organization
        ? [user.organization]
        : [];
  }, [organizationsData, user?.organization, canViewOrganizations]);

  const { data: docsResponse, isLoading: docsLoading } = useQuery({
    queryKey: ["allDocuments", currentPage, searchTerm, filterType],
    queryFn: () =>
      documentService.getAllDocuments({
        page: currentPage,
        limit: DOCS_PAGE_SIZE,
        search: searchTerm || undefined,
        documentType: filterType !== "all" ? filterType : undefined,
      }),
    enabled: !!user && canViewDocuments,
  });

  const docsData = docsResponse?.data;
  const documents: Document[] = docsData?.documents || [];
  const totalPages = docsData?.totalPages || 1;
  const totalDocuments = docsData?.total || 0;

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return toast.error("Folder name required");
    try {
      await organizationService.createOrganization({
        name: newFolderName.trim(),
        organizationType: newFolderType,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`Folder "${newFolderName}" created`);
      setIsCreateOpen(false);
      setNewFolderName("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create folder");
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    localStorage.setItem("dashboardTab", tab);
    setMobileMenuOpen(false);
  };

  useEffect(() => setCurrentPage(1), [searchTerm, filterType]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || !user) {
    return (
      <Layout user={undefined}>
        <div className="flex items-center justify-center h-64">
          Loading dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Top Bar */}
        <div className="border-b bg-card sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <h1 className="text-xl font-semibold">SageCMP Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationsModal unreadCount={unreadCount} />
              <div className="hidden sm:block text-sm text-muted-foreground">
                {user.fullName || user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r pt-20 lg:pt-6 transition-transform`}
          >
            <nav className="space-y-1 px-3">
              {[
                { id: "documents", label: "Documents", icon: FileText },
                {
                  id: "upload",
                  label: "Upload",
                  icon: Upload,
                  show: canUploadDocuments,
                },
                { id: "analytics", label: "Reporting", icon: BarChart3 },
                {
                  id: "users",
                  label: "Users",
                  icon: Users,
                  show: canViewUsers,
                },
                {
                  id: "roles",
                  label: "Roles",
                  icon: Shield,
                  show: canManageUserRoles,
                },
              ]
                .filter((item) => item.show !== false)
                .map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            {/* DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <>
                <div className="mb-6">
                  <DashboardStats
                    totalDocuments={totalDocuments}
                    recentUploads={
                      documents.filter(
                        (d: Document) =>
                          new Date(d.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ).length
                    }
                    isAdmin={canViewUsers || canManageUserRoles}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-80"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-48">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Contract">Contracts</SelectItem>
                          <SelectItem value="SLA">SLAs</SelectItem>
                          <SelectItem value="NDA">NDAs</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      {canCreateOrganizations && (
                        <Button onClick={() => setIsCreateOpen(true)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          New Folder
                        </Button>
                      )}
                      <div className="flex bg-muted rounded-lg p-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "folders" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("folders")}
                          disabled={!canViewOrganizations}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            viewMode === "management" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setViewMode("management")}
                          disabled={!canViewOrganizations}
                        >
                          <Building className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Documents Content (your original logic) */}
                  {docsLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading documents...
                    </div>
                  ) : viewMode === "management" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {organizations.map((org) => (
                        <OrganizationCard
                          key={org._id}
                          organization={org}
                          canEditOrganizations={true}
                          canDeleteOrganizations={true}
                          onDelete={() => {
                            organizationService
                              .deleteOrganization(org._id)
                              .then(() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["organizations"],
                                });
                                toast.success("Folder deleted");
                              });
                          }}
                          onUpdate={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["organizations"],
                            })
                          }
                        />
                      ))}
                    </div>
                  ) : viewMode === "folders" ? (
                    <OrganizationFolders
                      documents={documents}
                      organizations={organizations}
                      currentUser={user}
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {documents.map((doc: Document) => (
                          <DocumentCard
                            key={doc._id}
                            document={doc}
                            canEditDocuments={
                              isSuperAdmin || canDeleteDocuments
                            }
                            canDeleteDocuments={canDeleteDocuments}
                            onView={() => window.open(doc.fileUrl, "_blank")}
                            onDownload={() =>
                              documentService.downloadDocument(
                                doc._id,
                                doc.name,
                              )
                            }
                            onDelete={async () => {
                              await documentService.deleteDocument(doc._id);
                              queryClient.invalidateQueries({
                                queryKey: ["allDocuments"],
                              });
                              toast.success("Document deleted");
                            }}
                          />
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-10">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                          >
                            <ChevronLeft className="h-4 w-4" /> Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages} ({totalDocuments}{" "}
                            total)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {documents.length === 0 && !docsLoading && (
                    <div className="text-center py-16 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No documents found</p>
                      {canUploadDocuments && (
                        <Button
                          onClick={() => handleTabChange("upload")}
                          className="mt-4"
                        >
                          Upload Your First Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* UPLOAD TAB */}
            {activeTab === "upload" && canUploadDocuments && (
              <DocumentUpload
                onUpload={async (file, name, type, orgId, start, expiry) => {
                  await documentService.uploadDocument(
                    orgId,
                    file,
                    name,
                    type,
                    start,
                    expiry,
                  );
                  queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
                  toast.success("Uploaded successfully!");
                }}
                organizations={organizations}
                currentUserOrg={user.organization?._id}
              />
            )}

            {/* REPORTING DASHBOARD - NOW USING REAL DATA */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
                    <p className="text-muted-foreground">
                      Contracts • Invoices • Field Reports • Revenue
                    </p>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Contracts
                          </p>
                          <p className="text-3xl font-bold mt-1">
                            {reportingData.totalContracts || 0}
                          </p>
                        </div>
                        <FileText className="h-10 w-10 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Field Reports
                          </p>
                          <p className="text-3xl font-bold mt-1">
                            {reportingData.totalFieldReports || 0}
                          </p>
                        </div>
                        <Users className="h-10 w-10 text-amber-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Revenue
                          </p>
                          <p className="text-3xl font-bold mt-1">
                            ₦
                            {(reportingData.totalRevenue || 0).toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-10 w-10 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Outstanding
                          </p>
                          <p className="text-3xl font-bold mt-1 text-red-600">
                            ₦
                            {(
                              reportingData.outstandingPayments || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <Card className="lg:col-span-5">
                    <CardHeader>
                      <CardTitle>Contracts by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={reportingData.contractsByStatus || []}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                          >
                            {(reportingData.contractsByStatus || []).map(
                              (entry: any, i: number) => (
                                <Cell key={i} fill={entry.color} />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Invoices per Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={reportingData.weeklyInvoices || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip
                            formatter={(v: number) => `₦${v.toLocaleString()}`}
                          />
                          <Bar dataKey="amount" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Monthly Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={reportingData.monthlyRevenue || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(v: number) => `₦${v.toLocaleString()}`}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Field Reports */}
                <Card>
                  <CardHeader>
                    <CardTitle>Field Reports Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <h4 className="font-medium mb-4">Total Reports</h4>
                        <p className="text-4xl font-bold text-purple-600">
                          {reportingData.totalFieldReports || 0}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">By Region</h4>
                        {(reportingData.fieldReportsByRegion || []).map(
                          (r: any) => (
                            <div
                              key={r.region}
                              className="flex justify-between mb-2"
                            >
                              <span>{r.region}</span>
                              <span className="font-semibold">{r.count}</span>
                            </div>
                          ),
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Top Enumerators</h4>
                        {(reportingData.fieldReportsByEnumerator || []).map(
                          (e: any) => (
                            <div
                              key={e.name}
                              className="flex justify-between mb-2"
                            >
                              <span>{e.name}</span>
                              <Badge>{e.count} reports</Badge>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "users" && canViewUsers && <UserManagement />}
            {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
          </main>
        </div>
      </div>

      {/* Create Folder Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize your documents into folders (organizations)
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateFolder();
            }}
            className="space-y-4"
          >
            <div>
              <Label>Folder Name</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={newFolderType} onValueChange={setNewFolderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Folder</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// // src/pages/Dashboard.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import { Layout } from "../components/Layout";
// import NotificationsModal from "../components/NotificationsModal";
// import OrganizationFolders from "../components/OrganizationFolders";
// import OrganizationCard from "../components/OrganizationCard";
// import { RoleManagement } from "../components/RoleManagement";
// import { UserManagement } from "../components/UserManagement";
// import DocumentCard from "../components/DocumentCard";
// import DocumentUpload from "../components/DocumentUpload";
// import DashboardStats from "../components/DashboardStats";

// import type { Document } from "../types/index";

// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import { toast } from "sonner";

// import {
//   Search,
//   Filter,
//   FolderOpen,
//   Grid3X3,
//   Building,
//   FileText,
//   Upload,
//   BarChart3,
//   Users,
//   Shield,
//   Plus,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   DollarSign,
//   AlertTriangle,
//   Download,
// } from "lucide-react";

// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";

// // Recharts (only used in Reporting tab)
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const DOCS_PAGE_SIZE = 12;

// export default function Dashboard() {
//   const queryClient = useQueryClient();
//   const {
//     user,
//     logout,
//     isLoading: authLoading,
//     isAuthenticated,
//   } = useAuthContext();
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
//     "grid",
//   );
//   const [activeTab, setActiveTab] = useState<
//     "documents" | "upload" | "analytics" | "users" | "roles"
//   >("documents");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [newFolderType, setNewFolderType] = useState("tech");

//   const isSuperAdmin =
//     user?.role?.name?.toLowerCase().includes("superadmin") || false;
//   const permissions = user?.role?.permissions || {};

//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
//   const canUploadDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
//   const canDeleteDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
//   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
//   const canManageUserRoles =
//     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
//   const canViewOrganizations =
//     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
//   const canCreateOrganizations =
//     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;

//   // ====================== REPORTING DATA ======================
//   const { data: reportingData } = useQuery({
//     queryKey: ["reporting-dashboard"],
//     queryFn: async () => {
//       await new Promise((r) => setTimeout(r, 600));
//       return {
//         totalContracts: 45,
//         totalFieldReports: 67,
//         totalRevenue: 2450000,
//         outstandingPayments: 420000,
//         contractsByStatus: [
//           { name: "Active", value: 32, color: "#10b981" },
//           { name: "Expiring", value: 5, color: "#f59e0b" },
//           { name: "Expired", value: 8, color: "#ef4444" },
//         ],
//         monthlyRevenue: [
//           { month: "Oct", revenue: 420000 },
//           { month: "Nov", revenue: 610000 },
//           { month: "Dec", revenue: 890000 },
//           { month: "Jan", revenue: 450000 },
//           { month: "Feb", revenue: 780000 },
//           { month: "Mar", revenue: 1240000 },
//         ],
//         weeklyInvoices: [
//           { week: "W1", amount: 450000 },
//           { week: "W2", amount: 720000 },
//           { week: "W3", amount: 310000 },
//           { week: "W4", amount: 980000 },
//         ],
//         fieldReportsByRegion: [
//           { region: "Lagos", count: 28 },
//           { region: "Abuja", count: 19 },
//           { region: "Kano", count: 12 },
//         ],
//         fieldReportsByEnumerator: [
//           { name: "Oluwaferanmi Adewusi", count: 24 },
//           { name: "Aisha Bello", count: 15 },
//         ],
//       };
//     },
//   });

//   // ====================== EXISTING QUERIES ======================
//   const { data: notificationsData } = useQuery({
//     queryKey: ["notifications", user?.organization?._id],
//     queryFn: () =>
//       documentService.getNotifications(user?.organization?._id || ""),
//     enabled: !!user?.organization?._id && canViewDocuments,
//   });

//   const unreadCount = useMemo(
//     () =>
//       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
//         .length,
//     [notificationsData],
//   );

//   const { data: organizationsData } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
//     enabled: canViewOrganizations,
//   });

//   const organizations = useMemo(() => {
//     const orgs = organizationsData?.data?.organizations || [];
//     return canViewOrganizations
//       ? orgs
//       : user?.organization
//         ? [user.organization]
//         : [];
//   }, [organizationsData, user?.organization, canViewOrganizations]);

//   const { data: docsResponse, isLoading: docsLoading } = useQuery({
//     queryKey: ["allDocuments", currentPage, searchTerm, filterType],
//     queryFn: () =>
//       documentService.getAllDocuments({
//         page: currentPage,
//         limit: DOCS_PAGE_SIZE,
//         search: searchTerm || undefined,
//         documentType: filterType !== "all" ? filterType : undefined,
//       }),
//     enabled: !!user && canViewDocuments,
//   });

//   const docsData = docsResponse?.data;
//   const documents: Document[] = docsData?.documents || [];
//   const totalPages = docsData?.totalPages || 1;
//   const totalDocuments = docsData?.total || 0;

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) return toast.error("Folder name required");
//     try {
//       await organizationService.createOrganization({
//         name: newFolderName.trim(),
//         organizationType: newFolderType,
//       });
//       queryClient.invalidateQueries({ queryKey: ["organizations"] });
//       toast.success(`Folder "${newFolderName}" created`);
//       setIsCreateOpen(false);
//       setNewFolderName("");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to create folder");
//     }
//   };

//   const handleTabChange = (tab: typeof activeTab) => {
//     setActiveTab(tab);
//     localStorage.setItem("dashboardTab", tab);
//     setMobileMenuOpen(false);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please log in to access the dashboard");
//       navigate("/login", { replace: true });
//     }
//   }, [authLoading, isAuthenticated, navigate]);

//   if (authLoading || !user) {
//     return (
//       <Layout user={undefined}>
//         <div className="flex items-center justify-center h-64">
//           Loading dashboard...
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="h-screen flex flex-col overflow-hidden bg-background">
//         {/* Top Bar */}
//         <div className="border-b bg-card sticky top-0 z-40">
//           <div className="flex items-center justify-between h-16 px-4">
//             <div className="flex items-center gap-4 flex-1">
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="lg:hidden"
//               >
//                 {mobileMenuOpen ? (
//                   <X className="h-5 w-5" />
//                 ) : (
//                   <Menu className="h-5 w-5" />
//                 )}
//               </button>
//               <h1 className="text-xl font-semibold">SageCMP Dashboard</h1>
//             </div>
//             <div className="flex items-center gap-3">
//               <NotificationsModal unreadCount={unreadCount} />
//               <div className="hidden sm:block text-sm text-muted-foreground">
//                 {user.fullName || user.email}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar */}
//           <aside
//             className={`${
//               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r pt-20 lg:pt-6 transition-transform`}
//           >
//             <nav className="space-y-1 px-3">
//               {[
//                 { id: "documents", label: "Documents", icon: FileText },
//                 {
//                   id: "upload",
//                   label: "Upload",
//                   icon: Upload,
//                   show: canUploadDocuments,
//                 },
//                 { id: "analytics", label: "Reporting", icon: BarChart3 },
//                 {
//                   id: "users",
//                   label: "Users",
//                   icon: Users,
//                   show: canViewUsers,
//                 },
//                 {
//                   id: "roles",
//                   label: "Roles",
//                   icon: Shield,
//                   show: canManageUserRoles,
//                 },
//               ]
//                 .filter((item) => item.show !== false)
//                 .map(({ id, label, icon: Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => handleTabChange(id as any)}
//                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
//                       activeTab === id
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-muted"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span className="text-sm font-medium">{label}</span>
//                   </button>
//                 ))}
//             </nav>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
//             {/* DOCUMENTS TAB - FULL ORIGINAL CONTENT */}
//             {activeTab === "documents" && (
//               <>
//                 <div className="mb-6">
//                   <DashboardStats
//                     totalDocuments={totalDocuments}
//                     recentUploads={
//                       documents.filter(
//                         (d: Document) =>
//                           new Date(d.createdAt) >
//                           new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//                       ).length
//                     }
//                     isAdmin={canViewUsers || canManageUserRoles}
//                   />
//                 </div>

//                 <div className="space-y-6">
//                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           placeholder="Search documents..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="pl-10 w-full sm:w-80"
//                         />
//                       </div>
//                       <Select value={filterType} onValueChange={setFilterType}>
//                         <SelectTrigger className="w-full sm:w-48">
//                           <Filter className="h-4 w-4 mr-2" />
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Types</SelectItem>
//                           <SelectItem value="Contract">Contracts</SelectItem>
//                           <SelectItem value="SLA">SLAs</SelectItem>
//                           <SelectItem value="NDA">NDAs</SelectItem>
//                           <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex gap-2">
//                       {canCreateOrganizations && (
//                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
//                           <Plus className="h-4 w-4 mr-2" />
//                           New Folder
//                         </Button>
//                       )}
//                       <div className="flex bg-muted rounded-lg p-1">
//                         <Button
//                           variant={viewMode === "grid" ? "default" : "ghost"}
//                           size="sm"
//                           onClick={() => setViewMode("grid")}
//                         >
//                           <Grid3X3 className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant={viewMode === "folders" ? "default" : "ghost"}
//                           size="sm"
//                           onClick={() => setViewMode("folders")}
//                           disabled={!canViewOrganizations}
//                         >
//                           <FolderOpen className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant={
//                             viewMode === "management" ? "default" : "ghost"
//                           }
//                           size="sm"
//                           onClick={() => setViewMode("management")}
//                           disabled={!canViewOrganizations}
//                         >
//                           <Building className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   {docsLoading ? (
//                     <div className="text-center py-12 text-muted-foreground">
//                       Loading documents...
//                     </div>
//                   ) : viewMode === "management" ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                       {organizations.map((org) => (
//                         <OrganizationCard
//                           key={org._id}
//                           organization={org}
//                           canEditOrganizations={true}
//                           canDeleteOrganizations={true}
//                           onDelete={() => {
//                             organizationService
//                               .deleteOrganization(org._id)
//                               .then(() => {
//                                 queryClient.invalidateQueries({
//                                   queryKey: ["organizations"],
//                                 });
//                                 toast.success("Folder deleted");
//                               });
//                           }}
//                           onUpdate={() =>
//                             queryClient.invalidateQueries({
//                               queryKey: ["organizations"],
//                             })
//                           }
//                         />
//                       ))}
//                     </div>
//                   ) : viewMode === "folders" ? (
//                     <OrganizationFolders
//                       documents={documents}
//                       organizations={organizations}
//                       currentUser={user}
//                     />
//                   ) : (
//                     <>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {documents.map((doc: Document) => (
//                           <DocumentCard
//                             key={doc._id}
//                             document={doc}
//                             canEditDocuments={
//                               isSuperAdmin || canDeleteDocuments
//                             }
//                             canDeleteDocuments={canDeleteDocuments}
//                             onView={() => window.open(doc.fileUrl, "_blank")}
//                             onDownload={() =>
//                               documentService.downloadDocument(
//                                 doc._id,
//                                 doc.name,
//                               )
//                             }
//                             onDelete={async () => {
//                               await documentService.deleteDocument(doc._id);
//                               queryClient.invalidateQueries({
//                                 queryKey: ["allDocuments"],
//                               });
//                               toast.success("Document deleted");
//                             }}
//                           />
//                         ))}
//                       </div>

//                       {totalPages > 1 && (
//                         <div className="flex items-center justify-center gap-4 mt-10">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage((p) => p - 1)}
//                           >
//                             <ChevronLeft className="h-4 w-4" /> Previous
//                           </Button>
//                           <span className="text-sm text-muted-foreground">
//                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
//                             total)
//                           </span>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage((p) => p + 1)}
//                           >
//                             Next <ChevronRight className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {documents.length === 0 && !docsLoading && (
//                     <div className="text-center py-16 text-muted-foreground">
//                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
//                       <p>No documents found</p>
//                       {canUploadDocuments && (
//                         <Button
//                           onClick={() => handleTabChange("upload")}
//                           className="mt-4"
//                         >
//                           Upload Your First Document
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* UPLOAD TAB */}
//             {activeTab === "upload" && canUploadDocuments && (
//               <DocumentUpload
//                 onUpload={async (file, name, type, orgId, start, expiry) => {
//                   await documentService.uploadDocument(
//                     orgId,
//                     file,
//                     name,
//                     type,
//                     start,
//                     expiry,
//                   );
//                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
//                   toast.success("Uploaded successfully!");
//                 }}
//                 organizations={organizations}
//                 currentUserOrg={user.organization?._id}
//               />
//             )}

//             {/* REPORTING DASHBOARD */}
//             {activeTab === "analytics" && (
//               <div className="space-y-8">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
//                     <p className="text-muted-foreground">
//                       Contracts • Invoices • Field Reports • Revenue
//                     </p>
//                   </div>
//                   <Button>
//                     <Download className="mr-2 h-4 w-4" />
//                     Export CSV
//                   </Button>
//                 </div>

//                 {/* KPI Cards */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//                   <Card>
//                     <CardContent className="p-6">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground">
//                             Total Contracts
//                           </p>
//                           <p className="text-3xl font-bold mt-1">
//                             {reportingData?.totalContracts || 0}
//                           </p>
//                         </div>
//                         <FileText className="h-10 w-10 text-blue-600" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="p-6">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground">
//                             Field Reports
//                           </p>
//                           <p className="text-3xl font-bold mt-1">
//                             {reportingData?.totalFieldReports || 0}
//                           </p>
//                         </div>
//                         <Users className="h-10 w-10 text-amber-600" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="p-6">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground">
//                             Total Revenue
//                           </p>
//                           <p className="text-3xl font-bold mt-1">
//                             ₦
//                             {(
//                               reportingData?.totalRevenue || 0
//                             ).toLocaleString()}
//                           </p>
//                         </div>
//                         <DollarSign className="h-10 w-10 text-green-600" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                   <Card>
//                     <CardContent className="p-6">
//                       <div className="flex justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground">
//                             Outstanding
//                           </p>
//                           <p className="text-3xl font-bold mt-1 text-red-600">
//                             ₦
//                             {(
//                               reportingData?.outstandingPayments || 0
//                             ).toLocaleString()}
//                           </p>
//                         </div>
//                         <AlertTriangle className="h-10 w-10 text-red-600" />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Charts */}
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                   <Card className="lg:col-span-5">
//                     <CardHeader>
//                       <CardTitle>Contracts by Status</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ResponsiveContainer width="100%" height={280}>
//                         <PieChart>
//                           <Pie
//                             data={reportingData?.contractsByStatus || []}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                           >
//                             {(reportingData?.contractsByStatus || []).map(
//                               (entry: any, i: number) => (
//                                 <Cell key={i} fill={entry.color} />
//                               ),
//                             )}
//                           </Pie>
//                           <Tooltip />
//                           <Legend />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card className="lg:col-span-4">
//                     <CardHeader>
//                       <CardTitle>Invoices per Week</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ResponsiveContainer width="100%" height={280}>
//                         <BarChart data={reportingData?.weeklyInvoices || []}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="week" />
//                           <YAxis />
//                           <Tooltip
//                             formatter={(v: number) => `₦${v.toLocaleString()}`}
//                           />
//                           <Bar dataKey="amount" fill="#3b82f6" />
//                         </BarChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>

//                   <Card className="lg:col-span-3">
//                     <CardHeader>
//                       <CardTitle>Monthly Revenue</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ResponsiveContainer width="100%" height={280}>
//                         <LineChart data={reportingData?.monthlyRevenue || []}>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis dataKey="month" />
//                           <YAxis />
//                           <Tooltip
//                             formatter={(v: number) => `₦${v.toLocaleString()}`}
//                           />
//                           <Line
//                             type="monotone"
//                             dataKey="revenue"
//                             stroke="#10b981"
//                             strokeWidth={3}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Field Reports */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Field Reports Analytics</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                       <div>
//                         <h4 className="font-medium mb-4">Total Reports</h4>
//                         <p className="text-4xl font-bold text-purple-600">
//                           {reportingData?.totalFieldReports || 0}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="font-medium mb-4">By Region</h4>
//                         {(reportingData?.fieldReportsByRegion || []).map(
//                           (r: any) => (
//                             <div
//                               key={r.region}
//                               className="flex justify-between mb-2"
//                             >
//                               <span>{r.region}</span>
//                               <span className="font-semibold">{r.count}</span>
//                             </div>
//                           ),
//                         )}
//                       </div>
//                       <div>
//                         <h4 className="font-medium mb-4">Top Enumerators</h4>
//                         {(reportingData?.fieldReportsByEnumerator || []).map(
//                           (e: any) => (
//                             <div
//                               key={e.name}
//                               className="flex justify-between mb-2"
//                             >
//                               <span>{e.name}</span>
//                               <Badge>{e.count} reports</Badge>
//                             </div>
//                           ),
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {activeTab === "users" && canViewUsers && <UserManagement />}
//             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
//           </main>
//         </div>
//       </div>

//       {/* Create Folder Modal */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Folder</DialogTitle>
//             <DialogDescription>
//               Organize your documents into folders (organizations)
//             </DialogDescription>
//           </DialogHeader>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateFolder();
//             }}
//             className="space-y-4"
//           >
//             <div>
//               <Label>Folder Name</Label>
//               <Input
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label>Type</Label>
//               <Select value={newFolderType} onValueChange={setNewFolderType}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="tech">Tech</SelectItem>
//                   <SelectItem value="admin">Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsCreateOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">Create Folder</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// }

// // src/pages/Dashboard.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// import { Layout } from "../components/Layout";
// import NotificationsModal from "../components/NotificationsModal";
// import OrganizationFolders from "../components/OrganizationFolders";
// import OrganizationCard from "../components/OrganizationCard";
// import { RoleManagement } from "../components/RoleManagement";
// import { UserManagement } from "../components/UserManagement";
// import DocumentCard from "../components/DocumentCard";
// import DocumentUpload from "../components/DocumentUpload";
// import DashboardStats from "../components/DashboardStats";

// import type { Document } from "../types/index";

// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import { toast } from "sonner";

// import {
//   Search,
//   Filter,
//   FolderOpen,
//   Grid3X3,
//   Building,
//   FileText,
//   Upload,
//   BarChart3,
//   Users,
//   Shield,
//   Plus,
//   Menu,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   DollarSign,
//   AlertTriangle,
//   Download,
//   RefreshCw,
// } from "lucide-react";

// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";

// // Recharts
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const DOCS_PAGE_SIZE = 12;

// export default function Dashboard() {
//   const queryClient = useQueryClient();
//   const {
//     user,
//     logout,
//     isLoading: authLoading,
//     isAuthenticated,
//   } = useAuthContext();
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
//     "grid",
//   );
//   const [activeTab, setActiveTab] = useState<
//     "documents" | "upload" | "analytics" | "users" | "roles"
//   >("documents");
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [newFolderType, setNewFolderType] = useState("tech");

//   const isSuperAdmin =
//     user?.role?.name?.toLowerCase().includes("superadmin") || false;
//   const permissions = user?.role?.permissions || {};

//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
//   const canUploadDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
//   const canDeleteDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
//   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
//   const canManageUserRoles =
//     isSuperAdmin || permissions.UserManagement?.manageUserRoles;
//   const canViewOrganizations =
//     isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
//   const canCreateOrganizations =
//     isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;

//   // ====================== REAL REPORTING DATA FROM BACKEND ======================
//   const {
//     data: reportingResponse,
//     isLoading: reportingLoading,
//     error: reportingError,
//     refetch: refetchReporting,
//   } = useQuery({
//     queryKey: ["reporting-dashboard"],
//     queryFn: () => documentService.getDashboardMetrics(),
//     enabled: !!user,
//     retry: 1,
//   });

//   const reportingData = reportingResponse?.data || {};

//   // Debug error
//   useEffect(() => {
//     if (reportingError) {
//       console.error("❌ Reporting Dashboard Error:", reportingError);
//       toast.error("Failed to load reporting data. Check console for details.");
//     }
//   }, [reportingError]);

//   // ====================== EXISTING QUERIES ======================
//   const { data: notificationsData } = useQuery({
//     queryKey: ["notifications", user?.organization?._id],
//     queryFn: () =>
//       documentService.getNotifications(user?.organization?._id || ""),
//     enabled: !!user?.organization?._id && canViewDocuments,
//   });

//   const unreadCount = useMemo(
//     () =>
//       (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
//         .length,
//     [notificationsData],
//   );

//   const { data: organizationsData } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
//     enabled: canViewOrganizations,
//   });

//   const organizations = useMemo(() => {
//     const orgs = organizationsData?.data?.organizations || [];
//     return canViewOrganizations
//       ? orgs
//       : user?.organization
//         ? [user.organization]
//         : [];
//   }, [organizationsData, user?.organization, canViewOrganizations]);

//   const { data: docsResponse, isLoading: docsLoading } = useQuery({
//     queryKey: ["allDocuments", currentPage, searchTerm, filterType],
//     queryFn: () =>
//       documentService.getAllDocuments({
//         page: currentPage,
//         limit: DOCS_PAGE_SIZE,
//         search: searchTerm || undefined,
//         documentType: filterType !== "all" ? filterType : undefined,
//       }),
//     enabled: !!user && canViewDocuments,
//   });

//   const docsData = docsResponse?.data;
//   const documents: Document[] = docsData?.documents || [];
//   const totalPages = docsData?.totalPages || 1;
//   const totalDocuments = docsData?.total || 0;

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) return toast.error("Folder name required");
//     try {
//       await organizationService.createOrganization({
//         name: newFolderName.trim(),
//         organizationType: newFolderType,
//       });
//       queryClient.invalidateQueries({ queryKey: ["organizations"] });
//       toast.success(`Folder "${newFolderName}" created`);
//       setIsCreateOpen(false);
//       setNewFolderName("");
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to create folder");
//     }
//   };

//   const handleTabChange = (tab: typeof activeTab) => {
//     setActiveTab(tab);
//     localStorage.setItem("dashboardTab", tab);
//     setMobileMenuOpen(false);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please log in to access the dashboard");
//       navigate("/login", { replace: true });
//     }
//   }, [authLoading, isAuthenticated, navigate]);

//   if (authLoading || !user) {
//     return (
//       <Layout user={undefined}>
//         <div className="flex items-center justify-center h-64">
//           Loading dashboard...
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="h-screen flex flex-col overflow-hidden bg-background">
//         {/* Top Bar */}
//         <div className="border-b bg-card sticky top-0 z-40">
//           <div className="flex items-center justify-between h-16 px-4">
//             <div className="flex items-center gap-4 flex-1">
//               <button
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 className="lg:hidden"
//               >
//                 {mobileMenuOpen ? (
//                   <X className="h-5 w-5" />
//                 ) : (
//                   <Menu className="h-5 w-5" />
//                 )}
//               </button>
//               <h1 className="text-xl font-semibold">SageCMP Dashboard</h1>
//             </div>
//             <div className="flex items-center gap-3">
//               <NotificationsModal unreadCount={unreadCount} />
//               <div className="hidden sm:block text-sm text-muted-foreground">
//                 {user.fullName || user.email}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar */}
//           <aside
//             className={`${
//               mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
//             } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r pt-20 lg:pt-6 transition-transform`}
//           >
//             <nav className="space-y-1 px-3">
//               {[
//                 { id: "documents", label: "Documents", icon: FileText },
//                 {
//                   id: "upload",
//                   label: "Upload",
//                   icon: Upload,
//                   show: canUploadDocuments,
//                 },
//                 { id: "analytics", label: "Reporting", icon: BarChart3 },
//                 {
//                   id: "users",
//                   label: "Users",
//                   icon: Users,
//                   show: canViewUsers,
//                 },
//                 {
//                   id: "roles",
//                   label: "Roles",
//                   icon: Shield,
//                   show: canManageUserRoles,
//                 },
//               ]
//                 .filter((item) => item.show !== false)
//                 .map(({ id, label, icon: Icon }) => (
//                   <button
//                     key={id}
//                     onClick={() => handleTabChange(id as any)}
//                     className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
//                       activeTab === id
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-muted"
//                     }`}
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span className="text-sm font-medium">{label}</span>
//                   </button>
//                 ))}
//             </nav>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
//             {/* DOCUMENTS TAB */}
//             {activeTab === "documents" && (
//               <>
//                 <div className="mb-6">
//                   <DashboardStats
//                     totalDocuments={totalDocuments}
//                     recentUploads={
//                       documents.filter(
//                         (d: Document) =>
//                           new Date(d.createdAt) >
//                           new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//                       ).length
//                     }
//                     isAdmin={canViewUsers || canManageUserRoles}
//                   />
//                 </div>

//                 <div className="space-y-6">
//                   <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
//                     <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           placeholder="Search documents..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="pl-10 w-full sm:w-80"
//                         />
//                       </div>
//                       <Select value={filterType} onValueChange={setFilterType}>
//                         <SelectTrigger className="w-full sm:w-48">
//                           <Filter className="h-4 w-4 mr-2" />
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Types</SelectItem>
//                           <SelectItem value="Contract">Contracts</SelectItem>
//                           <SelectItem value="SLA">SLAs</SelectItem>
//                           <SelectItem value="NDA">NDAs</SelectItem>
//                           <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex gap-2">
//                       {canCreateOrganizations && (
//                         <Button onClick={() => setIsCreateOpen(true)} size="sm">
//                           <Plus className="h-4 w-4 mr-2" />
//                           New Folder
//                         </Button>
//                       )}
//                       <div className="flex bg-muted rounded-lg p-1">
//                         <Button
//                           variant={viewMode === "grid" ? "default" : "ghost"}
//                           size="sm"
//                           onClick={() => setViewMode("grid")}
//                         >
//                           <Grid3X3 className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant={viewMode === "folders" ? "default" : "ghost"}
//                           size="sm"
//                           onClick={() => setViewMode("folders")}
//                           disabled={!canViewOrganizations}
//                         >
//                           <FolderOpen className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant={
//                             viewMode === "management" ? "default" : "ghost"
//                           }
//                           size="sm"
//                           onClick={() => setViewMode("management")}
//                           disabled={!canViewOrganizations}
//                         >
//                           <Building className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>

//                   {docsLoading ? (
//                     <div className="text-center py-12 text-muted-foreground">
//                       Loading documents...
//                     </div>
//                   ) : viewMode === "management" ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                       {organizations.map((org) => (
//                         <OrganizationCard
//                           key={org._id}
//                           organization={org}
//                           canEditOrganizations={true}
//                           canDeleteOrganizations={true}
//                           onDelete={() => {
//                             organizationService
//                               .deleteOrganization(org._id)
//                               .then(() => {
//                                 queryClient.invalidateQueries({
//                                   queryKey: ["organizations"],
//                                 });
//                                 toast.success("Folder deleted");
//                               });
//                           }}
//                           onUpdate={() =>
//                             queryClient.invalidateQueries({
//                               queryKey: ["organizations"],
//                             })
//                           }
//                         />
//                       ))}
//                     </div>
//                   ) : viewMode === "folders" ? (
//                     <OrganizationFolders
//                       documents={documents}
//                       organizations={organizations}
//                       currentUser={user}
//                     />
//                   ) : (
//                     <>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                         {documents.map((doc: Document) => (
//                           <DocumentCard
//                             key={doc._id}
//                             document={doc}
//                             canEditDocuments={
//                               isSuperAdmin || canDeleteDocuments
//                             }
//                             canDeleteDocuments={canDeleteDocuments}
//                             onView={() => window.open(doc.fileUrl, "_blank")}
//                             onDownload={() =>
//                               documentService.downloadDocument(
//                                 doc._id,
//                                 doc.name,
//                               )
//                             }
//                             onDelete={async () => {
//                               await documentService.deleteDocument(doc._id);
//                               queryClient.invalidateQueries({
//                                 queryKey: ["allDocuments"],
//                               });
//                               toast.success("Document deleted");
//                             }}
//                           />
//                         ))}
//                       </div>

//                       {totalPages > 1 && (
//                         <div className="flex items-center justify-center gap-4 mt-10">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage((p) => p - 1)}
//                           >
//                             <ChevronLeft className="h-4 w-4" /> Previous
//                           </Button>
//                           <span className="text-sm text-muted-foreground">
//                             Page {currentPage} of {totalPages} ({totalDocuments}{" "}
//                             total)
//                           </span>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage((p) => p + 1)}
//                           >
//                             Next <ChevronRight className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </>
//                   )}

//                   {documents.length === 0 && !docsLoading && (
//                     <div className="text-center py-16 text-muted-foreground">
//                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
//                       <p>No documents found</p>
//                       {canUploadDocuments && (
//                         <Button
//                           onClick={() => handleTabChange("upload")}
//                           className="mt-4"
//                         >
//                           Upload Your First Document
//                         </Button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* UPLOAD TAB */}
//             {activeTab === "upload" && canUploadDocuments && (
//               <DocumentUpload
//                 onUpload={async (file, name, type, orgId, start, expiry) => {
//                   await documentService.uploadDocument(
//                     orgId,
//                     file,
//                     name,
//                     type,
//                     start,
//                     expiry,
//                   );
//                   queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
//                   toast.success("Uploaded successfully!");
//                 }}
//                 organizations={organizations}
//                 currentUserOrg={user.organization?._id}
//               />
//             )}

//             {/* REPORTING DASHBOARD - REAL DATA + LOADING / ERROR STATES */}
//             {activeTab === "analytics" && (
//               <div className="space-y-8">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <h1 className="text-3xl font-bold">Reporting Dashboard</h1>
//                     <p className="text-muted-foreground">
//                       Contracts • Invoices • Field Reports • Revenue
//                     </p>
//                   </div>
//                   <div className="flex gap-3">
//                     <Button
//                       variant="outline"
//                       onClick={() => refetchReporting()}
//                       disabled={reportingLoading}
//                     >
//                       <RefreshCw className="mr-2 h-4 w-4" />
//                       Refresh
//                     </Button>
//                     <Button>
//                       <Download className="mr-2 h-4 w-4" />
//                       Export CSV
//                     </Button>
//                   </div>
//                 </div>

//                 {reportingLoading && (
//                   <div className="text-center py-12 text-muted-foreground">
//                     Loading reporting data...
//                   </div>
//                 )}

//                 {reportingError && (
//                   <Card className="border-red-200 bg-red-50">
//                     <CardContent className="p-6 text-red-600">
//                       Failed to load reporting data. Please check your backend
//                       connection or try refreshing.
//                     </CardContent>
//                   </Card>
//                 )}

//                 {!reportingLoading && !reportingError && (
//                   <>
//                     {/* KPI Cards */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//                       <Card>
//                         <CardContent className="p-6">
//                           <div className="flex justify-between">
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Total Contracts
//                               </p>
//                               <p className="text-3xl font-bold mt-1">
//                                 {reportingData.totalContracts || 0}
//                               </p>
//                             </div>
//                             <FileText className="h-10 w-10 text-blue-600" />
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-6">
//                           <div className="flex justify-between">
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Field Reports
//                               </p>
//                               <p className="text-3xl font-bold mt-1">
//                                 {reportingData.totalFieldReports || 0}
//                               </p>
//                             </div>
//                             <Users className="h-10 w-10 text-amber-600" />
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-6">
//                           <div className="flex justify-between">
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Total Revenue
//                               </p>
//                               <p className="text-3xl font-bold mt-1">
//                                 ₦
//                                 {(
//                                   reportingData.totalRevenue || 0
//                                 ).toLocaleString()}
//                               </p>
//                             </div>
//                             <DollarSign className="h-10 w-10 text-green-600" />
//                           </div>
//                         </CardContent>
//                       </Card>
//                       <Card>
//                         <CardContent className="p-6">
//                           <div className="flex justify-between">
//                             <div>
//                               <p className="text-sm text-muted-foreground">
//                                 Outstanding
//                               </p>
//                               <p className="text-3xl font-bold mt-1 text-red-600">
//                                 ₦
//                                 {(
//                                   reportingData.outstandingPayments || 0
//                                 ).toLocaleString()}
//                               </p>
//                             </div>
//                             <AlertTriangle className="h-10 w-10 text-red-600" />
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>

//                     {/* Charts */}
//                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//                       <Card className="lg:col-span-5">
//                         <CardHeader>
//                           <CardTitle>Contracts by Status</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ResponsiveContainer width="100%" height={280}>
//                             <PieChart>
//                               <Pie
//                                 data={reportingData.contractsByStatus || []}
//                                 dataKey="value"
//                                 nameKey="name"
//                                 cx="50%"
//                                 cy="50%"
//                                 outerRadius={100}
//                               >
//                                 {(reportingData.contractsByStatus || []).map(
//                                   (entry: any, i: number) => (
//                                     <Cell key={i} fill={entry.color} />
//                                   ),
//                                 )}
//                               </Pie>
//                               <Tooltip />
//                               <Legend />
//                             </PieChart>
//                           </ResponsiveContainer>
//                         </CardContent>
//                       </Card>

//                       <Card className="lg:col-span-4">
//                         <CardHeader>
//                           <CardTitle>Invoices per Week</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ResponsiveContainer width="100%" height={280}>
//                             <BarChart data={reportingData.weeklyInvoices || []}>
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="week" />
//                               <YAxis />
//                               <Tooltip
//                                 formatter={(v: number) =>
//                                   `₦${v.toLocaleString()}`
//                                 }
//                               />
//                               <Bar dataKey="amount" fill="#3b82f6" />
//                             </BarChart>
//                           </ResponsiveContainer>
//                         </CardContent>
//                       </Card>

//                       <Card className="lg:col-span-3">
//                         <CardHeader>
//                           <CardTitle>Monthly Revenue</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <ResponsiveContainer width="100%" height={280}>
//                             <LineChart
//                               data={reportingData.monthlyRevenue || []}
//                             >
//                               <CartesianGrid strokeDasharray="3 3" />
//                               <XAxis dataKey="month" />
//                               <YAxis />
//                               <Tooltip
//                                 formatter={(v: number) =>
//                                   `₦${v.toLocaleString()}`
//                                 }
//                               />
//                               <Line
//                                 type="monotone"
//                                 dataKey="revenue"
//                                 stroke="#10b981"
//                                 strokeWidth={3}
//                               />
//                             </LineChart>
//                           </ResponsiveContainer>
//                         </CardContent>
//                       </Card>
//                     </div>

//                     {/* Field Reports Analytics */}
//                     <Card>
//                       <CardHeader>
//                         <CardTitle>Field Reports Analytics</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                           <div>
//                             <h4 className="font-medium mb-4">Total Reports</h4>
//                             <p className="text-4xl font-bold text-purple-600">
//                               {reportingData.totalFieldReports || 0}
//                             </p>
//                           </div>
//                           <div>
//                             <h4 className="font-medium mb-4">By Region</h4>
//                             {(reportingData.fieldReportsByRegion || []).map(
//                               (r: any) => (
//                                 <div
//                                   key={r.region}
//                                   className="flex justify-between mb-2"
//                                 >
//                                   <span>{r.region}</span>
//                                   <span className="font-semibold">
//                                     {r.count}
//                                   </span>
//                                 </div>
//                               ),
//                             )}
//                           </div>
//                           <div>
//                             <h4 className="font-medium mb-4">
//                               Top Enumerators
//                             </h4>
//                             {(reportingData.fieldReportsByEnumerator || []).map(
//                               (e: any) => (
//                                 <div
//                                   key={e.name}
//                                   className="flex justify-between mb-2"
//                                 >
//                                   <span>{e.name}</span>
//                                   <Badge>{e.count} reports</Badge>
//                                 </div>
//                               ),
//                             )}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </>
//                 )}
//               </div>
//             )}

//             {activeTab === "users" && canViewUsers && <UserManagement />}
//             {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
//           </main>
//         </div>
//       </div>

//       {/* Create Folder Modal */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Folder</DialogTitle>
//             <DialogDescription>
//               Organize your documents into folders (organizations)
//             </DialogDescription>
//           </DialogHeader>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateFolder();
//             }}
//             className="space-y-4"
//           >
//             <div>
//               <Label>Folder Name</Label>
//               <Input
//                 value={newFolderName}
//                 onChange={(e) => setNewFolderName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label>Type</Label>
//               <Select value={newFolderType} onValueChange={setNewFolderType}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="tech">Tech</SelectItem>
//                   <SelectItem value="admin">Admin</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsCreateOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">Create Folder</Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// }
