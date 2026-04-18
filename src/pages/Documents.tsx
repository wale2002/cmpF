// // // src/pages/DocumentsPage.tsx
// // import { useState, useEffect, useMemo } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { documentService, organizationService } from "../lib/api";
// // import { DocumentCard } from "../components/DocumentCard";
// // import { DocumentUpload } from "../components/DocumentUpload";
// // import { Layout } from "../components/Layout";
// // import { Input } from "../components/ui/input";
// // import { Button } from "../components/ui/button";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "../components/ui/select";
// // import {
// //   Tabs,
// //   TabsContent,
// //   TabsList,
// //   TabsTrigger,
// // } from "../components/ui/tabs";
// // import {
// //   Search,
// //   Plus,
// //   ChevronLeft,
// //   ChevronRight,
// //   Users,
// //   ExternalLink,
// //   FileText,
// // } from "lucide-react";
// // import type {
// //   Document,
// //   Organization,
// //   Permissions,
// //   ApiResponse,
// // } from "../types";
// // import { toast } from "sonner";
// // import { handleApiError } from "../utils/error-handler";

// // // Field Reports
// // import SchoolVisitReportsBrowser from "./SchoolVisitReportsBrowser";

// // // Invoices & Receipts Tab
// // import InvoiceReceiptsTab from "../components/InvoiceReceiptsTab";

// // const DocumentsPage = () => {
// //   const {
// //     user,
// //     isAuthenticated,
// //     isLoading: authLoading,
// //     logout,
// //   } = useAuthContext();

// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filterType, setFilterType] = useState("all");
// //   const [showUpload, setShowUpload] = useState(false);

// //   const [uploadLoading, setUploadLoading] = useState(false);
// //   const [uploadError, setUploadError] = useState("");
// //   const [uploadSuccess, setUploadSuccess] = useState("");

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const PAGE_SIZE = 9;

// //   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
// //   const permissions: Permissions = user?.role?.permissions || {};

// //   const canViewDocuments =
// //     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
// //   const canUploadDocuments =
// //     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;

// //   // Queries
// //   const {
// //     data: organizationsData,
// //     isLoading: orgsLoading,
// //     error: orgsError,
// //   } = useQuery<
// //     ApiResponse<{
// //       organizations: Organization[];
// //       total: number;
// //       page: number;
// //       totalPages: number;
// //     }>
// //   >({
// //     queryKey: ["organizations"],
// //     queryFn: () => organizationService.getOrganizations(),
// //     enabled:
// //       !!user &&
// //       (isSuperAdmin ||
// //         permissions.OrganizationManagement?.viewOrganizations ||
// //         false),
// //     staleTime: 5 * 60 * 1000,
// //   });

// //   useEffect(() => {
// //     if (orgsError) {
// //       console.error("DocumentsPage orgs error:", orgsError);
// //       toast.error("Failed to load organizations");
// //     }
// //   }, [orgsError]);

// //   const {
// //     data: documentsData,
// //     isLoading: docsLoading,
// //     refetch,
// //     error: docsError,
// //   } = useQuery<Document[]>({
// //     queryKey: ["documents", user?.organization?._id, user?.role?.name],
// //     queryFn: async () => {
// //       if (isSuperAdmin) {
// //         const orgsResponse = await organizationService.getOrganizations();
// //         const orgs = orgsResponse.data?.organizations || [];
// //         const allDocs = await Promise.all(
// //           orgs.map(async (org: Organization) => {
// //             try {
// //               const docsResponse = await documentService.getDocumentsByOrg(
// //                 org._id.toString(),
// //               );
// //               return docsResponse.data?.documents || [];
// //             } catch (err) {
// //               console.error(`DocumentsPage org ${org._id} docs error:`, err);
// //               return [];
// //             }
// //           }),
// //         );
// //         return allDocs.flat();
// //       } else if (user?.organization?._id && canViewDocuments) {
// //         const docsResponse = await documentService.getDocumentsByOrg(
// //           user.organization._id.toString(),
// //         );
// //         return docsResponse.data?.documents || [];
// //       }
// //       return [];
// //     },
// //     enabled: !!user && canViewDocuments,
// //     staleTime: 5 * 60 * 1000,
// //     gcTime: 10 * 60 * 1000,
// //   });

// //   useEffect(() => {
// //     if (docsError) {
// //       console.error("DocumentsPage docs error:", docsError);
// //       toast.error("Failed to load documents");
// //     }
// //   }, [docsError]);

// //   const documents = Array.isArray(documentsData) ? documentsData : [];

// //   const organizations = useMemo(() => {
// //     const flatOrgs = (organizationsData?.data?.organizations || []).map(
// //       (org: any) => ({
// //         _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
// //         name: org.name,
// //         organizationType: org.organizationType,
// //         documentCount: org.documentCount,
// //         createdAt: org.createdAt,
// //       }),
// //     );

