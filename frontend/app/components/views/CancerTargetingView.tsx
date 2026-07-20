'use client';

import React, { useState } from 'react';
import { Heart, Dna, Target } from 'lucide-react';
import { useTab } from '../../TabContext';
import { aetherApi } from '../../lib/api';
import { PageHeader, MetricCard, FlowStep, LoadingState, ApiError } from '../shared';
import ProteinViewer from '../viewer/ProteinViewer';

const CANCER_TARGETS = [
  { id: 'EGFR', pdb: '1M17', mutation: 'L858R, T790M', type: 'NSCLC', color: '#00E5FF' },
  { id: 'BRAF', pdb: '1UWH', mutation: 'V600E', type: 'Melanoma', color: '#6EE7B7' },
  { id: 'KRAS', pdb: '4OBE', mutation: 'G12C, G12D', type: 'Pancreatic', color: '#8B5CF6' },
  { id: 'HER2', pdb: '1N8Z', mutation: 'Amplification', type: 'Breast', color: '#FF4D6D' },
  { id: 'CDK2', pdb: '1HCK', mutation: 'Overexpression', type: 'Multi-cancer', color: '#f59e0b' },
];

export default function CancerTargetingView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [target, setTarget] = useState(CANCER_TARGETS[0]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [precision, setPrecision] = useState<any>(null);

  const runSimulation = async () => {
    setRunning(true);
    setError('');
    setResults(null);
    setPrecision(null);
    setStep(1);

    const mutations = target.mutation.split(/[\/,]/).map(m => m.trim()).filter(Boolean);
    try {
      setStep(2);
      const interaction = await aetherApi.interaction(smilesInput, target.id);
      setStep(3);
      const [safety, proteinData, precisionData, clinical] = await Promise.all([
        aetherApi.safety(smilesInput, target.id),
        aetherApi.proteinAnalysis(target.pdb),
        aetherApi.precisionMedicine(mutations, ['EGFR', 'PD-L1'], target.type),
        aetherApi.clinicalRisk(smilesInput, target.id),
      ]);

      setResults({ interaction, safety, clinical });
      setAnalysis(proteinData);
      setPrecision(precisionData);
      setStep(4);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  const topEfficacy = precision?.drug_ranking?.[0]?.efficacy_pct;

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-16">
      <PageHeader
        icon={<Heart className="text-aether-danger" size={24} />}
        title="Cancer Targeting Module"
        subtitle="Oncology drug-target simulation wired to /v1/interaction, /v1/protein-analysis, /v1/precision-medicine, and /v1/clinical-risk."
        badge="Oncology"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="font-display font-bold text-sm text-white">Oncology Targets</h3>
          {CANCER_TARGETS.map(t => (
            <button
              key={t.id}
              onClick={() => setTarget(t)}
              className={`p-4 rounded-xl border text-left transition-all magnetic-target ${
                target.id === t.id
                  ? 'border-aether-danger/50 bg-aether-danger/10 shadow-neon-pink'
                  : 'glass-panel hover:border-aether-danger/30'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-white">{t.id}</span>
                <span className="text-[10px] font-scientific px-2 py-0.5 rounded" style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}40` }}>
                  {t.pdb}
                </span>
              </div>
              <p className="text-[10px] text-aether-muted mt-1">{t.mutation} · {t.type}</p>
            </button>
          ))}

          <div className="glass-panel rounded-xl p-4">
            <label className="text-[9px] text-aether-muted uppercase font-bold">Drug SMILES</label>
            <input
              value={smilesInput}
              onChange={e => setSmilesInput(e.target.value)}
              className="w-full mt-1.5 bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific text-white"
            />
            <button
              onClick={runSimulation}
              disabled={running}
              className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-aether-danger/80 to-aether-accent/80 text-white font-display font-bold text-xs disabled:opacity-50"
            >
              {running ? 'Simulating...' : 'Run Cancer Simulation'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-white mb-4">Oncology Pipeline</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {['Tumor Cell', 'Protein Mutation', 'Drug Binding', 'Response Probability'].map((s, i) => (
                <FlowStep key={s} label={s} active={step === i + 1} done={step > i + 1} />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden min-h-[300px]">
            <div className="p-4 border-b border-aether-border flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-sm text-white">{target.id} Structure</h4>
                <p className="text-[10px] text-aether-muted">PDB: {target.pdb} · Mutation: {target.mutation}</p>
              </div>
              <span className="badge-live text-[9px] px-2 py-0.5 rounded font-bold">RCSB Live</span>
            </div>
            <div className="h-[280px]">
              <ProteinViewer pdbId={target.pdb} style="cartoon" colorBy="ss" className="w-full h-full" />
            </div>
          </div>

          {error && <ApiError message={error} onRetry={runSimulation} />}
          {running && !results && <LoadingState message="Running oncology binding simulation..." />}

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel rounded-2xl p-5">
                <h4 className="font-display font-bold text-xs text-aether-danger mb-3 flex items-center gap-2">
                  <Dna size={14} /> Mutation Impact
                </h4>
                {analysis?.mutation_impact?.map((m: any) => (
                  <div key={m.mutation} className="text-xs mb-2">
                    <span className="font-scientific text-white">{m.mutation}</span>
                    <span className="text-aether-muted ml-2">{m.delta_affinity}</span>
                    <p className="text-[10px] text-aether-muted">{m.interpretation}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-2xl p-5">
                <h4 className="font-display font-bold text-xs text-aether-primary mb-3 flex items-center gap-2">
                  <Target size={14} /> Drug Binding
                </h4>
                <MetricCard label="pKd" value={results.interaction.affinity.pKd} />
                <MetricCard label="Kd" value={results.interaction.affinity.Kd_nM} unit="nM" />
                <MetricCard label="Confidence" value={`${results.interaction.affinity.confidence_interval_pKd[0]}–${results.interaction.affinity.confidence_interval_pKd[1]}`} unit="pKd" color="text-aether-accent" />
              </div>

              <div className="glass-panel rounded-2xl p-5">
                <h4 className="font-display font-bold text-xs text-aether-secondary mb-3">Clinical Response</h4>
                {topEfficacy != null && (
                  <MetricCard label="Precision Medicine Efficacy" value={topEfficacy} unit="%" color="text-aether-secondary" />
                )}
                <MetricCard label="Clinical Readiness" value={results.clinical.clinical_readiness_score} unit="/100" />
                <MetricCard label="Trial Failure Risk" value={`${(results.clinical.trial_failure_probability * 100).toFixed(0)}%`} color="text-aether-accent" />
                <MetricCard label="Safety Score" value={results.safety.safety_score} unit="/100" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
