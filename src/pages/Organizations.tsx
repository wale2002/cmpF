// // src/pages/OrganizationsPage.tsx
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { organizationService, documentService } from "../lib/api";  // Added documentService
// import { Layout } from "../components/Layout";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import type { Organization, Document } from "../types";  // Added Document
// import { toast } from "sonner";
// import { handleApiError } from "../utils/error-handler";

// const OrganizationsPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();
//   const [newOrgName, setNewOrgName] = useState("");
//   const [newOrgType, setNewOrgType] = useState("");  // NEW: For organizationType
//   const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
//   const [editOrgName, setEditOrgName] = useState("");
//   const [editOrgType, setEditOrgType] = useState("");  // NEW: For editing type

//   const { data: organizationsData, isLoading: orgsLoading, refetch: refetchOrgs } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled: !!user && ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || ''),
//   });

//   // FIXED: Fetch all docs with high limit to avoid pagination cap
//   const { data: allDocsData, isLoading: docsLoading, refetch: refetchDocs } = useQuery({
//     queryKey: ["orgDocsCounts"],
//     queryFn: async () => {
//       if (!user || !['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '')) return [];
//       const orgsResponse = await organizationService.getOrganizations();
//       const orgs = orgsResponse.data?.organizations || orgsResponse.organizations || [];
//       const allDocs = await Promise.all(
//         orgs.map(async (org: Organization) => {
//           try {
//             const docsResponse = await documentService.getDocumentsByOrg(org._id, { page: 1, limit: 9999 });
//             return docsResponse.data?.documents || docsResponse.documents || [];
//           } catch {
//             return [];
//           }
//         })
//       );
//       return allDocs.flat();
//     },
//     enabled: !!user && ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || ''),
//   });

//   const organizations = organizationsData?.data?.organizations || organizationsData?.organizations || [];
//   const allDocuments = allDocsData || [];

//   // Compute doc counts per org (fix ID mismatch)
//   const orgDocCounts = allDocuments.reduce((acc: Record<string, number>, doc: Document) => {
//     const docOrgId = doc.organization?.toString() || '';
//     acc[docOrgId] = (acc[docOrgId] || 0) + 1;
//     return acc;
//   }, {});

//   // Debug log
//   console.log("OrganizationsPage Debug:", {
//     totalOrgs: organizations.length,
//     orgIds: organizations.map(o => o._id.toString()),
//     docCounts: orgDocCounts,  // e.g., { '68bf49cebe39c2e43a8d55bc': 21, ... }
//   });

//   const handleCreateOrg = async () => {
//     if (!newOrgName.trim() || !newOrgType.trim()) {
//       toast.error("Both organization name and type are required");
//       return;
//     }
//     try {
//       await organizationService.createOrganization({ 
//         name: newOrgName.trim(), 
//         organizationType: newOrgType.trim() 
//       });
//       refetchOrgs();
//       refetchDocs();  // Refetch counts
//       setNewOrgName("");
//       setNewOrgType("");
//       toast.success("Organization created successfully");
//     } catch (error) {
//       handleApiError(error, "Failed to create organization");
//     }
//   };

//   const handleDeleteOrg = async (orgId: string) => {
//     try {
//       await organizationService.deleteOrganization(orgId);
//       refetchOrgs();
//       refetchDocs();  // Refetch counts
//       toast.success("Organization deleted successfully");
//     } catch (error) {
//       handleApiError(error, "Failed to delete organization");
//     }
//   };

//   const handleUpdateOrg = async (orgId: string) => {  // Renamed for clarity
//     if (!editOrgName.trim() || !editOrgType.trim()) {
//       toast.error("Both organization name and type are required");
//       return;
//     }
//     try {
//       await organizationService.updateOrganization(orgId, {
//         name: editOrgName.trim(),
//         organizationType: editOrgType.trim(),
//       });
//       refetchOrgs();
//       refetchDocs();  // Refetch if needed
//       setEditingOrgId(null);
//       setEditOrgName("");
//       setEditOrgType("");
//       toast.success("Organization updated successfully");
//     } catch (error) {
//       handleApiError(error, "Failed to update organization");
//     }
//   };

