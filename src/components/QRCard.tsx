import React from 'react';
import { Download, Maximize2 } from 'lucide-react';
import type { QRCodeItem } from '../types';
import { downloadSinglePNG } from '../utils/zipGenerator';

interface QRCardProps {
  item: QRCodeItem;
  onPreview: (item: QRCodeItem) => void;
}

export const QRCard: React.FC<QRCardProps> = ({ item, onPreview }) => {
  return (
    <div className="qr-card">
      <div
        className="qr-image-wrapper"
        onClick={() => onPreview(item)}
        title="Click to view high-resolution QR"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPreview(item);
          }
        }}
      >
        <img
          src={item.dataUrl}
          alt={`QR Code for ${item.label}`}
          className="qr-image"
          loading="lazy"
        />
        <div className="qr-hover-overlay">
          <Maximize2 size={22} />
          <span>Enlarge</span>
        </div>
      </div>

      <div className="qr-meta">
        <span className="qr-label" title={item.label || 'Untitled'}>
          {item.label || '(Untitled)'}
        </span>
        <span className="qr-url" title={item.url}>
          {item.url}
        </span>
        <span className="qr-filename" title={item.filename}>
          {item.filename}
        </span>
      </div>

      <div className="qr-card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => downloadSinglePNG(item.dataUrl, item.filename)}
          title={`Download ${item.filename}`}
        >
          <Download size={14} />
          <span>Download PNG</span>
        </button>
      </div>
    </div>
  );
};
