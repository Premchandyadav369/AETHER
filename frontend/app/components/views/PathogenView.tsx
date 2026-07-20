'use client';

import React, { useState } from 'react';
import { ShieldAlert, Biohazard, Atom, Cloud, Bug, ChevronRight } from 'lucide-react';
import { useTab } from '../../TabContext';
import { aetherApi } from '../../lib/api';
import { PageHeader, MetricCard, FlowStep, LoadingState, ApiError } from '../shared';

const PATHOGENS = [
  { id: 'virus', label: 'Virus', icon: Biohazard, color: 'text-aether-danger', targets: ['Viral Protease', 'Viral Polymerase', 'Spike Protein', 'Envelope Protein'] },
  { id: 'bacteria', label: 'Bacteria', icon: Atom, color: 'text-aether-secondary', targets: ['Cell Wall Synthase', 'Ribosomal 30S', 'DNA Gyrase', 'Beta-lactamase'] },
  { id: 'fungi', label: 'Fungi', icon: Cloud, color: 'text-aether-accent', targets: ['Ergosterol Synthase', 'Chitin Synthase', 'Beta-glucan Synthase'] },
  { id: 'parasite', label: 'Parasite', icon: Bug, color: 'text-yellow-400', targets: ['Dihydrofolate Reductase', 'Microtubule Protein', 'Proteasome'] },
];

const ENTRY_ROUTES: Record<string, string[]> = {
  virus: ['Respiratory droplets', 'Mucosal surfaces', 'Blood-borne'],
  bacteria: ['Wound contamination', 'Food/water', 'Hospital-acquired'],
  fungi: ['Inhalation of spores', 'Skin contact', 'Immunocompromised host'],
  parasite: ['Vector bite', 'Contaminated water', 'Soil contact'],
};