// //     if (!isSuperAdmin) {
// //       return user?.organization?._id
// //         ? [
// //             {
// //               _id: user.organization._id,
// //               name: "Current Organization",
// //               organizationType: "tech",
// //               documentCount: 0,
// //               createdAt:
// //                 user.organization?.createdAt || new Date().toISOString(),
// //             },
// //           ]
// //         : [];
// //     }
// //     return flatOrgs as Organization[];
// //   }, [organizationsData, user?.organization?._id, isSuperAdmin]);

// //   // ====================== FIXED FILTERING ======================
// //   const filteredDocuments = documents.filter((doc) => {
// //     const matchesSearch = doc.name
// //       .toLowerCase()
// //       .includes(searchTerm.toLowerCase());
// //     const matchesType = filterType === "all" || doc.documentType === filterType;

// //     // Exclude Invoices & Receipts from main Documents tab
// //     const isInvoiceOrReceipt =
// //       doc.documentType === "Invoice" || doc.documentType === "Receipt";

// //     return matchesSearch && matchesType && !isInvoiceOrReceipt;
// //   });

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, filterType]);

// //   const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
// //   const startIndex = (currentPage - 1) * PAGE_SIZE;
// //   const endIndex = startIndex + PAGE_SIZE;
// //   const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= totalPages) setCurrentPage(page);
// //   };

// //   const handleDocumentUpload = async (
// //     file: File,
// //     name: string,
// //     type: string,
// //     organizationId: string,
// //     startDate?: string,
// //     expiryDate?: string,
// //   ) => {
// //     setUploadLoading(true);
// //     setUploadError("");
// //     setUploadSuccess("");
// //     try {
// //       await documentService.uploadDocument(
// //         organizationId.toString(),
// //         file,
// //         name,
// //         type,
// //         startDate,
// //         expiryDate,
// //       );
// //       refetch();
// //       setUploadSuccess("Document uploaded successfully!");
// //       toast.success("Document uploaded successfully!");
// //       setShowUpload(false);
// //     } catch (error) {
// //       const errorMessage = handleApiError(error);
// //       setUploadError(errorMessage);
// //       toast.error(errorMessage);
// //     } finally {
// //       setUploadLoading(false);
// //     }
// //   };

// //   const handleDocumentAction = async (action: string, doc: Document) => {
// //     try {
// //       switch (action) {
// //         case "view":
// //           window.open(doc.fileUrl, "_blank");
// //           toast.info(`Viewing ${doc.name}`);
// //           break;
// //         case "download":
// //           await documentService.downloadDocument(doc._id.toString(), doc.name);
// //           toast.success(`Downloading ${doc.name}`);
// //           break;
// //         case "delete":
// //           await documentService.deleteDocument(doc._id.toString());
// //           refetch();
// //           toast.success(`${doc.name} deleted`);
// //           break;
// //       }
// //     } catch (error) {
// //       handleApiError(error);
// //     }
// //   };

// //   if (authLoading || docsLoading || (isSuperAdmin && orgsLoading)) {
// //     return (
// //       <Layout user={user ?? undefined} onLogout={logout}>
// //         <div className="text-center py-12">
// //           Loading documents &amp; reports...
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (!isAuthenticated || !user) return null;

// //   if (!canViewDocuments) {
// //     return (
// //       <Layout user={user} onLogout={logout}>
// //         <div className="text-center py-12 text-muted-foreground">
// //           You do not have permission to view documents.
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout user={user} onLogout={logout}>
// //       <div className="max-w-7xl mx-auto p-6 space-y-8">
// //         <Tabs defaultValue="documents" className="w-full">
// //           <TabsList className="grid w-full grid-cols-3">
// //             <TabsTrigger value="documents" className="flex items-center gap-2">
// //               Documents
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="field-reports"
// //               className="flex items-center gap-2"
// //             >
// //               <Users className="h-4 w-4" />
// //               Field Reports
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="invoices-receipts"
// //               className="flex items-center gap-2"
// //             >
// //               <FileText className="h-4 w-4" />
// //               Invoices &amp; Receipts
// //             </TabsTrigger>
// //           </TabsList>

// //           {/* ====================== DOCUMENTS TAB ====================== */}
// //           <TabsContent value="documents" className="space-y-6">
// //             <div className="flex items-center justify-between">
// //               <h1 className="text-3xl font-bold text-foreground">Documents</h1>
// //               {canUploadDocuments && (
// //                 <Button
// //                   onClick={() => setShowUpload(!showUpload)}
// //                   variant="professional"
// //                 >
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Upload Document
// //                 </Button>
// //               )}
// //             </div>

// //             {showUpload && canUploadDocuments && (
// //               <DocumentUpload
// //                 onUpload={handleDocumentUpload}
// //                 organizations={organizations}
// //                 currentUserOrg={user.organization?._id ?? undefined}
// //                 loading={uploadLoading}
// //                 error={uploadError}
// //                 success={uploadSuccess}
// //               />
// //             )}

