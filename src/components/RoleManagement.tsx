// src/components/RoleManagement.tsx
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../lib/api"; // Assume API methods for roles
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"; // Added Users icon
import { Checkbox } from "./ui/checkbox"; // NEW: Import Checkbox for permissions
import { CreateRoleModal } from "./CreateRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { ViewRoleUsersModal } from "./ViewRoleUsersModal"; // NEW: Import ViewRoleUsersModal
import { RoleCard } from "./RoleCard"; // NEW: Import RoleCard
import { toast } from "sonner";
// At top (with other imports)

import type { Role } from "../types";
import { handleApiError } from "../utils/error-handler";

export const RoleManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [viewRole, setViewRole] = useState<Role | null>(null); // NEW: State for view users modal
  const [currentPage, setCurrentPage] = useState(1); // NEW: Pagination state

  const {
    data: rolesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allRoles"],
    queryFn: () => userService.getAllRoles(),
    enabled: true,
  });

  const roles: Role[] = rolesResponse?.data?.roles || [];
  const itemsPerPage = 8; // NEW: Items per page
  const totalPages = Math.ceil(roles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoles = roles.slice(startIndex, endIndex); // NEW: Slice for current page

  // NEW: Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // NEW: Handle view users
  const handleViewUsers = (role: Role) => {
    setViewRole(role);
  };

  const deleteMutation = useMutation({
    mutationFn: (roleId: string) => userService.deleteRole(roleId),
    onSuccess: () => {
      refetch();
      setDeleteRole(null);
      setCurrentPage(1); // NEW: Reset to first page after delete
      toast.success("Role deleted successfully");
    },
    onError: (error) => {
      handleApiError(error, "Failed to delete role");
    },
  });

  // NEW: Success handlers to reset page
  const handleCreateSuccess = () => {
    refetch();
    setCurrentPage(1);
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    refetch();
    setCurrentPage(1);
    setEditRole(null);
    toast.success("Role updated successfully");
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {handleApiError(error, "Failed to load roles")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Roles</CardTitle>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="h-8 px-3 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Role
          </Button>
        </CardHeader>
        <CardContent className="p-3">
          {roles.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">
              No roles found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                {currentRoles.map((role: Role) => (
                  <RoleCard
                    key={role._id}
                    role={role}
                    canEdit={true}
                    canDelete={true}
                    onEdit={setEditRole}
                    onDelete={setDeleteRole}
                    onViewUsers={handleViewUsers} // NEW: Pass onViewUsers prop
                  />
                ))}
              </div>
              {/* NEW: Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="h-2.5 w-2.5" />
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronRight className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                  <span className="text-xs">
                    Showing {startIndex + 1}-{Math.min(endIndex, roles.length)}{" "}
                    of {roles.length} roles
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <CreateRoleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess} // UPDATED: Use new handler
      />
      {editRole && (
        <EditRoleModal
          isOpen={!!editRole}
          onClose={() => setEditRole(null)}
          role={editRole}
          onSuccess={handleEditSuccess} // UPDATED: Use new handler
        />
      )}
      {deleteRole && (
        <DeleteRoleModal
          isOpen={!!deleteRole}
          onClose={() => setDeleteRole(null)}
          role={deleteRole}
          onDelete={deleteMutation.mutate}
        />
      )}
      {viewRole && (
        <ViewRoleUsersModal
          isOpen={!!viewRole}
          onClose={() => setViewRole(null)}
          role={viewRole}
        />
      )}
      {/* NEW: Render ViewRoleUsersModal */}
    </div>
  );
};

// TOP-LEVEL EXPORT: Full EditRoleModal with permissions editing
interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onSuccess: () => void;
}

const formatLabel = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
};

const categories = [
  "UserManagement",
  "DocumentManagement",
  "OrganizationManagement",
] as const;
type PermissionCategory = (typeof categories)[number];

export const EditRoleModal = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}: EditRoleModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  });

  useEffect(() => {
    if (isOpen && role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    }
  }, [isOpen, role]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Role>) =>
      userService.updateRole(role._id, updates),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allRoles"] });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to update role");
      console.error(error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (category: PermissionCategory, perm: string) => {
    setFormData((prev) => {
      const currentPermissions = prev.permissions[category] as Record<
        string,
        boolean
      >;
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [category]: {
            ...currentPermissions,
            [perm]: !currentPermissions[perm],
          },
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameChanged = formData.name !== role.name;
    const descChanged = formData.description !== role.description;
    const permsChanged =
      JSON.stringify(formData.permissions) !== JSON.stringify(role.permissions);

    const updates: Partial<Role> = {};
    if (nameChanged) updates.name = formData.name;
    if (descChanged) updates.description = formData.description;
    if (permsChanged) updates.permissions = formData.permissions;

    if (Object.keys(updates).length === 0) {
      toast.info("No changes detected");
      return;
    }
    updateMutation.mutate(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the role&apos;s name, description, and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Permissions</h4>
            {categories.map((cat) => {
              const catPerms = formData.permissions[cat] as Record<
                string,
                boolean
              >;
              return (
                <div key={cat} className="border p-4 rounded-md">
                  <h5 className="font-medium mb-2">{formatLabel(cat)}</h5>
                  {Object.entries(catPerms).map(([perm, val]) => (
                    <div
                      key={perm}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Checkbox
                        id={`${cat}-${perm}`}
                        checked={!!val}
                        onCheckedChange={() => togglePermission(cat, perm)}
                      />
                      <Label htmlFor={`${cat}-${perm}`}>
                        {formatLabel(perm)}
                      </Label>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
