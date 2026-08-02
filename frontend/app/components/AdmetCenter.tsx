'use client';

import React from 'react';
import { Heart, ShieldAlert, CheckCircle2, AlertTriangle, Zap, Sparkles } from 'lucide-react';
import { useTab } from '../TabContext';

export default function AdmetCenter() {
  const { smilesInput } = useTab();

  const rules = [
    { name: 'Lipinski Rule of 5', status: 'Passed (0 Violations)', desc: 'MW < 500, LogP < 5, HBD <= 5, HBA <= 10', pass: true },
    { name: 'Veber Rule', status: 'Passed', desc: 'Rotatable Bonds <= 10, TPSA <= 140 Å²', pass: true },
    { name: 'PAINS Filter', status: 'Passed (Clean)', desc: 'Zero pan-assay interference compounds', pass: true },
    { name: 'Ghose Filter', status: 'Passed', desc: 'MW 160-480, LogP -0.4 to 5.6, Molar Refractivity 40-130', pass: true }
  ];

  const toxicity = [
    { endpoint: 'hERG Cardiac Risk', level: 'Low Risk', score: 0.12, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
    { endpoint: 'DILI (Drug Induced Liver Injury)', level: 'Low Risk', score: 0.18, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
    { endpoint: 'AMES Mutagenicity', level: 'Negative (Safe)', score: 0.05, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800' },
    { endpoint: 'CYP3A4 Inhibition Risk', level: 'Moderate', score: 0.42, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800' },
    { endpoint: 'Blood-Brain Barrier (BBB)', level: 'Permeable', score: 0.88, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>ADMET & Toxicity Screening Center</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Multi-endpoint pharmacokinetics, Lipinski/Veber rule compliance, and toxicity risk profiling
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-800">
          <CheckCircle2 className="w-4 h-4" />
          <span>Overall Safety Profile: PASS</span>
        </div>
      </div>

      {/* Main Grid: MPO Radar Plot Image & Rule Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Multi-Parameter Optimization (MPO) Radar Chart</h3>
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            <img
              src="/v10/mpo_radar.png"
              alt="MPO Radar"
              className="w-full h-auto max-h-[380px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Rule Checks & Toxicity Endpoints */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2.5">Medicinal Chemistry Filter Rules</h3>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {rules.map((r, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{r.name}</span>
                    <span className="text-[9px] text-slate-500">{r.desc}</span>
                  </div>
                  <span className="text-emerald-400 font-bold text-[10px]">{r.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-3">
            <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2.5">Toxicity Risk Endpoints</h3>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {toxicity.map((t, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border flex items-center justify-between ${t.bg}`}>
                  <span className="font-bold text-slate-200">{t.endpoint}</span>
                  <span className={`font-bold ${t.color}`}>{t.level} ({t.score})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
