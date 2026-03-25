// // // // // // src/components/DocumentCard.tsx
// // // // // import { Card, CardContent, CardHeader } from "./ui/card";
// // // // // import { Button } from "./ui/button";
// // // // // import { Badge } from "./ui/badge";
// // // // // import {
// // // // //   Download,
// // // // //   Eye,
// // // // //   Edit,
// // // // //   Trash2,
// // // // //   Calendar,
// // // // //   User,
// // // // //   FileText,
// // // // //   Share2,
// // // // //   AlertCircle,
// // // // // } from "lucide-react";
// // // // // import {
// // // // //   formatDistanceToNow,
// // // // //   format,
// // // // //   isPast,
// // // // //   isFuture,
// // // // //   addDays,
// // // // // } from "date-fns";
// // // // // import { useAuthContext } from "../contexts/AuthContext";
// // // // // import type { Document } from "../types/index";
// // // // // import {
// // // // //   Dialog,
// // // // //   DialogContent,
// // // // //   DialogDescription,
// // // // //   DialogFooter,
// // // // //   DialogHeader,
// // // // //   DialogTitle,
// // // // // } from "./ui/dialog";
// // // // // import { Input } from "./ui/input";
// // // // // import { Label } from "./ui/label";
// // // // // import {
// // // // //   Select,
// // // // //   SelectContent,
// // // // //   SelectItem,
// // // // //   SelectTrigger,
// // // // //   SelectValue,
// // // // // } from "./ui/select";
// // // // // import { useState } from "react";
// // // // // import { documentService } from "../lib/api";
// // // // // import { toast } from "sonner";

// // // // // interface DocumentCardProps {
// // // // //   document: Document;
// // // // //   canEditDocuments?: boolean;
// // // // //   canDeleteDocuments?: boolean;
// // // // //   onView?: () => void;
// // // // //   onDownload?: () => void;
// // // // //   onDelete?: () => void;
// // // // //   onUpdate?: (doc: Document) => void;
// // // // // }

// // // // // const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// // // // // export function DocumentCard({
// // // // //   document,
// // // // //   canEditDocuments: propCanEdit,
// // // // //   canDeleteDocuments: propCanDelete,
// // // // //   onView,
// // // // //   onDownload,
// // // // //   onDelete,
// // // // //   onUpdate,
// // // // // }: DocumentCardProps) {
// // // // //   const { user } = useAuthContext();
// // // // //   const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
// // // // //   const permissions = user?.role?.permissions?.DocumentManagement || {};

// // // // //   const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
// // // // //   const canDelete =
// // // // //     propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
// // // // //   const canView = isSuperAdmin || permissions.viewDocuments;

// // // // //   const [isEditOpen, setIsEditOpen] = useState(false);
// // // // //   const [isUpdating, setIsUpdating] = useState(false);

// // // // //   // Format helpers
// // // // //   const formatDate = (date?: string) =>
// // // // //     date ? format(new Date(date), "MMM d, yyyy") : "—";
// // // // //   const formatFileSize = (sizeMB?: number) =>
// // // // //     sizeMB
// // // // //       ? sizeMB < 1
// // // // //         ? `${(sizeMB * 1024).toFixed(0)} KB`
// // // // //         : `${sizeMB.toFixed(1)} MB`
// // // // //       : "—";
// // // // //   const formatAmount = (amount?: number) =>
// // // // //     amount
// // // // //       ? new Intl.NumberFormat("en-NG", {
// // // // //           style: "currency",
// // // // //           currency: "NGN",
// // // // //           minimumFractionDigits: 0,
// // // // //         }).format(amount)
// // // // //       : "—";

// // // // //   const getTypeBadge = (type: string) => {
// // // // //     const map: Record<string, string> = {
// // // // //       SLA: "bg-emerald-100 text-emerald-700 border-emerald-200",
// // // // //       NDA: "bg-amber-100 text-amber-700 border-amber-200",
// // // // //       Contract: "bg-blue-100 text-blue-700 border-blue-200",
// // // // //     };
// // // // //     return map[type] || "bg-gray-100 text-gray-700 border-gray-200";
// // // // //   };

// // // // //   // Correct Expiry Logic
// // // // //   const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
// // // // //   const isExpired = expiryDate ? isPast(expiryDate) : false;
// // // // //   const isExpiringSoon = expiryDate
// // // // //     ? !isExpired &&
// // // // //       isFuture(expiryDate) &&
// // // // //       expiryDate <= addDays(new Date(), 30)
// // // // //     : false;

// // // // //   const getExpiryBadge = () => {
// // // // //     if (!expiryDate) return null;
// // // // //     if (isExpired) {
// // // // //       return (
// // // // //         <Badge
// // // // //           variant="outline"
// // // // //           className="text-xs border-red-300 text-red-600 bg-red-50"
// // // // //         >
// // // // //           <AlertCircle className="h-3 w-3 mr-1" />
// // // // //           Expired
// // // // //         </Badge>
// // // // //       );
// // // // //     }
// // // // //     if (isExpiringSoon) {
// // // // //       return (
// // // // //         <Badge
// // // // //           variant="outline"
// // // // //           className="text-xs border-orange-300 text-orange-600 bg-orange-50"
// // // // //         >
// // // // //           <AlertCircle className="h-3 w-3 mr-1" />
// // // // //           Expiring soon
// // // // //         </Badge>
// // // // //       );
// // // // //     }
// // // // //     return null;
// // // // //   };

// // // // //   const shareDocument = async () => {
// // // // //     const url = document.fileUrl;
// // // // //     if (navigator.share) {
// // // // //       try {
// // // // //         await navigator.share({ title: document.name, url });
// // // // //         return;
// // // // //       } catch {}
// // // // //     }
// // // // //     await navigator.clipboard.writeText(url);
// // // // //     toast.success("Link copied!");
// // // // //   };

// // // // //   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
// // // // //     e.preventDefault();
// // // // //     setIsUpdating(true);
// // // // //     const formData = new FormData(e.currentTarget);
// // // // //     const name = formData.get("name")?.toString().trim();
// // // // //     const type = formData.get("documentType")?.toString() as any;
// // // // //     const amountStr = formData
// // // // //       .get("negotiatedAmount")
// // // // //       ?.toString()
// // // // //       .replace(/,/g, "");
// // // // //     const expiry = formData.get("expiryDate")?.toString() || null;

// // // // //     if (!name || !type) {
// // // // //       toast.error("Name and type required");
// // // // //       setIsUpdating(false);
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       const updateData: any = { name, documentType: type };
// // // // //       if (expiry) updateData.expiryDate = expiry;
// // // // //       if (amountStr) {
// // // // //         const amount = parseFloat(amountStr);
// // // // //         if (!isNaN(amount) && amount >= 0) updateData.negotiatedAmount = amount;
// // // // //       }

// // // // //       const res = await documentService.updateDocument(
// // // // //         document._id.toString(),
// // // // //         updateData
// // // // //       );
// // // // //       if (res.data?.document) {
// // // // //         toast.success("Updated successfully");
// // // // //         onUpdate?.(res.data.document);
// // // // //         setIsEditOpen(false);
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       toast.error(err.response?.data?.message || "Update failed");
// // // // //     } finally {
// // // // //       setIsUpdating(false);
// // // // //     }
// // // // //   };

// // // // //   if (!canView) return null;

// // // // //   return (
// // // // //     <>
// // // // //       <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 border">
// // // // //         <CardHeader className="pb-3">
// // // // //           <div className="flex items-start justify-between gap-3">
// // // // //             <div className="flex-1 min-w-0 space-y-2">
// // // // //               <h3 className="font-semibold text-sm leading-tight line-clamp-2">
// // // // //                 {document.name}
// // // // //               </h3>
// // // // //               <div className="flex items-center gap-2 flex-wrap">
// // // // //                 <Badge
// // // // //                   variant="secondary"
// // // // //                   className={`text-xs font-medium px-2 py-0.5 ${getTypeBadge(
// // // // //                     document.documentType
// // // // //                   )}`}
// // // // //                 >
// // // // //                   {document.documentType}
// // // // //                 </Badge>
// // // // //                 {getExpiryBadge()}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </CardHeader>

// // // // //         <CardContent className="space-y-4">
// // // // //           {/* Metadata Grid */}
// // // // //           <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
// // // // //             <div className="flex items-center gap-2">
// // // // //               <Calendar className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
// // // // //               <span className="truncate">
// // // // //                 {formatDistanceToNow(new Date(document.createdAt), {
// // // // //                   addSuffix: true,
// // // // //                 })}
// // // // //               </span>
// // // // //             </div>
// // // // //             <div className="flex items-center gap-2">
// // // // //               <FileText className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
// // // // //               <span>{formatFileSize(document.sizeMB)}</span>
// // // // //             </div>

// // // // //             {document.startDate && (
// // // // //               <div className="flex items-center gap-2 col-span-2">
// // // // //                 <Calendar className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
// // // // //                 <span>
// // // // //                   Start:{" "}
// // // // //                   <span className="font-medium text-foreground">
// // // // //                     {formatDate(document.startDate)}
// // // // //                   </span>
// // // // //                 </span>
// // // // //               </div>
// // // // //             )}

// // // // //             {document.expiryDate && (
// // // // //               <div className="flex items-center gap-2 col-span-2">
// // // // //                 <Calendar className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
// // // // //                 <span>
// // // // //                   Expires:{" "}
// // // // //                   <span
// // // // //                     className={`font-medium ${
// // // // //                       isExpired
// // // // //                         ? "text-red-600"
// // // // //                         : isExpiringSoon
// // // // //                         ? "text-orange-600"
// // // // //                         : "text-foreground"
// // // // //                     }`}
// // // // //                   >
// // // // //                     {formatDate(document.expiryDate)}
// // // // //                   </span>
// // // // //                   {isExpired && " (Expired)"}
// // // // //                 </span>
// // // // //               </div>
// // // // //             )}

// // // // //             {document.negotiatedAmount != null && (
// // // // //               <div className="flex items-center gap-2 col-span-2 text-base font-semibold">
// // // // //                 <span className="text-xl">₦</span>
// // // // //                 <span>{formatAmount(document.negotiatedAmount)}</span>
// // // // //               </div>
// // // // //             )}

// // // // //             <div className="flex items-center gap-2 col-span-2">
// // // // //               <User className="h-4 w-4 text-muted-foreground/70 flex-shrink-0" />
// // // // //               <span className="truncate">
// // // // //                 {typeof document.uploadedBy === "string"
// // // // //                   ? document.uploadedBy
// // // // //                   : (document.uploadedBy as any)?.fullName || "Unknown"}
// // // // //               </span>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Action Buttons */}
// // // // //           <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-3 border-t">
// // // // //             {onView && (
// // // // //               <Button
// // // // //                 size="sm"
// // // // //                 variant="outline"
// // // // //                 className="h-9"
// // // // //                 onClick={onView}
// // // // //               >
// // // // //                 <Eye className="h-4 w-4" />
// // // // //               </Button>
// // // // //             )}
// // // // //             {onDownload && (
// // // // //               <Button
// // // // //                 size="sm"
// // // // //                 variant="secondary"
// // // // //                 className="h-9"
// // // // //                 onClick={onDownload}
// // // // //               >
// // // // //                 <Download className="h-4 w-4" />
// // // // //               </Button>
// // // // //             )}
// // // // //             <Button
// // // // //               size="sm"
// // // // //               variant="ghost"
// // // // //               className="h-9"
// // // // //               onClick={shareDocument}
// // // // //             >
// // // // //               <Share2 className="h-4 w-4" />
// // // // //             </Button>
// // // // //             {canEdit && (
// // // // //               <Button
// // // // //                 size="sm"
// // // // //                 variant="ghost"
// // // // //                 className="h-9"
// // // // //                 onClick={() => setIsEditOpen(true)}
// // // // //               >
// // // // //                 <Edit className="h-4 w-4" />
// // // // //               </Button>
// // // // //             )}
// // // // //             {canDelete && onDelete && (
// // // // //               <Button
// // // // //                 size="sm"
// // // // //                 variant="ghost"
// // // // //                 className="h-9 text-destructive hover:bg-destructive/10"
// // // // //                 onClick={onDelete}
// // // // //               >
// // // // //                 <Trash2 className="h-4 w-4" />
// // // // //               </Button>
// // // // //             )}
// // // // //           </div>
// // // // //         </CardContent>
// // // // //       </Card>

// // // // //       {/* Edit Modal */}
// // // // //       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
// // // // //         <DialogContent className="sm:max-w-md">
// // // // //           <DialogHeader>
// // // // //             <DialogTitle>Edit Document</DialogTitle>
// // // // //             <DialogDescription>
// // // // //               Update details for {document.name}
// // // // //             </DialogDescription>
// // // // //           </DialogHeader>
// // // // //           <form onSubmit={handleUpdate} className="space-y-4">
// // // // //             <div className="space-y-2">
// // // // //               <Label>Name</Label>
// // // // //               <Input
// // // // //                 name="name"
// // // // //                 defaultValue={document.name}
// // // // //                 required
// // // // //                 disabled={isUpdating}
// // // // //               />
// // // // //             </div>
// // // // //             <div className="space-y-2">
// // // // //               <Label>Type</Label>
// // // // //               <Select
// // // // //                 name="documentType"
// // // // //                 defaultValue={document.documentType}
// // // // //                 required
// // // // //               >
// // // // //                 <SelectTrigger>
// // // // //                   <SelectValue />
// // // // //                 </SelectTrigger>
// // // // //                 <SelectContent>
// // // // //                   {DOCUMENT_TYPES.map((t) => (
// // // // //                     <SelectItem key={t} value={t}>
// // // // //                       {t}
// // // // //                     </SelectItem>
// // // // //                   ))}
// // // // //                 </SelectContent>
// // // // //               </Select>
// // // // //             </div>
// // // // //             <div className="space-y-2">
// // // // //               <Label>Negotiated Amount (₦)</Label>
// // // // //               <Input
// // // // //                 name="negotiatedAmount"
// // // // //                 type="text"
// // // // //                 placeholder="e.g. 2500000"
// // // // //                 defaultValue={document.negotiatedAmount?.toString() || ""}
// // // // //                 disabled={isUpdating}
// // // // //               />
// // // // //             </div>
// // // // //             <div className="space-y-2">
// // // // //               <Label>Expiry Date</Label>
// // // // //               <Input
// // // // //                 name="expiryDate"
// // // // //                 type="date"
// // // // //                 defaultValue={document.expiryDate?.split("T")[0] || ""}
// // // // //                 disabled={isUpdating}
// // // // //               />
// // // // //             </div>
// // // // //             <DialogFooter>
// // // // //               <Button
// // // // //                 type="button"
// // // // //                 variant="outline"
// // // // //                 onClick={() => setIsEditOpen(false)}
// // // // //                 disabled={isUpdating}
// // // // //               >
// // // // //                 Cancel
// // // // //               </Button>
// // // // //               <Button type="submit" disabled={isUpdating}>
// // // // //                 {isUpdating ? "Saving..." : "Save Changes"}
// // // // //               </Button>
// // // // //             </DialogFooter>
// // // // //           </form>
// // // // //         </DialogContent>
// // // // //       </Dialog>
// // // // //     </>
// // // // //   );
// // // // // }

// // // // // export default DocumentCard;

// // // // // src/components/DocumentCard.tsx
// // // // import { Card, CardHeader } from "./ui/card";
// // // // import { Button } from "./ui/button";
// // // // import { Badge } from "./ui/badge";
// // // // import {
// // // //   MoreVertical,
// // // //   Download,
// // // //   Eye,
// // // //   Share2,
// // // //   Edit,
// // // //   Trash2,
// // // //   Calendar,
// // // //   User,
// // // //   FileText,
// // // //   AlertCircle,
// // // // } from "lucide-react";
// // // // import { formatDistanceToNow, format, isPast, addDays } from "date-fns";
// // // // import { useAuthContext } from "../contexts/AuthContext";
// // // // import type { Document } from "../types/index";
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogDescription,
// // // //   DialogHeader,
// // // //   DialogTitle,
// // // //   DialogFooter,
// // // // } from "./ui/dialog";
// // // // import {
// // // //   DropdownMenu,
// // // //   DropdownMenuContent,
// // // //   DropdownMenuItem,
// // // //   DropdownMenuTrigger,
// // // // } from "./ui/dropdown-menu";
// // // // import { Label } from "./ui/label";
// // // // import { Input } from "./ui/input";
// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue,
// // // // } from "./ui/select";
// // // // import { useState } from "react";
// // // // import { documentService } from "../lib/api";
// // // // import { toast } from "sonner";

// // // // interface DocumentCardProps {
// // // //   document: Document;
// // // //   canEditDocuments?: boolean;
// // // //   canDeleteDocuments?: boolean;
// // // //   onView?: () => void;
// // // //   onDownload?: () => void;
// // // //   onDelete?: () => void;
// // // //   onUpdate?: (doc: Document) => void;
// // // // }

// // // // const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// // // // export function DocumentCard({
// // // //   document,
// // // //   canEditDocuments: propCanEdit,
// // // //   canDeleteDocuments: propCanDelete,
// // // //   onView,
// // // //   onDownload,
// // // //   onDelete,
// // // //   onUpdate,
// // // // }: DocumentCardProps) {
// // // //   const { user } = useAuthContext();
// // // //   const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
// // // //   const permissions = user?.role?.permissions?.DocumentManagement || {};

// // // //   const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
// // // //   const canDelete =
// // // //     propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
// // // //   const canView = isSuperAdmin || permissions.viewDocuments;

// // // //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// // // //   const [isEditOpen, setIsEditOpen] = useState(false);
// // // //   const [isUpdating, setIsUpdating] = useState(false);

// // // //   const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
// // // //   const isExpired = expiryDate ? isPast(expiryDate) : false;
// // // //   const isExpiringSoon = expiryDate
// // // //     ? !isExpired && expiryDate <= addDays(new Date(), 30)
// // // //     : false;