// //             <div className="flex gap-4 items-center">
// //               <div className="relative flex-1">
// //                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                 <Input
// //                   placeholder="Search documents..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="pl-10"
// //                 />
// //               </div>
// //               <Select value={filterType} onValueChange={setFilterType}>
// //                 <SelectTrigger className="w-48">
// //                   <SelectValue placeholder="Filter by type" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">All Types</SelectItem>
// //                   <SelectItem value="Contract">Contracts</SelectItem>
// //                   <SelectItem value="SLA">SLAs</SelectItem>
// //                   <SelectItem value="NDA">NDAs</SelectItem>
// //                   <SelectItem value="Other">Other</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>

// //             {filteredDocuments.length === 0 ? (
// //               <div className="text-center py-12">
// //                 {canUploadDocuments ? (
// //                   <p className="text-muted-foreground">
// //                     No documents found.{" "}
// //                     <Button variant="link" onClick={() => setShowUpload(true)}>
// //                       Upload one
// //                     </Button>
// //                   </p>
// //                 ) : (
// //                   <p className="text-muted-foreground">No documents found.</p>
// //                 )}
// //               </div>
// //             ) : (
// //               <>
// //                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// //                   {paginatedDocuments.map((doc) => (
// //                     <DocumentCard
// //                       key={doc._id}
// //                       document={doc}
// //                       canEditDocuments={false}
// //                       canDeleteDocuments={true}
// //                       onView={() => handleDocumentAction("view", doc)}
// //                       onDownload={() => handleDocumentAction("download", doc)}
// //                       onDelete={() => handleDocumentAction("delete", doc)}
// //                     />
// //                   ))}
// //                 </div>

// //                 {totalPages > 1 && (
// //                   <div className="flex items-center justify-between mt-4">
// //                     <Button
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => handlePageChange(currentPage - 1)}
// //                       disabled={currentPage === 1}
// //                     >
// //                       <ChevronLeft className="h-4 w-4 mr-2" />
// //                       Previous
// //                     </Button>
// //                     <span className="text-sm text-muted-foreground">
// //                       Page {currentPage} of {totalPages} (
// //                       {filteredDocuments.length} documents)
// //                     </span>
// //                     <Button
// //                       variant="outline"
// //                       size="sm"
// //                       onClick={() => handlePageChange(currentPage + 1)}
// //                       disabled={currentPage === totalPages}
// //                     >
// //                       Next
// //                       <ChevronRight className="h-4 w-4 ml-2" />
// //                     </Button>
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </TabsContent>

// //           {/* ====================== FIELD REPORTS TAB ====================== */}
// //           <TabsContent value="field-reports" className="space-y-6">
// //             <div className="flex items-center justify-between">
// //               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
// //                 <Users className="h-8 w-8" />
// //                 Field Reports
// //               </h1>

// //               <Button
// //                 variant="outline"
// //                 onClick={() =>
// //                   window.open(
// //                     "https://cmp-sage.vercel.app/public/enumerator-form",
// //                     "_blank",
// //                   )
// //                 }
// //               >
// //                 <ExternalLink className="mr-2 h-4 w-4" />
// //                 Submit New Report (Public)
// //               </Button>
// //             </div>

// //             <SchoolVisitReportsBrowser />
// //           </TabsContent>

// //           {/* ====================== INVOICES & RECEIPTS TAB ====================== */}
// //           <TabsContent value="invoices-receipts" className="space-y-6">
// //             <div className="flex items-center justify-between">
// //               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
// //                 <FileText className="h-8 w-8" />
// //                 Invoices &amp; Receipts
// //               </h1>

// //               {/* Public Quick Invoice Link */}
// //               <Button
// //                 variant="outline"
// //                 onClick={() =>
// //                   window.open(
// //                     "http://localhost:5173/public/quick-invoice",
// //                     "_blank",
// //                   )
// //                 }
// //               >
// //                 <ExternalLink className="mr-2 h-4 w-4" />
// //                 Create Invoice via Public Link
// //               </Button>
// //             </div>

// //             <InvoiceReceiptsTab documents={documents} refetch={refetch} />
// //           </TabsContent>
// //         </Tabs>
// //       </div>
// //     </Layout>
// //   );
// // };

// // export default DocumentsPage;

// // src/pages/DocumentsPage.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";
// import { DocumentCard } from "../components/DocumentCard";
// import { DocumentUpload } from "../components/DocumentUpload";
// import { Layout } from "../components/Layout";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
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
// import {
//   Search,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Users,
//   ExternalLink,
//   FileText,
// } from "lucide-react";
// import type {
//   Document,
//   Organization,
//   Permissions,
//   ApiResponse,
// } from "../types";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// // Dedicated Explorers
// import SchoolVisitReportsBrowser from "./SchoolVisitReportsBrowser";
// import InvoiceExplorer from "./InvoiceExplorer";

