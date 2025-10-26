


import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import DashboardStats from "../components/DashboardStats";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import FolderManagement from "../components/FolderManagement";
import { Layout } from "../components/Layout";
import NotificationsModal from "../components/NotificationsModal";
import OrganizationFolders from "../components/OrganizationFolders";
import { RoleManagement } from "../components/RoleManagement";
import { UserManagement } from "../components/UserManagement";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  Filter,
  FolderOpen,
  Grid3X3,
  Building,
  FileText,
  Upload,
  BarChart3,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, userService, organizationService } from "../lib/api";
import type { Document, Organization } from "../types";
import { handleApiError } from "../utils/error-handler";
import { useQuery } from "@tanstack/react-query";

const PAGE_LIMIT = 9999;
const DOCS_PAGE_SIZE = 6;

const Dashboard = () => {
  const {
    user,
    logout,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">("grid");
  const [activeTab, setActiveTab] = useState("documents");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // NEW: For mobile filter toggle
  // NEW: Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // NEW: Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const isSuperAdmin = user?.role?.name?.toLowerCase() === 'superadmin';
  const permissions = user?.role?.permissions || {};
  const canViewDocuments = isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canUploadDocuments = isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;
  const canEditDocuments = isSuperAdmin || permissions.DocumentManagement?.editDocuments || false;
  const canDeleteDocuments = isSuperAdmin || permissions.DocumentManagement?.deleteDocuments || false;
  const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers || false;
  const canManageUserRoles = isSuperAdmin || permissions.UserManagement?.manageUserRoles || false;
  const canViewOrganizations = isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations || false;
  const canCreateOrganizations = isSuperAdmin || permissions.OrganizationManagement?.createOrganizations || false;
  const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", user?.organization],
    queryFn: () => documentService.getNotifications(user?.organization || ""),
    enabled: !!user?.organization && canViewDocuments,
  });

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const { data: userMetrics, error: userMetricsError } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: () => userService.getUserMetrics(),
    enabled: !!user && canViewUsers,
    onError: (err) => console.error("User metrics error:", err),
  });

  const { data: orgMetrics, error: orgMetricsError } = useQuery({
    queryKey: ["organizationMetrics"],
    queryFn: () => organizationService.getOrganizationMetrics(),
    enabled: !!user && canViewOrganizations,
    onError: (err) => console.error("Org metrics error:", err),
  });

  const {
    data: allUsersData,
    error: allUsersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => userService.getAllUsers({ page: 1, limit: PAGE_LIMIT }),
    enabled: !!user && canViewUsers,
    onError: (err) => console.error("All users error:", err),
  });

  const { data: singleOrgData, isLoading: singleOrgLoading, error: singleOrgError } = useQuery({
    queryKey: ["singleOrganization", user?.organization],
    queryFn: async () => {
      if (!user?.organization) return null;
      const response = await organizationService.getOrganization(user.organization.toString());
      return response.data?.organization || response.organization || null;
    },
    enabled: !!user?.organization && canViewOrganizations && !isSuperAdmin,
    retry: false,
    onError: (err) => {
      console.error("Single org fetch error:", err);
      toast.error("Failed to load organization details");
    },
  });

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    error: organizationsError,
    refetch: refetchOrganizations,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations({ page: 1, limit: PAGE_LIMIT }),
    enabled: !!user && canViewOrganizations,
    retry: false,
    onError: (err) => {
      console.error("Organizations fetch error:", err);
      toast.error("Failed to load organizations. Please try again.");
    },
  });

  const {
    data: allDocumentsData,
    error: allDocsError,
    isLoading: allDocsLoading,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (canViewOrganizations) {
        const orgsResponse = await organizationService.getOrganizations({ page: 1, limit: PAGE_LIMIT });
        const orgs = orgsResponse.data?.organizations || orgsResponse.organizations || [];
        const allDocs = await Promise.all(
          orgs.map(async (org: Organization) => {
            try {
              const docsResponse = await documentService.getDocumentsByOrg(org._id, { page: 1, limit: 9999 });
              return docsResponse.data?.documents || docsResponse.documents || [];
            } catch (err) {
              console.error(`Org ${org._id} docs error:`, err);
              return [];
            }
          })
        );
        return allDocs.flat();
      } else {
        if (!user?.organization) return [];
        const docsResponse = await documentService.getDocumentsByOrg(user.organization, { page: 1, limit: PAGE_LIMIT });
        return docsResponse.data?.documents || docsResponse.documents || [];
      }
    },
    enabled: !!user && canViewDocuments,
    onError: (err) => {
      console.error("All docs fetch error:", err);
      toast.error("Failed to load documents");
    },
  });

  const organizations = useMemo(() => {
    if (canViewOrganizations) {
      if (isSuperAdmin) {
        return organizationsData?.data?.organizations || organizationsData?.organizations || [];
      } else if (singleOrgData) {
        return [singleOrgData];
      } else if (user?.organization) {
        return [{ _id: user.organization, name: "Current Organization", organizationType: "tech" }];
      }
    }
    return [];
  }, [organizationsData, singleOrgData, user?.organization, canViewOrganizations, isSuperAdmin]);

  const documents = allDocumentsData || [];
  const allUsers = allUsersData?.data?.users || allUsersData?.users || [];

  const filteredDocuments = useMemo(() => documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesType;
  }), [documents, searchTerm, filterType]);

  // NEW: Pagination logic
  const totalPages = useMemo(() => Math.ceil(filteredDocuments.length / DOCS_PAGE_SIZE), [filteredDocuments.length]);
  const startIndex = useMemo(() => (currentPage - 1) * DOCS_PAGE_SIZE, [currentPage]);
  const paginatedDocuments = useMemo(() => 
    filteredDocuments.slice(startIndex, startIndex + DOCS_PAGE_SIZE),
    [filteredDocuments, startIndex]
  );

  const handleUpload = async (
    file: File,
    name: string,
    type: string,
    organizationId: string,
    startDate?: string,
    expiryDate?: string
  ) => {
    setUploadLoading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      await documentService.uploadDocument(organizationId, file, name, type, startDate, expiryDate);
      refetchDocuments();
      setUploadSuccess("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
      setActiveTab("documents");
      setCurrentPage(1); // NEW: Reset to first page after upload
    } catch (error) {
      const errorMessage = handleApiError(error);
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDocumentAction = async (action: string, doc: Document) => {
    try {
      switch (action) {
        case "view":
          window.open(doc.fileUrl, "_blank");
          toast.info(`Viewing ${doc.name}`);
          break;
        case "download":
          await documentService.downloadDocument(doc._id, doc.name);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "edit":
          toast.info(`Editing ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc._id);
          refetchDocuments();
          toast.success(`${doc.name} deleted`);
          setCurrentPage(1); // NEW: Reset to first page after delete
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleCreateFolder = async (folderName: string, folderType: string) => {
    try {
      await organizationService.createOrganization({ 
        name: folderName, 
        organizationType: folderType || 'tech'
      });
      toast.success(`Folder "${folderName}" created successfully`);
      refetchOrganizations();
    } catch (error: any) {
      console.error("Create folder error:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await organizationService.deleteOrganization(folderId);
      toast.success("Folder deleted successfully");
      refetchOrganizations();
    } catch (error: any) {
      console.error("Delete folder error:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await organizationService.updateOrganization(folderId, { name: newName });
      toast.success("Folder renamed successfully");
      refetchOrganizations();
    } catch (error: any) {
      console.error("Rename folder error:", error);
      toast.error(error.response?.data?.message || "Failed to rename folder");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading || (canViewOrganizations && (organizationsLoading || singleOrgLoading))) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-base">Loading...</p>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  if ((organizationsError || singleOrgError) && canViewOrganizations) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-red-500 text-base">
            Error loading organizations. Please try again.
          </p>
        </div>
      </Layout>
    );
  }

  if (allDocsError && canViewDocuments) {
    return (
      <Layout user={user} onLogout={handleLogout}>
        <div className="text-center py-12">
          <p className="text-red-500 text-base">
            Error loading documents. Please try again.
          </p>
        </div>
      </Layout>
    );
  }

  const hasAdminAccess = canViewUsers || canManageUserRoles;

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage your contracts and documents
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsModal unreadCount={unreadCount} />
          </div>
        </div>

        <DashboardStats
          totalDocuments={documents.length}
          recentUploads={
            documents.filter(
              (d) =>
                new Date(d.createdAt) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length
          }
          totalOrganizations={orgMetrics?.data?.metrics?.totalOrganizations || 0}
          totalUsers={userMetrics?.data?.metrics?.totalUsers || 0}
          isAdmin={hasAdminAccess}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex flex-col sm:flex-row w-full justify-start gap-2 p-2 border rounded-md bg-muted">
            <TabsTrigger value="documents" className="flex-1 min-w-[100px] text-sm">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            {canUploadDocuments && (
              <TabsTrigger value="upload" className="flex-1 min-w-[100px] text-sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
            )}
            {canViewAnalytics && (
              <TabsTrigger value="analytics" className="flex-1 min-w-[100px] text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            )}
            {canViewUsers && (
              <TabsTrigger value="users" className="flex-1 min-w-[100px] text-sm">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
            )}
            {canManageUserRoles && (
              <TabsTrigger value="roles" className="flex-1 min-w-[100px] text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Roles
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className={`${isFilterOpen ? 'block' : 'hidden'} sm:block w-full sm:w-48`}>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Contract">Contracts</SelectItem>
                    <SelectItem value="SLA">SLAs</SelectItem>
                    <SelectItem value="NDA">NDAs</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 border rounded-lg p-1 w-full sm:w-auto">
                <Button
                  variant={viewMode === "management" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("management")}
                  className="flex-1 px-2"
                  title="Folder Management"
                  disabled={!canViewOrganizations}
                >
                  <Building className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "folders" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("folders")}
                  className="flex-1 px-2"
                  title="Folder View"
                  disabled={!canViewOrganizations}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 px-2"
                  title="Grid View"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {allDocsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-base">Loading documents...</p>
              </div>
            ) : viewMode === "management" ? (
              <FolderManagement
                documents={filteredDocuments}
                organizations={organizations}
                currentUser={user}
                onDocumentAction={handleDocumentAction}
                onCreateFolder={handleCreateFolder}
                onDeleteFolder={handleDeleteFolder}
                onRenameFolder={handleRenameFolder}
              />
            ) : viewMode === "folders" ? (
              <OrganizationFolders
                documents={filteredDocuments}
                organizations={organizations}
                currentUser={user}
                onDocumentAction={handleDocumentAction}
              />
            ) : (
              <>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedDocuments.map((doc) => (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      canEditDocuments={canEditDocuments}
                      canDeleteDocuments={canDeleteDocuments}
                      onView={() => handleDocumentAction("view", doc)}
                      onDownload={() => handleDocumentAction("download", doc)}
                      onEdit={() => handleDocumentAction("edit", doc)}
                      onDelete={() => handleDocumentAction("delete", doc)}
                    />
                  ))}
                </div>

                {/* NEW: Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + DOCS_PAGE_SIZE, filteredDocuments.length)} of {filteredDocuments.length} documents
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!allDocsLoading && filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                {!canViewDocuments ? (
                  <p className="text-muted-foreground text-base">
                    You do not have permission to view documents.
                  </p>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-base">
                      No documents found matching your criteria.
                    </p>
                    {canUploadDocuments && (
                      <Button onClick={() => setActiveTab("upload")} className="mt-4 text-sm">
                        Upload one
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {canUploadDocuments && (
            <TabsContent value="upload">
              <DocumentUpload
                onUpload={handleUpload}
                organizations={organizations}
                currentUserOrg={user.organization}
                loading={uploadLoading}
                error={uploadError}
                success={uploadSuccess}
              />
            </TabsContent>
          )}

          {canViewAnalytics && (
            <TabsContent value="analytics">
              <AnalyticsCharts
                allUsers={allUsers}
                allDocuments={documents}
                allOrganizations={organizations}
                userMetrics={userMetrics?.data?.metrics || userMetrics?.metrics}
                orgMetrics={orgMetrics?.data?.metrics || orgMetrics?.metrics}
              />
            </TabsContent>
          )}

          {canViewUsers && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}

          {canManageUserRoles && (
            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;