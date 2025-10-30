// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import {
//   Folder,
//   FolderOpen,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   ExternalLink,
// } from "lucide-react";
// import type { Document, Organization, Permissions } from "../types";
// import { useAuthContext } from "../contexts/AuthContext";

// interface OrganizationFoldersProps {
//   documents: Document[];
//   organizations: Organization[];
//   currentUser: any;
//   onDocumentAction: (action: string, doc: Document) => void;
// }

// const OrganizationFolders = ({
//   documents,
//   organizations,
//   currentUser,
// }: OrganizationFoldersProps) => {
//   const navigate = useNavigate();
//   const { user } = useAuthContext();
//   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
//     new Set()
//   );
//   const [currentPage, setCurrentPage] = useState(1);

//   const PAGE_SIZE = 3;

//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions: Permissions = user?.role?.permissions || {};
//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canViewOrganizations =
//     isSuperAdmin ||
//     permissions.OrganizationManagement?.viewOrganizations ||
//     false;

//   const toggleFolder = (orgId: string) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(orgId)) {
//       newExpanded.delete(orgId);
//     } else {
//       newExpanded.add(orgId);
//     }
//     setExpandedFolders(newExpanded);
//   };

//   const documentsByOrg = documents.reduce((acc, doc) => {
//     const docOrgId = doc.organization?.toString() || "";
//     if (!acc[docOrgId]) {
//       acc[docOrgId] = [];
//     }
//     acc[docOrgId].push(doc);
//     return acc;
//   }, {} as Record<string, Document[]>);

//   const isAdminUser = isSuperAdmin || canViewOrganizations;
//   const relevantOrganizations = isAdminUser
//     ? organizations
//     : organizations.filter(
//         (org) =>
//           org._id.toString() === (currentUser?.organization || "").toString()
//       );

//   const totalOrgs = relevantOrganizations.length;
//   const totalPages = Math.ceil(totalOrgs / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const paginatedOrganizations = relevantOrganizations.slice(
//     startIndex,
//     endIndex
//   );

