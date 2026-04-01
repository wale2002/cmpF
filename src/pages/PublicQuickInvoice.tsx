// // // src/pages/PublicQuickInvoice.tsx
// // import { useState } from "react";
// // import { toast } from "sonner";
// // import { Button } from "../components/ui/button";
// // import { Input } from "../components/ui/input";
// // import { Label } from "../components/ui/label";
// // import { FileText, Loader2 } from "lucide-react";
// // import { documentService } from "../lib/api"; // ← Same pattern as PublicEnumeratorForm

// // export default function PublicQuickInvoice() {
// //   const [invoiceName, setInvoiceName] = useState("");
// //   const [customerName, setCustomerName] = useState("");
// //   const [customerAddress, setCustomerAddress] = useState("");
// //   const [invoiceDate, setInvoiceDate] = useState(
// //     new Date().toISOString().split("T")[0],
// //   );
// //   const [items, setItems] = useState([
// //     { description: "", quantity: 1, unitPrice: 0 },
// //   ]);
// //   const [loading, setLoading] = useState(false); // ← renamed for consistency
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const addItem = () => {
// //     setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
// //   };

// //   const updateItem = (index: number, field: string, value: any) => {
// //     const newItems = [...items];
// //     newItems[index] = { ...newItems[index], [field]: value };
// //     setItems(newItems);
// //   };

// //   const previewTotal = items.reduce(
// //     (sum, item) => sum + item.quantity * item.unitPrice,
// //     0,
// //   );

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (
// //       !customerName ||
// //       items.length === 0 ||
// //       items.every((i) => !i.description.trim())
// //     ) {
// //       setError("Customer name and at least one item description are required");
// //       return toast.error("Customer name and at least one item are required");
// //     }

// //     setLoading(true);
// //     setError("");
// //     setSuccess("");

// //     const payload = {
// //       invoiceName,
// //       customerName,
// //       customerAddress,
// //       invoiceDate,
// //       items,
// //     };

// //     try {
// //       // ✅ Now using documentService (same clean pattern as PublicEnumeratorForm)
// //       await documentService.submitPublicQuickInvoice(payload);

// //       setSuccess("Thank you! Your invoice has been created.");
// //       toast.success("Invoice created successfully!");

// //       // Reset form
// //       setInvoiceName("");
// //       setCustomerName("");
// //       setCustomerAddress("");
// //       setInvoiceDate(new Date().toISOString().split("T")[0]);
// //       setItems([{ description: "", quantity: 1, unitPrice: 0 }]);

// //       setTimeout(() => setSuccess(""), 5000);
// //     } catch (err: any) {
// //       console.error("Quick invoice submission error:", err);
// //       const message =
// //         err.message || "Failed to create invoice. Please try again.";
// //       setError(message);
// //       toast.error(message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-12 px-4">
// //       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
// //         {/* Header */}
// //         <div className="flex items-center gap-3 mb-10">
// //           <FileText className="h-9 w-9 text-blue-600" />
// //           <h1 className="text-4xl font-bold tracking-tight">Create Invoice</h1>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-8">
// //           {/* Invoice Name */}
// //           <div>
// //             <Label>Invoice Name (optional)</Label>
// //             <Input
// //               placeholder="e.g. Monthly Service - March 2026"
// //               value={invoiceName}
// //               onChange={(e) => setInvoiceName(e.target.value)}
// //             />
// //           </div>

// //           {/* Customer Info */}
// //           <div className="grid grid-cols-2 gap-6">
// //             <div>
// //               <Label>Customer Name *</Label>
// //               <Input
// //                 value={customerName}
// //                 onChange={(e) => setCustomerName(e.target.value)}
// //                 required
// //               />
// //             </div>
// //             <div>
// //               <Label>Invoice Date</Label>
// //               <Input
// //                 type="date"
// //                 value={invoiceDate}
// //                 onChange={(e) => setInvoiceDate(e.target.value)}
// //                 required
// //               />
// //             </div>
// //           </div>

// //           <div>
// //             <Label>Customer Address (optional)</Label>
// //             <Input
// //               value={customerAddress}
// //               onChange={(e) => setCustomerAddress(e.target.value)}
// //             />
// //           </div>

// //           {/* Items */}
// //           <div>
// //             <Label className="block mb-3">Items</Label>
// //             {items.map((item, index) => (
// //               <div key={index} className="flex gap-3 mb-4">
// //                 <Input
// //                   placeholder="Description"
// //                   value={item.description}
// //                   onChange={(e) =>
// //                     updateItem(index, "description", e.target.value)
// //                   }
// //                   className="flex-1"
// //                 />
// //                 <Input
// //                   type="number"
// //                   placeholder="Qty"
// //                   value={item.quantity}
// //                   onChange={(e) =>
// //                     updateItem(index, "quantity", Number(e.target.value) || 0)
// //                   }
// //                   className="w-24"
// //                 />
// //                 <Input
// //                   type="number"
// //                   placeholder="Unit Price"
// //                   value={item.unitPrice}
// //                   onChange={(e) =>
// //                     updateItem(index, "unitPrice", Number(e.target.value) || 0)
// //                   }
// //                   className="w-32"
// //                 />
// //               </div>
// //             ))}

// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={addItem}
// //               className="mt-2"
// //             >
// //               + Add Item
// //             </Button>
// //           </div>

// //           {/* Live Total */}
// //           <div className="flex justify-end">
// //             <div className="text-right">
// //               <p className="text-sm text-muted-foreground">Total Amount</p>
// //               <p className="text-4xl font-bold text-blue-600">
// //                 ${previewTotal.toFixed(2)}
// //               </p>
// //             </div>
// //           </div>

// //           <Button
// //             type="submit"
// //             className="w-full text-lg py-7"
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <>
// //                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
// //                 Generating Invoice...
// //               </>
// //             ) : (
// //               "Generate & Download Invoice"
// //             )}
// //           </Button>
// //         </form>

// //         {error && (
// //           <p className="text-center text-red-500 text-sm mt-4">{error}</p>
// //         )}
// //         {success && (
// //           <p className="text-center text-green-600 text-sm mt-4">{success}</p>
// //         )}

// //         <p className="text-center text-xs text-muted-foreground mt-8">
// //           No login required • Public form
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// // src/pages/PublicQuickInvoice.tsx
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { FileText, Loader2, Hash } from "lucide-react";
// import { documentService } from "../lib/api";

// export default function PublicQuickInvoice() {
//   const [invoiceName, setInvoiceName] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [customerAddress, setCustomerAddress] = useState("");
//   const [invoiceDate, setInvoiceDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );
//   const [officerCode, setOfficerCode] = useState(""); // ← NEW: Required for categorization
//   const [items, setItems] = useState([
//     { description: "", quantity: 1, unitPrice: 0 },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const addItem = () => {
//     setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [field]: value };
//     setItems(newItems);
//   };

//   const previewTotal = items.reduce(
//     (sum, item) => sum + item.quantity * item.unitPrice,
//     0,
//   );

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !customerName ||
//       !officerCode.trim() ||
//       items.length === 0 ||
//       items.every((i) => !i.description.trim())
//     ) {
//       setError(
//         "Customer name, Officer Code, and at least one item are required",
//       );
//       return toast.error(
//         "Customer name, Officer Code, and at least one item are required",
//       );
//     }

//     setLoading(true);
//     setError("");
//     setSuccess("");

//     const payload = {
//       invoiceName,
//       customerName,
//       customerAddress,
//       invoiceDate,
//       items,
//       officerCode: officerCode.trim().toUpperCase(), // ← Sent to backend
//     };

//     try {
//       await documentService.submitPublicQuickInvoice(payload);

//       setSuccess("Thank you! Your invoice has been created.");
//       toast.success("Invoice created successfully!");

//       // Reset form
//       setInvoiceName("");
//       setCustomerName("");
//       setCustomerAddress("");
//       setOfficerCode("");
//       setInvoiceDate(new Date().toISOString().split("T")[0]);
//       setItems([{ description: "", quantity: 1, unitPrice: 0 }]);

//       setTimeout(() => setSuccess(""), 5000);
//     } catch (err: any) {
//       console.error("Quick invoice submission error:", err);
//       const message =
//         err.message || "Failed to create invoice. Please try again.";
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-10">
//           <FileText className="h-9 w-9 text-blue-600" />
//           <h1 className="text-4xl font-bold tracking-tight">Create Invoice</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Officer Code - NEW */}
//           <div>
//             <Label>
//               <div className="flex items-center gap-2">
//                 <Hash className="h-4 w-4" />
//                 Officer Code <span className="text-red-500">*</span>
//               </div>
//             </Label>
//             <Input
//               placeholder="e.g. RO-A3X9K2M7 or ENUM-4X8M2P9"
//               value={officerCode}
//               onChange={(e) =>
//                 setOfficerCode(e.target.value.trim().toUpperCase())
//               }
//               required
//               className="font-mono"
//             />
//             <p className="text-xs text-muted-foreground mt-1">
//               This determines the folder: invoices/{`{officerCode}`}
//               /Year/Month/Week/
//             </p>
//           </div>

//           {/* Invoice Name */}
//           <div>
//             <Label>Invoice Name (optional)</Label>
//             <Input
//               placeholder="e.g. Monthly Service - March 2026"
//               value={invoiceName}
//               onChange={(e) => setInvoiceName(e.target.value)}
//             />
//           </div>

//           {/* Customer Info */}
//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <Label>Customer Name *</Label>
//               <Input
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 required
//               />
//             </div>
//             <div>
//               <Label>Invoice Date</Label>
//               <Input
//                 type="date"
//                 value={invoiceDate}
//                 onChange={(e) => setInvoiceDate(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <Label>Customer Address (optional)</Label>
//             <Input
//               value={customerAddress}
//               onChange={(e) => setCustomerAddress(e.target.value)}
//             />
//           </div>

//           {/* Items */}
//           <div>
//             <Label className="block mb-3">Items</Label>
//             {items.map((item, index) => (
//               <div key={index} className="flex gap-3 mb-4">
//                 <Input
//                   placeholder="Description"
//                   value={item.description}
//                   onChange={(e) =>
//                     updateItem(index, "description", e.target.value)
//                   }
//                   className="flex-1"
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Qty"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     updateItem(index, "quantity", Number(e.target.value) || 0)
//                   }
//                   className="w-24"
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Unit Price"
//                   value={item.unitPrice}
//                   onChange={(e) =>
//                     updateItem(index, "unitPrice", Number(e.target.value) || 0)
//                   }
//                   className="w-32"
//                 />
//               </div>
//             ))}

//             <Button
//               type="button"
//               variant="outline"
//               onClick={addItem}
//               className="mt-2"
//             >
//               + Add Item
//             </Button>
//           </div>

//           {/* Live Total */}
//           <div className="flex justify-end">
//             <div className="text-right">
//               <p className="text-sm text-muted-foreground">Total Amount</p>
//               <p className="text-4xl font-bold text-blue-600">
//                 ${previewTotal.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full text-lg py-7"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Generating Invoice...
//               </>
//             ) : (
//               "Generate & Download Invoice"
//             )}
//           </Button>
//         </form>

//         {error && (
//           <p className="text-center text-red-500 text-sm mt-4">{error}</p>
//         )}
//         {success && (
//           <p className="text-center text-green-600 text-sm mt-4">{success}</p>
//         )}

//         <p className="text-center text-xs text-muted-foreground mt-8">
//           No login required • Public form
//         </p>
//       </div>
//     </div>
//   );
// }

// src/pages/PublicQuickInvoice.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { FileText, Loader2, Hash } from "lucide-react";
import { documentService } from "../lib/api";

export default function PublicQuickInvoice() {
  const [invoiceName, setInvoiceName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Officer dropdown
  const [officers, setOfficers] = useState<any[]>([]);
  const [selectedOfficerCode, setSelectedOfficerCode] = useState("");
  const [loadingOfficers, setLoadingOfficers] = useState(true);

  const [items, setItems] = useState([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch active officers using documentService
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await documentService.getActiveOfficers();

        // Handle both possible response formats
        const officersList = response?.data?.data || response?.data || [];
        setOfficers(officersList);
      } catch (err) {
        console.error("Failed to load officers:", err);
        toast.error(
          "Could not load officer list. Please make sure the backend is running.",
        );
        setOfficers([]);
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, []);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const previewTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerName ||
      !selectedOfficerCode ||
      items.length === 0 ||
      items.every((i) => !i.description.trim())
    ) {
      setError(
        "Customer name, Officer Code, and at least one item are required",
      );
      return toast.error(
        "Customer name, Officer Code, and at least one item are required",
      );
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      invoiceName,
      customerName,
      customerAddress,
      invoiceDate,
      items,
      officerCode: selectedOfficerCode,
    };

    try {
      await documentService.submitPublicQuickInvoice(payload);

      setSuccess("Thank you! Your invoice has been created.");
      toast.success("Invoice created successfully!");

      // Reset form
      setInvoiceName("");
      setCustomerName("");
      setCustomerAddress("");
      setSelectedOfficerCode("");
      setInvoiceDate(new Date().toISOString().split("T")[0]);
      setItems([{ description: "", quantity: 1, unitPrice: 0 }]);

      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      console.error("Quick invoice submission error:", err);
      const message =
        err.message || "Failed to create invoice. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <FileText className="h-9 w-9 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight">Create Invoice</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Officer Code Dropdown */}
          <div>
            <Label>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Officer Code <span className="text-red-500">*</span>
              </div>
            </Label>
            <Select
              value={selectedOfficerCode}
              onValueChange={setSelectedOfficerCode}
            >
              <SelectTrigger className="font-mono">
                <SelectValue placeholder="Select assigned officer" />
              </SelectTrigger>
              <SelectContent>
                {loadingOfficers ? (
                  <SelectItem value="loading" disabled>
                    Loading officers...
                  </SelectItem>
                ) : officers.length === 0 ? (
                  <SelectItem value="no-officers" disabled>
                    No officers available
                  </SelectItem>
                ) : (
                  officers.map((officer: any) => (
                    <SelectItem key={officer.code} value={officer.code}>
                      {officer.code} — {officer.name} ({officer.role})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Only approved officers appear here. Each officer has their own
              folder.
            </p>
          </div>

          {/* Invoice Name */}
          <div>
            <Label>Invoice Name (optional)</Label>
            <Input
              placeholder="e.g. Monthly Service - March 2026"
              value={invoiceName}
              onChange={(e) => setInvoiceName(e.target.value)}
            />
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>Customer Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Customer Address (optional)</Label>
            <Input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          {/* Items */}
          <div>
            <Label className="block mb-3">Items</Label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 mb-4">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value) || 0)
                  }
                  className="w-24"
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", Number(e.target.value) || 0)
                  }
                  className="w-32"
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="mt-2"
            >
              + Add Item
            </Button>
          </div>

          {/* Live Total */}
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-4xl font-bold text-blue-600">
                ${previewTotal.toFixed(2)}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg py-7"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Invoice...
              </>
            ) : (
              "Generate & Download Invoice"
            )}
          </Button>
        </form>

        {error && (
          <p className="text-center text-red-500 text-sm mt-4">{error}</p>
        )}
        {success && (
          <p className="text-center text-green-600 text-sm mt-4">{success}</p>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          No login required • Public form
        </p>
      </div>
    </div>
  );
}
