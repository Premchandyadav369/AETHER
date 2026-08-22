'use client';

import React from 'react';
import {
  Activity, Zap, FlaskConical, Microscope, Layers, Cpu, Database, ShieldCheck,
  BarChart3, Heart, FileText, Settings, Bot, Sparkles, Command, Dna, Globe2, Atom, Compass
} from 'lucide-react';
import { GeistSans } from 'geist/font/sans';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { TabProvider, useTab, SectionTab } from './TabContext';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-ibm-plex-mono' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className={`${GeistSans.className} bg-[#050816] text-slate-100 min-h-screen flex flex-col relative`}>
        <TabProvider>
          <RootLayoutInner>{children}</RootLayoutInner>
        </TabProvider>
      </body>
    </html>
  );
}

const SIDEBAR_ITEMS: { key: SectionTab; label: string; desc: string; icon: any }[] = [
  { key: 'proteus', label: 'PROTEUS Hero', desc: 'Molecular Lens & Reveal', icon: Atom },
  { key: 'beginner', label: 'Beginner & Presets Hub', desc: 'Layman Science & 1-Click Tours', icon: Compass },
  { key: 'executive', label: 'Executive Dashboard', desc: 'System & GPU Health', icon: Activity },
  { key: 'workspace', label: 'Discovery Pipeline', desc: '8-Stage Workflow', icon: Zap },
  { key: 'precision', label: 'Precision Medicine', desc: 'Mutations & Resistance', icon: Dna },
  { key: 'digitaltwin', label: 'Digital Human Twin', desc: 'PBPK PK/PD Dynamics', icon: Heart },
  { key: 'medchemist', label: 'AI Medicinal Chemist', desc: 'SAR & Bioisosteres', icon: FlaskConical },
  { key: 'intelligence', label: 'Global Intelligence', desc: 'PubChem & Trials Graph', icon: Globe2 },
  { key: 'quantum', label: 'Quantum & Synthesis', desc: 'DFT Orbitals & SAS', icon: Atom },
  { key: 'generator', label: 'De Novo Generator', desc: 'SMILES & SELFIES VAE', icon: Sparkles },
  { key: 'proteins', label: 'Protein Explorer', desc: 'PDB 3D & Pocket Detection', icon: Microscope },
  { key: 'docking', label: 'Docking Studio', desc: 'Vina / GNINA / DiffDock', icon: Layers },
  { key: 'dynamics', label: 'Molecular Dynamics', desc: 'RMSD & OpenMM Trajectory', icon: Activity },
  { key: 'models', label: 'AI Model Zoo', desc: 'GATv2 / GIN / Cross-Attn', icon: Cpu },
  { key: 'datasets', label: 'Dataset Manager', desc: 'ChEMBL & BindingDB Data', icon: Database },
  { key: 'ranking', label: 'Candidate Ranking', desc: 'Top 100 / 20 / 10 Leads', icon: ShieldCheck },
  { key: 'chemspace', label: 'Chemical Space', desc: 'UMAP & t-SNE Embeddings', icon: BarChart3 },
  { key: 'admet', label: 'ADMET & Toxicity', desc: 'MPO Radar & PAINS Rules', icon: Heart },
  { key: 'explain', label: 'Explainability & SHAP', desc: 'Attribution & Correlation', icon: Zap },
  { key: 'report', label: 'Research Reports', desc: 'Interactive HTML & PDF', icon: FileText },
  { key: 'experiments', label: 'Experiment Tracker', desc: 'V8 vs V9 vs V10 Comparison', icon: Activity },
  { key: 'settings', label: 'Settings & Controls', desc: 'Precision & Random Seeds', icon: Settings }
];

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab, setIsCommandPaletteOpen, setIsCopilotOpen } = useTab();

  return (
    <>
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] ambient-glow" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] ambient-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 scientific-grid opacity-30" />
      </div>

      {/* Header */}
      <header className="glass-panel border-b border-slate-800/80 sticky top-0 w-full h-14 flex items-center justify-between px-4 z-40 bg-slate-950/90 backdrop-blur-xl">
        <button className="flex items-center gap-3" onClick={() => setActiveTab('executive')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-slate-950 text-base shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            A
          </div>
          <div className="text-left">
            <span className="font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 text-sm">
              AETHER-RAMI
            </span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/50">
              V10 OMEGA
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FastAPI Backend Online</span>
          </div>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs flex items-center gap-1"
            title="Command Palette (Ctrl+K)"
          >
            <Command className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5 fill-current" />
            <span>AI Copilot</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative z-10">
        {/* Left Sidebar */}
        <aside className="glass-panel border-r border-slate-800/80 w-16 md:w-60 flex flex-col py-3 px-2 gap-1 sticky top-14 h-[calc(100vh-56px)] z-30 overflow-y-auto bg-slate-950/80">
          <div className="hidden md:block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
            Workstation Modules
          </div>

          {SIDEBAR_ITEMS.map(({ key, label, desc, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left group ${
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.1)]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="hidden md:flex flex-col overflow-hidden">
                  <span className="font-bold text-xs truncate leading-snug">{label}</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate">{desc}</span>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </>
  );
}
