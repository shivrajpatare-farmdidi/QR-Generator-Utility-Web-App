import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type {
  ColumnMapping,
  GenerationProgress,
  QRCodeItem,
  RawCSVRow,
  SkippedItem,
} from './types';
import { parseCSVString } from './utils/csvParser';
import { validateRows } from './utils/validation';
import { generateBatchQRCodes } from './utils/qrGenerator';
import { downloadBatchZip } from './utils/zipGenerator';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { ColumnMapper } from './components/ColumnMapper';
import { ProgressBar } from './components/ProgressBar';
import { ResultSummary } from './components/ResultSummary';
import { QRGrid } from './components/QRGrid';
import { QRModal } from './components/QRModal';
import { PrivacyFooter } from './components/PrivacyFooter';

export const App: React.FC = () => {
  // State
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<RawCSVRow[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    current: 0,
    total: 0,
    percent: 0,
    isGenerating: false,
    isZipping: false,
  });

  // Results state
  const [generatedQRCodes, setGeneratedQRCodes] = useState<QRCodeItem[]>([]);
  const [skippedItems, setSkippedItems] = useState<SkippedItem[]>([]);
  const [totalRowsProcessed, setTotalRowsProcessed] = useState<number>(0);
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);

  // Modal preview state
  const [previewItem, setPreviewItem] = useState<QRCodeItem | null>(null);

  // Handle uploaded CSV file
  const handleFileSelect = async (file: File) => {
    setParseError(null);
    setSelectedFileName(file.name);

    try {
      const text = await file.text();
      const result = await parseCSVString(text);

      if (result.error) {
        setParseError(`CSV Parsing error: ${result.error}`);
        return;
      }

      if (result.rows.length === 0) {
        setParseError('The uploaded CSV file is empty.');
        return;
      }

      setHeaders(result.headers);
      setRawRows(result.rows);
      setColumnMapping(result.detectedMapping);
      setIsGenerationComplete(false);
      setGeneratedQRCodes([]);
      setSkippedItems([]);
    } catch (err: any) {
      setParseError(`Failed to read file: ${err?.message || 'Unknown error'}`);
    }
  };

  // Trigger batch generation
  const handleGenerate = async () => {
    if (!columnMapping || rawRows.length === 0) return;

    setParseError(null);
    setIsProcessing(true);

    // Validate rows
    const { validRows, skippedItems: skipped } = validateRows(
      rawRows,
      columnMapping
    );

    setSkippedItems(skipped);
    setTotalRowsProcessed(rawRows.length);

    if (validRows.length === 0) {
      setIsProcessing(false);
      setIsGenerationComplete(true);
      setGeneratedQRCodes([]);
      return;
    }

    setProgress({
      current: 0,
      total: validRows.length,
      percent: 0,
      isGenerating: true,
      isZipping: false,
    });

    try {
      const generated = await generateBatchQRCodes(
        validRows,
        (current, total, percent) => {
          setProgress((prev) => ({
            ...prev,
            current,
            total,
            percent,
          }));
        }
      );

      setGeneratedQRCodes(generated);
      setIsGenerationComplete(true);
    } catch (err: any) {
      setParseError(`Error generating QR codes: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProgress((prev) => ({
        ...prev,
        isGenerating: false,
      }));
    }
  };

  // Trigger batch ZIP download
  const handleDownloadZip = async () => {
    if (generatedQRCodes.length === 0) return;

    setProgress((prev) => ({
      ...prev,
      isZipping: true,
    }));

    try {
      await downloadBatchZip(generatedQRCodes);
    } catch (err: any) {
      alert(`Error creating ZIP file: ${err?.message || 'Unknown error'}`);
    } finally {
      setProgress((prev) => ({
        ...prev,
        isZipping: false,
      }));
    }
  };

  // Reset entire application
  const handleReset = () => {
    setSelectedFileName('');
    setHeaders([]);
    setRawRows([]);
    setColumnMapping(null);
    setParseError(null);
    setIsProcessing(false);
    setIsGenerationComplete(false);
    setGeneratedQRCodes([]);
    setSkippedItems([]);
    setTotalRowsProcessed(0);
    setProgress({
      current: 0,
      total: 0,
      percent: 0,
      isGenerating: false,
      isZipping: false,
    });
  };

  const hasActiveBatch = Boolean(selectedFileName || isGenerationComplete);

  return (
    <>
      <Navbar hasActiveBatch={hasActiveBatch} onReset={handleReset} />

      <main className="app-container">
        {!isGenerationComplete && (
          <section className="hero-section">
            <h1 className="hero-title">Generate QR codes from your CSV</h1>
            <p className="hero-subtitle">
              Upload a spreadsheet with labels and links. We'll generate crisp, print-ready QR codes and pack them into a ZIP archive instantly.
            </p>
          </section>
        )}

        {parseError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{parseError}</span>
          </div>
        )}

        {/* Phase 1: Upload Zone */}
        {!selectedFileName && !isGenerationComplete && (
          <UploadZone
            onFileSelect={handleFileSelect}
            disabled={isProcessing}
          />
        )}

        {/* Phase 2: Loaded CSV Ready & Column Mapping */}
        {selectedFileName && !isGenerationComplete && (
          <ColumnMapper
            fileName={selectedFileName}
            totalRows={rawRows.length}
            headers={headers}
            currentMapping={columnMapping}
            onMappingChange={setColumnMapping}
            onGenerate={handleGenerate}
            onCancel={handleReset}
            isProcessing={isProcessing}
          />
        )}

        {/* Progress Bar (during generation or zipping) */}
        {(progress.isGenerating || progress.isZipping) && (
          <ProgressBar progress={progress} />
        )}

        {/* Phase 3: Results Preview & ZIP Download */}
        {isGenerationComplete && (
          <>
            <ResultSummary
              generatedCount={generatedQRCodes.length}
              skippedCount={skippedItems.length}
              totalCount={totalRowsProcessed}
              skippedItems={skippedItems}
              onDownloadZip={handleDownloadZip}
              onReset={handleReset}
              isZipping={progress.isZipping}
            />

            {generatedQRCodes.length > 0 && (
              <QRGrid
                items={generatedQRCodes}
                onPreview={(item) => setPreviewItem(item)}
              />
            )}
          </>
        )}
      </main>

      {/* High-resolution preview lightbox modal */}
      <QRModal item={previewItem} onClose={() => setPreviewItem(null)} />

      <PrivacyFooter />
    </>
  );
};

export default App;
