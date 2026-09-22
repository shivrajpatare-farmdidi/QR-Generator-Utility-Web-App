import React, { useState } from 'react';
import { Download, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react';
import type { SkippedItem } from '../types';

interface ResultSummaryProps {
  generatedCount: number;
  skippedCount: number;
  totalCount: number;
  skippedItems: SkippedItem[];
  onDownloadZip: () => void;
  onReset: () => void;
  isZipping: boolean;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  generatedCount,
  skippedCount,
  totalCount,
  skippedItems,
  onDownloadZip,
  onReset,
  isZipping,
}) => {
  const [showSkippedDrawer, setShowSkippedDrawer] = useState(skippedCount > 0);
  const [hasCopiedErrors, setHasCopiedErrors] = useState(false);

  const handleCopyErrors = () => {
    const text = skippedItems
      .map(
        (item) =>
          `Row ${item.rowIndex}: [${item.label}] "${item.url}" -> ${item.reason}`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setHasCopiedErrors(true);
    setTimeout(() => setHasCopiedErrors(false), 2500);
  };

  return (
    <div className="results-header-card">
      <div className="results-stats-row">
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            QR Generation Complete
          </h2>
          <div className="stats-badges">
            <span className="stat-pill success">
              <CheckCircle2 size={14} />
              {generatedCount} Generated
            </span>

            {skippedCount > 0 && (
              <button
                type="button"
                className="stat-pill warning"
                onClick={() => setShowSkippedDrawer((prev) => !prev)}
                title="Click to toggle skipped rows details"
              >
                <AlertTriangle size={14} />
                <span>{skippedCount} Skipped</span>
                {showSkippedDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}

            <span className="stat-pill total">
              {totalCount} Total Rows
            </span>
          </div>
        </div>

        <div className="results-actions-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isZipping}
          >
            <RotateCcw size={16} />
            <span>New Batch</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onDownloadZip}
            disabled={generatedCount === 0 || isZipping}
          >
            <Download size={18} />
            <span>{isZipping ? 'Generating ZIP...' : `Download ZIP (${generatedCount})`}</span>
          </button>
        </div>
      </div>

      {showSkippedDrawer && skippedItems.length > 0 && (
        <div className="skipped-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="skipped-drawer-title">
              <AlertTriangle size={16} />
              <span>Skipped Invalid Rows ({skippedItems.length})</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleCopyErrors}
              title="Copy skipped rows report to clipboard"
            >
              {hasCopiedErrors ? <Check size={14} /> : <Copy size={14} />}
              <span>{hasCopiedErrors ? 'Copied' : 'Copy Report'}</span>
            </button>
          </div>

          <div className="skipped-list">
            {skippedItems.map((item, idx) => (
              <div key={`skipped-${item.rowIndex}-${idx}`} className="skipped-item">
                <div className="skipped-row-num">Row {item.rowIndex}</div>
                <div className="skipped-label" title={item.label}>
                  {item.label}
                </div>
                <div className="skipped-url" title={item.url}>
                  {item.url}
                </div>
                <div className="skipped-reason">
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