// // // //   const formatDate = (date?: string) =>
// // // //     date ? format(new Date(date), "MMM d, yyyy") : "—";
// // // //   const formatAmount = (amount?: number) =>
// // // //     amount
// // // //       ? new Intl.NumberFormat("en-NG", {
// // // //           style: "currency",
// // // //           currency: "NGN",
// // // //           minimumFractionDigits: 0,
// // // //         }).format(amount)
// // // //       : "—";

// // // //   const shareDocument = async () => {
// // // //     if (navigator.share) {
// // // //       try {
// // // //         await navigator.share({ title: document.name, url: document.fileUrl });
// // // //         return;
// // // //       } catch {}
// // // //     }
// // // //     await navigator.clipboard.writeText(document.fileUrl);
// // // //     toast.success("Link copied!");
// // // //   };

// // // //   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
// // // //     e.preventDefault();
// // // //     setIsUpdating(true);
// // // //     const formData = new FormData(e.currentTarget);
// // // //     const name = formData.get("name")?.toString().trim();
// // // //     const type = formData.get("documentType")?.toString();
// // // //     const amountStr = formData
// // // //       .get("negotiatedAmount")
// // // //       ?.toString()
// // // //       .replace(/,/g, "");
// // // //     const expiry = formData.get("expiryDate")?.toString() || null;

// // // //     if (!name || !type) return toast.error("Name and type required");

// // // //     try {
// // // //       const updateData: any = { name, documentType: type };
// // // //       if (expiry) updateData.expiryDate = expiry;
// // // //       if (amountStr) {
// // // //         const amount = parseFloat(amountStr);
// // // //         if (!isNaN(amount) && amount >= 0) updateData.negotiatedAmount = amount;
// // // //       }

// // // //       const res = await documentService.updateDocument(
// // // //         document._id.toString(),
// // // //         updateData
// // // //       );
// // // //       if (res.data?.document) {
// // // //         toast.success("Document updated");
// // // //         onUpdate?.(res.data.document);
// // // //         setIsEditOpen(false);
// // // //         setIsDetailsOpen(false);
// // // //       }
// // // //     } catch (err: any) {
// // // //       toast.error(err.response?.data?.message || "Update failed");
// // // //     } finally {
// // // //       setIsUpdating(false);
// // // //     }
// // // //   };

// // // //   if (!canView) return null;

// // // //   return (
// // // //     <>
// // // //       {/* Modern Minimal Card — Only Name */}
// // // //       <Card
// // // //         className="group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20"
// // // //         onClick={() => setIsDetailsOpen(true)}
// // // //       >
// // // //         <CardHeader className="pb-3">
// // // //           <div className="flex items-center justify-between">
// // // //             <div className="flex items-center gap-3 flex-1 min-w-0">
// // // //               <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
// // // //               <div className="min-w-0">
// // // //                 <h3 className="font-medium text-sm truncate">
// // // //                   {document.name}
// // // //                 </h3>
// // // //                 <p className="text-xs text-muted-foreground">
// // // //                   {document.documentType} •{" "}
// // // //                   {formatDistanceToNow(new Date(document.createdAt), {
// // // //                     addSuffix: true,
// // // //                   })}
// // // //                 </p>
// // // //               </div>
// // // //             </div>

// // // //             {/* Three Dots Menu */}
// // // //             <DropdownMenu>
// // // //               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
// // // //                 <Button
// // // //                   variant="ghost"
// // // //                   size="icon"
// // // //                   className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
// // // //                 >
// // // //                   <MoreVertical className="h-4 w-4" />
// // // //                 </Button>
// // // //               </DropdownMenuTrigger>
// // // //               <DropdownMenuContent align="end">
// // // //                 {onView && (
// // // //                   <DropdownMenuItem
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation();
// // // //                       onView();
// // // //                     }}
// // // //                   >
// // // //                     <Eye className="h-4 w-4 mr-2" /> View
// // // //                   </DropdownMenuItem>
// // // //                 )}
// // // //                 {onDownload && (
// // // //                   <DropdownMenuItem
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation();
// // // //                       onDownload();
// // // //                     }}
// // // //                   >
// // // //                     <Download className="h-4 w-4 mr-2" /> Download
// // // //                   </DropdownMenuItem>
// // // //                 )}
// // // //                 <DropdownMenuItem
// // // //                   onClick={(e) => {
// // // //                     e.stopPropagation();
// // // //                     shareDocument();
// // // //                   }}
// // // //                 >
// // // //                   <Share2 className="h-4 w-4 mr-2" /> Share
// // // //                 </DropdownMenuItem>
// // // //                 {canEdit && (
// // // //                   <DropdownMenuItem
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation();
// // // //                       setIsEditOpen(true);
// // // //                       setIsDetailsOpen(false);
// // // //                     }}
// // // //                   >
// // // //                     <Edit className="h-4 w-4 mr-2" /> Edit
// // // //                   </DropdownMenuItem>
// // // //                 )}
// // // //                 {canDelete && onDelete && (
// // // //                   <DropdownMenuItem
// // // //                     className="text-destructive"
// // // //                     onClick={(e) => {
// // // //                       e.stopPropagation();
// // // //                       onDelete();
// // // //                     }}
// // // //                   >
// // // //                     <Trash2 className="h-4 w-4 mr-2" /> Delete
// // // //                   </DropdownMenuItem>
// // // //                 )}
// // // //               </DropdownMenuContent>
// // // //             </DropdownMenu>
// // // //           </div>
// // // //         </CardHeader>
// // // //       </Card>

// // // //       {/* Full Details Modal */}
// // // //       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
// // // //         <DialogContent className="sm:max-w-2xl">
// // // //           <DialogHeader>
// // // //             <DialogTitle className="text-xl">{document.name}</DialogTitle>
// // // //             <DialogDescription>
// // // //               <Badge variant="secondary" className="mt-2">
// // // //                 {document.documentType}
// // // //               </Badge>
// // // //               {isExpired && (
// // // //                 <Badge
// // // //                   variant="outline"
// // // //                   className="ml-2 text-red-600 border-red-300"
// // // //                 >
// // // //                   Expired
// // // //                 </Badge>
// // // //               )}
// // // //               {isExpiringSoon && !isExpired && (
// // // //                 <Badge
// // // //                   variant="outline"
// // // //                   className="ml-2 text-orange-600 border-orange-300"
// // // //                 >
// // // //                   Expiring Soon
// // // //                 </Badge>
// // // //               )}
// // // //             </DialogDescription>
// // // //           </DialogHeader>

// // // //           <div className="space-y-6 py-4">
// // // //             <div className="grid grid-cols-2 gap-4 text-sm">
// // // //               <div>
// // // //                 <Label className="text-muted-foreground">Uploaded By</Label>
// // // //                 <p className="font-medium">
// // // //                   {typeof document.uploadedBy === "string"
// // // //                     ? document.uploadedBy
// // // //                      || "Unknown"}
// // // //                 </p>
// // // //               </div>
// // // //               <div>
// // // //                 <Label className="text-muted-foreground">Uploaded</Label>
// // // //                 <p className="font-medium">
// // // //                   {formatDistanceToNow(new Date(document.createdAt), {
// // // //                     addSuffix: true,
// // // //                   })}
// // // //                 </p>
// // // //               </div>
// // // //               {document.startDate && (
// // // //                 <div>
// // // //                   <Label className="text-muted-foreground">Start Date</Label>
// // // //                   <p className="font-medium">
// // // //                     {formatDate(document.startDate)}
// // // //                   </p>
// // // //                 </div>
// // // //               )}
// // // //               {document.expiryDate && (
// // // //                 <div>
// // // //                   <Label className="text-muted-foreground">Expiry Date</Label>
// // // //                   <p
// // // //                     className={`font-medium ${
// // // //                       isExpired
// // // //                         ? "text-red-600"
// // // //                         : isExpiringSoon
// // // //                         ? "text-orange-600"
// // // //                         : ""
// // // //                     }`}
// // // //                   >
// // // //                     {formatDate(document.expiryDate)}
// // // //                   </p>
// // // //                 </div>
// // // //               )}
// // // //               {document.negotiatedAmount != null && (
// // // //                 <div>
// // // //                   <Label className="text-muted-foreground">
// // // //                     Negotiated Amount
// // // //                   </Label>
// // // //                   <p className="font-medium text-lg">
// // // //                     {formatAmount(document.negotiatedAmount)}
// // // //                   </p>
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             <div className="flex gap-3">
// // // //               <Button onClick={onView} className="flex-1">
// // // //                 <Eye className="h-4 w-4 mr-2" /> View Document
// // // //               </Button>
// // // //               <Button variant="secondary" onClick={onDownload}>
// // // //                 <Download className="h-4 w-4 mr-2" /> Download
// // // //               </Button>
// // // //               <Button variant="outline" onClick={shareDocument}>
// // // //                 <Share2 className="h-4 w-4" />
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </DialogContent>
// // // //       </Dialog>

