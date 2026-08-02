'use client';

import React, { useState } from 'react';
import { Microscope, Box, RefreshCw, Eye, Sparkles, Layers, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import Pdb3DViewer from './Pdb3DViewer';
import { KNOWN_PROTEINS } from '../lib/api';
import { useTab } from '../TabContext';

export default function ProteinExplorer() {
  const { selectedProtein, setSelectedProtein } = useTab();
  const [activeTab, setActiveTab] = useState<'3d' | 'pocket' | 'residues' | 'alphafold'>('3d');
  const currentProtein = KNOWN_PROTEINS.find(p => p.id.toUpperCase() === selectedProtein.toUpperCase()) || KNOWN_PROTEINS[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-cyan-400" />
            <span>Protein Structural Intelligence & Pocket Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            PDB structure analysis, binding cavity detection, mutation mapping & AlphaFold3 pLDDT confidence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProtein}
            onChange={e => setSelectedProtein(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            {KNOWN_PROTEINS.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name} ({p.target})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Protein Grid Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {KNOWN_PROTEINS.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProtein(p.id)}
            className={`p-3 rounded-xl flex flex-col gap-1 text-left transition-all border ${
              selectedProtein.toUpperCase() === p.id.toUpperCase()
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="font-mono font-bold text-xs">{p.id}</span>
            <span className="text-[10px] font-mono text-slate-400 truncate">{p.target}</span>
            <span className="text-[9px] font-mono text-slate-500">{p.resolution}</span>
          </button>
        ))}
      </div>

      {/* Main 3D Viewer & Structural Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Pdb3DViewer pdbId={currentProtein.id} height="h-[480px]" showBindingPocket={true} highlightLigand={true} />
        </div>

        {/* Structural Specs & Residue Hotspots */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>PDB Structure Specs: {currentProtein.id}</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Protein Name:</span>
              <span className="text-white font-bold">{currentProtein.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Primary Disease:</span>
              <span className="text-rose-400 font-bold">{currentProtein.disease}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">X-Ray Resolution:</span>
              <span className="text-cyan-400 font-bold">{currentProtein.resolution}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Residue Count:</span>
              <span className="text-white">{currentProtein.residues} residues</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">Key Pocket Hotspot Residues:</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Met790 (Gatekeeper)
              </span>
              <span className="px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Thr790 (H-Bond)
              </span>
              <span className="px-2 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                Lys745 (Catalytic)
              </span>
              <span className="px-2 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                Asp855 (DFG-In)
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">AlphaFold3 Confidence:</span>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-400 font-bold">pLDDT Score: 94.8</span>
              <span className="text-slate-400">Very High Confidence</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-emerald-400 w-[95%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
