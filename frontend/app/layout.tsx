'use client';

import React, { useState } from 'react';
import {
  Home, Activity, Database, Compass, RefreshCw, Zap, Cpu,
  HelpCircle, Github, Brain, Network, ShieldAlert, Heart,
  FlaskConical, Code, Sun, Moon, Bell, Microscope, Layers, Dna
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
      <body className={`${GeistSans.className} bg-aether-bg text-aether-text min-h-screen flex flex-col relative`}>
        <TabProvider>
          <RootLayoutInner>{children}</RootLayoutInner>
        </TabProvider>
      </body>
    </html>
  );
}

const NAV_TABS: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'features', label: 'Features' },
  { key: 'workspace', label: 'Studio' },
  { key: 'engine', label: 'Engine' },
  { key: 'druglab', label: 'Drug Lab' },
  { key: 'digitaltwin', label: 'Twin' },
  { key: 'research', label: 'Workbench' },
  { key: 'proteins', label: 'Proteins' },
  { key: 'molecules', label: 'Molecules' },
  { key: 'pathogens', label: 'Pathogens' },
  { key: 'cancer', label: 'Cancer' },
  { key: 'pipeline', label: 'Agent' },
  { key: 'copilot', label: 'Copilot' },
  { key: 'dashboard', label: 'Research' },
  { key: 'knowledge', label: 'Galaxy' },
  { key: 'explain', label: 'XAI' },
];

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { activeTab, setActiveTab } = useTab();

  return (
    <>
      <SmoothScroll />

      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-mesh-glow ambient-glow" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-mesh-accent ambient-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 scientific-grid opacity-40" />
      </div>

      {/* Header */}
      <header className="glass-panel border-b border-aether-border sticky top-0 w-full h-14 flex items-center justify-between px-5 z-40">
        <button className="flex items-center gap-2.5 magnetic-target" onClick={() => setActiveTab('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aether-primary to-aether-accent flex items-center justify-center font-display font-black text-aether-bg text-sm shadow-neon">
            A
          </div>
          <div className="text-left">
            <span className="font-display font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-aether-primary via-aether-secondary to-aether-accent text-sm">
              AETHER-RAMI
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold badge-quantum">V7 OS</span>
          </div>
        </button>

        <nav className="hidden xl:flex items-center gap-1 text-[11px] text-aether-muted">
          {NAV_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1.5 rounded-lg transition-all magnetic-target whitespace-nowrap ${
                activeTab === key
                  ? 'text-aether-primary bg-aether-primary/10 border border-aether-primary/25 font-semibold'
                  : 'hover:text-white hover:bg-aether-bg2'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('developer')}
            className={`p-2 rounded-lg text-xs magnetic-target transition-all ${
              activeTab === 'developer' ? 'text-aether-primary bg-aether-primary/10 border border-aether-primary/25' : 'text-aether-muted hover:text-white'
            }`}
          >
            <Github size={16} />
          </button>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-2 text-aether-muted hover:text-white magnetic-target">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="p-2 text-aether-muted hover:text-white relative magnetic-target">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-aether-danger" />
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className="hidden sm:flex px-3 py-1.5 rounded-lg bg-gradient-to-r from-aether-primary/20 to-aether-accent/20 border border-aether-primary/30 font-display font-bold text-xs text-aether-primary shadow-neon magnetic-target"
          >
            Launch Workspace
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <aside className="glass-panel border-r border-aether-border w-14 md:w-16 flex flex-col items-center py-4 gap-3 sticky top-14 h-[calc(100vh-56px)] z-30 overflow-y-auto">
            <SidebarBtn icon={<Home size={18} />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <SidebarBtn icon={<Layers size={18} />} label="Features" active={activeTab === 'features'} onClick={() => setActiveTab('features')} />
            <SidebarBtn icon={<Microscope size={18} />} label="Studio" active={activeTab === 'workspace'} onClick={() => setActiveTab('workspace')} />
          <SidebarBtn icon={<Zap size={18} />} label="Engine" active={activeTab === 'engine'} onClick={() => setActiveTab('engine')} />
          <SidebarBtn icon={<FlaskConical size={18} />} label="Drug Lab" active={activeTab === 'druglab'} onClick={() => setActiveTab('druglab')} />
          <SidebarBtn icon={<Activity size={18} />} label="Twin" active={activeTab === 'digitaltwin'} onClick={() => setActiveTab('digitaltwin')} />
          <SidebarBtn icon={<Dna size={18} />} label="Workbench" active={activeTab === 'research'} onClick={() => setActiveTab('research')} />
          <SidebarBtn icon={<Database size={18} />} label="Proteins" active={activeTab === 'proteins'} onClick={() => setActiveTab('proteins')} />
          <SidebarBtn icon={<Compass size={18} />} label="Molecules" active={activeTab === 'molecules'} onClick={() => setActiveTab('molecules')} />
          <SidebarBtn icon={<ShieldAlert size={18} />} label="Pathogens" active={activeTab === 'pathogens'} onClick={() => setActiveTab('pathogens')} />
          <SidebarBtn icon={<Heart size={18} />} label="Cancer" active={activeTab === 'cancer'} onClick={() => setActiveTab('cancer')} />
          <SidebarBtn icon={<RefreshCw size={18} />} label="Agent" active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} />
          <SidebarBtn icon={<Brain size={18} />} label="Copilot" active={activeTab === 'copilot'} onClick={() => setActiveTab('copilot')} />
          <SidebarBtn icon={<Cpu size={18} />} label="Research" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarBtn icon={<Network size={18} />} label="Galaxy" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} />
          <SidebarBtn icon={<HelpCircle size={18} />} label="XAI" active={activeTab === 'explain'} onClick={() => setActiveTab('explain')} />
          <div className="mt-auto">
            <SidebarBtn icon={<Code size={18} />} label="API" active={activeTab === 'developer'} onClick={() => setActiveTab('developer')} />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
    </>
  );
}

function SidebarBtn({ icon, label, active, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-2.5 rounded-xl transition-all magnetic-target ${
        active ? 'bg-aether-primary/15 text-aether-primary border border-aether-primary/30 shadow-neon' : 'text-aether-muted hover:bg-aether-bg2 hover:text-white'
      }`}
    >
      {icon}
      <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all rounded-lg bg-aether-bg3 px-2 py-1 text-[10px] text-white border border-aether-border z-50 whitespace-nowrap shadow-xl font-bold">
        {label}
      </span>
    </button>
  );
}
