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
//   const { data: reportingResponse } = useQuery({
//     queryKey: ["reporting-dashboard"],
//     queryFn: () => documentService.getDashboardMetrics(),
//     enabled: !!user,
//   });

//   const reportingData = reportingResponse?.data || {};

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

//   useEffect(() => setCurrentPage(1), [searchTerm, filterType]);

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

//                   {/* Documents Content (your original logic) */}
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

//             {/* REPORTING DASHBOARD - NOW USING REAL DATA */}
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
//                             {reportingData.totalContracts || 0}
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
//                             {reportingData.totalFieldReports || 0}
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
//                             {(reportingData.totalRevenue || 0).toLocaleString()}
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
//                               reportingData.outstandingPayments || 0
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
//                             data={reportingData.contractsByStatus || []}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             outerRadius={100}
//                           >
//                             {(reportingData.contractsByStatus || []).map(
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
//                         <BarChart data={reportingData.weeklyInvoices || []}>
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
//                         <LineChart data={reportingData.monthlyRevenue || []}>
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
//                           {reportingData.totalFieldReports || 0}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="font-medium mb-4">By Region</h4>
//                         {(reportingData.fieldReportsByRegion || []).map(
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
//                         {(reportingData.fieldReportsByEnumerator || []).map(
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

// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// import { Layout } from "../components/Layout";
import NotificationsModal from "../components/NotificationsModal";
import OrganizationFolders from "../components/OrganizationFolders";
import OrganizationCard from "../components/OrganizationCard";
import { RoleManagement } from "../components/RoleManagement";
import { UserManagement } from "../components/UserManagement";
// ✅ Correct
import { DocumentCard } from "../components/DocumentCard";
import { DocumentUpload } from "../components/DocumentUpload";
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
import { Skeleton } from "../components/ui/skeleton";
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
  LayoutGrid,
  Settings,
  LogOut,
  MoreHorizontal,
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

  // ====================== STATE ======================
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

  // ====================== QUERIES ======================
  const { data: reportingResponse } = useQuery({
    queryKey: ["reporting-dashboard"],
    queryFn: () => documentService.getDashboardMetrics(),
    enabled: !!user,
  });

  const reportingData = reportingResponse?.data || {};

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

  const recentUploads = useMemo(
    () =>
      documents.filter(
        (d: Document) =>
          new Date(d.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      ).length,
    [documents],
  );

  // ====================== HANDLERS ======================
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

  // ====================== EFFECTS ======================
  useEffect(() => setCurrentPage(1), [searchTerm, filterType]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Initializing Dashboard
          </p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "documents", label: "Documents", icon: FileText },
    {
      id: "upload",
      label: "Upload",
      icon: Upload,
      show: canUploadDocuments,
    },
    { id: "analytics", label: "Reporting", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users, show: canViewUsers },
    { id: "roles", label: "Roles", icon: Shield, show: canManageUserRoles },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden selection:bg-white/20">
      {/* Sidebar (Desktop) */}
      <aside className="w-72 border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl hidden lg:flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="text-black font-bold text-lg">C</span>
          </div>
          <span className="font-bold tracking-[0.2em] uppercase text-sm">
            ContractHub
          </span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems
            .filter((item) => item.show !== false)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? "bg-white/5 text-white ring-1 ring-white/10"
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeTab === item.id
                      ? "text-white"
                      : "text-zinc-600 group-hover:text-white"
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"
                  />
                )}
              </button>
            ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                {user.fullName || "User"}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest truncate">
                {user.role?.name || "Member"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 text-zinc-600 group-hover:text-rose-400" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 z-40 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-zinc-400"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold tracking-widest uppercase text-xs">
              CMP
            </span>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl relative group mx-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search agreements, metadata, users..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all placeholder:text-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <NotificationsModal unreadCount={unreadCount} />
            <button className="p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {/* DOCUMENTS TAB */}
              {activeTab === "documents" && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tight mb-3">
                        Agreement Repository
                      </h2>
                      <p className="text-zinc-500 text-sm font-light max-w-md">
                        Orchestrate and monitor your organization's legal
                        lifecycle with precision intelligence.
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Filter */}
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-48 bg-white/5 border-white/10 rounded-2xl text-sm">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/10">
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Contract">Contracts</SelectItem>
                          <SelectItem value="SLA">SLAs</SelectItem>
                          <SelectItem value="NDA">NDAs</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* View Mode Toggle */}
                      <div className="flex p-1.5 bg-white/5 border border-white/5 rounded-2xl">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-2.5 rounded-xl transition-all ${
                            viewMode === "grid"
                              ? "bg-white text-black shadow-lg"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("folders")}
                          className={`p-2.5 rounded-xl transition-all ${
                            viewMode === "folders"
                              ? "bg-white text-black shadow-lg"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <FolderOpen className="w-4 h-4" />
                        </button>
                        {canViewOrganizations && (
                          <button
                            onClick={() => setViewMode("management")}
                            className={`p-2.5 rounded-xl transition-all ${
                              viewMode === "management"
                                ? "bg-white text-black shadow-lg"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Building className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      {canCreateOrganizations && (
                        <Button
                          onClick={() => setIsCreateOpen(true)}
                          className="flex items-center gap-2.5 px-8 py-3.5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                          <Plus className="w-4 h-4" /> New Folder
                        </Button>
                      )}
                      {canUploadDocuments && (
                        <Button
                          onClick={() => handleTabChange("upload")}
                          className="flex items-center gap-2.5 px-8 py-3.5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
                        >
                          <Plus className="w-4 h-4" /> New Upload
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <DashboardStats
                    totalDocuments={totalDocuments}
                    recentUploads={recentUploads}
                    isAdmin={canViewUsers || canManageUserRoles}
                  />

                  {/* Content Area */}
                  <div className="space-y-6">
                    {viewMode === "management" ? (
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
                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                          {docsLoading
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton
                                  key={i}
                                  className="h-[280px] w-full bg-white/5 rounded-3xl border border-white/5"
                                />
                              ))
                            : documents.map((doc: Document) => (
                                <DocumentCard
                                  key={doc._id}
                                  document={doc}
                                  canEditDocuments={
                                    isSuperAdmin || canDeleteDocuments
                                  }
                                  canDeleteDocuments={canDeleteDocuments}
                                  onView={() =>
                                    window.open(doc.fileUrl, "_blank")
                                  }
                                  onDownload={() =>
                                    documentService.downloadDocument(
                                      doc._id,
                                      doc.name,
                                    )
                                  }
                                  onDelete={async () => {
                                    await documentService.deleteDocument(
                                      doc._id,
                                    );
                                    queryClient.invalidateQueries({
                                      queryKey: ["allDocuments"],
                                    });
                                    toast.success("Document deleted");
                                  }}
                                />
                              ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-6 pt-12">
                            <button
                              disabled={currentPage === 1}
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              className="p-3 border border-white/5 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-all active:scale-90"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                              {Array.from({
                                length: Math.min(5, totalPages),
                              }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-10 h-10 rounded-xl text-xs font-mono transition-all ${
                                    currentPage === i + 1
                                      ? "bg-white text-black"
                                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                            <button
                              disabled={currentPage === totalPages}
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1),
                                )
                              }
                              className="p-3 border border-white/5 rounded-2xl disabled:opacity-20 hover:bg-white/5 transition-all active:scale-90"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {/* Empty State */}
                    {documents.length === 0 && !docsLoading && (
                      <div className="text-center py-16 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-zinc-400">No documents found</p>
                        {canUploadDocuments && (
                          <Button
                            onClick={() => handleTabChange("upload")}
                            className="mt-6"
                          >
                            Upload Your First Document
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* UPLOAD TAB */}
              {activeTab === "upload" && canUploadDocuments && (
                <DocumentUpload
                  onUpload={async (
                    file: File,
                    name: string,
                    type: string,
                    orgId: string,
                    start?: string,
                    expiry?: string,
                  ) => {
                    await documentService.uploadDocument(
                      orgId,
                      file,
                      name,
                      type,
                      start,
                      expiry,
                    );
                    queryClient.invalidateQueries({
                      queryKey: ["allDocuments"],
                    });
                    toast.success("Uploaded successfully!");
                  }}
                  organizations={organizations}
                  currentUserOrg={user.organization?._id}
                />
              )}

              {/* ANALYTICS TAB - Full premium version with original data */}
              {activeTab === "analytics" && (
                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tight mb-3">
                        Intelligence Hub
                      </h2>
                      <p className="text-zinc-500 text-sm font-light max-w-md">
                        Predictive analytics and performance metrics for your
                        legal ecosystem.
                      </p>
                    </div>
                    <Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <Card className="bg-zinc-900/40 border-white/5 rounded-3xl p-8 backdrop-blur-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-zinc-400">
                            Total Contracts
                          </p>
                          <p className="text-4xl font-bold mt-2 text-white">
                            {reportingData.totalContracts || 0}
                          </p>
                        </div>
                        <FileText className="h-10 w-10 text-blue-400" />
                      </div>
                    </Card>
                    <Card className="bg-zinc-900/40 border-white/5 rounded-3xl p-8 backdrop-blur-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-zinc-400">Field Reports</p>
                          <p className="text-4xl font-bold mt-2 text-white">
                            {reportingData.totalFieldReports || 0}
                          </p>
                        </div>
                        <Users className="h-10 w-10 text-amber-400" />
                      </div>
                    </Card>
                    <Card className="bg-zinc-900/40 border-white/5 rounded-3xl p-8 backdrop-blur-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-zinc-400">Total Revenue</p>
                          <p className="text-4xl font-bold mt-2 text-emerald-400">
                            ₦
                            {(reportingData.totalRevenue || 0).toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-10 w-10 text-emerald-400" />
                      </div>
                    </Card>
                    <Card className="bg-zinc-900/40 border-white/5 rounded-3xl p-8 backdrop-blur-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-zinc-400">Outstanding</p>
                          <p className="text-4xl font-bold mt-2 text-red-400">
                            ₦
                            {(
                              reportingData.outstandingPayments || 0
                            ).toLocaleString()}
                          </p>
                        </div>
                        <AlertTriangle className="h-10 w-10 text-red-400" />
                      </div>
                    </Card>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Status Distribution (Pie) */}
                    <Card className="lg:col-span-5 bg-zinc-900/40 border-white/5 rounded-3xl p-10 backdrop-blur-md">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl font-bold">
                          Contracts by Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <ResponsiveContainer width="100%" height={320}>
                          <PieChart>
                            <Pie
                              data={reportingData.contractsByStatus || []}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={120}
                              paddingAngle={4}
                            >
                              {(reportingData.contractsByStatus || []).map(
                                (entry: any, i: number) => (
                                  <Cell
                                    key={i}
                                    fill={entry.color || "#3b82f6"}
                                  />
                                ),
                              )}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                background: "#0a0a0a",
                                border: "1px solid #ffffff10",
                                borderRadius: "16px",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Invoices per Week (Bar) */}
                    <Card className="lg:col-span-4 bg-zinc-900/40 border-white/5 rounded-3xl p-10 backdrop-blur-md">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl font-bold">
                          Invoices per Week
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={reportingData.weeklyInvoices || []}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#ffffff05"
                            />
                            <XAxis
                              dataKey="week"
                              stroke="#ffffff20"
                              fontSize={11}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="#ffffff20"
                              fontSize={11}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              formatter={(v: number) =>
                                `₦${v.toLocaleString()}`
                              }
                              contentStyle={{
                                background: "#0a0a0a",
                                border: "1px solid #ffffff10",
                                borderRadius: "16px",
                              }}
                            />
                            <Bar
                              dataKey="amount"
                              fill="#3b82f6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Monthly Revenue (Line) */}
                    <Card className="lg:col-span-3 bg-zinc-900/40 border-white/5 rounded-3xl p-10 backdrop-blur-md">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl font-bold">
                          Monthly Revenue
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0 pb-0">
                        <ResponsiveContainer width="100%" height={320}>
                          <LineChart data={reportingData.monthlyRevenue || []}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#ffffff05"
                            />
                            <XAxis
                              dataKey="month"
                              stroke="#ffffff20"
                              fontSize={11}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              stroke="#ffffff20"
                              fontSize={11}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              formatter={(v: number) =>
                                `₦${v.toLocaleString()}`
                              }
                              contentStyle={{
                                background: "#0a0a0a",
                                border: "1px solid #ffffff10",
                                borderRadius: "16px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#10b981"
                              strokeWidth={3}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Field Reports Analytics */}
                  <Card className="bg-zinc-900/40 border-white/5 rounded-3xl p-10 backdrop-blur-md">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-xl font-bold">
                        Field Reports Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                          <h4 className="font-medium mb-6 text-zinc-400">
                            Total Reports
                          </h4>
                          <p className="text-5xl font-bold text-purple-400">
                            {reportingData.totalFieldReports || 0}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-6 text-zinc-400">
                            By Region
                          </h4>
                          {(reportingData.fieldReportsByRegion || []).map(
                            (r: any) => (
                              <div
                                key={r.region}
                                className="flex justify-between py-3 border-b border-white/5 last:border-0"
                              >
                                <span className="text-zinc-300">
                                  {r.region}
                                </span>
                                <span className="font-semibold text-white">
                                  {r.count}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium mb-6 text-zinc-400">
                            Top Enumerators
                          </h4>
                          {(reportingData.fieldReportsByEnumerator || []).map(
                            (e: any) => (
                              <div
                                key={e.name}
                                className="flex justify-between py-3 border-b border-white/5 last:border-0 items-center"
                              >
                                <span className="text-zinc-300">{e.name}</span>
                                <Badge variant="secondary">
                                  {e.count} reports
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* USERS & ROLES TABS */}
              {activeTab === "users" && canViewUsers && <UserManagement />}
              {activeTab === "roles" && canManageUserRoles && (
                <RoleManagement />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-zinc-950 border-r border-white/5 z-[70] lg:hidden p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white flex items-center justify-center rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span className="text-black font-bold text-lg">C</span>
                  </div>
                  <span className="font-bold tracking-[0.2em] uppercase text-sm">
                    ContractHub
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-500 hover:text-white p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-3 flex-1">
                {navItems
                  .filter((item) => item.show !== false)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as any)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                        activeTab === item.id
                          ? "bg-white/5 text-white ring-1 ring-white/10"
                          : "text-zinc-500"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-base font-medium">
                        {item.label}
                      </span>
                    </button>
                  ))}
              </nav>

              <div className="pt-10 border-t border-white/5">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-base font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription className="text-zinc-400">
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
              <Label className="text-zinc-300">Folder Name</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            <div>
              <Label className="text-zinc-300">Type</Label>
              <Select value={newFolderType} onValueChange={setNewFolderType}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10">
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
    </div>
  );
}
