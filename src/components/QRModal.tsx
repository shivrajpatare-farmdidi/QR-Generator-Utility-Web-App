import React, { useEffect } from 'react';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import type { QRCodeItem } from '../types';
import { downloadSinglePNG } from '../utils/zipGenerator';

interface QRModalProps {
  item: QRCodeItem | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ item, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, paddingRight: '2rem' }}>
          {item.label || 'Untitled QR'}
        </h3>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
          {item.filename}
        </span>

        <img
          src={item.dataUrl}
          alt={`QR Code for ${item.label}`}
          className="modal-qr-image"
        />

        <div className="modal-url-box" title={item.url}>
          {item.url}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={handleCopy}
          >
            {copied ? <Check size={15} color="var(--color-success)" /> : <Copy size={15} />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            <ExternalLink size={15} />
            <span>Open Link</span>
          </a>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ flex: 1.2 }}
            onClick={() => downloadSinglePNG(item.dataUrl, item.filename)}
          >
            <Download size={15} />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
