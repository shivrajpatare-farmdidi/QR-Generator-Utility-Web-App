import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyFooter: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-privacy-note">
          <Lock size={14} color="var(--color-success-text)" />
          <span>
            <strong>100% Client-Side Privacy:</strong> Your CSV and QR codes are processed entirely inside your browser. Nothing is uploaded to any server.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span>QR Batch</span>
          <span>•</span>
          <span>Fast, reliable batch QR generation</span>
        </div>
      </div>
    </footer>
  );
};
