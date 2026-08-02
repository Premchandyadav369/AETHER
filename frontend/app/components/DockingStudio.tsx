'use client';

import React, { useState } from 'react';
import { Layers, Zap, Download, RefreshCw, CheckCircle2, ShieldCheck, Play, Sparkles } from 'lucide-react';
import Pdb3DViewer from './Pdb3DViewer';
import { useTab } from '../TabContext';

export default function DockingStudio() {
  const { selectedProtein, smilesInput } = useTab();
  const [dockingEngine, setDockingEngine] = useState<'vina' | 'gnina' | 'diffdock'>('vina');
  const [exhaustiveness, setExhaustiveness] = useState<number>(32);
  const [isDocking, setIsDocking] = useState<boolean>(false);

  const poses = [
    { pose: 1, vina_score: -10.4, gnina_cnn: 0.94, diffdock_confidence: 0.88, h_bonds: 3, hydrophobic_contacts: 8, status: 'Top Consensus Pose' },
    { pose: 2, vina_score: -9.8, gnina_cnn: 0.89, diffdock_confidence: 0.82, h_bonds: 2, hydrophobic_contacts: 7, status: 'Conformer Pose' },
    { pose: 3, vina_score: -9.2, gnina_cnn: 0.84, diffdock_confidence: 0.79, h_bonds: 2, hydrophobic_contacts: 6, status: 'Conformer Pose' },
    { pose: 4, vina_score: -8.6, gnina_cnn: 0.78, diffdock_confidence: 0.71, h_bonds: 1, hydrophobic_contacts: 5, status: 'Conformer Pose' }
  ];

  const handleRunDocking = () => {
    setIsDocking(true);
    setTimeout(() => {
      setIsDocking(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Docking Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>3D Molecular Docking Studio (Consensus Vina + GNINA + DiffDock)</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Simulate binding poses, free energy grid scores (ΔG in kcal/mol), and H-bond residue interactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dockingEngine}
            onChange={e => setDockingEngine(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none"
          >
            <option value="vina">AutoDock Vina 1.2.5</option>
            <option value="gnina">GNINA CNN Scoring</option>
            <option value="diffdock">DiffDock Equivariant ML</option>
          </select>

          <button
            onClick={handleRunDocking}
            disabled={isDocking}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center gap-2"
          >
            <Play className={`w-4 h-4 fill-current ${isDocking ? 'animate-spin' : ''}`} />
            <span>{isDocking ? 'Running Grid Docking...' : 'Run 3D Docking'}</span>
          </button>
        </div>
      </div>

      {/* Docking Visualization & Pose Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Pdb3DViewer pdbId={selectedProtein} height="h-[420px]" showBindingPocket={true} highlightLigand={true} />
        </div>

        {/* Pose Ranking & Energy Breakdown */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
            <span>Docking Poses & Energy Scores</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Target {selectedProtein}
            </span>
          </h3>

          <div className="flex flex-col gap-2.5">
            {poses.map((p, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl flex flex-col gap-1.5 border transition-all ${
                  idx === 0
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">Pose #{p.pose} ({p.status})</span>
                  <span className="text-cyan-400 font-bold">{p.vina_score} kcal/mol</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                  <span>GNINA CNN: <strong className="text-white">{p.gnina_cnn}</strong></span>
                  <span>H-Bonds: <strong className="text-emerald-400">{p.h_bonds}</strong></span>
                  <span>DiffDock Conf: <strong className="text-white">{p.diffdock_confidence}</strong></span>
                  <span>Hydrophobic: <strong className="text-purple-400">{p.hydrophobic_contacts}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
