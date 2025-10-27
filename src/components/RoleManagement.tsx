// src/components/RoleManagement.tsx (Updated with ViewRoleUsersModal integration)
import { useState } from "react";
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
  const itemsPerPage = 6; // NEW: Items per page
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
    return <div className="text-center py-12">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        {handleApiError(error, "Failed to load roles")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Roles</CardTitle>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </CardHeader>
        <CardContent>
          {roles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No roles found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-3 w-3" />
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

// TOP-LEVEL EXPORT: EditRoleModal moved outside the component (fixes TS1128 nesting error)

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onSuccess: () => void;
}

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

  // Fetch all roles or permissions as needed (adapt from userService if needed)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<Role> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "permissions") {
        // Skip or: updates[key as keyof Role] = value as Permissions;
        return;
      }
      const originalValue = role[key as keyof Role];
      if (value !== originalValue && value !== "") {
        if (typeof value === "string") {
          updates[key as keyof Role] = value as any;
        }
      }
    });
    if (Object.keys(updates).length === 0) {
      toast.info("No changes detected");
      return;
    }
    updateMutation.mutate(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>Update role details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
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
          {/* Permissions editing can be expanded with checkboxes or similar */}
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
