import React from 'react';
import { QrCode, ShieldCheck, RotateCcw } from 'lucide-react';

interface NavbarProps {
  hasActiveBatch: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ hasActiveBatch, onReset }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="brand-group">
          <div className="brand-icon">
            <QrCode size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-title">
            QR Batch
          </span>
          <span className="privacy-badge">
            <ShieldCheck size={13} />
            Client-Side
          </span>
        </div>

        {hasActiveBatch && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onReset}
            title="Start over with a new CSV"
          >
            <RotateCcw size={14} />
            <span>New Batch</span>
          </button>
        )}
      </div>
    </header>
  );
};
