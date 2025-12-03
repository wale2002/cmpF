// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnalyticsCharts } from "../components/AnalyticsCharts";
import DashboardStats from "../components/DashboardStats";
import DocumentCard from "../components/DocumentCard";
import DocumentUpload from "../components/DocumentUpload";
import { Layout } from "../components/Layout";
import NotificationsModal from "../components/NotificationsModal";
import OrganizationFolders from "../components/OrganizationFolders";
import OrganizationCard from "../components/OrganizationCard";
import { RoleManagement } from "../components/RoleManagement";
import { UserManagement } from "../components/UserManagement";
import type { Document } from "../types/index";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
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
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";

const DOCS_PAGE_SIZE = 36;

const Dashboard = () => {
  const queryClient = useQueryClient();
  const {
    user,
    logout,
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders" | "management">(
    "grid"
  );
  const [activeTab, setActiveTab] = useState("documents");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState("tech");

  const roleNameLower = user?.role?.name?.toLowerCase() || "";
  const isSuperAdmin = roleNameLower.includes("superadmin");
  const permissions = user?.role?.permissions || {};

  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments;
  const canDeleteDocuments =
    isSuperAdmin || permissions.DocumentManagement?.deleteDocuments;
  const canViewUsers = isSuperAdmin || permissions.UserManagement?.viewUsers;
  const canManageUserRoles =
    isSuperAdmin || permissions.UserManagement?.manageUserRoles;
  const canViewOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.viewOrganizations;
  const canCreateOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.createOrganizations;
  const canEditOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.editOrganizations;
  const canDeleteOrganizations =
    isSuperAdmin || permissions.OrganizationManagement?.deleteOrganizations;
  const canViewAnalytics = isSuperAdmin || canViewOrganizations || canViewUsers;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please log in to access the dashboard");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user || authLoading) return;
    const saved = localStorage.getItem("dashboardTab");
    const validTabs = [
      "documents",
      canUploadDocuments && "upload",
      canViewAnalytics && "analytics",
      canViewUsers && "users",
      canManageUserRoles && "roles",
    ].filter(Boolean) as string[];
    setActiveTab(validTabs.includes(saved!) ? saved! : "documents");
  }, [
    user,
    authLoading,
    canViewAnalytics,
    canUploadDocuments,
    canViewUsers,
    canManageUserRoles,
  ]);

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", user?.organization?._id],
    queryFn: () =>
      documentService.getNotifications(user?.organization?._id || ""),
    enabled: !!user?.organization?._id && canViewDocuments,
  });

  const unreadCount = useMemo(
    () =>
      (notificationsData?.data?.notifications || []).filter((n: any) => !n.read)
        .length,
    [notificationsData]
  );

  // Organizations for folders/management
  const { data: organizationsData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations({ limit: 9999 }),
    enabled: canViewOrganizations,
  });

  const organizations = useMemo(() => {
    const orgs = organizationsData?.data?.organizations || [];
    return canViewOrganizations
      ? orgs
      : user?.organization
      ? [user.organization]
      : [];
  }, [organizationsData, user?.organization, canViewOrganizations]);

  // FAST & WORKING: Uses your actual working endpoint /api/documents/documents
  // Replace the entire useQuery block with this:
  const { data: docsResponse, isLoading: docsLoading } = useQuery({
    queryKey: ["allDocuments", currentPage, searchTerm, filterType],
    queryFn: () =>
      documentService.getAllDocuments({
        page: currentPage,
        limit: DOCS_PAGE_SIZE,
        search: searchTerm || undefined,
        documentType: filterType !== "all" ? filterType : undefined,
      }),
    enabled: !!user && canViewDocuments,
    // keepPreviousData removed — not supported in newer React Query
  });

  // Add proper typing:
  const docsData = docsResponse?.data;
  const documents: Document[] = docsData?.documents || [];
  const totalPages = docsData?.totalPages || 1;
  const totalDocuments = docsData?.total || 0;

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return toast.error("Folder name required");
    try {
      await organizationService.createOrganization({
        name: newFolderName.trim(),
        organizationType: newFolderType,
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success(`Folder "${newFolderName}" created`);
      setIsCreateOpen(false);
      setNewFolderName("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create folder");
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("dashboardTab", tab);
    setMobileMenuOpen(false);
  };

  if (authLoading || !user) {
    return (
      <Layout user={undefined}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="min-h-screen bg-background">
        {/* Top Bar */}
        <div className="border-b bg-card sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationsModal unreadCount={unreadCount} />
              <div className="hidden sm:block text-sm text-muted-foreground">
                {user.fullName || user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          <aside
            className={`${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-card border-r transition-transform duration-300 pt-20 lg:pt-6`}
          >
            <nav className="space-y-1 px-3">
              {[
                {
                  id: "documents",
                  label: "Documents",
                  icon: FileText,
                  show: true,
                },
                {
                  id: "upload",
                  label: "Upload",
                  icon: Upload,
                  show: canUploadDocuments,
                },
                {
                  id: "analytics",
                  label: "Analytics",
                  icon: BarChart3,
                  show: canViewAnalytics,
                },
                {
                  id: "users",
                  label: "Users",
                  icon: Users,
                  show: canViewUsers,
                },
                {
                  id: "roles",
                  label: "Roles & Permissions",
                  icon: Shield,
                  show: canManageUserRoles,
                },
              ]
                .filter((item) => item.show)
                .map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
            </nav>
          </aside>

          <main className="flex-1 p-4 lg:p-8 overflow-auto">
            {activeTab === "documents" && (
              <>
                <div className="mb-6">
                  <DashboardStats
                    totalDocuments={totalDocuments}
                    recentUploads={
                      documents.filter(
                        (d: Document) =>
                          new Date(d.createdAt) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                    isAdmin={canViewUsers || canManageUserRoles}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search documents..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-80"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-48">
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

                    <div className="flex gap-2">
                      {canCreateOrganizations && (
                        <Button onClick={() => setIsCreateOpen(true)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          New Folder
                        </Button>
                      )}
                      <div className="flex bg-muted rounded-lg p-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "folders" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("folders")}
                          disabled={!canViewOrganizations}
                        >
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={
                            viewMode === "management" ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setViewMode("management")}
                          disabled={!canViewOrganizations}
                        >
                          <Building className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {docsLoading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Loading documents...
                    </div>
                  ) : viewMode === "management" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {organizations.map((org) => (
                        <OrganizationCard
                          key={org._id}
                          organization={org}
                          canEditOrganizations={canEditOrganizations}
                          canDeleteOrganizations={canDeleteOrganizations}
                          onDelete={() =>
                            organizationService
                              .deleteOrganization(org._id)
                              .then(() => {
                                queryClient.invalidateQueries({
                                  queryKey: ["organizations"],
                                });
                                toast.success("Folder deleted");
                              })
                          }
                          onUpdate={() =>
                            queryClient.invalidateQueries({
                              queryKey: ["organizations"],
                            })
                          }
                        />
                      ))}
                    </div>
                  ) : viewMode === "folders" ? (
                    <OrganizationFolders
                      documents={documents}
                      organizations={organizations}
                      currentUser={user}
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {documents.map((doc: Document) => (
                          <DocumentCard
                            key={doc._id}
                            document={doc}
                            canEditDocuments={
                              isSuperAdmin || canDeleteDocuments
                            }
                            canDeleteDocuments={canDeleteDocuments}
                            onView={() => window.open(doc.fileUrl, "_blank")}
                            onDownload={() =>
                              documentService.downloadDocument(
                                doc._id,
                                doc.name
                              )
                            }
                            onDelete={async () => {
                              await documentService.deleteDocument(doc._id);
                              queryClient.invalidateQueries({
                                queryKey: ["allDocuments"],
                              });
                              toast.success("Document deleted");
                            }}
                          />
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-10">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                          >
                            <ChevronLeft className="h-4 w-4" /> Previous
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages} ({totalDocuments}{" "}
                            total)
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                          >
                            Next <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  {documents.length === 0 && !docsLoading && (
                    <div className="text-center py-16 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No documents found</p>
                      {canUploadDocuments && (
                        <Button
                          onClick={() => handleTabChange("upload")}
                          className="mt-4"
                        >
                          Upload Your First Document
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "upload" && canUploadDocuments && (
              <DocumentUpload
                onUpload={async (file, name, type, orgId, start, expiry) => {
                  await documentService.uploadDocument(
                    orgId,
                    file,
                    name,
                    type,
                    start,
                    expiry
                  );
                  queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
                  toast.success("Uploaded successfully!");
                }}
                organizations={organizations}
                currentUserOrg={user.organization?._id}
              />
            )}

            {activeTab === "analytics" && canViewAnalytics && (
              <AnalyticsCharts
                allUsers={[]}
                allDocuments={documents}
                allOrganizations={organizations}
                userMetrics={{ totalUsers: 42 }}
                orgMetrics={{ totalOrganizations: organizations.length }}
              />
            )}

            {activeTab === "users" && canViewUsers && <UserManagement />}
            {activeTab === "roles" && canManageUserRoles && <RoleManagement />}
          </main>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Organize your documents into folders (organizations)
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateFolder();
              }}
              className="space-y-4"
            >
              <div>
                <Label>Folder Name</Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Vendor Contracts 2025"
                  required
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={newFolderType} onValueChange={setNewFolderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                    <SelectItem value="infra">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Folder</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Dashboard;
