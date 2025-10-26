// // src/components/UserCard.tsx (Fixed: Added missing imports for Button, Edit, Trash2)
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button"; // FIXED: Import Button
// import { User, Mail, Building, CheckCircle2, XCircle, Edit, Trash2 } from "lucide-react"; // FIXED: Added Edit and Trash2
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
//       return <CheckCircle2 className="h-3 w-3" />;
//     case "inactive":
//       return <XCircle className="h-3 w-3" />;
//     default:
//       return <User className="h-3 w-3" />;
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
//     <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 shadow-sm rounded-xl">
//       <CardHeader className="pb-2">
//         <div className="flex items-start justify-between gap-2">
//           <CardTitle className="text-xs sm:text-sm lg:text-base leading-5 line-clamp-2 flex-1">{user.fullName}</CardTitle>
//           <Badge variant={getStatusVariant(user.status)} className="text-xs">
//             {getStatusIcon(user.status)}
//             <span className="ml-1">{user.status}</span>
//           </Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-3 p-3 sm:p-4">
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <Mail className="h-3 w-3 flex-shrink-0" />
//           <span className="truncate">{user.email}</span>
//         </div>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <User className="h-3 w-3 flex-shrink-0" />
//           <span className="truncate">Role: {user.role?.name || 'N/A'}</span>
//         </div>
//         <div className="flex items-center gap-1 text-xs text-muted-foreground">
//           <Building className="h-3 w-3 flex-shrink-0" />
//           <span className="truncate">{user.organization || 'N/A'}</span>
//         </div>
//         <div className="flex flex-wrap gap-1 pt-1">
//           {/* Placeholder actions; extend as needed, e.g., add onView similar to DocumentCard */}
//           {canEdit && onEdit && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onEdit(user)}
//               aria-label={`Edit ${user.fullName}`}
//               className="h-8 px-2 text-xs flex-1 sm:flex-none"
//             >
//               <Edit className="h-3 w-3 mr-1" />
//               Edit
//             </Button>
//           )}
//           {canDelete && onDelete && (
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => onDelete(user)}
//               aria-label={`Delete ${user.fullName}`}
//               className="h-8 px-2 text-xs flex-1 sm:flex-none"
//             >
//               <Trash2 className="h-3 w-3 mr-1" />
//               Delete
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// src/components/UserCard.tsx (Fixed: Renamed lucide 'User' icon to 'UserIcon' to avoid conflict with type import)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  UserIcon,
  Mail,
  Building,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react"; // FIXED: Renamed 'User' to 'UserIcon'
import type { User } from "../types";

interface UserCardProps {
  user: User;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  // Additional props for future actions like onView
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "default" as const;
    case "inactive":
      return "destructive" as const;
    case "pending":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return <CheckCircle2 className="h-3 w-3" />;
    case "inactive":
      return <XCircle className="h-3 w-3" />;
    default:
      return <UserIcon className="h-3 w-3" />; // FIXED: Use UserIcon
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
    <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xs sm:text-sm lg:text-base leading-5 line-clamp-2 flex-1">
            {user.fullName}
          </CardTitle>
          <Badge variant={getStatusVariant(user.status)} className="text-xs">
            {getStatusIcon(user.status)}
            <span className="ml-1">{user.status}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <UserIcon className="h-3 w-3 flex-shrink-0" />{" "}
          {/* FIXED: Use UserIcon */}
          <span className="truncate">Role: {user.role?.name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Building className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{user.organization || "N/A"}</span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {/* Placeholder actions; extend as needed, e.g., add onView similar to DocumentCard */}
          {canEdit && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(user)}
              aria-label={`Edit ${user.fullName}`}
              className="h-8 px-2 text-xs flex-1 sm:flex-none"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(user)}
              aria-label={`Delete ${user.fullName}`}
              className="h-8 px-2 text-xs flex-1 sm:flex-none"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