export default function PathogenView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [pathogen, setPathogen] = useState('virus');
  const [protein, setProtein] = useState('Viral Protease');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const current = PATHOGENS.find(p => p.id === pathogen)!;

  const runScreening = async () => {
    setRunning(true);
    setError('');
    setResults(null);
    setStep(1);

    try {
      setStep(2);
      const interaction = await aetherApi.interaction(smilesInput, protein);
      setStep(3);
      const [safety, candidates, twin] = await Promise.all([
        aetherApi.safety(smilesInput, protein),
        aetherApi.discover(protein, pathogen),
        aetherApi.digitalTwin(smilesInput),
      ]);
      setResults({ interaction, safety, candidates, twin });
      setStep(5);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  const compartments = results?.twin?.journey?.map((j: any) => j.compartment).join(', ') ?? '—';
  const bindingPct = results ? Math.min(99, Math.round((results.interaction.affinity.pKd / 10) * 100)) : null;

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-16">
      <PageHeader
        icon={<ShieldAlert className="text-aether-danger" size={24} />}
        title="Foreign Body & Pathogen Simulation"
        subtitle="Pathogen targeting via /v1/interaction, /v1/agent/discover, and /v1/digital-twin PBPK compartments."
        badge="Live API"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-display font-bold text-sm text-white">Select Pathogen</h3>
          <div className="grid grid-cols-2 gap-3">
            {PATHOGENS.map(p => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => { setPathogen(p.id); setProtein(p.targets[0]); }}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all magnetic-target ${
                    pathogen === p.id
                      ? 'border-aether-danger/50 bg-aether-danger/10 shadow-neon-pink'
                      : 'border-aether-border hover:border-aether-danger/30'
                  }`}
                >
                  <Icon size={24} className={p.color} />
                  <span className="text-xs font-bold text-white">{p.label}</span>
                </button>
              );
            })}
          </div>

          <div>
            <h4 className="text-[9px] text-aether-muted uppercase tracking-wider font-bold mb-2">Entry Routes</h4>
            <div className="flex flex-col gap-1.5">
              {ENTRY_ROUTES[pathogen].map(route => (
                <div key={route} className="text-xs text-aether-muted px-3 py-2 rounded-lg bg-aether-bg border border-aether-border flex items-center gap-2">
                  <ChevronRight size={12} className="text-aether-danger" /> {route}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] text-aether-muted uppercase tracking-wider font-bold">Target Protein</label>
            <select
              value={protein}
              onChange={e => setProtein(e.target.value)}
              className="w-full mt-1.5 bg-aether-bg border border-aether-border rounded-lg p-3 text-xs text-white"
            >
              {current.targets.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[9px] text-aether-muted uppercase tracking-wider font-bold">Drug SMILES</label>
            <input
              value={smilesInput}
              onChange={e => setSmilesInput(e.target.value)}
              className="w-full mt-1.5 bg-aether-bg border border-aether-border rounded-lg p-3 text-xs font-scientific text-white"
            />
          </div>

          <button
            onClick={runScreening}
            disabled={running}
            className="w-full py-3 rounded-xl bg-aether-danger/80 text-white font-display font-bold text-sm disabled:opacity-50"
          >
            {running ? 'Screening...' : 'Run Drug Screening'}
          </button>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-white mb-4">Pathogen Workflow</h3>
            <div className="flex flex-wrap gap-2">
              {['Pathogen', 'Protein Selection', 'Drug Screening', 'Candidate Ranking', 'Toxicity Filter'].map((s, i) => (
                <FlowStep key={s} label={s} active={step === i + 1} done={step > i + 1} />
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h4 className="font-display font-bold text-xs text-aether-danger mb-4">PBPK Distribution Model</h4>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-aether-bg border border-aether-border">
                <span className="text-aether-muted">Compartments</span>
                <p className="text-white font-bold mt-1">{compartments}</p>
              </div>
              <div className="p-3 rounded-lg bg-aether-bg border border-aether-border">
                <span className="text-aether-muted">Toxicity Alerts</span>
                <p className="text-aether-secondary font-bold mt-1">{results?.twin?.toxicity_alerts?.join(', ') ?? 'Pending'}</p>
              </div>
              <div className="p-3 rounded-lg bg-aether-bg border border-aether-border">
                <span className="text-aether-muted">Clinical Trials Matched</span>
                <p className="text-aether-primary font-bold mt-1">{results?.candidates?.clinical_trials_matched?.length ?? 0}</p>
              </div>
            </div>
          </div>

          {error && <ApiError message={error} onRetry={runScreening} />}
          {running && !results && <LoadingState message="Running pathogen drug screening..." />}

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-5">
                <h4 className="font-display font-bold text-xs text-aether-primary mb-3">Binding to {protein}</h4>
                <MetricCard label="pKd" value={results.interaction.affinity.pKd} />
                <MetricCard label="Kd" value={results.interaction.affinity.Kd_nM} unit="nM" />
                {bindingPct != null && <MetricCard label="Relative Binding Strength" value={bindingPct} unit="%" />}
                <MetricCard label="Compound" value={results.interaction.compound_name ?? '—'} />
              </div>
              <div className="glass-panel rounded-2xl p-5">
                <h4 className="font-display font-bold text-xs text-aether-danger mb-3">Toxicity Filter</h4>
                <MetricCard label="Safety Score" value={results.safety.safety_score} unit="/100" />
                <MetricCard label="Risk Class" value={results.safety.risk_class} color={results.safety.risk_class === 'Low' ? 'text-aether-success' : 'text-aether-danger'} />
                <div className="mt-3">
                  <span className="text-[9px] text-aether-muted uppercase font-bold">Agent Candidates</span>
                  {results.candidates.candidates?.slice(0, 3).map((c: any) => (
                    <div key={c.id} className="flex justify-between text-xs mt-2">
                      <span className="font-scientific text-white">{c.id}</span>
                      <span className="text-aether-primary">pKd {c.pKd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
