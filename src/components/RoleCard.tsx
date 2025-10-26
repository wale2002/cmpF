// src/components/RoleCard.tsx (New card component for roles, inspired by DocumentCard logic)
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Users, Shield, Edit, Trash2 } from "lucide-react";
import type { Role } from "../types";

interface RoleCardProps {
  role: Role;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

export function RoleCard({
  role,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
}: RoleCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs sm:text-sm lg:text-base leading-5 line-clamp-2">{role.name}</CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2">{role.description || 'No description'}</p>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{role.usersAssigned || 0} users assigned</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 flex-shrink-0" />
            <span>{role.totalPermissions || 0} permissions</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {canEdit && onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(role)}
              aria-label={`Edit ${role.name}`}
              className="h-8 px-2 text-xs flex-1 sm:flex-none"
            >
              <Edit className="h-3 w-3 mr-1" />
            </Button>
          )}
          {canDelete && onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(role)}
              aria-label={`Delete ${role.name}`}
              className="h-8 px-2 text-xs flex-1 sm:flex-none"
            >
              <Trash2 className="h-3 w-3 mr-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}