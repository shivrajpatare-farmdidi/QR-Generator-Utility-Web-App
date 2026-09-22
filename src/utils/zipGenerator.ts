import JSZip from 'jszip';
import type { QRCodeItem } from '../types';

/**
 * Downloads a single PNG file given a data URL and desired filename.
 */
export function downloadSinglePNG(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates and triggers download of QR_CODES.zip containing all generated PNGs inside a QR_CODES folder.
 * Uses JSZip with pure client-side blob generation.
 */
export async function downloadBatchZip(
  items: QRCodeItem[],
  onZipProgress?: (percent: number) => void
): Promise<void> {
  if (items.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('QR_CODES') || zip;

  for (const item of items) {
    // Extract raw base64 string from data URL
    const base64Data = item.dataUrl.replace(/^data:image\/png;base64,/, '');
    folder.file(item.filename, base64Data, { base64: true });
  }

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    },
    (metadata) => {
      if (onZipProgress) {
        onZipProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger download in the user's browser
  const blobUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'QR_CODES.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 10000);
}
