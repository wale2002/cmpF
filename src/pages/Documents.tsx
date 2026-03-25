/* eslint-disable @typescript-eslint/no-explicit-any */
// // src/pages/Documents.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";
// import { EnumeratorUploadForm } from "../components/EnumeratorUploadForm";
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
// import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
// import type {
//   Document,
//   Organization,
//   Permissions,
//   ApiResponse,
// } from "../types";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

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
//   const canEditDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.editDocuments || false;
//   const canDeleteDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.deleteDocuments || false;
//   const canViewOrganizations =
//     isSuperAdmin ||
//     permissions.OrganizationManagement?.viewOrganizations ||
//     false;

//   // Fixed: Paginated type; no onError; use error from hook
//   const {
//     data: organizationsData,
//     isLoading: orgsLoading,
//     error: orgsError,
//   } = useQuery<
//     ApiResponse<{
//       organizations: Organization[];
//       total: number;
//       page: number;
//       totalPages: number;
//     }>
//   >({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled: !!user && canViewOrganizations,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fixed: Handle errors via useEffect
//   useEffect(() => {
//     if (orgsError) {
//       console.error("DocumentsPage orgs error:", orgsError);
//       toast.error("Failed to load organizations");
//     }
//   }, [orgsError]);

//   // Fixed: No onError; use error from hook; return Document[]
//   const {
//     data: documentsData,
//     isLoading: docsLoading,
//     refetch,
//     error: docsError,
//   } = useQuery<Document[]>({
//     queryKey: ["documents", user?.organization?._id, user?.role?.name],
//     queryFn: async () => {
//       console.log("DocumentsPage docs fetch:", {
//         role: user?.role?.name,
//         org: user?.organization?._id,
//       });
//       if (canViewOrganizations && isSuperAdmin) {
//         const orgsResponse = await organizationService.getOrganizations();
//         // Fixed: Access from paginated response
//         const orgs = orgsResponse.data?.organizations || [];
//         console.log("DocumentsPage admin orgs:", orgs.length);
//         const allDocs = await Promise.all(
//           orgs.map(async (org: Organization) => {
//             try {
//               const docsResponse = await documentService.getDocumentsByOrg(
//                 org._id.toString(),
//               );
//               return docsResponse.data?.documents || [];
//             } catch (err) {
//               console.error(`DocumentsPage org ${org._id} docs error:`, err);
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
//       console.warn("DocumentsPage no org or no view permission");
//       return [];
//     },
//     enabled: !!user && canViewDocuments,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });

//   // Fixed: Handle errors via useEffect
//   useEffect(() => {
//     if (docsError) {
//       console.error("DocumentsPage docs error:", docsError);
//       toast.error("Failed to load documents");
//     }
//   }, [docsError]);

//   const documents = Array.isArray(documentsData) ? documentsData : [];

//   // Fixed: Extract from paginated data safely
//   // Fixed: Extract from paginated data safely
//   const organizations = useMemo(() => {
//     // Flatten nested _id if populated recursively
//     const flatOrgs = (organizationsData?.data?.organizations || []).map(
//       (org: any) => ({
//         _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
//         name: org.name,
//         organizationType: org.organizationType,
//         documentCount: org.documentCount,
//         createdAt: org.createdAt, // ADD: Include from source data
//       }),
//     );
//     if (!canViewOrganizations) {
//       return user?.organization?._id
//         ? [
//             {
//               _id: user.organization._id,
//               name: "Current Organization",
//               organizationType: "tech",
//               documentCount: 0, // ADD: For consistency
//               createdAt:
//                 user.organization?.createdAt || new Date().toISOString(), // ADD: Default timestamp
//             },
//           ]
//         : [];
//     }
//     return flatOrgs as Organization[]; // ADD: Explicit type for safety
//   }, [
//     organizationsData,
//     user?.organization?._id,
//     canViewOrganizations,
//   ]) as Organization[]; // ADD: Explicit return type

//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch = doc.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" || doc.documentType === filterType;
//     return matchesSearch && matchesType;
//   });

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterType]);

//   const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleUpload = async (
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
//         case "edit":
//           toast.info(`Editing ${doc.name}`);
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

