import React, { useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileSelect,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv') {
        onFileSelect(file);
      } else {
        alert('Please upload a valid .csv file.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-card ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload CSV file by drag and drop or clicking"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden-file-input"
          onChange={handleFileInputChange}
          disabled={disabled}
          tabIndex={-1}
        />

        <div className="upload-card-content">
          <div className="upload-icon-wrapper">
            <UploadCloud size={32} />
          </div>

          <div>
            <div className="upload-main-text">
              Upload CSV or Drag & Drop here
            </div>
            <div className="upload-sub-text">
              File must contain <strong>Label</strong> and <strong>Link</strong> columns (.csv format)
            </div>
          </div>

          <div className="upload-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
            >
              <FileSpreadsheet size={16} />
              <span>Choose CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