// // // //       {/* Edit Modal */}
// // // //       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
// // // //         <DialogContent className="sm:max-w-md">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Edit Document</DialogTitle>
// // // //           </DialogHeader>
// // // //           <form onSubmit={handleUpdate} className="space-y-4">
// // // //             <div className="space-y-2">
// // // //               <Label>Name</Label>
// // // //               <Input
// // // //                 name="name"
// // // //                 defaultValue={document.name}
// // // //                 required
// // // //                 disabled={isUpdating}
// // // //               />
// // // //             </div>
// // // //             <div className="space-y-2">
// // // //               <Label>Type</Label>
// // // //               <Select name="documentType" defaultValue={document.documentType}>
// // // //                 <SelectTrigger>
// // // //                   <SelectValue />
// // // //                 </SelectTrigger>
// // // //                 <SelectContent>
// // // //                   {DOCUMENT_TYPES.map((t) => (
// // // //                     <SelectItem key={t} value={t}>
// // // //                       {t}
// // // //                     </SelectItem>
// // // //                   ))}
// // // //                 </SelectContent>
// // // //               </Select>
// // // //             </div>
// // // //             <div className="space-y-2">
// // // //               <Label>Negotiated Amount (₦)</Label>
// // // //               <Input
// // // //                 name="negotiatedAmount"
// // // //                 type="text"
// // // //                 defaultValue={document.negotiatedAmount?.toString() || ""}
// // // //                 disabled={isUpdating}
// // // //               />
// // // //             </div>
// // // //             <div className="space-y-2">
// // // //               <Label>Expiry Date</Label>
// // // //               <Input
// // // //                 name="expiryDate"
// // // //                 type="date"
// // // //                 defaultValue={document.expiryDate?.split("T")[0] || ""}
// // // //                 disabled={isUpdating}
// // // //               />
// // // //             </div>
// // // //             <DialogFooter>
// // // //               <Button
// // // //                 type="button"
// // // //                 variant="outline"
// // // //                 onClick={() => setIsEditOpen(false)}
// // // //                 disabled={isUpdating}
// // // //               >
// // // //                 Cancel
// // // //               </Button>
// // // //               <Button type="submit" disabled={isUpdating}>
// // // //                 {isUpdating ? "Saving..." : "Save Changes"}
// // // //               </Button>
// // // //             </DialogFooter>
// // // //           </form>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </>
// // // //   );
// // // // }

// // // // export default DocumentCard;

// // // // src/components/DocumentCard.tsx
// // // import { Card, CardHeader } from "./ui/card";
// // // import { Button } from "./ui/button";
// // // import { Badge } from "./ui/badge";
// // // import {
// // //   MoreVertical,
// // //   Download,
// // //   Eye,
// // //   Share2,
// // //   Edit,
// // //   Trash2,
// // //   FileText,
// // //   AlertTriangle,
// // //   CalendarDays,
// // // } from "lucide-react";
// // // import { formatDistanceToNow, format, isPast, addDays } from "date-fns";
// // // import { useAuthContext } from "../contexts/AuthContext";
// // // import type { Document } from "../types/index";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogHeader,
// // //   DialogTitle,
// // //   DialogFooter,
// // // } from "./ui/dialog";
// // // import {
// // //   DropdownMenu,
// // //   DropdownMenuContent,
// // //   DropdownMenuItem,
// // //   DropdownMenuTrigger,
// // // } from "./ui/dropdown-menu";
// // // import { Label } from "./ui/label";
// // // import { Input } from "./ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "./ui/select";
// // // import { useState } from "react";
// // // import { documentService } from "../lib/api";
// // // import { toast } from "sonner";

// // // interface DocumentCardProps {
// // //   document: Document;
// // //   canEditDocuments?: boolean;
// // //   canDeleteDocuments?: boolean;
// // //   onView?: () => void;
// // //   onDownload?: () => void;
// // //   onDelete?: () => void;
// // //   onUpdate?: (doc: Document) => void;
// // // }

// // // const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// // // export function DocumentCard({
// // //   document,
// // //   canEditDocuments: propCanEdit,
// // //   canDeleteDocuments: propCanDelete,
// // //   onView,
// // //   onDownload,
// // //   onDelete,
// // //   onUpdate,
// // // }: DocumentCardProps) {
// // //   const { user } = useAuthContext();
// // //   const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
// // //   const permissions = user?.role?.permissions?.DocumentManagement || {};

// // //   const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
// // //   const canDelete =
// // //     propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
// // //   const canView = isSuperAdmin || permissions.viewDocuments;

// // //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// // //   const [isEditOpen, setIsEditOpen] = useState(false);
// // //   const [isUpdating, setIsUpdating] = useState(false);

// // //   // Expiry Logic with Clear Status
// // //   const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
// // //   const isExpired = expiryDate ? isPast(expiryDate) : false;
// // //   const isExpiringSoon = expiryDate
// // //     ? !isExpired && expiryDate <= addDays(new Date(), 30)
// // //     : false;

// // //   const getExpiryStatus = () => {
// // //     if (!expiryDate) return null;
// // //     if (isExpired) {
// // //       return {
// // //         label: "Expired",
// // //         color: "bg-red-100 text-red-700 border-red-300",
// // //         icon: AlertTriangle,
// // //       };
// // //     }
// // //     if (isExpiringSoon) {
// // //       return {
// // //         label: "Expiring Soon",
// // //         color: "bg-orange-100 text-orange-700 border-orange-300",
// // //         icon: CalendarDays,
// // //       };
// // //     }
// // //     return null;
// // //   };

// // //   const expiryStatus = getExpiryStatus();

// // //   const formatDate = (date?: string) =>
// // //     date ? format(new Date(date), "MMM d, yyyy") : "—";
// // //   const formatAmount = (amount?: number) =>
// // //     amount
// // //       ? new Intl.NumberFormat("en-NG", {
// // //           style: "currency",
// // //           currency: "NGN",
// // //           minimumFractionDigits: 0,
// // //         }).format(amount)
// // //       : "—";

// // //   const shareDocument = async () => {
// // //     if (navigator.share) {
// // //       try {
// // //         await navigator.share({ title: document.name, url: document.fileUrl });
// // //         return;
// // //       } catch {}
// // //     }
// // //     await navigator.clipboard.writeText(document.fileUrl);
// // //     toast.success("Link copied!");
// // //   };

// // //   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
// // //     e.preventDefault();
// // //     setIsUpdating(true);
// // //     const formData = new FormData(e.currentTarget);
// // //     const name = formData.get("name")?.toString().trim();
// // //     const type = formData.get("documentType")?.toString();
// // //     const amountStr = formData
// // //       .get("negotiatedAmount")
// // //       ?.toString()
// // //       .replace(/,/g, "");
// // //     const expiry = formData.get("expiryDate")?.toString() || null;

// // //     if (!name || !type) return toast.error("Name and type required");

// // //     try {
// // //       const updateData: any = { name, documentType: type };
// // //       if (expiry) updateData.expiryDate = expiry;
// // //       if (amountStr) {
// // //         const amount = parseFloat(amountStr);
// // //         if (!isNaN(amount) && amount >= 0) updateData.negotiatedAmount = amount;
// // //       }

// // //       const res = await documentService.updateDocument(
// // //         document._id.toString(),
// // //         updateData
// // //       );
// // //       if (res.data?.document) {
// // //         toast.success("Document updated");
// // //         onUpdate?.(res.data.document);
// // //         setIsEditOpen(false);
// // //         setIsDetailsOpen(false);
// // //       }
// // //     } catch (err: any) {
// // //       toast.error(err.response?.data?.message || "Update failed");
// // //     } finally {
// // //       setIsUpdating(false);
// // //     }
// // //   };

// // //   if (!canView) return null;