// const DocumentsPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [showUpload, setShowUpload] = useState(false);

//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const PAGE_SIZE = 9;

//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions: Permissions = user?.role?.permissions || {};

//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canUploadDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;

//   // Queries
//   const {
//     data: organizationsData,
//     isLoading: orgsLoading,
//     error: orgsError,
//   } = useQuery<ApiResponse<{ organizations: Organization[] }>>({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled:
//       !!user &&
//       (isSuperAdmin || !!permissions.OrganizationManagement?.viewOrganizations),
//     staleTime: 5 * 60 * 1000,
//   });

//   const {
//     data: documentsData,
//     isLoading: docsLoading,
//     refetch,
//     error: docsError,
//   } = useQuery<Document[]>({
//     queryKey: ["documents", user?.organization?._id, user?.role?.name],
//     queryFn: async () => {
//       if (isSuperAdmin) {
//         const orgsResponse = await organizationService.getOrganizations();
//         const orgs = orgsResponse.data?.organizations || [];
//         const allDocs = await Promise.all(
//           orgs.map(async (org: Organization) => {
//             try {
//               const docsResponse = await documentService.getDocumentsByOrg(
//                 org._id.toString(),
//               );
//               return docsResponse.data?.documents || [];
//             } catch {
//               return [];
//             }
//           }),
//         );
//         return allDocs.flat();
//       } else if (user?.organization?._id && canViewDocuments) {
//         const docsResponse = await documentService.getDocumentsByOrg(
//           user.organization._id.toString(),
//         );
//         return docsResponse.data?.documents || [];
//       }
//       return [];
//     },
//     enabled: !!user && canViewDocuments,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     if (orgsError) toast.error("Failed to load organizations");
//     if (docsError) toast.error("Failed to load documents");
//   }, [orgsError, docsError]);

//   const documents = Array.isArray(documentsData) ? documentsData : [];

//   const organizations = useMemo(() => {
//     const flatOrgs = (organizationsData?.data?.organizations || []).map(
//       (org: any) => ({
//         _id: org._id,
//         name: org.name,
//         organizationType: org.organizationType,
//         documentCount: org.documentCount,
//         createdAt: org.createdAt,
//       }),
//     );

//     if (!isSuperAdmin && user?.organization?._id) {
//       return [
//         {
//           _id: user.organization._id,
//           name: "Current Organization",
//           organizationType: "tech",
//           documentCount: 0,
//           createdAt: user.organization?.createdAt || new Date().toISOString(),
//         },
//       ];
//     }
//     return flatOrgs as Organization[];
//   }, [organizationsData, user?.organization?._id, isSuperAdmin]);

