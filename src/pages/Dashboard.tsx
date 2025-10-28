// // src/pages/Dashboard.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { AnalyticsCharts } from "../components/AnalyticsCharts";
// import DashboardStats from "../components/DashboardStats";
// import DocumentCard from "../components/DocumentCard";
// import DocumentUpload from "../components/DocumentUpload";
// import FolderManagement from "../components/FolderManagement";
// import { Layout } from "../components/Layout";
// import NotificationsModal from "../components/NotificationsModal";
// import OrganizationFolders from "../components/OrganizationFolders";
// import { RoleManagement } from "../components/RoleManagement";
// import { UserManagement } from "../components/UserManagement";
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
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
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
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, userService, organizationService } from "../lib/api";
// import type { Document, Organization, ApiResponse } from "../types";
// import { handleApiError } from "../utils/error-handler";

// const PAGE_LIMIT = 9999;
// const DOCS_PAGE_SIZE = 6;

// const Dashboard = () => {
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
//     "grid"
//   );
//   const [activeTab, setActiveTab] = useState("documents");
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");
//   const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: For mobile filter toggle
//   // NEW: Pagination state
//   const [currentPage, setCurrentPage] = useState(1);

//   // Permission calculations moved up before useEffects
//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions = user?.role?.permissions || {};
//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canUploadDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;
//   const canEditDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.editDocuments || false;
//   const canDeleteDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments || false;
//   const canViewUsers =
//     isSuperAdmin || permissions.UserManagement?.viewUsers || false;
//   const canManageUserRoles =
//     isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;
//   const canViewOrganizations =
//     isSuperAdmin ||
//     permissions.OrganizationManagement?.viewOrganizations ||
//     false;
//   // Fix: Removed unused canCreateOrganizations

//   const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please log in to access the dashboard");
//       navigate("/login", { replace: true });
//     }
//   }, [authLoading, isAuthenticated, navigate]);

//   // NEW: Reset to first page when search or filter changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   // NEW: Set initial tab based on localStorage and permissions (first load -> analytics if possible)
//   useEffect(() => {
//     if (!user || authLoading) return;

//     const savedTab = localStorage.getItem("dashboardTab");
//     let initialTab: string;

//     if (
//       savedTab &&
//       ["documents", "upload", "analytics", "users", "roles"].includes(savedTab)
//     ) {
//       // Check if still permitted
//       if (savedTab === "analytics" && !canViewAnalytics) {
//         initialTab = "documents";
//       } else if (savedTab === "upload" && !canUploadDocuments) {
//         initialTab = "documents";
//       } else if (savedTab === "users" && !canViewUsers) {
//         initialTab = "documents";
//       } else if (savedTab === "roles" && !canManageUserRoles) {
//         initialTab = "documents";
//       } else {
//         initialTab = savedTab;
//       }
//     } else {
//       // First load: prefer analytics
//       if (canViewAnalytics) {
//         initialTab = "analytics";
//       } else if (canViewUsers) {
//         initialTab = "users";
//       } else if (canUploadDocuments) {
//         initialTab = "upload";
//       } else {
//         initialTab = "documents";
//       }
//     }

//     setActiveTab(initialTab);
//   }, [
//     user,
//     authLoading,
//     canViewAnalytics,
//     canViewUsers,
//     canUploadDocuments,
//     canManageUserRoles,
//   ]);

//   // Fetch notifications
//   const { data: notificationsData } = useQuery({
//     queryKey: ["notifications", user?.organization?._id],
//     queryFn: () =>
//       documentService.getNotifications(user?.organization?._id || ""),
//     enabled: !!user?.organization?._id && canViewDocuments,
//   });

//   const notifications = notificationsData?.data?.notifications || [];
//   const unreadCount = notifications.filter((notif) => !notif.read).length;

//   const { data: userMetricsData } = useQuery<ApiResponse<{ metrics: any }>>({
//     queryKey: ["userMetrics"],
//     queryFn: () => userService.getUserMetrics(),
//     enabled: !!user && canViewUsers,
//   });

//   const { data: orgMetricsData } = useQuery<ApiResponse<{ metrics: any }>>({
//     queryKey: ["organizationMetrics"],
//     queryFn: () => organizationService.getOrganizationMetrics(),
//     enabled: !!user && canViewOrganizations,
//   });

//   const { data: allUsersData } = useQuery<ApiResponse<{ users: any[] }>>({
//     queryKey: ["allUsers"],
//     queryFn: () => userService.getAllUsers({ page: 1, limit: PAGE_LIMIT }),
//     enabled: !!user && canViewUsers,
//   });

