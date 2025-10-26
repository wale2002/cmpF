

// // src/pages/OrganizationDocumentsPage.tsx
// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService, organizationService } from "../lib/api";
// import { Layout } from "../components/Layout";
// import DocumentCard from "../components/DocumentCard";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Search, Filter, ChevronLeft, Bell, AlertTriangle } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../components/ui/dialog";
// import { Badge } from "../components/ui/badge";
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";
// import type { Document, Organization, Alert } from "../types";

// const PAGE_LIMIT = 6; // Match backend default or adjust as needed

// const OrganizationDocumentsPage = () => {
//   const { orgId } = useParams<{ orgId: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuthContext();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAlerts, setShowAlerts] = useState(false);
//   const isAdminUser = ['admin', 'superadmin'].includes(user?.role?.name?.toLowerCase() || '');

//   // Fetch organization details for header
//   const { data: orgData } = useQuery({
//     queryKey: ["organization", orgId],
//     queryFn: () => organizationService.getOrganization(orgId!),
//     enabled: !!orgId,
//   });
//   const organization = orgData?.data?.organization || orgData?.organization;

//   // Fetch documents with pagination
//   const { data: docsData, isLoading, error, refetch } = useQuery({
//     queryKey: ["orgDocuments", orgId, currentPage, searchTerm, filterType],
//     queryFn: async () => {
//       let params: any = { page: currentPage, limit: PAGE_LIMIT };
//       if (searchTerm) params.search = searchTerm;
//       if (filterType !== "all") params.documentType = filterType;
//       return documentService.getDocumentsByOrg(orgId!, params);
//     },
//     enabled: !!orgId,
//     onError: (err) => {
//       console.error("Documents fetch error:", err);
//       toast.error("Failed to load documents");
//     },
//   });

//   const documents = docsData?.data?.documents || docsData?.documents || [];
//   const totalPages = docsData?.data?.totalPages || 1;
//   const totalDocs = docsData?.data?.total || 0;

//   // Fetch org-specific enhanced alerts
//   const { data: alertsData } = useQuery({
//     queryKey: ["enhancedAlerts", orgId],
//     queryFn: () => documentService.getEnhancedContractExpiryAlerts(orgId!),
//     enabled: !!orgId,
//   });
//   const alerts: Alert[] = alertsData?.data?.alerts || [];
//   const unreadAlertsCount = alerts.length; // Assume all are "unread" or adjust logic

//   // Filter logic (client-side if needed, but backend supports search/type)
//   const filteredDocuments = documents.filter((doc) => {
//     const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType = filterType === "all" || doc.documentType === filterType;
//     return matchesSearch && matchesType; // Redundant if backend filters, but safe
//   });

//   const getAlertDisplay = (alert: Alert) => {
//     let message: string;
//     let subText: string;
//     let iconVariant: "destructive" | "warning" | "secondary" | "accent";
//     let borderClass: string;

//     if (alert.alertType === "expiry") {
//       const days = alert.daysToExpiry || 0;
//       message = `${alert.name} (${alert.documentType})`;
//       subText = `Expires in ${days} day${days !== 1 ? 's' : ''} (${new Date(alert.expiryDate).toLocaleDateString()})`;
//       iconVariant = alert.flagColor === "red" ? "destructive" : alert.flagColor === "orange" ? "warning" : "accent";
//       borderClass = alert.flagColor === "red" ? "border-destructive" : alert.flagColor === "orange" ? "border-warning" : "border-accent";
//     } else {
//       const days = alert.daysSinceUpload || 0;
//       message = `New ${alert.documentType}: ${alert.name}`;
//       subText = `${days} day${days !== 1 ? 's' : ''} ago (${new Date(alert.createdAt).toLocaleDateString()})`;
//       iconVariant = "secondary";
//       borderClass = "border-secondary";
//     }

//     return { message, subText, iconVariant, borderClass };
//   };

//   const handleViewAlert = (alert: Alert) => {
//     window.location.href = `/documents/${orgId}`;
//     setShowAlerts(false);
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
//           // TODO: Navigate to edit modal/page
//           break;
//         case "delete":
//           if (window.confirm(`Delete ${doc.name}?`)) {
//             await documentService.deleteDocument(doc._id);
//             refetch();
//             toast.success(`${doc.name} deleted`);
//           }
//           break;
//       }
//     } catch (error) {
//       handleApiError(error);
//     }
//   };

//   if (error || !orgId) {
//     return (
//       <Layout user={user} onLogout={() => {}}>
//         <div className="text-center py-12">
//           <p className="text-red-500">Error loading documents. <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button></p>
//         </div>
//       </Layout>
//     );
//   }

