// // // src/components/FolderManagement.tsx
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "./ui/dialog";
// // import { Badge } from "./ui/badge";
// // import { Alert, AlertDescription } from "./ui/alert";
// // import {
// //   Folder,
// //   FolderOpen,
// //   FolderPlus,
// //   FileText,
// //   ChevronRight,
// //   ChevronDown,
// //   Building,
// //   Trash2,
// //   Edit3,
// //   ChevronLeft,
// //   ChevronRight as ChevronRightIcon,
// //   ExternalLink, // CHANGED: From Eye to ExternalLink for better navigation indication
// // } from "lucide-react";
// // import type { Document, Organization } from "../types";
// // import { Label } from "./ui/label";
// // import { toast } from "sonner";

// // interface FolderManagementProps {
// //   documents: Document[];
// //   organizations: Organization[];
// //   currentUser: any;
// //   onDocumentAction: (action: string, doc: Document) => void;
// //   onCreateFolder?: (name: string, organizationType: string) => Promise<void>;
// //   onDeleteFolder?: (folderId: string) => Promise<void>;
// //   onRenameFolder?: (folderId: string, newName: string) => Promise<void>;
// // }

// // const FolderManagement = ({
// //   documents,
// //   organizations,
// //   currentUser,
// //   onDocumentAction,
// //   onCreateFolder,
// //   onDeleteFolder,
// //   onRenameFolder,
// // }: FolderManagementProps) => {
// //   const navigate = useNavigate();
// //   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
// //     new Set(["company-documents"])
// //   );
// //   const [showCreateDialog, setShowCreateDialog] = useState(false);
// //   const [newFolderName, setNewFolderName] = useState("");
// //   const [newFolderType, setNewFolderType] = useState("");
// //   const [editingFolder, setEditingFolder] = useState<string | null>(null);
// //   const [editFolderName, setEditFolderName] = useState("");
// //   const [isCreating, setIsCreating] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const PAGE_SIZE = 3;

// //   const toggleFolder = (folderId: string) => {
// //     const newExpanded = new Set(expandedFolders);
// //     if (newExpanded.has(folderId)) {
// //       newExpanded.delete(folderId);
// //     } else {
// //       newExpanded.add(folderId);
// //     }
// //     setExpandedFolders(newExpanded);
// //   };

// //   // FIXED: Group documents by organization ID (coerce to string for matching)
// //   const documentsByOrg = documents.reduce((acc, doc) => {
// //     const docOrgId = doc.organization?.toString() || '';
// //     if (!acc[docOrgId]) {
// //       acc[docOrgId] = [];
// //     }
// //     acc[docOrgId].push(doc);
// //     return acc;
// //   }, {} as Record<string, Document[]>);

// //   // Filter organizations based on user role (all for admin)
// //   const isAdminUser = ['admin', 'superadmin'].includes(currentUser?.role.name?.toLowerCase() || '');
// //   const visibleOrganizations =
// //     isAdminUser
// //       ? organizations
// //       : organizations.filter((org) => org._id.toString() === (currentUser?.organization || '').toString());

// //   // Pagination logic
// //   const totalOrgs = visibleOrganizations.length;
// //   const totalPages = Math.ceil(totalOrgs / PAGE_SIZE);
// //   const startIndex = (currentPage - 1) * PAGE_SIZE;
// //   const endIndex = startIndex + PAGE_SIZE;
// //   const paginatedOrganizations = visibleOrganizations.slice(startIndex, endIndex);

// //   // Enhanced Debug log
// //   console.log("FolderManagement Debug:", {
// //     totalOrgs,
// //     currentPage,
// //     totalPages,
// //     visibleOrgs: paginatedOrganizations.length,
// //     visibleOrgNames: paginatedOrganizations.map(o => ({ id: o._id.toString(), name: o.name })),
// //     isAdmin: isAdminUser,
// //     docsPerOrg: Object.fromEntries(
// //       Object.entries(documentsByOrg).map(([key, docs]) => [key, docs.length])
// //     ),
// //   });

// //   const handleCreateFolder = async () => {
// //     if (!newFolderName.trim() || !newFolderType.trim()) {
// //       toast.error("Both folder name and type are required");
// //       return;
// //     }

