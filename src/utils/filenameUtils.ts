/**
 * Sanitizes a label string into a clean, filesystem-safe filename base.
 *
 * Rules:
 * - Replaces unsafe characters (< > : " / \ | ? * and control chars) with underscores.
 * - Replaces whitespace sequences with single underscores.
 * - Trims leading/trailing underscores, periods, and whitespace.
 * - Keeps alphanumeric characters, dashes, and underscores.
 */
export function sanitizeLabel(label: string): string {
  if (!label) return '';

  return label
    // Replace characters outside alphanumeric, dashes, dots, and underscores
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    // Collapse multiple underscores into one
    .replace(/_+/g, '_')
    // Remove leading and trailing dots/underscores
    .replace(/^[_.]+|[_.]+$/g, '');
}

export interface ItemWithLabel {
  label: string;
}

/**
 * Assigns safe, unique filenames with .png extension to a batch of items.
 *
 * Requirements:
 * - Pune Office -> Pune_Office.png
 * - Store #12 -> Store_12.png
 * - Duplicate labels: ABC.png, ABC_2.png, ABC_3.png
 * - Empty labels: QR_001.png, QR_002.png, etc.
 * - Guaranteed collision-free even with pathological inputs (e.g. one row labeled 'ABC' and another labeled 'ABC_2').
 */
export function assignUniqueFilenames<T extends ItemWithLabel>(
  items: T[]
): (T & { filename: string })[] {
  const usedFilenames = new Set<string>();
  const baseCounts = new Map<string, number>();
  let emptyLabelCounter = 1;

  return items.map((item) => {
    let base = sanitizeLabel(item.label);

    // If label was empty or sanitized down to nothing
    if (!base) {
      const paddedIndex = String(emptyLabelCounter++).padStart(3, '0');
      base = `QR_${paddedIndex}`;
    }

    let finalFilename = '';
    const currentCount = baseCounts.get(base) || 0;

    if (currentCount === 0 && !usedFilenames.has(`${base}.png`)) {
      finalFilename = `${base}.png`;
      baseCounts.set(base, 1);
    } else {
      let suffix = currentCount === 0 ? 2 : currentCount + 1;
      let candidate = `${base}_${suffix}.png`;

      while (usedFilenames.has(candidate)) {
        suffix++;
        candidate = `${base}_${suffix}.png`;
      }

      finalFilename = candidate;
      baseCounts.set(base, suffix);
    }

    usedFilenames.add(finalFilename);

    return {
      ...item,
      filename: finalFilename,
    };
  });
}
