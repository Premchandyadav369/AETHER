'use client';

import React, { useState } from 'react';
import { Search, Command, X, ArrowRight, ShieldCheck, Zap, Microscope, Activity, Heart, Cpu, FileText, Settings, Database, FlaskConical, Layers, BarChart3, Bot } from 'lucide-react';
import { useTab, SectionTab } from '../TabContext';

interface PaletteItem {
  id: string;
  title: string;
  category: string;
  tab: SectionTab;
  icon: any;
  shortcut?: string;
}

export default function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setActiveTab, setIsCopilotOpen } = useTab();
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const items: PaletteItem[] = [
    { id: '1', title: 'Executive Dashboard & System Metrics', category: 'Module', tab: 'executive', icon: Activity },
    { id: '2', title: 'Drug Discovery Pipeline Workspace', category: 'Module', tab: 'workspace', icon: Zap },
    { id: '3', title: 'De Novo Molecule Generator (SMILES/SELFIES)', category: 'Module', tab: 'generator', icon: FlaskConical },
    { id: '4', title: 'Protein Structure Explorer & PDB Viewer', category: 'Module', tab: 'proteins', icon: Microscope },
    { id: '5', title: 'Docking Studio (Vina / GNINA / DiffDock)', category: 'Module', tab: 'docking', icon: Layers },
    { id: '6', title: 'Molecular Dynamics (RMSD / RMSF / Trajectory)', category: 'Module', tab: 'dynamics', icon: Activity },
    { id: '7', title: 'AI Model Zoo (GATv2, GIN, Cross-Attention, VAE)', category: 'Module', tab: 'models', icon: Cpu },
    { id: '8', title: 'Dataset Manager & Preprocessing Status', category: 'Module', tab: 'datasets', icon: Database },
    { id: '9', title: 'Candidate Ranking (Top-100 / Top-20 / Top-10)', category: 'Module', tab: 'ranking', icon: ShieldCheck },
    { id: '10', title: 'Chemical Space Explorer (UMAP / t-SNE)', category: 'Module', tab: 'chemspace', icon: BarChart3 },
    { id: '11', title: 'ADMET & Toxicity Radar Center', category: 'Module', tab: 'admet', icon: Heart },
    { id: '12', title: 'Explainability & SHAP Attribution Center', category: 'Module', tab: 'explain', icon: Zap },
    { id: '13', title: 'Publication & Lab Report Generator', category: 'Module', tab: 'report', icon: FileText },
    { id: '14', title: 'Experiment Manager & Run Tracker (V8-V11)', category: 'Module', tab: 'experiments', icon: Activity },
    { id: '15', title: 'Hardware & System Settings', category: 'Module', tab: 'settings', icon: Settings }
  ];

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: PaletteItem) => {
    setActiveTab(item.tab);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl rounded-2xl glass-panel border border-cyan-500/30 shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-950/90 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search modules, proteins, SMILES, datasets..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-xs font-mono focus:outline-none"
            autoFocus
          />
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
          <button onClick={() => setIsCommandPaletteOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 font-mono text-xs">
          {filtered.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-950/60 hover:border-cyan-500/30 border border-transparent text-slate-300 hover:text-cyan-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-cyan-900 group-hover:text-cyan-300 text-slate-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs">{item.title}</span>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching modules or queries found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> to navigate</span>
          </div>
          <button
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsCopilotOpen(true);
            }}
            className="flex items-center gap-1 text-cyan-400 hover:underline"
          >
            <Bot className="w-3 h-3" />
            <span>Ask AI Copilot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
