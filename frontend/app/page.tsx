'use client';

import React from 'react';
import { useTab, SectionTab } from './TabContext';
import BeginnerGuideHub from './components/BeginnerGuideHub';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import PipelineWorkspace from './components/PipelineWorkspace';
import PrecisionMedicineLab from './components/PrecisionMedicineLab';
import DigitalTwinSimulator from './components/DigitalTwinSimulator';
import MedicinalChemistStudio from './components/MedicinalChemistStudio';
import GlobalIntelligenceCenter from './components/GlobalIntelligenceCenter';
import QuantumPharmaLab from './components/QuantumPharmaLab';
import DeNovoGenerator from './components/DeNovoGenerator';
import ProteinExplorer from './components/ProteinExplorer';
import DockingStudio from './components/DockingStudio';
import Interactive3DBindingStudio from './components/Interactive3DBindingStudio';
import DynamicsDashboard from './components/DynamicsDashboard';
import ModelZoo from './components/ModelZoo';
import DeNovoLeadExplorer from './components/DeNovoLeadExplorer';
import DatasetManager from './components/DatasetManager';
import CandidateRanking from './components/CandidateRanking';
import ChemicalSpaceExplorer from './components/ChemicalSpaceExplorer';
import AdmetCenter from './components/AdmetCenter';
import ExplainabilityCenter from './components/ExplainabilityCenter';
import ScientificPublicationStudio from './components/ScientificPublicationStudio';
import ReportGenerator from './components/ReportGenerator';
import ExperimentManager from './components/ExperimentManager';
import SettingsPage from './components/SettingsPage';
import AICopilot from './components/AICopilot';
import CommandPalette from './components/CommandPalette';
import { Sparkles, Command, HelpCircle, Bot, Zap, ArrowRight } from 'lucide-react';

export default function MainPage() {
  const { activeTab, setActiveTab, userMode, setUserMode, setIsCommandPaletteOpen, setIsCopilotOpen } = useTab();

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 px-4 rounded-xl glass-panel border border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>AETHER-RAMI V10 OMEGA</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Mode: <strong className="text-cyan-400 uppercase">{userMode}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUserMode(userMode === 'beginner' ? 'expert' : 'beginner')}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 transition-colors font-bold text-[11px]"
          >
            Switch to {userMode === 'beginner' ? 'Expert Mode' : 'Beginner Guided Mode'}
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 text-[11px]"
          >
            <Command className="w-3 h-3 text-cyan-400" />
            <span>Command Palette</span>
            <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">Ctrl+K</kbd>
          </button>

          <button
            onClick={() => setIsCopilotOpen(true)}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-slate-950 flex items-center gap-1.5 text-[11px] shadow-[0_0_12px_rgba(0,229,255,0.2)]"
          >
            <Bot className="w-3.5 h-3.5 fill-current" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Beginner Wizard Mode Banner if active */}
      {userMode === 'beginner' && (
        <div className="p-4 rounded-2xl glass-panel border border-purple-500/30 bg-purple-950/20 text-xs font-mono text-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Beginner Guided Drug Discovery Flow</span>
              <span>1. Choose target protein → 2. Sample candidate molecules → 3. Rank top 10 leads</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('workspace')}
            className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold flex items-center gap-1.5 shrink-0"
          >
            <span>Start Guided Step 1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Render Active Workstation Module */}
      {activeTab === 'beginner' && <BeginnerGuideHub />}
      {activeTab === 'executive' && <ExecutiveDashboard />}
      {activeTab === 'workspace' && <PipelineWorkspace />}
      {activeTab === 'precision' && <PrecisionMedicineLab />}
      {activeTab === 'digitaltwin' && <DigitalTwinSimulator />}
      {activeTab === 'medchemist' && <MedicinalChemistStudio />}
      {activeTab === 'intelligence' && <GlobalIntelligenceCenter />}
      {activeTab === 'quantum' && <QuantumPharmaLab />}
      {activeTab === 'generator' && <DeNovoGenerator />}
      {activeTab === 'proteins' && <ProteinExplorer />}
      {activeTab === 'docking' && <Interactive3DBindingStudio />}
      {activeTab === 'dynamics' && <DynamicsDashboard />}
      {activeTab === 'models' && <ModelZoo />}
      {activeTab === 'datasets' && <DeNovoLeadExplorer />}
      {activeTab === 'ranking' && <CandidateRanking />}
      {activeTab === 'chemspace' && <ChemicalSpaceExplorer />}
      {activeTab === 'admet' && <AdmetCenter />}
      {activeTab === 'explain' && <ExplainabilityCenter />}
      {activeTab === 'report' && <ScientificPublicationStudio />}
      {activeTab === 'experiments' && <ExperimentManager />}
      {activeTab === 'settings' && <SettingsPage />}

      {/* Modals & Overlays */}
      <AICopilot />
      <CommandPalette />
    </div>
  );
}
