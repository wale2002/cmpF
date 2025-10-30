/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Building2, // NEW: Icon for organization
  FileText, // NEW: Icon for document count
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useAuthContext } from "../contexts/AuthContext";
import type { Organization } from "../types/index";
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
import { useState } from "react";
import { organizationService } from "../lib/api";
import { toast } from "sonner";

interface OrganizationCardProps {
  organization: Organization;
  canEdit?: boolean; // DEPRECATED: Use permissions for granular control
  canEditOrganizations?: boolean; // NEW: Specific permission prop
  canDeleteOrganizations?: boolean; // NEW: Specific permission prop
  onView?: (org: Organization) => void;
  onEdit?: (org: Organization) => void;
  onDelete?: (org: Organization) => void;
  onUpdate?: (updatedOrg: Organization) => void; // NEW: Callback for after successful update
}

const getOrganizationTypeColor = (type: Organization["organizationType"]) => {
  switch (type.toLowerCase()) {
    case "tech":
    case "technological institute":
      return "bg-primary-light text-primary border-primary/20";
    case "admin":
      return "bg-success-light text-success border-success/20";
    case "analytics":
      return "bg-warning-light text-warning border-warning/20";
    case "infra":
      return "bg-info-light text-info border-info/20";
    default:
      return "bg-secondary text-secondary-foreground border-border";
  }
};

export function OrganizationCard({
  organization,
  canEdit = false, // Fallback for legacy usage
  canEditOrganizations = false,
  canDeleteOrganizations = false,
  onView,
  onEdit,
  onDelete,
  onUpdate,
}: OrganizationCardProps) {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions = user?.role?.permissions || {};
  const effectiveCanEdit =
    canEdit ||
    canEditOrganizations ||
    isSuperAdmin ||
    permissions.OrganizationManagement?.editOrganizations ||
    false;
  const effectiveCanDelete =
    canDeleteOrganizations ||
    isSuperAdmin ||
    permissions.OrganizationManagement?.deleteOrganizations ||
    false;
  const effectiveCanView =
    isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;

  // NEW: Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // ENHANCED: Format dates if present
  const formatDate = (dateStr?: string) =>
    dateStr ? format(new Date(dateStr), "MMM dd, yyyy") : "N/A";

  if (!effectiveCanView) {
    return null; // Hide card entirely if no view permission
  }

  // NEW: Handle edit click - open modal
  const handleEditClick = () => {
    setEditingOrganization(organization);
    setIsEditOpen(true);
  };

  // NEW: Handle update in modal
  const handleUpdateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrganization) return;

    setIsUpdating(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const name = formData.get("name")?.toString().trim();
      const organizationType = formData.get("organizationType")?.toString().trim();

      const updateData = {
        ...(name && { name }),
        ...(organizationType && { organizationType }),
      };

      if (Object.keys(updateData).length === 0) {
        toast.error("No changes to update");
        return;
      }

      const response = await organizationService.updateOrganization(
        editingOrganization._id.toString(),
        updateData
      );

      if (response.status === "success") {
        const updatedOrg = response.data?.organization;
        toast.success("Organization updated successfully");
        setIsEditOpen(false);
        setEditingOrganization(null);

        // Call callbacks
        if (onUpdate && updatedOrg) {
          onUpdate(updatedOrg);
        }
        if (onEdit && updatedOrg) {
          onEdit(updatedOrg);
        }
      } else {
        toast.error(response.message || "Failed to update organization");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update organization");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm rounded-lg">
        <CardHeader className="pb-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-xs leading-4 line-clamp-2">
                {organization.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={`text-xs ${getOrganizationTypeColor(
                  organization.organizationType
                )}`}
              >
                {organization.organizationType}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <Calendar className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">
                Created {formatDistanceToNow(new Date(organization.createdAt))} ago
              </span>
            </div>

            <div className="flex items-center gap-1">
              <FileText className="h-2.5 w-2.5 flex-shrink-0" />
              <span>{organization.documentCount || 0} documents</span>
            </div>
          </div>

          {/* Show creation date in full */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="h-2.5 w-2.5 flex-shrink-0" />
            <span className="truncate">
              Established: {formatDate(organization.createdAt)}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {effectiveCanView && onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(organization)}
                aria-label={`View ${organization.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Eye className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEditClick}
                aria-label={`Edit ${organization.name}`}
                className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
              >
                <Edit className="h-2.5 w-2.5 mr-1" />
              </Button>
            )}

            {effectiveCanDelete && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(organization)}
                aria-label={`Delete ${organization.name}`}
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
            <DialogTitle className="text-sm">Edit Organization</DialogTitle>
            <DialogDescription className="text-xs">
              Update the name and type of the organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateOrganization} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs">
                Organization Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingOrganization?.name || ""}
                required
                disabled={isUpdating}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="organizationType" className="text-xs">
                Organization Type
              </Label>
              <Input
                id="organizationType"
                name="organizationType"
                defaultValue={editingOrganization?.organizationType || ""}
                required
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

export default OrganizationCard;