import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import type { QRCodeItem } from '../types';
import { QRCard } from './QRCard';

interface QRGridProps {
  items: QRCodeItem[];
  onPreview: (item: QRCodeItem) => void;
}

const PAGE_SIZE = 48;

export const QRGrid: React.FC<QRGridProps> = ({ items, onPreview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, displayCount);
  }, [filteredItems, displayCount]);

  const hasMore = visibleItems.length < filteredItems.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="qr-grid-section">
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by label, URL, or filename..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayCount(PAGE_SIZE);
            }}
            aria-label="Filter QR codes"
          />
        </div>

        <div className="filter-count">
          Showing {visibleItems.length} of {filteredItems.length}{' '}
          {filteredItems.length === 1 ? 'code' : 'codes'}
          {searchQuery && ` (filtered from ${items.length})`}
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          No QR codes match "{searchQuery}".
        </div>
      ) : (
        <div className="qr-grid">
          {visibleItems.map((item) => (
            <QRCard key={item.id} item={item} onPreview={onPreview} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="load-more-wrapper">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLoadMore}
          >
            <ChevronDown size={16} />
            <span>
              Load more ({filteredItems.length - visibleItems.length} remaining)
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
