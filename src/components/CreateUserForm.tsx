// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// // src/components/CreateUserForm.tsx
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
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
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "./ui/form";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { userService, organizationService } from "../lib/api";
// import { handleApiError } from "../utils/error-handler";
// import { toast } from "sonner";
// import type { CreateUserRequest, Organization } from "../types";
// import { useQuery } from "@tanstack/react-query";

// const createUserSchema = z.object({
//   fullName: z.string().min(2, "Full name must be at least 2 characters"),
//   email: z.string().email("Invalid email format"),
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters")
//     .regex(
//       /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
//       "Password must contain at least one letter and one number"
//     ),
//   role: z.string().min(1, "Role is required"), // FIXED: Dynamic string (ID)
//   organization: z.string().min(1, "Organization is required"),
//   Department: z.string().min(1, "Department is required"),
//   phoneNumber: z.string().min(1, "Phone number is required"),
//   status: z.enum(["Active", "InActive"]).default("Active"),
// });

// type CreateUserFormData = z.infer<typeof createUserSchema>;

// interface CreateUserFormProps {
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export const CreateUserForm = ({
//   onSuccess,
//   onCancel,
// }: CreateUserFormProps) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const { data: organizationsResponse, isLoading: orgsLoading } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//   });

//   // FIXED: Fetch roles dynamically from backend
//   const { data: rolesResponse, isLoading: rolesLoading } = useQuery({
//     queryKey: ["roles"],
//     queryFn: () => userService.getAllRoles(),
//     onError: (err: unknown) => {
//       console.error("CreateUserForm roles error:", err); // Debug
//       toast.error("Failed to load roles");
//     },
//   });

//   const organizations =
//     organizationsResponse?.data?.organizations ||
//     organizationsResponse?.organizations ||
//     [];
//   const roles = rolesResponse?.data?.roles || [];

//   console.log("CreateUserForm data:", {
//     orgs: organizations.length,
//     roles: roles.length,
//   }); // Debug

//   const form = useForm<CreateUserFormData>({
//     resolver: zodResolver(createUserSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       role: "",
//       organization: "",
//       Department: "",
//       phoneNumber: "",
//       status: "Active",
//     },
//   });

//   const onSubmit = async (data: CreateUserFormData) => {
//     setIsLoading(true);
//     try {
//       const response = await userService.createUser(data as CreateUserRequest);
//       toast.success(response.data.message || "User created successfully");
//       form.reset();
//       onSuccess?.();
//     } catch (error) {
//       handleApiError(error, "Failed to create user");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (orgsLoading || rolesLoading) {
//     return <div className="text-center py-4">Loading form data...</div>;
//   }

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle>Create New User</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter full name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input type="email" placeholder="Enter email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="password"
//                       placeholder="Enter password"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="Department"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Department</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter department" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phoneNumber"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter phone number" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* FIXED: Dynamic roles from getAllRoles */}
//             <FormField
//               control={form.control}
//               name="role"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Role</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select role" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {roles.map((role: any) => (
//                         <SelectItem key={role._id} value={role._id}>
//                           {role.name} ({role.usersAssigned || 0} users)
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="organization"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Organization</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select organization" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {organizations.map((org: Organization) => (
//                         <SelectItem key={org._id} value={org._id.toString()}>
//                           {org.name} ({org.documentCount || 0} docs)
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="status"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Status</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Active">Active</SelectItem>
//                       <SelectItem value="InActive">InActive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex space-x-2 pt-4">
//               <Button type="submit" disabled={isLoading} className="flex-1">
//                 {isLoading ? "Creating..." : "Create User"}
//               </Button>
//               {onCancel && (
//                 <Button type="button" variant="outline" onClick={onCancel}>
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// src/components/CreateUserForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler, Control, FieldPath } from "react-hook-form"; // Type-only import for types
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { userService, organizationService } from "../lib/api";
import { handleApiError } from "../utils/error-handler";
import { toast } from "sonner";
import type { CreateUserRequest, Organization, ApiResponse } from "../types";
import { useQuery } from "@tanstack/react-query";

const createUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must contain at least one letter and one number"
    ),
  role: z.string().min(1, "Role is required"), // FIXED: Dynamic string (ID)
  organization: z.string().min(1, "Organization is required"),
  Department: z.string().min(1, "Department is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  status: z.enum(["Active", "InActive"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateUserForm = ({
  onSuccess,
  onCancel,
}: CreateUserFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: organizationsResponse, isLoading: orgsLoading } = useQuery<
    ApiResponse<{
      organizations: Organization[];
      total: number;
      page: number;
      totalPages: number;
    }>
  >({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
  });

  // FIXED: Fetch roles dynamically from backend
  const { data: rolesResponse, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => userService.getAllRoles(),
  });

  const organizations = organizationsResponse?.data?.organizations || [];
  const roles = rolesResponse?.data?.roles || [];

  console.log("CreateUserForm data:", {
    orgs: organizations.length,
    roles: roles.length,
  }); // Debug

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "",
      organization: "",
      Department: "",
      phoneNumber: "",
      status: "Active" as const,
    },
  });

  const onSubmit: SubmitHandler<CreateUserFormData> = async (data) => {
    setIsLoading(true);
    try {
      const response = await userService.createUser(data as CreateUserRequest);
      toast.success(response.data.message || "User created successfully");
      form.reset();
      onSuccess?.();
    } catch (error) {
      handleApiError(error, "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  if (orgsLoading || rolesLoading) {
    return <div className="text-center py-4">Loading form data...</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="Department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* FIXED: Dynamic roles from getAllRoles */}
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role: any) => (
                        <SelectItem key={role._id} value={role._id}>
                          {role.name} ({role.usersAssigned || 0} users)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org: Organization) => (
                        <SelectItem key={org._id} value={org._id.toString()}>
                          {org.name} ({org.documentCount || 0} docs)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField<CreateUserFormData, FieldPath<CreateUserFormData>>
              control={form.control as Control<CreateUserFormData>}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="InActive">InActive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create User"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