// //     setIsCreating(true);
// //     try {
// //       if (onCreateFolder) {
// //         await onCreateFolder(newFolderName.trim(), newFolderType.trim());
// //         toast.success(`Folder "${newFolderName}" created successfully`);
// //         setNewFolderName("");
// //         setNewFolderType("");
// //         setShowCreateDialog(false);
// //       }
// //     } catch (error) {
// //       toast.error("Failed to create folder");
// //     } finally {
// //       setIsCreating(false);
// //     }
// //   };

// //   const handleRenameFolder = async (orgId: string) => {
// //     if (!editFolderName.trim()) return;

// //     try {
// //       if (onRenameFolder) {
// //         await onRenameFolder(orgId, editFolderName);
// //         toast.success("Folder renamed successfully");
// //         setEditingFolder(null);
// //         setEditFolderName("");
// //       }
// //     } catch (error) {
// //       toast.error("Failed to rename folder");
// //     }
// //   };

// //   const handleDeleteFolder = async (orgId: string) => {
// //     const orgIdStr = orgId.toString();
// //     const hasDocuments = documentsByOrg[orgIdStr]?.length > 0;
// //     if (hasDocuments) {
// //       toast.error("Cannot delete folder containing documents");
// //       return;
// //     }

// //     if (window.confirm("Are you sure you want to delete this folder?")) {
// //       try {
// //         if (onDeleteFolder) {
// //           await onDeleteFolder(orgId);
// //           toast.success("Folder deleted successfully");
// //         }
// //       } catch (error) {
// //         toast.error("Failed to delete folder");
// //       }
// //     }
// //   };

// //   // Handle page change
// //   const handlePageChange = (page: number) => {
// //     if (page >= 1 && page <= totalPages) {
// //       setCurrentPage(page);
// //     }
// //   };

// //   // Navigate to organization documents page
// //   const handleViewDocuments = (orgId: string) => {
// //     navigate(`/documents/${orgId}`);
// //   };

// //   const FolderIcon = ({
// //     isExpanded,
// //     hasDocuments,
// //   }: {
// //     isExpanded: boolean;
// //     hasDocuments: boolean;
// //   }) =>
// //     isExpanded ? (
// //       <FolderOpen className="h-5 w-5 text-blue-500" />
// //     ) : (
// //       <Folder
// //         className={`h-5 w-5 ${
// //           hasDocuments ? "text-blue-600" : "text-gray-400"
// //         }`}
// //       />
// //     );

// //   return (
// //     <div className="space-y-4">
// //       {/* Company Documents Parent Folder */}
// //       <Card className="border-2 border-primary/20 shadow-md">
// //         <CardHeader className="pb-3">
// //           <div className="flex items-center justify-between">
// //             <div
// //               className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
// //               onClick={() => toggleFolder("company-documents")}
// //             >
// //               <div className="flex items-center gap-2">
// //                 {expandedFolders.has("company-documents") ? (
// //                   <ChevronDown className="h-4 w-4 text-muted-foreground" />
// //                 ) : (
// //                   <ChevronRight className="h-4 w-4 text-muted-foreground" />
// //                 )}
// //                 <Building className="h-6 w-6 text-primary" />
// //               </div>
// //               <div>
// //                 <CardTitle className="text-lg font-semibold text-primary">
// //                   Company Documents
// //                 </CardTitle>
// //                 <p className="text-sm text-muted-foreground mt-1">
// //                   Organization folders and documents
// //                 </p>
// //               </div>
// //             </div>

