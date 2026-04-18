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

// // Helper: Format number with commas and Naira
// const formatNaira = (amount?: number) => {
//   if (!amount && amount !== 0) return "—";
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 0,
//   }).format(amount);
// };

// // Helper: Convert formatted string back to number (e.g., "1,234,567" → 1234567)
// const parseNairaInput = (value: string): number | null => {
//   const cleaned = value.replace(/[^0-9.-]/g, "");
//   const num = parseFloat(cleaned);
//   return isNaN(num) ? null : num;
// };

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

//   // Expiry Logic
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
//     const amountInput =
//       formData.get("negotiatedAmount")?.toString().trim() || "";
//     const expiry = formData.get("expiryDate")?.toString() || null;
//     const start = formData.get("startDate")?.toString() || null;

//     if (!name || !type) {
//       toast.error("Name and type are required");
//       setIsUpdating(false);
//       return;
//     }

//     try {
//       const updateData: any = { name, documentType: type };
//       if (expiry) updateData.expiryDate = expiry;
//       if (start) updateData.startDate = start;

//       // Handle negotiated amount
//       if (amountInput === "") {
//         updateData.negotiatedAmount = null;
//       } else {
//         const amount = parseNairaInput(amountInput);
//         if (amount === null || amount < 0) {
//           toast.error("Please enter a valid amount");
//           setIsUpdating(false);
//           return;
//         }
//         updateData.negotiatedAmount = amount;
//       }

//       const res = await documentService.updateDocument(
//         document._id.toString(),
//         updateData,
//       );
//       if (res.data?.document) {
//         toast.success("Document updated successfully");
//         onUpdate?.(res.data.document);
//         setIsEditOpen(false);
//         setIsDetailsOpen(false);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Failed to update document");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   if (!canView) return null;

//   return (
//     <>
//       {/* Card */}
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
//                   <AlertTriangle className="h-3 w-3 mr-1" /> Expired
//                 </Badge>
//               )}
//               {isExpiringSoon && !isExpired && (
//                 <Badge
//                   variant="outline"
//                   className="bg-orange-100 text-orange-700 border-orange-300"
//                 >
//                   <CalendarDays className="h-3 w-3 mr-1" /> Expiring Soon
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
//               <div>
//                 <Label className="text-muted-foreground">Start Date</Label>
//                 <p className="font-medium">{formatDate(document.startDate)}</p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Expiry Date</Label>
//                 <p
//                   className={`font-medium text-lg ${
//                     isExpired
//                       ? "text-red-600"
//                       : isExpiringSoon
//                         ? "text-orange-600"
//                         : ""
//                   }`}
//                 >
//                   {formatDate(document.expiryDate)}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">
//                   Negotiated Amount
//                 </Label>
//                 <p className="font-medium text-xl">
//                   {formatNaira(document.negotiatedAmount)}
//                 </p>
//               </div>
//               <div>
//                 <Label className="text-muted-foreground">Size</Label>
//                 <p className="font-medium">
//                   {document.sizeMB ? `${document.sizeMB.toFixed(2)} MB` : "—"}
//                 </p>
//               </div>
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
//               <Select
//                 name="documentType"
//                 defaultValue={document.documentType}
//                 disabled={isUpdating}
//               >
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
//                 placeholder="e.g. 1,500,000"
//                 defaultValue={
//                   document.negotiatedAmount != null
//                     ? document.negotiatedAmount
//                         .toString()
//                         .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                     : ""
//                 }
//                 disabled={isUpdating}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Enter amount with or without commas
//               </p>
//             </div>

//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Input
//                 name="startDate"
//                 type="date"
//                 defaultValue={document.startDate?.split("T")[0] || ""}
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

import { Card } from "./ui/card";
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
  ExternalLink,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { format, isPast, addDays } from "date-fns";
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
import { motion, AnimatePresence } from "framer-motion";

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

