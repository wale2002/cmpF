/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../contexts/AuthContext";
import { documentService } from "../lib/api";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Folder,
  Calendar,
  Image as ImageIcon,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { Document } from "../types";

interface Report extends Document {
  officerCode: string;
  role: string;
  uploadedBy: string;
  localGovernment: string;
  topicBeingTaught: string;
  schoolName: string; // ← added
  status: string; // ← added
  dateOfVisit: string; // ← added
}

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

export default function SchoolVisitReportsBrowser() {
  const { user } = useAuthContext();

  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery<Report[]>({
    queryKey: ["school-visit-reports"],
    queryFn: documentService.getSchoolVisitReports,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      console.error("SchoolVisitReportsBrowser error:", error);
      toast.error("Failed to load field reports");
    }
  }, [error]);

  const reports = Array.isArray(reportsData) ? reportsData : [];

  const getWeekNum = (date: Date): number => {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const grouped = useMemo(() => {
    const g: any = {};
    reports.forEach((r) => {
      const date = new Date(r.dateOfVisit);
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, "0");
      const monthName = date.toLocaleString("default", { month: "long" });
      const monthFolder = `${monthNum}-${monthName}`;
      const weekFolder = `Week-${getWeekNum(date)}`;
      const officer = (r.officerCode || "unknown").toLowerCase();

      if (!g[officer]) g[officer] = {};
      if (!g[officer][year]) g[officer][year] = {};
      if (!g[officer][year][monthFolder]) g[officer][year][monthFolder] = {};
      if (!g[officer][year][monthFolder][weekFolder])
        g[officer][year][monthFolder][weekFolder] = [];

      g[officer][year][monthFolder][weekFolder].push(r);
    });
    return g;
  }, [reports]);

  const resetToTop = () => {
    setSelectedOfficer(null);
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedWeek(null);
  };

  const goBack = () => {
    if (selectedWeek) setSelectedWeek(null);
    else if (selectedMonth) setSelectedMonth(null);
    else if (selectedYear) setSelectedYear(null);
    else if (selectedOfficer) setSelectedOfficer(null);
  };

  let currentItems: any[] = [];
  let isReportLevel = false;

  if (!selectedOfficer) {
    currentItems = Object.keys(grouped).sort();
  } else if (!selectedYear) {
    currentItems = Object.keys(grouped[selectedOfficer]).sort(
      (a, b) => Number(b) - Number(a),
    );
  } else if (!selectedMonth) {
    currentItems = Object.keys(grouped[selectedOfficer][selectedYear]).sort();
  } else if (!selectedWeek) {
    currentItems = Object.keys(
      grouped[selectedOfficer][selectedYear][selectedMonth],
    ).sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
  } else {
    isReportLevel = true;
    currentItems = grouped[selectedOfficer][selectedYear][selectedMonth][
      selectedWeek
    ].sort(
      (a: Report, b: Report) =>
        new Date(b.dateOfVisit).getTime() - new Date(a.dateOfVisit).getTime(),
    );
  }

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Field Reports", onClick: resetToTop },
    selectedOfficer && {
      label: selectedOfficer.toUpperCase(),
      onClick: () => {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedWeek(null);
      },
    },
    selectedYear && {
      label: String(selectedYear),
      onClick: () => {
        setSelectedMonth(null);
        setSelectedWeek(null);
      },
    },
    selectedMonth && {
      label: selectedMonth,
      onClick: () => setSelectedWeek(null),
    },
    selectedWeek && { label: selectedWeek, onClick: () => {} },
  ].filter(Boolean) as BreadcrumbItem[];

  if (isLoading) {
    return <div className="text-center py-12">Loading field reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Users className="h-8 w-8" />
          Field Reports Explorer
        </h1>
        <Button variant="outline" onClick={goBack} disabled={!selectedOfficer}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumb.map((crumb, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              onClick={crumb.onClick}
              className="cursor-pointer hover:underline text-blue-600"
            >
              {crumb.label}
            </span>
            {i < breadcrumb.length - 1 && <span>›</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isReportLevel
          ? currentItems.map((report: Report) => (
              <Card
                key={report._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={report.fileUrl}
                    alt={report.schoolName}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      report.status === "Satisfactory Performance"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {report.status === "Satisfactory Performance" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {report.status === "Satisfactory Performance"
                      ? "Good"
                      : "Poor"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="font-semibold text-lg line-clamp-1">
                    {report.schoolName}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(report.dateOfVisit).toLocaleDateString("en-GB")}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-3">
                    <Badge variant="secondary">{report.officerCode}</Badge>
                    <Badge variant="outline">{report.role}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {report.topicBeingTaught} • {report.localGovernment}
                  </p>
                  <Button
                    className="w-full mt-4"
                    variant="default"
                    size="sm"
                    onClick={() => window.open(report.fileUrl, "_blank")}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    View Full Photo
                  </Button>
                </CardContent>
              </Card>
            ))
          : currentItems.map((item) => (
              <Card
                key={item}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
                onClick={() => {
                  if (!selectedOfficer) setSelectedOfficer(item);
                  else if (!selectedYear) setSelectedYear(Number(item));
                  else if (!selectedMonth) setSelectedMonth(item);
                  else if (!selectedWeek) setSelectedWeek(item);
                }}
              >
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-44">
                  <Folder className="h-12 w-12 text-blue-600 mb-4" />
                  <div className="font-medium text-xl">{item}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {!selectedOfficer && "Officer Folder"}
                    {selectedOfficer && !selectedYear && "Year"}
                    {selectedYear && !selectedMonth && "Month"}
                    {selectedMonth && !selectedWeek && "Week"}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {currentItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No field reports found.
        </div>
      )}
    </div>
  );
}
