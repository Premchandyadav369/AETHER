'use client';

import React, { useState } from 'react';
import {
  Home, Activity, Database, Compass, RefreshCw, Zap, Cpu,
  HelpCircle, Github, Brain, Network, ShieldAlert, Heart,
  FlaskConical, Code, Sun, Moon, Bell, Microscope, Layers, Dna,
  Sparkles, Sliders, ChevronRight
} from 'lucide-react';
import { GeistSans } from 'geist/font/sans';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { TabProvider, useTab, Tab } from './TabContext';
import SmoothScroll from './components/SmoothScroll';

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

const PRIMARY_TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'omega', label: '⚡ V10.5 OMEGA Studio', icon: FlaskConical },
  { key: 'home', label: 'Home Overview', icon: Home },
  { key: 'engine', label: 'Discovery Engine', icon: Zap },
  { key: 'druglab', label: 'Virtual Drug Lab', icon: Microscope },
  { key: 'digitaltwin', label: 'Digital Twin', icon: Activity },
  { key: 'cancer', label: 'Oncology Module', icon: Heart },
  { key: 'dashboard', label: 'V9 Benchmarks', icon: Cpu },
];

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTab();

  return (
    <>
      <SmoothScroll />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] ambient-glow" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] ambient-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 scientific-grid opacity-30" />
      </div>

      {/* Header */}
      <header className="glass-panel border-b border-slate-800/80 sticky top-0 w-full h-14 flex items-center justify-between px-4 z-40 bg-slate-950/80 backdrop-blur-xl">
        <button className="flex items-center gap-3 magnetic-target" onClick={() => setActiveTab('omega')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-display font-black text-slate-950 text-base shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            A
          </div>
          <div className="text-left">
            <span className="font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 text-sm">
              AETHER-RAMI
            </span>
            <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-700/50">V10.5 OMEGA</span>
          </div>
        </button>

        {/* Streamlined Header Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs">
          {PRIMARY_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-medium text-[11px] whitespace-nowrap ${
                activeTab === key
                  ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>FastAPI Online</span>
          </div>

          <button
            onClick={() => setActiveTab('omega')}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Launch Studio</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative z-10">
        {/* Streamlined Left Sidebar with 5 Clear Workstation Groups */}
        <aside className="glass-panel border-r border-slate-800/80 w-16 md:w-56 flex flex-col py-4 px-2 gap-2 sticky top-14 h-[calc(100vh-56px)] z-30 overflow-y-auto bg-slate-950/70">
          <div className="hidden md:block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
            Workstations
          </div>

          <SidebarNavItem
            icon={<FlaskConical className="w-4 h-4 text-cyan-400" />}
            title="V10.5 OMEGA Studio"
            desc="Molecular Workbench"
            active={activeTab === 'omega'}
            onClick={() => setActiveTab('omega')}
          />

          <SidebarNavItem
            icon={<Zap className="w-4 h-4 text-emerald-400" />}
            title="Discovery Engine"
            desc="SMILES & Sequence DTI"
            active={activeTab === 'engine'}
            onClick={() => setActiveTab('engine')}
          />

          <SidebarNavItem
            icon={<Microscope className="w-4 h-4 text-indigo-400" />}
            title="Virtual Drug Lab"
            desc="6-Step Pipeline"
            active={activeTab === 'druglab'}
            onClick={() => setActiveTab('druglab')}
          />

          <SidebarNavItem
            icon={<Activity className="w-4 h-4 text-purple-400" />}
            title="Human Digital Twin"
            desc="PBPK Compartments"
            active={activeTab === 'digitaltwin'}
            onClick={() => setActiveTab('digitaltwin')}
          />

          <SidebarNavItem
            icon={<Heart className="w-4 h-4 text-rose-400" />}
            title="Oncology Module"
            desc="Cancer Mutations"
            active={activeTab === 'cancer'}
            onClick={() => setActiveTab('cancer')}
          />

          <SidebarNavItem
            icon={<Cpu className="w-4 h-4 text-amber-400" />}
            title="V9 Assets & Assets"
            desc="Benchmarks & Leaderboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />

          <div className="mt-auto border-t border-slate-800/80 pt-3">
            <SidebarNavItem
              icon={<Code className="w-4 h-4 text-slate-400" />}
              title="REST API Docs"
              desc="FastAPI /docs"
              active={activeTab === 'developer'}
              onClick={() => setActiveTab('developer')}
            />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 md:p-5 relative">
          {children}
        </main>
      </div>
    </>
  );
}

function SidebarNavItem({ icon, title, desc, active, onClick }: {
  icon: React.ReactNode; title: string; desc: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all text-left group ${
        active
          ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
          : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
      }`}
    >
      <div className={`p-2 rounded-lg flex items-center justify-center ${active ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40' : 'bg-slate-900 text-slate-400'}`}>
        {icon}
      </div>
      <div className="hidden md:flex flex-col overflow-hidden">
        <span className="font-bold text-xs truncate leading-snug">{title}</span>
        <span className="text-[10px] text-slate-500 font-mono truncate">{desc}</span>
      </div>
    </button>
  );
}