//   if (authLoading || docsLoading || (canViewOrganizations && orgsLoading)) {
//     return (
//       <Layout user={user ?? undefined} onLogout={logout}>
//         <div className="text-center py-12">Loading documents...</div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     return null;
//   }

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
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold text-foreground">Documents</h1>
//           {canUploadDocuments && (
//             <Button
//               onClick={() => setShowUpload(!showUpload)}
//               variant="professional"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Upload Document
//             </Button>
//           )}
//         </div>
//         {showUpload && canUploadDocuments && (
//           <DocumentUpload
//             onUpload={handleUpload}
//             organizations={organizations}
//             currentUserOrg={user.organization?._id ?? undefined}
//             loading={uploadLoading}
//             error={uploadError}
//             success={uploadSuccess}
//           />
//         )}
//         <div className="flex gap-4 items-center">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search documents..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Select value={filterType} onValueChange={setFilterType}>
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="Filter by type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Types</SelectItem>
//               <SelectItem value="Contract">Contracts</SelectItem>
//               <SelectItem value="SLA">SLAs</SelectItem>
//               <SelectItem value="NDA">NDAs</SelectItem>
//               <SelectItem value="Other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         {filteredDocuments.length === 0 ? (
//           <div className="text-center py-12">
//             {canUploadDocuments ? (
//               <p className="text-muted-foreground">
//                 No documents found.{" "}
//                 <Button variant="link" onClick={() => setShowUpload(true)}>
//                   Upload one
//                 </Button>
//               </p>
//             ) : (
//               <p className="text-muted-foreground">No documents found.</p>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {paginatedDocuments.map((doc) => (
//                 // <DocumentCard
//                 //   key={doc._id}
//                 //   document={doc}
//                 //   canEditDocuments={
//                 //     canEditDocuments || doc.uploadedBy === user._id
//                 //   }
//                 //   canDeleteDocuments={
//                 //     canDeleteDocuments || doc.uploadedBy === user._id
//                 //   }
//                 //   onView={() => handleDocumentAction("view", doc)}
//                 //   onDownload={() => handleDocumentAction("download", doc)}
//                 //   onEdit={() => handleDocumentAction("edit", doc)}
//                 //   onDelete={() => handleDocumentAction("delete", doc)}
//                 // />
//                 <DocumentCard
//                   key={doc._id}
//                   document={doc}
//                   canEditDocuments={canEditDocuments}
//                   canDeleteDocuments={canDeleteDocuments}
//                   onView={() => handleDocumentAction("view", doc)}
//                   onDownload={() => handleDocumentAction("download", doc)}
//                   onDelete={() => handleDocumentAction("delete", doc)}
//                 />
//               ))}
//             </div>
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between mt-4">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   Previous
//                 </Button>
//                 <span className="text-sm text-muted-foreground">
//                   Page {currentPage} of {totalPages} ({filteredDocuments.length}{" "}
//                   documents)
//                 </span>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default DocumentsPage;

