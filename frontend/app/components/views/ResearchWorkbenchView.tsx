'use client';

import React, { useState } from 'react';
import { Dna, Layers, Activity, FlaskConical, RefreshCw, Factory, ShieldCheck, FileText, Zap } from 'lucide-react';
import { useTab } from '../../TabContext';
import { aetherApi } from '../../lib/api';
import { PageHeader, MetricCard, LoadingState, ApiError } from '../shared';

const MODULES = [
  { id: 'precision', label: 'Precision Medicine', icon: Dna, run: (s: string, t: string, extra: any) => aetherApi.precisionMedicine(extra.mutations?.split(',').map((m:string)=>m.trim()).filter(Boolean) ?? ['L858R'], extra.biomarkers?.split(',').map((m:string)=>m.trim()), extra.disease) },
  { id: 'omics', label: 'Multi-Omics', icon: Layers, run: (_s: string, _t: string, extra: any) => aetherApi.multiOmics(extra.disease) },
  { id: 'dynamics', label: 'Protein Dynamics', icon: Activity, run: (_s: string, t: string, extra: any) => aetherApi.proteinDynamics(extra.pdb || t) },
  { id: 'md', label: 'Molecular Dynamics', icon: FlaskConical, run: (s: string, t: string) => aetherApi.molecularDynamics(s, t) },
  { id: 'medchem', label: 'Medicinal Chemist', icon: Zap, run: (s: string, t: string) => aetherApi.medicinalChemist(s, t) },
  { id: 'repurpose', label: 'Drug Repurposing', icon: RefreshCw, run: (_s: string, _t: string, extra: any) => aetherApi.repurposing(extra.drugName) },
  { id: 'manufacturing', label: 'Manufacturing', icon: Factory, run: (s: string) => aetherApi.manufacturing(s) },
  { id: 'clinical', label: 'Clinical Risk', icon: ShieldCheck, run: (s: string, t: string) => aetherApi.clinicalRisk(s, t) },
  { id: 'regulatory', label: 'Regulatory Report', icon: FileText, run: (s: string, t: string) => aetherApi.regulatoryReport(s, t) },
] as const;

