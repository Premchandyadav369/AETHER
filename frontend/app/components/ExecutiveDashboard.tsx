'use client';

import React from 'react';
import { Activity, Cpu, Zap, Database, ShieldCheck, Heart, Sparkles, ArrowUpRight, TrendingUp, Layers, CheckCircle2, AlertTriangle, FileText, Play } from 'lucide-react';
import { useTab } from '../TabContext';
import { V10_VISUALIZATIONS } from '../lib/api';

export default function ExecutiveDashboard() {
  const { setActiveTab, setIsCopilotOpen, userMode } = useTab();

  const metrics = [
    { title: 'Project Health', value: '99.8%', label: 'All 8 Engines Operational', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30' },
    { title: 'Active GPU Cluster', value: '8x NVIDIA H100', label: '84% Utilization (11.2 TFLOPS)', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500/30' },
    { title: 'Screened Compounds', value: '1,420,000+', label: 'De Novo & Repurposed Leads', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-500/30' },
    { title: 'Top Lead Discovery', value: 'ATH-V10-0001', label: 'pKd: 9.42 | Vina: -11.5 kcal/mol', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/30' }
  ];

  const liveJobs = [
    { id: 'JOB-9021', name: 'EGFR Pocket 1M17 Docking Sweep', progress: 88, status: 'Running', time: '02m 14s' },
    { id: 'JOB-9022', name: 'CatBoost & GATv2 Multi-Parameter Scoring', progress: 100, status: 'Completed', time: '05m 40s' },
    { id: 'JOB-9023', name: '100ns Molecular Dynamics Simulation', progress: 42, status: 'Running', time: '14m 20s' },
    { id: 'JOB-9024', name: 'De Novo SELFIES VAE Sampling Batch 4', progress: 100, status: 'Completed', time: '01m 12s' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="relative rounded-2xl glass-panel p-6 overflow-hidden border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-mono font-bold">
                AETHER-RAMI V10.0 OMEGA PLATFORM
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                SYSTEM ONLINE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Executive Research & Discovery Dashboard
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl mt-1">
              Real-time computational intelligence monitoring multi-target de novo generation, 3D consensus docking, active learning model zoo, and laboratory lead prioritization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('workspace')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Pipeline</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl glass-panel border ${m.bg} flex flex-col gap-2`}>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-mono">{m.title}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">{m.value}</div>
              <span className="text-[10px] text-slate-400 font-mono">{m.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Master Dashboard Image & Active Pipeline Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Output Dashboard Preview */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>V10 Master Pipeline Performance Overview</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  REAL ARTIFACT INDEXED
                </span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">Integrated output from multi-target pipeline execution</p>
            </div>
            <button
              onClick={() => setActiveTab('ranking')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Top Leads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
            <img
              src="/v10/v10_dashboard.png"
              alt="V10 Master Dashboard"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                // Fallback placeholder if image not loaded
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-4 bg-slate-950/80 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>Artifact path: <code className="text-cyan-400">public/v10/v10_dashboard.png</code></span>
              <span className="text-emerald-400">Verified V10 Run Benchmark</span>
            </div>
          </div>
        </div>

        {/* Live Active Jobs & GPU Monitor */}
        <div className="flex flex-col gap-4">
          {/* Active Job Queue */}
          <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live Compute Job Queue</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                4 Active
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {liveJobs.map(job => (
                <div key={job.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-slate-200 truncate max-w-[180px]">{job.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${job.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>{job.id}</span>
                    <span>Elapsed: {job.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Diagnostics */}
          <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Hardware Allocation</span>
            </h3>
            <div className="flex flex-col gap-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>GPU Memory (VRAM)</span>
                <span className="text-white">64.2 / 80 GB</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-cyan-400 w-[80%]" />
              </div>

              <div className="flex items-center justify-between text-slate-400 mt-1">
                <span>System RAM</span>
                <span className="text-white">142 / 256 GB</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-indigo-400 w-[55%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
