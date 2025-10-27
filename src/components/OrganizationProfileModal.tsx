// import { useState, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../components/ui/dialog";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { toast } from "sonner";
// import {
//   Building,
//   Save,
//   X,
//   Briefcase,
//   Plus,
//   User as UserIcon,
//   Shield,
// } from "lucide-react";
// import { userService, organizationService } from "../lib/api";
// import type { User, Organization, CreateUserRequest } from "../types";

// interface OrganizationProfileModalProps {
//   user: User | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: () => void;
// }

// export const OrganizationProfileModal = ({
//   user,
//   isOpen,
//   onClose,
//   onSuccess,
// }: OrganizationProfileModalProps) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     firstName: "",
//     lastName: "",
//     Department: "",
//     email: "",
//     phoneNumber: "",
//     profilePicture: "",
//     jobTitle: "",
//     location: "",
//     timezone: "",
//     language: "",
//     dateFormat: "",
//     organization: "",
//     role: "",
//     status: "Active" as "Active" | "InActive",
//   });
//   const [newOrgName, setNewOrgName] = useState("");
//   const [newOrgType, setNewOrgType] = useState("tech");
//   const [isCreatingOrg, setIsCreatingOrg] = useState(false);

//   // Assume this modal is for self-update; adjust if used elsewhere for admin updates
//   const isSelfUpdate = true;

//   // Fetch organizations for dropdown (invalidate on open to ensure fresh data)
//   const { data: orgsData } = useQuery({
//     queryKey: ["orgsForProfile", isOpen],
//     queryFn: () =>
//       organizationService.getOrganizations({ page: 1, limit: 100 }),
//     enabled: isOpen && !!user,
//   });

//   const organizations: Organization[] = orgsData?.data?.organizations || [];

//   // Populate form with current user data on open
//   useEffect(() => {
//     if (isOpen && user) {
//       setFormData({
//         fullName: user.fullName || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         Department: user.Department || "",
//         email: user.email || "",
//         phoneNumber: user.phoneNumber || "",
//         profilePicture: user.profilePicture || "",
//         jobTitle: user.jobTitle || "",
//         location: user.location || "",
//         timezone: user.timezone || "",
//         language: user.language || "",
//         dateFormat: user.dateFormat || "",
//         organization: user.organization || "",
//         role:
//           user.role?._id ||
//           (typeof user.role === "string" ? user.role : "") ||
//           "",
//         status: user.status || "Active",
//       });
//       setNewOrgName("");
//       setNewOrgType("tech");
//     }
//   }, [isOpen, user]);

//   // Mutation for creating new org
//   const createOrgMutation = useMutation({
//     mutationFn: (data: { name: string; organizationType: string }) =>
//       organizationService.createOrganization(data),
//     onSuccess: (response) => {
//       const newOrg = response.data?.organization;
//       toast.success(`Organization "${newOrg?.name}" created successfully!`);
//       setFormData((prev) => ({ ...prev, organization: newOrg?._id }));
//       queryClient.invalidateQueries({ queryKey: ["orgsForProfile"] });
//       setIsCreatingOrg(false);
//     },
//     onError: (error: Error) => {
//       toast.error(
//         `Failed to create organization: ${error.message || "Please try again."}`
//       );
//       setIsCreatingOrg(false);
//     },
//   });

