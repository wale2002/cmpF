

// // src/components/UserManagement.tsx (Updated to use modal for CreateUserForm)
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { userService } from "../lib/api";
// import { CreateUserModal } from "./CreateUserModal"; // New modal component
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "./ui/table";
// import { Button } from "./ui/button";
// import { Plus } from "lucide-react";
// import { toast } from "sonner";
// import type { User } from "../types";
// import { handleApiError } from "../utils/error-handler";

// export const UserManagement = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const { data: usersResponse, isLoading, error, refetch } = useQuery({
//     queryKey: ["allUsers"],
//     queryFn: () => userService.getAllUsers(),
//     enabled: true,
//     onError: (err) => {
//       console.error("UserManagement fetch error:", err);
//       toast.error("Failed to fetch users");
//     },
//   });

//   const users = usersResponse?.data?.users || usersResponse?.users || [];

//   if (isLoading) {
//     return <div className="text-center py-12">Loading users...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12 text-destructive">
//         {handleApiError(error, "Failed to load users")}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-4">
//           <CardTitle className="text-base sm:text-lg">Users</CardTitle>
//           <Button onClick={() => setShowCreateModal(true)} className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </Button>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="text-xs sm:text-sm px-2 py-3 min-w-[120px]">Name</TableHead>
//                   <TableHead className="text-xs sm:text-sm px-2 py-3 min-w-[150px]">Email</TableHead>
//                   <TableHead className="text-xs sm:text-sm px-2 py-3 min-w-[100px]">Role</TableHead>
//                   <TableHead className="text-xs sm:text-sm px-2 py-3 min-w-[120px]">Organization</TableHead>
//                   <TableHead className="text-xs sm:text-sm px-2 py-3 min-w-[100px]">Status</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {users.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                       No users found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   users.map((user: User) => (
//                     <TableRow key={user._id} className="border-b hover:bg-muted/50">
//                       <TableCell className="text-xs sm:text-sm px-2 py-3 font-medium">{user.fullName}</TableCell>
//                       <TableCell className="text-xs sm:text-sm px-2 py-3">{user.email}</TableCell>
//                       <TableCell className="text-xs sm:text-sm px-2 py-3">{user.role.name}</TableCell>
//                       <TableCell className="text-xs sm:text-sm px-2 py-3">{user.organization || "N/A"}</TableCell>
//                       <TableCell className="text-xs sm:text-sm px-2 py-3">{user.status}</TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//       <CreateUserModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSuccess={() => {
//           refetch();
//           toast.success("User created successfully");
//         }}
//       />
//     </div>
//   );
// };

// src/components/UserManagement.tsx (Updated: Use the fixed EditUserModal with dynamic roles)
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "../lib/api";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { UserCard } from "./UserCard";
import { toast } from "sonner";
import type { User } from "../types";
import { handleApiError } from "../utils/error-handler";

export const UserManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: true,
    onError: (err) => {
      console.error("UserManagement fetch error:", err);
      toast.error("Failed to fetch users");
    },
  });

  const users = usersResponse?.data?.users || usersResponse?.users || [];
  const itemsPerPage = 6;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      refetch();
      setDeleteUser(null);
      setCurrentPage(1);
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      handleApiError(error, "Failed to delete user");
    },
  });

  const handleEditSuccess = () => {
    refetch();
    setCurrentPage(1);
    setEditUser(null);
    toast.success("User updated successfully");
  };

  const handleCreateSuccess = () => {
    refetch();
    setCurrentPage(1);
    setShowCreateModal(false);
    toast.success("User created successfully");
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        {handleApiError(error, "Failed to load users")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base sm:text-lg">Users</CardTitle>
          <Button onClick={() => setShowCreateModal(true)} className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {currentUsers.map((user: User) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    canEdit={true}
                    canDelete={true}
                    onEdit={setEditUser}
                    onDelete={setDeleteUser}
                  />
                ))}
              </div>
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
                    Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length} users
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      {editUser && (
        <EditUserModal
          isOpen={!!editUser}
          onClose={() => setEditUser(null)}
          user={editUser}
          onSuccess={handleEditSuccess}
        />
      )}
      {deleteUser && (
        <DeleteUserModal
          isOpen={!!deleteUser}
          onClose={() => setDeleteUser(null)}
          user={deleteUser}
          onDelete={deleteMutation.mutate}
        />
      )}
    </div>
  );
};