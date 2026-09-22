import React, { useState } from 'react';
import { FileText, SlidersHorizontal, Play, CheckCircle2 } from 'lucide-react';
import type { ColumnMapping } from '../types';

interface ColumnMapperProps {
  fileName: string;
  totalRows: number;
  headers: string[];
  currentMapping: ColumnMapping | null;
  onMappingChange: (mapping: ColumnMapping) => void;
  onGenerate: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  fileName,
  totalRows,
  headers,
  currentMapping,
  onMappingChange,
  onGenerate,
  onCancel,
  isProcessing,
}) => {
  const [isCustomizing, setIsCustomizing] = useState(false);

  const selectedLabel = currentMapping?.labelCol || '';
  const selectedLink = currentMapping?.linkCol || '';

  const isComplete = Boolean(
    selectedLabel && selectedLink && selectedLabel !== selectedLink
  );

  const handleLabelChange = (newLabel: string) => {
    onMappingChange({
      labelCol: newLabel,
      linkCol: selectedLink,
    });
  };

  const handleLinkChange = (newLink: string) => {
    onMappingChange({
      labelCol: selectedLabel,
      linkCol: newLink,
    });
  };

  return (
    <div className="ready-banner">
      <div className="file-header-row">
        <div className="file-info-group">
          <div className="file-icon-badge">
            <FileText size={20} />
          </div>
          <div>
            <div className="file-name">{fileName}</div>
            <div className="file-stats">
              {totalRows} {totalRows === 1 ? 'row' : 'rows'} detected
            </div>
          </div>
        </div>

        <div className="results-actions-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Change file
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={!isComplete || isProcessing}
          >
            <Play size={16} fill="currentColor" />
            <span>Generate QR codes</span>
          </button>
        </div>
      </div>

      <div className="mapping-row">
        <div className="mapping-tags">
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Column Mapping:
          </span>
          {currentMapping ? (
            <>
              <span className="mapping-pill">
                <CheckCircle2 size={13} color="var(--color-success)" />
                Label: <strong>"{currentMapping.labelCol}"</strong>
              </span>
              <span className="mapping-pill">
                <CheckCircle2 size={13} color="var(--color-success)" />
                Link: <strong>"{currentMapping.linkCol}"</strong>
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--color-error-text)', fontSize: '0.8125rem' }}>
              Could not automatically detect columns. Please select them below.
            </span>
          )}
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setIsCustomizing((prev) => !prev)}
        >
          <SlidersHorizontal size={14} />
          <span>{isCustomizing ? 'Hide column options' : 'Change columns'}</span>
        </button>
      </div>

      {(!currentMapping || isCustomizing) && (
        <div className="column-selectors">
          <div className="field-group">
            <label className="field-label" htmlFor="label-col-select">
              Label Column (used for filename & title)
            </label>
            <select
              id="label-col-select"
              className="select-input"
              value={selectedLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              disabled={isProcessing}
            >
              <option value="">-- Select Label column --</option>
              {headers.map((header) => (
                <option key={`label-${header}`} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="link-col-select">
              Link Column (URL to encode in QR)
            </label>
            <select
              id="link-col-select"
              className="select-input"
              value={selectedLink}
              onChange={(e) => handleLinkChange(e.target.value)}
              disabled={isProcessing}
            >
              <option value="">-- Select Link column --</option>
              {headers.map((header) => (
                <option key={`link-${header}`} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
