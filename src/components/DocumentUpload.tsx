import { useState, useRef } from "react";
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
  FileText,
  AlertCircle,
  CheckCircle,
  Building,
  Calendar,
  Loader2,
  Upload,
  X,
  Plus,
  ArrowRight,
  Info,
} from "lucide-react";
import type { Organization } from "../types";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentUploadProps {
  onUpload: (
    file: File,
    name: string,
    type: string,
    organizationId: string,
    startDate?: string,
    expiryDate?: string,
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
  loading = false,
  error,
  success,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState(
    currentUserOrg || "",
  );
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loading || isSubmitting;

  const handleFileChange = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    setIsSubmitting(true);

    try {
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
        expiryDate || undefined,
      );

      // Reset form
      setFile(null);
      setName("");
      setDocumentType("");
      setSelectedOrganization(currentUserOrg || "");
      setStartDate("");
      setExpiryDate("");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Ingest New Agreement
        </h2>
        <p className="text-zinc-500 text-sm font-light">
          Securely upload and categorize legal documents into your
          organization's repository.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* Left Column: File Dropzone */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
              File Attachment
            </Label>
            <motion.div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              animate={{
                borderColor: isDragging
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.05)",
                backgroundColor: isDragging
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.02)",
              }}
              className={`relative h-[320px] border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) =>
                  e.target.files?.[0] && handleFileChange(e.target.files[0])
                }
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center text-center px-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                      <Upload className="w-8 h-8 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-white font-bold text-lg mb-2 tracking-tight">
                      Drop agreement here
                    </p>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Supports PDF, Word, or Images
                      <br />
                      up to 50MB
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center w-full px-8"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-2xl relative">
                      <FileText className="w-10 h-10 text-white" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-white font-bold text-sm truncate max-w-full mb-1">
                      {file.name}
                    </p>
                    <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated Background Pulse */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/5 pointer-events-none"
                />
              )}
            </motion.div>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-xs font-bold mb-1">
                  Secure Ingestion
                </p>
                <p className="text-zinc-500 text-[10px] leading-relaxed">
                  All documents are encrypted at rest and in transit. Metadata
                  is indexed for secure organization-wide search.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
                Document Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q1 Master Service Agreement"
                className="h-14 bg-white/5 border-white/5 focus:border-white/20 rounded-2xl text-white placeholder:text-zinc-700"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
                Classification
              </Label>
              <Select
                value={documentType}
                onValueChange={setDocumentType}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="h-14 bg-white/5 border-white/5 rounded-2xl text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10">
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="SLA">SLA (Service Level)</SelectItem>
                  <SelectItem value="NDA">NDA (Non-Disclosure)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
                Organization Folder
              </Label>
              <Select
                value={selectedOrganization}
                onValueChange={setSelectedOrganization}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="h-14 bg-white/5 border-white/5 rounded-2xl text-white">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-zinc-500" />
                    <SelectValue placeholder="Choose folder" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10">
                  {organizations.map((org) => (
                    <SelectItem key={org._id} value={org._id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
                Effective Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 focus:border-white/20 rounded-2xl text-white pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono ml-1">
                Termination Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <Input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  min={startDate}
                  className="h-14 bg-white/5 border-white/5 focus:border-white/20 rounded-2xl text-white pl-12"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  variant="destructive"
                  className="bg-rose-500/10 border-rose-500/20 text-rose-500 rounded-2xl"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 rounded-2xl">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {success}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none"
              disabled={
                isLoading ||
                !file ||
                !name ||
                !documentType ||
                !selectedOrganization
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>Commit to Repository</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DocumentUpload;
