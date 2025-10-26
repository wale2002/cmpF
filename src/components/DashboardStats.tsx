// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { FileText, Building2, Users, Clock } from "lucide-react";
// import { useAuthContext } from "../contexts/AuthContext";  // NEW: For RBAC checks

// interface DashboardStatsProps {
//   totalDocuments: number;
//   recentUploads: number;
//   totalOrganizations: number;
//   totalUsers: number;
//   isAdmin?: boolean;  // DEPRECATED: Use permissions for granular control
// }

// const DashboardStats = ({
//   totalDocuments,
//   recentUploads,
//   totalOrganizations,
//   totalUsers,
//   isAdmin = false,  // Fallback for legacy usage
// }: DashboardStatsProps) => {
//   const { user } = useAuthContext();
//   const isSuperAdmin = user?.role?.name?.toLowerCase() === 'superadmin';
//   const permissions = user?.role?.permissions || {};
//   const canViewOrganizations = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;
//   const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers || false;
//   const effectiveIsAdmin = isAdmin || canViewOrganizations || canViewUsers;

//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//       <Card className="w-full">
//         <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
//           <CardTitle className="text-xs sm:text-sm font-medium text-left">Total Documents</CardTitle>
//           <FileText className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
//         </CardHeader>
//         <CardContent className="pt-0">
//           <div className="text-xl sm:text-2xl font-bold">{totalDocuments}</div>
//           <p className="text-xs sm:text-sm text-muted-foreground mt-1">
//             All documents in your organization
//           </p>
//         </CardContent>
//       </Card>

//       <Card className="w-full">
//         <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
//           <CardTitle className="text-xs sm:text-sm font-medium text-left">Recent Uploads</CardTitle>
//           <Clock className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
//         </CardHeader>
//         <CardContent className="pt-0">
//           <div className="text-xl sm:text-2xl font-bold">{recentUploads}</div>
//           <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last 7 days</p>
//         </CardContent>
//       </Card>

//       {effectiveIsAdmin && canViewOrganizations && (
//         <Card className="w-full">
//           <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
//             <CardTitle className="text-xs sm:text-sm font-medium text-left">Organizations</CardTitle>
//             <Building2 className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="text-xl sm:text-2xl font-bold">{totalOrganizations}</div>
//             <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total organizations</p>
//           </CardContent>
//         </Card>
//       )}

//       {effectiveIsAdmin && canViewUsers && (
//         <Card className="w-full">
//           <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
//             <CardTitle className="text-xs sm:text-sm font-medium text-left">Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="text-xl sm:text-2xl font-bold">{totalUsers}</div>
//             <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total users</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default DashboardStats;


import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, Building2, Users, Clock } from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";  // NEW: For RBAC checks

interface DashboardStatsProps {
  totalDocuments: number;
  recentUploads: number;
  totalOrganizations: number;
  totalUsers: number;
  isAdmin?: boolean;  // DEPRECATED: Use permissions for granular control
}

const DashboardStats = ({
  totalDocuments,
  recentUploads,
  totalOrganizations,
  totalUsers,
  isAdmin = false,  // Fallback for legacy usage
}: DashboardStatsProps) => {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.role?.name?.toLowerCase() === 'superadmin';
  const permissions = user?.role?.permissions || {};
  const canViewOrganizations = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;
  const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const effectiveIsAdmin = isAdmin || canViewOrganizations || canViewUsers;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-left">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl sm:text-2xl font-bold">{totalDocuments}</div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            All documents in your organization
          </p>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-left">Recent Uploads</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl sm:text-2xl font-bold">{recentUploads}</div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Last 7 days</p>
        </CardContent>
      </Card>

      {effectiveIsAdmin && canViewOrganizations && (
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-left">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalOrganizations}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total organizations</p>
          </CardContent>
        </Card>
      )}

      {effectiveIsAdmin && canViewUsers && (
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-left">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground mt-1 sm:mt-0" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total users</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;