const formatNaira = (amount?: number) => {
  if (!amount && amount !== 0) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

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
        color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        icon: AlertTriangle,
      };
    }
    if (isExpiringSoon) {
      return {
        label: "Expiring Soon",
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
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
        updateData,
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
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card
          className={`group relative overflow-hidden bg-zinc-900/40 border-white/5 backdrop-blur-md rounded-[2rem] p-6 cursor-pointer transition-all hover:bg-zinc-900/60 hover:border-white/10 ${
            isExpired ? "opacity-80" : ""
          }`}
          onClick={() => setIsDetailsOpen(true)}
        >
          {/* Subtle Glow Effect */}
          <div className="absolute -right-12 -top-12 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />

          <div className="flex flex-col h-full gap-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all">
                <FileText
                  className={`w-6 h-6 ${isExpired ? "text-rose-500" : "text-white"}`}
                />
              </div>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-950 border-white/10 rounded-xl p-1.5 min-w-[160px] backdrop-blur-xl"
                  >
                    {onView && (
                      <DropdownMenuItem
                        className="rounded-lg gap-3 py-2 text-zinc-400 hover:text-white focus:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView();
                        }}
                      >
                        <Eye className="h-4 w-4" /> View Details
                      </DropdownMenuItem>
                    )}
                    {onDownload && (
                      <DropdownMenuItem
                        className="rounded-lg gap-3 py-2 text-zinc-400 hover:text-white focus:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload();
                        }}
                      >
                        <Download className="h-4 w-4" /> Download File
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="rounded-lg gap-3 py-2 text-zinc-400 hover:text-white focus:bg-white/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        shareDocument();
                      }}
                    >
                      <Share2 className="h-4 w-4" /> Share Access
                    </DropdownMenuItem>
                    {canEdit && (
                      <DropdownMenuItem
                        className="rounded-lg gap-3 py-2 text-zinc-400 hover:text-white focus:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditOpen(true);
                          setIsDetailsOpen(false);
                        }}
                      >
                        <Edit className="h-4 w-4" /> Edit Metadata
                      </DropdownMenuItem>
                    )}
                    {canDelete && onDelete && (
                      <DropdownMenuItem
                        className="rounded-lg gap-3 py-2 text-rose-500 hover:text-rose-400 focus:bg-rose-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        <Trash2 className="h-4 w-4" /> Delete Permanently
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3
                className={`font-bold text-lg tracking-tight truncate ${isExpired ? "text-rose-500" : "text-white"}`}
              >
                {document.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 transition-colors text-[10px] uppercase tracking-widest font-mono">
                  {document.documentType}
                </Badge>
                {expiryStatus && (
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase tracking-widest font-mono ${expiryStatus.color} border-none`}
                  >
                    <expiryStatus.icon className="h-3 w-3 mr-1.5" />
                    {expiryStatus.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                  Negotiated Value
                </span>
                <span className="text-sm font-bold text-white">
                  {formatNaira(document.negotiatedAmount)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                  Last Updated
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  {formatDate(document.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-2xl bg-zinc-950 border-white/5 rounded-[2.5rem] p-10 overflow-hidden backdrop-blur-2xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 blur-[100px] rounded-full" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight text-white mb-1">
                  {document.name}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/5 text-zinc-400 border-white/5 font-mono text-[10px] uppercase tracking-widest">
                    {document.documentType}
                  </Badge>
                  {expiryStatus && (
                    <Badge
                      className={`${expiryStatus.color} border-none font-mono text-[10px] uppercase tracking-widest`}
                    >
                      {expiryStatus.label}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-8 mt-4 relative z-10">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">
                Contract Start
              </Label>
              <p className="text-base font-medium text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-zinc-500" />{" "}
                {formatDate(document.startDate)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">
                Contract Expiry
              </Label>
              <p
                className={`text-base font-medium flex items-center gap-2 ${isExpired ? "text-rose-500" : "text-white"}`}
              >
                <Clock className="w-4 h-4 text-zinc-500" />{" "}
                {formatDate(document.expiryDate)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">
                Negotiated Amount
              </Label>
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatNaira(document.negotiatedAmount)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono">
                Organization
              </Label>
              <p className="text-base font-medium text-white truncate">
                {(document as any).organization?.name || "Global"}
              </p>
            </div>
          </div>

          <DialogFooter className="mt-12 pt-8 border-t border-white/5 gap-3 relative z-10">
            <Button
              variant="outline"
              className="rounded-2xl border-white/5 bg-white/5 text-white hover:bg-white/10 hover:text-white px-8"
              onClick={shareDocument}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Access
            </Button>
            <Button
              className="rounded-2xl bg-white text-black hover:bg-zinc-200 px-8 font-bold"
              onClick={() => window.open(document.fileUrl, "_blank")}
            >
              Open Document <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal - Kept minimal for functionality but styled modernly */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border-white/5 rounded-[2.5rem] p-10 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-6">
              Edit Metadata
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono ml-1">
                Document Name
              </Label>
              <Input
                name="name"
                defaultValue={document.name}
                className="h-12 bg-white/5 border-white/5 focus:border-white/20 rounded-xl text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono ml-1">
                  Type
                </Label>
                <Select
                  name="documentType"
                  defaultValue={document.documentType}
                >
                  <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {DOCUMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono ml-1">
                  Amount (NGN)
                </Label>
                <Input
                  name="negotiatedAmount"
                  type="text"
                  placeholder="e.g. 5,000,000"
                  defaultValue={document.negotiatedAmount?.toLocaleString()}
                  className="h-12 bg-white/5 border-white/5 focus:border-white/20 rounded-xl text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono ml-1">
                  Start Date
                </Label>
                <Input
                  name="startDate"
                  type="date"
                  defaultValue={
                    document.startDate
                      ? new Date(document.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  className="h-12 bg-white/5 border-white/5 focus:border-white/20 rounded-xl text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono ml-1">
                  Expiry Date
                </Label>
                <Input
                  name="expiryDate"
                  type="date"
                  defaultValue={
                    document.expiryDate
                      ? new Date(document.expiryDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  className="h-12 bg-white/5 border-white/5 focus:border-white/20 rounded-xl text-white"
                />
              </div>
            </div>
            <DialogFooter className="pt-6 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                className="rounded-xl text-zinc-500 hover:text-white"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-white text-black hover:bg-zinc-200 px-8 font-bold"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
