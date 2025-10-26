// src/components/DeleteRoleModal.tsx (Simple confirmation modal for deleting roles)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import type { Role } from "../types";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onDelete: (roleId: string) => void;
}

export const DeleteRoleModal = ({ isOpen, onClose, role, onDelete }: DeleteRoleModalProps) => {
  const handleDelete = () => {
    onDelete(role._id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the role "{role.name}"? This action cannot be undone. Users assigned to this role will need to be reassigned.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};