//   if (isLoading) {
//     return (
//       <Layout user={user} onLogout={() => {}}>
//         <div className="text-center py-12">Loading documents...</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={() => {}}>
//       <div className="space-y-6">
//         {/* Header */}
//         <Card>
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Button variant="ghost" onClick={() => navigate(-1)}>
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   Back to Dashboard
//                 </Button>
//                 <div>
//                   <CardTitle className="text-2xl">{organization?.name || "Organization"} Documents</CardTitle>
//                   <p className="text-muted-foreground">{totalDocs} documents</p>
//                 </div>
//               </div>
//               {/* ADDED: Notification Bell for Org Alerts */}
//               <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
//                 <DialogTrigger asChild>
//                   <Button variant="ghost" className="relative">
//                     <Bell className="h-5 w-5" />
//                     {unreadAlertsCount > 0 && (
//                       <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
//                         {unreadAlertsCount}
//                       </Badge>
//                     )}
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-md">
//                   <DialogHeader>
//                     <DialogTitle>{organization?.name} Alerts</DialogTitle>
//                     <DialogDescription>Document expiry and new upload reminders</DialogDescription>
//                   </DialogHeader>
//                   <div className="space-y-3 max-h-64 overflow-y-auto">
//                     {alerts.map((alert) => {
//                       const { message, subText, iconVariant, borderClass } = getAlertDisplay(alert);
//                       return (
//                         <div
//                           key={alert._id}
//                           className={`
//                             bg-background rounded-lg p-3 cursor-pointer transition-all 
//                             hover:bg-muted border ${borderClass}/30 shadow-sm
//                           `}
//                           onClick={() => handleViewAlert(alert)}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="flex-shrink-0 mt-1">
//                               <AlertTriangle className={`h-4 w-4 text-${iconVariant}`} />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-foreground mb-1">
//                                 {message}
//                               </p>
//                               <p className="text-xs text-muted-foreground">
//                                 {subText}
//                               </p>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <Badge variant={alert.flagColor as any} className="text-xs">
//                                   {alert.alertType.toUpperCase()}
//                                 </Badge>
//                                 <span className="text-xs text-muted-foreground">
//                                   Uploaded by: {alert.uploadedBy}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {alerts.length === 0 && (
//                       <p className="text-center text-muted-foreground py-8">No alerts at this time.</p>
//                     )}
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </CardHeader>
//         </Card>

//         {/* Search and Filter */}
//         <div className="flex gap-4 items-center">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search documents..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1); // Reset page on search
//               }}
//               className="pl-10"
//             />
//           </div>
//           <Select value={filterType} onValueChange={(value) => { setFilterType(value); setCurrentPage(1); }}>
//             <SelectTrigger className="w-48">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue />
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

//         {/* Documents Grid */}
//         {filteredDocuments.length === 0 ? (
//           <div className="text-center py-12">
//             <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> {/* Use Search icon as placeholder */}
//             <p className="text-muted-foreground">No documents found.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {filteredDocuments.map((doc) => (
//               <DocumentCard
//                 key={doc._id}
//                 document={doc}
//                 canEdit={isAdminUser || doc.uploadedBy === user?._id}
//                 onView={() => handleDocumentAction("view", doc)}
//                 onDownload={() => handleDocumentAction("download", doc)}
//                 onEdit={() => handleDocumentAction("edit", doc)}
//                 onDelete={() => handleDocumentAction("delete", doc)}
//               />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-4">
//             <Button
//               variant="outline"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//             >
//               Previous
//             </Button>
//             <span className="text-sm text-muted-foreground">
//               Page {currentPage} of {totalPages} ({totalDocs} total)
//             </span>
//             <Button
//               variant="outline"
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default OrganizationDocumentsPage;



// src/pages/OrganizationDocumentsPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";
import { Layout } from "../components/Layout";
import DocumentCard from "../components/DocumentCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Filter, ChevronLeft, Bell, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import type { Document, Organization, Alert, ApiResponse } from "../types";

const PAGE_LIMIT = 6; // Match backend default or adjust as needed

