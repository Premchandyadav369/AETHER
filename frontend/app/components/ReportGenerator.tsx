'use client';

import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState<'publication' | 'synthesis' | 'patent'>('publication');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Research Report & Laboratory Document Generator</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Publication-ready HTML/PDF reports, synthesis readiness checklists, and commercial vendor sourcing
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <a
            href="/v10/publication_report (1).html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-slate-950 hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Full Interactive HTML Report</span>
          </a>
        </div>
      </div>

      {/* Report Viewer Iframe */}
      <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white">Live Publication Report Preview (publication_report.html)</h3>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            12.8 MB Full Document Indexed
          </span>
        </div>

        <div className="w-full h-[650px] rounded-xl overflow-hidden bg-white border border-slate-700">
          <iframe
            src="/v10/publication_report (1).html"
            className="w-full h-full border-0"
            title="Publication Report"
          />
        </div>
      </div>
    </div>
  );
}
