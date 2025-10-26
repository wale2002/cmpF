// src/components/EditRoleModal.tsx (Modal for editing roles, similar to CreateRoleModal)
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "../lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import type { Role } from "../types";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onSuccess: () => void;
}

const permissionGroups = [
  // Same as CreateRoleModal
  {
    group: "UserManagement",
    permissions: [
      "viewUsers",
      "createUsers",
      "editUsers",
      "deleteUsers",
      "manageUserRoles",
    ],
  },
  {
    group: "DocumentManagement",
    permissions: [
      "viewDocuments",
      "uploadDocuments",
      "editDocuments",
      "deleteDocuments",
      "approveDocuments",
    ],
  },
  {
    group: "OrganizationManagement",
    permissions: [
      "viewOrganizations",
      "createOrganizations",
      "editOrganizations",
      "deleteOrganizations",
    ],
  },
] as const;

export const EditRoleModal = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}: EditRoleModalProps) => {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      userService.updateRole(id, data),
    onSuccess,
    onError: (error) => {
      handleApiError(error, "Failed to update role");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error("Name and description are required");
      return;
    }
    updateRoleMutation.mutate({ id: role._id, data: formData });
  };

  const updatePermission = (
    group: keyof Role["permissions"],
    perm: string,
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [group]: {
          ...formData.permissions[group],
          [perm]: checked,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role: {role.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-4">
            <Label>Permissions</Label>
            {permissionGroups.map((group) => (
              <div
                key={group.group}
                className="space-y-2 border p-4 rounded-md"
              >
                <h3 className="font-semibold">{group.group}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.permissions.map((perm) => (
                    <div key={perm} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${group.group}-${perm}`}
                        checked={
                          formData.permissions[
                            group.group as keyof typeof formData.permissions
                          ]?.[
                            perm as keyof (typeof formData.permissions)[typeof group.group]
                          ] || false
                        }
                        onCheckedChange={(checked) =>
                          updatePermission(group.group, perm, !!checked)
                        }
                      />
                      <Label htmlFor={`${group.group}-${perm}`}>{perm}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
