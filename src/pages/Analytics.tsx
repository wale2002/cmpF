// // export default AnalyticsPage;

// // src/pages/AnalyticsPage.tsx
// import { useQuery } from "@tanstack/react-query";
// import { useMemo } from "react";
// import { useAuthContext } from "../contexts/AuthContext";
// import { userService, organizationService, documentService } from "../lib/api";
// import { AnalyticsCharts } from "../components/AnalyticsCharts";
// import { Layout } from "../components/Layout";
// import type { User, Document, Organization } from "../types";
// import { handleApiError } from "../utils/error-handler";
// import { toast } from "sonner";

// const AnalyticsPage = () => {
//   const {
//     user,
//     isAuthenticated,
//     isLoading: authLoading,
//     logout,
//   } = useAuthContext();

//   const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
//   const permissions = user?.role?.permissions || {};
//   const canViewUsers =
//     isSuperAdmin || permissions.UserManagement?.viewUsers || false;
//   const canViewOrganizations =
//     isSuperAdmin ||
//     permissions.OrganizationManagement?.viewOrganizations ||
//     false;
//   const canViewDocuments =
//     isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
//   const canViewAnalytics =
//     isSuperAdmin || (canViewUsers && canViewOrganizations && canViewDocuments);

//   const {
//     data: userMetrics,
//     isLoading: userMetricsLoading,
//     error: userMetricsError,
//   } = useQuery({
//     queryKey: ["userMetrics"],
//     queryFn: () => userService.getUserMetrics(),
//     enabled: !!user && canViewUsers,
//     onError: (err: any) => {
//       console.error("Analytics userMetrics error:", err);
//       toast.error("Failed to load user metrics");
//     },
//   });

//   const {
//     data: orgMetrics,
//     isLoading: orgMetricsLoading,
//     error: orgMetricsError,
//   } = useQuery({
//     queryKey: ["organizationMetrics"],
//     queryFn: () => organizationService.getOrganizationMetrics(),
//     enabled: !!user && canViewOrganizations,
//     onError: (err: any) => {
//       console.error("Analytics orgMetrics error:", err);
//       toast.error("Failed to load organization metrics");
//     },
//   });

//   const {
//     data: allUsersData,
//     isLoading: usersLoading,
//     error: usersError,
//   } = useQuery<{ data?: { users?: User[] }; users?: User[] }>({
//     queryKey: ["allUsers"],
//     queryFn: () => userService.getAllUsers(),
//     enabled: !!user && canViewUsers,
//     onError: (err: any) => {
//       console.error("Analytics allUsers error:", err);
//       toast.error("Failed to load users");
//     },
//   });

//   const {
//     data: organizationsData,
//     isLoading: orgsLoading,
//     error: orgsError,
//   } = useQuery({
//     queryKey: ["organizations"],
//     queryFn: () => organizationService.getOrganizations(),
//     enabled: !!user && canViewOrganizations,
//     onError: (err: any) => {
//       console.error("Analytics orgs error:", err);
//       toast.error("Failed to load organizations");
//     },
//   });

//   const {
//     data: allDocumentsData,
//     isLoading: docsLoading,
//     error: docsError,
//   } = useQuery<{ data?: { documents: Document[] }; documents?: Document[] }>({
//     queryKey: ["allDocumentsAnalytics"],
//     queryFn: async () => {
//       if (!user) return [];
//       if (canViewOrganizations) {
//         const orgsResponse = await organizationService.getOrganizations();
//         const orgs =
//           orgsResponse.data?.organizations || orgsResponse.organizations || [];
//         console.log("Analytics admin orgs:", orgs.length);
//         const allDocs = await Promise.all(
//           orgs.map(async (org: Organization) => {
//             try {
//               const docsResponse = await documentService.getDocumentsByOrg(
//                 org._id.toString()
//               );
//   useQuery<{ data?: { auditLogs: any[]; }; auditLogs?: any[]; }>({
//                 queryKey: ["auditLogs"],
//                 queryFn: () => userService.getAuditLogs(),
//                 enabled: !!user && canViewUsers,
//                 onError: (err: any) => {
//                   console.error("Analytics auditLogs error:", err);
//                   toast.error("Failed to load audit logs");
//                 },
//               });
//         );
//         return allDocs.flat();
//       } else {
//         if (!user.organization) {
//           console.warn("Analytics no org for non-admin");
//           return [];
//         }
//         const docsResponse = await documentService.getDocumentsByOrg(
//           user.organization.toString()
//         );
//         return docsResponse.data?.documents || docsResponse.documents || [];
//       }
//     },
//     enabled: !!user && canViewDocuments,
//     onError: (err: any) => {
//       console.error("Analytics allDocuments error:", err);
//       toast.error("Failed to load documents");
//     },
//   });

