// // // src/components/EditRoleModal.tsx (Modal for editing roles, similar to CreateRoleModal)
// // import { useState } from "react";
// // import { useMutation } from "@tanstack/react-query";
// // import { userService } from "../lib/api";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import { Label } from "./ui/label";
// // import { Checkbox } from "./ui/checkbox";
// // import { toast } from "sonner";
// // import { handleApiError } from "../utils/error-handler";
// // import type { Role } from "../types";

// // interface EditRoleModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   role: Role;
// //   onSuccess: () => void;
// // }

// // const permissionGroups = [
// //   // Same as CreateRoleModal
// //   {
// //     group: "UserManagement",
// //     permissions: [
// //       "viewUsers",
// //       "createUsers",
// //       "editUsers",
// //       "deleteUsers",
// //       "manageUserRoles",
// //     ],
// //   },
// //   {
// //     group: "DocumentManagement",
// //     permissions: [
// //       "viewDocuments",
// //       "uploadDocuments",
// //       "editDocuments",
// //       "deleteDocuments",
// //       "approveDocuments",
// //     ],
// //   },
// //   {
// //     group: "OrganizationManagement",
// //     permissions: [
// //       "viewOrganizations",
// //       "createOrganizations",
// //       "editOrganizations",
// //       "deleteOrganizations",
// //     ],
// //   },
// // ] as const;

// // export const EditRoleModal = ({
// //   isOpen,
// //   onClose,
// //   role,
// //   onSuccess,
// // }: EditRoleModalProps) => {
// //   const [formData, setFormData] = useState({
// //     name: role.name,
// //     description: role.description,
// //     permissions: role.permissions,
// //   });

