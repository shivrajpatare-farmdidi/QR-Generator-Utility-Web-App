import Papa from 'papaparse';
import type { ColumnMapping, RawCSVRow } from '../types';

const LABEL_CANDIDATES = [
  'label',
  'name',
  'title',
  'qr_label',
  'qrlabel',
  'item',
  'id',
];

const LINK_CANDIDATES = [
  'link',
  'url',
  'href',
  'website',
  'web',
  'target',
  'destination',
  'qr_link',
  'qrlink',
];

/**
 * Automatically detects the label and link columns from the given CSV headers.
 */
export function detectColumns(headers: string[]): ColumnMapping | null {
  if (!headers || headers.length === 0) return null;

  const normalizedHeaders = headers.map((h) => ({
    original: h,
    cleaned: h.trim().toLowerCase().replace(/[\s_-]+/g, ''),
  }));

  // Find label column
  let labelMatch = normalizedHeaders.find((h) =>
    LABEL_CANDIDATES.includes(h.cleaned)
  );

  // Find link column
  let linkMatch = normalizedHeaders.find((h) =>
    LINK_CANDIDATES.includes(h.cleaned)
  );

  // If exact candidate match not found, check for partial inclusions
  if (!labelMatch) {
    labelMatch = normalizedHeaders.find((h) =>
      LABEL_CANDIDATES.some((cand) => h.cleaned.includes(cand))
    );
  }

  if (!linkMatch) {
    linkMatch = normalizedHeaders.find((h) =>
      LINK_CANDIDATES.some((cand) => h.cleaned.includes(cand))
    );
  }

  // Fallback heuristic: If exactly 2 columns, column 0 is label, column 1 is link
  if ((!labelMatch || !linkMatch) && headers.length === 2) {
    return {
      labelCol: headers[0],
      linkCol: headers[1],
    };
  }

  if (labelMatch && linkMatch && labelMatch.original !== linkMatch.original) {
    return {
      labelCol: labelMatch.original,
      linkCol: linkMatch.original,
    };
  }

  return null;
}

export interface ParseCSVResult {
  headers: string[];
  rows: RawCSVRow[];
  detectedMapping: ColumnMapping | null;
  error?: string;
}

/**
 * Parses raw CSV content using PapaParse.
 */
export function parseCSVString(csvText: string): Promise<ParseCSVResult> {
  return new Promise((resolve) => {
    Papa.parse<RawCSVRow>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const detectedMapping = detectColumns(headers);
        resolve({
          headers,
          rows: results.data,
          detectedMapping,
        });
      },
      error: (err: Error) => {
        resolve({
          headers: [],
          rows: [],
          detectedMapping: null,
          error: err.message,
        });
      },
    });
  });
}
