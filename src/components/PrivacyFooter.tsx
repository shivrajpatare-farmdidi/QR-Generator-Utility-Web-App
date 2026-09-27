import React from 'react';

export const PrivacyFooter: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-privacy-text">
          QR Batch • 100% Client-Side Privacy: Your CSV and QR codes are processed entirely inside your browser. Nothing is uploaded to any server.
        </p>
      </div>
    </footer>
  );
};