// // //   return (
// // //     <>
// // //       {/* Modern Clean Card */}
// // //       <Card
// // //         className={`group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20 ${
// // //           isExpired ? "opacity-75" : ""
// // //         }`}
// // //         onClick={() => setIsDetailsOpen(true)}
// // //       >
// // //         <CardHeader className="pb-3">
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center gap-3 flex-1 min-w-0">
// // //               <div className="relative">
// // //                 <FileText
// // //                   className={`h-9 w-9 ${
// // //                     isExpired ? "text-red-500" : "text-muted-foreground"
// // //                   }`}
// // //                 />
// // //                 {isExpired && (
// // //                   <div className="absolute -top-1 -right-1">
// // //                     <AlertTriangle className="h-4 w-4 text-red-600" />
// // //                   </div>
// // //                 )}
// // //               </div>
// // //               <div className="min-w-0">
// // //                 <h3
// // //                   className={`font-medium text-sm truncate ${
// // //                     isExpired ? "text-red-700" : ""
// // //                   }`}
// // //                 >
// // //                   {document.name}
// // //                 </h3>
// // //                 <div className="flex items-center gap-2 mt-1">
// // //                   <Badge variant="secondary" className="text-xs">
// // //                     {document.documentType}
// // //                   </Badge>
// // //                   {expiryStatus && (
// // //                     <Badge
// // //                       variant="outline"
// // //                       className={`text-xs ${expiryStatus.color}`}
// // //                     >
// // //                       <expiryStatus.icon className="h-3 w-3 mr-1" />
// // //                       {expiryStatus.label}
// // //                     </Badge>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Three Dots Menu */}
// // //             <DropdownMenu>
// // //               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
// // //                 <Button
// // //                   variant="ghost"
// // //                   size="icon"
// // //                   className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
// // //                 >
// // //                   <MoreVertical className="h-4 w-4" />
// // //                 </Button>
// // //               </DropdownMenuTrigger>
// // //               <DropdownMenuContent align="end">
// // //                 {onView && (
// // //                   <DropdownMenuItem
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       onView();
// // //                     }}
// // //                   >
// // //                     <Eye className="h-4 w-4 mr-2" /> View
// // //                   </DropdownMenuItem>
// // //                 )}
// // //                 {onDownload && (
// // //                   <DropdownMenuItem
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       onDownload();
// // //                     }}
// // //                   >
// // //                     <Download className="h-4 w-4 mr-2" /> Download
// // //                   </DropdownMenuItem>
// // //                 )}
// // //                 <DropdownMenuItem
// // //                   onClick={(e) => {
// // //                     e.stopPropagation();
// // //                     shareDocument();
// // //                   }}
// // //                 >
// // //                   <Share2 className="h-4 w-4 mr-2" /> Share
// // //                 </DropdownMenuItem>
// // //                 {canEdit && (
// // //                   <DropdownMenuItem
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       setIsEditOpen(true);
// // //                       setIsDetailsOpen(false);
// // //                     }}
// // //                   >
// // //                     <Edit className="h-4 w-4 mr-2" /> Edit
// // //                   </DropdownMenuItem>
// // //                 )}
// // //                 {canDelete && onDelete && (
// // //                   <DropdownMenuItem
// // //                     className="text-destructive"
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       onDelete();
// // //                     }}
// // //                   >
// // //                     <Trash2 className="h-4 w-4 mr-2" /> Delete
// // //                   </DropdownMenuItem>
// // //                 )}
// // //               </DropdownMenuContent>
// // //             </DropdownMenu>
// // //           </div>
// // //         </CardHeader>
// // //       </Card>

// // //       {/* Details Modal */}
// // //       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
// // //         <DialogContent className="sm:max-w-2xl">
// // //           <DialogHeader>
// // //             <DialogTitle className="text-2xl flex items-center gap-3">
// // //               <FileText className="h-8 w-8" />
// // //               {document.name}
// // //             </DialogTitle>
// // //             <DialogDescription className="flex items-center gap-3 mt-2">
// // //               <Badge variant="secondary">{document.documentType}</Badge>
// // //               {isExpired && (
// // //                 <Badge
// // //                   variant="outline"
// // //                   className="bg-red-100 text-red-700 border-red-300"
// // //                 >
// // //                   <AlertTriangle className="h-3 w-3 mr-1" />
// // //                   Expired
// // //                 </Badge>
// // //               )}
// // //               {isExpiringSoon && !isExpired && (
// // //                 <Badge
// // //                   variant="outline"
// // //                   className="bg-orange-100 text-orange-700 border-orange-300"
// // //                 >
// // //                   <CalendarDays className="h-3 w-3 mr-1" />
// // //                   Expiring Soon
// // //                 </Badge>
// // //               )}
// // //             </DialogDescription>
// // //           </DialogHeader>

// // //           <div className="space-y-6 py-4">
// // //             <div className="grid grid-cols-2 gap-6 text-sm">
// // //               <div>
// // //                 <Label className="text-muted-foreground">Uploaded By</Label>
// // //                 <p className="font-medium">
// // //                   {typeof document.uploadedBy === "string"
// // //                     ? document.uploadedBy
// // //                      || "Unknown"}
// // //                 </p>
// // //               </div>
// // //               <div>
// // //                 <Label className="text-muted-foreground">Uploaded</Label>
// // //                 <p className="font-medium">
// // //                   {formatDistanceToNow(new Date(document.createdAt), {
// // //                     addSuffix: true,
// // //                   })}
// // //                 </p>
// // //               </div>
// // //               {document.startDate && (
// // //                 <div>
// // //                   <Label className="text-muted-foreground">Start Date</Label>
// // //                   <p className="font-medium">
// // //                     {formatDate(document.startDate)}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               {document.expiryDate && (
// // //                 <div>
// // //                   <Label className="text-muted-foreground">Expiry Date</Label>
// // //                   <p
// // //                     className={`font-medium text-lg ${
// // //                       isExpired
// // //                         ? "text-red-600"
// // //                         : isExpiringSoon
// // //                         ? "text-orange-600"
// // //                         : ""
// // //                     }`}
// // //                   >
// // //                     {formatDate(document.expiryDate)}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               {document.negotiatedAmount != null && (
// // //                 <div>
// // //                   <Label className="text-muted-foreground">
// // //                     Negotiated Amount
// // //                   </Label>
// // //                   <p className="font-medium text-xl">
// // //                     {formatAmount(document.negotiatedAmount)}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="flex gap-3">
// // //               <Button onClick={onView} className="flex-1">
// // //                 <Eye className="h-4 w-4 mr-2" /> View Document
// // //               </Button>
// // //               <Button variant="secondary" onClick={onDownload}>
// // //                 <Download className="h-4 w-4 mr-2" /> Download
// // //               </Button>
// // //               <Button variant="outline" onClick={shareDocument}>
// // //                 <Share2 className="h-4 w-4" />
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </DialogContent>
// // //       </Dialog>

// // //       {/* Edit Modal */}
// // //       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
// // //         <DialogContent className="sm:max-w-md">
// // //           <DialogHeader>
// // //             <DialogTitle>Edit Document</DialogTitle>
// // //           </DialogHeader>
// // //           <form onSubmit={handleUpdate} className="space-y-4">
// // //             <div className="space-y-2">
// // //               <Label>Name</Label>
// // //               <Input
// // //                 name="name"
// // //                 defaultValue={document.name}
// // //                 required
// // //                 disabled={isUpdating}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label>Type</Label>
// // //               <Select name="documentType" defaultValue={document.documentType}>
// // //                 <SelectTrigger>
// // //                   <SelectValue />
// // //                 </SelectTrigger>
// // //                 <SelectContent>
// // //                   {DOCUMENT_TYPES.map((t) => (
// // //                     <SelectItem key={t} value={t}>
// // //                       {t}
// // //                     </SelectItem>
// // //                   ))}
// // //                 </SelectContent>
// // //               </Select>
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label>Negotiated Amount (₦)</Label>
// // //               <Input
// // //                 name="negotiatedAmount"
// // //                 type="text"
// // //                 defaultValue={document.negotiatedAmount?.toString() || ""}
// // //                 disabled={isUpdating}
// // //               />
// // //             </div>
// // //             <div className="space-y-2">
// // //               <Label>Expiry Date</Label>
// // //               <Input
// // //                 name="expiryDate"
// // //                 type="date"
// // //                 defaultValue={document.expiryDate?.split("T")[0] || ""}
// // //                 disabled={isUpdating}
// // //               />
// // //             </div>
// // //             <DialogFooter>
// // //               <Button
// // //                 type="button"
// // //                 variant="outline"
// // //                 onClick={() => setIsEditOpen(false)}
// // //                 disabled={isUpdating}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //               <Button type="submit" disabled={isUpdating}>
// // //                 {isUpdating ? "Saving..." : "Save Changes"}
// // //               </Button>
// // //             </DialogFooter>
// // //           </form>
// // //         </DialogContent>
// // //       </Dialog>
// // //     </>
// // //   );
// // // }

// // // export default DocumentCard;

// // // src/components/DocumentCard.tsx
// // import { Card, CardHeader } from "./ui/card";
// // import { Button } from "./ui/button";
// // import { Badge } from "./ui/badge";
// // import {
// //   MoreVertical,
// //   Download,
// //   Eye,
// //   Share2,
// //   Edit,
// //   Trash2,
// //   FileText,
// //   AlertTriangle,
// //   CalendarDays,
// // } from "lucide-react";
// // import { formatDistanceToNow, format, isPast, addDays } from "date-fns";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import type { Document } from "../types/index";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from "./ui/dialog";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "./ui/dropdown-menu";
// // import { Label } from "./ui/label";
// // import { Input } from "./ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "./ui/select";
// // import { useState } from "react";
// // import { documentService } from "../lib/api";
// // import { toast } from "sonner";

// // interface DocumentCardProps {
// //   document: Document;
// //   canEditDocuments?: boolean;
// //   canDeleteDocuments?: boolean;
// //   onView?: () => void;
// //   onDownload?: () => void;
// //   onDelete?: () => void;
// //   onUpdate?: (doc: Document) => void;
// // }

// // const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// // export function DocumentCard({
// //   document,
// //   canEditDocuments: propCanEdit,
// //   canDeleteDocuments: propCanDelete,
// //   onView,
// //   onDownload,
// //   onDelete,
// //   onUpdate,
// // }: DocumentCardProps) {
// //   const { user } = useAuthContext();
// //   const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
// //   const permissions = user?.role?.permissions?.DocumentManagement || {};

// //   const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
// //   const canDelete =
// //     propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
// //   const canView = isSuperAdmin || permissions.viewDocuments;

