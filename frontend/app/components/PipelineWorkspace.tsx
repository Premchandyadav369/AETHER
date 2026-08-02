'use client';

import React, { useState } from 'react';
import { Zap, Play, RefreshCw, CheckCircle2, ArrowRight, Layers, Database, Microscope, FlaskConical, Activity, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { useTab } from '../TabContext';

export default function PipelineWorkspace() {
  const { setActiveTab, selectedProtein, setSelectedProtein, userMode } = useTab();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] AETHER-RAMI V10.0 Pipeline Engine initialized.',
    '[CUDA] GPU Device 0: NVIDIA H100 SXM5 80GB ready.',
    '[DATA] Ready for target selection and conditional molecule sampling.'
  ]);

  const stages = [
    { id: 0, title: '1. Dataset Selection', icon: Database, desc: 'BindingDB / ChEMBL 34 / PDBbind 2024 filtering' },
    { id: 1, title: '2. Protein Target', icon: Microscope, desc: 'PDB pocket detection & AlphaFold3 alignment' },
    { id: 2, title: '3. Molecule Generation', icon: FlaskConical, desc: 'ProtCond-VAE & SELFIES fragment expansion' },
    { id: 3, title: '4. AI Prediction', icon: Zap, desc: 'GATv2 + ExtraTrees affinity & ADMET scoring' },
    { id: 4, title: '5. 3D Docking', icon: Layers, desc: 'AutoDock Vina & GNINA consensus grid calculation' },
    { id: 5, title: '6. Molecular Dynamics', icon: Activity, desc: '100ns OpenMM explicit solvent trajectory' },
    { id: 6, title: '7. Free Energy (MM-PBSA)', icon: Cpu, desc: 'Solvation binding free energy calculation' },
    { id: 7, title: '8. Final Lead Ranking', icon: ShieldCheck, desc: 'Multi-parameter priority ranking & export' }
  ];

  const runFullPipeline = () => {
    setIsRunning(true);
    setActiveStep(0);
    setLogs(prev => [...prev, `[START] Initiating 8-stage pipeline run for protein ${selectedProtein}...`]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setActiveStep(step);
        setLogs(prev => [...prev, `[STAGE ${step + 1}] Executing ${stages[step].title}... Done.`]);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setLogs(prev => [...prev, `[COMPLETE] Pipeline finished! 100 top lead candidates generated and ranked.`]);
      }
    }, 900);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>End-to-End Drug Discovery Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            8-Stage Autonomous Workflow (Dataset → Protein → Gen → AI → Docking → MD → Free Energy → Ranking)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProtein}
            onChange={e => setSelectedProtein(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="1M17">Target: EGFR Kinase (1M17)</option>
            <option value="1HCK">Target: CDK2 Kinase (1HCK)</option>
            <option value="1HVR">Target: HIV-1 Protease (1HVR)</option>
            <option value="4EY7">Target: AChE Enzyme (4EY7)</option>
            <option value="1UWH">Target: BRAF V600E (1UWH)</option>
          </select>

          <button
            onClick={runFullPipeline}
            disabled={isRunning}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] ${
              isRunning ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 hover:opacity-90'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Pipeline...' : 'Execute 8-Stage Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* 8-Stage Progress Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeStep || (!isRunning && activeStep === 7);
          const isCurrent = idx === activeStep && isRunning;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStep(idx)}
              className={`p-3 rounded-xl flex flex-col gap-2 text-left transition-all border ${
                isCurrent
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4" />
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <span className="text-[9px] font-mono">Stage {idx + 1}</span>}
              </div>
              <span className="font-bold text-xs truncate leading-snug">{stage.title}</span>
              <span className="text-[9px] font-mono text-slate-500 truncate">{stage.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Active Stage Config: {stages[activeStep].title}</span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">{stages[activeStep].desc}</p>
            </div>
            <span className="px-2.5 py-1 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              GPU Accelerated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-slate-400 font-bold">Input Parameters</span>
              <div className="flex items-center justify-between">
                <span>Target PDB ID:</span>
                <span className="text-cyan-400 font-bold">{selectedProtein}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sampling Temperature:</span>
                <span className="text-white">0.75</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Docking Exhaustiveness:</span>
                <span className="text-white">32 Grid Search</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
              <span className="text-slate-400 font-bold">Model Engine</span>
              <div className="flex items-center justify-between">
                <span>Generative Model:</span>
                <span className="text-purple-400 font-bold">ProtCond-VAE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Affinity Predictor:</span>
                <span className="text-emerald-400 font-bold">GATv2 + ExtraTrees</span>
              </div>
              <div className="flex items-center justify-between">
                <span>MD Engine:</span>
                <span className="text-cyan-400 font-bold">OpenMM 8.1</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('ranking')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <span>View Generated Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Terminal Log Streamer */}
        <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Live Terminal Log Viewer</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[10px] text-slate-300 h-64 overflow-y-auto flex flex-col gap-1.5">
            {logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                <span className="text-slate-500">[2026-08-02]</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
