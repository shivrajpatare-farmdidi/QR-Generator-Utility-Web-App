export interface RawCSVRow {
  [key: string]: string | undefined;
}

export interface ColumnMapping {
  labelCol: string;
  linkCol: string;
}

export interface ParsedRow {
  rowIndex: number;
  label: string;
  url: string;
}

export interface ValidatedRow {
  rowIndex: number;
  label: string;
  url: string;
  isValid: boolean;
  reason?: string;
}

export interface QRCodeItem {
  id: string;
  rowIndex: number;
  label: string;
  url: string;
  filename: string;
  dataUrl: string;
}

export interface SkippedItem {
  rowIndex: number;
  label: string;
  url: string;
  reason: string;
}

export interface GenerationProgress {
  current: number;
  total: number;
  percent: number;
  isGenerating: boolean;
  isZipping: boolean;
}

export interface BatchResult {
  generated: QRCodeItem[];
  skipped: SkippedItem[];
  totalRows: number;
}