// //             {(isAdminUser || currentUser?.role.name === "user") && (
// //               <Dialog
// //                 open={showCreateDialog}
// //                 onOpenChange={setShowCreateDialog}
// //               >
// //                 <DialogTrigger asChild>
// //                   <Button variant="outline" size="sm" className="gap-2">
// //                     <FolderPlus className="h-4 w-4" />
// //                     New Folder
// //                   </Button>
// //                 </DialogTrigger>
// //                 <DialogContent>
// //                   <DialogHeader>
// //                     <DialogTitle>Create Organization Folder</DialogTitle>
// //                   </DialogHeader>
// //                   <div className="space-y-4">
// //                     <div>
// //                       <Label htmlFor="folderType">Folder Type</Label>
// //                       <Input
// //                         id="folderType"
// //                         placeholder="Enter organization type (e.g., tech3)"
// //                         value={newFolderType}
// //                         onChange={(e) => setNewFolderType(e.target.value)}
// //                         onKeyPress={(e) =>
// //                           e.key === "Enter" && handleCreateFolder()
// //                         }
// //                       />
// //                     </div>
// //                     <div>
// //                       <Label htmlFor="folderName">Folder Name</Label>
// //                       <Input
// //                         id="folderName"
// //                         placeholder="Enter organization name"
// //                         value={newFolderName}
// //                         onChange={(e) => setNewFolderName(e.target.value)}
// //                         onKeyPress={(e) =>
// //                           e.key === "Enter" && handleCreateFolder()
// //                         }
// //                       />
// //                     </div>
// //                     <Alert>
// //                       <Building className="h-4 w-4" />
// //                       <AlertDescription>
// //                         This will create a new organization folder under Company
// //                         Documents
// //                       </AlertDescription>
// //                     </Alert>
// //                     <div className="flex gap-2 justify-end">
// //                       <Button
// //                         variant="outline"
// //                         onClick={() => {
// //                           setShowCreateDialog(false);
// //                           setNewFolderName("");
// //                           setNewFolderType("");
// //                         }}
// //                       >
// //                         Cancel
// //                       </Button>
// //                       <Button
// //                         onClick={handleCreateFolder}
// //                         disabled={!newFolderName.trim() || !newFolderType.trim() || isCreating}
// //                       >
// //                         {isCreating ? "Creating..." : "Create Folder"}
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </DialogContent>
// //               </Dialog>
// //             )}
// //           </div>
// //         </CardHeader>

// //         {expandedFolders.has("company-documents") && (
// //           <CardContent className="pt-0">
// //             <div className="pl-6 space-y-3">
// //               {totalOrgs === 0 ? (
// //                 <div className="text-center py-8">
// //                   <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
// //                   <p className="text-muted-foreground">
// //                     No organization folders yet
// //                   </p>
// //                   <p className="text-sm text-muted-foreground">
// //                     Create a folder to organize your documents
// //                   </p>
// //                 </div>
// //               ) : (
// //                 <>
// //                   {paginatedOrganizations.map((org) => {
// //                     const orgId = org._id.toString();
// //                     const orgDocuments = documentsByOrg[orgId] || [];
// //                     const isExpanded = expandedFolders.has(orgId);
// //                     const isEditing = editingFolder === orgId;

// //                     return (
// //                       <Card key={org._id} className="border border-border/50">
// //                         <CardContent className="p-4">
// //                           <div className="flex items-center justify-between mb-3">
// //                             <div
// //                               className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors flex-1"
// //                               onClick={() => !isEditing && toggleFolder(orgId)}
// //                             >
// //                               <div className="flex items-center gap-2">
// //                                 {isExpanded ? (
// //                                   <ChevronDown className="h-4 w-4 text-muted-foreground" />
// //                                 ) : (
// //                                   <ChevronRight className="h-4 w-4 text-muted-foreground" />
// //                                 )}
// //                                 <FolderIcon
// //                                   isExpanded={isExpanded}
// //                                   hasDocuments={orgDocuments.length > 0}
// //                                 />
// //                               </div>

// //                               {isEditing ? (
// //                                 <div className="flex items-center gap-2 flex-1">
// //                                   <Input
// //                                     value={editFolderName}
// //                                     onChange={(e) =>
// //                                       setEditFolderName(e.target.value)
// //                                     }
// //                                     onKeyPress={(e) => {
// //                                       if (e.key === "Enter")
// //                                         handleRenameFolder(org._id.toString());
// //                                       if (e.key === "Escape") {
// //                                         setEditingFolder(null);
// //                                         setEditFolderName("");
// //                                       }
// //                                     }}
// //                                     onBlur={() => handleRenameFolder(org._id.toString())}
// //                                     autoFocus
// //                                     className="h-8"
// //                                   />
// //                                 </div>
// //                               ) : (
// //                                 <div className="flex items-center gap-3 flex-1">
// //                                   <span className="font-medium">{org.name}</span>
// //                                   <Badge variant="secondary" className="text-xs">
// //                                     {(org.documentCount || orgDocuments.length)} document
// //                                     {(org.documentCount || orgDocuments.length) !== 1 ? "s" : ""}
// //                                   </Badge>
// //                                 </div>
// //                               )}
// //                             </div>

