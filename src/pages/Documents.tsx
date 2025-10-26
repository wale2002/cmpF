/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService, organizationService } from "../lib/api";
import { DocumentCard } from "../components/DocumentCard";
import { DocumentUpload } from "../components/DocumentUpload";
import { Layout } from "../components/Layout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { Document, Organization, Permissions } from "../types";
import { toast } from "sonner";
import { handleApiError } from "../utils/error-handler";

const DocumentsPage = () => {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    logout,
  } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // NEW: Pagination state

  const PAGE_SIZE = 9; // NEW: Suitable for 3x3 grid

  const isSuperAdmin = user?.role?.name?.toLowerCase() === "superadmin";
  const permissions: Permissions = user?.role?.permissions || {};
  const canViewDocuments =
    isSuperAdmin || permissions.DocumentManagement?.viewDocuments || false;
  const canUploadDocuments =
    isSuperAdmin || permissions.DocumentManagement?.uploadDocuments || false;
  const canEditDocuments =
    isSuperAdmin || permissions.DocumentManagement?.editDocuments || false;
  const canDeleteDocuments =
    isSuperAdmin || permissions.DocumentManagement?.deleteDocuments || false;
  const canViewOrganizations =
    isSuperAdmin ||
    permissions.OrganizationManagement?.viewOrganizations ||
    false;

  const { data: organizationsData, isLoading: orgsLoading } = useQuery<{
    data?: { organizations: Organization[] };
    organizations?: Organization[];
  }>({
    queryKey: ["organizations"],
    queryFn: () => organizationService.getOrganizations(),
    enabled: !!user && canViewOrganizations,
    staleTime: 5 * 60 * 1000,
    onError: (err: any) => {
      console.error("DocumentsPage orgs error:", err);
      toast.error("Failed to load organizations");
    },
  });

  const {
    data: documentsData,
    isLoading: docsLoading,
    refetch,
  } = useQuery({
    queryKey: ["documents", user?.organization, user?.role?.name],
    queryFn: async () => {
      console.log("DocumentsPage docs fetch:", {
        role: user?.role?.name,
        org: user?.organization,
      });
      if (canViewOrganizations && isSuperAdmin) {
        const orgsResponse = await organizationService.getOrganizations();
        const orgs =
          orgsResponse.data?.organizations || orgsResponse.organizations || [];
        console.log("DocumentsPage admin orgs:", orgs.length);
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
              console.error(`DocumentsPage org ${org._id} docs error:`, err);
              return [];
            }
          })
        );
        return allDocs.flat();
      } else if (user?.organization && canViewDocuments) {
        const docsResponse = await documentService.getDocumentsByOrg(
          user.organization.toString()
        );
        return docsResponse.data?.documents || docsResponse.documents || [];
      }
      console.warn("DocumentsPage no org or no view permission");
      return [];
    },
    enabled: !!user && canViewDocuments,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    onError: (err: any) => {
      console.error("DocumentsPage docs error:", err);
      toast.error("Failed to load documents");
    },
  });

  const documents = Array.isArray(documentsData) ? documentsData : [];
  const organizations = useMemo(() => {
    if (!canViewOrganizations) {
      return user?.organization
        ? [
            {
              _id: user.organization,
              name: "Current Organization",
              organizationType: "tech",
            },
          ]
        : [];
    }

    if (!organizationsData) return [];

    // If the query returned a direct array of organizations
    if (Array.isArray(organizationsData)) {
      return organizationsData as Organization[];
    }

    // Narrow the shape safely before accessing properties
    if (typeof organizationsData === "object" && organizationsData !== null) {
      // data?.organizations shape
      if (
        "data" in organizationsData &&
        (organizationsData as any).data?.organizations
      ) {
        return (organizationsData as any).data.organizations as Organization[];
      }
      // organizations direct key
      if (
        "organizations" in organizationsData &&
        (organizationsData as any).organizations
      ) {
        return (organizationsData as any).organizations as Organization[];
      }
    }

    return [];
  }, [organizationsData, user?.organization, canViewOrganizations]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesType;
  });

  // NEW: Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // NEW: Pagination logic
  const totalPages = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      await documentService.uploadDocument(
        organizationId.toString(),
        file,
        name,
        type,
        startDate,
        expiryDate
      );
      refetch();
      setUploadSuccess("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
      setShowUpload(false);
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
          await documentService.downloadDocument(doc._id.toString(), doc.name);
          toast.success(`Downloading ${doc.name}`);
          break;
        case "edit":
          toast.info(`Editing ${doc.name}`);
          break;
        case "delete":
          await documentService.deleteDocument(doc._id.toString());
          refetch();
          toast.success(`${doc.name} deleted`);
          break;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (authLoading || docsLoading || (canViewOrganizations && orgsLoading)) {
    return (
      <Layout user={user ?? undefined} onLogout={logout}>
        <div className="text-center py-12">Loading documents...</div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!canViewDocuments) {
    return (
      <Layout user={user} onLogout={logout}>
        <div className="text-center py-12 text-muted-foreground">
          You do not have permission to view documents.
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          {canUploadDocuments && (
            <Button
              onClick={() => setShowUpload(!showUpload)}
              variant="professional"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
        {showUpload && canUploadDocuments && (
          <DocumentUpload
            onUpload={handleUpload}
            organizations={organizations}
            currentUserOrg={user.organization ?? undefined}
            loading={uploadLoading}
            error={uploadError}
            success={uploadSuccess}
          />
        )}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
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
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            {canUploadDocuments ? (
              <p className="text-muted-foreground">
                No documents found.{" "}
                <Button variant="link" onClick={() => setShowUpload(true)}>
                  Upload one
                </Button>
              </p>
            ) : (
              <p className="text-muted-foreground">No documents found.</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedDocuments.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  canEditDocuments={
                    canEditDocuments || doc.uploadedBy === user._id
                  }
                  canDeleteDocuments={
                    canDeleteDocuments || doc.uploadedBy === user._id
                  }
                  onView={() => handleDocumentAction("view", doc)}
                  onDownload={() => handleDocumentAction("download", doc)}
                  onEdit={() => handleDocumentAction("edit", doc)}
                  onDelete={() => handleDocumentAction("delete", doc)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filteredDocuments.length}{" "}
                  documents)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DocumentsPage;