//   // NEW: Audit Logs Query
//   const {
//     data: auditLogsData,
//     isLoading: auditLogsLoading,
//     error: auditLogsError,
//   } = useQuery({
//     queryKey: ["auditLogs"],
//     queryFn: () => userService.getAuditLogs(),
//     enabled: !!user && canViewUsers,
//     onError: (err: any) => {
//       console.error("Analytics auditLogs error:", err);
//       toast.error("Failed to load audit logs");
//     },
//   });

//   const organizations = useMemo(() => {
//     if (canViewOrganizations) {
//       return (
//         organizationsData?.data?.organizations ||
//         organizationsData?.organizations ||
//         []
//       );
//     } else if (user?.organization) {
//       return [
//         {
//           _id: user.organization,
//           name: "Current Organization",
//           organizationType: "tech",
//         },
//       ];
//     }
//     return [];
//   }, [organizationsData, user?.organization, canViewOrganizations]);

//   if (
//     authLoading ||
//     (canViewAnalytics &&
//       (userMetricsLoading ||
//         orgMetricsLoading ||
//         usersLoading ||
//         orgsLoading ||
//         docsLoading ||
//         auditLogsLoading))
//   ) {
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12">Loading analytics...</div>
//       </Layout>
//     );
//   }

//   if (!isAuthenticated || !user) {
//     return null;
//   }

//   if (!canViewAnalytics) {
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12 text-muted-foreground">
//           You do not have permission to view analytics.
//         </div>
//       </Layout>
//     );
//   }

//   if (
//     userMetricsError ||
//     orgMetricsError ||
//     usersError ||
//     (orgsError && canViewOrganizations) ||
//     (docsError && canViewDocuments) ||
//     (auditLogsError && canViewUsers)
//   ) {
//     console.error("Analytics errors:", {
//       userMetricsError,
//       orgMetricsError,
//       usersError,
//       orgsError,
//       docsError,
//       auditLogsError,
//     });
//     return (
//       <Layout user={user} onLogout={logout}>
//         <div className="text-center py-12 text-destructive">
//           Error loading analytics data. Check console for details.
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout user={user} onLogout={logout}>
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold text-foreground">
//           Analytics Dashboard
//         </h1>
//         <AnalyticsCharts
//           allUsers={allUsersData?.data?.users || allUsersData?.users || []}
//           allDocuments={allDocumentsData?.data?.documents || allDocumentsData?.documents || []}
//           allOrganizations={organizations}
//           userMetrics={userMetrics?.data?.metrics || userMetrics?.metrics}
//           orgMetrics={orgMetrics?.data?.metrics || orgMetrics?.metrics}
//           auditLogs={auditLogsData?.data?.auditLogs || []} // NEW
//         />
//       </div>
//     </Layout>
//   );
// };

// export default AnalyticsPage;

// src/pages/AnalyticsPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { userService, organizationService, documentService } from "../lib/api";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { Layout } from "../components/Layout";
import type { User, Document, Organization } from "../types";
import { handleApiError } from "../utils/error-handler";
import { toast } from "sonner";

const AnalyticsPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions = user?.role?.permissions || {};
  const canViewUsers =
    isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const canViewOrganizations =
    isSuperAdmin ||
    permissions.OrganizationManagement?.viewOrganizations ||
    false;
  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canViewAnalytics =
    isSuperAdmin || (canViewUsers && canViewOrganizations && canViewDocuments);

  const {
    data: userMetrics,
    isLoading: userMetricsLoading,
    error: userMetricsError,
  } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: () => userService.getUserMetrics(),
    enabled: !!user && canViewUsers,
    onError: (err: any) => {
      console.error("Analytics userMetrics error:", err);
      toast.error("Failed to load user metrics");
    },
  });

  const {
    data: orgMetrics,
    isLoading: orgMetricsLoading,
    error: orgMetricsError,
  } = useQuery({
    queryKey: ["organizationMetrics"],
    queryFn: () => organizationService.getOrganizationMetrics(),
    enabled: !!user && canViewOrganizations,
    onError: (err: any) => {
      console.error("Analytics orgMetrics error:", err);
      toast.error("Failed to load organization metrics");
    },
  });

  const {
    data: allUsersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<{ data?: { users?: User[] }; users?: User[] }>({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: !!user && canViewUsers,
    onError: (err: any) => {
      console.error("Analytics allUsers error:", err);
      toast.error("Failed to load users");
    },
  });

  const {
    data: organizationsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: !!user && canViewOrganizations,
    onError: (err: any) => {
      console.error("Analytics orgs error:", err);
      toast.error("Failed to load organizations");
    },
  });

  const {
    data: allDocumentsData,
    isLoading: docsLoading,
    error: docsError,
  } = useQuery<{ data?: { documents: Document[] }; documents?: Document[] }>({
    queryKey: ["allDocumentsAnalytics"],
    queryFn: async () => {
      if (!user) return [];
      if (canViewOrganizations) {
        const orgsResponse = await organizationService.getOrganizations();
        const orgs =
          orgsResponse.data?.organizations || orgsResponse.organizations || [];
        console.log("Analytics admin orgs:", orgs.length);
        const allDocs = await Promise.all(
          orgs.map(async (org: Organization) => {
            try {
              const docsResponse = await documentService.getDocumentsByOrg(
                org._id.toString()
              );
              return (
                docsResponse.data?.documents || docsResponse.documents || []
              );
            } catch (err) {
              console.error(`Failed to fetch docs for org ${org._id}:`, err);
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        if (!user.organization) {
          console.warn("Analytics no org for non-admin");
          return [];
        }
        const docsResponse = await documentService.getDocumentsByOrg(
          user.organization.toString()
        );
        return docsResponse.data?.documents || docsResponse.documents || [];
      }
    },
    enabled: !!user && canViewDocuments,
    onError: (err: any) => {
      console.error("Analytics allDocuments error:", err);
      toast.error("Failed to load documents");
    },
  });

  // NEW: Audit Logs Query (separate from allDocuments)
  const {
    data: auditLogsData,
    isLoading: auditLogsLoading,
    error: auditLogsError,
  } = useQuery<{ data?: { auditLogs: any[] }; auditLogs?: any[] }>({
    queryKey: ["auditLogs"],
    queryFn: () => userService.getAuditLogs(),
    enabled: !!user && canViewUsers,
    onError: (err: any) => {
      console.error("Analytics auditLogs error:", err);
      toast.error("Failed to load audit logs");
    },
  });

  const organizations = useMemo(() => {
    if (canViewOrganizations) {
      return (
        organizationsData?.data?.organizations ||
        organizationsData?.organizations ||
        []
      );
    } else if (user?.organization) {
      return [
        {
          _id: user.organization,
          name: "Current Organization",
          organizationType: "tech",
        },
      ];
    }
    return [];
  }, [organizationsData, user?.organization, canViewOrganizations]);

  if (
    authLoading ||
    (canViewAnalytics &&
      (userMetricsLoading ||
        orgMetricsLoading ||
        usersLoading ||
        orgsLoading ||
        docsLoading ||
        auditLogsLoading))
  ) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="text-center py-12">Loading analytics...</div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!canViewAnalytics) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="text-center py-12 text-muted-foreground">
          You do not have permission to view analytics.
        </div>
      </Layout>
    );
  }

  if (
    userMetricsError ||
    orgMetricsError ||
    usersError ||
    (orgsError && canViewOrganizations) ||
    (docsError && canViewDocuments) ||
    (auditLogsError && canViewUsers)
  ) {
    console.error("Analytics errors:", {
      userMetricsError,
      orgMetricsError,
      usersError,
      orgsError,
      docsError,
      auditLogsError,
    });
    return (
      <Layout user={user} onLogout={logout}>
        <div className="text-center py-12 text-destructive">
          Error loading analytics data. Check console for details.
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <AnalyticsCharts
          allUsers={allUsersData?.data?.users || allUsersData?.users || []}
          allDocuments={
            allDocumentsData?.data?.documents ||
            allDocumentsData?.documents ||
            []
          }
          allOrganizations={organizations}
          userMetrics={userMetrics?.data?.metrics || userMetrics?.metrics}
          orgMetrics={orgMetrics?.data?.metrics || orgMetrics?.metrics}
          auditLogs={auditLogsData?.data?.auditLogs || []} // NEW
        />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