//   if (authLoading || orgsLoading || docsLoading) {
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12">Loading organizations...</div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user || !['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '')) {
//     return null;
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
//         <Card>
//           <CardHeader>
//             <CardTitle>Create New Organization</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">  {/* NEW: Vertical layout for two fields */}
//             <Input
//               value={newOrgType}
//               onChange={(e) => setNewOrgType(e.target.value)}
//               placeholder="Enter organization type (e.g., tech3)"
//             />
//             <Input
//               value={newOrgName}
//               onChange={(e) => setNewOrgName(e.target.value)}
//               placeholder="Enter organization name"
//             />
//             <Button onClick={handleCreateOrg} className="w-full">  {/* Full width button */}
//               <Plus className="h-4 w-4 mr-2" />
//               Create
//             </Button>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Organizations List</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Document Count</TableHead>  {/* Now computed */}
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {organizations.map((org: Organization) => {
//                   const orgId = org._id.toString();  // Fix ID match
//                   const docCount = orgDocCounts[orgId] || 0;
//                   const isEditing = editingOrgId === org._id;
//                   return (
//                     <TableRow key={org._id}>
//                       <TableCell>
//                         {isEditing ? (
//                           <div className="flex gap-2">
//                             <Input
//                               value={editOrgName}
//                               onChange={(e) => setEditOrgName(e.target.value)}
//                               placeholder="New name"
//                             />
//                             <Button
//                               size="sm"
//                               onClick={() => handleUpdateOrg(org._id)}
//                             >
//                               Save
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => {
//                                 setEditingOrgId(null);
//                                 setEditOrgName("");
//                                 setEditOrgType("");
//                               }}
//                             >
//                               Cancel
//                             </Button>
//                           </div>
//                         ) : (
//                           org.name
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         {isEditing ? (
//                           <Input
//                             value={editOrgType}
//                             onChange={(e) => setEditOrgType(e.target.value)}
//                             placeholder="New type"
//                             className="w-full"
//                           />
//                         ) : (
//                           org.organizationType || "N/A"
//                         )}
//                       </TableCell>
//                       <TableCell>{docCount}</TableCell>  {/* Use computed count */}
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => {
//                               setEditingOrgId(org._id);
//                               setEditOrgName(org.name);
//                               setEditOrgType(org.organizationType || "");
//                             }}
//                           >
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleDeleteOrg(org._id)}
//                             disabled={docCount > 0}  // NEW: Disable if has docs
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default OrganizationsPage;


// src/pages/OrganizationsPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { organizationService, documentService } from "../lib/api";  // Added documentService
import { Layout } from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Organization, Document, ApiResponse } from "../types";  // Added Document
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

const OrganizationsPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState("");  // NEW: For organizationType
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgType, setEditOrgType] = useState("");  // NEW: For editing type

  const { data: organizationsData, isLoading: orgsLoading, refetch: refetchOrgs } = useQuery<ApiResponse<{ organizations: Organization[]; total: number; page: number; totalPages: number; }>>({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: !!user && ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || ''),
  });

  // FIXED: Fetch all docs with high limit to avoid pagination cap
  const { data: allDocsData, isLoading: docsLoading, refetch: refetchDocs } = useQuery<Document[]>({
    queryKey: ["orgDocsCounts"],
    queryFn: async () => {
      if (!user || !['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '')) return [];
      const orgsResponse = await organizationService.getOrganizations();
      const orgs = orgsResponse.data?.organizations || [];
      const allDocs = await Promise.all(
        orgs.map(async (org: Organization) => {
          try {
            const docsResponse = await documentService.getDocumentsByOrg(org._id, { page: 1, limit: 9999 });
            return docsResponse.data?.documents || [];
          } catch {
            return [];
          }
        })
      );
      return allDocs.flat();
    },
    enabled: !!user && ['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || ''),
  });

  const organizations = organizationsData?.data?.organizations || [];
  const allDocuments = allDocsData || [];

  // Compute doc counts per org (fix ID mismatch)
  const orgDocCounts = allDocuments.reduce((acc: Record<string, number>, doc: Document) => {
    const docOrgId = doc.organization?.toString() || '';
    acc[docOrgId] = (acc[docOrgId] || 0) + 1;
    return acc;
  }, {});

  // Debug log
  console.log("OrganizationsPage Debug:", {
    totalOrgs: organizations.length,
    orgIds: organizations.map((o: Organization) => o._id.toString()), // Fixed: Typed param
    docCounts: orgDocCounts,  // e.g., { '68bf49cebe39c2e43a8d55bc': 21, ... }
  });

  const handleCreateOrg = async () => {
    if (!newOrgName.trim() || !newOrgType.trim()) {
      toast.error("Both organization name and type are required");
      return;
    }
    try {
      await organizationService.createOrganization({ 
        name: newOrgName.trim(), 
        organizationType: newOrgType.trim() 
      });
      refetchOrgs();
      refetchDocs();  // Refetch counts
      setNewOrgName("");
      setNewOrgType("");
      toast.success("Organization created successfully");
    } catch (error) {
      handleApiError(error, "Failed to create organization");
    }
  };

  const handleDeleteOrg = async (orgId: string) => {
    try {
      await organizationService.deleteOrganization(orgId);
      refetchOrgs();
      refetchDocs();  // Refetch counts
      toast.success("Organization deleted successfully");
    } catch (error) {
      handleApiError(error, "Failed to delete organization");
    }
  };

  const handleUpdateOrg = async (orgId: string) => {  // Renamed for clarity
    if (!editOrgName.trim() || !editOrgType.trim()) {
      toast.error("Both organization name and type are required");
      return;
    }
    try {
      await organizationService.updateOrganization(orgId, {
        name: editOrgName.trim(),
        organizationType: editOrgType.trim(),
      });
      refetchOrgs();
      refetchDocs();  // Refetch if needed
      setEditingOrgId(null);
      setEditOrgName("");
      setEditOrgType("");
      toast.success("Organization updated successfully");
    } catch (error) {
      handleApiError(error, "Failed to update organization");
    }
  };

  if (authLoading || orgsLoading || docsLoading) {
    return (
      <Layout user={user || undefined} onLogout={logout}> {/* Fixed: Handle null/undefined */}
        <div className="text-center py-12">Loading organizations...</div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user || !['admin', 'superadmin'].includes(user.role.name?.toLowerCase() || '')) {
    return null;
  }

  return (
    <Layout user={user || undefined} onLogout={logout}> {/* Fixed: Handle null/undefined */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Organizations</h1>
        <Card>
          <CardHeader>
            <CardTitle>Create New Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">  {/* NEW: Vertical layout for two fields */}
            <Input
              value={newOrgType}
              onChange={(e) => setNewOrgType(e.target.value)}
              placeholder="Enter organization type (e.g., tech3)"
            />
            <Input
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Enter organization name"
            />
            <Button onClick={handleCreateOrg} className="w-full">  {/* Full width button */}
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organizations List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Document Count</TableHead>  {/* Now computed */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org: Organization) => {
                  const orgId = org._id.toString();  // Fix ID match
                  const docCount = orgDocCounts[orgId] || 0;
                  const isEditing = editingOrgId === org._id;
                  return (
                    <TableRow key={org._id}>
                      <TableCell>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <Input
                              value={editOrgName}
                              onChange={(e) => setEditOrgName(e.target.value)}
                              placeholder="New name"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrg(org._id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingOrgId(null);
                                setEditOrgName("");
                                setEditOrgType("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          org.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editOrgType}
                            onChange={(e) => setEditOrgType(e.target.value)}
                            placeholder="New type"
                            className="w-full"
                          />
                        ) : (
                          org.organizationType || "N/A"
                        )}
                      </TableCell>
                      <TableCell>{docCount}</TableCell>  {/* Use computed count */}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingOrgId(org._id);
                              setEditOrgName(org.name);
                              setEditOrgType(org.organizationType || "");
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteOrg(org._id)}
                            disabled={docCount > 0}  // NEW: Disable if has docs
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrganizationsPage;