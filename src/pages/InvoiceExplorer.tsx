// // // src/pages/InvoiceExplorer.tsx
// // import { useState, useEffect, useMemo } from "react";
// // import { useQuery } from "@tanstack/react-query";
// // import { useAuthContext } from "../contexts/AuthContext";
// // import { documentService } from "../lib/api";
// // import { Card, CardContent } from "../components/ui/card";
// // import { Button } from "../components/ui/button";
// // import { Badge } from "../components/ui/badge";
// // import {
// //   Folder,
// //   Calendar,
// //   FileText,
// //   ArrowLeft,
// //   Download,
// //   Eye,
// //   DollarSign,
// //   RefreshCw,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import type { Document } from "../types";

// // interface Invoice extends Document {
// //   officerCode?: string;
// //   customerName?: string;
// //   grandTotal?: number;
// //   invoiceNumber?: string;
// //   invoiceDate?: string;
// // }

// // interface InvoiceExplorerProps {
// //   documents?: Document[];
// //   refetch?: () => void;
// // }

// // interface BreadcrumbItem {
// //   label: string;
// //   onClick: () => void;
// // }

// // export default function InvoiceExplorer({
// //   documents: propDocuments,
// //   refetch: propRefetch,
// // }: InvoiceExplorerProps = {}) {
// //   const { user } = useAuthContext();

// //   const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
// //   const [selectedYear, setSelectedYear] = useState<number | null>(null);
// //   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
// //   const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

// //   // Query only runs if parent doesn't pass documents
// //   const {
// //     data: queryInvoicesData,
// //     isLoading: queryLoading,
// //     error: queryError,
// //     refetch: queryRefetch,
// //   } = useQuery<Invoice[]>({
// //     queryKey: ["invoices-explorer"],
// //     queryFn: async () => {
// //       const response = await documentService.getAllDocuments({
// //         documentType: "all",
// //       });
// //       return Array.isArray(response?.data) ? response.data : [];
// //     },
// //     enabled: !!user && !propDocuments,
// //     staleTime: 10 * 1000,
// //     gcTime: 2 * 60 * 1000,
// //   });

// //   const rawData = propDocuments ?? queryInvoicesData;

// //   // FIXED FILTER — catches public invoices even if documentType is missing or officerCode is not populated
// //   const invoices: Invoice[] = Array.isArray(rawData)
// //     ? rawData.filter((doc): doc is Invoice => {
// //         const type = (doc.documentType || "").toLowerCase();
// //         const name = (doc.name || "").toLowerCase();
// //         return (
// //           type === "invoice" ||
// //           type === "receipt" ||
// //           !!doc.officerCode ||
// //           name.includes("invoice") ||
// //           name.includes("receipt")
// //         );
// //       })
// //     : [];

// //   const isLoading = propDocuments !== undefined ? false : queryLoading;
// //   const error = propDocuments !== undefined ? null : queryError;
// //   const refetch = propRefetch || queryRefetch;

// //   useEffect(() => {
// //     if (error) {
// //       console.error("InvoiceExplorer error:", error);
// //       toast.error("Failed to load invoices");
// //     }
// //   }, [error]);

// //   const getWeekNum = (date: Date): number => {
// //     const year = date.getFullYear();
// //     const firstDayOfYear = new Date(year, 0, 1);
// //     const pastDaysOfYear =
// //       (date.getTime() - firstDayOfYear.getTime()) / 86400000;
// //     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
// //   };

// //   const grouped = useMemo(() => {
// //     const g: any = {};
// //     invoices.forEach((inv) => {
// //       const officer = (inv.officerCode || "unknown").toUpperCase();
// //       const date = new Date(inv.invoiceDate || inv.createdAt || Date.now());
// //       const year = date.getFullYear();
// //       const monthNum = String(date.getMonth() + 1).padStart(2, "0");
// //       const monthName = date.toLocaleString("default", { month: "long" });
// //       const monthFolder = `${monthNum}-${monthName}`;
// //       const weekFolder = `Week-${getWeekNum(date)}`;

// //       if (!g[officer]) g[officer] = {};
// //       if (!g[officer][year]) g[officer][year] = {};
// //       if (!g[officer][year][monthFolder]) g[officer][year][monthFolder] = {};
// //       if (!g[officer][year][monthFolder][weekFolder])
// //         g[officer][year][monthFolder][weekFolder] = [];

// //       g[officer][year][monthFolder][weekFolder].push(inv);
// //     });
// //     return g;
// //   }, [invoices]);

// //   const resetToTop = () => {
// //     setSelectedOfficer(null);
// //     setSelectedYear(null);
// //     setSelectedMonth(null);
// //     setSelectedWeek(null);
// //   };

// //   const goBack = () => {
// //     if (selectedWeek) setSelectedWeek(null);
// //     else if (selectedMonth) setSelectedMonth(null);
// //     else if (selectedYear) setSelectedYear(null);
// //     else if (selectedOfficer) setSelectedOfficer(null);
// //   };

// //   let currentItems: any[] = [];
// //   let isInvoiceLevel = false;

// //   if (!selectedOfficer) {
// //     currentItems = Object.keys(grouped).sort();
// //   } else if (!selectedYear) {
// //     currentItems = Object.keys(grouped[selectedOfficer]).sort(
// //       (a, b) => Number(b) - Number(a),
// //     );
// //   } else if (!selectedMonth) {
// //     currentItems = Object.keys(grouped[selectedOfficer][selectedYear]).sort();
// //   } else if (!selectedWeek) {
// //     currentItems = Object.keys(
// //       grouped[selectedOfficer][selectedYear][selectedMonth],
// //     ).sort();
// //   } else {
// //     isInvoiceLevel = true;
// //     currentItems = grouped[selectedOfficer][selectedYear][selectedMonth][
// //       selectedWeek
// //     ].sort(
// //       (a: Invoice, b: Invoice) =>
// //         new Date(b.invoiceDate || b.createdAt || 0).getTime() -
// //         new Date(a.invoiceDate || a.createdAt || 0).getTime(),
// //     );
// //   }

// //   const breadcrumb: BreadcrumbItem[] = [
// //     { label: "Invoices & Receipts", onClick: resetToTop },
// //     selectedOfficer && {
// //       label: selectedOfficer,
// //       onClick: () => {
// //         setSelectedYear(null);
// //         setSelectedMonth(null);
// //         setSelectedWeek(null);
// //       },
// //     },
// //     selectedYear && {
// //       label: String(selectedYear),
// //       onClick: () => setSelectedMonth(null),
// //     },
// //     selectedMonth && {
// //       label: selectedMonth,
// //       onClick: () => setSelectedWeek(null),
// //     },
// //     selectedWeek && { label: selectedWeek, onClick: () => {} },
// //   ].filter(Boolean) as BreadcrumbItem[];

// //   if (isLoading) {
// //     return <div className="text-center py-12">Loading invoices...</div>;
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
// //           <FileText className="h-8 w-8" />
// //           Invoices Explorer
// //         </h1>
// //         <div className="flex gap-2">
// //           <Button
// //             variant="outline"
// //             onClick={goBack}
// //             disabled={!selectedOfficer}
// //           >
// //             <ArrowLeft className="mr-2 h-4 w-4" />
// //             Back
// //           </Button>
// //           <Button variant="ghost" size="sm" onClick={() => refetch()}>
// //             <RefreshCw className="h-4 w-4 mr-1" />
// //             Refresh
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Breadcrumb */}
// //       <div className="flex items-center gap-2 text-sm text-muted-foreground">
// //         {breadcrumb.map((crumb, i) => (
// //           <div key={i} className="flex items-center gap-2">
// //             <span
// //               onClick={crumb.onClick}
// //               className="cursor-pointer hover:underline text-blue-600"
// //             >
// //               {crumb.label}
// //             </span>
// //             {i < breadcrumb.length - 1 && <span>›</span>}
// //           </div>
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //         {isInvoiceLevel
// //           ? currentItems.map((inv: Invoice) => (
// //               <Card
// //                 key={inv._id}
// //                 className="overflow-hidden hover:shadow-md transition-shadow"
// //               >
// //                 <CardContent className="p-6">
// //                   <div className="flex justify-between items-start mb-4">
// //                     <Badge variant="default">Invoice</Badge>
// //                     {inv.officerCode && (
// //                       <Badge variant="outline" className="font-mono text-xs">
// //                         {inv.officerCode}
// //                       </Badge>
// //                     )}
// //                   </div>

// //                   <div className="font-semibold text-xl line-clamp-1 mb-1">
// //                     {inv.name}
// //                   </div>
// //                   {inv.customerName && (
// //                     <div className="text-sm text-muted-foreground mb-4">
// //                       {inv.customerName}
// //                     </div>
// //                   )}

// //                   <div className="flex items-center justify-between text-sm mb-6">
// //                     <div className="flex items-center gap-1 text-muted-foreground">
// //                       <Calendar className="h-3 w-3" />
// //                       {new Date(
// //                         inv.invoiceDate || inv.createdAt || Date.now(),
// //                       ).toLocaleDateString("en-GB")}
// //                     </div>
// //                     <div className="font-bold text-lg flex items-center gap-1 text-green-600">
// //                       <DollarSign className="h-4 w-4" />
// //                       {inv.grandTotal ? inv.grandTotal.toFixed(2) : "0.00"}
// //                     </div>
// //                   </div>

// //                   <div className="flex gap-2">
// //                     <Button
// //                       variant="outline"
// //                       size="sm"
// //                       className="flex-1"
// //                       onClick={() => window.open(inv.fileUrl, "_blank")}
// //                     >
// //                       <Eye className="mr-2 h-4 w-4" /> View
// //                     </Button>
// //                     <Button
// //                       variant="default"
// //                       size="sm"
// //                       className="flex-1"
// //                       onClick={() =>
// //                         documentService.downloadDocument(
// //                           inv._id.toString(),
// //                           inv.name,
// //                         )
// //                       }
// //                     >
// //                       <Download className="mr-2 h-4 w-4" /> Download
// //                     </Button>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))
// //           : currentItems.map((item) => (
// //               <Card
// //                 key={item}
// //                 className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
// //                 onClick={() => {
// //                   if (!selectedOfficer) setSelectedOfficer(item);
// //                   else if (!selectedYear) setSelectedYear(Number(item));
// //                   else if (!selectedMonth) setSelectedMonth(item);
// //                   else if (!selectedWeek) setSelectedWeek(item);
// //                 }}
// //               >
// //                 <CardContent className="p-8 flex flex-col items-center justify-center text-center h-44">
// //                   <Folder className="h-12 w-12 text-blue-600 mb-4" />
// //                   <div className="font-medium text-xl">{item}</div>
// //                   <div className="text-xs text-muted-foreground mt-2">
// //                     {!selectedOfficer && "Officer Folder"}
// //                     {selectedOfficer && !selectedYear && "Year"}
// //                     {selectedYear && !selectedMonth && "Month"}
// //                     {selectedMonth && !selectedWeek && "Week"}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //       </div>

// //       {currentItems.length === 0 && (
// //         <div className="text-center py-12 text-muted-foreground">
// //           <FileText className="mx-auto h-12 w-12 mb-4 opacity-40" />
// //           <p className="text-lg">No invoices found yet</p>
// //           <p className="text-sm mt-1">
// //             Create your first invoice using the "Create Invoice via Public Link"
// //             button above
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // src/pages/InvoiceExplorer.tsx
// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useAuthContext } from "../contexts/AuthContext";
// import { documentService } from "../lib/api";
// import { Card, CardContent } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import {
//   Folder,
//   Calendar,
//   FileText,
//   ArrowLeft,
//   Download,
//   Eye,
//   DollarSign,
//   RefreshCw,
// } from "lucide-react";
// import { toast } from "sonner";
// import type { Document } from "../types";

