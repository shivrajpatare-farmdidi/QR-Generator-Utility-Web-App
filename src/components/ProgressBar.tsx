import React from 'react';
import { Loader2 } from 'lucide-react';
import type { GenerationProgress } from '../types';

interface ProgressBarProps {
  progress: GenerationProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const { current, total, percent, isZipping } = progress;

  return (
    <div className="progress-card" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-header">
        <div className="progress-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Loader2 size={18} className="spin-animation" />
          <span>{isZipping ? 'Packaging QR_CODES.zip...' : 'Generating QR codes...'}</span>
        </div>
        <div className="progress-counter">
          {percent}% &nbsp;({current} / {total})
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
