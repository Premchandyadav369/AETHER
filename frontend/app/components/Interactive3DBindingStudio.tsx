'use client';

import React, { useState } from 'react';
import {
  Layers, Maximize2, Minimize2, RefreshCw, Box, Eye, Sparkles,
  ShieldCheck, Download, ExternalLink, Activity
} from 'lucide-react';
import { KNOWN_PROTEINS } from '../lib/api';
import { useTab } from '../TabContext';

export default function Interactive3DBindingStudio() {
  const { selectedProtein, setSelectedProtein } = useTab();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [complexType, setComplexType] = useState<'interactive_html' | 'complex_map'>('interactive_html');

  const currentProtein = KNOWN_PROTEINS.find(p => p.id.toUpperCase() === selectedProtein.toUpperCase()) || KNOWN_PROTEINS[0];

  const complexImageMap: Record<string, string> = {
    '1M17': '/v10/egfr_complex.png',
    '1HCK': '/v10/cdk2_complex.png',
    '1HVR': '/v10/hiv_protease_complex.png',
    '4EY7': '/v10/ache_complex.png',
    '1UWH': '/v10/braf_complex.png',
    '1J7T': '/v10/protein_gallery.png',
    '1ANR': '/v10/protein_gallery.png',
    '3FU2': '/v10/protein_gallery.png'
  };

  const complexImg = complexImageMap[currentProtein.id] || '/v10/egfr_complex.png';

  return (
    <div className={`flex flex-col gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto' : ''}`}>
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              PYMOL / 3DMOL INTERACTION STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">v10-HIGH RESOLUTION</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive 3D Protein-Ligand Complex Studio</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 max-w-2xl">
            Atomic coordinate surface mapping, hydrogen-bond networks, and solvent-accessible binding pockets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setComplexType('interactive_html')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                complexType === 'interactive_html'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive 3D View
            </button>
            <button
              onClick={() => setComplexType('complex_map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                complexType === 'complex_map'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surface Overlay Map
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {KNOWN_PROTEINS.map(p => {
          const isSelected = selectedProtein.toUpperCase() === p.id.toUpperCase();
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProtein(p.id)}
              className={`p-3 rounded-xl flex flex-col gap-1 text-left transition-all border ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-white">{p.id}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <span className="text-[10px] font-mono text-slate-300 truncate">{p.target}</span>
              <span className="text-[9px] font-mono text-slate-500">{p.resolution}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Complex Canvas / Viewport */}
      <div className="rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden relative min-h-[580px] flex flex-col bg-[#02050f]">
        {complexType === 'interactive_html' ? (
          <div className="w-full h-[620px] relative">
            <iframe
              src="/v10/interactive_3d_binding (1).html"
              title="AETHER 3D Molecular Complex"
              className="w-full h-full border-0 rounded-2xl"
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-lg">
                Active Complex: <strong>{currentProtein.id} ({currentProtein.target})</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full h-[620px] relative flex items-center justify-center p-4 bg-slate-950">
            <img
              src={complexImg}
              alt={`${currentProtein.name} Complex Map`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
            />
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-300 max-w-md">
              <span className="font-bold text-cyan-400 block mb-1">Target Surface Map: {currentProtein.name}</span>
              <span className="text-[11px] text-slate-400">
                High-resolution crystal structure complex with electrostatic potential field and catalytic residue envelope.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
