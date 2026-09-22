# QR Batch

QR Batch is a simple browser utility that generates high-resolution QR codes from a CSV file and downloads them as a single ZIP archive.

## How to Prepare Your CSV

Create a spreadsheet or CSV file with two columns: **Label** and **Link**.

```csv
Label,Link
Pune Office,https://example.com/pune
Mumbai Office,https://example.com/mumbai
Store #12,https://example.com/stores/12
```

- **Label**: The name for the QR code image (e.g., `Pune Office` becomes `Pune_Office.png`).
- **Link**: The full website URL (must start with `http://` or `https://`).

> **Tip**: Common column name variations like `Name`, `Title`, `URL`, or `Website` are also detected automatically.

## How to Use

1. Open the application in your browser.
2. Drag and drop your `.csv` file (or click **Choose CSV**).
3. Confirm the detected columns (or adjust them if needed).
4. Click **Generate QR Codes**.
5. Preview the generated QR codes or inspect any skipped invalid rows.
6. Click **Download ZIP** to save all QR images at once.

## What the Downloaded ZIP Contains

You will receive `QR_CODES.zip` containing:

```text
QR_CODES/
├── Pune_Office.png
├── Mumbai_Office.png
└── Store_12.png
```

- Each QR code is saved as a crisp 1024×1024 pixel PNG image.
- If duplicate labels exist, numbers are added automatically (e.g., `ABC.png`, `ABC_2.png`) so no files are overwritten.

## Privacy

All processing happens directly on your computer inside your web browser. Your CSV and generated QR codes are never uploaded to any server or shared with anyone.

## Development

```bash
npm install
npm run dev
npm run build
```
