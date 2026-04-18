// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { userService } from "../lib/api";
// import { CreateUserModal } from "./CreateUserModal";
// import { EditUserModal } from "./EditUserModal";
// import { DeleteUserModal } from "./DeleteUserModal";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Button } from "./ui/button";
// import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
// import { UserCard } from "./UserCard";
// import { toast } from "sonner";
// import type { User, ApiResponse } from "../types"; // FIXED: Import types
// import { handleApiError } from "../utils/error-handler"; // Assume exists

// // FIXED: Define response type
// type UsersResponse = ApiResponse<{
//   users: User[];
//   total: number;
//   page: number;
//   totalPages: number;
// }>;

// export const UserManagement = () => {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [editUser, setEditUser] = useState<User | null>(null);
//   const [deleteUser, setDeleteUser] = useState<User | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const {
//     data: usersResponse,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<UsersResponse, Error>({
//     queryKey: ["allUsers"],
//     queryFn: () => userService.getAllUsers(),
//     enabled: true,
//     // FIXED: Remove onError; handle via returned error below
//   });

//   // FIXED: Safe data access with typing
//   const users = usersResponse?.data?.users || [];
//   const itemsPerPage = 6;
//   const totalPages = Math.ceil(users.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentUsers = users.slice(startIndex, endIndex);

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const deleteMutation = useMutation({
//     mutationFn: (userId: string) => userService.deleteUser(userId),
//     onSuccess: () => {
//       refetch();
//       setDeleteUser(null);
//       setCurrentPage(1);
//       toast.success("User deleted successfully");
//     },
//     onError: (error: Error) => {
//       // FIXED: Explicit Error type
//       handleApiError(error, "Failed to delete user");
//     },
//   });

//   const handleEditSuccess = () => {
//     refetch();
//     setCurrentPage(1);
//     setEditUser(null);
//     toast.success("User updated successfully");
//   };

//   const handleCreateSuccess = () => {
//     refetch();
//     setCurrentPage(1);
//     setShowCreateModal(false);
//     toast.success("User created successfully");
//   };

//   if (isLoading) {
//     return <div className="text-center py-12">Loading users...</div>;
//   }

//   if (error) {
//     // FIXED: Explicit err type
//     const handleQueryError = (err: Error) => {
//       console.error("UserManagement fetch error:", err);
//       toast.error("Failed to fetch users");
//     };
//     handleQueryError(error);
//     return (
//       <div className="text-center py-12 text-destructive">
//         Failed to load users
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between pb-4">
//           <CardTitle className="text-base sm:text-lg">Users</CardTitle>
//           <Button
//             onClick={() => setShowCreateModal(true)}
//             className="h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {users.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               No users found
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
//                 {currentUsers.map((user: User) => (
//                   <UserCard
//                     key={user._id}
//                     user={user}
//                     canEdit={true}
//                     canDelete={true}
//                     onEdit={setEditUser}
//                     onDelete={setDeleteUser}
//                   />
//                 ))}
//               </div>
//               {totalPages > 1 && (
//                 <div className="flex items-center justify-between text-xs text-muted-foreground">
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="h-8 w-8 p-0"
//                     >
//                       <ChevronLeft className="h-3 w-3" />
//                     </Button>
//                     <span>
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="h-8 w-8 p-0"
//                     >
//                       <ChevronRight className="h-3 w-3" />
//                     </Button>
//                   </div>
//                   <span className="text-xs">
//                     Showing {startIndex + 1}-{Math.min(endIndex, users.length)}{" "}
//                     of {users.length} users
//                   </span>
//                 </div>
//               )}
//             </>
//           )}
//         </CardContent>
//       </Card>
//       <CreateUserModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSuccess={handleCreateSuccess}
//       />
//       {editUser && (
//         <EditUserModal
//           isOpen={!!editUser}
//           onClose={() => setEditUser(null)}
//           user={editUser}
//           onSuccess={handleEditSuccess}
//         />
//       )}
//       {deleteUser && (
//         <DeleteUserModal
//           isOpen={!!deleteUser}
//           onClose={() => setDeleteUser(null)}
//           user={deleteUser}
//           onDelete={deleteMutation.mutate}
//         />
//       )}
//     </div>
//   );
// };

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { userService } from "../lib/api";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { UserCard } from "./UserCard";
import { toast } from "sonner";
import type { User, ApiResponse } from "../types";
import { handleApiError } from "../utils/error-handler";
import { motion, AnimatePresence } from "framer-motion";

type UsersResponse = ApiResponse<{
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}>;

export const UserManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<UsersResponse, Error>({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: true,
  });

  const users = usersResponse?.data?.users || [];

  // Local filtering for UX (ideally handled by API)
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete user");
    },
  });

  const handleEditSuccess = () => {
    refetch();
    setEditUser(null);
    toast.success("User updated successfully");
  };

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateModal(false);
    toast.success("User created successfully");
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          Retrieving Directory
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-rose-500/5 border border-rose-500/10 rounded-[2rem]">
        <Users className="w-12 h-12 text-rose-500/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sync Interrupted</h3>
        <p className="text-zinc-500 text-sm max-w-xs mb-6">
          Failed to synchronize with the identity provider. Please verify your
          connection.
        </p>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-xl border-white/10 hover:bg-white/5 text-white"
        >
          Retry Sync
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all placeholder:text-zinc-600 text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="h-12 px-5 rounded-2xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 flex-1 md:flex-none"
          >
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="h-12 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest flex-1 md:flex-none shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Identity
          </Button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[300px] flex flex-col items-center justify-center text-center p-12 bg-white/2 border border-white/5 rounded-[2.5rem]"
            >
              <Users className="w-12 h-12 text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-medium">
                No identities match your criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Showing {startIndex + 1} —{" "}
            {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
            entries
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-12 w-12 rounded-2xl border-white/5 bg-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-mono transition-all ${
                    currentPage === i + 1
                      ? "bg-white text-black font-bold shadow-lg"
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-12 w-12 rounded-2xl border-white/5 bg-white/5 text-zinc-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

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
