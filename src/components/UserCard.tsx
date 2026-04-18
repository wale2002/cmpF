// // src/components/UserCard.tsx (Fixed: Renamed lucide 'User' icon to 'UserIcon' to avoid conflict with type import)
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import {
//   UserIcon,
//   Mail,
//   Building,
//   CheckCircle2,
//   XCircle,
//   Edit,
//   Trash2,
// } from "lucide-react"; // FIXED: Renamed 'User' to 'UserIcon'
// import type { User } from "../types";

// interface UserCardProps {
//   user: User;
//   canEdit?: boolean;
//   canDelete?: boolean;
//   onEdit?: (user: User) => void;
//   onDelete?: (user: User) => void;
//   // Additional props for future actions like onView
// }

// const getStatusVariant = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "active":
//       return "default" as const;
//     case "inactive":
//       return "destructive" as const;
//     case "pending":
//       return "secondary" as const;
//     default:
//       return "outline" as const;
//   }
// };

// const getStatusIcon = (status: string) => {
//   switch (status.toLowerCase()) {
//     case "active":
//       return <CheckCircle2 className="h-2.5 w-2.5" />;
//     case "inactive":
//       return <XCircle className="h-2.5 w-2.5" />;
//     default:
//       return <UserIcon className="h-2.5 w-2.5" />; // FIXED: Use UserIcon
//   }
// };

// export function UserCard({
//   user,
//   canEdit = false,
//   canDelete = false,
//   onEdit,
//   onDelete,
// }: UserCardProps) {
//   return (
//     <Card className="max-w-sm w-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 shadow-sm rounded-lg">
//       <CardHeader className="pb-1">
//         <div className="flex items-start justify-between gap-1">
//           <CardTitle className="text-xs leading-4 line-clamp-2 flex-1">
//             {user.fullName}
//           </CardTitle>
//           <Badge variant={getStatusVariant(user.status)} className="text-xs">
//             {getStatusIcon(user.status)}
//             <span className="ml-1">{user.status}</span>
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-2 p-2 sm:p-3">
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <Mail className="h-2.5 w-2.5 flex-shrink-0" />
//           <span className="truncate">{user.email}</span>
//         </div>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <UserIcon className="h-2.5 w-2.5 flex-shrink-0" />{" "}
//           {/* FIXED: Use UserIcon */}
//           <span className="truncate">Role: {user.role?.name || "N/A"}</span>
//         </div>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <Building className="h-2.5 w-2.5 flex-shrink-0" />
//           <span className="truncate">
//             {user.organization?.name || "N/A"}
//           </span>{" "}
//           {/* FIXED: Access .name */}
//         </div>
//         <div className="flex flex-wrap gap-1 pt-1">
//           {/* Placeholder actions; extend as needed, e.g., add onView similar to DocumentCard */}
//           {canEdit && onEdit && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onEdit(user)}
//               aria-label={`Edit ${user.fullName}`}
//               className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
//             >
//               <Edit className="h-2.5 w-2.5 mr-1" />
//               Edit
//             </Button>
//           )}
//           {canDelete && onDelete && (
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => onDelete(user)}
//               aria-label={`Delete ${user.fullName}`}
//               className="h-7 px-1.5 text-xs flex-1 sm:flex-none"
//             >
//               <Trash2 className="h-2.5 w-2.5 mr-1" />
//               Delete
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  User as UserIcon,
  Mail,
  Building,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Shield,
  MoreVertical,
} from "lucide-react";
import type { User } from "../types";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface UserCardProps {
  user: User;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "inactive":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "pending":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return <CheckCircle2 className="h-3 w-3" />;
    case "inactive":
      return <XCircle className="h-3 w-3" />;
    default:
      return <UserIcon className="h-3 w-3" />;
  }
};

export function UserCard({
  user,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: UserCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="relative overflow-hidden bg-zinc-900/40 border-white/5 backdrop-blur-md rounded-[2rem] p-6 group transition-all hover:bg-zinc-900/60 hover:border-white/10">
        {/* Subtle Glow Effect */}
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-colors" />

        <CardContent className="p-0 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center shadow-lg relative">
                <UserIcon className="w-7 h-7 text-white/80" />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050505] flex items-center justify-center ${getStatusStyles(user.status).split(" ")[0]}`}
                >
                  {getStatusIcon(user.status)}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight text-white leading-tight">
                  {user.fullName}
                </h3>
                <Badge
                  variant="outline"
                  className={`mt-1.5 text-[10px] uppercase tracking-widest font-mono border-none ${getStatusStyles(user.status)}`}
                >
                  {user.status}
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-950 border-white/10 rounded-xl p-1.5 min-w-[160px] backdrop-blur-xl"
              >
                {canEdit && onEdit && (
                  <DropdownMenuItem
                    className="rounded-lg gap-3 py-2 text-zinc-400 hover:text-white focus:bg-white/5"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4" /> Edit Profile
                  </DropdownMenuItem>
                )}
                {canDelete && onDelete && (
                  <DropdownMenuItem
                    className="rounded-lg gap-3 py-2 text-rose-500 hover:text-rose-400 focus:bg-rose-500/10"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete User
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                <Mail className="h-4 w-4 text-zinc-500" />
              </div>
              <span className="truncate font-medium">{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                <Shield className="h-4 w-4 text-zinc-500" />
              </div>
              <span className="truncate font-medium">
                Role: {user.role?.name || "Member"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                <Building className="h-4 w-4 text-zinc-500" />
              </div>
              <span className="truncate font-medium">
                {user.organization?.name || "Global Workspace"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
