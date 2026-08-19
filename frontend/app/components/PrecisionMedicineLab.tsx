'use client';

import React, { useState, useEffect } from 'react';
import { fetchPrecisionMedicine } from '../lib/api';
import { Dna, ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Activity, RefreshCw, Zap, ArrowRight } from 'lucide-react';

const COMMON_MUTATIONS = [
  { id: 'T790M', gene: 'EGFR', type: 'Gatekeeper Resistance', severity: 'High', description: 'Steric clash preventing 1st-gen TKI binding.' },
  { id: 'L858R', gene: 'EGFR', type: 'Activating Mutation', severity: 'High', description: 'Destabilizes inactive kinase conformation.' },
  { id: 'C797S', gene: 'EGFR', type: 'Covalent Anchor Loss', severity: 'Critical', description: 'Abolishes covalent bonding with Osimertinib.' },
  { id: 'Exon19del', gene: 'EGFR', type: 'Driver Deletion', severity: 'High', description: 'Classic sensitivity marker for kinase inhibitors.' },
  { id: 'G12C', gene: 'KRAS', type: 'Driver Oncogene', severity: 'Critical', description: 'Locks KRAS in GTP-bound constitutively active state.' },
  { id: 'V600E', gene: 'BRAF', type: 'Kinase Domain', severity: 'High', description: 'Monomeric activation bypassing RAS signaling.' }
];

export default function PrecisionMedicineLab() {
  const [selectedMutations, setSelectedMutations] = useState<string[]>(['L858R', 'T790M']);
  const [disease, setDisease] = useState('Non-Small Cell Lung Cancer (NSCLC)');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await fetchPrecisionMedicine(selectedMutations, ['EGFR', 'TP53', 'MET'], disease);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [selectedMutations]);

  const toggleMutation = (mId: string) => {
    setSelectedMutations(prev =>
      prev.includes(mId) ? (prev.length > 1 ? prev.filter(m => m !== mId) : prev) : [...prev, mId]
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                CLINICAL GENOMICS ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">v10-PRECISION</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Dna className="w-6 h-6 text-cyan-400" />
              <span>Precision Medicine & Mutation Escape Lab</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Simulate patient-specific oncogenic mutations, quantify structural resistance ($\Delta\Delta G$), and identify targeted rescue therapies.
            </p>
          </div>

          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.3)] shrink-0 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Simulating Profiling...' : 'Re-calculate Therapy Response'}</span>
          </button>
        </div>
      </div>

      {/* Mutation Selector & Patient Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Patient Genomic Profile</span>
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">PATIENT #ATH-9481</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase">Tumor Type / Indication</label>
            <select
              value={disease}
              onChange={e => setDisease(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="Non-Small Cell Lung Cancer (NSCLC)">Non-Small Cell Lung Cancer (NSCLC)</option>
              <option value="Glioblastoma Multiforme (GBM)">Glioblastoma Multiforme (GBM)</option>
              <option value="Colorectal Carcinoma (CRC)">Colorectal Carcinoma (CRC)</option>
              <option value="Cutaneous Melanoma">Cutaneous Melanoma</option>
            </select>
          </div>

          <div className="flex flex-col gap-2.5 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Select Target Mutations</label>
              <span className="text-[10px] text-slate-500 font-mono">{selectedMutations.length} Active</span>
            </div>

            <div className="flex flex-col gap-2">
              {COMMON_MUTATIONS.map(m => {
                const isSelected = selectedMutations.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMutation(m.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-xs ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>
                          {m.gene} {m.id}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          m.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800/40' : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                        }`}>
                          {m.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">{m.description}</p>
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-500 border-cyan-400' : 'border-slate-700'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Therapy Response & Ranking */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Top Recommendation Box */}
          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">AI Personalized Recommendation</span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {result?.personalized_report?.recommended_therapy || 'Osimertinib 80mg Daily'}
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-1">
                  Predicted Response: <strong className="text-emerald-300">{result?.personalized_report?.predicted_response || 'High Efficacy'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300 shrink-0">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Resistance Risk: <strong className="text-emerald-400">Low (&lt;12%)</strong></span>
            </div>
          </div>

          {/* Drug Response Ranking Table */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Ranked Therapeutic Options for Current Genotype</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Ranked by Efficacy & Binding Affinity</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                    <th className="pb-2.5">Therapeutic Agent</th>
                    <th className="pb-2.5">Binding pKd</th>
                    <th className="pb-2.5">IC50 (nM)</th>
                    <th className="pb-2.5">Predicted Efficacy</th>
                    <th className="pb-2.5">Resistance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result?.drug_ranking?.map((drug: any, idx: number) => {
                    const isHighEfficacy = drug.efficacy_pct > 70;
                    const isResistant = drug.status === 'Resistant';
                    return (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{drug.name}</span>
                        </td>
                        <td className="py-3 text-cyan-300 font-bold">{drug.pKd}</td>
                        <td className="py-3 text-slate-300">{drug.ic50_nM} nM</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${isHighEfficacy ? 'bg-emerald-400' : isResistant ? 'bg-rose-500' : 'bg-amber-400'}`}
                                style={{ width: `${drug.efficacy_pct}%` }}
                              />
                            </div>
                            <span className={isHighEfficacy ? 'text-emerald-400 font-bold' : isResistant ? 'text-rose-400' : 'text-amber-400'}>
                              {drug.efficacy_pct}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            drug.status === 'Recommended'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : isResistant
                              ? 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                              : 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                          }`}>
                            {drug.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Surveillance & Monitoring Protocol */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-950/50 flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">Recommended Monitoring & Biomarker Surveillance</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
              {result?.personalized_report?.monitoring?.map((item: string, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
