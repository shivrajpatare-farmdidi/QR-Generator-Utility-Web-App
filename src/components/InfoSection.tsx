import React from 'react';
import { FileText, Cpu, Download, ShieldCheck, HelpCircle } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <section className="info-section" aria-label="About QR Batch">
      <div className="info-block">
        <h2 className="info-heading">How QR Batch Works</h2>
        <ol className="info-steps">
          <li>
            <FileText size={18} aria-hidden="true" />
            <div>
              <strong>Upload your CSV</strong>
              <span>Provide a spreadsheet with <em>Label</em> and <em>Link</em> columns.</span>
            </div>
          </li>
          <li>
            <Cpu size={18} aria-hidden="true" />
            <div>
              <strong>Generate QR codes</strong>
              <span>A 1024×1024 px static QR code is created for each valid URL, entirely in your browser.</span>
            </div>
          </li>
          <li>
            <Download size={18} aria-hidden="true" />
            <div>
              <strong>Download ZIP</strong>
              <span>All QR images are named after their labels and packed into a single ZIP archive.</span>
            </div>
          </li>
        </ol>
      </div>

      <div className="info-block">
        <h2 className="info-heading">
          <HelpCircle size={18} aria-hidden="true" />
          Frequently Asked Questions
        </h2>
        <dl className="faq-list">
          <div className="faq-item">
            <dt>Does QR Batch upload my CSV to a server?</dt>
            <dd>No. All processing happens locally inside your web browser. Your CSV file and generated QR codes never leave your device.</dd>
          </div>
          <div className="faq-item">
            <dt>Are the QR codes static or dynamic?</dt>
            <dd>Static. Each QR code directly contains the destination URL you provide. There is no intermediate redirect, tracking page, or third-party QR service involved.</dd>
          </div>
          <div className="faq-item">
            <dt>How are duplicate labels handled?</dt>
            <dd>If multiple rows share the same label, QR Batch automatically appends a number to each duplicate filename (e.g., <code>Store.png</code>, <code>Store_2.png</code>) so no files are overwritten.</dd>
          </div>
          <div className="faq-item">
            <dt>What URL formats are accepted?</dt>
            <dd>Links must start with <code>http://</code> or <code>https://</code>. Rows with missing or invalid URLs are skipped and reported separately.</dd>
          </div>
          <div className="faq-item">
            <dt>What resolution are the QR code images?</dt>
            <dd>Each QR code is generated as a 1024×1024 pixel PNG image with Level H (30%) error correction — suitable for both screen and print use.</dd>
          </div>
        </dl>
      </div>

      <div className="info-privacy-note">
        <ShieldCheck size={16} aria-hidden="true" />
        <p>QR Batch is a free, open-source browser utility. No account, installation, or server required.</p>
      </div>
    </section>
  );
};