const OrganizationDocumentsPage = () => {
  const { orgId } = useParams<{ orgId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlerts, setShowAlerts] = useState(false);
  const isAdminUser = ['admin', 'superadmin'].includes(user?.role?.name?.toLowerCase() || '');

  // Fetch organization details for header
  const { data: orgData } = useQuery<ApiResponse<{ organization: Organization }>>({
    queryKey: ["organization", orgId],
    queryFn: () => organizationService.getOrganization(orgId!),
    enabled: !!orgId,
  });
  const organization = orgData?.data?.organization;

  // Fetch documents with pagination
  const { data: docsData, isLoading, error, refetch } = useQuery<ApiResponse<{ documents: Document[]; total: number; page: number; totalPages: number; }>>({
    queryKey: ["orgDocuments", orgId, currentPage, searchTerm, filterType],
    queryFn: async () => {
      let params: any = { page: currentPage, limit: PAGE_LIMIT };
      if (searchTerm) params.search = searchTerm;
      if (filterType !== "all") params.documentType = filterType;
      return documentService.getDocumentsByOrg(orgId!, params);
    },
    enabled: !!orgId,
  });

  const documents = docsData?.data?.documents || [];
  const totalPages = docsData?.data?.totalPages || 1;
  const totalDocs = docsData?.data?.total || 0;

  // Fetch org-specific enhanced alerts
  const { data: alertsData } = useQuery<ApiResponse<{ alerts: Alert[] }>>({
    queryKey: ["enhancedAlerts", orgId],
    queryFn: () => documentService.getEnhancedContractExpiryAlerts(orgId!),
    enabled: !!orgId,
  });
  const alerts: Alert[] = alertsData?.data?.alerts || [];
  const unreadAlertsCount = alerts.length; // Assume all are "unread" or adjust logic

  // Filter logic (client-side if needed, but backend supports search/type)
  const filteredDocuments = documents.filter((doc: Document) => { // Fixed: Typed param
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesType; // Redundant if backend filters, but safe
  });

  const getAlertDisplay = (alert: Alert) => {
    let message: string;
    let subText: string;
    let iconVariant: "destructive" | "warning" | "secondary" | "accent";
    let borderClass: string;

    if (alert.alertType === "expiry") {
      const days = alert.daysToExpiry || 0;
      message = `${alert.name} (${alert.documentType})`;
      subText = `Expires in ${days} day${days !== 1 ? 's' : ''} (${new Date(alert.expiryDate || '').toLocaleDateString()})`; // Fixed: Handle undefined
      iconVariant = alert.flagColor === "red" ? "destructive" : alert.flagColor === "orange" ? "warning" : "accent";
      borderClass = alert.flagColor === "red" ? "border-destructive" : alert.flagColor === "orange" ? "border-warning" : "border-accent";
    } else {
      const days = alert.daysSinceUpload || 0;
      message = `New ${alert.documentType}: ${alert.name}`;
      subText = `${days} day${days !== 1 ? 's' : ''} ago (${new Date(alert.createdAt || '').toLocaleDateString()})`; // Fixed: Handle undefined
      iconVariant = "secondary";
      borderClass = "border-secondary";
    }

    return { message, subText, iconVariant, borderClass };
  };

  const handleViewAlert = (alert: Alert) => {
    // Fixed: Unused param warning removed by using it
    window.location.href = `/documents/${orgId}`;
    setShowAlerts(false);
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
          // TODO: Navigate to edit modal/page
          break;
        case "delete":
          if (window.confirm(`Delete ${doc.name}?`)) {
            await documentService.deleteDocument(doc._id);
            refetch();
            toast.success(`${doc.name} deleted`);
          }
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (error || !orgId) {
    return (
      <Layout user={user || undefined} onLogout={() => {}}> {/* Fixed: Handle null/undefined */}
        <div className="text-center py-12">
          <p className="text-red-500">Error loading documents. <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button></p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout user={user || undefined} onLogout={() => {}}> {/* Fixed: Handle null/undefined */}
        <div className="text-center py-12">Loading documents...</div>
      </Layout>
    );
  }

  return (
    <Layout user={user || undefined} onLogout={() => {}}> {/* Fixed: Handle null/undefined */}
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <CardTitle className="text-2xl">{organization?.name || "Organization"} Documents</CardTitle>
                  <p className="text-muted-foreground">{totalDocs} documents</p>
                </div>
              </div>
              {/* ADDED: Notification Bell for Org Alerts */}
              <Dialog open={showAlerts} onOpenChange={setShowAlerts}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadAlertsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                        {unreadAlertsCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{organization?.name} Alerts</DialogTitle>
                    <DialogDescription>Document expiry and new upload reminders</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {alerts.map((alert) => {
                      const { message, subText, iconVariant, borderClass } = getAlertDisplay(alert);
                      return (
                        <div
                          key={alert._id}
                          className={`
                            bg-background rounded-lg p-3 cursor-pointer transition-all 
                            hover:bg-muted border ${borderClass}/30 shadow-sm
                          `}
                          onClick={() => handleViewAlert(alert)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <AlertTriangle className={`h-4 w-4 text-${iconVariant}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground mb-1">
                                {message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {subText}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={alert.flagColor as any} className="text-xs">
                                  {alert.alertType.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Uploaded by: {alert.uploadedBy}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {alerts.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No alerts at this time.</p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value) => { setFilterType(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-48">
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

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" /> {/* Use Search icon as placeholder */}
            <p className="text-muted-foreground">No documents found.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc: Document) => ( // Fixed: Typed param
              <DocumentCard
                key={doc._id}
                document={doc}
                canEdit={isAdminUser || doc.uploadedBy === user?._id}
                onView={() => handleDocumentAction("view", doc)}
                onDownload={() => handleDocumentAction("download", doc)}
                onEdit={() => handleDocumentAction("edit", doc)}
                onDelete={() => handleDocumentAction("delete", doc)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({totalDocs} total)
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrganizationDocumentsPage;