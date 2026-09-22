import type { ColumnMapping, RawCSVRow, SkippedItem, ValidatedRow } from '../types';

/**
 * Validates a single CSV row based on URL validity rules:
 * - Must exist
 * - Must not be empty
 * - Must start with http:// or https://
 *
 * Notice: The original URL is NOT modified or normalized; we validate the exact string.
 */
export function validateRow(
  rawRow: RawCSVRow,
  mapping: ColumnMapping,
  rowIndex: number
): ValidatedRow {
  const rawLabel = rawRow[mapping.labelCol] ?? '';
  const rawLink = rawRow[mapping.linkCol] ?? '';

  const trimmedLabel = rawLabel.trim();
  const trimmedLink = rawLink.trim();

  if (!trimmedLink) {
    return {
      rowIndex,
      label: trimmedLabel,
      url: rawLink,
      isValid: false,
      reason: 'Missing or empty link',
    };
  }

  // Must start with http:// or https:// (case-insensitive check)
  const startsWithHttp = /^https?:\/\//i.test(trimmedLink);
  if (!startsWithHttp) {
    return {
      rowIndex,
      label: trimmedLabel,
      url: rawLink,
      isValid: false,
      reason: 'Link must start with http:// or https://',
    };
  }

  return {
    rowIndex,
    label: trimmedLabel,
    url: trimmedLink, // preserve full exact URL
    isValid: true,
  };
}

/**
 * Validates an array of rows and partitions them into valid rows and skipped items.
 */
export function validateRows(
  rows: RawCSVRow[],
  mapping: ColumnMapping
): {
  validRows: ValidatedRow[];
  skippedItems: SkippedItem[];
} {
  const validRows: ValidatedRow[] = [];
  const skippedItems: SkippedItem[] = [];

  rows.forEach((row, index) => {
    // 1-indexed row number matching spreadsheet view (+1 for header, +1 for 1-based index)
    const displayRowIndex = index + 2;
    const validated = validateRow(row, mapping, displayRowIndex);

    if (validated.isValid) {
      validRows.push(validated);
    } else {
      skippedItems.push({
        rowIndex: displayRowIndex,
        label: validated.label || '(No Label)',
        url: validated.url || '(Empty)',
        reason: validated.reason || 'Invalid row',
      });
    }
  });

  return { validRows, skippedItems };
}