// src/pages/DocumentsPage.tsx
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";
import { EnumeratorUploadForm } from "../components/EnumeratorUploadForm";
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
import { Search, Plus, ChevronLeft, ChevronRight, Users } from "lucide-react";
import type {
  Document,
  Organization,
  Permissions,
  ApiResponse,
} from "../types";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

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

  // Document upload states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Field report states (separate so both forms can work independently)
  const [fieldReportLoading, setFieldReportLoading] = useState(false);
  const [fieldReportError, setFieldReportError] = useState("");
  const [fieldReportSuccess, setFieldReportSuccess] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 9;

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions: Permissions = user?.role?.permissions || {};

  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;

  // Queries (unchanged from your code)
  const {
    data: organizationsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useQuery<
    ApiResponse<{
      organizations: Organization[];
      total: number;
      page: number;
      totalPages: number;
    }>
  >({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled:
      !!user &&
      (isSuperAdmin ||
        permissions.OrganizationManagement?.viewOrganizations ||
        false),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (orgsError) {
      console.error("DocumentsPage orgs error:", orgsError);
      toast.error("Failed to load organizations");
    }
  }, [orgsError]);

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
            } catch (err) {
              console.error(`DocumentsPage org ${org._id} docs error:`, err);
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
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (docsError) {
      console.error("DocumentsPage docs error:", docsError);
      toast.error("Failed to load documents");
    }
  }, [docsError]);

  const documents = Array.isArray(documentsData) ? documentsData : [];

  const organizations = useMemo(() => {
    const flatOrgs = (organizationsData?.data?.organizations || []).map(
      (org: any) => ({
        _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
        name: org.name,
        organizationType: org.organizationType,
        documentCount: org.documentCount,
        createdAt: org.createdAt,
      }),
    );
    if (!isSuperAdmin) {
      return user?.organization?._id
        ? [
            {
              _id: user.organization._id,
              name: "Current Organization",
              organizationType: "tech",
              documentCount: 0,
              createdAt:
                user.organization?.createdAt || new Date().toISOString(),
            },
          ]
        : [];
    }
    return flatOrgs as Organization[];
  }, [organizationsData, user?.organization?._id, isSuperAdmin]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesType;
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

  // ====================== DOCUMENT UPLOAD ======================
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

  // ====================== ENUMERATOR / REGIONAL OFFICER REPORT ======================
  const handleEnumeratorSubmit = async (
    picture: File | null,
    fullName: string,
    role: "Regional Officer" | "Enumerator",
    phoneNumber: string,
    schoolName: string,
    localGovernment: string,
    topicBeingTaught: string,
    latitude?: string,
    longitude?: string,
    dateOfVisit?: string,
  ) => {
    setFieldReportLoading(true);
    setFieldReportError("");
    setFieldReportSuccess("");
    try {
      // TODO: Replace with your real service when ready
      // await enumeratorService.submitReport({ picture, fullName, role, ... });

      console.log("Field report submitted:", {
        fullName,
        role,
        phoneNumber,
        schoolName,
        localGovernment,
        topicBeingTaught,
        latitude,
        longitude,
        dateOfVisit,
      });

      setFieldReportSuccess("Field report submitted successfully! ✅");
      toast.success("Field report submitted successfully!");
    } catch (error) {
      const errorMessage = handleApiError(error);
      setFieldReportError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFieldReportLoading(false);
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
          await documentService.downloadDocument(doc._id.toString(), doc.name);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc._id.toString());
          refetch();
          toast.success(`${doc.name} deleted`);
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading || docsLoading || (isSuperAdmin && orgsLoading)) {
    return (
      <Layout user={user ?? undefined} onLogout={logout}>
        <div className="text-center py-12">
          Loading documents &amp; reports...
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!canViewDocuments) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="text-center py-12 text-muted-foreground">
          You do not have permission to view documents.
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="field-reports"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Field Reports
            </TabsTrigger>
          </TabsList>

          {/* ====================== DOCUMENTS TAB ====================== */}
          <TabsContent value="documents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">Documents</h1>
              {canUploadDocuments && (
                <Button
                  onClick={() => setShowUpload(!showUpload)}
                  variant="professional"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </div>

            {showUpload && canUploadDocuments && (
              <DocumentUpload
                onUpload={handleDocumentUpload}
                organizations={organizations}
                currentUserOrg={user.organization?._id ?? undefined}
                loading={uploadLoading}
                error={uploadError}
                success={uploadSuccess}
              />
            )}

            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
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

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                {canUploadDocuments ? (
                  <p className="text-muted-foreground">
                    No documents found.{" "}
                    <Button variant="link" onClick={() => setShowUpload(true)}>
                      Upload one
                    </Button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">No documents found.</p>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      canEditDocuments={false} // adjust if you have edit permission logic
                      canDeleteDocuments={true}
                      onView={() => handleDocumentAction("view", doc)}
                      onDownload={() => handleDocumentAction("download", doc)}
                      onDelete={() => handleDocumentAction("delete", doc)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} (
                      {filteredDocuments.length} documents)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ====================== FIELD REPORTS TAB ====================== */}
          <TabsContent value="field-reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8" />
                Field Reports
              </h1>
            </div>

            <EnumeratorUploadForm
              onSubmit={handleEnumeratorSubmit}
              // ← CHANGE THIS to your real public unauthenticated URL
              publicFormUrl="https://cmp-sage.vercel.app/public/enumerator-form"
              loading={fieldReportLoading}
              error={fieldReportError}
              success={fieldReportSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentsPage;