// //   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
// //   const [isEditOpen, setIsEditOpen] = useState(false);
// //   const [isUpdating, setIsUpdating] = useState(false);

// //   // Expiry Logic with Clear Status
// //   const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
// //   const isExpired = expiryDate ? isPast(expiryDate) : false;
// //   const isExpiringSoon = expiryDate
// //     ? !isExpired && expiryDate <= addDays(new Date(), 30)
// //     : false;

// //   const getExpiryStatus = () => {
// //     if (!expiryDate) return null;
// //     if (isExpired) {
// //       return {
// //         label: "Expired",
// //         color: "bg-red-100 text-red-700 border-red-300",
// //         icon: AlertTriangle,
// //       };
// //     }
// //     if (isExpiringSoon) {
// //       return {
// //         label: "Expiring Soon",
// //         color: "bg-orange-100 text-orange-700 border-orange-300",
// //         icon: CalendarDays,
// //       };
// //     }
// //     return null;
// //   };

// //   const expiryStatus = getExpiryStatus();

// //   const formatDate = (date?: string) =>
// //     date ? format(new Date(date), "MMM d, yyyy") : "—";
// //   const formatAmount = (amount?: number) =>
// //     amount
// //       ? new Intl.NumberFormat("en-NG", {
// //           style: "currency",
// //           currency: "NGN",
// //           minimumFractionDigits: 0,
// //         }).format(amount)
// //       : "—";

// //   const shareDocument = async () => {
// //     if (navigator.share) {
// //       try {
// //         await navigator.share({ title: document.name, url: document.fileUrl });
// //         return;
// //       } catch {}
// //     }
// //     await navigator.clipboard.writeText(document.fileUrl);
// //     toast.success("Link copied!");
// //   };

// //   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     setIsUpdating(true);
// //     const formData = new FormData(e.currentTarget);
// //     const name = formData.get("name")?.toString().trim();
// //     const type = formData.get("documentType")?.toString();
// //     const amountStr = formData
// //       .get("negotiatedAmount")
// //       ?.toString()
// //       .replace(/,/g, "");
// //     const expiry = formData.get("expiryDate")?.toString() || null;

// //     if (!name || !type) return toast.error("Name and type required");

// //     try {
// //       const updateData: any = { name, documentType: type };
// //       if (expiry) updateData.expiryDate = expiry;
// //       if (amountStr) {
// //         const amount = parseFloat(amountStr);
// //         if (!isNaN(amount) && amount >= 0) updateData.negotiatedAmount = amount;
// //       }

// //       const res = await documentService.updateDocument(
// //         document._id.toString(),
// //         updateData
// //       );
// //       if (res.data?.document) {
// //         toast.success("Document updated");
// //         onUpdate?.(res.data.document);
// //         setIsEditOpen(false);
// //         setIsDetailsOpen(false);
// //       }
// //     } catch (err: any) {
// //       toast.error(err.response?.data?.message || "Update failed");
// //     } finally {
// //       setIsUpdating(false);
// //     }
// //   };

// //   if (!canView) return null;

// //   return (
// //     <>
// //       {/* Modern Clean Card */}
// //       <Card
// //         className={`group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20 ${
// //           isExpired ? "opacity-75" : ""
// //         }`}
// //         onClick={() => setIsDetailsOpen(true)}
// //       >
// //         <CardHeader className="pb-3">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center gap-3 flex-1 min-w-0">
// //               <div className="relative">
// //                 <FileText
// //                   className={`h-9 w-9 ${
// //                     isExpired ? "text-red-500" : "text-muted-foreground"
// //                   }`}
// //                 />
// //                 {isExpired && (
// //                   <div className="absolute -top-1 -right-1">
// //                     <AlertTriangle className="h-4 w-4 text-red-600" />
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="min-w-0">
// //                 <h3
// //                   className={`font-medium text-sm truncate ${
// //                     isExpired ? "text-red-700" : ""
// //                   }`}
// //                 >
// //                   {document.name}
// //                 </h3>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   <Badge variant="secondary" className="text-xs">
// //                     {document.documentType}
// //                   </Badge>
// //                   {expiryStatus && (
// //                     <Badge
// //                       variant="outline"
// //                       className={`text-xs ${expiryStatus.color}`}
// //                     >
// //                       <expiryStatus.icon className="h-3 w-3 mr-1" />
// //                       {expiryStatus.label}
// //                     </Badge>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Three Dots Menu */}
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
// //                 <Button
// //                   variant="ghost"
// //                   size="icon"
// //                   className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
// //                 >
// //                   <MoreVertical className="h-4 w-4" />
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent align="end">
// //                 {onView && (
// //                   <DropdownMenuItem
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       onView();
// //                     }}
// //                   >
// //                     <Eye className="h-4 w-4 mr-2" /> View
// //                   </DropdownMenuItem>
// //                 )}
// //                 {onDownload && (
// //                   <DropdownMenuItem
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       onDownload();
// //                     }}
// //                   >
// //                     <Download className="h-4 w-4 mr-2" /> Download
// //                   </DropdownMenuItem>
// //                 )}
// //                 <DropdownMenuItem
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     shareDocument();
// //                   }}
// //                 >
// //                   <Share2 className="h-4 w-4 mr-2" /> Share
// //                 </DropdownMenuItem>
// //                 {canEdit && (
// //                   <DropdownMenuItem
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       setIsEditOpen(true);
// //                       setIsDetailsOpen(false);
// //                     }}
// //                   >
// //                     <Edit className="h-4 w-4 mr-2" /> Edit
// //                   </DropdownMenuItem>
// //                 )}
// //                 {canDelete && onDelete && (
// //                   <DropdownMenuItem
// //                     className="text-destructive"
// //                     onClick={(e) => {
// //                       e.stopPropagation();
// //                       onDelete();
// //                     }}
// //                   >
// //                     <Trash2 className="h-4 w-4 mr-2" /> Delete
// //                   </DropdownMenuItem>
// //                 )}
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //           </div>
// //         </CardHeader>
// //       </Card>

// //       {/* Details Modal */}
// //       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
// //         <DialogContent className="sm:max-w-2xl">
// //           <DialogHeader>
// //             <DialogTitle className="text-2xl flex items-center gap-3">
// //               <FileText className="h-8 w-8" />
// //               {document.name}
// //             </DialogTitle>
// //             <DialogDescription className="flex items-center gap-3 mt-2">
// //               <Badge variant="secondary">{document.documentType}</Badge>
// //               {isExpired && (
// //                 <Badge
// //                   variant="outline"
// //                   className="bg-red-100 text-red-700 border-red-300"
// //                 >
// //                   <AlertTriangle className="h-3 w-3 mr-1" />
// //                   Expired
// //                 </Badge>
// //               )}
// //               {isExpiringSoon && !isExpired && (
// //                 <Badge
// //                   variant="outline"
// //                   className="bg-orange-100 text-orange-700 border-orange-300"
// //                 >
// //                   <CalendarDays className="h-3 w-3 mr-1" />
// //                   Expiring Soon
// //                 </Badge>
// //               )}
// //             </DialogDescription>
// //           </DialogHeader>

// //           <div className="space-y-6 py-4">
// //             <div className="grid grid-cols-2 gap-6 text-sm">
// //               <div>
// //                 <Label className="text-muted-foreground">Uploaded By</Label>
// //                 <p className="font-medium">
// //                   {typeof document.uploadedBy === "string"
// //                     ? document.uploadedBy || "Unknown"
// //                     : "Unknown"}
// //                 </p>
// //               </div>
// //               <div>
// //                 <Label className="text-muted-foreground">Uploaded</Label>
// //                 <p className="font-medium">
// //                   {formatDistanceToNow(new Date(document.createdAt), {
// //                     addSuffix: true,
// //                   })}
// //                 </p>
// //               </div>
// //               {document.startDate && (
// //                 <div>
// //                   <Label className="text-muted-foreground">Start Date</Label>
// //                   <p className="font-medium">
// //                     {formatDate(document.startDate)}
// //                   </p>
// //                 </div>
// //               )}
// //               {document.expiryDate && (
// //                 <div>
// //                   <Label className="text-muted-foreground">Expiry Date</Label>
// //                   <p
// //                     className={`font-medium text-lg ${
// //                       isExpired
// //                         ? "text-red-600"
// //                         : isExpiringSoon
// //                         ? "text-orange-600"
// //                         : ""
// //                     }`}
// //                   >
// //                     {formatDate(document.expiryDate)}
// //                   </p>
// //                 </div>
// //               )}
// //               {document.negotiatedAmount != null && (
// //                 <div>
// //                   <Label className="text-muted-foreground">
// //                     Negotiated Amount
// //                   </Label>
// //                   <p className="font-medium text-xl">
// //                     {formatAmount(document.negotiatedAmount)}
// //                   </p>
// //                 </div>
// //               )}
// //             </div>

