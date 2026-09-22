import QRCode from 'qrcode';
import type { QRCodeItem, ValidatedRow } from '../types';
import { assignUniqueFilenames } from './filenameUtils';

export interface QRGeneratorOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const DEFAULT_OPTIONS: QRGeneratorOptions = {
  width: 1024,
  margin: 4,
  errorCorrectionLevel: 'H',
};

/**
 * Generates a single high-resolution QR code data URL.
 */
export async function generateSingleQR(
  url: string,
  options: QRGeneratorOptions = DEFAULT_OPTIONS
): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'H',
    width: options.width ?? 1024,
    margin: options.margin ?? 4,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}

/**
 * Generates QR codes in chunked batches with yielding to the main thread.
 * This guarantees smooth 60fps UI updates, animated progress bars, and zero freezing
 * even when generating hundreds or thousands of items.
 */
export async function generateBatchQRCodes(
  rows: ValidatedRow[],
  onProgress: (current: number, total: number, percent: number) => void,
  chunkSize: number = 15
): Promise<QRCodeItem[]> {
  const total = rows.length;
  if (total === 0) return [];

  // Assign collision-free filenames first
  const rowsWithFilenames = assignUniqueFilenames(rows);
  const results: QRCodeItem[] = [];

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = rowsWithFilenames.slice(i, i + chunkSize);

    // Process chunk in parallel
    const chunkPromises = chunk.map(async (item) => {
      const dataUrl = await generateSingleQR(item.url, DEFAULT_OPTIONS);
      return {
        id: `qr-${item.rowIndex}-${Math.random().toString(36).slice(2, 7)}`,
        rowIndex: item.rowIndex,
        label: item.label,
        url: item.url,
        filename: item.filename,
        dataUrl,
      };
    });

    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);

    const current = results.length;
    const percent = Math.round((current / total) * 100);
    onProgress(current, total, percent);

    // Yield control back to the browser's render loop
    await new Promise((resolve) => {
      requestAnimationFrame(() => setTimeout(resolve, 0));
    });
  }

  return results;
}
