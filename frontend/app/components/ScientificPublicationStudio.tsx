'use client';

import React, { useState } from 'react';
import {
  FileText, Download, Maximize2, Minimize2, ExternalLink, Activity,
  BarChart3, CheckCircle2, Sparkles, TrendingUp, Layers
} from 'lucide-react';

export default function ScientificPublicationStudio() {
  const [viewMode, setViewMode] = useState<'publication_html' | 'benchmarks_gallery'>('publication_html');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const galleryImages = [
    { src: '/v10/v10_dashboard.png', title: 'Platform Master Architecture', tag: 'Architecture' },
    { src: '/v10/roc_curves.png', title: 'ROC-AUC Multi-Target Benchmark Curves', tag: 'Validation' },
    { src: '/v10/tsne_chemical_space.png', title: 't-SNE Chemical Space & Scaffold Clustering', tag: 'Cheminformatics' },
    { src: '/v10/mpo_radar.png', title: 'Multiparameter Optimization Radar', tag: 'Lead Opt' },
    { src: '/v10/feature_correlation_heatmap.png', title: 'Feature Correlation & Covariance Matrix', tag: 'Explainability' },
    { src: '/v10/drug_rules_pains_sa.png', title: 'PAINS & Synthetic Accessibility Filters', tag: 'Safety' },
    { src: '/v10/calibration_curves.png', title: 'Uncertainty Calibration Curves', tag: 'MLOps' },
    { src: '/v10/protein_gallery.png', title: 'PDB Target Crystallographic Gallery', tag: 'Biophysics' }
  ];

  return (
    <div className={`flex flex-col gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              PEER-REVIEWED SCIENTIFIC REPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">v10-PUBLICATION</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Scientific Publication Studio & Benchmark Report</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 max-w-2xl">
            Comprehensive experimental validation, ROC-AUC comparisons vs baseline models, and statistical ablation studies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('publication_html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'publication_html'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Manuscript
            </button>
            <button
              onClick={() => setViewMode('benchmarks_gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === 'benchmarks_gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Figure Gallery
            </button>
          </div>

          <a
            href="/v10/publication_report (1).html"
            download="AETHER_Scientific_Report_V10.html"
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            title="Download Report HTML"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {viewMode === 'publication_html' ? (
        <div className="rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden relative h-[780px] bg-white">
          <iframe
            src="/v10/publication_report (1).html"
            title="AETHER Scientific Publication Report"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((fig, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-3 border border-slate-800 flex flex-col gap-2 bg-slate-950/80 hover:border-cyan-500/40 transition-all group"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={fig.src}
                  alt={fig.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-700 font-mono text-[9px] text-cyan-300">
                  {fig.tag}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                  {fig.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">Figure #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
