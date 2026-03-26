// // src/pages/PublicEnumeratorForm.tsx
// import { useState } from "react";
// import { EnumeratorUploadForm } from "../components/EnumeratorUploadForm";
// import { toast } from "sonner";
// import { documentService } from "../lib/api"; // ← NEW IMPORT

// export default function PublicEnumeratorForm() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handlePublicSubmit = async (
//     picture: File | null,
//     fullName: string,
//     role: "Regional Officer" | "Enumerator",
//     phoneNumber: string,
//     schoolName: string,
//     localGovernment: string,
//     topicBeingTaught: string,
//     latitude?: string,
//     longitude?: string,
//     dateOfVisit?: string,
//     status:
//       | "Satisfactory Performance"
//       | "School Did Not Perform Satisfactorily" = "Satisfactory Performance",
//   ) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     if (!picture) {
//       setError("Picture is required");
//       setLoading(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("picture", picture);
//     formData.append("fullName", fullName);
//     formData.append("role", role);
//     formData.append("phoneNumber", phoneNumber);
//     formData.append("schoolName", schoolName);
//     formData.append("localGovernment", localGovernment);
//     formData.append("topicBeingTaught", topicBeingTaught);
//     if (latitude) formData.append("latitude", latitude);
//     if (longitude) formData.append("longitude", longitude);
//     if (dateOfVisit) formData.append("dateOfVisit", dateOfVisit);
//     formData.append("status", status);

//     try {
//       // ✅ Now using the service (cleaner + uses BASE_URL from api.ts)
//       const result =
//         await documentService.submitPublicSchoolVisitReport(formData);

//       setSuccess("Thank you! Your report has been received.");
//       toast.success("Report submitted successfully!");

//       setTimeout(() => setSuccess(""), 5000);
//     } catch (err: any) {
//       console.error("Submission error:", err);
//       setError(err.message || "Failed to submit report. Please try again.");
//       toast.error("Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background py-12 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold">School Visit Report</h1>
//           <p className="text-muted-foreground mt-3">
//             Regional Officer / Enumerator Form
//           </p>
//           <p className="text-xs text-muted-foreground mt-1">
//             No login required • Public link
//           </p>
//         </div>

//         <div className="bg-card border rounded-2xl p-8 shadow">
//           <EnumeratorUploadForm
//             onSubmit={handlePublicSubmit}
//             publicFormUrl="https://cmp-sage.vercel.app/public/enumerator-form"
//             loading={loading}
//             error={error}
//             success={success}
//           />
//         </div>

//         <p className="text-center text-xs text-muted-foreground mt-8">
//           Powered by CMP-SAGE
//         </p>
//       </div>
//     </div>
//   );
// }

// src/pages/PublicEnumeratorForm.tsx
import { useState } from "react";
import { EnumeratorUploadForm } from "../components/EnumeratorUploadForm";
import { toast } from "sonner";
import { documentService } from "../lib/api";

export default function PublicEnumeratorForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePublicSubmit = async (
    picture: File | null,
    fullName: string,
    role: "Regional Officer" | "Enumerator",
    phoneNumber: string,
    schoolName: string,
    localGovernment: string,
    topicBeingTaught: string,
    officerCode: string, // ← required
    status:
      | "Satisfactory Performance"
      | "School Did Not Perform Satisfactorily",
    latitude?: string,
    longitude?: string,
    dateOfVisit?: string,
  ) => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!picture) {
      setError("Picture is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("picture", picture);
    formData.append("fullName", fullName);
    formData.append("role", role);
    formData.append("phoneNumber", phoneNumber);
    formData.append("schoolName", schoolName);
    formData.append("localGovernment", localGovernment);
    formData.append("topicBeingTaught", topicBeingTaught);
    formData.append("officerCode", officerCode);
    formData.append("status", status);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (dateOfVisit) formData.append("dateOfVisit", dateOfVisit);

    try {
      await documentService.submitPublicSchoolVisitReport(formData); // ← removed unused 'result'

      setSuccess("Thank you! Your report has been received.");
      toast.success("Report submitted successfully!");

      setTimeout(() => setSuccess(""), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit report. Please try again.");
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">School Visit Report</h1>
          <p className="text-muted-foreground mt-3">
            Regional Officer / Enumerator Form
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            No login required • Public link
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow">
          <EnumeratorUploadForm
            onSubmit={handlePublicSubmit}
            publicFormUrl="https://cmp-sage.vercel.app/public/enumerator-form"
            loading={loading}
            error={error}
            success={success}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Powered by CMP-SAGE
        </p>
      </div>
    </div>
  );
}
