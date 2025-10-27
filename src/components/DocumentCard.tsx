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

      if (!name || !documentType) {
        toast.error("Name and type are required");
        return;
      }

      const updateData = { name, documentType };
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
      <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-xs sm:text-sm lg:text-base leading-5 line-clamp-2">
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

        <CardContent className="space-y-3 p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {formatDistanceToNow(new Date(document.createdAt))} ago
              </span>
            </div>

            <div className="flex items-center gap-1">
              <File className="h-3 w-3 flex-shrink-0" />
              <span>{formatFileSize(document.sizeMB)}</span>
            </div>
          </div>

          {/* ENHANCED: Show dates if present */}
          {(document.startDate || document.expiryDate) && (
            <div className="space-y-1 text-xs text-muted-foreground">
              {document.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    Start: {formatDate(document.startDate)}
                  </span>
                </div>
              )}
              {document.expiryDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    Expires: {formatDate(document.expiryDate)}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3 flex-shrink-0" />
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
                className="h-8 px-2 text-xs flex-1 sm:flex-none"
              >
                <Eye className="h-3 w-3 mr-1" />
              </Button>
            )}

            {effectiveCanDownload && onDownload && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDownload(document)}
                aria-label={`Download ${document.name}`}
                className="h-8 px-2 text-xs flex-1 sm:flex-none"
              >
                <Download className="h-3 w-3 mr-1" />
              </Button>
            )}

            {effectiveCanView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={shareDocument}
                aria-label={`Share ${document.name}`}
                className="h-8 px-2 text-xs flex-1 sm:flex-none"
              >
                <Share2 className="h-3 w-3 mr-1" />
              </Button>
            )}

            {effectiveCanEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                aria-label={`Edit ${document.name}`}
                className="h-8 px-2 text-xs flex-1 sm:flex-none"
              >
                <Edit className="h-3 w-3 mr-1" />
              </Button>
            )}

            {effectiveCanDelete && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(document)}
                aria-label={`Delete ${document.name}`}
                className="h-8 px-2 text-xs flex-1 sm:flex-none"
              >
                <Trash2 className="h-3 w-3 mr-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NEW: Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update the name and type of the document.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingDocument?.name || ""}
                required
                disabled={isUpdating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                name="documentType"
                defaultValue={editingDocument?.documentType || ""}
                required
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
