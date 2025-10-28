// src/pages/Analytics.tsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { userService, organizationService, documentService } from "../lib/api";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import { Layout } from "../components/Layout";
import type { User, Document, Organization, ApiResponse } from "../types";
// import { handleApiError } from "../utils/error-handler";
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
  } = useQuery<ApiResponse<{ metrics: any }>>({
    queryKey: ["userMetrics"],
    queryFn: () => userService.getUserMetrics(),
    enabled: !!user && canViewUsers,
  });

  useEffect(() => {
    if (userMetricsError) {
      console.error("Analytics userMetrics error:", userMetricsError);
      toast.error("Failed to load user metrics");
    }
  }, [userMetricsError]);

  const {
    data: orgMetrics,
    isLoading: orgMetricsLoading,
    error: orgMetricsError,
  } = useQuery<ApiResponse<{ metrics: any }>>({
    queryKey: ["organizationMetrics"],
    queryFn: () => organizationService.getOrganizationMetrics(),
    enabled: !!user && canViewOrganizations,
  });

  useEffect(() => {
    if (orgMetricsError) {
      console.error("Analytics orgMetrics error:", orgMetricsError);
      toast.error("Failed to load organization metrics");
    }
  }, [orgMetricsError]);

  const {
    data: allUsersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery<ApiResponse<{ users: User[] }>>({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers(),
    enabled: !!user && canViewUsers,
  });

  useEffect(() => {
    if (usersError) {
      console.error("Analytics allUsers error:", usersError);
      toast.error("Failed to load users");
    }
  }, [usersError]);

  const {
    data: organizationsData,
    isLoading: orgsLoading,
    error: orgsError,
  } = useQuery<ApiResponse<{ organizations: Organization[] }>>({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: !!user && canViewOrganizations,
  });

  useEffect(() => {
    if (orgsError) {
      console.error("Analytics orgs error:", orgsError);
      toast.error("Failed to load organizations");
    }
  }, [orgsError]);

  const {
    data: allDocumentsData,
    isLoading: docsLoading,
    error: docsError,
  } = useQuery<Document[]>({
    queryKey: ["allDocumentsAnalytics"],
    queryFn: async () => {
      if (!user) return [];
      if (canViewOrganizations) {
        const orgsResponse = await organizationService.getOrganizations();
        const orgs = orgsResponse.data?.organizations || [];
        console.log("Analytics admin orgs:", orgs.length);
        const allDocs = await Promise.all(
          orgs.map(async (org: Organization) => {
            try {
              const docsResponse = await documentService.getDocumentsByOrg(
                org._id.toString()
              );
              return docsResponse.data?.documents || [];
            } catch (err) {
              console.error(`Failed to fetch docs for org ${org._id}:`, err);
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        if (!user.organization?._id) {
          console.warn("Analytics no org for non-admin");
          return [];
        }
        const docsResponse = await documentService.getDocumentsByOrg(
          user.organization._id.toString()
        );
        return docsResponse.data?.documents || [];
      }
    },
    enabled: !!user && canViewDocuments,
  });

  useEffect(() => {
    if (docsError) {
      console.error("Analytics allDocuments error:", docsError);
      toast.error("Failed to load documents");
    }
  }, [docsError]);

  const organizations = useMemo(() => {
    // Flatten nested _id if populated recursively
    const flatOrgs = (organizationsData?.data?.organizations || []).map(
      (org: any) => ({
        _id: typeof org._id === "string" ? org._id : org._id?._id || org._id,
        name: org.name,
        organizationType: org.organizationType,
        documentCount: org.documentCount,
      })
    );
    if (canViewOrganizations) {
      return flatOrgs;
    } else if (user?.organization?._id) {
      return [
        {
          _id: user.organization._id,
          name: "Current Organization",
          organizationType: "tech",
        },
      ];
    }
    return [];
  }, [organizationsData, user?.organization?._id, canViewOrganizations]);

  if (
    authLoading ||
    (canViewAnalytics &&
      (userMetricsLoading ||
        orgMetricsLoading ||
        usersLoading ||
        orgsLoading ||
        docsLoading))
  ) {
    return (
      <Layout user={user || undefined} onLogout={logout}>
        <div className="text-center py-12">Loading analytics...</div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!canViewAnalytics) {
    return (
      <Layout user={user || undefined} onLogout={logout}>
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
    (docsError && canViewDocuments)
  ) {
    console.error("Analytics errors:", {
      userMetricsError,
      orgMetricsError,
      usersError,
      orgsError,
      docsError,
    });
    return (
      <Layout user={user || undefined} onLogout={logout}>
        <div className="text-center py-12 text-destructive">
          Error loading analytics data. Check console for details.
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user || undefined} onLogout={logout}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <AnalyticsCharts
          allUsers={allUsersData?.data?.users || []}
          allDocuments={allDocumentsData || []}
          allOrganizations={organizations}
          userMetrics={userMetrics?.data?.metrics || {}}
          orgMetrics={orgMetrics?.data?.metrics || {}}
        />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