// //             <div className="flex gap-3">
// //               <Button onClick={onView} className="flex-1">
// //                 <Eye className="h-4 w-4 mr-2" /> View Document
// //               </Button>
// //               <Button variant="secondary" onClick={onDownload}>
// //                 <Download className="h-4 w-4 mr-2" /> Download
// //               </Button>
// //               <Button variant="outline" onClick={shareDocument}>
// //                 <Share2 className="h-4 w-4" />
// //               </Button>
// //             </div>
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Edit Modal */}
// //       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
// //         <DialogContent className="sm:max-w-md">
// //           <DialogHeader>
// //             <DialogTitle>Edit Document</DialogTitle>
// //           </DialogHeader>
// //           <form onSubmit={handleUpdate} className="space-y-4">
// //             <div className="space-y-2">
// //               <Label>Name</Label>
// //               <Input
// //                 name="name"
// //                 defaultValue={document.name}
// //                 required
// //                 disabled={isUpdating}
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label>Type</Label>
// //               <Select name="documentType" defaultValue={document.documentType}>
// //                 <SelectTrigger>
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   {DOCUMENT_TYPES.map((t) => (
// //                     <SelectItem key={t} value={t}>
// //                       {t}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="space-y-2">
// //               <Label>Negotiated Amount (₦)</Label>
// //               <Input
// //                 name="negotiatedAmount"
// //                 type="text"
// //                 defaultValue={document.negotiatedAmount?.toString() || ""}
// //                 disabled={isUpdating}
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label>Expiry Date</Label>
// //               <Input
// //                 name="expiryDate"
// //                 type="date"
// //                 defaultValue={document.expiryDate?.split("T")[0] || ""}
// //                 disabled={isUpdating}
// //               />
// //             </div>
// //             <DialogFooter>
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                 onClick={() => setIsEditOpen(false)}
// //                 disabled={isUpdating}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isUpdating}>
// //                 {isUpdating ? "Saving..." : "Save Changes"}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // }

// // export default DocumentCard;

// // src/components/DocumentCard.tsx
// import { Card, CardHeader } from "./ui/card";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import {
//   MoreVertical,
//   Download,
//   Eye,
//   Share2,
//   Edit,
//   Trash2,
//   FileText,
//   AlertTriangle,
//   CalendarDays,
// } from "lucide-react";
// import { formatDistanceToNow, format, isPast, addDays } from "date-fns";
// import { useAuthContext } from "../contexts/AuthContext";
// import type { Document } from "../types/index";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "./ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { useState } from "react";
// import { documentService } from "../lib/api";
// import { toast } from "sonner";

// interface DocumentCardProps {
//   document: Document;
//   canEditDocuments?: boolean;
//   canDeleteDocuments?: boolean;
//   onView?: () => void;
//   onDownload?: () => void;
//   onDelete?: () => void;
//   onUpdate?: (doc: Document) => void;
// }

// const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// export function DocumentCard({
//   document,
//   canEditDocuments: propCanEdit,
//   canDeleteDocuments: propCanDelete,
//   onView,
//   onDownload,
//   onDelete,
//   onUpdate,
// }: DocumentCardProps) {
//   const { user } = useAuthContext();
//   const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
//   const permissions = user?.role?.permissions?.DocumentManagement || {};

//   const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
//   const canDelete =
//     propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
//   const canView = isSuperAdmin || permissions.viewDocuments;

//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Expiry Logic with Clear Status
//   const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
//   const isExpired = expiryDate ? isPast(expiryDate) : false;
//   const isExpiringSoon = expiryDate
//     ? !isExpired && expiryDate <= addDays(new Date(), 30)
//     : false;

//   const getExpiryStatus = () => {
//     if (!expiryDate) return null;
//     if (isExpired) {
//       return {
//         label: "Expired",
//         color: "bg-red-100 text-red-700 border-red-300",
//         icon: AlertTriangle,
//       };
//     }
//     if (isExpiringSoon) {
//       return {
//         label: "Expiring Soon",
//         color: "bg-orange-100 text-orange-700 border-orange-300",
//         icon: CalendarDays,
//       };
//     }
//     return null;
//   };

//   const expiryStatus = getExpiryStatus();

//   const formatDate = (date?: string) =>
//     date ? format(new Date(date), "MMM d, yyyy") : "—";
//   const formatAmount = (amount?: number) =>
//     amount
//       ? new Intl.NumberFormat("en-NG", {
//           style: "currency",
//           currency: "NGN",
//           minimumFractionDigits: 0,
//         }).format(amount)
//       : "—";

//   const shareDocument = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({ title: document.name, url: document.fileUrl });
//         return;
//       } catch {}
//     }
//     await navigator.clipboard.writeText(document.fileUrl);
//     toast.success("Link copied!");
//   };

//   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name")?.toString().trim();
//     const type = formData.get("documentType")?.toString();
//     const amountStr = formData
//       .get("negotiatedAmount")
//       ?.toString()
//       .replace(/,/g, "");
//     const expiry = formData.get("expiryDate")?.toString() || null;

//     if (!name || !type) return toast.error("Name and type required");

//     try {
//       const updateData: any = { name, documentType: type };
//       if (expiry) updateData.expiryDate = expiry;
//       if (amountStr) {
//         const amount = parseFloat(amountStr);
//         if (!isNaN(amount) && amount >= 0) updateData.negotiatedAmount = amount;
//       }

//       const res = await documentService.updateDocument(
//         document._id.toString(),
//         updateData
//       );
//       if (res.data?.document) {
//         toast.success("Document updated");
//         onUpdate?.(res.data.document);
//         setIsEditOpen(false);
//         setIsDetailsOpen(false);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Update failed");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (!canView) return null;

//   return (
//     <>
//       {/* Modern Clean Card */}
//       <Card
//         className={`group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20 ${
//           isExpired ? "opacity-75" : ""
//         }`}
//         onClick={() => setIsDetailsOpen(true)}
//       >
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="relative">
//                 <FileText
//                   className={`h-9 w-9 ${
//                     isExpired ? "text-red-500" : "text-muted-foreground"
//                   }`}
//                 />
//                 {isExpired && (
//                   <div className="absolute -top-1 -right-1">
//                     <AlertTriangle className="h-4 w-4 text-red-600" />
//                   </div>
//                 )}
//               </div>
//               <div className="min-w-0">
//                 <h3
//                   className={`font-medium text-sm truncate ${
//                     isExpired ? "text-red-700" : ""
//                   }`}
//                 >
//                   {document.name}
//                 </h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="secondary" className="text-xs">
//                     {document.documentType}
//                   </Badge>
//                   {expiryStatus && (
//                     <Badge
//                       variant="outline"
//                       className={`text-xs ${expiryStatus.color}`}
//                     >
//                       <expiryStatus.icon className="h-3 w-3 mr-1" />
//                       {expiryStatus.label}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Three Dots Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {onView && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onView();
//                     }}
//                   >
//                     <Eye className="h-4 w-4 mr-2" /> View
//                   </DropdownMenuItem>
//                 )}
//                 {onDownload && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDownload();
//                     }}
//                   >
//                     <Download className="h-4 w-4 mr-2" /> Download
//                   </DropdownMenuItem>
//                 )}
//                 <DropdownMenuItem
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     shareDocument();
//                   }}
//                 >
//                   <Share2 className="h-4 w-4 mr-2" /> Share
//                 </DropdownMenuItem>
//                 {canEdit && (
//                   <DropdownMenuItem
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setIsEditOpen(true);
//                       setIsDetailsOpen(false);
//                     }}
//                   >
//                     <Edit className="h-4 w-4 mr-2" /> Edit
//                   </DropdownMenuItem>
//                 )}
//                 {canDelete && onDelete && (
//                   <DropdownMenuItem
//                     className="text-destructive"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDelete();
//                     }}
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" /> Delete
//                   </DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </CardHeader>
//       </Card>

//       {/* Details Modal */}
//       <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-2xl flex items-center gap-3">
//               <FileText className="h-8 w-8" />
//               {document.name}
//             </DialogTitle>
//             <DialogDescription className="flex items-center gap-3 mt-2">
//               <Badge variant="secondary">{document.documentType}</Badge>
//               {isExpired && (
//                 <Badge
//                   variant="outline"
//                   className="bg-red-100 text-red-700 border-red-300"
//                 >
//                   <AlertTriangle className="h-3 w-3 mr-1" />
//                   Expired
//                 </Badge>
//               )}
//               {isExpiringSoon && !isExpired && (
//                 <Badge
//                   variant="outline"
//                   className="bg-orange-100 text-orange-700 border-orange-300"
//                 >
//                   <CalendarDays className="h-3 w-3 mr-1" />
//                   Expiring Soon
//                 </Badge>
//               )}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6 py-4">
//             <div className="grid grid-cols-2 gap-6 text-sm">
//               <div>
//                 <Label className="text-muted-foreground">Uploaded By</Label>
//                 <p className="font-medium">
//                   {typeof document.uploadedBy === "string"
//                     ? document.uploadedBy || "Unknown"
//                     : document.uploadedBy?.fullName || "Unknown"}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Uploaded</Label>
//                 <p className="font-medium">
//                   {formatDistanceToNow(new Date(document.createdAt), {
//                     addSuffix: true,
//                   })}
//                 </p>
//               </div>
//               {document.startDate && (
//                 <div>
//                   <Label className="text-muted-foreground">Start Date</Label>
//                   <p className="font-medium">
//                     {formatDate(document.startDate)}
//                   </p>
//                 </div>
//               )}
//               {document.expiryDate && (
//                 <div>
//                   <Label className="text-muted-foreground">Expiry Date</Label>
//                   <p
//                     className={`font-medium text-lg ${
//                       isExpired
//                         ? "text-red-600"
//                         : isExpiringSoon
//                         ? "text-orange-600"
//                         : ""
//                     }`}
//                   >
//                     {formatDate(document.expiryDate)}
//                   </p>
//                 </div>
//               )}
//               {document.negotiatedAmount != null && (
//                 <div>
//                   <Label className="text-muted-foreground">
//                     Negotiated Amount
//                   </Label>
//                   <p className="font-medium text-xl">
//                     {formatAmount(document.negotiatedAmount)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3">
//               <Button onClick={onView} className="flex-1">
//                 <Eye className="h-4 w-4 mr-2" /> View Document
//               </Button>
//               <Button variant="secondary" onClick={onDownload}>
//                 <Download className="h-4 w-4 mr-2" /> Download
//               </Button>
//               <Button variant="outline" onClick={shareDocument}>
//                 <Share2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Modal */}
//       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Edit Document</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleUpdate} className="space-y-4">
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 name="name"
//                 defaultValue={document.name}
//                 required
//                 disabled={isUpdating}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Type</Label>
//               <Select name="documentType" defaultValue={document.documentType}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {DOCUMENT_TYPES.map((t) => (
//                     <SelectItem key={t} value={t}>
//                       {t}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Negotiated Amount (₦)</Label>
//               <Input
//                 name="negotiatedAmount"
//                 type="text"
//                 defaultValue={document.negotiatedAmount?.toString() || ""}
//                 disabled={isUpdating}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Expiry Date</Label>
//               <Input
//                 name="expiryDate"
//                 type="date"
//                 defaultValue={document.expiryDate?.split("T")[0] || ""}
//                 disabled={isUpdating}
//               />
//             </div>
//             <DialogFooter>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setIsEditOpen(false)}
//                 disabled={isUpdating}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isUpdating}>
//                 {isUpdating ? "Saving..." : "Save Changes"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default DocumentCard;

// src/components/DocumentCard.tsx
import { Card, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  MoreVertical,
  Download,
  Eye,
  Share2,
  Edit,
  Trash2,
  FileText,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import { formatDistanceToNow, format, isPast, addDays } from "date-fns";
import { useAuthContext } from "../contexts/AuthContext";
import type { Document } from "../types/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { documentService } from "../lib/api";
import { toast } from "sonner";

interface DocumentCardProps {
  document: Document;
  canEditDocuments?: boolean;
  canDeleteDocuments?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onUpdate?: (doc: Document) => void;
}

const DOCUMENT_TYPES = ["Contract", "SLA", "NDA", "Other"] as const;

// Helper: Format number with commas and Naira
const formatNaira = (amount?: number) => {
  if (!amount && amount !== 0) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper: Convert formatted string back to number (e.g., "1,234,567" → 1234567)
const parseNairaInput = (value: string): number | null => {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

export function DocumentCard({
  document,
  canEditDocuments: propCanEdit,
  canDeleteDocuments: propCanDelete,
  onView,
  onDownload,
  onDelete,
  onUpdate,
}: DocumentCardProps) {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role?.name?.toLowerCase().includes("superadmin");
  const permissions = user?.role?.permissions?.DocumentManagement || {};

  const canEdit = propCanEdit ?? (isSuperAdmin || permissions.editDocuments);
  const canDelete =
    propCanDelete ?? (isSuperAdmin || permissions.deleteDocuments);
  const canView = isSuperAdmin || permissions.viewDocuments;

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Expiry Logic
  const expiryDate = document.expiryDate ? new Date(document.expiryDate) : null;
  const isExpired = expiryDate ? isPast(expiryDate) : false;
  const isExpiringSoon = expiryDate
    ? !isExpired && expiryDate <= addDays(new Date(), 30)
    : false;

  const getExpiryStatus = () => {
    if (!expiryDate) return null;
    if (isExpired) {
      return {
        label: "Expired",
        color: "bg-red-100 text-red-700 border-red-300",
        icon: AlertTriangle,
      };
    }
    if (isExpiringSoon) {
      return {
        label: "Expiring Soon",
        color: "bg-orange-100 text-orange-700 border-orange-300",
        icon: CalendarDays,
      };
    }
    return null;
  };

  const expiryStatus = getExpiryStatus();

  const formatDate = (date?: string) =>
    date ? format(new Date(date), "MMM d, yyyy") : "—";

  const shareDocument = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.name, url: document.fileUrl });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(document.fileUrl);
    toast.success("Link copied!");
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().trim();
    const type = formData.get("documentType")?.toString();
    const amountInput =
      formData.get("negotiatedAmount")?.toString().trim() || "";
    const expiry = formData.get("expiryDate")?.toString() || null;
    const start = formData.get("startDate")?.toString() || null;

    if (!name || !type) {
      toast.error("Name and type are required");
      setIsUpdating(false);
      return;
    }

    try {
      const updateData: any = { name, documentType: type };
      if (expiry) updateData.expiryDate = expiry;
      if (start) updateData.startDate = start;

      // Handle negotiated amount
      if (amountInput === "") {
        updateData.negotiatedAmount = null;
      } else {
        const amount = parseNairaInput(amountInput);
        if (amount === null || amount < 0) {
          toast.error("Please enter a valid amount");
          setIsUpdating(false);
          return;
        }
        updateData.negotiatedAmount = amount;
      }

      const res = await documentService.updateDocument(
        document._id.toString(),
        updateData
      );
      if (res.data?.document) {
        toast.success("Document updated successfully");
        onUpdate?.(res.data.document);
        setIsEditOpen(false);
        setIsDetailsOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update document");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canView) return null;

  return (
    <>
      {/* Card */}
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md hover:border-foreground/20 ${
          isExpired ? "opacity-75" : ""
        }`}
        onClick={() => setIsDetailsOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                <FileText
                  className={`h-9 w-9 ${
                    isExpired ? "text-red-500" : "text-muted-foreground"
                  }`}
                />
                {isExpired && (
                  <div className="absolute -top-1 -right-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-medium text-sm truncate ${
                    isExpired ? "text-red-700" : ""
                  }`}
                >
                  {document.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {document.documentType}
                  </Badge>
                  {expiryStatus && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${expiryStatus.color}`}
                    >
                      <expiryStatus.icon className="h-3 w-3 mr-1" />
                      {expiryStatus.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onView && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onView();
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" /> View
                  </DropdownMenuItem>
                )}
                {onDownload && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" /> Download
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    shareDocument();
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </DropdownMenuItem>
                {canEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditOpen(true);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <FileText className="h-8 w-8" />
              {document.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-3 mt-2">
              <Badge variant="secondary">{document.documentType}</Badge>
              {isExpired && (
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-700 border-red-300"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" /> Expired
                </Badge>
              )}
              {isExpiringSoon && !isExpired && (
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-700 border-orange-300"
                >
                  <CalendarDays className="h-3 w-3 mr-1" /> Expiring Soon
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <Label className="text-muted-foreground">Uploaded By</Label>
                <p className="font-medium">
                  {typeof document.uploadedBy === "string"
                    ? document.uploadedBy || "Unknown"
                    : document.uploadedBy?.fullName || "Unknown"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Uploaded</Label>
                <p className="font-medium">
                  {formatDistanceToNow(new Date(document.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Date</Label>
                <p className="font-medium">{formatDate(document.startDate)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Expiry Date</Label>
                <p
                  className={`font-medium text-lg ${
                    isExpired
                      ? "text-red-600"
                      : isExpiringSoon
                      ? "text-orange-600"
                      : ""
                  }`}
                >
                  {formatDate(document.expiryDate)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Negotiated Amount
                </Label>
                <p className="font-medium text-xl">
                  {formatNaira(document.negotiatedAmount)}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Size</Label>
                <p className="font-medium">
                  {document.sizeMB ? `${document.sizeMB.toFixed(2)} MB` : "—"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onView} className="flex-1">
                <Eye className="h-4 w-4 mr-2" /> View Document
              </Button>
              <Button variant="secondary" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
              <Button variant="outline" onClick={shareDocument}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                defaultValue={document.name}
                required
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                name="documentType"
                defaultValue={document.documentType}
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Negotiated Amount (₦)</Label>
              <Input
                name="negotiatedAmount"
                type="text"
                placeholder="e.g. 1,500,000"
                defaultValue={
                  document.negotiatedAmount != null
                    ? document.negotiatedAmount
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : ""
                }
                disabled={isUpdating}
              />
              <p className="text-xs text-muted-foreground">
                Enter amount with or without commas
              </p>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                name="startDate"
                type="date"
                defaultValue={document.startDate?.split("T")[0] || ""}
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                name="expiryDate"
                type="date"
                defaultValue={document.expiryDate?.split("T")[0] || ""}
                disabled={isUpdating}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentCard;