export default function ResearchWorkbenchView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [active, setActive] = useState<typeof MODULES[number]['id']>('precision');
  const [target, setTarget] = useState('EGFR');
  const [disease, setDisease] = useState('NSCLC');
  const [mutations, setMutations] = useState('L858R, T790M');
  const [biomarkers, setBiomarkers] = useState('EGFR, PD-L1');
  const [drugName, setDrugName] = useState('Metformin');
  const [pdb, setPdb] = useState('1M17');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const mod = MODULES.find(m => m.id === active)!;

  const run = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await mod.run(smilesInput, target, { disease, mutations, biomarkers, drugName, pdb });
      setResult(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const renderResult = () => {
    if (!result) return null;
    const entries = Object.entries(result).filter(([k]) => !['smiles','target'].includes(k));
    return (
      <div className="flex flex-col gap-4">
        {result.compound_name && <MetricCard label="Compound" value={result.compound_name} />}
        {result.drug_ranking && (
          <div className="border border-aether-border rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-aether-bg2 text-aether-muted uppercase text-[9px]"><tr><th className="p-2 text-left">Rank</th><th className="p-2 text-left">Drug</th><th className="p-2">pKd</th><th className="p-2">Efficacy</th></tr></thead>
              <tbody>
                {result.drug_ranking.map((d: any, i: number) => (
                  <tr key={d.name} className="border-t border-aether-border/50">
                    <td className="p-2 font-scientific">{i + 1}</td>
                    <td className="p-2 text-white">{d.name}</td>
                    <td className="p-2 font-scientific text-aether-primary">{d.pKd}</td>
                    <td className="p-2 font-scientific">{d.efficacy_pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {result.recommendations && result.recommendations.map((r: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-aether-bg border border-aether-border text-xs">
            <span className="text-aether-primary font-bold">{r.modification}</span>
            <p className="text-aether-muted mt-1">{r.rationale}</p>
            <span className="text-[10px] text-aether-secondary">Goal: {r.goal}</span>
          </div>
        ))}
        {result.new_targets && result.new_targets.map((t: any, i: number) => (
          <div key={i} className="flex justify-between text-xs p-2 border-b border-aether-border/40">
            <span className="text-white">{t.disease}</span>
            <span className="font-scientific text-aether-accent">{(t.confidence * 100).toFixed(0)}%</span>
          </div>
        ))}
        {result.trajectory && (
          <div className="grid grid-cols-4 gap-2">
            {result.trajectory.slice(0, 8).map((f: any) => (
              <div key={f.frame} className="p-2 rounded bg-aether-bg border border-aether-border text-[10px]">
                <div className="text-aether-muted">F{f.frame}</div>
                <div className="font-scientific text-white">{f.pocket_volume_angstrom3} Å³</div>
                <div className="text-aether-secondary">{f.state}</div>
              </div>
            ))}
          </div>
        )}
        {result.pathway_analysis && result.pathway_analysis.map((p: any) => (
          <div key={p.pathway} className="flex justify-between text-xs">
            <span className="text-white">{p.pathway}</span>
            <span className="font-scientific text-aether-primary">enrich {p.enrichment}</span>
          </div>
        ))}
        {result.sections && (
          <div className="p-4 rounded-xl bg-aether-bg border border-aether-border text-xs text-aether-muted leading-relaxed">
            <p className="text-white font-bold mb-2">Report {result.report_id}</p>
            <p>{result.sections.executive_summary}</p>
          </div>
        )}
        <details className="text-[10px]">
          <summary className="text-aether-muted cursor-pointer uppercase font-bold tracking-wider">Raw API Response</summary>
          <pre className="mt-2 p-3 rounded-lg bg-aether-bg border border-aether-border font-scientific text-aether-primary overflow-x-auto max-h-64">{JSON.stringify(result, null, 2)}</pre>
        </details>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<FlaskConical className="text-aether-primary" size={22} />} title="Research Workbench" subtitle="Precision medicine, multi-omics, dynamics, medicinal chemistry, repurposing, manufacturing, and clinical risk — all connected to live /v1 endpoints." badge="No Mock Data" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-3 flex flex-col gap-1">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <button key={m.id} onClick={() => { setActive(m.id); setResult(null); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-xs font-semibold transition-colors ${active === m.id ? 'bg-aether-primary/15 text-aether-primary border border-aether-primary/30' : 'text-aether-muted hover:text-white hover:bg-aether-bg2'}`}>
                <Icon size={14} /> {m.label}
              </button>
            );
          })}
        </div>

        <div className="xl:col-span-4 border border-aether-border rounded-xl p-5 bg-aether-bg2 flex flex-col gap-3">
          <h3 className="font-display font-bold text-sm text-white">{mod.label} — Inputs</h3>
          {!['repurpose','omics','dynamics'].includes(active) && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">SMILES</label>
              <input value={smilesInput} onChange={e => setSmilesInput(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific text-white" />
            </>
          )}
          {!['repurpose','omics','manufacturing'].includes(active) && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">Target</label>
              <input value={target} onChange={e => setTarget(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white" />
            </>
          )}
          {active === 'precision' && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">Mutations (comma-separated)</label>
              <input value={mutations} onChange={e => setMutations(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific text-white" />
              <label className="text-[9px] text-aether-muted uppercase font-bold">Biomarkers</label>
              <input value={biomarkers} onChange={e => setBiomarkers(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white" />
              <label className="text-[9px] text-aether-muted uppercase font-bold">Disease</label>
              <input value={disease} onChange={e => setDisease(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white" />
            </>
          )}
          {active === 'omics' && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">Disease Context</label>
              <input value={disease} onChange={e => setDisease(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white" />
            </>
          )}
          {active === 'dynamics' && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">PDB ID</label>
              <input value={pdb} onChange={e => setPdb(e.target.value.toUpperCase())} maxLength={4} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific uppercase text-white" />
            </>
          )}
          {active === 'repurpose' && (
            <>
              <label className="text-[9px] text-aether-muted uppercase font-bold">Existing Drug Name</label>
              <input value={drugName} onChange={e => setDrugName(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white" />
            </>
          )}
          <button onClick={run} disabled={loading} className="mt-2 py-3 rounded-lg bg-aether-primary text-aether-bg font-bold text-xs disabled:opacity-50">
            {loading ? 'Querying API...' : `Run ${mod.label}`}
          </button>
        </div>

        <div className="xl:col-span-5 border border-aether-border rounded-xl p-5 bg-aether-bg flex flex-col gap-3 min-h-[400px]">
          <h3 className="font-display font-bold text-sm text-white">Results</h3>
          {loading && <LoadingState message={`Calling /v1/${active === 'precision' ? 'precision-medicine' : active === 'md' ? 'molecular-dynamics' : active === 'medchem' ? 'medicinal-chemist' : active === 'clinical' ? 'clinical-risk' : active === 'regulatory' ? 'regulatory-report' : active === 'omics' ? 'multi-omics' : active === 'dynamics' ? 'protein-dynamics' : active}...`} />}
          {error && <ApiError message={error} onRetry={run} />}
          {!loading && !error && !result && <p className="text-xs text-aether-muted">Configure inputs and run analysis. All outputs come from the FastAPI research engine with PubChem, RCSB PDB, and ClinicalTrials.gov data.</p>}
          {renderResult()}
        </div>
      </div>
    </div>
  );
}
