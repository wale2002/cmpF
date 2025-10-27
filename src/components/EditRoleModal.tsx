// import { useState, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "./ui/dialog";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { userService } from "../lib/api";
// import { toast } from "sonner";
// import type { User, Role, CreateUserRequest } from "../types";

// interface EditRoleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: User;
//   onSuccess: () => void;
// }

// export const EditRoleModal = ({
//   isOpen,
//   onClose,
//   user,
//   onSuccess,
// }: EditRoleModalProps) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     fullName: user.fullName,
//     email: user.email,
//     role: user.role._id,
//     organization: user.organization || "",
//     status: user.status as "Active" | "InActive" | undefined,
//     Department: user.Department || "",
//     phoneNumber: user.phoneNumber || "",
//   });

//   const { data: rolesData } = useQuery({
//     queryKey: ["allRoles"],
//     queryFn: () => userService.getAllRoles(),
//     enabled: isOpen,
//   });

//   const roles: Role[] = rolesData?.data?.roles || [];

//   useEffect(() => {
//     if (isOpen && user) {
//       setFormData({
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role._id,
//         organization: user.organization || "",
//         status: user.status as "Active" | "InActive" | undefined,
//         Department: user.Department || "",
//         phoneNumber: user.phoneNumber || "",
//       });
//     }
//   }, [isOpen, user]);

//   const updateMutation = useMutation({
//     mutationFn: (updates: Partial<CreateUserRequest>) =>
//       userService.updateUser(user._id, updates),
//     onSuccess: () => {
//       toast.success("Role updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["allUsers"] });
//       onSuccess();
//       onClose();
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to update role");
//       console.error(error);
//     },
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "status" ? (value as "Active" | "InActive") : value,
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const updates: Partial<CreateUserRequest> = {};
//     Object.entries(formData).forEach(([key, value]) => {
//       const originalValue =
//         key === "role" ? user.role._id : user[key as keyof User];
//       if (value !== originalValue && value !== "") {
//         if (key === "status") {
//           if (value === "Active" || value === "InActive") {
//             updates[key as keyof CreateUserRequest] = value as
//               | "Active"
//               | "InActive";
//           } else {
//             updates[key as keyof CreateUserRequest] = undefined;
//           }
//         } else {
//           updates[key as keyof CreateUserRequest] = value as any;
//         }
//       }
//     });
//     if (Object.keys(updates).length === 0) {
//       toast.info("No changes detected");
//       return;
//     }
//     updateMutation.mutate(updates);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Edit Role</DialogTitle>
//           <DialogDescription>Update role details.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="fullName">Full Name</Label>
//             <Input
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="Department">Department</Label>
//             <Input
//               id="Department"
//               name="Department"
//               value={formData.Department}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="phoneNumber">Phone Number</Label>
//             <Input
//               id="phoneNumber"
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="status">Status</Label>
//             <Select
//               value={formData.status}
//               onValueChange={(val) => handleSelectChange("status", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Active">Active</SelectItem>
//                 <SelectItem value="InActive">InActive</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="role">Role</Label>
//             <Select
//               value={formData.role}
//               onValueChange={(val) => handleSelectChange("role", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {roles.map((role) => (
//                   <SelectItem key={role._id} value={role._id}>
//                     {role.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="organization">Organization ID</Label>
//             <Input
//               id="organization"
//               name="organization"
//               value={formData.organization}
//               onChange={handleInputChange}
//               placeholder="Enter organization ID"
//             />
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={updateMutation.isPending}>
//               {updateMutation.isPending ? "Updating..." : "Update"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// src/components/EditRoleModal.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { userService } from "../lib/api";
import { toast } from "sonner";
import type { User, Role, CreateUserRequest } from "../types";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export const EditRoleModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditRoleModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    role: user.role._id,
    organization: user.organization?._id || "",
    status: user.status as "Active" | "InActive" | undefined,
    Department: user.Department || "",
    phoneNumber: user.phoneNumber || "",
  });

  const { data: rolesData } = useQuery({
    queryKey: ["allRoles"],
    queryFn: () => userService.getAllRoles(),
    enabled: isOpen,
  });

  const roles: Role[] = rolesData?.data?.roles || [];

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role._id,
        organization: user.organization?._id || "",
        status: user.status as "Active" | "InActive" | undefined,
        Department: user.Department || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [isOpen, user]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<CreateUserRequest>) =>
      userService.updateUser(user._id, updates),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to update role");
      console.error(error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? (value as "Active" | "InActive") : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<CreateUserRequest> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const originalValue =
        key === "role" ? user.role._id : user[key as keyof User];
      if (value !== originalValue && value !== "") {
        if (key === "status") {
          if (value === "Active" || value === "InActive") {
            updates[key as keyof CreateUserRequest] = value as
              | "Active"
              | "InActive";
          } else {
            updates[key as keyof CreateUserRequest] = undefined;
          }
        } else {
          updates[key as keyof CreateUserRequest] = value as any;
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
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="Department">Department</Label>
            <Input
              id="Department"
              name="Department"
              value={formData.Department}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleSelectChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => handleSelectChange("role", val)}
            >
              <SelectTrigger>
                <SelectValue />
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
          <div className="space-y-2">
            <Label htmlFor="organization">Organization ID</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Enter organization ID"
            />
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