//   // Mutation for updating user profile
//   const updateUserMutation = useMutation({
//     mutationFn: (updates: Partial<CreateUserRequest>) =>
//       userService.updateUser(user!._id, updates),
//     onSuccess: () => {
//       toast.success("Profile updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       onSuccess?.();
//       onClose();
//     },
//     onError: (error: Error) => {
//       toast.error(
//         `Failed to update profile: ${error.message || "Please try again."}`
//       );
//     },
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCreateOrg = () => {
//     if (!newOrgName.trim()) {
//       toast.error("Organization name is required");
//       return;
//     }
//     setIsCreatingOrg(true);
//     createOrgMutation.mutate({
//       name: newOrgName.trim(),
//       organizationType: newOrgType,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const updates: Partial<CreateUserRequest> = {};
//     Object.entries(formData).forEach(([key, value]) => {
//       // Skip role and status for self-updates to avoid type mismatches
//       if (isSelfUpdate && (key === "role" || key === "status")) {
//         return;
//       }
//       if (value !== "" && value !== user?.[key as keyof User]) {
//         updates[key as keyof CreateUserRequest] = value as any;
//       }
//     });
//     if (Object.keys(updates).length === 0) {
//       toast.info("No changes detected");
//       return;
//     }
//     updateUserMutation.mutate(updates);
//   };

//   if (!user) return null;

//   // Helper for current org display with fallback and type coercion
//   const userOrgId = user.organization?.toString();
//   const currentOrg = organizations.find((o) => o._id.toString() === userOrgId);
//   const currentOrgDisplay = currentOrg
//     ? `${currentOrg.name} (${currentOrg.organizationType}) - ${
//         currentOrg.documentCount || 0
//       } document${(currentOrg.documentCount || 0) !== 1 ? "s" : ""}`
//     : "No organization assigned";

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <UserIcon className="h-5 w-5" />
//             Update Profile & Organization
//           </DialogTitle>
//           <DialogDescription>
//             Manage your personal details and assign an organization for document
//             access.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Personal Details Section */}
//           <div className="space-y-4 border rounded-lg p-4">
//             <h3 className="font-semibold flex items-center gap-2">
//               <UserIcon className="h-4 w-4" />
//               Personal Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                   id="fullName"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   placeholder="Enter full name"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="Department">Department</Label>
//                 <Input
//                   id="Department"
//                   name="Department"
//                   value={formData.Department}
//                   onChange={handleInputChange}
//                   placeholder="Enter department"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter email"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="phoneNumber">Phone Number</Label>
//                 <Input
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleInputChange}
//                   placeholder="Enter phone number"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label htmlFor="profilePicture">Profile Picture URL</Label>
//                 <Input
//                   id="profilePicture"
//                   name="profilePicture"
//                   value={formData.profilePicture}
//                   onChange={handleInputChange}
//                   placeholder="Enter image URL"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Professional Details Section */}
//           <div className="space-y-4 border rounded-lg p-4">
//             <h3 className="font-semibold flex items-center gap-2">
//               <Briefcase className="h-4 w-4" />
//               Professional Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="jobTitle">Job Title</Label>
//                 <Input
//                   id="jobTitle"
//                   name="jobTitle"
//                   value={formData.jobTitle}
//                   onChange={handleInputChange}
//                   placeholder="Enter job title"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   placeholder="Enter location"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="timezone">Timezone</Label>
//                 <Select
//                   value={formData.timezone}
//                   onValueChange={(val) => handleSelectChange("timezone", val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select timezone" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="America/New_York">
//                       America/New_York
//                     </SelectItem>
//                     <SelectItem value="Europe/London">Europe/London</SelectItem>
//                     <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
//                     {/* Add more as needed */}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="language">Language</Label>
//                 <Select
//                   value={formData.language}
//                   onValueChange={(val) => handleSelectChange("language", val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select language" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="en">English</SelectItem>
//                     <SelectItem value="es">Spanish</SelectItem>
//                     <SelectItem value="fr">French</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="dateFormat">Date Format</Label>
//                 <Select
//                   value={formData.dateFormat}
//                   onValueChange={(val) => handleSelectChange("dateFormat", val)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select date format" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
//                     <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
//                     <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Organization Section */}
//           <div className="space-y-4 border rounded-lg p-4">
//             <h3 className="font-semibold flex items-center gap-2">
//               <Building className="h-4 w-4" />
//               Organization
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <Label htmlFor="organization">Select Organization</Label>
//                 <Select
//                   value={formData.organization}
//                   onValueChange={(val) =>
//                     handleSelectChange("organization", val)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue
//                       placeholder={
//                         userOrgId
//                           ? `Current: ${currentOrgDisplay}`
//                           : "Select organization"
//                       }
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {organizations.map((org) => {
//                       const orgId = org._id.toString();
//                       const docCount = org.documentCount || 0;
//                       return (
//                         <SelectItem key={orgId} value={orgId}>
//                           {org.name} ({org.organizationType}) - {docCount}{" "}
//                           document{docCount !== 1 ? "s" : ""}
//                         </SelectItem>
//                       );
//                     })}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="md:col-span-2">
//                 <Label>Or Create New Organization</Label>
//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="New Organization Name"
//                     value={newOrgName}
//                     onChange={(e) => setNewOrgName(e.target.value)}
//                     className="flex-1"
//                   />
//                   <Select value={newOrgType} onValueChange={setNewOrgType}>
//                     <SelectTrigger className="w-32">
//                       <SelectValue placeholder="Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="tech">Tech</SelectItem>
//                       <SelectItem value="finance">Finance</SelectItem>
//                       <SelectItem value="legal">Legal</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Button
//                     type="button"
//                     onClick={handleCreateOrg}
//                     disabled={
//                       !newOrgName.trim() ||
//                       createOrgMutation.isPending ||
//                       isCreatingOrg
//                     }
//                     variant="outline"
//                     size="sm"
//                   >
//                     <Plus className="h-4 w-4 mr-1" />
//                     Create
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Admin Fields (Hidden for Self-Update) */}
//           {!isSelfUpdate && (
//             <div className="space-y-4 border rounded-lg p-4">
//               <h3 className="font-semibold flex items-center gap-2">
//                 <Shield className="h-4 w-4" />
//                 Admin Fields
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="role">Role</Label>
//                   <Select
//                     value={formData.role}
//                     onValueChange={(val) => handleSelectChange("role", val)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="66e9b1a2f3b4c5d6e7f8a9b0">
//                         Super Admin
//                       </SelectItem>
//                       {/* Add dynamic roles */}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="status">Status</Label>
//                   <Select
//                     value={formData.status}
//                     onValueChange={(val) =>
//                       handleSelectChange("status", val as "Active" | "InActive")
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="InActive">InActive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//           )}

//           <DialogFooter className="gap-2">
//             <Button type="button" variant="outline" onClick={onClose}>
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={
//                 updateUserMutation.isPending || createOrgMutation.isPending
//               }
//             >
//               <Save className="h-4 w-4 mr-2" />
//               {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// src/components/OrganizationProfileModal.tsx
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import {
  Building,
  Save,
  X,
  Briefcase,
  Plus,
  User as UserIcon,
  Shield,
} from "lucide-react";
import { userService, organizationService } from "../lib/api";
import type { User, Organization, CreateUserRequest } from "../types";

interface OrganizationProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OrganizationProfileModal = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}: OrganizationProfileModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    Department: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    jobTitle: "",
    location: "",
    timezone: "",
    language: "",
    dateFormat: "",
    organization: "",
    role: "",
    status: "Active" as "Active" | "InActive",
  });
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgType, setNewOrgType] = useState("tech");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  // Assume this modal is for self-update; adjust if used elsewhere for admin updates
  const isSelfUpdate = true;

  // Fetch organizations for dropdown (invalidate on open to ensure fresh data)
  const { data: orgsData } = useQuery({
    queryKey: ["orgsForProfile", isOpen],
    queryFn: () =>
      organizationService.getOrganizations({ page: 1, limit: 100 }),
    enabled: isOpen && !!user,
  });

  const organizations: Organization[] = orgsData?.data?.organizations || [];

  // Populate form with current user data on open
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.fullName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        Department: user.Department || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture || "",
        jobTitle: user.jobTitle || "",
        location: user.location || "",
        timezone: user.timezone || "",
        language: user.language || "",
        dateFormat: user.dateFormat || "",
        organization: user.organization?._id || "",
        role:
          user.role?._id ||
          (typeof user.role === "string" ? user.role : "") ||
          "",
        status: user.status || "Active",
      });
      setNewOrgName("");
      setNewOrgType("tech");
    }
  }, [isOpen, user]);

  // Mutation for creating new org
  const createOrgMutation = useMutation({
    mutationFn: (data: { name: string; organizationType: string }) =>
      organizationService.createOrganization(data),
    onSuccess: (response) => {
      const newOrg = response.data?.organization;
      toast.success(`Organization "${newOrg?.name}" created successfully!`);
      setFormData((prev) => ({ ...prev, organization: newOrg?._id }));
      queryClient.invalidateQueries({ queryKey: ["orgsForProfile"] });
      setIsCreatingOrg(false);
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to create organization: ${error.message || "Please try again."}`
      );
      setIsCreatingOrg(false);
    },
  });

  // Mutation for updating user profile
  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<CreateUserRequest>) =>
      userService.updateUser(user!._id, updates),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to update profile: ${error.message || "Please try again."}`
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrg = () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name is required");
      return;
    }
    setIsCreatingOrg(true);
    createOrgMutation.mutate({
      name: newOrgName.trim(),
      organizationType: newOrgType,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<CreateUserRequest> = {};
    Object.entries(formData).forEach(([key, value]) => {
      // Skip role and status for self-updates to avoid type mismatches
      if (isSelfUpdate && (key === "role" || key === "status")) {
        return;
      }
      if (value !== "" && value !== user?.[key as keyof User]) {
        updates[key as keyof CreateUserRequest] = value as any;
      }
    });
    if (Object.keys(updates).length === 0) {
      toast.info("No changes detected");
      return;
    }
    updateUserMutation.mutate(updates);
  };

  if (!user) return null;

  // Helper for current org display with fallback and type coercion
  const userOrgId =
    user.organization?._id?.toString() || user.organization?.toString() || "";
  const currentOrg = organizations.find((o) => o._id.toString() === userOrgId);
  const currentOrgDisplay = currentOrg
    ? `${currentOrg.name} (${currentOrg.organizationType}) - ${
        currentOrg.documentCount || 0
      } document${(currentOrg.documentCount || 0) !== 1 ? "s" : ""}`
    : "No organization assigned";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Update Profile & Organization
          </DialogTitle>
          <DialogDescription>
            Manage your personal details and assign an organization for document
            access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="Department">Department</Label>
                <Input
                  id="Department"
                  name="Department"
                  value={formData.Department}
                  onChange={handleInputChange}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(val) => handleSelectChange("timezone", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">
                      America/New_York
                    </SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    {/* Add more as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(val) => handleSelectChange("language", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={formData.dateFormat}
                  onValueChange={(val) => handleSelectChange("dateFormat", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Organization Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Organization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="organization">Select Organization</Label>
                <Select
                  value={formData.organization}
                  onValueChange={(val) =>
                    handleSelectChange("organization", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        userOrgId
                          ? `Current: ${currentOrgDisplay}`
                          : "Select organization"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => {
                      const orgId = org._id.toString();
                      const docCount = org.documentCount || 0;
                      return (
                        <SelectItem key={orgId} value={orgId}>
                          {org.name} ({org.organizationType}) - {docCount}{" "}
                          document{docCount !== 1 ? "s" : ""}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Or Create New Organization</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="New Organization Name"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newOrgType} onValueChange={setNewOrgType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleCreateOrg}
                    disabled={
                      !newOrgName.trim() ||
                      createOrgMutation.isPending ||
                      isCreatingOrg
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Fields (Hidden for Self-Update) */}
          {!isSelfUpdate && (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Fields
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(val) => handleSelectChange("role", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="66e9b1a2f3b4c5d6e7f8a9b0">
                        Super Admin
                      </SelectItem>
                      {/* Add dynamic roles */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      handleSelectChange("status", val as "Active" | "InActive")
                    }
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
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                updateUserMutation.isPending || createOrgMutation.isPending
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
