// // export default DocumentUpload;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/components/DocumentUpload.tsx
// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { Alert, AlertDescription } from "./ui/alert";
// import {
//   File,
//   AlertCircle,
//   CheckCircle,
//   Building,
//   Calendar,
//   // REMOVED: DollarSign (replaced with Unicode ₦ for Naira)
// } from "lucide-react";
// import type { Organization } from "../types";

// interface DocumentUploadProps {
//   onUpload: (
//     file: File,
//     name: string,
//     type: string,
//     organizationId: string,
//     startDate?: string,
//     expiryDate?: string,
//     negotiatedAmount?: number // NEW: Optional negotiated amount
//   ) => Promise<void>;
//   organizations: Organization[];
//   currentUserOrg?: string;
//   loading?: boolean;
//   error?: string;
//   success?: string;
// }

// export function DocumentUpload({
//   onUpload,
//   organizations,
//   currentUserOrg,
//   loading,
//   error,
//   success,
// }: DocumentUploadProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [name, setName] = useState("");
//   const [documentType, setDocumentType] = useState("");
//   const [selectedOrganization, setSelectedOrganization] = useState(
//     currentUserOrg || ""
//   );
//   const [startDate, setStartDate] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [negotiatedAmount, setNegotiatedAmount] = useState(""); // NEW: String for input with commas

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       if (!name) {
//         setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
//       }
//     }
//   };

//   // NEW: Parse negotiated amount on change, allowing commas
//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/,/g, ""); // Remove commas for storage, but allow in display
//     // Re-allow only numbers and commas for user input
//     const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     setNegotiatedAmount(formattedValue);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (file && name && documentType && selectedOrganization) {
//       // Basic client-side validation for dates
//       let startDateObj, expiryDateObj;
//       if (startDate) {
//         startDateObj = new Date(startDate);
//         if (isNaN(startDateObj.getTime())) {
//           // Handle invalid date error (e.g., set error prop or alert)
//           return;
//         }
//       }
//       if (expiryDate) {
//         expiryDateObj = new Date(expiryDate);
//         if (isNaN(expiryDateObj.getTime())) {
//           // Handle invalid date error
//           return;
//         }
//         if (startDate && startDateObj && expiryDateObj <= startDateObj) {
//           // Handle invalid date order error
//           return;
//         }
//       }
//       // NEW: Parse negotiated amount
//       let parsedNegotiatedAmount: number | undefined;
//       if (negotiatedAmount.trim()) {
//         const cleanAmount = negotiatedAmount.replace(/,/g, "");
//         parsedNegotiatedAmount = parseFloat(cleanAmount);
//         if (isNaN(parsedNegotiatedAmount) || parsedNegotiatedAmount < 0) {
//           // Handle invalid amount error
//           return;
//         }
//       }
//       try {
//         await onUpload(
//           file,
//           name,
//           documentType,
//           selectedOrganization,
//           startDate || undefined,
//           expiryDate || undefined,
//           parsedNegotiatedAmount
//         );
//         // Reset form immediately after successful upload
//         setFile(null);
//         setName("");
//         setDocumentType("");
//         setSelectedOrganization(currentUserOrg || "");
//         setStartDate("");
//         setExpiryDate("");
//         setNegotiatedAmount(""); // NEW: Reset amount
//         // Reset file input
//         const fileInput = document.getElementById("file") as HTMLInputElement;
//         if (fileInput) fileInput.value = "";
//       } catch (err) {
//         // Error handling can be done via parent props (error)
//         console.error("Upload failed:", err);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <Label htmlFor="organization">Select Organization</Label>
//         <Select
//           value={selectedOrganization}
//           onValueChange={setSelectedOrganization}
//           required
//         >
//           <SelectTrigger>
//             <Building className="h-4 w-4 mr-2" />
//             <SelectValue placeholder="Choose organization folder" />
//           </SelectTrigger>
//           <SelectContent>
//             {organizations.map((org) => (
//               <SelectItem key={org._id} value={org._id}>
//                 {org.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="file">Choose File (PDF, Image, or Word Document)</Label>
//         <div className="relative">
//           <Input
//             id="file"
//             type="file"
//             accept=".pdf,application/pdf,.jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp,image/*,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//             onChange={handleFileChange}
//             className="cursor-pointer"
//             required
//           />
//           {file && (
//             <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
//               <File className="h-4 w-4" />
//               <span>{file.name}</span>
//               <span className="text-xs">
//                 ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <div className="space-y-2">
//         <Label htmlFor="file">Choose File (PDF)</Label>
//         <div className="relative">
//           <Input
//             id="file"
//             type="file"
//             accept=".pdf"
//             onChange={handleFileChange}
//             className="cursor-pointer"
//             required
//           />
//           {file && (
//             <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
//               <File className="h-4 w-4" />
//               <span>{file.name}</span>
//               <span className="text-xs">
//                 ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </span>
//             </div>
//           )}
//         </div>
//       </div> */}

//       <div className="space-y-2">
//         <Label htmlFor="name">Document Name</Label>
//         <Input
//           id="name"
//           type="text"
//           placeholder="Enter document name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="type">Document Type</Label>
//         <Select value={documentType} onValueChange={setDocumentType} required>
//           <SelectTrigger>
//             <SelectValue placeholder="Select document type" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Contract">Contract</SelectItem>
//             <SelectItem value="SLA">SLA (Service Level Agreement)</SelectItem>
//             <SelectItem value="NDA">NDA (Non-Disclosure Agreement)</SelectItem>
//             <SelectItem value="Other">Other</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* UPDATED: Negotiated Amount Field with Naira symbol (₦) */}
//       <div className="space-y-2">
//         <Label htmlFor="negotiatedAmount">
//           <div className="flex items-center gap-2">
//             <span className="text-lg font-bold">₦</span>{" "}
//             {/* UPDATED: Unicode Naira symbol */}
//             Negotiated Amount (Optional, e.g., 540,000)
//           </div>
//         </Label>
//         <Input
//           id="negotiatedAmount"
//           type="text"
//           placeholder="Enter amount (commas allowed)"
//           value={negotiatedAmount}
//           onChange={handleAmountChange}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="startDate">
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4" />
//             Start Date (Optional)
//           </div>
//         </Label>
//         <Input
//           id="startDate"
//           type="date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="expiryDate">
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4" />
//             Expiry Date (Optional)
//           </div>
//         </Label>
//         <Input
//           id="expiryDate"
//           type="date"
//           value={expiryDate}
//           onChange={(e) => setExpiryDate(e.target.value)}
//           min={startDate}
//         />
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {success && (
//         <Alert className="border-success bg-success-light">
//           <CheckCircle className="h-4 w-4 text-success" />
//           <AlertDescription className="text-success">
//             {success}
//           </AlertDescription>
//         </Alert>
//       )}

//       <Button
//         type="submit"
//         className="w-full"
//         disabled={
//           loading || !file || !name || !documentType || !selectedOrganization
//         }
//       >
//         {loading ? "Uploading..." : "Upload Document to organization"}
//       </Button>
//     </form>
//   );
// }

// export default DocumentUpload;

/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/DocumentUpload.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import {
  File,
  AlertCircle,
  CheckCircle,
  Building,
  Calendar,
  Loader2, // Added for spinner
} from "lucide-react";
import type { Organization } from "../types";

interface DocumentUploadProps {
  onUpload: (
    file: File,
    name: string,
    type: string,
    organizationId: string,
    startDate?: string,
    expiryDate?: string
  ) => Promise<void>;
  organizations: Organization[];
  currentUserOrg?: string;
  loading?: boolean;
  error?: string;
  success?: string;
}

export function DocumentUpload({
  onUpload,
  organizations,
  currentUserOrg,
  loading = false, // default to false
  error,
  success,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(
    currentUserOrg || ""
  );
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Local submitting state for instant feedback
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = loading || isSubmitting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !file ||
      !name ||
      !documentType ||
      !selectedOrganization ||
      isSubmitting
    )
      return;

    setIsSubmitting(true); // Instant loading starts here

    try {
      // Date validation
      if (startDate && isNaN(new Date(startDate).getTime())) {
        setIsSubmitting(false);
        return;
      }
      if (expiryDate) {
        const exp = new Date(expiryDate);
        if (isNaN(exp.getTime())) {
          setIsSubmitting(false);
          return;
        }
        if (startDate && exp <= new Date(startDate)) {
          setIsSubmitting(false);
          return;
        }
      }

      await onUpload(
        file,
        name,
        documentType,
        selectedOrganization,
        startDate || undefined,
        expiryDate || undefined
      );

      // Reset form on success
      setFile(null);
      setName("");
      setDocumentType("");
      setSelectedOrganization(currentUserOrg || "");
      setStartDate("");
      setExpiryDate("");

      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsSubmitting(false); // Always stop local loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... [All your existing fields remain unchanged] ... */}

      <div className="space-y-4">
        <Label htmlFor="organization">Select Organization</Label>
        <Select
          value={selectedOrganization}
          onValueChange={setSelectedOrganization}
          required
          disabled={isLoading}
        >
          <SelectTrigger>
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Choose organization folder" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org._id} value={org._id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Choose File (PDF, Image, or Word Document)</Label>
        <div className="relative">
          <Input
            id="file"
            type="file"
            accept=".pdf,application/pdf,.jpg,.jpeg,.png,.gif,.webp,image/*,.doc,.docx"
            onChange={handleFileChange}
            className="cursor-pointer"
            required
            disabled={isLoading}
          />
          {file && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <File className="h-4 w-4" />
              <span>{file.name}</span>
              <span className="text-xs">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Document Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter document name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Document Type</Label>
        <Select
          value={documentType}
          onValueChange={setDocumentType}
          required
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="SLA">SLA (Service Level Agreement)</SelectItem>
            <SelectItem value="NDA">NDA (Non-Disclosure Agreement)</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date (Optional)
          </div>
        </Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiryDate">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Expiry Date (Optional)
          </div>
        </Label>
        <Input
          id="expiryDate"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          min={startDate}
          disabled={isLoading}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success bg-success-light">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          isLoading || !file || !name || !documentType || !selectedOrganization
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Document to organization"
        )}
      </Button>
    </form>
  );
}

export default DocumentUpload;
