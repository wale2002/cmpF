// src/pages/PublicEnumeratorForm.tsx
import { useState } from "react";
import { EnumeratorUploadForm } from "../components/EnumeratorUploadForm";
import { toast } from "sonner";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

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

    // For now we just log + show success (no backend)
    console.log("✅ Public Field Report Received:", {
      fullName,
      role,
      phoneNumber,
      schoolName,
      localGovernment,
      topicBeingTaught,
      latitude,
      longitude,
      dateOfVisit,
    });

    setSuccess("Thank you! Your report has been received.");
    toast.success("Report submitted successfully!");

    setTimeout(() => setSuccess(""), 5000);
    setLoading(false);
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
