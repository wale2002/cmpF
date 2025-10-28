// // // src/components/EditRoleModal.tsx
// // import { useState, useEffect } from "react";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "./ui/dialog";
// // import { Button } from "./ui/button";
// // import { Input } from "./ui/input";
// // import { Label } from "./ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "./ui/select";
// // import { userService } from "../lib/api";
// // import { toast } from "sonner";
// // import type { User, Role, CreateUserRequest } from "../types";

// // interface EditRoleModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   user: User;
// //   onSuccess: () => void;
// // }

// // export const EditRoleModal = ({
// //   isOpen,
// //   onClose,
// //   user,
// //   onSuccess,
// // }: EditRoleModalProps) => {
// //   const queryClient = useQueryClient();
// //   const [formData, setFormData] = useState({
// //     fullName: user.fullName,
// //     email: user.email,
// //     role: user.role._id,
// //     organization: user.organization?._id || "",
// //     status: user.status as "Active" | "InActive" | undefined,
// //     Department: user.Department || "",
// //     phoneNumber: user.phoneNumber || "",
// //   });

// //   const { data: rolesData } = useQuery({
// //     queryKey: ["allRoles"],
// //     queryFn: () => userService.getAllRoles(),
// //     enabled: isOpen,
// //   });

// //   const roles: Role[] = rolesData?.data?.roles || [];

// //   useEffect(() => {
// //     if (isOpen && user) {
// //       setFormData({
// //         fullName: user.fullName,
// //         email: user.email,
// //         role: user.role._id,
// //         organization: user.organization?._id || "",
// //         status: user.status as "Active" | "InActive" | undefined,
// //         Department: user.Department || "",
// //         phoneNumber: user.phoneNumber || "",
// //       });
// //     }
// //   }, [isOpen, user]);

// //   const updateMutation = useMutation({
// //     mutationFn: (updates: Partial<CreateUserRequest>) =>
// //       userService.updateUser(user._id, updates),
// //     onSuccess: () => {
// //       toast.success("Role updated successfully");
// //       queryClient.invalidateQueries({ queryKey: ["allUsers"] });
// //       onSuccess();
// //       onClose();
// //     },
// //     onError: (error: Error) => {
// //       toast.error("Failed to update role");
// //       console.error(error);
// //     },
// //   });

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSelectChange = (name: string, value: string) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: name === "status" ? (value as "Active" | "InActive") : value,
// //     }));
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     const updates: Partial<CreateUserRequest> = {};
// //     Object.entries(formData).forEach(([key, value]) => {
// //       const originalValue =
// //         key === "role" ? user.role._id : user[key as keyof User];
// //       if (value !== originalValue && value !== "") {
// //         if (key === "status") {
// //           if (value === "Active" || value === "InActive") {
// //             updates[key as keyof CreateUserRequest] = value as
// //               | "Active"
// //               | "InActive";
// //           } else {
// //             updates[key as keyof CreateUserRequest] = undefined;
// //           }
// //         } else {
// //           updates[key as keyof CreateUserRequest] = value as any;
// //         }
// //       }
// //     });
// //     if (Object.keys(updates).length === 0) {
// //       toast.info("No changes detected");
// //       return;
// //     }
// //     updateMutation.mutate(updates);
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Edit Role</DialogTitle>
// //           <DialogDescription>Update role details.</DialogDescription>
// //         </DialogHeader>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="space-y-2">
// //             <Label htmlFor="fullName">Full Name</Label>
// //             <Input
// //               id="fullName"
// //               name="fullName"
// //               value={formData.fullName}
// //               onChange={handleInputChange}
// //               required
// //             />
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="email">Email</Label>
// //             <Input
// //               id="email"
// //               name="email"
// //               type="email"
// //               value={formData.email}
// //               onChange={handleInputChange}
// //               required
// //             />
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="Department">Department</Label>
// //             <Input
// //               id="Department"
// //               name="Department"
// //               value={formData.Department}
// //               onChange={handleInputChange}
// //             />
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="phoneNumber">Phone Number</Label>
// //             <Input
// //               id="phoneNumber"
// //               name="phoneNumber"
// //               value={formData.phoneNumber}
// //               onChange={handleInputChange}
// //             />
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="status">Status</Label>
// //             <Select
// //               value={formData.status}
// //               onValueChange={(val) => handleSelectChange("status", val)}
// //             >
// //               <SelectTrigger>
// //                 <SelectValue />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 <SelectItem value="Active">Active</SelectItem>
// //                 <SelectItem value="InActive">InActive</SelectItem>
// //               </SelectContent>
// //             </Select>
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="role">Role</Label>
// //             <Select
// //               value={formData.role}
// //               onValueChange={(val) => handleSelectChange("role", val)}
// //             >
// //               <SelectTrigger>
// //                 <SelectValue />
// //               </SelectTrigger>
// //               <SelectContent>
// //                 {roles.map((role) => (
// //                   <SelectItem key={role._id} value={role._id}>
// //                     {role.name}
// //                   </SelectItem>
// //                 ))}
// //               </SelectContent>
// //             </Select>
// //           </div>
// //           <div className="space-y-2">
// //             <Label htmlFor="organization">Organization ID</Label>
// //             <Input
// //               id="organization"
// //               name="organization"
// //               value={formData.organization}
// //               onChange={handleInputChange}
// //               placeholder="Enter organization ID"
// //             />
// //           </div>
// //           <DialogFooter>
// //             <Button type="button" variant="outline" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit" disabled={updateMutation.isPending}>
// //               {updateMutation.isPending ? "Updating..." : "Update"}
// //             </Button>
// //           </DialogFooter>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };

// // src/components/EditRoleModal.tsx
// import { useState, useEffect } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
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
// import { Textarea } from "./ui/textarea";
// import { Checkbox } from "./ui/checkbox";
// import { Label } from "./ui/label";
// import { userService } from "../lib/api";
// import { toast } from "sonner";
// import type { Role } from "../types";

// interface EditRoleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   role: Role;
//   onSuccess: () => void;
// }

// const formatLabel = (str: string): string => {
//   return str
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .replace(/^./, (c) => c.toUpperCase());
// };

// const categories = [
//   "UserManagement",
//   "DocumentManagement",
//   "OrganizationManagement",
// ] as const;
// type PermissionCategory = (typeof categories)[number];

// export const EditRoleModal = ({
//   isOpen,
//   onClose,
//   role,
//   onSuccess,
// }: EditRoleModalProps) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     name: role.name,
//     description: role.description,
//     permissions: role.permissions,
//   });

//   useEffect(() => {
//     if (isOpen && role) {
//       setFormData({
//         name: role.name,
//         description: role.description,
//         permissions: role.permissions,
//       });
//     }
//   }, [isOpen, role]);

//   const updateMutation = useMutation({
//     mutationFn: (updates: Partial<Role>) =>
//       userService.updateRole(role._id, updates),
//     onSuccess: () => {
//       toast.success("Role updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["allRoles"] });
//       onSuccess();
//       onClose();
//     },
//     onError: (error: Error) => {
//       toast.error("Failed to update role");
//       console.error(error);
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePermission = (category: PermissionCategory, perm: string) => {
//     setFormData((prev) => {
//       const currentPermissions = prev.permissions[category] as Record<
//         string,
//         boolean
//       >;
//       return {
//         ...prev,
//         permissions: {
//           ...prev.permissions,
//           [category]: {
//             ...currentPermissions,
//             [perm]: !currentPermissions[perm],
//           },
//         },
//       };
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const nameChanged = formData.name !== role.name;
//     const descChanged = formData.description !== role.description;
//     const permsChanged =
//       JSON.stringify(formData.permissions) !== JSON.stringify(role.permissions);

//     const updates: Partial<Role> = {};
//     if (nameChanged) updates.name = formData.name;
//     if (descChanged) updates.description = formData.description;
//     if (permsChanged) updates.permissions = formData.permissions;

//     if (Object.keys(updates).length === 0) {
//       toast.info("No changes detected");
//       return;
//     }
//     updateMutation.mutate(updates);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Edit Role</DialogTitle>
//           <DialogDescription>
//             Update the role&apos;s name, description, and permissions.
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//             />
//           </div>
//           <div className="space-y-4">
//             <h4 className="font-semibold">Permissions</h4>
//             {categories.map((cat) => {
//               const catPerms = formData.permissions[cat] as Record<
//                 string,
//                 boolean
//               >;
//               return (
//                 <div key={cat} className="border p-4 rounded-md">
//                   <h5 className="font-medium mb-2">{formatLabel(cat)}</h5>
//                   {Object.entries(catPerms).map(([perm, val]) => (
//                     <div
//                       key={perm}
//                       className="flex items-center space-x-2 mt-2"
//                     >
//                       <Checkbox
//                         id={`${cat}-${perm}`}
//                         checked={!!val}
//                         onCheckedChange={() => togglePermission(cat, perm)}
//                       />
//                       <Label htmlFor={`${cat}-${perm}`}>
//                         {formatLabel(perm)}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               );
//             })}
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { userService } from "../lib/api";
import { toast } from "sonner";
import type { Role } from "../types";

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
      <DialogContent className="sm:max-w-md max-h-[70vh] overflow-y-auto">
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
