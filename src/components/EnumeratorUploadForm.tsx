// src/components/EnumeratorUploadForm.tsx
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
  User,
  Phone,
  Camera,
  MapPin,
  School,
  BookOpen,
  Share2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Hash, // ← for Officer Code
} from "lucide-react";

interface EnumeratorUploadFormProps {
  onSubmit: (
    picture: File | null,
    fullName: string,
    role: "Regional Officer" | "Enumerator",
    phoneNumber: string,
    schoolName: string,
    localGovernment: string,
    topicBeingTaught: string,
    officerCode: string,
    status:
      | "Satisfactory Performance"
      | "School Did Not Perform Satisfactorily",
    latitude?: string,
    longitude?: string,
    dateOfVisit?: string,
  ) => Promise<void>;
  publicFormUrl?: string;
  loading?: boolean;
  error?: string;
  success?: string;
}

export function EnumeratorUploadForm({
  onSubmit,
  publicFormUrl = "https://cmp-sage.vercel.app/enumerator-form",
  loading = false,
  error,
  success,
}: EnumeratorUploadFormProps) {
  const [picture, setPicture] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"Regional Officer" | "Enumerator">(
    "Enumerator",
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officerCode, setOfficerCode] = useState(""); // ← NEW
  const [schoolName, setSchoolName] = useState("");
  const [localGovernment, setLocalGovernment] = useState("");
  const [topicBeingTaught, setTopicBeingTaught] = useState("");

  const [status, setStatus] = useState<
    "Satisfactory Performance" | "School Did Not Perform Satisfactorily"
  >("Satisfactory Performance");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [dateOfVisit, setDateOfVisit] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">(
    "idle",
  );

  const isLoading = loading || isSubmitting;

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setPicture(selectedFile);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      (error) => {
        console.error("Location error:", error);
        alert(
          "Unable to retrieve location. Please allow access or enter manually.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleShareLink = async () => {
    const shareUrl = publicFormUrl;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "School Visit Form – Regional Officer / Enumerator",
          text: "Please fill this form for your school visit / data collection (no login needed)",
          url: shareUrl,
        });
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("copied");
      }
      setTimeout(() => setShareStatus("idle"), 3000);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName ||
      !phoneNumber ||
      !schoolName ||
      !localGovernment ||
      !topicBeingTaught ||
      !officerCode || // ← required
      isSubmitting
    )
      return;

    setIsSubmitting(true);

    try {
      await onSubmit(
        picture,
        fullName,
        role,
        phoneNumber,
        schoolName,
        localGovernment,
        topicBeingTaught,
        officerCode, // ← correct position
        status, // ← correct position
        latitude || undefined,
        longitude || undefined,
        dateOfVisit || undefined,
      );

      // Reset form
      setPicture(null);
      setFullName("");
      setPhoneNumber("");
      setOfficerCode("");
      setSchoolName("");
      setLocalGovernment("");
      setTopicBeingTaught("");
      setStatus("Satisfactory Performance");
      setLatitude("");
      setLongitude("");
      setDateOfVisit(() => new Date().toISOString().split("T")[0]);

      const fileInput = document.getElementById("picture") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Share Public Link Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleShareLink}
          disabled={isLoading}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          {shareStatus === "copied"
            ? "✅ Public Link Copied!"
            : shareStatus === "shared"
              ? "✅ Shared!"
              : "Share Public Form Link"}
        </Button>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={role}
          onValueChange={(value) =>
            setRole(value as "Regional Officer" | "Enumerator")
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Regional Officer">Regional Officer</SelectItem>
            <SelectItem value="Enumerator">Enumerator</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ====================== OFFICER CODE ====================== */}
      <div className="space-y-2">
        <Label htmlFor="officerCode">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Officer Code <span className="text-red-500">*</span>
          </div>
        </Label>
        <Input
          id="officerCode"
          type="text"
          placeholder="e.g. reg-01, reg-02, enum-01..."
          value={officerCode}
          onChange={(e) => setOfficerCode(e.target.value.trim().toLowerCase())}
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          This determines the folder: Year/Month/Week/{`{officerCode}`}
        </p>
      </div>
      {/* ====================== END OFFICER CODE ====================== */}

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </div>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="+234 XXX XXX XXXX"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Picture */}
      <div className="space-y-2">
        <Label htmlFor="picture">Upload Picture (Selfie / ID Photo)</Label>
        <div className="relative">
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="cursor-pointer"
            disabled={isLoading}
          />
          {picture && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>{picture.name}</span>
              <span className="text-xs">
                ({(picture.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location (School / Field)
            </div>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="gap-1 text-xs"
          >
            📍 Get Current Location
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude" className="text-xs text-muted-foreground">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="text"
              placeholder="6.524379"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label
              htmlFor="longitude"
              className="text-xs text-muted-foreground"
            >
              Longitude
            </Label>
            <Input
              id="longitude"
              type="text"
              placeholder="3.379206"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* School Name */}
      <div className="space-y-2">
        <Label htmlFor="schoolName">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Name of School
          </div>
        </Label>
        <Input
          id="schoolName"
          type="text"
          placeholder="Enter school name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* LGA */}
      <div className="space-y-2">
        <Label htmlFor="localGovernment">Local Government Area (LGA)</Label>
        <Input
          id="localGovernment"
          type="text"
          placeholder="e.g. Ikeja, Alimosho, Kosofe..."
          value={localGovernment}
          onChange={(e) => setLocalGovernment(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Topic */}
      <div className="space-y-2">
        <Label htmlFor="topicBeingTaught">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Topic Being Taught
          </div>
        </Label>
        <Input
          id="topicBeingTaught"
          type="text"
          placeholder="e.g. Mathematics, English, Civic Education..."
          value={topicBeingTaught}
          onChange={(e) => setTopicBeingTaught(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* School Performance Status */}
      <div className="space-y-2">
        <Label htmlFor="status">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            School Performance Status
          </div>
        </Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setStatus(
              value as
                | "Satisfactory Performance"
                | "School Did Not Perform Satisfactorily",
            )
          }
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select performance status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Satisfactory Performance">
              ✅ Satisfactory Performance
            </SelectItem>
            <SelectItem value="School Did Not Perform Satisfactorily">
              ❌ School Did Not Perform Satisfactorily
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date of Visit */}
      <div className="space-y-2">
        <Label htmlFor="dateOfVisit">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date of Visit
          </div>
        </Label>
        <Input
          id="dateOfVisit"
          type="date"
          value={dateOfVisit}
          onChange={(e) => setDateOfVisit(e.target.value)}
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
          isLoading ||
          !fullName ||
          !phoneNumber ||
          !schoolName ||
          !localGovernment ||
          !topicBeingTaught ||
          !officerCode
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Regional Officer / Enumerator Report"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        The link you share above opens a completely public form (no login
        required).
      </p>
    </form>
  );
}

export default EnumeratorUploadForm;