// //                             <div className="flex items-center gap-2">
// //                               {/* CHANGED: View Documents Button with ExternalLink icon */}
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={(e) => {
// //                                   e.stopPropagation();
// //                                   handleViewDocuments(orgId);
// //                                 }}
// //                                 className="h-8 w-8 p-0"
// //                                 title="View Documents"
// //                               >
// //                                 <ExternalLink className="h-4 w-4" />
// //                               </Button>
// //                               {isAdminUser && !isEditing && (
// //                                 <>
// //                                   <Button
// //                                     variant="ghost"
// //                                     size="sm"
// //                                     onClick={(e) => {
// //                                       e.stopPropagation();
// //                                       setEditingFolder(orgId);
// //                                       setEditFolderName(org.name);
// //                                     }}
// //                                     className="h-8 w-8 p-0"
// //                                   >
// //                                     <Edit3 className="h-4 w-4" />
// //                                   </Button>
// //                                   <Button
// //                                     variant="ghost"
// //                                     size="sm"
// //                                     onClick={(e) => {
// //                                       e.stopPropagation();
// //                                       handleDeleteFolder(org._id.toString());
// //                                     }}
// //                                     className="h-8 w-8 p-0 text-destructive hover:text-destructive"
// //                                     disabled={orgDocuments.length > 0}
// //                                   >
// //                                     <Trash2 className="h-4 w-4" />
// //                                   </Button>
// //                                 </>
// //                               )}
// //                             </div>
// //                           </div>

// //                           {isExpanded && (
// //                             <div className="pl-6 space-y-3">
// //                               <div className="text-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
// //                                 <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
// //                                 <p className="text-sm text-muted-foreground">
// //                                   Click the link icon to view documents in this folder
// //                                 </p>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </CardContent>
// //                       </Card>
// //                     );
// //                   })}
// //                   {/* Pagination Controls */}
// //                   {totalPages > 1 && (
// //                     <div className="flex items-center justify-between mt-4">
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => handlePageChange(currentPage - 1)}
// //                         disabled={currentPage === 1}
// //                       >
// //                         <ChevronLeft className="h-4 w-4 mr-2" />
// //                         Previous
// //                       </Button>
// //                       <span className="text-sm text-muted-foreground">
// //                         Page {currentPage} of {totalPages} ({totalOrgs} folders)
// //                       </span>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => handlePageChange(currentPage + 1)}
// //                         disabled={currentPage === totalPages}
// //                       >
// //                         Next
// //                         <ChevronRightIcon className="h-4 w-4 ml-2" />
// //                       </Button>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //           </CardContent>
// //         )}
// //       </Card>

// //       {/* Summary Statistics */}
// //       <Card className="bg-muted/30">
// //         <CardContent className="p-4">
// //           <div className="flex items-center justify-between text-sm">
// //             <div className="flex items-center gap-4">
// //               <div className="flex items-center gap-2">
// //                 <Folder className="h-4 w-4 text-muted-foreground" />
// //                 <span>
// //                   {visibleOrganizations.length} folder
// //                   {visibleOrganizations.length !== 1 ? "s" : ""}
// //                 </span>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <FileText className="h-4 w-4 text-muted-foreground" />
// //                 <span>
// //                   {documents.length} document{documents.length !== 1 ? "s" : ""}
// //                 </span>
// //               </div>
// //             </div>
// //             <Badge variant="outline" className="text-xs">
// //               Company Documents
// //             </Badge>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default FolderManagement;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// import { Badge } from "./ui/badge";
// import { Alert, AlertDescription } from "./ui/alert";
// import {
//   Folder,
//   FolderOpen,
//   FolderPlus,
//   ChevronRight,
//   ChevronDown,
//   Building,
//   Trash2,
//   Edit3,
//   ChevronLeft,
//   ChevronRight,
//   ExternalLink,
// } from "lucide-react";
// import type { Document, Organization, Permissions } from "../types";
// import { Label } from "./ui/label";
// import { toast } from "sonner";
// import { useAuthContext } from "../contexts/AuthContext";

// interface FolderManagementProps {
//   documents: Document[];
//   organizations: Organization[];
//   currentUser: any;
//   onDocumentAction: (action: string, doc: Document) => void;
//   onCreateFolder?: (name: string, organizationType: string) => Promise<void>;
//   onDeleteFolder?: (folderId: string) => Promise<void>;
//   onRenameFolder?: (folderId: string, newName: string) => Promise<void>;
// }

// const FolderManagement = ({
//   documents,
//   organizations,
//   currentUser,
//   onDocumentAction,
//   onCreateFolder,
//   onDeleteFolder,
//   onRenameFolder,
// }: FolderManagementProps) => {
//   const navigate = useNavigate();
//   const { user } = useAuthContext();
//   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["company-documents"]));
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [newFolderName, setNewFolderName] = useState("");
//   const [newFolderType, setNewFolderType] = useState("");
//   const [editingFolder, setEditingFolder] = useState<string | null>(null);
//   const [editFolderName, setEditFolderName] = useState("");
//   const [isCreating, setIsCreating] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);

//   const PAGE_SIZE = 3;

//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions: Permissions = user?.role?.permissions || {};
//   const canViewDocuments = isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canViewOrganizations = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;
//   const canCreateOrganizations = isSuperAdmin || permissions.OrganizationManagement?.createOrganizations || false;
//   const canEditOrganizations = isSuperAdmin || permissions.OrganizationManagement?.editOrganizations || false;
//   const canDeleteOrganizations = isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations || false;

//   const toggleFolder = (folderId: string) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(folderId)) {
//       newExpanded.delete(folderId);
//     } else {
//       newExpanded.add(folderId);
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
//   const visibleOrganizations = isAdminUser
//     ? organizations
//     : organizations.filter((org) => org._id.toString() === (currentUser?.organization || "").toString());

//   const totalOrgs = visibleOrganizations.length;
//   const totalPages = Math.ceil(totalOrgs / PAGE_SIZE);
//   const startIndex = (currentPage - 1) * PAGE_SIZE;
//   const endIndex = startIndex + PAGE_SIZE;
//   const paginatedOrganizations = visibleOrganizations.slice(startIndex, endIndex);

//   console.log("FolderManagement Debug:", {
//     totalOrgs,
//     currentPage,
//     totalPages,
//     visibleOrgs: paginatedOrganizations.length,
//     visibleOrgNames: paginatedOrganizations.map((o) => ({ id: o._id.toString(), name: o.name })),
//     isAdmin: isAdminUser,
//     docsPerOrg: Object.fromEntries(Object.entries(documentsByOrg).map(([key, docs]) => [key, docs.length])),
//   });

//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim() || !newFolderType.trim()) {
//       toast.error("Both folder name and type are required");
//       return;
//     }
//     setIsCreating(true);
//     try {
//       if (onCreateFolder) {
//         await onCreateFolder(newFolderName.trim(), newFolderType.trim());
//         toast.success(`Folder "${newFolderName}" created successfully`);
//         setNewFolderName("");
//         setNewFolderType("");
//         setShowCreateDialog(false);
//       }
//     } catch (error) {
//       toast.error("Failed to create folder");
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleRenameFolder = async (orgId: string) => {
//     if (!editFolderName.trim()) {
//       toast.error("Folder name is required");
//       return;
//     }
//     try {
//       if (onRenameFolder) {
//         await onRenameFolder(orgId, editFolderName);
//         toast.success("Folder renamed successfully");
//         setEditingFolder(null);
//         setEditFolderName("");
//       }
//     } catch (error) {
//       toast.error("Failed to rename folder");
//     }
//   };

//   const handleDeleteFolder = async (orgId: string) => {
//     const orgIdStr = orgId.toString();
//     const hasDocuments = documentsByOrg[orgIdStr]?.length > 0;
//     if (hasDocuments) {
//       toast.error("Cannot delete folder containing documents");
//       return;
//     }
//     if (window.confirm("Are you sure you want to delete this folder?")) {
//       try {
//         if (onDeleteFolder) {
//           await onDeleteFolder(orgId);
//           toast.success("Folder deleted successfully");
//         }
//       } catch (error) {
//         toast.error("Failed to delete folder");
//       }
//     }
//   };

//   const handleViewDocuments = (orgId: string) => {
//     navigate(`/documents/${orgId}`);
//   };

//   const FolderIcon = ({ isExpanded, hasDocuments }: { isExpanded: boolean; hasDocuments: boolean }) =>
//     isExpanded ? (
//       <FolderOpen className="h-5 w-5 text-blue-500" />
//     ) : (
//       <Folder className={`h-5 w-5 ${hasDocuments ? "text-blue-600" : "text-gray-400"}`} />
//     );

//   if (!canViewDocuments) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-muted-foreground">You do not have permission to view documents.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <Card className="border-2 border-primary/20 shadow-md">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div
//               className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
//               onClick={() => toggleFolder("company-documents")}
//             >
//               <div className="flex items-center gap-2">
//                 {expandedFolders.has("company-documents") ? (
//                   <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                 ) : (
//                   <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                 )}
//                 <Building className="h-6 w-6 text-primary" />
//               </div>
//               <div>
//                 <CardTitle className="text-lg font-semibold text-primary">Company Documents</CardTitle>
//                 <p className="text-sm text-muted-foreground mt-1">Organization folders and documents</p>
//               </div>
//             </div>
//             {canCreateOrganizations && (
//               <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm" className="gap-2">
//                     <FolderPlus className="h-4 w-4" />
//                     New Folder
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>Create Organization Folder</DialogTitle>
//                   </DialogHeader>
//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="folderType">Folder Type</Label>
//                       <Input
//                         id="folderType"
//                         placeholder="Enter organization type (e.g., tech)"
//                         value={newFolderType}
//                         onChange={(e) => setNewFolderType(e.target.value)}
//                         onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor="folderName">Folder Name</Label>
//                       <Input
//                         id="folderName"
//                         placeholder="Enter organization name"
//                         value={newFolderName}
//                         onChange={(e) => setNewFolderName(e.target.value)}
//                         onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
//                       />
//                     </div>
//                     <Alert>
//                       <Building className="h-4 w-4" />
//                       <AlertDescription>
//                         This will create a new organization folder under Company Documents
//                       </AlertDescription>
//                     </Alert>
//                     <div className="flex gap-2 justify-end">
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           setShowCreateDialog(false);
//                           setNewFolderName("");
//                           setNewFolderType("");
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         onClick={handleCreateFolder}
//                         disabled={!newFolderName.trim() || !newFolderType.trim() || isCreating}
//                       >
//                         {isCreating ? "Creating..." : "Create Folder"}
//                       </Button>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             )}
//           </div>
//         </CardHeader>
//         {expandedFolders.has("company-documents") && (
//           <CardContent className="pt-0">
//             <div className="pl-6 space-y-3">
//               {totalOrgs === 0 ? (
//                 <div className="text-center py-8">
//                   <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//                   <p className="text-muted-foreground">No organization folders yet</p>
//                   <p className="text-sm text-muted-foreground">Create a folder to organize your documents</p>
//                 </div>
//               ) : (
//                 <>
//                   {paginatedOrganizations.map((org) => {
//                     const orgId = org._id.toString();
//                     const orgDocuments = documentsByOrg[orgId] || [];
//                     const isExpanded = expandedFolders.has(orgId);
//                     const isEditing = editingFolder === orgId;

//                     return (
//                       <Card key={org._id} className="border border-border/50">
//                         <CardContent className="p-4">
//                           <div className="flex items-center justify-between mb-3">
//                             <div
//                               className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors flex-1"
//                               onClick={() => !isEditing && toggleFolder(orgId)}
//                             >
//                               <div className="flex items-center gap-2">
//                                 {isExpanded ? (
//                                   <ChevronDown className="h-4 w-4 text-muted-foreground" />
//                                 ) : (
//                                   <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                                 )}
//                                 <FolderIcon isExpanded={isExpanded} hasDocuments={orgDocuments.length > 0} />
//                               </div>
//                               {isEditing ? (
//                                 <div className="flex items-center gap-2 flex-1">
//                                   <Input
//                                     value={editFolderName}
//                                     onChange={(e) => setEditFolderName(e.target.value)}
//                                     onKeyPress={(e) => {
//                                       if (e.key === "Enter") handleRenameFolder(org._id.toString());
//                                       if (e.key === "Escape") {
//                                         setEditingFolder(null);
//                                         setEditFolderName("");
//                                       }
//                                     }}
//                                     onBlur={() => handleRenameFolder(org._id.toString())}
//                                     autoFocus
//                                     className="h-8"
//                                   />
//                                 </div>
//                               ) : (
//                                 <div className="flex items-center gap-3 flex-1">
//                                   <span className="font-medium">{org.name}</span>
//                                   <Badge variant="secondary" className="text-xs">
//                                     {(org.documentCount || orgDocuments.length)} document
//                                     {(org.documentCount || orgDocuments.length) !== 1 ? "s" : ""}
//                                   </Badge>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleViewDocuments(orgId);
//                                 }}
//                                 className="h-8 w-8 p-0"
//                                 title="View Documents"
//                               >
//                                 <ExternalLink className="h-4 w-4" />
//                               </Button>
//                               {isAdminUser && canEditOrganizations && !isEditing && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setEditingFolder(orgId);
//                                     setEditFolderName(org.name);
//                                   }}
//                                   className="h-8 w-8 p-0"
//                                 >
//                                   <Edit3 className="h-4 w-4" />
//                                 </Button>
//                               )}
//                               {isAdminUser && canDeleteOrganizations && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDeleteFolder(org._id.toString());
//                                   }}
//                                   className="h-8 w-8 p-0 text-destructive hover:text-destructive"
//                                   disabled={orgDocuments.length > 0}
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                           {isExpanded && (
//                             <div className="pl-6 space-y-3">
//                               <div className="text-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
//                                 <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
//                                 <p className="text-sm text-muted-foreground">
//                                   Click the link icon to view documents in this folder
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//                   {totalPages > 1 && (
//                     <div className="flex items-center justify-between mt-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                       >
//                         <ChevronLeft className="h-4 w-4 mr-2" />
//                         Previous
//                       </Button>
//                       <span className="text-sm text-muted-foreground">
//                         Page {currentPage} of {totalPages} ({totalOrgs} folders)
//                       </span>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                         <ChevronRight className="h-4 w-4 ml-2" />
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </CardContent>
//         )}
//       </Card>
//       <Card className="bg-muted/30">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between text-sm">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Folder className="h-4 w-4 text-muted-foreground" />
//                 <span>
//                   {visibleOrganizations.length} folder{visibleOrganizations.length !== 1 ? "s" : ""}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Folder className="h-4 w-4 text-muted-foreground" />
//                 <span>{documents.length} document{documents.length !== 1 ? "s" : ""}</span>
//               </div>
//             </div>
//             <Badge variant="outline" className="text-xs">
//               Company Documents
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FolderManagement;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  Building,
  Trash2,
  Edit3,
  ChevronLeft,
  // FIXED: Removed duplicate 'ChevronRight' import; using aliased version only
  ChevronRight as ChevronRightIcon,
  ExternalLink, // CHANGED: From Eye to ExternalLink for better navigation indication
} from "lucide-react";
import type { Document, Organization } from "../types";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface FolderManagementProps {
  documents: Document[];
  organizations: Organization[];
  currentUser: any;
  onDocumentAction: (action: string, doc: Document) => void;
  onCreateFolder?: (name: string, organizationType: string) => Promise<void>;
  onDeleteFolder?: (folderId: string) => Promise<void>;
  onRenameFolder?: (folderId: string, newName: string) => Promise<void>;
}

const FolderManagement = ({
  documents,
  organizations,
  currentUser,
  onDocumentAction,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: FolderManagementProps) => {
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["company-documents"])
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState("");
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 3;

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // FIXED: Group documents by organization ID (coerce to string for matching)
  const documentsByOrg = documents.reduce((acc, doc) => {
    const docOrgId = doc.organization?.toString() || '';
    if (!acc[docOrgId]) {
      acc[docOrgId] = [];
    }
    acc[docOrgId].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Filter organizations based on user role (all for admin)
  const isAdminUser = ['admin', 'superadmin'].includes(currentUser?.role.name?.toLowerCase() || '');
  const visibleOrganizations =
    isAdminUser
      ? organizations
      : organizations.filter((org) => org._id.toString() === (currentUser?.organization || '').toString());

  // Pagination logic
  const totalOrgs = visibleOrganizations.length;
  const totalPages = Math.ceil(totalOrgs / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedOrganizations = visibleOrganizations.slice(startIndex, endIndex);

  // Enhanced Debug log
  console.log("FolderManagement Debug:", {
    totalOrgs,
    currentPage,
    totalPages,
    visibleOrgs: paginatedOrganizations.length,
    visibleOrgNames: paginatedOrganizations.map(o => ({ id: o._id.toString(), name: o.name })),
    isAdmin: isAdminUser,
    docsPerOrg: Object.fromEntries(
      Object.entries(documentsByOrg).map(([key, docs]) => [key, docs.length])
    ),
  });

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !newFolderType.trim()) {
      toast.error("Both folder name and type are required");
      return;
    }

    setIsCreating(true);
    try {
      if (onCreateFolder) {
        await onCreateFolder(newFolderName.trim(), newFolderType.trim());
        toast.success(`Folder "${newFolderName}" created successfully`);
        setNewFolderName("");
        setNewFolderType("");
        setShowCreateDialog(false);
      }
    } catch (error) {
      toast.error("Failed to create folder");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameFolder = async (orgId: string) => {
    if (!editFolderName.trim()) return;

    try {
      if (onRenameFolder) {
        await onRenameFolder(orgId, editFolderName);
        toast.success("Folder renamed successfully");
        setEditingFolder(null);
        setEditFolderName("");
      }
    } catch (error) {
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (orgId: string) => {
    const orgIdStr = orgId.toString();
    const hasDocuments = documentsByOrg[orgIdStr]?.length > 0;
    if (hasDocuments) {
      toast.error("Cannot delete folder containing documents");
      return;
    }

    if (window.confirm("Are you sure you want to delete this folder?")) {
      try {
        if (onDeleteFolder) {
          await onDeleteFolder(orgId);
          toast.success("Folder deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete folder");
      }
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Navigate to organization documents page
  const handleViewDocuments = (orgId: string) => {
    navigate(`/documents/${orgId}`);
  };

  const FolderIcon = ({
    isExpanded,
    hasDocuments,
  }: {
    isExpanded: boolean;
    hasDocuments: boolean;
  }) =>
    isExpanded ? (
      <FolderOpen className="h-5 w-5 text-blue-500" />
    ) : (
      <Folder
        className={`h-5 w-5 ${
          hasDocuments ? "text-blue-600" : "text-gray-400"
        }`}
      />
    );

  return (
    <div className="space-y-4">
      {/* Company Documents Parent Folder */}
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => toggleFolder("company-documents")}
            >
              <div className="flex items-center gap-2">
                {expandedFolders.has("company-documents") ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-primary">
                  Company Documents
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Organization folders and documents
                </p>
              </div>
            </div>

            {(isAdminUser || currentUser?.role.name === "user") && (
              <Dialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Organization Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="folderType">Folder Type</Label>
                      <Input
                        id="folderType"
                        placeholder="Enter organization type (e.g., tech3)"
                        value={newFolderType}
                        onChange={(e) => setNewFolderType(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleCreateFolder()
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="folderName">Folder Name</Label>
                      <Input
                        id="folderName"
                        placeholder="Enter organization name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleCreateFolder()
                        }
                      />
                    </div>
                    <Alert>
                      <Building className="h-4 w-4" />
                      <AlertDescription>
                        This will create a new organization folder under Company
                        Documents
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreateDialog(false);
                          setNewFolderName("");
                          setNewFolderType("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim() || !newFolderType.trim() || isCreating}
                      >
                        {isCreating ? "Creating..." : "Create Folder"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>

        {expandedFolders.has("company-documents") && (
          <CardContent className="pt-0">
            <div className="pl-6 space-y-3">
              {totalOrgs === 0 ? (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No organization folders yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create a folder to organize your documents
                  </p>
                </div>
              ) : (
                <>
                  {paginatedOrganizations.map((org) => {
                    const orgId = org._id.toString();
                    const orgDocuments = documentsByOrg[orgId] || [];
                    const isExpanded = expandedFolders.has(orgId);
                    const isEditing = editingFolder === orgId;

                    return (
                      <Card key={org._id} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors flex-1"
                              onClick={() => !isEditing && toggleFolder(orgId)}
                            >
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <FolderIcon
                                  isExpanded={isExpanded}
                                  hasDocuments={orgDocuments.length > 0}
                                />
                              </div>

                              {isEditing ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={editFolderName}
                                    onChange={(e) =>
                                      setEditFolderName(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter")
                                        handleRenameFolder(org._id.toString());
                                      if (e.key === "Escape") {
                                        setEditingFolder(null);
                                        setEditFolderName("");
                                      }
                                    }}
                                    onBlur={() => handleRenameFolder(org._id.toString())}
                                    autoFocus
                                    className="h-8"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="font-medium">{org.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {(org.documentCount || orgDocuments.length)} document
                                    {(org.documentCount || orgDocuments.length) !== 1 ? "s" : ""}
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* CHANGED: View Documents Button with ExternalLink icon */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocuments(orgId);
                                }}
                                className="h-8 w-8 p-0"
                                title="View Documents"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              {isAdminUser && !isEditing && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingFolder(orgId);
                                      setEditFolderName(org.name);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFolder(org._id.toString());
                                    }}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    disabled={orgDocuments.length > 0}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="pl-6 space-y-3">
                              <div className="text-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                                <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Click the link icon to view documents in this folder
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                  {/* Pagination Controls */}
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
                        Page {currentPage} of {totalPages} ({totalOrgs} folders)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary Statistics */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-muted-foreground" />
                <span>
                  {visibleOrganizations.length} folder
                  {visibleOrganizations.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>
                  {documents.length} document{documents.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Company Documents
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FolderManagement;