'use client';

import React, { useState } from 'react';
import { FlaskConical, Beaker, TestTube, Microscope, Atom, ChevronRight, Zap } from 'lucide-react';
import { useTab } from '../../TabContext';
import { aetherApi } from '../../lib/api';
import { PageHeader, MetricCard, FlowStep, LoadingState, ApiError } from '../shared';

const LAB_STEPS = [
  'Molecular Validation',
  'Drug-likeness Analysis',
  'Toxicity Prediction',
  'Protein Targeting',
  'Binding Simulation',
  'Digital Twin Testing',
];

export default function DrugLabView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [target, setTarget] = useState('EGFR');
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const runLab = async () => {
    setRunning(true);
    setError('');
    setResults(null);
    setStep(0);

    try {
      setStep(1);
      const admet = await aetherApi.admet(smilesInput);
      setStep(2);
      const safety = await aetherApi.safety(smilesInput, target);
      setStep(3);
      const interaction = await aetherApi.interaction(smilesInput, target);
      setStep(4);
      const [quantum, twin, manufacturing] = await Promise.all([
        aetherApi.quantum(smilesInput, target),
        aetherApi.digitalTwin(smilesInput),
        aetherApi.manufacturing(smilesInput),
      ]);
      setStep(LAB_STEPS.length);
      setResults({ interaction, safety, quantum, twin, admet, manufacturing });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-16">
      <PageHeader
        icon={<FlaskConical className="text-aether-secondary" size={24} />}
        title="AI Drug Laboratory"
        subtitle="End-to-end virtual medicinal chemistry: validate, profile, target, simulate, and test candidates through the AETHER-RAMI research engine."
        badge="Live API"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-display font-bold text-sm text-aether-secondary uppercase tracking-wider">Create Molecule</h3>

          <div>
            <label className="text-[9px] text-aether-muted uppercase tracking-wider font-bold">SMILES Structure</label>
            <input
              value={smilesInput}
              onChange={e => setSmilesInput(e.target.value)}
              className="w-full mt-1.5 bg-aether-bg border border-aether-border rounded-lg p-3 text-xs font-scientific text-white focus:outline-none focus:border-aether-primary/50"
              placeholder="Enter SMILES..."
            />
          </div>

          <div>
            <label className="text-[9px] text-aether-muted uppercase tracking-wider font-bold">Protein Target</label>
            <select
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full mt-1.5 bg-aether-bg border border-aether-border rounded-lg p-3 text-xs text-white focus:outline-none"
            >
              {['EGFR', 'BRAF', 'CDK2', 'HIV Protease', 'AChE', 'HER2', 'KRAS'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button
            onClick={runLab}
            disabled={running}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-aether-secondary/80 to-aether-primary/80 text-aether-bg font-display font-bold text-sm transition-all shadow-neon-green disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {running ? 'Running Lab Protocol...' : 'Run Full Lab Protocol'}
            <Beaker size={16} />
          </button>

          <div className="border-t border-aether-border pt-4 flex flex-col gap-3">
            <h4 className="font-display font-bold text-xs text-aether-accent flex items-center gap-2">
              <TestTube size={14} /> Synthesis Planner
            </h4>
            {results?.manufacturing ? (
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between"><span className="text-aether-muted">Synthetic Accessibility</span><span className="font-scientific text-white">{results.manufacturing.synthetic_accessibility}</span></div>
                <div className="flex justify-between"><span className="text-aether-muted">Complexity</span><span className="text-aether-secondary font-bold">{results.manufacturing.manufacturing_complexity}</span></div>
                <div className="flex justify-between"><span className="text-aether-muted">Viability Score</span><span className="font-scientific text-aether-primary">{results.manufacturing.industrial_viability_score}/100</span></div>
              </div>
            ) : (
              <p className="text-[10px] text-aether-muted">Run lab protocol to query /v1/manufacturing</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-white mb-4">Lab Workflow</h3>
            <div className="flex flex-wrap gap-2">
              {LAB_STEPS.map((s, i) => (
                <FlowStep key={s} label={s} active={step === i} done={step > i} />
              ))}
            </div>

            {running && step >= 0 && (
              <div className="mt-4 flex items-center gap-2 text-xs text-aether-primary">
                <Microscope size={14} className="animate-pulse" />
                <span className="font-scientific">{LAB_STEPS[Math.min(step, LAB_STEPS.length - 1)]}...</span>
              </div>
            )}
          </div>

          {error && <ApiError message={error} onRetry={runLab} />}
          {running && !results && !error && <LoadingState message="Executing virtual wet lab protocol via FastAPI..." />}
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-display font-bold text-xs text-aether-primary flex items-center gap-2">
                  <Atom size={14} /> Binding Simulation
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="pKd" value={results.interaction.affinity.pKd} />
                  <MetricCard label="Kd" value={results.interaction.affinity.Kd_nM} unit="nM" />
                  <MetricCard label="Ki" value={results.interaction.affinity.Ki_nM} unit="nM" color="text-aether-secondary" />
                  <MetricCard label="IC50" value={results.interaction.affinity.IC50_nM} unit="nM" color="text-aether-accent" />
                </div>
                <div className="text-[10px] text-aether-muted">
                  Compound: {results.interaction.compound_name} · Hotspots: {results.interaction.binding_hotspots.join(', ')}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-display font-bold text-xs text-aether-danger flex items-center gap-2">
                  <TestTube size={14} /> Toxicity Profile
                </h4>
                <MetricCard label="Safety Score" value={results.safety.safety_score} unit="/100" color="text-aether-secondary" />
                <MetricCard label="Risk Class" value={results.safety.risk_class} color={results.safety.risk_class === 'Low' ? 'text-aether-success' : 'text-aether-danger'} />
              </div>

              <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-display font-bold text-xs text-aether-accent flex items-center gap-2">
                  <Zap size={14} /> Quantum Descriptors
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="HOMO" value={results.quantum.HOMO_eV} unit="eV" color="text-aether-accent" />
                  <MetricCard label="LUMO" value={results.quantum.LUMO_eV} unit="eV" color="text-aether-accent" />
                  <MetricCard label="Energy Gap" value={results.quantum.energy_gap_eV} unit="eV" />
                  <MetricCard label="Dipole" value={results.quantum.dipole_moment_debye} unit="D" />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
                <h4 className="font-display font-bold text-xs text-aether-primary">Virtual Wet Lab — Drug Journey</h4>
                <div className="flex items-center gap-1 flex-wrap text-[10px] font-bold">
                  {results.twin.journey?.map((j: any, i: number) => (
                    <React.Fragment key={j.compartment}>
                      <span className="px-2 py-1 rounded bg-aether-primary/10 text-aether-primary border border-aether-primary/20">{j.compartment}</span>
                      {i < results.twin.journey.length - 1 && <ChevronRight size={12} className="text-aether-muted" />}
                    </React.Fragment>
                  ))}
                </div>
                <MetricCard label="Target Engagement" value={results.twin.pkpd.target_engagement_pct} unit="%" />
                <MetricCard label="Cmax" value={results.twin.pkpd.cmax_nM} unit="nM" />
                <MetricCard label="Half-life" value={results.twin.pkpd.half_life_hr} unit="hr" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
