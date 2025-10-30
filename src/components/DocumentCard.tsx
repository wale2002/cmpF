/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  File,
  Share2,
  // REMOVED: DollarSign (replaced with Unicode ₦ for Naira)
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns"; // Import format for dates
import { useAuthContext } from "../contexts/AuthContext"; // NEW: For RBAC checks
import type { Document } from "../types/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { documentService } from "../lib/api";
import { toast } from "sonner"; // Assuming sonner for notifications; adjust if using different toast lib

interface DocumentCardProps {
  document: Document;
  canEdit?: boolean; // DEPRECATED: Use permissions for granular control
  canEditDocuments?: boolean; // NEW: Specific permission prop
  canDeleteDocuments?: boolean; // NEW: Specific permission prop
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  onUpdate?: (updatedDoc: Document) => void; // NEW: Callback for after successful update
}

const getDocumentTypeColor = (type: Document["documentType"]) => {
  switch (type) {
    case "SLA":
      return "bg-success-light text-success border-success/20";
    case "NDA":
      return "bg-warning-light text-warning border-warning/20";
    case "Contract":
      return "bg-primary-light text-primary border-primary/20";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

const DOCUMENT_TYPES = [
  { value: "Contract", label: "Contract" },
  { value: "SLA", label: "SLA" },
  { value: "NDA", label: "NDA" },
  { value: "Other", label: "Other" },
] as const;

export function DocumentCard({
  document,
  canEdit = false, // Fallback for legacy usage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // NEW: RBAC-aware
  canDeleteDocuments = false, // NEW: RBAC-aware
  onView,
  onDownload,
  onEdit,
  onDelete,
  onUpdate, // NEW: For parent to handle refresh after update
}: DocumentCardProps) {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions = user?.role?.permissions || {};
  const effectiveCanEdit =
    canEdit ||
    isSuperAdmin ||
    permissions.DocumentManagement?.editDocuments ||
    false;
  const effectiveCanDelete =
    canDeleteDocuments ||
    isSuperAdmin ||
    permissions.DocumentManagement?.deleteDocuments ||
    false;
  const effectiveCanView =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const effectiveCanDownload =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false; // Assuming download requires view

  // NEW: Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // FIXED: Coerce IDs to string for consistency (if needed for props)

  // ENHANCED: Format dates if present
  const formatDate = (dateStr?: string) =>
    dateStr ? format(new Date(dateStr), "MMM dd, yyyy") : "N/A";

  // NEW: Format file size dynamically (kB for <1 MB, MB otherwise)
  const formatFileSize = (sizeMB?: number): string => {
    if (!sizeMB || sizeMB <= 0) return "N/A";
    const bytes = sizeMB * 1024 * 1024;
    if (bytes < 1024) return `${Math.round(bytes)} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} kB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    // Extend for GB+ as needed
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  // UPDATED: Format negotiated amount with Naira (NGN) formatting
  const formatNegotiatedAmount = (amount?: number): string => {
    if (!amount || isNaN(amount)) return "N/A";
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // NEW: Share function using Web Share API or clipboard fallback
  const shareDocument = async () => {
    if (navigator.share && effectiveCanView) {
      try {
        await navigator.share({
          title: document.name,
          text: `Check out this document: ${document.name}`,
          url: document.fileUrl,
        });
      } catch (err) {
        console.error("Error sharing document:", err);
        // Fallback to clipboard
        await navigator.clipboard.writeText(document.fileUrl);
        alert("Link copied to clipboard!");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(document.fileUrl);
      alert("Link copied to clipboard!");
    }
  };

  // NEW: Handle edit click - open modal
  const handleEditClick = () => {
    setEditingDocument(document);
    setIsEditOpen(true);
  };

  // NEW: Handle update in modal
  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;

    setIsUpdating(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const name = formData.get("name")?.toString().trim();
      const documentType = formData.get("documentType")?.toString();
      const negotiatedAmountStr = formData
        .get("negotiatedAmount")
        ?.toString()
        .trim();
      let negotiatedAmount: number | undefined;
      if (negotiatedAmountStr) {
        // Clean and parse: remove commas, parse as float
        const cleanAmount = negotiatedAmountStr.replace(/,/g, "");
        negotiatedAmount = parseFloat(cleanAmount);
        if (isNaN(negotiatedAmount) || negotiatedAmount < 0) {
          toast.error("Invalid negotiated amount");
          return;
        }
      }

      const updateData = {
        name,
        documentType,
        ...(negotiatedAmount !== undefined && { negotiatedAmount }),
      };
      const response = await documentService.updateDocument(
        editingDocument._id.toString(),
        updateData
      );

      if (response.status === "success") {
        const updatedDoc = response.data?.document;
        toast.success("Document updated successfully");
        setIsEditOpen(false);
        setEditingDocument(null);

        // Call callbacks
        if (onUpdate && updatedDoc) {
          onUpdate(updatedDoc);
        }
        if (onEdit && updatedDoc) {
          onEdit(updatedDoc);
        }
      } else {
        toast.error(response.message || "Failed to update document");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update document");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!effectiveCanView) {
    return null; // NEW: Hide card entirely if no view permission
  }

  return (
    <>
      <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm rounded-lg">
        <CardHeader className="pb-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-xs leading-4 line-clamp-2">
                {document.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-xs ${getDocumentTypeColor(
                  document.documentType
                )}`}
              >
                {document.documentType}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">
                {formatDistanceToNow(new Date(document.createdAt))} ago
              </span>
            </div>

            <div className="flex items-center gap-1">
              <File className="h-2.5 w-2.5 flex-shrink-0" />
              <span>{formatFileSize(document.sizeMB)}</span>
            </div>
          </div>

          {/* ENHANCED: Show dates if present */}
          {(document.startDate || document.expiryDate) && (
            <div className="space-y-1 text-xs text-muted-foreground">
              {document.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">
                    Start: {formatDate(document.startDate)}
                  </span>
                </div>
              )}
              {document.expiryDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
                  <span className="truncate">
                    Expires: {formatDate(document.expiryDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* UPDATED: Show negotiated amount if present, with Naira symbol */}
          {document.negotiatedAmount !== undefined &&
            document.negotiatedAmount !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                <span className="text-sm font-bold">₦</span>{" "}
                {/* UPDATED: Unicode Naira symbol */}
                <span className="truncate font-medium">
                  Negotiated:{" "}
                  {formatNegotiatedAmount(document.negotiatedAmount)}
                </span>
              </div>
            )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">
              Uploaded by{" "}
              {typeof document.uploadedBy === "string"
                ? document.uploadedBy
                : (document.uploadedBy as any)?.fullName || "Unknown User"}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {effectiveCanView && onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(document)}
                aria-label={`View ${document.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Eye className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanDownload && onDownload && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDownload(document)}
                aria-label={`Download ${document.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Download className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={shareDocument}
                aria-label={`Share ${document.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Share2 className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                aria-label={`Edit ${document.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Edit className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanDelete && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(document)}
                aria-label={`Delete ${document.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Trash2 className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NEW: Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-sm">Edit Document</DialogTitle>
            <DialogDescription className="text-xs">
              Update the name, type, and negotiated amount of the document.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">
                Document Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingDocument?.name || ""}
                required
                disabled={isUpdating}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="documentType" className="text-xs">
                Document Type
              </Label>
              <Select
                name="documentType"
                defaultValue={editingDocument?.documentType || ""}
                required
                disabled={isUpdating}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="text-xs"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* UPDATED: Negotiated Amount Field with Naira context */}
            <div className="space-y-1">
              <Label htmlFor="negotiatedAmount" className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">₦</span>{" "}
                  {/* UPDATED: Unicode Naira symbol */}
                  Negotiated Amount (Optional, e.g., 540000 or 1,000,000)
                </div>
              </Label>
              <Input
                id="negotiatedAmount"
                name="negotiatedAmount"
                type="text"
                placeholder="Enter amount (commas allowed)"
                defaultValue={
                  editingDocument?.negotiatedAmount
                    ? editingDocument.negotiatedAmount.toLocaleString("en-NG") // UPDATED: Naira locale
                    : ""
                }
                disabled={isUpdating}
                className="h-8 text-xs"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
                className="h-7 px-3 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-7 px-3 text-xs"
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DocumentCard;
