// // src/components/ViewRoleUsersModal.tsx (NEW: View Role Users Modal)
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
// import type { Role } from "../types";

// interface ViewRoleUsersModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   role: Role;
// }

// export const ViewRoleUsersModal = ({ isOpen, onClose, role }: ViewRoleUsersModalProps) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl">
//         <DialogHeader>
//           <DialogTitle>Users Assigned to "{role.name}"</DialogTitle>
//         </DialogHeader>
//         <div className="py-4">
//           {role.users && role.users.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User ID</TableHead>
//                   <TableHead>Email</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {role.users.map((user) => (
//                   <TableRow key={user._id}>
//                     <TableCell className="font-mono text-xs">{user._id}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p className="text-muted-foreground text-center py-8">No users assigned to this role.</p>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// src/components/ViewRoleUsersModal.tsx (UPDATED: Remove User ID column and add responsive table)
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Role } from "../types";

interface ViewRoleUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export const ViewRoleUsersModal = ({ isOpen, onClose, role }: ViewRoleUsersModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Users Assigned to "{role.name}"</DialogTitle>
        </DialogHeader>
        <div className="py-4 overflow-x-auto">
          {role.users && role.users.length > 0 ? (
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Full Name</TableHead>
                  <TableHead className="w-[150px]">Department</TableHead>
                  <TableHead className="w-[150px]">Organization</TableHead>
                  <TableHead className="w-[250px]">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {role.users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                    <TableCell>{user.Department || 'N/A'}</TableCell>
                    <TableCell>{user.organization || 'N/A'}</TableCell>
                    <TableCell className="break-all">{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No users assigned to this role.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};