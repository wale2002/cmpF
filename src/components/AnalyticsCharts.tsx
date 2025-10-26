/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/AnalyticsCharts.tsx
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { documentService, userService } from "../lib/api"; // Updated import
import { useAuthContext } from "../contexts/AuthContext";
import { Skeleton } from "../components/ui/skeleton";

import type {
  User,
  Document,
  Organization,
  UserMetrics,
  OrganizationMetrics,
} from "../types/index";

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
];

const GRADIENT_COLORS = [
  { start: "#3B82F6", end: "#1D4ED8" },
  { start: "#10B981", end: "#059669" },
  { start: "#F59E0B", end: "#D97706" },
];

interface AnalyticsChartsProps {
  allUsers?: User[];
  allDocuments?: Document[];
  allOrganizations?: Organization[];
  userMetrics?: UserMetrics;
  orgMetrics?: OrganizationMetrics;
  auditLogs?: any[]; // New prop
}

export function AnalyticsCharts({
  allUsers = [],
  allDocuments = [],
  allOrganizations = [],
  userMetrics,
  orgMetrics,
  auditLogs = [], // New
}: AnalyticsChartsProps) {
  const { user } = useAuthContext();

  const { data: docMetrics, isLoading: docLoading } = useQuery({
    queryKey: ["documentMetrics", user?.organization],
    queryFn: () => documentService.getDocumentMetrics(user?.organization || ""),
    enabled: !!user?.organization,
  });

  if (docLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Existing data processing...
  const documentTypeData =
    allDocuments.length > 0
      ? [
          {
            name: "Contract",
            value: allDocuments.filter((d) => d.documentType === "Contract")
              .length,
          },
          {
            name: "SLA",
            value: allDocuments.filter((d) => d.documentType === "SLA").length,
          },
          {
            name: "NDA",
            value: allDocuments.filter((d) => d.documentType === "NDA").length,
          },
          {
            name: "Other",
            value: allDocuments.filter((d) => d.documentType === "Other")
              .length,
          },
        ]
      : [];

  const userRoleData =
    allUsers.length > 0
      ? [
          {
            name: "Admin Users",
            value: allUsers.filter((u) => String(u.role) === "admin").length,
          },
          {
            name: "Regular Users",
            value: allUsers.filter((u) => String(u.role) !== "admin").length,
          },
        ]
      : userMetrics
      ? [
          { name: "Admin Users", value: userMetrics.adminUsers ?? 0 },
          {
            name: "Regular Users",
            value:
              (userMetrics.totalUsers ?? 0) - (userMetrics.adminUsers ?? 0),
          },
        ]
      : [];

  const orgDocumentData = allOrganizations
    .map((org) => ({
      organization: org.name,
      documentCount: allDocuments.filter((doc) => doc.organization === org._id)
        .length,
    }))
    .sort((a, b) => b.documentCount - a.documentCount)
    .slice(0, 10);

  const recentUploadsData = allDocuments
    .filter(
      (d) =>
        new Date(d.uploadDate || d.createdAt) >
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    )
    .reduce((acc, doc) => {
      const date = new Date(
        doc.uploadDate || doc.createdAt
      ).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const uploadsTimelineData = Object.entries(recentUploadsData)
    .map(([date, count]) => ({
      date,
      uploads: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const documentAgeData = (() => {
    const now = Date.now();
    const buckets = {
      "0-30 days": 0,
      "31-60 days": 0,
      "61-90 days": 0,
      "90+ days": 0,
    };
    allDocuments.forEach((doc) => {
      const ageDays = Math.floor(
        (now - new Date(doc.uploadDate || doc.createdAt).getTime()) /
          (24 * 60 * 60 * 1000)
      );
      if (ageDays <= 30) buckets["0-30 days"]++;
      else if (ageDays <= 60) buckets["31-60 days"]++;
      else if (ageDays <= 90) buckets["61-90 days"]++;
      else buckets["90+ days"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  })();

  const orgTypeData =
    allOrganizations.length > 0
      ? allOrganizations.reduce((acc, org) => {
          const type = org.organizationType || "Unknown";
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      : orgMetrics
      ? Object.entries(orgMetrics).map(([type, count]) => ({
          name: type,
          value: count,
        }))
      : [];

  const orgTypeChartData = Object.entries(orgTypeData).map(([name, value]) => ({
    name,
    value,
  }));

  // NEW: Audit Logs Processing
  const actionData =
    auditLogs.length > 0
      ? Object.entries(
          auditLogs.reduce((acc, log) => {
            const action = log.action || "Unknown";
            acc[action] = (acc[action] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, value }))
      : [];

  const resourceData =
    auditLogs.length > 0
      ? Object.entries(
          auditLogs.reduce((acc, log) => {
            const resource = log.resource || "Unknown";
            acc[resource] = (acc[resource] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).map(([name, value]) => ({ name, value }))
      : [];

  const recentAuditData = auditLogs
    .filter(
      (log) =>
        new Date(log.createdAt) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) // Last 30 days
    .reduce((acc, log) => {
      const date = new Date(log.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const auditTimelineData = Object.entries(recentAuditData)
    .map(([date, count]) => ({ date, actions: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const topUsersData = (() => {
    if (auditLogs.length === 0) return [];
    const userActions = auditLogs.reduce((acc, log) => {
      const userId = log.user?._id || "Unknown";
      const userName = log.user?.fullName || userId;
      if (!acc[userId]) {
        acc[userId] = { name: userName, count: 0 };
      }
      acc[userId].count += 1;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    return (Object.values(userActions) as { name: string; count: number }[])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(({ name: user, count }) => ({ user, count }));
  })();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Document Types Distribution - Enhanced Pie */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Document Types</CardTitle>
          <CardDescription>Distribution by type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({
                  name = "Unknown",
                  percent = 0,
                }: {
                  name?: string;
                  percent?: number;
                }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}`]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {user?.role?.toString() === "admin" && (
        <>
          {/* User Role Distribution - Enhanced Bar */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Breakdown by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userRoleData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="url(#roleGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Documents per Organization - Horizontal Bar for Top Orgs */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Organizations by Documents</CardTitle>
              <CardDescription>Top 10 organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={orgDocumentData}
                  layout="vertical"
                  margin={{ right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="organization"
                    type="category"
                    width={150}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="documentCount"
                    fill="url(#orgGradient)"
                    radius={[4, 4, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Organization Types - Pie */}
          {orgTypeChartData.length > 0 && (
            <Card className="col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Org Types</CardTitle>
                <CardDescription>By organization type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={orgTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                    >
                      {orgTypeChartData.map((entry, index) => (
                        <Cell
                          key={`org-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* NEW: Audit Actions Distribution - Pie */}
          {actionData.length > 0 && (
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Audit Actions</CardTitle>
                <CardDescription>Distribution by action type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={actionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                    >
                      {actionData.map((entry, index) => (
                        <Cell
                          key={`action-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* NEW: Resources Affected - Bar */}
          {resourceData.length > 0 && (
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Resources Affected</CardTitle>
                <CardDescription>By resource type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={resourceData}
                    layout="horizontal"
                    margin={{ right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* NEW: Top Users by Actions - Horizontal Bar */}
          {topUsersData.length > 0 && (
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Users by Audit Actions</CardTitle>
                <CardDescription>Top 10 active users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topUsersData}
                    layout="vertical"
                    margin={{ right: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="user"
                      type="category"
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Recent Uploads - Enhanced Line Chart for Trend */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Upload Trends (Last 90 Days)</CardTitle>
          <CardDescription>Daily upload activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={uploadsTimelineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip labelStyle={{ fontSize: 12 }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NEW: Recent Audit Actions Timeline - Line Chart */}
      {auditTimelineData.length > 0 && (
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Audit Activity (Last 30 Days)</CardTitle>
            <CardDescription>Daily audit actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={auditTimelineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip labelStyle={{ fontSize: 12 }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actions"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <ReferenceLine y={0} stroke="#10B981" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Document Age Distribution - Area Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Document Age Buckets</CardTitle>
          <CardDescription>Distribution by upload age</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={documentAgeData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                fill="url(#ageGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Total Statistics Summary */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Total counts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              Total Documents
            </span>
            <span className="font-bold text-2xl text-primary">
              {allDocuments.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              Total Organizations
            </span>
            <span className="font-bold text-2xl text-primary">
              {allOrganizations.length}
            </span>
          </div>
          {user?.role?.toString() === "admin" && (
            <>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Total Users
                </span>
                <span className="font-bold text-2xl text-primary">
                  {allUsers.length}
                </span>
              </div>
              {/* NEW: Total Audit Logs */}
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">
                  Total Audit Logs
                </span>
                <span className="font-bold text-2xl text-primary">
                  {auditLogs.length}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
