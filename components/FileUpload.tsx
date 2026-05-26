"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { isValidDesignFile, formatFileSize } from "@/lib/utils";
import { Button } from "./ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  maxSize?: number;
  accept?: string[];
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = ["pdf", "ai", "eps", "psd", "jpg", "jpeg", "png"],
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        setError("No files selected");
        return;
      }

      const file = acceptedFiles[0];
      const validation = isValidDesignFile(file.name, file.size);

      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, ext) => {
      const mimeTypes: Record<string, string> = {
        pdf: "application/pdf",
        ai: "application/postscript",
        eps: "application/postscript",
        psd: "image/vnd.adobe.photoshop",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
      };
      if (mimeTypes[ext]) {
        acc[mimeTypes[ext]] = [];
      }
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    maxFiles: 1,
  });

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    onFileRemove?.();
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive
              ? "border-blue-500 bg-blue-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            {error ? (
              <AlertCircle className="h-12 w-12 text-red-500" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}

            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive
                  ? "Drop your file here"
                  : "Drag & drop your design file"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse files
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-md">
                {error}
              </div>
            )}

            <div className="text-xs text-gray-500">
              <p>Accepted formats: {accept.join(", ").toUpperCase()}</p>
              <p>Maximum file size: {formatFileSize(maxSize)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />

            <div className="flex-grow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-sm text-blue-900 font-medium">File ready for upload</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your design will be uploaded when you complete your order
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design guidelines */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-gray-900 mb-2">Design Guidelines:</h4>
        <ul className="space-y-1 text-gray-600">
          <li>• Ensure your file is high resolution (300 DPI minimum)</li>
          <li>• Include bleed area if required (0.125" on all sides)</li>
          <li>• Convert all text to outlines/curves</li>
          <li>• Use CMYK color mode for best print results</li>
          <li>• We'll review your file and contact you if changes are needed</li>
        </ul>
      </div>
    </div>
  );
}