// interface Invoice extends Document {
//   officerCode?: string;
//   customerName?: string;
//   grandTotal?: number;
//   invoiceNumber?: string;
//   invoiceDate?: string;
// }

// interface InvoiceExplorerProps {
//   documents?: Document[];
//   refetch?: () => void;
// }

// interface BreadcrumbItem {
//   label: string;
//   onClick: () => void;
// }

// export default function InvoiceExplorer({
//   documents: propDocuments,
//   refetch: propRefetch,
// }: InvoiceExplorerProps = {}) {
//   const { user } = useAuthContext();

//   const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
//   const [selectedYear, setSelectedYear] = useState<number | null>(null);
//   const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
//   const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

//   const {
//     data: queryInvoicesData,
//     isLoading: queryLoading,
//     error: queryError,
//     refetch: queryRefetch,
//   } = useQuery<Invoice[]>({
//     queryKey: ["invoices-explorer"],
//     queryFn: async () => {
//       const response = await documentService.getAllDocuments({
//         documentType: "all",
//       });
//       return Array.isArray(response?.data) ? response.data : [];
//     },
//     enabled: !!user && !propDocuments,
//     staleTime: 10 * 1000,
//   });

//   const rawData = propDocuments ?? queryInvoicesData;

//   const invoices: Invoice[] = Array.isArray(rawData)
//     ? rawData.filter((doc): doc is Invoice => {
//         const type = (doc.documentType || "").toLowerCase();
//         const name = (doc.name || "").toLowerCase();
//         return (
//           type === "invoice" ||
//           type === "receipt" ||
//           !!doc.officerCode ||
//           name.includes("invoice") ||
//           name.includes("receipt")
//         );
//       })
//     : [];

//   // ────── DEBUG LOGS (open F12 → Console) ──────
//   console.log("📥 Total documents received:", rawData?.length || 0);
//   console.log("✅ Invoices after filter:", invoices.length);
//   if (invoices.length > 0) {
//     console.log("🔍 First invoice officerCode:", invoices[0].officerCode);
//     console.log("🔍 First invoice full object:", invoices[0]);
//   }

//   const isLoading = propDocuments !== undefined ? false : queryLoading;
//   const error = propDocuments !== undefined ? null : queryError;
//   const refetch = propRefetch || queryRefetch;

//   useEffect(() => {
//     if (error) {
//       console.error("InvoiceExplorer error:", error);
//       toast.error("Failed to load invoices");
//     }
//   }, [error]);

//   const getWeekNum = (date: Date): number => {
//     const year = date.getFullYear();
//     const firstDayOfYear = new Date(year, 0, 1);
//     const pastDaysOfYear =
//       (date.getTime() - firstDayOfYear.getTime()) / 86400000;
//     return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
//   };

//   const grouped = useMemo(() => {
//     const g: any = {};
//     invoices.forEach((inv) => {
//       // FIXED: Better fallback so you can see which invoices are missing the code
//       const officer = (inv.officerCode || "INVOICES").toUpperCase();

//       const date = new Date(inv.invoiceDate || inv.createdAt || Date.now());
//       const year = date.getFullYear();
//       const monthNum = String(date.getMonth() + 1).padStart(2, "0");
//       const monthName = date.toLocaleString("default", { month: "long" });
//       const monthFolder = `${monthNum}-${monthName}`;
//       const weekFolder = `Week-${getWeekNum(date)}`;

//       if (!g[officer]) g[officer] = {};
//       if (!g[officer][year]) g[officer][year] = {};
//       if (!g[officer][year][monthFolder]) g[officer][year][monthFolder] = {};
//       if (!g[officer][year][monthFolder][weekFolder])
//         g[officer][year][monthFolder][weekFolder] = [];

//       g[officer][year][monthFolder][weekFolder].push(inv);
//     });
//     return g;
//   }, [invoices]);

//   // ... rest of the component (resetToTop, goBack, currentItems logic, breadcrumb, return JSX) is unchanged ...