// //   const updateRoleMutation = useMutation({
// //     mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
// //       userService.updateRole(id, data),
// //     onSuccess,
// //     onError: (error) => {
// //       handleApiError(error, "Failed to update role");
// //     },
// //   });

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!formData.name || !formData.description) {
// //       toast.error("Name and description are required");
// //       return;
// //     }
// //     updateRoleMutation.mutate({ id: role._id, data: formData });
// //   };

// //   const updatePermission = (
// //     group: keyof Role["permissions"],
// //     perm: string,
// //     checked: boolean
// //   ) => {
// //     setFormData({
// //       ...formData,
// //       permissions: {
// //         ...formData.permissions,
// //         [group]: {
// //           ...formData.permissions[group],
// //           [perm]: checked,
// //         },
// //       },
// //     });
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
// //         <DialogHeader>
// //           <DialogTitle>Edit Role: {role.name}</DialogTitle>
// //         </DialogHeader>
// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           <div>
// //             <Label htmlFor="name">Name *</Label>
// //             <Input
// //               id="name"
// //               value={formData.name}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, name: e.target.value })
// //               }
// //               required
// //             />
// //           </div>
// //           <div>
// //             <Label htmlFor="description">Description *</Label>
// //             <Input
// //               id="description"
// //               value={formData.description}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, description: e.target.value })
// //               }
// //               required
// //             />
// //           </div>
// //           <div className="space-y-4">
// //             <Label>Permissions</Label>
// //             {permissionGroups.map((group) => (
// //               <div
// //                 key={group.group}
// //                 className="space-y-2 border p-4 rounded-md"
// //               >
// //                 <h3 className="font-semibold">{group.group}</h3>
// //                 <div className="grid grid-cols-2 gap-2">
// //                   {group.permissions.map((perm) => (
// //                     <div key={perm} className="flex items-center space-x-2">
// //                       <Checkbox
// //                         id={`${group.group}-${perm}`}
// //                         checked={
// //                           formData.permissions[
// //                             group.group as keyof typeof formData.permissions
// //                           ]?.[
// //                             perm as keyof (typeof formData.permissions)[typeof group.group]
// //                           ] || false
// //                         }
// //                         onCheckedChange={(checked) =>
// //                           updatePermission(group.group, perm, !!checked)
// //                         }
// //                       />
// //                       <Label htmlFor={`${group.group}-${perm}`}>{perm}</Label>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <div className="flex justify-end space-x-2 pt-4">
// //             <Button type="button" variant="outline" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit" disabled={updateRoleMutation.isPending}>
// //               {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
// //             </Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/components/EditUserModal.tsx (Updated: Fetch roles dynamically for select)
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
// import type { User, Role, CreateUserRequest } from "../types"; // Assume Role type is defined in types

// interface EditUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: User;
//   onSuccess: () => void;
// }

// export const EditUserModal = ({
//   isOpen,
//   onClose,
//   user,
//   onSuccess,
// }: EditUserModalProps) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     fullName: user.fullName,
//     email: user.email,
//     role: user.role._id,
//     organization: user.organization || "",
//     status: user.status,
//     Department: user.Department || "",
//     phoneNumber: user.phoneNumber || "",
//   });

//   // Fetch roles for select
//   const { data: rolesData } = useQuery({
//     queryKey: ["allRoles"],
//     queryFn: () => userService.getAllRoles(),
//     enabled: isOpen,
//   });

//   const roles: Role[] = rolesData?.data?.roles || [];

//   // Reset form when user changes
//   useEffect(() => {
//     if (isOpen && user) {
//       setFormData({
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role._id,
//         organization: user.organization || "",
//         status: user.status,
//         Department: user.Department || "",
//         phoneNumber: user.phoneNumber || "",
//       });
//     }
//   }, [isOpen, user]);

//   const updateMutation = useMutation({
//     mutationFn: (updates: Partial<CreateUserRequest>) =>
//       userService.updateUser(user._id, updates),
//     onSuccess: () => {
//       toast.success("User updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["allUsers"] });
//       onSuccess();
//       onClose();
//     },
//     // onError: (error) => {
//     //   toast.error("Failed to update user");
//     //   console.error(error);
//     // },
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const updates: Partial<CreateUserRequest> = {};
//     // Compare with original user data
//     Object.entries(formData).forEach(([key, value]) => {
//       const originalValue =
//         key === "role" ? user.role._id : user[key as keyof User];
//       if (value !== originalValue && value !== "") {
//         // In handleSubmit
//         if (key === "status") {
//           updates[key as keyof CreateUserRequest] =
//             (value as "Active" | "InActive") || undefined;
//         } else {
//           updates[key as keyof CreateUserRequest] = value;
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
//           <DialogTitle>Edit User</DialogTitle>
//           <DialogDescription>Update user details.</DialogDescription>
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
import type { User, Role, CreateUserRequest } from "../types"; // Assume Role type is defined in types

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditUserModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    role: user.role._id,
    organization: user.organization || "",
    status: user.status,
    Department: user.Department || "",
    phoneNumber: user.phoneNumber || "",
  });

  // Fetch roles for select
  const { data: rolesData } = useQuery({
    queryKey: ["allRoles"],
    queryFn: () => userService.getAllRoles(),
    enabled: isOpen,
  });

  const roles: Role[] = rolesData?.data?.roles || [];

  // Reset form when user changes
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        role: user.role._id,
        organization: user.organization || "",
        status: user.status,
        Department: user.Department || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [isOpen, user]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<CreateUserRequest>) =>
      userService.updateUser(user._id, updates),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      onSuccess();
      onClose();
    },
    onError: (error: Error) => {
      toast.error("Failed to update user");
      console.error(error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<CreateUserRequest> = {};
    // Compare with original user data
    Object.entries(formData).forEach(([key, value]) => {
      const originalValue =
        key === "role" ? user.role._id : user[key as keyof User];
      if (value !== originalValue && value !== "") {
        // In handleSubmit
        if (key === "status") {
          // If status exists in Role (unlikely), or skip
          updates[key as keyof CreateUserRequest] =
            (value as "Active" | "InActive") || undefined;
        } else {
          updates[key as keyof CreateUserRequest] = value; // Change to Role type
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
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user details.</DialogDescription>
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
