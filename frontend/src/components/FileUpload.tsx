import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
  allowedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
  sublabel?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.webp'],
  maxSizeMB = 20,
  label = 'Upload Digital Heritage Manuscript / Document',
  sublabel = 'Supported: High-resolution PDF, JPG, PNG, WEBP (Max 20 MB)',
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setValidationError(null);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setValidationError(`File exceeds maximum permitted size of ${maxSizeMB} MB (${formatFileSize(file.size)}).`);
      return;
    }

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = allowedTypes.some((t) => t.toLowerCase() === fileExt);

    if (!isValidType) {
      setValidationError(`Invalid file type. Allowed formats: ${allowedTypes.join(', ')}`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setValidationError(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-stone-900 mb-1.5">{label}</label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#D4AF37] bg-[#FAF6EB]'
            : selectedFile
            ? 'border-emerald-500/50 bg-emerald-50/40'
            : 'border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50'
        } ${validationError || error ? 'border-red-400 bg-red-50/30' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
          id="manuscript-file-input"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl border border-stone-200/80 shadow-xs">
            <div className="flex items-center gap-3 overflow-hidden text-left">
              <div className="w-10 h-10 rounded-lg bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-stone-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-stone-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ready
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0C3823]/10 text-[#0C3823] flex items-center justify-center mb-3 border border-[#0C3823]/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-stone-800 mb-1">
              Drag and drop your manuscript scan or document, or{' '}
              <span className="text-[#0C3823] underline decoration-[#D4AF37] underline-offset-2">browse files</span>
            </p>
            <p className="text-xs text-stone-500">{sublabel}</p>
          </div>
        )}
      </div>

      {(validationError || error) && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
};