//   console.log("OrganizationFolders Debug:", {
//     totalOrgs,
//     currentPage,
//     totalPages,
//     relevantOrgs: paginatedOrganizations.length,
//     relevantOrgNames: paginatedOrganizations.map((o) => ({
//       id: o._id.toString(),
//       name: o.name,
//     })),
//     userOrg: currentUser?.organization,
//     isAdmin: isAdminUser,
//     docsByOrgKeys: Object.keys(documentsByOrg),
//     docsPerOrg: Object.fromEntries(
//       Object.entries(documentsByOrg).map(([key, docs]) => [key, docs.length])
//     ),
//   });

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const handleViewDocuments = (orgId: string) => {
//     navigate(`/documents/${orgId}`);
//   };

//   if (!canViewDocuments) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">
//           You do not have permission to view documents.
//         </p>
//       </div>
//     );
//   }

//   if (!isAdminUser) {
//     const userOrgId = (currentUser?.organization || "").toString();
//     const userOrgDocs = documentsByOrg[userOrgId] || [];
//     const userOrg = organizations.find(
//       (org) => org._id.toString() === userOrgId
//     );

//     return (
//       <div className="space-y-4">
//         <Card className="border-primary/20">
//           <CardHeader className="pb-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 rounded-lg bg-primary/10">
//                   <Folder className="h-5 w-5 text-primary" />
//                 </div>
//                 <div>
//                   <CardTitle className="text-lg">
//                     {userOrg?.name || "Your Organization"}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     {userOrgDocs.length} document
//                     {userOrgDocs.length !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handleViewDocuments(userOrgId)}
//                 title="View Documents"
//               >
//                 <ExternalLink className="h-4 w-4 mr-2" />
//                 View Documents
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-8">
//               <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <p className="text-muted-foreground">
//                 Click "View Documents" to see your files
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {totalOrgs === 0 ? (
//         <div className="text-center py-12">
//           <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//           <p className="text-lg font-medium text-muted-foreground">
//             No organizations found
//           </p>
//           <p className="text-sm text-muted-foreground">
//             Organizations will appear here
//           </p>
//         </div>
//       ) : (
//         <>
//           {paginatedOrganizations.map((org) => {
//             const orgId = org._id.toString();
//             const orgDocs = documentsByOrg[orgId] || [];
//             const isExpanded = expandedFolders.has(orgId);

//             return (
//               <Card key={org._id} className="border-muted/40">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => toggleFolder(orgId)}
//                         className="p-1 h-auto"
//                       >
//                         {isExpanded ? (
//                           <ChevronDown className="h-4 w-4" />
//                         ) : (
//                           <ChevronRight className="h-4 w-4" />
//                         )}
//                       </Button>
//                       <div className="p-2 rounded-lg bg-secondary/50">
//                         {isExpanded ? (
//                           <FolderOpen className="h-5 w-5 text-secondary-foreground" />
//                         ) : (
//                           <Folder className="h-5 w-5 text-secondary-foreground" />
//                         )}
//                       </div>
//                       <div>
//                         <CardTitle className="text-lg">{org.name}</CardTitle>
//                         <p className="text-sm text-muted-foreground">
//                           {org.documentCount || orgDocs.length} document
//                           {(org.documentCount || orgDocs.length) !== 1
//                             ? "s"
//                             : ""}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleViewDocuments(orgId)}
//                         className="h-8 w-8 p-0"
//                         title="View Documents"
//                       >
//                         <ExternalLink className="h-4 w-4" />
//                       </Button>
//                       <Badge
//                         variant={orgDocs.length > 0 ? "default" : "secondary"}
//                       >
//                         {org.documentCount || orgDocs.length} files
//                       </Badge>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 {isExpanded && (
//                   <CardContent>
//                     <div className="text-center py-8">
//                       <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                       <p className="text-muted-foreground">
//                         Click the link icon to view documents in this
//                         organization
//                       </p>
//                     </div>
//                   </CardContent>
//                 )}
//               </Card>
//             );
//           })}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4 mr-2" />
//                 Previous
//               </Button>
//               <span className="text-sm text-muted-foreground">
//                 Page {currentPage} of {totalPages} ({totalOrgs} folders)
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4 ml-2" />
//               </Button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default OrganizationFolders;

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Folder,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import type { Document, Organization, Permissions } from "../types";
import { useAuthContext } from "../contexts/AuthContext";

interface OrganizationFoldersProps {
  documents: Document[];
  organizations: Organization[]; // Already paginated slice from server
  totalOrganizations?: number; // From API response (e.g., 45)
  totalPages?: number; // From API response (e.g., 5)
  currentPage?: number; // Controlled by parent
  onPageChange?: (page: number) => void; // Parent refetches on change
  currentUser?: any; // Optional, used for non-admin fallback
}

const OrganizationFolders = ({
  documents,
  organizations,
  totalOrganizations = organizations.length, // Fallback to client-side total
  totalPages,
  currentPage = 1,
  onPageChange,
  currentUser,
}: OrganizationFoldersProps) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const PAGE_SIZE =3;
  const isServerPaginated = totalPages !== undefined; // Detect server mode
  const effectiveTotalPages = isServerPaginated
    ? totalPages!
    : Math.ceil(totalOrganizations / PAGE_SIZE);
  const totalOrgs = totalOrganizations;
  const relevantOrganizations = organizations; // Use prop directly in server mode (assume parent filters if needed)

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions: Permissions = user?.role?.permissions || {};
  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canViewOrganizations =
    isSuperAdmin ||
    permissions.OrganizationManagement?.viewOrganizations ||
    false;

  const toggleFolder = (orgId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedFolders(newExpanded);
  };

  const documentsByOrg = documents.reduce((acc, doc) => {
    const docOrgId = doc.organization?.toString() || "";
    if (!acc[docOrgId]) {
      acc[docOrgId] = [];
    }
    acc[docOrgId].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  const isAdminUser = isSuperAdmin || canViewOrganizations;

  // For non-admin, filter to user's org (but in server mode, parent should handle filtering via query params)
  if (!isAdminUser && currentUser) {
    const userOrgId = (currentUser.organization || "").toString();
    const userOrgDocs = documentsByOrg[userOrgId] || [];
    const userOrg = organizations.find(
      (org) => org._id.toString() === userOrgId
    );

    return (
      <div className="space-y-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Folder className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {userOrg?.name || "Your Organization"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {userOrgDocs.length} document
                    {userOrgDocs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/documents/${userOrgId}`)}
                title="View Documents"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documents
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Click "View Documents" to see your files
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("OrganizationFolders Debug:", {
    isServerPaginated,
    totalOrgs,
    currentPage,
    totalPages: effectiveTotalPages,
    relevantOrgs: relevantOrganizations.length,
    relevantOrgNames: relevantOrganizations.map((o) => ({
      id: o._id.toString(),
      name: o.name,
    })),
    userOrg: currentUser?.organization,
    isAdmin: isAdminUser,
    docsByOrgKeys: Object.keys(documentsByOrg),
    docsPerOrg: Object.fromEntries(
      Object.entries(documentsByOrg).map(([key, docs]) => [key, docs.length])
    ),
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= effectiveTotalPages) {
      if (onPageChange) {
        onPageChange(page); // Server: parent refetches
      }
      // Client fallback not needed here since paginatedOrganizations is prop
    }
  };

  const handleViewDocuments = (orgId: string) => {
    navigate(`/documents/${orgId}`);
  };

  if (!canViewDocuments) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You do not have permission to view documents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {totalOrgs === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No organizations found
          </p>
          <p className="text-sm text-muted-foreground">
            Organizations will appear here
          </p>
        </div>
      ) : (
        <>
          {relevantOrganizations.map((org) => {
            const orgId = org._id.toString();
            const orgDocs = documentsByOrg[orgId] || [];
            const isExpanded = expandedFolders.has(orgId);

            return (
              <Card key={org._id} className="border-muted/40">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFolder(orgId)}
                        className="p-1 h-auto"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="p-2 rounded-lg bg-secondary/50">
                        {isExpanded ? (
                          <FolderOpen className="h-5 w-5 text-secondary-foreground" />
                        ) : (
                          <Folder className="h-5 w-5 text-secondary-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {org.documentCount || orgDocs.length} document
                          {(org.documentCount || orgDocs.length) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocuments(orgId)}
                        className="h-8 w-8 p-0"
                        title="View Documents"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Badge
                        variant={orgDocs.length > 0 ? "default" : "secondary"}
                      >
                        {org.documentCount || orgDocs.length} files
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent>
                    <div className="text-center py-8">
                      <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Click the link icon to view documents in this
                        organization
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
          {effectiveTotalPages > 1 && (
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
                Page {currentPage} of {effectiveTotalPages} ({totalOrgs}{" "}
                folders)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === effectiveTotalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizationFolders;