//   const { data: singleOrgData, isLoading: singleOrgLoading } = useQuery<
//     Organization | undefined
//   >({
//     queryKey: ["singleOrganization", user?.organization?._id],
//     queryFn: async () => {
//       if (!user?.organization?._id) return undefined;
//       const response = await organizationService.getOrganization(
//         user.organization._id.toString()
//       );
//       return response.data?.organization;
//     },
//     enabled: !!user?.organization?._id && canViewOrganizations && !isSuperAdmin,
//     retry: false,
//   });

//   const { data: organizationsData, isLoading: organizationsLoading } = useQuery<
//     ApiResponse<{ organizations: Organization[] }>
//   >({
//     queryKey: ["organizations"],
//     queryFn: () =>
//       organizationService.getOrganizations({ page: 1, limit: PAGE_LIMIT }),
//     enabled: !!user && canViewOrganizations,
//     retry: false,
//     gcTime: 10 * 60 * 1000, // Fixed: cacheTime -> gcTime
//   });

//   const { data: allDocumentsData, isLoading: allDocsLoading } = useQuery<
//     Document[]
//   >({
//     queryKey: ["allDocuments"],
//     queryFn: async () => {
//       if (canViewOrganizations) {
//         const orgsResponse = await organizationService.getOrganizations({
//           page: 1,
//           limit: PAGE_LIMIT,
//         });
//         const orgs = orgsResponse.data?.organizations || [];
//         const allDocs = await Promise.all(
//           orgs.map(async (org: Organization) => {
//             try {
//               const docsResponse = await documentService.getDocumentsByOrg(
//                 org._id,
//                 { page: 1, limit: 9999 }
//               );
//               return docsResponse.data?.documents || [];
//             } catch (err) {
//               console.error(`Org ${org._id} docs error:`, err);
//               return [];
//             }
//           })
//         );
//         return allDocs.flat();
//       } else {
//         if (!user?.organization?._id) return [];
//         const docsResponse = await documentService.getDocumentsByOrg(
//           user.organization._id,
//           { page: 1, limit: PAGE_LIMIT }
//         );
//         return docsResponse.data?.documents || [];
//       }
//     },
//     enabled: !!user && canViewDocuments,
//     gcTime: 10 * 60 * 1000, // Fixed: cacheTime -> gcTime
//   });

//   const organizations = useMemo(() => {
//     // Flatten nested _id if populated recursively
//     const flatOrgs = (organizationsData?.data?.organizations || []).map(
//       (org: any) => ({
//         _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
//         name: org.name,
//         organizationType: org.organizationType,
//         documentCount: org.documentCount,
//       })
//     );
//     if (canViewOrganizations) {
//       if (isSuperAdmin) {
//         return flatOrgs;
//       } else if (singleOrgData) {
//         return [singleOrgData];
//       } else if (user?.organization?._id) {
//         return [
//           {
//             _id: user.organization._id,
//             name: "Current Organization",
//             organizationType: "tech",
//           },
//         ];
//       }
//     }
//     return [];
//   }, [
//     organizationsData,
//     singleOrgData,
//     user?.organization?._id,
//     canViewOrganizations,
//     isSuperAdmin,
//   ]);

//   const documents = allDocumentsData || [];
//   const allUsers = allUsersData?.data?.users || [];
//   const userMetrics = userMetricsData?.data?.metrics || { totalUsers: 0 };
//   const orgMetrics = orgMetricsData?.data?.metrics || { totalOrganizations: 0 };

//   const filteredDocuments = useMemo(
//     () =>
//       documents.filter((doc: Document) => {
//         // Fixed: Typed param
//         const matchesSearch = doc.name
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase());
//         const matchesType =
//           filterType === "all" || doc.documentType === filterType;
//         return matchesSearch && matchesType;
//       }),
//     [documents, searchTerm, filterType]
//   );

//   // NEW: Pagination logic
//   const totalPages = useMemo(
//     () => Math.ceil(filteredDocuments.length / DOCS_PAGE_SIZE),
//     [filteredDocuments.length]
//   );
//   const startIndex = useMemo(
//     () => (currentPage - 1) * DOCS_PAGE_SIZE,
//     [currentPage]
//   );
//   const paginatedDocuments = useMemo(
//     () => filteredDocuments.slice(startIndex, startIndex + DOCS_PAGE_SIZE),
//     [filteredDocuments, startIndex]
//   );

//   const handleUpload = async (
//     file: File,
//     name: string,
//     type: string,
//     organizationId: string,
//     startDate?: string,
//     expiryDate?: string
//   ) => {
//     setUploadLoading(true);
//     setUploadError("");
//     setUploadSuccess("");
//     try {
//       await documentService.uploadDocument(
//         organizationId,
//         file,
//         name,
//         type,
//         startDate,
//         expiryDate
//       );
//       // Invalidate and refetch documents
//       await queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
//       toast.success("Document uploaded successfully!");
//       setUploadSuccess("Document uploaded successfully!");
//       // NEW: Do not force switch to documents; stay on current tab
//       setCurrentPage(1); // NEW: Reset to first page after upload (if on documents)
//     } catch (error) {
//       const errorMessage = handleApiError(error);
//       setUploadError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleDocumentAction = async (action: string, doc: Document) => {
//     try {
//       switch (action) {
//         case "view":
//           window.open(doc.fileUrl, "_blank");
//           toast.info(`Viewing ${doc.name}`);
//           break;
//         case "download":
//           await documentService.downloadDocument(doc._id, doc.name);
//           toast.success(`Downloading ${doc.name}`);
//           break;
//         case "edit":
//           toast.info(`Editing ${doc.name}`);
//           break;
//         case "delete":
//           await documentService.deleteDocument(doc._id);
//           // Invalidate and refetch documents immediately
//           await queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
//           toast.success(`${doc.name} deleted`);
//           setCurrentPage(1); // NEW: Reset to first page after delete
//           break;
//       }
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   const handleCreateFolder = async (folderName: string, folderType: string) => {
//     try {
//       await organizationService.createOrganization({
//         name: folderName,
//         organizationType: folderType || "tech",
//       });
//       // Invalidate and refetch organizations
//       await queryClient.invalidateQueries({ queryKey: ["organizations"] });
//       toast.success(`Folder "${folderName}" created successfully`);
//     } catch (error: any) {
//       console.error("Create folder error:", error);
//       toast.error(error.response?.data?.message || "Failed to create folder");
//     }
//   };

//   const handleDeleteFolder = async (folderId: string) => {
//     try {
//       await organizationService.deleteOrganization(folderId);
//       // Invalidate and refetch organizations
//       await queryClient.invalidateQueries({ queryKey: ["organizations"] });
//       toast.success("Folder deleted successfully");
//     } catch (error: any) {
//       console.error("Delete folder error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete folder");
//     }
//   };

//   const handleRenameFolder = async (folderId: string, newName: string) => {
//     try {
//       await organizationService.updateOrganization(folderId, { name: newName });
//       // Invalidate and refetch organizations
//       await queryClient.invalidateQueries({ queryKey: ["organizations"] });
//       toast.success("Folder renamed successfully");
//     } catch (error: any) {
//       console.error("Rename folder error:", error);
//       toast.error(error.response?.data?.message || "Failed to rename folder");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       toast.success("Logged out successfully");
//       navigate("/login", { replace: true });
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   // NEW: Handle tab change and persist to localStorage
//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
//     localStorage.setItem("dashboardTab", value);
//   };

//   if (
//     authLoading ||
//     (canViewOrganizations && (organizationsLoading || singleOrgLoading))
//   ) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground text-base">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAuthenticated) {
//     return null;
//   }

//   if (allDocsLoading && canViewDocuments) {
//     return (
//       <Layout user={user || undefined} onLogout={handleLogout}>
//         {" "}
//         {/* Fixed: Handle null/undefined */}
//         <div className="text-center py-12">
//           <p className="text-muted-foreground text-base">
//             Loading documents...
//           </p>
//         </div>
//       </Layout>
//     );
//   }

//   const hasAdminAccess = canViewUsers || canManageUserRoles;

//   return (
//     <Layout user={user || undefined} onLogout={handleLogout}>
//       {" "}
//       {/* Fixed: Handle null/undefined */}
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-2 flex-1">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
//                 Dashboard
//               </h1>
//               <p className="text-muted-foreground text-sm sm:text-base">
//                 Manage your contracts and documents
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <NotificationsModal unreadCount={unreadCount} />
//           </div>
//         </div>

//         <DashboardStats
//           totalDocuments={documents.length}
//           recentUploads={
//             documents.filter(
//               (
//                 d: Document // Fixed: Typed param
//               ) =>
//                 new Date(d.createdAt) >
//                 new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//             ).length
//           }
//           isAdmin={hasAdminAccess}
//         />

//         <Tabs
//           value={activeTab}
//           onValueChange={handleTabChange}
//           className="space-y-4"
//         >
//           <TabsList className="flex flex-col sm:flex-row w-full justify-start gap-2 p-2 border rounded-md bg-muted">
//             <TabsTrigger
//               value="documents"
//               className="flex-1 min-w-[100px] text-sm"
//             >
//               <FileText className="h-4 w-4 mr-2" />
//               Documents
//             </TabsTrigger>
//             {canUploadDocuments && (
//               <TabsTrigger
//                 value="upload"
//                 className="flex-1 min-w-[100px] text-sm"
//               >
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload
//               </TabsTrigger>
//             )}
//             {canViewAnalytics && (
//               <TabsTrigger
//                 value="analytics"
//                 className="flex-1 min-w-[100px] text-sm"
//               >
//                 <BarChart3 className="h-4 w-4 mr-2" />
//                 Analytics
//               </TabsTrigger>
//             )}
//             {canViewUsers && (
//               <TabsTrigger
//                 value="users"
//                 className="flex-1 min-w-[100px] text-sm"
//               >
//                 <Users className="h-4 w-4 mr-2" />
//                 Users
//               </TabsTrigger>
//             )}
//             {canManageUserRoles && (
//               <TabsTrigger
//                 value="roles"
//                 className="flex-1 min-w-[100px] text-sm"
//               >
//                 <Shield className="h-4 w-4 mr-2" />
//                 Roles
//               </TabsTrigger>
//             )}
//           </TabsList>

//           <TabsContent value="documents" className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
//               <div className="relative flex-1 w-full">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search documents..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 text-sm"
//                 />
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//                 className="sm:hidden w-full"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filter
//               </Button>
//               <div
//                 className={`${
//                   isFilterOpen ? "block" : "hidden"
//                 } sm:block w-full sm:w-48`}
//               >
//                 <Select value={filterType} onValueChange={setFilterType}>
//                   <SelectTrigger className="w-full text-sm">
//                     <Filter className="h-4 w-4 mr-2" />
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Types</SelectItem>
//                     <SelectItem value="Contract">Contracts</SelectItem>
//                     <SelectItem value="SLA">SLAs</SelectItem>
//                     <SelectItem value="NDA">NDAs</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex gap-1 border rounded-lg p-1 w-full sm:w-auto">
//                 <Button
//                   variant={viewMode === "management" ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => setViewMode("management")}
//                   className="flex-1 px-2"
//                   title="Folder Management"
//                   disabled={!canViewOrganizations}
//                 >
//                   <Building className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "folders" ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => setViewMode("folders")}
//                   className="flex-1 px-2"
//                   title="Folder View"
//                   disabled={!canViewOrganizations}
//                 >
//                   <FolderOpen className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                   className="flex-1 px-2"
//                   title="Grid View"
//                 >
//                   <Grid3X3 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {allDocsLoading ? (
//               <div className="text-center py-12">
//                 <p className="text-muted-foreground text-base">
//                   Loading documents...
//                 </p>
//               </div>
//             ) : viewMode === "management" ? (
//               <FolderManagement
//                 documents={filteredDocuments}
//                 organizations={organizations}
//                 currentUser={user}
//                 onDocumentAction={handleDocumentAction}
//                 onCreateFolder={handleCreateFolder}
//                 onDeleteFolder={handleDeleteFolder}
//                 onRenameFolder={handleRenameFolder}
//               />
//             ) : viewMode === "folders" ? (
//               <OrganizationFolders
//                 documents={filteredDocuments}
//                 organizations={organizations}
//                 currentUser={user}
//                 onDocumentAction={handleDocumentAction}
//               />
//             ) : (
//               <>
//                 <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                   {paginatedDocuments.map(
//                     (
//                       doc: Document // Fixed: Typed param
//                     ) => (
//                       <DocumentCard
//                         key={doc._id}
//                         document={doc}
//                         canEditDocuments={canEditDocuments}
//                         canDeleteDocuments={canDeleteDocuments}
//                         onView={() => handleDocumentAction("view", doc)}
//                         onDownload={() => handleDocumentAction("download", doc)}
//                         onEdit={() => handleDocumentAction("edit", doc)}
//                         onDelete={() => handleDocumentAction("delete", doc)}
//                       />
//                     )
//                   )}
//                 </div>

//                 {/* NEW: Pagination Controls */}
//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-6">
//                     <div className="text-sm text-muted-foreground">
//                       Showing {startIndex + 1} to{" "}
//                       {Math.min(
//                         startIndex + DOCS_PAGE_SIZE,
//                         filteredDocuments.length
//                       )}{" "}
//                       of {filteredDocuments.length} documents
//                     </div>
//                     <div className="flex gap-1">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage((p) => Math.max(1, p - 1))
//                         }
//                         disabled={currentPage === 1}
//                       >
//                         <ChevronLeft className="h-4 w-4 mr-1" />
//                         Previous
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() =>
//                           setCurrentPage((p) => Math.min(totalPages, p + 1))
//                         }
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                         <ChevronRight className="h-4 w-4 ml-1" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {!allDocsLoading && filteredDocuments.length === 0 && (
//               <div className="text-center py-12">
//                 {!canViewDocuments ? (
//                   <p className="text-muted-foreground text-base">
//                     You do not have permission to view documents.
//                   </p>
//                 ) : (
//                   <div className="text-center py-12">
//                     <p className="text-muted-foreground text-base">
//                       No documents found matching your criteria.
//                     </p>
//                     {canUploadDocuments && (
//                       <Button
//                         onClick={() => handleTabChange("upload")}
//                         className="mt-4 text-sm"
//                       >
//                         Upload one
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </TabsContent>

//           {canUploadDocuments && (
//             <TabsContent value="upload">
//               <DocumentUpload
//                 onUpload={handleUpload}
//                 organizations={organizations}
//                 currentUserOrg={user.organization?._id || undefined}
//                 loading={uploadLoading}
//                 error={uploadError}
//                 success={uploadSuccess}
//               />
//             </TabsContent>
//           )}

//           {canViewAnalytics && (
//             <TabsContent value="analytics">
//               <AnalyticsCharts
//                 allUsers={allUsers}
//                 allDocuments={documents}
//                 allOrganizations={organizations}
//                 userMetrics={userMetrics}
//                 orgMetrics={orgMetrics}
//               />
//             </TabsContent>
//           )}

//           {canViewUsers && (
//             <TabsContent value="users">
//               <UserManagement />
//             </TabsContent>
//           )}

//           {canManageUserRoles && (
//             <TabsContent value="roles">
//               <RoleManagement />
//             </TabsContent>
//           )}
//         </Tabs>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import DashboardStats from "../components/DashboardStats";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import FolderManagement from "../components/FolderManagement";
import { Layout } from "../components/Layout";
import NotificationsModal from "../components/NotificationsModal";
import OrganizationFolders from "../components/OrganizationFolders";
import { RoleManagement } from "../components/RoleManagement";
import { UserManagement } from "../components/UserManagement";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, userService, organizationService } from "../lib/api";
import type { Document, Organization, ApiResponse } from "../types";
import { handleApiError } from "../utils/error-handler";

const PAGE_LIMIT = 9999;
const DOCS_PAGE_SIZE = 8;

const Dashboard = () => {
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
    "grid"
  );
  const [activeTab, setActiveTab] = useState("documents");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isTabsVisible, setIsTabsVisible] = useState(false);
  const [isTabContentVisible, setIsTabContentVisible] = useState(false);

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions = user?.role?.permissions || {};
  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;
  const canEditDocuments =
    isSuperAdmin || permissions.DocumentManagement?.editDocuments || false;
  const canDeleteDocuments =
    isSuperAdmin || permissions.DocumentManagement?.deleteDocuments || false;
  const canViewUsers =
    isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const canManageUserRoles =
    isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;
  const canViewOrganizations =
    isSuperAdmin ||
    permissions.OrganizationManagement?.viewOrganizations ||
    false;

  const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const headerTimer = setTimeout(() => setIsHeaderVisible(true), 500);
      const statsTimer = setTimeout(() => setIsStatsVisible(true), 1000);
      const tabsTimer = setTimeout(() => setIsTabsVisible(true), 1500);
      const contentTimer = setTimeout(() => setIsTabContentVisible(true), 2000);

      return () => {
        clearTimeout(headerTimer);
        clearTimeout(statsTimer);
        clearTimeout(tabsTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  useEffect(() => {
    if (!user || authLoading) return;

    const savedTab = localStorage.getItem("dashboardTab");
    let initialTab: string;

    if (
      savedTab &&
      ["documents", "upload", "analytics", "users", "roles"].includes(savedTab)
    ) {
      if (savedTab === "analytics" && !canViewAnalytics) {
        initialTab = "documents";
      } else if (savedTab === "upload" && !canUploadDocuments) {
        initialTab = "documents";
      } else if (savedTab === "users" && !canViewUsers) {
        initialTab = "documents";
      } else if (savedTab === "roles" && !canManageUserRoles) {
        initialTab = "documents";
      } else {
        initialTab = savedTab;
      }
    } else {
      if (canViewAnalytics) {
        initialTab = "analytics";
      } else if (canViewUsers) {
        initialTab = "users";
      } else if (canUploadDocuments) {
        initialTab = "upload";
      } else {
        initialTab = "documents";
      }
    }

    setActiveTab(initialTab);
  }, [
    user,
    authLoading,
    canViewAnalytics,
    canViewUsers,
    canUploadDocuments,
    canManageUserRoles,
  ]);

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", user?.organization?._id],
    queryFn: () =>
      documentService.getNotifications(user?.organization?._id || ""),
    enabled: !!user?.organization?._id && canViewDocuments,
  });

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const { data: userMetricsData } = useQuery<ApiResponse<{ metrics: any }>>({
    queryKey: ["userMetrics"],
    queryFn: () => userService.getUserMetrics(),
    enabled: !!user && canViewUsers,
  });

  const { data: orgMetricsData } = useQuery<ApiResponse<{ metrics: any }>>({
    queryKey: ["organizationMetrics"],
    queryFn: () => organizationService.getOrganizationMetrics(),
    enabled: !!user && canViewOrganizations,
  });

  const { data: allUsersData } = useQuery<ApiResponse<{ users: any[] }>>({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers({ page: 1, limit: PAGE_LIMIT }),
    enabled: !!user && canViewUsers,
  });

  const { data: singleOrgData, isLoading: singleOrgLoading } = useQuery<
    Organization | undefined
  >({
    queryKey: ["singleOrganization", user?.organization?._id],
    queryFn: async () => {
      if (!user?.organization?._id) return undefined;
      const response = await organizationService.getOrganization(
        user.organization._id.toString()
      );
      return response.data?.organization;
    },
    enabled: !!user?.organization?._id && canViewOrganizations && !isSuperAdmin,
    retry: false,
  });

  const { data: organizationsData, isLoading: organizationsLoading } = useQuery<
    ApiResponse<{ organizations: Organization[] }>
  >({
    queryKey: ["organizations"],
    queryFn: () =>
      organizationService.getOrganizations({ page: 1, limit: PAGE_LIMIT }),
    enabled: !!user && canViewOrganizations,
    retry: false,
    gcTime: 10 * 60 * 1000,
  });

  const { data: allDocumentsData, isLoading: allDocsLoading } = useQuery<
    Document[]
  >({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (canViewOrganizations) {
        const orgsResponse = await organizationService.getOrganizations({
          page: 1,
          limit: PAGE_LIMIT,
        });
        const orgs = orgsResponse.data?.organizations || [];
        const allDocs = await Promise.all(
          orgs.map(async (org: Organization) => {
            try {
              const docsResponse = await documentService.getDocumentsByOrg(
                org._id,
                { page: 1, limit: 9999 }
              );
              return docsResponse.data?.documents || [];
            } catch (err) {
              console.error(`Org ${org._id} docs error:`, err);
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        if (!user?.organization?._id) return [];
        const docsResponse = await documentService.getDocumentsByOrg(
          user.organization._id,
          { page: 1, limit: PAGE_LIMIT }
        );
        return docsResponse.data?.documents || [];
      }
    },
    enabled: !!user && canViewDocuments,
    gcTime: 10 * 60 * 1000,
  });

  const organizations = useMemo(() => {
    const flatOrgs = (organizationsData?.data?.organizations || []).map(
      (org: any) => ({
        _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
        name: org.name,
        organizationType: org.organizationType,
        documentCount: org.documentCount,
      })
    );
    if (canViewOrganizations) {
      if (isSuperAdmin) {
        return flatOrgs;
      } else if (singleOrgData) {
        return [singleOrgData];
      } else if (user?.organization?._id) {
        return [
          {
            _id: user.organization._id,
            name: "Current Organization",
            organizationType: "tech",
          },
        ];
      }
    }
    return [];
  }, [
    organizationsData,
    singleOrgData,
    user?.organization?._id,
    canViewOrganizations,
    isSuperAdmin,
  ]);

  const documents = allDocumentsData || [];
  const allUsers = allUsersData?.data?.users || [];
  const userMetrics = userMetricsData?.data?.metrics || { totalUsers: 0 };
  const orgMetrics = orgMetricsData?.data?.metrics || { totalOrganizations: 0 };

  const filteredDocuments = useMemo(
    () =>
      documents.filter((doc: Document) => {
        const matchesSearch = doc.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType =
          filterType === "all" || doc.documentType === filterType;
        return matchesSearch && matchesType;
      }),
    [documents, searchTerm, filterType]
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredDocuments.length / DOCS_PAGE_SIZE),
    [filteredDocuments.length]
  );
  const startIndex = useMemo(
    () => (currentPage - 1) * DOCS_PAGE_SIZE,
    [currentPage]
  );
  const paginatedDocuments = useMemo(
    () => filteredDocuments.slice(startIndex, startIndex + DOCS_PAGE_SIZE),
    [filteredDocuments, startIndex]
  );

  const handleUpload = async (
    file: File,
    name: string,
    type: string,
    organizationId: string,
    startDate?: string,
    expiryDate?: string
  ) => {
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      await documentService.uploadDocument(
        organizationId,
        file,
        name,
        type,
        startDate,
        expiryDate
      );
      await queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
      toast.success("Document uploaded successfully!");
      setUploadSuccess("Document uploaded successfully!");
      setCurrentPage(1);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocumentAction = async (action: string, doc: Document) => {
    try {
      switch (action) {
        case "view":
          window.open(doc.fileUrl, "_blank");
          toast.info(`Viewing ${doc.name}`);
          break;
        case "download":
          await documentService.downloadDocument(doc._id, doc.name);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "edit":
          toast.info(`Editing ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc._id);
          await queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
          toast.success(`${doc.name} deleted`);
          setCurrentPage(1);
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateFolder = async (folderName: string, folderType: string) => {
    try {
      await organizationService.createOrganization({
        name: folderName,
        organizationType: folderType || "tech",
      });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`Folder "${folderName}" created successfully`);
    } catch (error: any) {
      console.error("Create folder error:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await organizationService.deleteOrganization(folderId);
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Folder deleted successfully");
    } catch (error: any) {
      console.error("Delete folder error:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await organizationService.updateOrganization(folderId, { name: newName });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Folder renamed successfully");
    } catch (error: any) {
      console.error("Rename folder error:", error);
      toast.error(error.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("dashboardTab", value);
  };

  if (
    authLoading ||
    (canViewOrganizations && (organizationsLoading || singleOrgLoading))
  ) {
    return (
      <div className="text-center py-12 animate-fade-in-slow">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  if (allDocsLoading && canViewDocuments) {
    return (
      <Layout user={user || undefined} onLogout={handleLogout}>
        <div className="text-center py-12 animate-fade-in-slow">
          <p className="text-muted-foreground text-sm">Loading documents...</p>
        </div>
      </Layout>
    );
  }

  const hasAdminAccess = canViewUsers || canManageUserRoles;

  return (
    <Layout user={user || undefined} onLogout={handleLogout}>
      <div className="space-y-4">
        {isHeaderVisible && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-slide-in-up">
            <div className="flex items-center gap-2 flex-1">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Manage your contracts and documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsModal unreadCount={unreadCount} />
            </div>
          </div>
        )}

        {isStatsVisible && (
          <div className="animate-slide-in-up delay-500">
            <DashboardStats
              totalDocuments={documents.length}
              recentUploads={
                documents.filter(
                  (d: Document) =>
                    new Date(d.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
              isAdmin={hasAdminAccess}
            />
          </div>
        )}

        {isTabsVisible && (
          <div className="animate-slide-in-up delay-1000">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-3"
            >
              <TabsList className="flex flex-col sm:flex-row w-full justify-start gap-1 p-1 border rounded bg-muted">
                <TabsTrigger
                  value="documents"
                  className="flex-1 min-w-[80px] text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Documents
                </TabsTrigger>
                {canUploadDocuments && (
                  <TabsTrigger
                    value="upload"
                    className="flex-1 min-w-[80px] text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </TabsTrigger>
                )}
                {canViewAnalytics && (
                  <TabsTrigger
                    value="analytics"
                    className="flex-1 min-w-[80px] text-xs"
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </TabsTrigger>
                )}
                {canViewUsers && (
                  <TabsTrigger
                    value="users"
                    className="flex-1 min-w-[80px] text-xs"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Users
                  </TabsTrigger>
                )}
                {canManageUserRoles && (
                  <TabsTrigger
                    value="roles"
                    className="flex-1 min-w-[80px] text-xs"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Roles
                  </TabsTrigger>
                )}
              </TabsList>

              {isTabContentVisible && (
                <>
                  <TabsContent
                    value="documents"
                    className="space-y-3 animate-slide-in-up delay-1500"
                  >
                    <div className="flex flex-col sm:flex-row gap-1 items-start sm:items-center">
                      <div className="relative flex-1 w-full">
                        <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 text-xs h-8"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="sm:hidden w-full text-xs h-8"
                      >
                        <Filter className="h-3 w-3 mr-1" />
                        Filter
                      </Button>
                      <div
                        className={`${
                          isFilterOpen ? "block" : "hidden"
                        } sm:block w-full sm:w-32`}
                      >
                        <Select
                          value={filterType}
                          onValueChange={setFilterType}
                        >
                          <SelectTrigger className="w-full text-xs h-8">
                            <Filter className="h-3 w-3 mr-1" />
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
                      <div className="flex gap-1 border rounded p-1 w-full sm:w-auto">
                        <Button
                          variant={
                            viewMode === "management" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setViewMode("management")}
                          className="flex-1 px-1 text-xs h-8"
                          title="Folder Management"
                          disabled={!canViewOrganizations}
                        >
                          <Building className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={viewMode === "folders" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("folders")}
                          className="flex-1 px-1 text-xs h-8"
                          title="Folder View"
                          disabled={!canViewOrganizations}
                        >
                          <FolderOpen className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="flex-1 px-1 text-xs h-8"
                          title="Grid View"
                        >
                          <Grid3X3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {allDocsLoading ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          Loading documents...
                        </p>
                      </div>
                    ) : viewMode === "management" ? (
                      <FolderManagement
                        documents={filteredDocuments}
                        organizations={organizations}
                        currentUser={user}
                        onDocumentAction={handleDocumentAction}
                        onCreateFolder={handleCreateFolder}
                        onDeleteFolder={handleDeleteFolder}
                        onRenameFolder={handleRenameFolder}
                      />
                    ) : viewMode === "folders" ? (
                      <OrganizationFolders
                        documents={filteredDocuments}
                        organizations={organizations}
                        currentUser={user}
                        onDocumentAction={handleDocumentAction}
                      />
                    ) : (
                      <>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                          {paginatedDocuments.map((doc: Document) => (
                            <DocumentCard
                              key={doc._id}
                              document={doc}
                              canEditDocuments={canEditDocuments}
                              canDeleteDocuments={canDeleteDocuments}
                              onView={() => handleDocumentAction("view", doc)}
                              onDownload={() =>
                                handleDocumentAction("download", doc)
                              }
                              onEdit={() => handleDocumentAction("edit", doc)}
                              onDelete={() =>
                                handleDocumentAction("delete", doc)
                              }
                            />
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-xs text-muted-foreground">
                              Showing {startIndex + 1} to{" "}
                              {Math.min(
                                startIndex + DOCS_PAGE_SIZE,
                                filteredDocuments.length
                              )}{" "}
                              of {filteredDocuments.length} documents
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="text-xs h-7 px-2"
                              >
                                <ChevronLeft className="h-3 w-3 mr-1" />
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                  )
                                }
                                disabled={currentPage === totalPages}
                                className="text-xs h-7 px-2"
                              >
                                Next
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {!allDocsLoading && filteredDocuments.length === 0 && (
                      <div className="text-center py-8">
                        {!canViewDocuments ? (
                          <p className="text-muted-foreground text-sm">
                            You do not have permission to view documents.
                          </p>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground text-sm">
                              No documents found matching your criteria.
                            </p>
                            {canUploadDocuments && (
                              <Button
                                onClick={() => handleTabChange("upload")}
                                className="mt-3 text-xs h-7 px-3"
                              >
                                Upload one
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {canUploadDocuments && (
                    <TabsContent
                      value="upload"
                      className="animate-slide-in-up delay-1500"
                    >
                      <DocumentUpload
                        onUpload={handleUpload}
                        organizations={organizations}
                        currentUserOrg={user.organization?._id || undefined}
                        loading={uploadLoading}
                        error={uploadError}
                        success={uploadSuccess}
                      />
                    </TabsContent>
                  )}

                  {canViewAnalytics && (
                    <TabsContent
                      value="analytics"
                      className="animate-slide-in-up delay-1500"
                    >
                      <AnalyticsCharts
                        allUsers={allUsers}
                        allDocuments={documents}
                        allOrganizations={organizations}
                        userMetrics={userMetrics}
                        orgMetrics={orgMetrics}
                      />
                    </TabsContent>
                  )}

                  {canViewUsers && (
                    <TabsContent
                      value="users"
                      className="animate-slide-in-up delay-1500"
                    >
                      <UserManagement />
                    </TabsContent>
                  )}

                  {canManageUserRoles && (
                    <TabsContent
                      value="roles"
                      className="animate-slide-in-up delay-1500"
                    >
                      <RoleManagement />
                    </TabsContent>
                  )}
                </>
              )}
            </Tabs>
          </div>
        )}

        {!isTabContentVisible && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent mb-3" />
              <p className="text-muted-foreground text-sm">Easing in...</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
