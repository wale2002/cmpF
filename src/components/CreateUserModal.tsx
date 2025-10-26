// src/components/CreateUserModal.tsx (Cleaned up to avoid duplicate declarations)
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "../lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";
import type { Role } from "../types";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateUserModal = ({ isOpen, onClose, onSuccess }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    Department: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    status: "Active",
  });

  // Fetch roles for dropdown
  const { data: rolesResponse } = useQuery({
    queryKey: ["roles"],
    queryFn: () => userService.getAllRoles(), // Assume this API call exists
    enabled: isOpen,
  });
  const roles: Role[] = rolesResponse?.data?.roles || [];

  const createUserMutation = useMutation({
    mutationFn: (data: typeof formData) => userService.createUser(data),
    onSuccess: () => {
      onSuccess();
      onClose();
      setFormData({ fullName: "", Department: "", email: "", password: "", role: "", phoneNumber: "", status: "Active" });
    },
    onError: (error) => {
      handleApiError(error, "Failed to create user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.Department || !formData.email || !formData.password || !formData.phoneNumber || !formData.role) {
      toast.error("Please fill all required fields");
      return;
    }
    createUserMutation.mutate(formData);
  };

  if (!isOpen) return null; // Early return if closed to avoid rendering

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="Department">Department *</Label>
            <Input
              id="Department"
              value={formData.Department}
              onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};