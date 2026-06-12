'use client';

import React, { useState } from 'react';
import {
  Dna, Layers, Activity, FlaskConical, RefreshCw, Network, Factory,
  ShieldCheck, User, HelpCircle, Globe, Sparkles, Brain, Microscope,
  BarChart3, FileText, Target, Atom, ChevronRight, Zap
} from 'lucide-react';
import { useTab, Tab } from '../../TabContext';
import { PageHeader } from '../shared';

const FEATURES = [
  {
    id: 1, title: 'Precision Medicine Engine', icon: Dna, color: 'text-aether-primary', status: 'Live API',
    tab: 'cancer' as Tab,
    desc: 'Upload mutation profiles and biomarkers to rank patient-specific drug candidates with resistance probability.',
    inputs: ['Mutation lists', 'Gene expression', 'Cancer biomarkers', 'Clinical metadata'],
    outputs: ['Drug ranking', 'Predicted efficacy', 'Resistance probability', 'Personalized treatment report'],
    endpoint: '/v1/precision-medicine',
  },
  {
    id: 2, title: 'Multi-Omics Foundation Model', icon: Layers, color: 'text-aether-accent', status: 'Live API',
    tab: 'dashboard' as Tab,
    desc: 'Unifies proteomics, genomics, transcriptomics, metabolomics, and molecular structures into one representation space.',
    inputs: ['Disease context', 'Omics modalities'],
    outputs: ['Pathway analysis', 'Biomarker discovery', 'Drug response prediction'],
    endpoint: '/v1/multi-omics',
  },
  {
    id: 3, title: 'Real Protein Dynamics Engine', icon: Activity, color: 'text-aether-secondary', status: 'Live API',
    tab: 'proteins' as Tab,
    desc: 'Normal Mode Analysis surrogate for pocket opening, closing, flexibility, and binding-site evolution.',
    inputs: ['PDB ID'],
    outputs: ['Pocket dynamics', 'RMSF trajectories', 'Flexibility scores'],
    endpoint: '/v1/protein-dynamics',
  },
  {
    id: 4, title: 'Molecular Dynamics Workflow', icon: FlaskConical, color: 'text-aether-primary', status: 'Live API',
    tab: 'engine' as Tab,
    desc: 'Simulates drug + protein over time with RMSD, RMSF, binding stability, and free-energy estimates.',
    inputs: ['SMILES', 'Protein target'],
    outputs: ['RMSD', 'RMSF', 'Binding stability', 'ΔG estimates'],
    endpoint: '/v1/molecular-dynamics',
  },
  {
    id: 5, title: 'AI Medicinal Chemist', icon: Atom, color: 'text-aether-secondary', status: 'Live API',
    tab: 'druglab' as Tab,
    desc: 'Recommends functional-group modifications for affinity, solubility, toxicity, and BBB improvements.',
    inputs: ['SMILES', 'Target protein'],
    outputs: ['Modification suggestions', 'Predicted property deltas', 'Rationale'],
    endpoint: '/v1/medicinal-chemist',
  },
  {
    id: 6, title: 'Drug Repurposing Engine', icon: RefreshCw, color: 'text-aether-accent', status: 'Live API',
    tab: 'molecules' as Tab,
    desc: 'Discover new disease targets for existing approved drugs like Metformin.',
    inputs: ['Drug name'],
    outputs: ['New targets', 'Pathway hypotheses', 'Confidence scores'],
    endpoint: '/v1/repurposing',
  },
  {
    id: 7, title: 'Disease Knowledge Graph', icon: Network, color: 'text-aether-primary', status: 'Interactive',
    tab: 'knowledge' as Tab,
    desc: 'Drug ↔ Protein ↔ Disease ↔ Pathway ↔ Organ ↔ Gene connected graph with interactive exploration.',
    inputs: ['Graph query'],
    outputs: ['Connected entities', 'Relationship types', 'Galaxy visualization'],
    endpoint: '/v1/disease-graph',
  },
  {
    id: 8, title: 'Autonomous Research Agent', icon: Brain, color: 'text-aether-danger', status: 'Live API',
    tab: 'pipeline' as Tab,
    desc: 'Goal-driven AI scientist: search databases, screen molecules, predict affinity, evaluate toxicity, generate reports.',
    inputs: ['Target', 'Disease'],
    outputs: ['Ranked candidates', 'Agent steps', 'Discovery report'],
    endpoint: '/v1/agent/discover',
  },
  {
    id: 9, title: 'Drug Manufacturing Readiness', icon: Factory, color: 'text-yellow-400', status: 'Live API',
    tab: 'druglab' as Tab,
    desc: 'Evaluates synthetic accessibility, scale-up feasibility, cost estimation, and industrial viability.',
    inputs: ['SMILES'],
    outputs: ['SAS score', 'Manufacturing complexity', 'Cost/kg', 'Viability score'],
    endpoint: '/v1/manufacturing',
  },
  {
    id: 10, title: 'Clinical Trial Risk Engine', icon: ShieldCheck, color: 'text-aether-danger', status: 'Live API',
    tab: 'engine' as Tab,
    desc: 'Predicts safety concerns, trial failure probability, and adverse-event risk with clinical readiness scoring.',
    inputs: ['SMILES', 'Target'],
    outputs: ['Readiness score', 'Failure probability', 'Phase recommendation'],
    endpoint: '/v1/clinical-risk',
  },
  {
    id: 11, title: 'Digital Human Twin', icon: User, color: 'text-aether-primary', status: 'Live API',
    tab: 'digitaltwin' as Tab,
    desc: 'Medical-grade wireframe with organ models, PK/PD simulation, and drug journey visualization.',
    inputs: ['SMILES', 'Route of administration'],
    outputs: ['Organ concentrations', 'Target engagement', 'Toxicity alerts'],
    endpoint: '/v1/digital-twin',
  },
  {
    id: 12, title: 'Explainable AI Center', icon: HelpCircle, color: 'text-aether-accent', status: 'Live API',
    tab: 'explain' as Tab,
    desc: 'Every prediction answers: Why? Which atoms? Which residues? How confident? What to change?',
    inputs: ['SMILES', 'Target'],
    outputs: ['SHAP values', 'Atom importance', 'Cross-attention maps', 'Confidence intervals'],
    endpoint: '/v1/explain',
  },
  {
    id: 13, title: 'Global Drug Intelligence', icon: Globe, color: 'text-aether-secondary', status: 'Live API',
    tab: 'developer' as Tab,
    desc: 'Queries ClinicalTrials.gov, PubChem, ChEMBL, DrugBank, UniProt, and PDB for live biomedical data.',
    inputs: ['Search query'],
    outputs: ['Compounds', 'Proteins', 'Trials', 'Structures'],
    endpoint: '/v1/intelligence',
  },
  {
    id: 14, title: 'Molecular Generator', icon: Sparkles, color: 'text-aether-primary', status: 'Live API',
    tab: 'engine' as Tab,
    desc: 'Generate molecules conditioned on target protein, affinity, toxicity limits, and BBB requirements.',
    inputs: ['Protein target', 'Disease', 'Property constraints'],
    outputs: ['Novel SMILES candidates', 'QED', 'Toxicity risk'],
    endpoint: '/v1/generate',
  },
  {
    id: 15, title: 'Scientific Copilot', icon: Brain, color: 'text-aether-accent', status: 'K2-Think-v2',
    tab: 'copilot' as Tab,
    desc: 'Grounded AI assistant citing model outputs, database results, and retrieved evidence only.',
    inputs: ['Natural language queries'],
    outputs: ['Explained predictions', 'Comparisons', 'Analog suggestions'],
    endpoint: '/api/chat',
  },
  {
    id: 16, title: 'Interactive Scientific Workspace', icon: Microscope, color: 'text-aether-primary', status: '3Dmol + Plotly',
    tab: 'workspace' as Tab,
    desc: '3D proteins, molecular structures, attention maps, embedding spaces, and drug-target networks.',
    inputs: ['PDB structures', 'SMILES'],
    outputs: ['Interactive 3D viewers', 'Surface rendering', 'Network graphs'],
    endpoint: 'visualizations/',
  },
  {
    id: 17, title: 'Benchmarking Arena', icon: BarChart3, color: 'text-aether-secondary', status: 'Live API',
    tab: 'dashboard' as Tab,
    desc: 'Compare AETHER-RAMI against GraphCL, GCN, GAT, ChemBERTa, MolFormer, and ESM baselines.',
    inputs: ['Benchmark datasets'],
    outputs: ['ROC-AUC', 'RMSE', 'F1 comparisons'],
    endpoint: '/v1/benchmarking',
  },
  {
    id: 18, title: 'Regulatory Readiness Suite', icon: FileText, color: 'text-aether-danger', status: 'Live API',
    tab: 'developer' as Tab,
    desc: 'Generates PDF-ready reports with experimental summaries, explainability, and safety analyses.',
    inputs: ['SMILES', 'Target'],
    outputs: ['Regulatory report', 'Export formats', 'Recommendations'],
    endpoint: '/v1/regulatory-report',
  },
];