//   // Filter out Invoices & Receipts from main Documents tab
//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch = doc.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" || doc.documentType === filterType;
//     const isInvoiceOrReceipt =
//       doc.documentType === "Invoice" || doc.documentType === "Receipt";
//     return matchesSearch && matchesType && !isInvoiceOrReceipt;
//   });

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handleDocumentUpload = async (
//     file: File,
//     name: string,
//     type: string,
//     organizationId: string,
//     startDate?: string,
//     expiryDate?: string,
//   ) => {
//     setUploadLoading(true);
//     setUploadError("");
//     setUploadSuccess("");
//     try {
//       await documentService.uploadDocument(
//         organizationId.toString(),
//         file,
//         name,
//         type,
//         startDate,
//         expiryDate,
//       );
//       refetch();
//       setUploadSuccess("Document uploaded successfully!");
//       toast.success("Document uploaded successfully!");
//       setShowUpload(false);
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
//           await documentService.downloadDocument(doc._id.toString(), doc.name);
//           toast.success(`Downloading ${doc.name}`);
//           break;
//         case "delete":
//           await documentService.deleteDocument(doc._id.toString());
//           refetch();
//           toast.success(`${doc.name} deleted`);
//           break;
//       }
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (authLoading || docsLoading || (isSuperAdmin && orgsLoading)) {
//     return (
//       <Layout user={user ?? undefined} onLogout={logout}>
//         <div className="text-center py-12">
//           Loading documents &amp; reports...
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) return null;

//   if (!canViewDocuments) {
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12 text-muted-foreground">
//           You do not have permission to view documents.
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="max-w-7xl mx-auto p-6 space-y-8">
//         <Tabs defaultValue="documents" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="documents" className="flex items-center gap-2">
//               Documents
//             </TabsTrigger>
//             <TabsTrigger
//               value="field-reports"
//               className="flex items-center gap-2"
//             >
//               <Users className="h-4 w-4" />
//               Field Reports
//             </TabsTrigger>
//             <TabsTrigger
//               value="invoices-receipts"
//               className="flex items-center gap-2"
//             >
//               <FileText className="h-4 w-4" />
//               Invoices &amp; Receipts
//             </TabsTrigger>
//           </TabsList>

//           {/* ====================== DOCUMENTS TAB ====================== */}
//           <TabsContent value="documents" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground">Documents</h1>
//               {canUploadDocuments && (
//                 <Button
//                   onClick={() => setShowUpload(!showUpload)}
//                   variant="professional"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Upload Document
//                 </Button>
//               )}
//             </div>

//             {showUpload && canUploadDocuments && (
//               <DocumentUpload
//                 onUpload={handleDocumentUpload}
//                 organizations={organizations}
//                 currentUserOrg={user.organization?._id ?? undefined}
//                 loading={uploadLoading}
//                 error={uploadError}
//                 success={uploadSuccess}
//               />
//             )}

//             <div className="flex gap-4 items-center">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search documents..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Select value={filterType} onValueChange={setFilterType}>
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Filter by type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="Contract">Contracts</SelectItem>
//                   <SelectItem value="SLA">SLAs</SelectItem>
//                   <SelectItem value="NDA">NDAs</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {filteredDocuments.length === 0 ? (
//               <div className="text-center py-12">
//                 {canUploadDocuments ? (
//                   <p className="text-muted-foreground">
//                     No documents found.{" "}
//                     <Button variant="link" onClick={() => setShowUpload(true)}>
//                       Upload one
//                     </Button>
//                   </p>
//                 ) : (
//                   <p className="text-muted-foreground">No documents found.</p>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {paginatedDocuments.map((doc) => (
//                     <DocumentCard
//                       key={doc._id}
//                       document={doc}
//                       canEditDocuments={false}
//                       canDeleteDocuments={true}
//                       onView={() => handleDocumentAction("view", doc)}
//                       onDownload={() => handleDocumentAction("download", doc)}
//                       onDelete={() => handleDocumentAction("delete", doc)}
//                     />
//                   ))}
//                 </div>

//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4 mr-2" />
//                       Previous
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Page {currentPage} of {totalPages} (
//                       {filteredDocuments.length} documents)
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                       <ChevronRight className="h-4 w-4 ml-2" />
//                     </Button>
//                   </div>
//                 )}
//               </>
//             )}
//           </TabsContent>

//           {/* ====================== FIELD REPORTS TAB ====================== */}
//           <TabsContent value="field-reports" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//                 <Users className="h-8 w-8" />
//                 Field Reports
//               </h1>
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   window.open(
//                     "https://cmp-sage.vercel.app/public/enumerator-form",
//                     "_blank",
//                   )
//                 }
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Submit New Report (Public)
//               </Button>
//             </div>
//             <SchoolVisitReportsBrowser />
//           </TabsContent>

//           {/* ====================== INVOICES & RECEIPTS TAB ====================== */}
//           <TabsContent value="invoices-receipts" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//                 <FileText className="h-8 w-8" />
//                 Invoices &amp; Receipts
//               </h1>
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   window.open(
//                     "http://localhost:5173/public/quick-invoice",
//                     "_blank",
//                   )
//                 }
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Create Invoice via Public Link
//               </Button>
//             </div>
//             <InvoiceExplorer />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Layout>
//   );
// };

// export default DocumentsPage;

// // src/pages/DocumentsPage.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";
// import { DocumentCard } from "../components/DocumentCard";
// import { DocumentUpload } from "../components/DocumentUpload";
// import { Layout } from "../components/Layout";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
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
// import {
//   Search,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Users,
//   ExternalLink,
//   FileText,
// } from "lucide-react";
// import type {
//   Document,
//   Organization,
//   Permissions,
//   ApiResponse,
// } from "../types";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// // Dedicated Explorers
// import SchoolVisitReportsBrowser from "./SchoolVisitReportsBrowser";
// import InvoiceExplorer from "./InvoiceExplorer";

// const DocumentsPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [showUpload, setShowUpload] = useState(false);

//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const PAGE_SIZE = 9;

//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions: Permissions = user?.role?.permissions || {};

//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canUploadDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;

//   // Queries
//   const {
//     data: organizationsData,
//     isLoading: orgsLoading,
//     error: orgsError,
//   } = useQuery<ApiResponse<{ organizations: Organization[] }>>({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled:
//       !!user &&
//       (isSuperAdmin || !!permissions.OrganizationManagement?.viewOrganizations),
//     staleTime: 5 * 60 * 1000,
//   });

//   const {
//     data: documentsData,
//     isLoading: docsLoading,
//     refetch,
//     error: docsError,
//   } = useQuery<Document[]>({
//     queryKey: ["documents", user?.organization?._id, user?.role?.name],
//     queryFn: async () => {
//       if (isSuperAdmin) {
//         const orgsResponse = await organizationService.getOrganizations();
//         const orgs = orgsResponse.data?.organizations || [];
//         const allDocs = await Promise.all(
//           orgs.map(async (org: Organization) => {
//             try {
//               const docsResponse = await documentService.getDocumentsByOrg(
//                 org._id.toString(),
//               );
//               return docsResponse.data?.documents || [];
//             } catch {
//               return [];
//             }
//           }),
//         );
//         return allDocs.flat();
//       } else if (user?.organization?._id && canViewDocuments) {
//         const docsResponse = await documentService.getDocumentsByOrg(
//           user.organization._id.toString(),
//         );
//         return docsResponse.data?.documents || [];
//       }
//       return [];
//     },
//     enabled: !!user && canViewDocuments,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     if (orgsError) toast.error("Failed to load organizations");
//     if (docsError) toast.error("Failed to load documents");
//   }, [orgsError, docsError]);

//   const documents = Array.isArray(documentsData) ? documentsData : [];

//   const organizations = useMemo(() => {
//     const flatOrgs = (organizationsData?.data?.organizations || []).map(
//       (org: any) => ({
//         _id: org._id,
//         name: org.name,
//         organizationType: org.organizationType,
//         documentCount: org.documentCount,
//         createdAt: org.createdAt,
//       }),
//     );

//     if (!isSuperAdmin && user?.organization?._id) {
//       return [
//         {
//           _id: user.organization._id,
//           name: "Current Organization",
//           organizationType: "tech",
//           documentCount: 0,
//           createdAt: user.organization?.createdAt || new Date().toISOString(),
//         },
//       ];
//     }
//     return flatOrgs as Organization[];
//   }, [organizationsData, user?.organization?._id, isSuperAdmin]);

//   // Filter out Invoices & Receipts from main Documents tab
//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch = doc.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" || doc.documentType === filterType;
//     const isInvoiceOrReceipt =
//       doc.documentType === "Invoice" || doc.documentType === "Receipt";
//     return matchesSearch && matchesType && !isInvoiceOrReceipt;
//   });

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   const handleDocumentUpload = async (
//     file: File,
//     name: string,
//     type: string,
//     organizationId: string,
//     startDate?: string,
//     expiryDate?: string,
//   ) => {
//     setUploadLoading(true);
//     setUploadError("");
//     setUploadSuccess("");
//     try {
//       await documentService.uploadDocument(
//         organizationId.toString(),
//         file,
//         name,
//         type,
//         startDate,
//         expiryDate,
//       );
//       refetch();
//       setUploadSuccess("Document uploaded successfully!");
//       toast.success("Document uploaded successfully!");
//       setShowUpload(false);
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
//           await documentService.downloadDocument(doc._id.toString(), doc.name);
//           toast.success(`Downloading ${doc.name}`);
//           break;
//         case "delete":
//           await documentService.deleteDocument(doc._id.toString());
//           refetch();
//           toast.success(`${doc.name} deleted`);
//           break;
//       }
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (authLoading || docsLoading || (isSuperAdmin && orgsLoading)) {
//     return (
//       <Layout user={user ?? undefined} onLogout={logout}>
//         <div className="text-center py-12">
//           Loading documents &amp; reports...
//         </div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) return null;

//   if (!canViewDocuments) {
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12 text-muted-foreground">
//           You do not have permission to view documents.
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="max-w-7xl mx-auto p-6 space-y-8">
//         <Tabs defaultValue="documents" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="documents" className="flex items-center gap-2">
//               Documents
//             </TabsTrigger>
//             <TabsTrigger
//               value="field-reports"
//               className="flex items-center gap-2"
//             >
//               <Users className="h-4 w-4" />
//               Field Reports
//             </TabsTrigger>
//             <TabsTrigger
//               value="invoices-receipts"
//               className="flex items-center gap-2"
//             >
//               <FileText className="h-4 w-4" />
//               Invoices &amp; Receipts
//             </TabsTrigger>
//           </TabsList>

//           {/* ====================== DOCUMENTS TAB ====================== */}
//           <TabsContent value="documents" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground">Documents</h1>
//               {canUploadDocuments && (
//                 <Button
//                   onClick={() => setShowUpload(!showUpload)}
//                   variant="professional"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Upload Document
//                 </Button>
//               )}
//             </div>

//             {showUpload && canUploadDocuments && (
//               <DocumentUpload
//                 onUpload={handleDocumentUpload}
//                 organizations={organizations}
//                 currentUserOrg={user.organization?._id ?? undefined}
//                 loading={uploadLoading}
//                 error={uploadError}
//                 success={uploadSuccess}
//               />
//             )}

//             <div className="flex gap-4 items-center">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search documents..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Select value={filterType} onValueChange={setFilterType}>
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Filter by type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="Contract">Contracts</SelectItem>
//                   <SelectItem value="SLA">SLAs</SelectItem>
//                   <SelectItem value="NDA">NDAs</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {filteredDocuments.length === 0 ? (
//               <div className="text-center py-12">
//                 {canUploadDocuments ? (
//                   <p className="text-muted-foreground">
//                     No documents found.{" "}
//                     <Button variant="link" onClick={() => setShowUpload(true)}>
//                       Upload one
//                     </Button>
//                   </p>
//                 ) : (
//                   <p className="text-muted-foreground">No documents found.</p>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                   {paginatedDocuments.map((doc) => (
//                     <DocumentCard
//                       key={doc._id}
//                       document={doc}
//                       canEditDocuments={false}
//                       canDeleteDocuments={true}
//                       onView={() => handleDocumentAction("view", doc)}
//                       onDownload={() => handleDocumentAction("download", doc)}
//                       onDelete={() => handleDocumentAction("delete", doc)}
//                     />
//                   ))}
//                 </div>

//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-4">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     >
//                       <ChevronLeft className="h-4 w-4 mr-2" />
//                       Previous
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Page {currentPage} of {totalPages} (
//                       {filteredDocuments.length} documents)
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     >
//                       Next
//                       <ChevronRight className="h-4 w-4 ml-2" />
//                     </Button>
//                   </div>
//                 )}
//               </>
//             )}
//           </TabsContent>

//           {/* ====================== FIELD REPORTS TAB ====================== */}
//           <TabsContent value="field-reports" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//                 <Users className="h-8 w-8" />
//                 Field Reports
//               </h1>
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   window.open(
//                     "https://cmp-sage.vercel.app/public/enumerator-form",
//                     "_blank",
//                   )
//                 }
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Submit New Report (Public)
//               </Button>
//             </div>
//             <SchoolVisitReportsBrowser />
//           </TabsContent>

//           {/* ====================== INVOICES & RECEIPTS TAB ====================== */}
//           <TabsContent value="invoices-receipts" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
//                 <FileText className="h-8 w-8" />
//                 Invoices &amp; Receipts
//               </h1>
//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   window.open(
//                     "https://cmp-sage.vercel.app/public/quick-invoice",
//                     "_blank",
//                   )
//                 }
//               >
//                 <ExternalLink className="mr-2 h-4 w-4" />
//                 Create Invoice via Public Link
//               </Button>
//             </div>

//             {/* FIXED: Now passing documents + refetch so invoices appear */}
//             <InvoiceExplorer documents={documents} refetch={refetch} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </Layout>
//   );
// };

// export default DocumentsPage;

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";
import { DocumentCard } from "../components/DocumentCard";
import { DocumentUpload } from "../components/DocumentUpload";
import { Layout } from "../components/Layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
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
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  Filter,
  Loader2,
  LayoutGrid,
  FileSearch,
} from "lucide-react";
import type {
  Document,
  Organization,
  Permissions,
  ApiResponse,
} from "../types";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import { motion, AnimatePresence } from "framer-motion";

// Dedicated Explorers
import SchoolVisitReportsBrowser from "./SchoolVisitReportsBrowser";
import InvoiceExplorer from "./InvoiceExplorer";

const DocumentsPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUpload, setShowUpload] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions: Permissions = user?.role?.permissions || {};

  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;

  // Queries
  const {
    data: organizationsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useQuery<ApiResponse<{ organizations: Organization[] }>>({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled:
      !!user &&
      (isSuperAdmin || !!permissions.OrganizationManagement?.viewOrganizations),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: documentsData,
    isLoading: docsLoading,
    refetch,
    error: docsError,
  } = useQuery<Document[]>({
    queryKey: ["documents", user?.organization?._id, user?.role?.name],
    queryFn: async () => {
      if (isSuperAdmin) {
        const orgsResponse = await organizationService.getOrganizations();
        const orgs = orgsResponse.data?.organizations || [];
        const allDocs = await Promise.all(
          orgs.map(async (org: Organization) => {
            try {
              const docsResponse = await documentService.getDocumentsByOrg(
                org._id.toString(),
              );
              return docsResponse.data?.documents || [];
            } catch {
              return [];
            }
          }),
        );
        return allDocs.flat();
      } else if (user?.organization?._id && canViewDocuments) {
        const docsResponse = await documentService.getDocumentsByOrg(
          user.organization._id.toString(),
        );
        return docsResponse.data?.documents || [];
      }
      return [];
    },
    enabled: !!user && canViewDocuments,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (orgsError) toast.error("Failed to load organizations");
    if (docsError) toast.error("Failed to load documents");
  }, [orgsError, docsError]);

  const documents = Array.isArray(documentsData) ? documentsData : [];

  const organizations = useMemo(() => {
    const flatOrgs = (organizationsData?.data?.organizations || []).map(
      (org: any) => ({
        _id: org._id,
        name: org.name,
        organizationType: org.organizationType,
        documentCount: org.documentCount,
        createdAt: org.createdAt,
      }),
    );

    if (!isSuperAdmin && user?.organization?._id) {
      return [
        {
          _id: user.organization._id,
          name: "Current Organization",
          organizationType: "tech",
          documentCount: 0,
          createdAt: user.organization?.createdAt || new Date().toISOString(),
        },
      ];
    }
    return flatOrgs as Organization[];
  }, [organizationsData, user?.organization?._id, isSuperAdmin]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    const isInvoiceOrReceipt =
      doc.documentType === "Invoice" || doc.documentType === "Receipt";
    return matchesSearch && matchesType && !isInvoiceOrReceipt;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDocumentUpload = async (
    file: File,
    name: string,
    type: string,
    organizationId: string,
    startDate?: string,
    expiryDate?: string,
  ) => {
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      await documentService.uploadDocument(
        organizationId.toString(),
        file,
        name,
        type,
        startDate,
        expiryDate,
      );
      refetch();
      setUploadSuccess("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
      setShowUpload(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  if (authLoading || docsLoading || (isSuperAdmin && orgsLoading)) {
    return (
      <Layout user={user ?? undefined} onLogout={logout}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-white/20 animate-spin" />
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Synchronizing Repository
          </p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!canViewDocuments) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-[2rem] bg-zinc-900/40 flex items-center justify-center mb-8 border border-white/5">
            <FileSearch className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Access Restricted
          </h2>
          <p className="text-zinc-500 max-w-md leading-relaxed">
            You do not have the necessary clearance to access the document
            repository.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-7xl mx-auto space-y-12 pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
                Central Repository
              </span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-white">
              Agreements & Reports
            </h1>
            <p className="text-zinc-500 text-lg font-light max-w-xl">
              Orchestrate your organization's legal and operational intelligence
              through a unified command center.
            </p>
          </div>

          {canUploadDocuments && (
            <Button
              onClick={() => setShowUpload(!showUpload)}
              className={`h-14 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 ${
                showUpload
                  ? "bg-zinc-900 text-white border border-white/10 hover:bg-zinc-800"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {showUpload ? (
                <>Close Upload</>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Upload Document
                </>
              )}
            </Button>
          )}
        </div>

        <Tabs defaultValue="documents" className="w-full space-y-10">
          <TabsList className="flex items-center justify-start gap-4 bg-transparent h-auto p-0 border-b border-white/5 w-full rounded-none pb-4 overflow-x-auto scrollbar-hide">
            <TabsTrigger
              value="documents"
              className="px-6 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-white text-zinc-500 transition-all border border-transparent data-[state=active]:border-white/10"
            >
              <LayoutGrid className="h-4 w-4 mr-2" /> Documents
            </TabsTrigger>
            <TabsTrigger
              value="field-reports"
              className="px-6 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-white text-zinc-500 transition-all border border-transparent data-[state=active]:border-white/10"
            >
              <Users className="h-4 w-4 mr-2" /> Field Reports
            </TabsTrigger>
            <TabsTrigger
              value="invoices-receipts"
              className="px-6 py-3 rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-white text-zinc-500 transition-all border border-transparent data-[state=active]:border-white/10"
            >
              <FileText className="h-4 w-4 mr-2" /> Invoices & Receipts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-10 outline-none">
            <AnimatePresence>
              {showUpload && canUploadDocuments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md mb-12">
                    <DocumentUpload
                      onUpload={handleDocumentUpload}
                      organizations={organizations}
                      currentUserOrg={user.organization?._id ?? undefined}
                      loading={uploadLoading}
                      error={uploadError}
                      success={uploadSuccess}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <Input
                  placeholder="Search repository..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 focus:border-white/20 focus:bg-white/10 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-14 w-full md:w-56 bg-white/5 border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-zinc-500" />
                      <SelectValue placeholder="Filter Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10">
                    <SelectItem value="all">All Classifications</SelectItem>
                    <SelectItem value="Contract">Contracts</SelectItem>
                    <SelectItem value="SLA">SLAs</SelectItem>
                    <SelectItem value="NDA">NDAs</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {paginatedDocuments.length > 0 ? (
                  paginatedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      onUpdate={refetch}
                      onView={() => handleDocumentAction("view", doc)}
                      onDownload={() => handleDocumentAction("download", doc)}
                      onDelete={() => handleDocumentAction("delete", doc)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center bg-white/2 border border-white/5 rounded-[3rem]">
                    <FileSearch className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">
                      No documents found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                  Showing {startIndex + 1} —{" "}
                  {Math.min(endIndex, filteredDocuments.length)} of{" "}
                  {filteredDocuments.length} files
                </p>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-12 w-12 rounded-2xl border-white/5 bg-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-mono transition-all ${
                          currentPage === i + 1
                            ? "bg-white text-black font-bold shadow-lg"
                            : "text-zinc-500 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-12 w-12 rounded-2xl border-white/5 bg-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="field-reports" className="outline-none">
            <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-1 lg:p-2 backdrop-blur-sm">
              <SchoolVisitReportsBrowser />
            </div>
          </TabsContent>

          <TabsContent value="invoices-receipts" className="outline-none">
            <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-1 lg:p-2 backdrop-blur-sm">
              <InvoiceExplorer />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default DocumentsPage;
