'use client';

import React from 'react';
import { Zap, Sparkles, Eye, BarChart3 } from 'lucide-react';

export default function ExplainabilityCenter() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Explainable AI & SHAP Attribution Center</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            TreeSHAP feature attributions, cross-attention heatmap matrices & per-atom chemical importance
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
          TreeSHAP + Integrated Gradients
        </span>
      </div>

      {/* SHAP & Heatmap Images Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">SHAP Feature Importance Summary</h3>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            <img
              src="/v10/shap_summary (1).png"
              alt="SHAP Summary"
              className="w-full h-auto max-h-[380px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Feature Correlation Heatmap</h3>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            <img
              src="/v10/feature_correlation_heatmap.png"
              alt="Feature Correlation Heatmap"
              className="w-full h-auto max-h-[380px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