//   const resetToTop = () => {
//     setSelectedOfficer(null);
//     setSelectedYear(null);
//     setSelectedMonth(null);
//     setSelectedWeek(null);
//   };

//   const goBack = () => {
//     if (selectedWeek) setSelectedWeek(null);
//     else if (selectedMonth) setSelectedMonth(null);
//     else if (selectedYear) setSelectedYear(null);
//     else if (selectedOfficer) setSelectedOfficer(null);
//   };

//   let currentItems: any[] = [];
//   let isInvoiceLevel = false;

//   if (!selectedOfficer) {
//     currentItems = Object.keys(grouped).sort();
//   } else if (!selectedYear) {
//     currentItems = Object.keys(grouped[selectedOfficer]).sort(
//       (a, b) => Number(b) - Number(a),
//     );
//   } else if (!selectedMonth) {
//     currentItems = Object.keys(grouped[selectedOfficer][selectedYear]).sort();
//   } else if (!selectedWeek) {
//     currentItems = Object.keys(
//       grouped[selectedOfficer][selectedYear][selectedMonth],
//     ).sort();
//   } else {
//     isInvoiceLevel = true;
//     currentItems = grouped[selectedOfficer][selectedYear][selectedMonth][
//       selectedWeek
//     ].sort(
//       (a: Invoice, b: Invoice) =>
//         new Date(b.invoiceDate || b.createdAt || 0).getTime() -
//         new Date(a.invoiceDate || a.createdAt || 0).getTime(),
//     );
//   }

//   const breadcrumb: BreadcrumbItem[] = [
//     { label: "Invoices & Receipts", onClick: resetToTop },
//     selectedOfficer && {
//       label: selectedOfficer,
//       onClick: () => {
//         setSelectedYear(null);
//         setSelectedMonth(null);
//         setSelectedWeek(null);
//       },
//     },
//     selectedYear && {
//       label: String(selectedYear),
//       onClick: () => setSelectedMonth(null),
//     },
//     selectedMonth && {
//       label: selectedMonth,
//       onClick: () => setSelectedWeek(null),
//     },
//     selectedWeek && { label: selectedWeek, onClick: () => {} },
//   ].filter(Boolean) as BreadcrumbItem[];