export default function FeaturesView() {
  const { setActiveTab } = useTab();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(1);

  const filtered = filter === 'all' ? FEATURES : FEATURES.filter(f => f.status.includes(filter) || f.status === filter);

  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-16">
      <PageHeader
        icon={<Target className="text-aether-primary" size={24} />}
        title="Platform Features"
        subtitle="AETHER-RAMI V7 — AI-powered drug discovery and precision medicine operating system. 18 research-grade capabilities unified in one scientific platform."
        badge="Capstone Grade"
      />

      <div className="glass-panel rounded-2xl p-6 border border-aether-primary/20">
        <blockquote className="text-sm text-aether-muted leading-relaxed border-l-2 border-aether-primary pl-4">
          <strong className="text-white">Positioning:</strong> AETHER-RAMI is an AI-powered drug discovery and precision medicine operating system that unifies molecular foundation models, protein intelligence, explainable drug-target interaction prediction, digital human twins, autonomous research agents, and real-world biomedical knowledge into a single scientific platform.
        </blockquote>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'Live API', 'Interactive', 'K2-Think-v2', '3Dmol'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all magnetic-target ${
              filter === f ? 'bg-aether-primary/20 border border-aether-primary/40 text-aether-primary' : 'glass-panel text-aether-muted hover:text-white'
            }`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(feature => {
          const Icon = feature.icon;
          const isOpen = expanded === feature.id;
          return (
            <div key={feature.id}
              className={`glass-panel-interactive magnetic-target rounded-2xl overflow-hidden transition-all ${isOpen ? 'border-aether-primary/30 shadow-neon' : ''}`}>
              <button className="w-full p-5 text-left flex items-start gap-4" onClick={() => setExpanded(isOpen ? null : feature.id)}>
                <div className={`w-10 h-10 rounded-xl bg-aether-bg border border-aether-border flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-scientific text-[10px] text-aether-muted">#{feature.id}</span>
                    <h3 className="font-display font-bold text-sm text-white">{feature.title}</h3>
                    <span className="badge-api text-[8px] px-1.5 py-0.5 rounded font-bold">{feature.status}</span>
                  </div>
                  <p className="text-[11px] text-aether-muted mt-1 leading-relaxed">{feature.desc}</p>
                </div>
                <ChevronRight size={16} className={`text-aether-muted transition-transform flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-aether-border pt-4 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] text-aether-muted uppercase font-bold">Inputs</span>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {feature.inputs.map(i => <li key={i} className="text-[10px] text-aether-text">• {i}</li>)}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[9px] text-aether-muted uppercase font-bold">Outputs</span>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {feature.outputs.map(o => <li key={o} className="text-[10px] text-aether-secondary">• {o}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <code className="font-scientific text-[9px] text-aether-primary bg-aether-bg px-2 py-1 rounded">{feature.endpoint}</code>
                    <button onClick={() => setActiveTab(feature.tab)}
                      className="px-3 py-1.5 rounded-lg bg-aether-primary/20 border border-aether-primary/30 text-aether-primary text-[10px] font-bold flex items-center gap-1 magnetic-target">
                      Open Module <Zap size={10} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
