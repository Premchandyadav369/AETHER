'use client';

import React from 'react';
import { Activity, ArrowUpRight, TrendingUp, Cpu, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTab } from '../TabContext';

export default function ExperimentManager() {
  const { activeRunVersion, setActiveRunVersion } = useTab();

  const runs = [
    { version: 'V11 (Omega Pro)', date: '2026-08-01', auc: 0.958, f1: 0.912, bestLead: 'ATH-V11-0001 (pKd: 9.68)', runtime: '04m 12s', status: 'Latest Candidate' },
    { version: 'V10 (Omega)', date: '2026-07-29', auc: 0.948, f1: 0.892, bestLead: 'ATH-V10-0001 (pKd: 9.42)', runtime: '05m 40s', status: 'Active Baseline' },
    { version: 'V9 (Base)', date: '2026-06-15', auc: 0.927, f1: 0.845, bestLead: 'ATH-V9-0014 (pKd: 8.85)', runtime: '12m 30s', status: 'Archived' },
    { version: 'V8 (Legacy)', date: '2026-04-10', auc: 0.884, f1: 0.792, bestLead: 'ATH-V8-0008 (pKd: 8.12)', runtime: '28m 10s', status: 'Archived' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Experiment Manager & Multi-Run Version Tracking</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Compare model performance metrics, runtime speedups, and best lead improvements across V8, V9, V10 & V11
          </p>
        </div>
      </div>

      {/* Benchmark Graph Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Run Performance Improvement Graph (V8 vs V9 vs V10)</h3>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            <img
              src="/v10/benchmark_v10.png"
              alt="Benchmark V10"
              className="w-full h-auto max-h-[380px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Run Version Table */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Run Version History</h3>
          <div className="flex flex-col gap-3 font-mono text-xs">
            {runs.map((r, idx) => (
              <div
                key={idx}
                onClick={() => setActiveRunVersion(r.version)}
                className={`p-3 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                  activeRunVersion === r.version
                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{r.version}</span>
                  <span className="text-[10px] text-slate-500">{r.date}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>ROC-AUC: <strong className="text-emerald-400">{r.auc}</strong></span>
                  <span>F1: <strong className="text-cyan-400">{r.f1}</strong></span>
                </div>
                <div className="text-[10px] text-slate-400">Best: {r.bestLead}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
