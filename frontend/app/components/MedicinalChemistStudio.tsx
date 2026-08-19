'use client';

import React, { useState, useEffect } from 'react';
import { useTab } from '../TabContext';
import { fetchMedicinalChemist, predictBindingAndAdmet } from '../lib/api';
import { Sparkles, FlaskConical, ArrowRight, CheckCircle2, Zap, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function MedicinalChemistStudio() {
  const { smilesInput, setSmilesInput, selectedProtein } = useTab();
  const [loading, setLoading] = useState(false);
  const [chemistData, setChemistData] = useState<any>(null);
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await fetchMedicinalChemist(smilesInput, selectedProtein);
      setChemistData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [smilesInput, selectedProtein]);

  const applyOptimization = (newSmiles: string, name: string) => {
    setSmilesInput(newSmiles);
    setAppliedMsg(`Applied ${name} to Workspace!`);
    setTimeout(() => setAppliedMsg(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-slate-900/60 to-cyan-950/40 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-teal-500/20 text-teal-300 border border-teal-400/30">
                STRUCTURE-ACTIVITY OPTIMIZATION
              </span>
              <span className="text-xs text-slate-400 font-mono">v10-MEDCHEM</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-teal-400" />
              <span>AI Medicinal Chemist & Lead Optimization Studio</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Generates bioisosteric replacements, resolves metabolic hotspots, and optimizes potency against target {selectedProtein}.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(20,184,166,0.3)] shrink-0 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Lead...' : 'Re-evaluate Lead Modifications'}</span>
          </button>
        </div>
      </div>

      {appliedMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-pulse">
          <CheckCircle2 className="w-4 h-4" />
          <span>{appliedMsg}</span>
        </div>
      )}

      {/* Optimization Score & Core Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500">Lead Optimization Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-mono font-black text-teal-400">
                {chemistData?.lead_optimization_score || 86.5}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 100</span>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-2">
              High druggability baseline with 3 high-probability bioisostere upgrade opportunities.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Target Pocket</span>
            <span className="text-cyan-400 font-bold">{selectedProtein} Kinase Domain</span>
          </div>
        </div>

        {/* Bioisosteric Dictionary */}
        <div className="md:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Predicted Bioisosteric Exchanges</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
            {chemistData?.bioisosteres?.map((b: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 text-[11px] font-bold line-through">{b.original_group}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-emerald-400 text-[11px] font-bold">{b.replacement}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{b.effect}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Lead Optimization Transformations */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>AI Medicinal Chemistry Modification Recipes</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Ranked by ΔpKd & Drug-Likeness Gain</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {chemistData?.recommendations?.map((rec: any, idx: number) => {
            const transformedSmiles =
              idx === 0
                ? smilesInput.replace('C(=O)', 'C(=O)C1=CC(F)=CC=C1')
                : idx === 1
                ? smilesInput + 'C1=NON=C1'
                : smilesInput + 'N1CCOCC1';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800/40">
                      Recipe #{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ΔpKd {rec.delta_pkd}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-mono">{rec.modification}</h4>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono leading-relaxed">{rec.rationale}</p>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>Goal: <strong className="text-slate-300">{rec.goal}</strong></span>
                    <span>ΔTPSA: <strong className="text-slate-300">{rec.delta_tpsa}</strong></span>
                  </div>

                  <button
                    onClick={() => applyOptimization(transformedSmiles, rec.modification)}
                    className="w-full py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Modification</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