//   if (isLoading)
//     return <div className="text-center py-12">Loading invoices...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//           <FileText className="h-8 w-8" />
//           Invoices Explorer
//         </h1>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={goBack}
//             disabled={!selectedOfficer}
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => refetch()}>
//             <RefreshCw className="h-4 w-4 mr-1" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         {breadcrumb.map((crumb, i) => (
//           <div key={i} className="flex items-center gap-2">
//             <span
//               onClick={crumb.onClick}
//               className="cursor-pointer hover:underline text-blue-600"
//             >
//               {crumb.label}
//             </span>
//             {i < breadcrumb.length - 1 && <span>›</span>}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {isInvoiceLevel
//           ? currentItems.map((inv: Invoice) => (
//               <Card
//                 key={inv._id}
//                 className="overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 <CardContent className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <Badge variant="default">Invoice</Badge>
//                     {inv.officerCode && (
//                       <Badge variant="outline" className="font-mono text-xs">
//                         {inv.officerCode}
//                       </Badge>
//                     )}
//                   </div>
//                   <div className="font-semibold text-xl line-clamp-1 mb-1">
//                     {inv.name}
//                   </div>
//                   {inv.customerName && (
//                     <div className="text-sm text-muted-foreground mb-4">
//                       {inv.customerName}
//                     </div>
//                   )}
//                   <div className="flex items-center justify-between text-sm mb-6">
//                     <div className="flex items-center gap-1 text-muted-foreground">
//                       <Calendar className="h-3 w-3" />
//                       {new Date(
//                         inv.invoiceDate || inv.createdAt || Date.now(),
//                       ).toLocaleDateString("en-GB")}
//                     </div>
//                     <div className="font-bold text-lg flex items-center gap-1 text-green-600">
//                       <DollarSign className="h-4 w-4" />
//                       {inv.grandTotal ? inv.grandTotal.toFixed(2) : "0.00"}
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() => window.open(inv.fileUrl, "_blank")}
//                     >
//                       <Eye className="mr-2 h-4 w-4" /> View
//                     </Button>
//                     <Button
//                       variant="default"
//                       size="sm"
//                       className="flex-1"
//                       onClick={() =>
//                         documentService.downloadDocument(
//                           inv._id.toString(),
//                           inv.name,
//                         )
//                       }
//                     >
//                       <Download className="mr-2 h-4 w-4" /> Download
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           : currentItems.map((item) => (
//               <Card
//                 key={item}
//                 className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-border"
//                 onClick={() => {
//                   if (!selectedOfficer) setSelectedOfficer(item);
//                   else if (!selectedYear) setSelectedYear(Number(item));
//                   else if (!selectedMonth) setSelectedMonth(item);
//                   else if (!selectedWeek) setSelectedWeek(item);
//                 }}
//               >
//                 <CardContent className="p-8 flex flex-col items-center justify-center text-center h-44">
//                   <Folder className="h-12 w-12 text-blue-600 mb-4" />
//                   <div className="font-medium text-xl">{item}</div>
//                   <div className="text-xs text-muted-foreground mt-2">
//                     {!selectedOfficer && "Officer Folder"}
//                     {selectedOfficer && !selectedYear && "Year"}
//                     {selectedYear && !selectedMonth && "Month"}
//                     {selectedMonth && !selectedWeek && "Week"}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//       </div>

//       {currentItems.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground">
//           <FileText className="mx-auto h-12 w-12 mb-4 opacity-40" />
//           <p className="text-lg">No invoices found yet</p>
//         </div>
//       )}
//     </div>
//   );
// }

// src/pages/InvoiceExplorer.tsx
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
  FileText,
  ArrowLeft,
  Download,
  Eye,
  //   DollarSign,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { Document } from "../types";

interface Invoice extends Document {
  officerCode?: string;
  customerName?: string;
  grandTotal?: number;
  invoiceNumber?: string;
  invoiceDate?: string;
}

interface InvoiceExplorerProps {
  /** Pass documents from parent (DocumentsPage) so we reuse already-fetched data */
  documents?: Document[];
  /** Optional refetch from parent so Refresh button works with parent's query */
  refetch?: () => void;
}

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
}

export default function InvoiceExplorer({
  documents: propDocuments,
  refetch: propRefetch,
}: InvoiceExplorerProps = {}) {
  const { user } = useAuthContext();

  const [selectedOfficer, setSelectedOfficer] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  // Query only runs when no documents are passed from parent (backward compatibility)
  const {
    data: queryInvoicesData,
    isLoading: queryLoading,
    error: queryError,
    refetch: queryRefetch,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices-explorer"],
    queryFn: async () => {
      const response = await documentService.getAllDocuments({
        documentType: "all",
      });
      return Array.isArray(response?.data) ? response.data : [];
    },
    enabled: !!user && !propDocuments, // ← disabled when props are provided
    staleTime: 10 * 1000,
    gcTime: 2 * 60 * 1000,
  });

  // Use parent data if provided, otherwise fall back to query result
  const rawData = propDocuments ?? queryInvoicesData;

  // Filter to ONLY invoices & receipts (important when parent passes ALL documents)
  const invoices: Invoice[] = Array.isArray(rawData)
    ? rawData.filter(
        (doc): doc is Invoice =>
          (doc.documentType || "").toLowerCase() === "invoice" ||
          (doc.documentType || "").toLowerCase() === "receipt",
      )
    : [];

  const isLoading = propDocuments !== undefined ? false : queryLoading;
  const error = propDocuments !== undefined ? null : queryError;
  const refetch = propRefetch || queryRefetch;

  useEffect(() => {
    if (error) {
      console.error("InvoiceExplorer error:", error);
      toast.error("Failed to load invoices");
    }
  }, [error]);

  const getWeekNum = (date: Date): number => {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const grouped = useMemo(() => {
    const g: any = {};
    invoices.forEach((inv) => {
      const officer = (inv.officerCode || "unknown").toUpperCase();
      const date = new Date(inv.invoiceDate || inv.createdAt || Date.now());
      const year = date.getFullYear();
      const monthNum = String(date.getMonth() + 1).padStart(2, "0");
      const monthName = date.toLocaleString("default", { month: "long" });
      const monthFolder = `${monthNum}-${monthName}`;
      const weekFolder = `Week-${getWeekNum(date)}`;

      if (!g[officer]) g[officer] = {};
      if (!g[officer][year]) g[officer][year] = {};
      if (!g[officer][year][monthFolder]) g[officer][year][monthFolder] = {};
      if (!g[officer][year][monthFolder][weekFolder])
        g[officer][year][monthFolder][weekFolder] = [];

      g[officer][year][monthFolder][weekFolder].push(inv);
    });
    return g;
  }, [invoices]);

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
  let isInvoiceLevel = false;

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
    ).sort();
  } else {
    isInvoiceLevel = true;
    currentItems = grouped[selectedOfficer][selectedYear][selectedMonth][
      selectedWeek
    ].sort(
      (a: Invoice, b: Invoice) =>
        new Date(b.invoiceDate || b.createdAt || 0).getTime() -
        new Date(a.invoiceDate || a.createdAt || 0).getTime(),
    );
  }

  const breadcrumb: BreadcrumbItem[] = [
    { label: "Invoices & Receipts", onClick: resetToTop },
    selectedOfficer && {
      label: selectedOfficer,
      onClick: () => {
        setSelectedYear(null);
        setSelectedMonth(null);
        setSelectedWeek(null);
      },
    },
    selectedYear && {
      label: String(selectedYear),
      onClick: () => setSelectedMonth(null),
    },
    selectedMonth && {
      label: selectedMonth,
      onClick: () => setSelectedWeek(null),
    },
    selectedWeek && { label: selectedWeek, onClick: () => {} },
  ].filter(Boolean) as BreadcrumbItem[];

  if (isLoading) {
    return <div className="text-center py-12">Loading invoices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8" />
          Invoices Explorer
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            disabled={!selectedOfficer}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isInvoiceLevel
          ? currentItems.map((inv: Invoice) => (
              <Card
                key={inv._id}
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="default" className="text-xs">
                      Invoice
                    </Badge>
                    {inv.officerCode && (
                      <Badge variant="outline" className="font-mono text-xs">
                        {inv.officerCode}
                      </Badge>
                    )}
                  </div>

                  <div className="font-semibold text-lg line-clamp-1 mb-1">
                    {inv.name}
                  </div>
                  {inv.customerName && (
                    <div className="text-sm text-muted-foreground mb-3">
                      {inv.customerName}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(
                        inv.invoiceDate || inv.createdAt || Date.now(),
                      ).toLocaleDateString("en-GB")}
                    </div>
                    {/* <div className="font-bold text-base flex items-center gap-1 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      {inv.grandTotal ? inv.grandTotal.toFixed(2) : "0.00"}
                    </div> */}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => window.open(inv.fileUrl, "_blank")}
                    >
                      <Eye className="mr-2 h-3 w-3" /> View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() =>
                        documentService.downloadDocument(
                          inv._id.toString(),
                          inv.name,
                        )
                      }
                    >
                      <Download className="mr-2 h-3 w-3" /> Download
                    </Button>
                  </div>
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
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-36">
                  <Folder className="h-10 w-10 text-blue-600 mb-3" />
                  <div className="font-medium text-lg">{item}</div>
                  <div className="text-xs text-muted-foreground mt-1">
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
          <FileText className="mx-auto h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg">No invoices found yet</p>
          <p className="text-sm mt-1">
            Create your first invoice using the "Create Invoice via Public Link"
            button above
          </p>
        </div>
      )}
    </div>
  );
}
