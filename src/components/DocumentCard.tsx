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
