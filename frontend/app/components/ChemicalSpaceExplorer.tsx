'use client';

import React, { useState } from 'react';
import { BarChart3, RefreshCw, Layers, Sparkles, Filter } from 'lucide-react';
import { useTab } from '../TabContext';

export default function ChemicalSpaceExplorer() {
  const { setSmilesInput, setActiveTab } = useTab();
  const [projection, setProjection] = useState<'umap' | 'tsne' | 'pca'>('tsne');

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>High-Dimensional Chemical Space Explorer (foundation_embeddings.npy)</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            UMAP & t-SNE 2D manifold projection of 2048-bit GraphCL foundation embeddings & scaffold clusters
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => setProjection('tsne')}
            className={`px-3 py-1.5 rounded-xl ${projection === 'tsne' ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-slate-400'}`}
          >
            t-SNE Projection
          </button>
          <button
            onClick={() => setProjection('umap')}
            className={`px-3 py-1.5 rounded-xl ${projection === 'umap' ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-800' : 'text-slate-400'}`}
          >
            UMAP Manifold
          </button>
        </div>
      </div>

      {/* Main Plot Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">2D Chemical Landscape Plot ({projection.toUpperCase()})</h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              1,420,000 Points Indexed
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            <img
              src="/v10/tsne_chemical_space.png"
              alt="Chemical Space Plot"
              className="w-full h-auto max-h-[440px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Cluster Info */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Scaffold Clusters & Neighborhoods</h3>

          <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Cluster #1: Kinase Hingebinder Core</span>
              <span className="text-[10px] text-slate-400">Pyridinyl-pyrimidine derivatives (pKd &gt; 8.5)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-indigo-400 font-bold block">Cluster #2: Protease Peptidomimetics</span>
              <span className="text-[10px] text-slate-400">Hydroxyethylamine isostere scaffold</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-purple-400 font-bold block">Cluster #3: AChE Dual Binding Leads</span>
              <span className="text-[10px] text-slate-400">Benzylpiperidine & carbamate pharmacophores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
