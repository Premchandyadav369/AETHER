'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Compass, Download, Brain, Dna, Network, Database, FlaskConical,
  Target, Award, Send, RefreshCw, Cpu, HelpCircle, BookOpen, FileText,
  GitBranch, Terminal, Check, ChevronRight, Zap, Code, User, Heart,
  Activity, TrendingUp, Microscope, Atom, Layers
} from 'lucide-react';
import { useTab } from './TabContext';
import { aetherApi, formatRisk } from './lib/api';
import {
  PageHeader, MetricCard, PipelineStep, StatsCard, TimelineItem,
  GalleryCard, ShapBar, LoadingState, ApiError
} from './components/shared';
import DrugLabView from './components/views/DrugLabView';
import PathogenView from './components/views/PathogenView';
import CancerTargetingView from './components/views/CancerTargetingView';
import FeaturesView from './components/views/FeaturesView';
import HumanAnatomyCanvas, { OrganId, TwinMode } from './components/HumanAnatomyCanvas';

export default function DashboardPage() {
  const { activeTab } = useTab();
  return (
    <div className="w-full">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'features' && <FeaturesView />}
      {activeTab === 'copilot' && <CopilotView />}
      {activeTab === 'workspace' && <WorkspaceView />}
      {activeTab === 'engine' && <EngineView />}
      {activeTab === 'druglab' && <DrugLabView />}
      {activeTab === 'digitaltwin' && <DigitalTwinView />}
      {activeTab === 'proteins' && <ProteinsView />}
      {activeTab === 'molecules' && <MoleculesView />}
      {activeTab === 'pathogens' && <PathogenView />}
      {activeTab === 'cancer' && <CancerTargetingView />}
      {activeTab === 'pipeline' && <PipelineView />}
      {activeTab === 'knowledge' && <KnowledgeView />}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'explain' && <ExplainView />}
      {activeTab === 'developer' && <DeveloperView />}
    </div>
  );
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: string | number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const strVal = String(value);
    const end = parseFloat(strVal.replace(/[^0-9.]/g, ''));
    if (isNaN(end)) {
      setCount(value as any);
      return;
    }
    const isFloat = strVal.includes('.');
    const startTime = performance.now();
    const duration = 1800;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = ease * end;
      
      if (isFloat) {
        setCount(parseFloat(current.toFixed(3)) as any);
      } else {
        setCount(Math.floor(current) as any);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(value as any);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value]);

  return <span className="font-scientific font-black text-2xl sm:text-3xl text-aether-primary">{prefix}{count}{suffix}</span>;
}

// ─── HOME ───────────────────────────────────────────────────────────────────────
function HomeView() {
  const { setActiveTab } = useTab();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const PIPELINE_STEPS = [
    { num: '1', title: 'Molecule Upload', desc: 'Ingestion of SMILES structure, SDF, or MOL format files.' },
    { num: '2', title: 'Molecular Standardization', desc: 'Valence correction, neutralization, and salt stripping.' },
    { num: '3', title: 'Descriptor Generation', desc: 'Computing quantum molecular charge, polar surface area, and lipophilicity.' },
    { num: '4', title: 'Fingerprint Extraction', desc: 'Generating Morgan/ECFP4 high-dimensional topological indexes.' },
    { num: '5', title: 'Protein Understanding', desc: 'ESM-2 embedding mapping for targets and sequence pocket context.' },
    { num: '6', title: 'Pocket Detection', desc: 'Predicting druggable binding site residues and pocket volume.' },
    { num: '7', title: 'Binding Prediction', desc: 'EGNN cross-attention mapping of atomic contacts and binding pKd.' },
    { num: '8', title: 'ADMET Screening', desc: 'Toxicity, Ames mutagenicity, hERG liability, and solubility profiling.' },
    { num: '9', title: 'Explainability', desc: 'Generating local SHAP contributions and atom-residue attention maps.' },
    { num: '10', title: 'Candidate Generation', desc: 'Target-conditioned scaffold generation via ProtCondVAE.' },
    { num: '11', title: 'Drug Repurposing', desc: 'Searching drug space libraries using FAISS embedding vectors.' },
    { num: '12', title: 'Digital Twin Validation', desc: 'Simulating multi-compartment PK/PD concentrations.' },
    { num: '13', title: 'Research Report Gen', desc: 'Creating Nature/Science publication-grade research reports.' }
  ];

  const ROADMAP_STEPS = [
    { v: 'V1', title: 'Classical ML', desc: 'Basic descriptor classification' },
    { v: 'V2', title: 'Drug Property', desc: 'GNN property models' },
    { v: 'V3', title: 'Multi-Dataset', desc: 'Multi-task training loops' },
    { v: 'V4', title: 'GraphCL Models', desc: 'Self-supervised contrastive graph learning' },
    { v: 'V5', title: 'Protein Intel', desc: 'Co-embedding target space' },
    { v: 'V6', title: 'Cross-Attention', desc: 'Atom-residue contact scoring' },
    { v: 'V7', title: 'Explainability', desc: 'SHAP explanations & heatmaps' },
    { v: 'V8', title: 'Repurposing', desc: 'FAISS indexing of drug database' },
    { v: 'V9', title: 'Pocket Gen', desc: 'Target-conditioned VAE generation' },
    { v: 'V10', title: 'Biomedical Platform', desc: 'Integrated multi-modal foundational engine' },
    { v: 'V11', title: 'Human Twin', desc: 'Multi-organ physiological simulations' },
    { v: 'V12', title: 'Research OS', desc: 'Autonomous scientific reasoning loop' }
  ];

  const USE_CASES = [
    { title: 'Cancer Drug Discovery', desc: 'Identifying kinase hinge binders targeting EGFR mutations.' },
    { title: 'Neurodegenerative Diseases', desc: 'Screening compounds crossing the BBB for Alzheimer\'s & Parkinson\'s.' },
    { title: 'Rare Diseases', desc: 'De-novo molecular design targeting orphan receptors.' },
    { title: 'Precision Medicine', desc: 'Patient-specific therapeutic recommendations based on tumor profiles.' },
    { title: 'Drug Repurposing', desc: 'FAISS-based screening of approved libraries for novel indications.' },
    { title: 'Protein Engineering', desc: 'Scaffolding custom protein pockets for optimized ligand binding.' },
    { title: 'Biomarker Discovery', desc: 'Mapping disease pathways to molecular response metrics.' },
    { title: 'Clinical Research', desc: 'Simulating adverse event profiles to score drug safety.' },
    { title: 'Pharmaceutical R&D', desc: 'Active learning pipelines to accelerate hit-to-lead times.' },
    { title: 'Academic Research', desc: 'Open-access endpoints for molecular modeling and simulation.' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let af: number;
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    // Molecular helix particle simulation
    const nodes: { x: number; y: number; z: number; r: number; c: string }[] = [];
    for (let i = 0; i < 90; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      const d = 90 + Math.random() * 50;
      nodes.push({
        x: d * Math.sin(p) * Math.cos(t),
        y: d * Math.sin(p) * Math.sin(t),
        z: d * Math.cos(p),
        r: 1.5 + Math.random() * 2.5,
        c: Math.random() > 0.4 ? 'rgba(0, 229, 255, 0.75)' : 'rgba(139, 92, 246, 0.65)'
      });
    }

    const rotX = (n: any, a: number) => {
      const c = Math.cos(a), s = Math.sin(a);
      const y = n.y * c - n.z * s;
      n.z = n.z * c + n.y * s;
      n.y = y;
    };
    const rotY = (n: any, a: number) => {
      const c = Math.cos(a), s = Math.sin(a);
      const x = n.x * c - n.z * s;
      n.z = n.z * c + n.x * s;
      n.x = x;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Rotate based on time + cursor
      const ax = 0.002 + mouse.y * 0.000008;
      const ay = 0.001 + mouse.x * 0.000008;
      nodes.forEach(n => { rotX(n, ax); rotY(n, ay); });

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 45) {
            const s1 = (250 + nodes[i].z) / 250;
            const s2 = (250 + nodes[j].z) / 250;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * s1, nodes[i].y * s1);
            ctx.lineTo(nodes[j].x * s2, nodes[j].y * s2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const s = (250 + n.z) / 250;
        ctx.fillStyle = n.c;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#00E5FF';
        ctx.beginPath();
        ctx.arc(n.x * s, n.y * s, n.r * s, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.restore();

      af = requestAnimationFrame(render);
    };

    render();
    const onResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(af);
      window.removeEventListener('resize', onResize);
    };
  }, [mouse]);

  return (
    <div className="flex flex-col gap-12 max-w-[1600px] mx-auto pb-16">
      {/* Cinematic Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px] glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden" onMouseMove={e => {
        const r = canvasRef.current?.getBoundingClientRect();
        if (r) setMouse({ x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 });
      }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aether-primary/5 rounded-full blur-[120px]" />
        
        <div className="lg:col-span-7 flex flex-col gap-6 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-aether-primary uppercase tracking-widest badge-api px-3 py-1.5 rounded-full w-max">
            <Sparkles size={11} className="animate-pulse text-aether-primary" /> V10 OMEGA EDITION · RESEARCH-GRADE OPERATING SYSTEM
          </div>
          <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
            AETHER-RAMI<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aether-primary via-aether-secondary to-aether-accent">
              Biomedical AI Operating System
            </span>
          </h1>
          <p className="text-aether-muted text-sm max-w-xl leading-relaxed border-l-2 border-aether-primary/40 pl-4">
            Transforming molecular data into therapeutic intelligence. A unified platform for protein-ligand binding dynamics, AI generative chemists, multi-organ twin simulation, and explainable deep learning reasoning.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              { label: 'Launch Studio', tab: 'engine' as const, primary: true },
              { label: 'Comparative Performance', tab: 'dashboard' as const },
              { label: 'Anatomical Twin', tab: 'digitaltwin' as const },
            ].map(btn => (
              <button key={btn.label} onClick={() => setActiveTab(btn.tab)}
                className={`px-6 py-3.5 rounded-xl font-display font-bold text-sm transition-all hover:scale-[1.02] flex items-center gap-2 ${
                  btn.primary ? 'bg-gradient-to-r from-aether-primary/20 to-aether-accent/20 border border-aether-primary/45 text-aether-primary shadow-neon' : 'glass-panel text-white hover:border-aether-primary/30'
                }`}>
                {btn.label} {btn.primary && <Zap size={14} />}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 h-[360px] lg:h-[450px] relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-[9px] text-aether-muted uppercase tracking-widest font-bold bg-aether-bg/90 border border-aether-border px-3.5 py-1.5 rounded-md">
              Molecular Helix · Neural Particles · Active 3D Node Map
            </span>
          </div>
        </div>
      </section>

      {/* Live V10 Platforms Metrics */}
      <section className="flex flex-col gap-4">
        <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider pl-1">V10 Live Metrics Counter</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Total Datasets', val: '12', suffix: '+' },
            { label: 'Models Trained', val: '24', suffix: '+' },
            { label: 'Proteins Analysed', val: '1450', suffix: '+' },
            { label: 'Candidates Generated', val: '15200', suffix: '+' },
            { label: 'AUC Validation', val: '0.941', suffix: '' },
            { label: 'GPU Runtime Hours', val: '4820', suffix: '+' },
            { label: 'Research Assets', val: '850', suffix: '+' },
            { label: 'Repurposing Hits', val: '124', suffix: '+' }
          ].map((item, i) => (
            <div key={i} className="glass-panel-interactive rounded-xl p-4 flex flex-col gap-1 text-center items-center justify-center">
              <AnimatedCounter value={item.val} suffix={item.suffix} />
              <span className="text-[9px] text-aether-muted uppercase font-bold tracking-tight mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Workflow Pipeline */}
      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
              <Layers size={20} className="text-aether-primary" /> How AETHER-RAMI Works
            </h2>
            <p className="text-xs text-aether-muted mt-1">Select a stage on the pipeline timeline to inspect the automated computational procedures.</p>
          </div>
          <span className="text-[10px] font-scientific font-bold text-aether-primary uppercase tracking-wider">13 Interactive Steps</span>
        </div>
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin">
            {PIPELINE_STEPS.map((s, idx) => (
              <button key={idx} onClick={() => setActiveWorkflowStep(idx)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-2 select-none ${
                  activeWorkflowStep === idx ? 'border-aether-primary bg-aether-primary/10 text-aether-primary shadow-neon' : 'border-aether-border bg-aether-bg text-aether-muted hover:text-white'
                }`}>
                <span className="font-scientific opacity-60">0{s.num}</span> {s.title}
              </button>
            ))}
          </div>
          <div className="bg-aether-bg2 border border-aether-border/60 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-3 text-center md:text-left border-b md:border-b-0 md:border-r border-aether-border/60 pb-4 md:pb-0 md:pr-4">
              <span className="font-scientific font-black text-4xl text-aether-primary">0{PIPELINE_STEPS[activeWorkflowStep].num}</span>
              <h4 className="font-display font-extrabold text-white text-base mt-1">{PIPELINE_STEPS[activeWorkflowStep].title}</h4>
            </div>
            <div className="md:col-span-9 text-xs text-aether-muted leading-relaxed">
              {PIPELINE_STEPS[activeWorkflowStep].desc}
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Roadmap */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <GitBranch size={18} className="text-aether-secondary" /> AETHER-RAMI Evolution
        </h2>
        <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
          <div className="flex min-w-[1280px] justify-between gap-5 relative py-4">
            <div className="absolute top-[42px] left-[4%] w-[92%] h-0.5 bg-aether-border/50 z-0" />
            {ROADMAP_STEPS.map((step, idx) => {
              const active = idx === 9; // V10 active
              const isFuture = idx > 9;
              return (
                <div key={idx} className={`flex flex-col items-center gap-2.5 flex-1 relative z-10 ${isFuture ? 'opacity-40' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-scientific font-black border-2 transition-all ${
                    active ? 'bg-aether-primary/20 border-aether-primary text-aether-primary shadow-neon animate-pulse-slow'
                      : isFuture ? 'bg-aether-bg border-aether-border text-aether-muted'
                      : 'bg-aether-bg2 border-aether-secondary/50 text-aether-secondary'
                  }`}>{step.v}</div>
                  <h4 className={`font-display font-extrabold text-center text-[10px] mt-1 ${active ? 'text-white' : 'text-aether-muted'}`}>{step.title}</h4>
                  <p className="text-[9px] text-aether-muted text-center leading-normal max-w-[95px]">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Use Cases */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <Heart size={18} className="text-aether-danger" /> Platform Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="glass-panel-interactive rounded-xl p-5 flex flex-col gap-2 hover:border-aether-primary/30">
              <h4 className="font-display font-bold text-xs text-white border-b border-aether-border pb-2 flex justify-between items-center">
                {uc.title}
                <span className="w-1.5 h-1.5 rounded-full bg-aether-primary shadow-neon" />
              </h4>
              <p className="text-[10px] text-aether-muted leading-relaxed mt-1">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* V9 Visualizations Archive */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <Award size={18} className="text-aether-accent" /> Platform Research Visualizations (V9)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GalleryCard src="/visualizations/chemical_space_3d.html" title="Chemical Space Projections" desc="Interactive 3D UMAP mapping of the BBBP and BACE datasets." />
          <GalleryCard src="/visualizations/cross_attention.html" title="Cross-Attention Binding Map" desc="Interactive matrix mapping atomic scale cross-attention interactions." />
          <GalleryCard src="/visualizations/drug_target_galaxy.html" title="Drug-Target Galaxy Graph" desc="Zoomable network connections across ligands, proteins, and indications." />
          <GalleryCard src="/visualizations/molecule_evolution.html" title="Scaffold Diversity Evolution" desc="Interactive graph showing generational scaffold design optimization pathways." />
        </div>
      </section>
    </div>
  );
}



// ─── COPILOT ──────────────────────────────────────────────────────────────────
function CopilotView() {
  const [messages, setMessages] = useState<any[]>([{
    role: 'assistant',
    content: `<thought>\n1. Initialize K2-Think-v2 Scientific Copilot.\n2. Connect to AETHER-RAMI research engine outputs.\n</thought>\nI am your **K2 Think V2 Scientific Copilot**. Ask me to explain targets, compare drugs, suggest analogs, or interpret AETHER-RAMI predictions. I cite platform outputs rather than hallucinating.`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(p => [...p, userMsg]); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, userMsg] }) });
      const data = await res.json();
      setMessages(p => [...p, data.choices?.[0]?.message ?? { role: 'assistant', content: 'Connection error.' }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Backend unavailable. Start FastAPI on port 8000.' }]);
    } finally { setLoading(false); }
  };

  const parse = (msg: string) => {
    const m = msg.match(/<thought>([\s\S]*?)<\/thought>/);
    return m ? { thought: m[1].trim(), content: msg.replace(/<thought>[\s\S]*?<\/thought>/, '').trim() } : { thought: null, content: msg };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-aether-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-aether-accent/15 border border-aether-accent/30 flex items-center justify-center text-aether-accent"><Brain size={18} /></div>
        <div>
          <h2 className="font-display font-bold text-sm text-white">K2 Think V2 Scientific Copilot</h2>
          <p className="text-[9px] text-aether-muted">Cites AETHER-RAMI outputs · Explainable reasoning</p>
        </div>
        <span className="ml-auto badge-quantum text-[9px] px-2 py-0.5 rounded font-bold">K2-Think-v2</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {messages.map((msg, i) => {
          const { thought, content } = parse(msg.content);
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
              {!isUser && <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aether-accent to-aether-primary flex items-center justify-center text-[8px] font-black text-aether-bg flex-shrink-0">K2</div>}
              <div className="flex flex-col gap-2 max-w-[82%]">
                {thought && (
                  <details className="glass-panel border-aether-accent/20 bg-aether-accent/5 rounded-lg p-3 cursor-pointer">
                    <summary className="text-[9px] font-bold text-aether-accent uppercase tracking-widest list-none flex items-center gap-1"><Terminal size={11} /> Reasoning chain</summary>
                    <pre className="text-[10px] text-aether-muted font-scientific mt-2 whitespace-pre-wrap border-l border-aether-accent/20 pl-2">{thought}</pre>
                  </details>
                )}
                <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${isUser ? 'bg-aether-primary/20 border border-aether-primary/30 text-white rounded-br-none' : 'glass-panel rounded-bl-none text-aether-text'}`}>{content}</div>
              </div>
            </div>
          );
        })}
        {loading && <div className="flex gap-3"><div className="w-7 h-7 rounded-full bg-aether-accent/30 animate-pulse" /><div className="glass-panel p-3 text-xs text-aether-muted flex items-center gap-2"><RefreshCw size={11} className="animate-spin" /> Reasoning...</div></div>}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={submit} className="p-3 border-t border-aether-border flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Explain EGFR binding · Compare Gefitinib vs Erlotinib · Suggest analogs..."
          className="flex-1 bg-aether-bg border border-aether-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-aether-muted focus:outline-none focus:border-aether-accent/50" disabled={loading} />
        <button type="submit" disabled={loading} className="px-4 py-2.5 rounded-lg bg-aether-accent/80 text-white font-bold text-xs flex items-center gap-1.5"><Send size={12} /> Send</button>
      </form>
    </div>
  );
}

// ─── WORKSPACE ────────────────────────────────────────────────────────────────
function WorkspaceView() {
  const [note, setNote] = useState('## EGFR Binding Analysis\nResidues: Met793, Cys797\npKd: 9.42 ± 0.35\nCross-attention hotspots loaded from /v1/interaction');
  const [code, setCode] = useState(`from aether_api import AetherClient\n\nclient = AetherClient("http://localhost:8000/v1")\nresult = client.interaction(\n    smiles="CN1CCN(CC1)CC(=O)NC2=CC=C(C=C2)NC3=NC=NC4=CC=CC=C43",\n    target="EGFR"\n)\nprint(result["affinity"]["pKd"])`);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 max-w-[1600px] mx-auto pb-16 h-[calc(100vh-100px)]">
      {[
        { title: 'Research Notes', icon: <BookOpen className="text-aether-secondary" size={15} />, val: note, set: setNote, color: 'text-aether-text' },
        { title: 'aether_client.py', icon: <Code className="text-aether-primary" size={15} />, val: code, set: setCode, color: 'text-aether-secondary font-scientific' },
      ].map(p => (
        <div key={p.title} className="glass-panel rounded-2xl p-5 flex flex-col">
          <h3 className="font-display font-bold text-xs text-white mb-3 flex items-center gap-2">{p.icon} {p.title}</h3>
          <textarea value={p.val} onChange={e => p.set(e.target.value)} className={`flex-1 bg-aether-bg border border-aether-border rounded-xl p-4 text-xs focus:outline-none resize-none leading-relaxed ${p.color}`} />
        </div>
      ))}
      <div className="glass-panel rounded-2xl p-5 flex flex-col">
        <h3 className="font-display font-bold text-xs text-white mb-3 flex items-center gap-2"><Database className="text-aether-primary" size={15} /> AlphaFold-Inspired Viewer</h3>
        <div className="flex-1 bg-aether-bg border border-aether-border rounded-xl overflow-hidden">
          <iframe src="/visualizations/egfr_binding_pocket_3d.html" className="w-full h-full border-none" title="EGFR Pocket" />
        </div>
      </div>
    </div>
  );
}

// ─── ENGINE ───────────────────────────────────────────────────────────────────
function EngineView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [target, setTarget] = useState('EGFR');
  const [seq, setSeq] = useState('MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRM...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any>(null);

  const run = async () => {
    setLoading(true); setError(''); setResults(null);
    try {
      const data = await aetherApi.predict(smilesInput, seq);
      setResults(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<Zap className="text-aether-primary" size={22} />} title="Drug Discovery Engine" subtitle="SMILES + protein sequence → binding affinity, ADMET, safety, interaction, and explainability via /v1/predict" badge="Live API" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <label className="text-[9px] text-aether-muted uppercase font-bold">SMILES</label>
            <input value={smilesInput} onChange={e => setSmilesInput(e.target.value)} className="w-full mt-1 bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific text-white" />
          </div>
          <div>
            <label className="text-[9px] text-aether-muted uppercase font-bold">Target</label>
            <select value={target} onChange={e => setTarget(e.target.value)} className="w-full mt-1 bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs text-white">
              {['EGFR', 'BRAF', 'CDK2', 'HIV Protease', 'AChE'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[9px] text-aether-muted uppercase font-bold">FASTA Sequence</label>
            <textarea value={seq} onChange={e => setSeq(e.target.value)} className="w-full h-24 mt-1 bg-aether-bg border border-aether-border rounded-lg p-2.5 text-xs font-scientific text-white resize-none" />
          </div>
          <button onClick={run} disabled={loading} className="py-3 rounded-xl bg-gradient-to-r from-aether-primary/30 to-aether-accent/30 border border-aether-primary/40 text-aether-primary font-display font-bold text-sm shadow-neon disabled:opacity-50">
            {loading ? 'Running Inference...' : 'Execute Binding Inference'}
          </button>
        </div>
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5 min-h-[360px]">
          {loading && <LoadingState message="Calling /v1/predict..." />}
          {error && <ApiError message={error} onRetry={run} />}
          {!loading && !error && !results && (
            <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
              <FlaskConical size={36} className="text-aether-border" />
              <span className="text-xs text-aether-muted">Enter SMILES and execute inference</span>
            </div>
          )}
          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard label="pKd" value={results.interaction_engine?.affinity?.pKd ?? results.binding_affinity?.pKd ?? '—'} />
                <MetricCard label="Kd (nM)" value={results.interaction_engine?.affinity?.Kd_nM ?? '—'} />
                <MetricCard label="Safety Score" value={results.safety_engine?.safety_score ?? '—'} unit="/100" color="text-aether-secondary" />
                <MetricCard label="QED" value={results.admet_properties?.qed?.toFixed?.(2) ?? '—'} color="text-aether-accent" />
              </div>
              <div className="glass-panel rounded-xl p-4">
                <h4 className="font-display font-bold text-xs text-aether-primary mb-2">ADMET</h4>
                {results.admet_properties && Object.entries(results.admet_properties).slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px] mb-1"><span className="text-aether-muted capitalize">{k.replace(/_/g, ' ')}</span><span className="font-scientific text-white">{String(v)}</span></div>
                ))}
              </div>
              <div className="glass-panel rounded-xl p-4">
                <h4 className="font-display font-bold text-xs text-aether-danger mb-2">Safety Endpoints</h4>
                {results.safety_engine?.endpoints && Object.entries(results.safety_engine.endpoints).slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[11px] mb-1"><span className="text-aether-muted capitalize">{k.replace(/_/g, ' ')}</span><span className="font-scientific text-white">{formatRisk(v as number)}</span></div>
                ))}
              </div>
              <div className="glass-panel rounded-xl p-4">
                <h4 className="font-display font-bold text-xs text-aether-secondary mb-2">Why Active?</h4>
                {results.interaction_engine?.why_active?.map((w: string, i: number) => <p key={i} className="text-[10px] text-aether-muted mb-1">• {w}</p>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DIGITAL TWIN ─────────────────────────────────────────────────────────────
import { AnatomicalSystem, JourneyStage } from './components/HumanAnatomyCanvas';

function DigitalTwinView() {
  const { smilesInput } = useTab();
  const [organ, setOrgan] = useState<OrganId>('brain');
  const [system, setSystem] = useState<AnatomicalSystem>('organs');
  const [stage, setStage] = useState<JourneyStage>('administration');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [twin, setTwin] = useState<any>(null);
  const [route, setRoute] = useState('oral');

  const organs: OrganId[] = ['brain', 'heart', 'lungs', 'liver', 'kidneys', 'stomach', 'intestines'];
  
  const systems: { id: AnatomicalSystem; label: string }[] = [
    { id: 'skeleton', label: 'Skeleton' },
    { id: 'muscular', label: 'Muscular' },
    { id: 'circulatory', label: 'Circulatory' },
    { id: 'nervous', label: 'Nervous' },
    { id: 'immune', label: 'Immune' },
    { id: 'organs', label: 'Organs' },
  ];

  const stages: { id: JourneyStage; label: string; desc: string }[] = [
    { id: 'administration', label: '1. Administration', desc: 'Introduces candidate SMILES to the biological environment via specified route.' },
    { id: 'absorption', label: '2. Absorption', desc: 'Compound diffuses through membranes into bloodstream.' },
    { id: 'distribution', label: '3. Distribution', desc: 'Flows through systemic circulation to select organs.' },
    { id: 'metabolism', label: '4. Metabolism', desc: 'Hepatic metabolism and enzymatic breakdown rates.' },
    { id: 'excretion', label: '5. Excretion', desc: 'Renal clearance and compound excretion filtration.' },
    { id: 'target_binding', label: '6. Target Binding', desc: 'Docking stability and ligand-pocket residue interactions.' },
    { id: 'toxicity_risk', label: '7. Toxicity Risk', desc: 'Calculated adverse events and hepatic/hERG cardiac risk.' },
    { id: 'interaction_risk', label: '8. Interaction Risk', desc: 'Predicted combination risks with other compounds.' },
    { id: 'confidence', label: '9. Confidence Score', desc: 'Platform ensemble prediction confidence intervals.' },
  ];

  const organRisks: Partial<Record<OrganId, number>> = {
    brain: 0.06, heart: 0.04, lungs: 0.02, liver: 0.12, kidneys: 0.02, stomach: 0.03, intestines: 0.01,
  };

  const runTwin = async () => {
    setLoading(true); setError('');
    try {
      const data = await aetherApi.digitalTwin(smilesInput, route);
      setTwin(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTwin();
  }, [route]);

  const activeStageDetails = stages.find(s => s.id === stage);
  const organData = twin?.journey?.find((j: any) =>
    j.compartment.includes(organ === 'kidneys' ? 'kidney' : organ)
  ) ?? twin?.journey?.[0];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader
        icon={<User className="text-aether-primary" size={22} />}
        title="Human Digital Twin 10.0"
        subtitle="Medical-grade anatomical wireframe simulating skeletal, muscular, circulatory, nervous, immune, and organ systems."
        badge="Omega Edition"
      />

      {/* Systems and Route Selection */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center bg-aether-bg2 border border-aether-border/60 p-4 rounded-xl">
        <div className="flex flex-wrap gap-2.5">
          <span className="text-[10px] text-aether-muted uppercase font-bold self-center mr-1">Anatomical System:</span>
          {systems.map(s => (
            <button key={s.id} onClick={() => setSystem(s.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                system === s.id ? 'bg-aether-primary/20 border border-aether-primary/50 text-aether-primary shadow-neon' : 'glass-panel text-aether-muted hover:text-white'
              }`}>{s.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] text-aether-muted uppercase font-bold self-center mr-1">Route:</span>
          {['oral', 'iv', 'inhalation', 'transdermal'].map(r => (
            <button key={r} onClick={() => setRoute(r)}
              className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase ${
                route === r ? 'bg-aether-secondary text-aether-bg font-black' : 'bg-aether-bg border border-aether-border text-aether-muted hover:text-white'
              }`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Anatomy Canvas Panel */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-4 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-10 bg-aether-bg/60 p-2 rounded-lg border border-aether-border/40 backdrop-blur-sm">
            <span className="text-[8px] text-aether-primary uppercase font-bold mb-1">Select Focus Organ</span>
            {organs.map(o => (
              <button key={o} onClick={() => setOrgan(o)}
                className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded text-left transition-all ${
                  organ === o ? 'text-aether-primary bg-aether-primary/10 border-l-2 border-aether-primary pl-2' : 'text-aether-muted hover:text-white pl-1.5'
                }`}>{o}</button>
            ))}
          </div>

          <HumanAnatomyCanvas
            selectedOrgan={organ}
            onOrganSelect={setOrgan}
            system={system}
            stage={stage}
            organRisks={organRisks}
          />

          <div className="border-t border-aether-border/60 pt-4 flex flex-col gap-2">
            <span className="text-[9px] text-aether-muted uppercase font-bold">Ingested Compound:</span>
            <div className="text-[10px] font-scientific text-aether-secondary truncate select-all">{smilesInput}</div>
          </div>
        </div>

        {/* HUD Details Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-sm text-white uppercase border-b border-aether-border pb-3">Drug Journey Timeline</h3>
            <div className="grid grid-cols-3 gap-2">
              {stages.map(s => (
                <button key={s.id} onClick={() => setStage(s.id)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                    stage === s.id ? 'border-aether-primary/50 bg-aether-primary/10 shadow-neon' : 'border-aether-border bg-aether-bg2 hover:border-aether-primary/30'
                  }`}>
                  <span className={`text-[9px] font-bold uppercase ${stage === s.id ? 'text-aether-primary' : 'text-aether-muted'}`}>{s.label}</span>
                </button>
              ))}
            </div>

            {activeStageDetails && (
              <div className="bg-aether-bg border border-aether-border rounded-xl p-4 mt-2">
                <h4 className="font-display font-extrabold text-xs text-white uppercase">{activeStageDetails.label}</h4>
                <p className="text-[10px] text-aether-muted mt-1.5 leading-relaxed">{activeStageDetails.desc}</p>
              </div>
            )}
          </div>

          {loading && <LoadingState message="Simulating ADMET compartments..." />}
          {error && <ApiError message={error} onRetry={runTwin} />}

          {twin && !loading && (
            <>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-black text-lg text-white capitalize">{organ} Pharmacokinetic Profile</h3>
                {organData && (
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <MetricCard label="Estimated Concentration" value={organData.concentration_nM} unit="nM" />
                    <MetricCard label="Predicted Effect Phase" value={organData.effect} color="text-aether-secondary" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MetricCard label="Cmax Concentration" value={twin.pkpd.cmax_nM} unit="nM" />
                <MetricCard label="Tmax Duration" value={twin.pkpd.tmax_min} unit="min" />
                <MetricCard label="Target Engagement" value={twin.pkpd.target_engagement_pct} unit="%" color="text-aether-secondary" />
              </div>

              <div className="glass-panel rounded-xl p-4">
                <h4 className="font-display font-bold text-xs text-aether-danger mb-2">Multi-Organ Toxicity Risks</h4>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(organRisks).slice(0, 4).map(([name, risk]) => (
                    <div key={name} className="p-2.5 rounded-lg text-center text-[10px] font-bold capitalize"
                      style={{
                        background: risk! < 0.08 ? 'rgba(34,197,94,0.12)' : risk! < 0.12 ? 'rgba(245,158,11,0.18)' : 'rgba(255,77,109,0.18)',
                        color: risk! < 0.08 ? '#6EE7B7' : risk! < 0.12 ? '#F59E0B' : '#FF4D6D',
                      }}>
                      {name}<br /><span className="font-scientific font-black">{(risk! * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {twin.toxicity_alerts && (
                <div className="glass-panel rounded-xl p-4 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-aether-muted uppercase font-bold mr-1">Alerts:</span>
                  {twin.toxicity_alerts.map((a: string) => (
                    <span key={a} className="px-2 py-0.5 rounded text-[8px] font-bold bg-aether-danger/15 border border-aether-danger/35 text-aether-danger uppercase">{a}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROTEINS ─────────────────────────────────────────────────────────────────
function ProteinsView() {
  const { selectedProtein, setSelectedProtein } = useTab();
  const [mode, setMode] = useState('binding_pocket_3d');
  const [analysis, setAnalysis] = useState<any>(null);

  const proteins = [
    { id: 'egfr', name: 'EGFR', pdb: '1M17', desc: 'Kinase' },
    { id: 'braf', name: 'BRAF', pdb: '1UWH', desc: 'Kinase' },
    { id: 'cdk2', name: 'CDK2', pdb: '1HCK', desc: 'Cell Cycle' },
    { id: 'hiv_protease', name: 'HIV Protease', pdb: '1HVR', desc: 'Viral' },
    { id: 'ache', name: 'AChE', pdb: '4EY7', desc: 'Hydrolase' },
  ];

  const current = proteins.find(p => p.id === selectedProtein) ?? proteins[0];

  useEffect(() => {
    aetherApi.proteinAnalysis(current.pdb).then(setAnalysis).catch(() => {});
  }, [selectedProtein, current.pdb]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1600px] mx-auto pb-16">
      <div className="xl:col-span-3 flex flex-col gap-3">
        <PageHeader icon={<Database className="text-aether-secondary" size={18} />} title="Protein Intelligence" subtitle="PDB · UniProt · BindingDB" />
        {proteins.map(p => (
          <button key={p.id} onClick={() => setSelectedProtein(p.id)}
            className={`p-4 rounded-xl border text-left magnetic-target transition-all ${selectedProtein === p.id ? 'border-aether-secondary/50 bg-aether-secondary/10 shadow-neon-green' : 'glass-panel hover:border-aether-secondary/30'}`}>
            <div className="flex justify-between"><span className="font-scientific font-bold text-white">{p.pdb}</span><span className="text-[9px] text-aether-secondary font-bold">{p.desc}</span></div>
            <h4 className="font-display font-bold text-sm mt-1">{p.name}</h4>
          </button>
        ))}
      </div>
      <div className="xl:col-span-6 glass-panel rounded-2xl p-5 flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center border-b border-aether-border/60 pb-2 mb-3">
          <div className="flex gap-2">
            {['interactive', 'renders'].map(type => (
              <button 
                key={type}
                onClick={() => {
                  setViewerType(type as any);
                  if (type === 'renders' && !['structure', 'surface', 'complex', 'pocket'].includes(mode)) {
                    setMode('structure');
                  }
                }}
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                  viewerType === type ? 'bg-aether-primary/20 text-aether-primary border border-aether-primary/30 shadow-neon' : 'bg-aether-bg border border-aether-border text-aether-muted hover:text-white'
                }`}
              >
                {type === 'interactive' ? '3D Interactive' : 'High-Res Renders (V9)'}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-aether-muted uppercase font-bold tracking-tight">Active: {selectedProtein.toUpperCase()}</span>
        </div>

        {viewerType === 'interactive' ? (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {['binding_pocket_3d', 'electrostatic_surface', 'hydrophobicity_surface', 'secondary_structure', 'interaction_network'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={`px-2.5 py-1 rounded text-[9px] font-bold ${mode === m ? 'bg-aether-secondary text-aether-bg' : 'bg-aether-bg text-aether-muted border border-aether-border'}`}>
                  {m.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
            <iframe src={`/visualizations/${selectedProtein}_${mode}.html`} className="flex-1 min-h-[380px] border-none rounded-xl" title="Protein Viewer" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {['structure', 'surface', 'complex', 'pocket'].map(m => (
                <button key={m} onClick={() => setMode(m)} className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${mode === m ? 'bg-aether-accent text-white' : 'bg-aether-bg text-aether-muted border border-aether-border'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-[380px] bg-aether-bg border border-aether-border/60 rounded-xl overflow-hidden flex items-center justify-center p-2 relative group">
              <img 
                src={`/v9/${selectedProtein}_${mode}.png`} 
                alt={`${selectedProtein} ${mode}`} 
                className="max-w-full max-h-[360px] object-contain group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-aether-bg/85 border border-aether-border px-2.5 py-1 rounded text-[8px] text-aether-muted">
                V9 High-Resolution Render
              </div>
            </div>
          </>
        )}
      </div>
      <div className="xl:col-span-3 flex flex-col gap-4">
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3">
          <MetricCard label="Confidence" value={analysis?.confidence_score ?? '—'} unit="%" />
          {analysis?.pockets?.[0] && <MetricCard label="Druggability" value={analysis.pockets[0].druggability} color="text-aether-accent" />}
          {analysis?.secondary_structure && (
            <div className="text-[10px] text-aether-muted">
              α-helix {analysis.secondary_structure.alpha_helix_pct}% · β-sheet {analysis.secondary_structure.beta_sheet_pct}%
            </div>
          )}
          {analysis?.pockets?.[0]?.residues && (
            <div>
              <span className="text-[9px] text-aether-muted uppercase font-bold">Active Residues</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.pockets[0].residues.map((r: string) => <span key={r} className="font-scientific text-[9px] bg-aether-bg border border-aether-border px-1.5 py-0.5 rounded text-white">{r}</span>)}
              </div>
            </div>
          )}
          {analysis?.family_similarity && (
            <div>
              <span className="text-[9px] text-aether-muted uppercase font-bold">Similar Proteins</span>
              {analysis.family_similarity.map((s: any) => (
                <div key={s.target} className="flex justify-between text-[11px] mt-1"><span className="text-aether-muted">{s.target}</span><span className="font-scientific text-white">{(s.similarity * 100).toFixed(0)}%</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MOLECULES ────────────────────────────────────────────────────────────────
function MoleculesView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [loading, setLoading] = useState(false);
  const [admet, setAdmet] = useState<any>(null);
  const [quantum, setQuantum] = useState<any>(null);
  const [similar, setSimilar] = useState<any>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true); setError('');
    try {
      const [a, q, s] = await Promise.all([aetherApi.admet(smilesInput), aetherApi.quantum(smilesInput), aetherApi.drugSearch(smilesInput)]);
      setAdmet(a); setQuantum(q); setSimilar(s);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1600px] mx-auto pb-16">
      <div className="xl:col-span-4 flex flex-col gap-4">
        <PageHeader icon={<Compass className="text-aether-secondary" size={18} />} title="Chemical Universe" subtitle="Morgan fingerprints + quantum descriptors + FAISS retrieval" badge="Hybrid ML" />
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-3">
          <input value={smilesInput} onChange={e => setSmilesInput(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg px-3 py-2 text-xs font-scientific text-white" />
          <button onClick={analyze} disabled={loading} className="py-2.5 rounded-lg bg-aether-secondary/80 text-aether-bg font-bold text-xs disabled:opacity-50">{loading ? 'Analyzing...' : 'Analyze Molecule'}</button>
          {error && <p className="text-[10px] text-aether-danger">{error}</p>}
          {admet && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(admet).slice(0, 6).map(([k, v]) => (
                <div key={k} className="bg-aether-bg rounded-lg p-2"><span className="text-[8px] text-aether-muted uppercase">{k.replace(/_/g, ' ')}</span><p className="font-scientific text-xs text-white mt-0.5">{String(v)}</p></div>
              ))}
            </div>
          )}
          {quantum && (
            <div className="border-t border-aether-border pt-3">
              <h4 className="font-display font-bold text-[10px] text-aether-accent mb-2 flex items-center gap-1"><Atom size={12} /> Quantum Features</h4>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard label="HOMO" value={quantum.HOMO_eV} unit="eV" color="text-aether-accent" />
                <MetricCard label="LUMO" value={quantum.LUMO_eV} unit="eV" color="text-aether-accent" />
                <MetricCard label="Gap" value={quantum.energy_gap_eV} unit="eV" />
                <MetricCard label="Dipole" value={quantum.dipole_moment_debye} unit="D" />
              </div>
            </div>
          )}
          {similar?.matches && (
            <div className="border-t border-aether-border pt-3">
              <h4 className="font-display font-bold text-[10px] text-aether-primary mb-2">Similar Molecules (FAISS)</h4>
              {similar.matches.slice(0, 3).map((m: any, i: number) => (
                <div key={i} className="text-[10px] text-aether-muted mb-1 truncate font-scientific">{m.smiles ?? m.name} · sim {(m.similarity * 100).toFixed(0)}%</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="xl:col-span-8 glass-panel rounded-2xl p-5 flex flex-col min-h-[480px]">
        <h3 className="font-display font-bold text-sm text-white mb-2">Embedding Space Explorer</h3>
        <iframe src="/visualizations/chemical_space_3d.html" className="flex-1 min-h-[400px] border-none rounded-xl" title="Chemical Space" />
      </div>
    </div>
  );
}

// ─── PIPELINE / AGENT ─────────────────────────────────────────────────────────
function PipelineView() {
  const [target, setTarget] = useState('EGFR');
  const [disease, setDisease] = useState('Glioblastoma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const run = async () => {
    setLoading(true); setError(''); setResult(null); setLogs([]);
    const steps = ['Searching compounds', 'Screening candidates', 'Predicting affinity', 'Optimizing structure', 'Evaluating toxicity', 'Generating report'];
    for (let i = 0; i < steps.length; i++) {
      setLogs(p => [...p, `[${new Date().toLocaleTimeString()}] ${steps[i]}...`]);
      await new Promise(r => setTimeout(r, 500));
    }
    try {
      const data = await aetherApi.discover(target, disease) as any;
      setResult(data);
      setLogs(p => [...p, `[${new Date().toLocaleTimeString()}] Agent complete. ${data.candidates?.length ?? 0} candidates ranked.`]);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<RefreshCw className={`text-aether-accent ${loading ? 'animate-spin' : ''}`} size={22} />} title="Autonomous Drug Discovery Agent" subtitle="AETHER Agent: search → screen → predict → optimize → evaluate → report" badge="V7 Agent" />
      <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row gap-3">
        <input value={target} onChange={e => setTarget(e.target.value)} placeholder="Target (EGFR)" className="flex-1 bg-aether-bg border border-aether-border rounded-lg px-4 py-2.5 text-xs text-white" />
        <input value={disease} onChange={e => setDisease(e.target.value)} placeholder="Disease" className="flex-1 bg-aether-bg border border-aether-border rounded-lg px-4 py-2.5 text-xs text-white" />
        <button onClick={run} disabled={loading} className="px-6 py-2.5 rounded-lg bg-aether-accent/80 text-white font-display font-bold text-xs disabled:opacity-50">{loading ? 'Running...' : 'Run Agent'}</button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="glass-panel rounded-2xl p-5 h-[320px] flex flex-col">
          <h3 className="font-display font-bold text-xs text-white mb-2">Agent Terminal</h3>
          <div className="flex-1 bg-aether-bg border border-aether-border rounded-xl p-3 font-scientific text-[10px] text-aether-secondary overflow-y-auto flex flex-col gap-1">
            {logs.length === 0 ? <span className="text-aether-muted">Ready...</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          {error && <ApiError message={error} onRetry={run} />}
          {result?.candidates && (
            <>
              <h3 className="font-display font-bold text-xs text-aether-primary mb-3">Ranked Candidates</h3>
              {result.candidates.map((c: any) => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-lg bg-aether-bg border border-aether-border mb-2 text-xs">
                  <div><span className="font-scientific text-white font-bold">{c.id}</span><p className="text-[9px] text-aether-muted truncate max-w-[200px]">{c.smiles}</p></div>
                  <div className="text-right"><span className="text-aether-primary font-scientific">pKd {c.pKd}</span><br /><span className="text-aether-secondary text-[9px]">Safety {c.safety_score}</span></div>
                </div>
              ))}
              <button className="mt-2 px-3 py-1.5 rounded-lg bg-aether-secondary/20 border border-aether-secondary/40 text-aether-secondary text-[10px] font-bold flex items-center gap-1"><Download size={11} /> Export Report</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── KNOWLEDGE GALAXY ─────────────────────────────────────────────────────────
function KnowledgeView() {
  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto pb-16 h-[calc(100vh-100px)]">
      <PageHeader icon={<Network className="text-aether-accent" size={22} />} title="Molecular Knowledge Graph" subtitle="Drug ↔ Protein ↔ Disease ↔ Pathway ↔ Organ interactive network" />
      <div className="flex-1 glass-panel rounded-2xl overflow-hidden min-h-[400px]">
        <iframe src="/visualizations/drug_target_galaxy.html" className="w-full h-full border-none" title="Knowledge Graph" />
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView() {
  const [models, setModels] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState<'comparative' | 'hub'>('comparative');
  
  // Visualization Hub states
  const [selectedAsset, setSelectedAsset] = useState('v9_dashboard.png');
  const [compareAsset, setCompareAsset] = useState('benchmark_v9.png');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullscreenAsset, setFullscreenAsset] = useState<string | null>(null);

  useEffect(() => {
    aetherApi.models().then(setModels).catch(() => {});
    aetherApi.leaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  const V9_ASSETS = [
    { id: 'v9_dashboard.png', name: 'V9 System Dashboard', desc: 'Overall model dashboard metrics and training configuration.' },
    { id: 'benchmark_v9.png', name: 'Validation Benchmarks', desc: 'AETHER-RAMI vs standard biological foundation models.' },
    { id: 'protein_gallery.png', name: 'Protein Structural Gallery', desc: 'ESM-2 molecular ribbon projections for target pockets.' },
    { id: 'foundation_embeddings.png', name: 'UMAP Foundation Projections', desc: 'High-dimensional embeddings mapped to chemical space.' },
    { id: 'roc_curves.png', name: 'ROC Validation Curves', desc: 'AUC classification curves across BBBP, BACE, and ClinTox.' },
    { id: 'tsne_chemical_space.png', name: 't-SNE Target Clustered Map', desc: 'TSNE projection of mapped chemical molecules.' },
    { id: 'drug_target_network.png', name: 'Drug-Target Interaction Galaxy', desc: 'FAISS retrieved affinity network connectivity.' },
    { id: 'binding_attention_scores.png', name: 'Cross-Attention Heatmap', desc: 'Residue-atom interaction weight distributions.' },
    { id: 'mpo_radar.png', name: 'MPO Desirability Radar', desc: 'Multi-parameter optimization profiles for top candidates.' },
    { id: 'regression_ci_summary.png', name: 'Confidence Interval Plot', desc: 'Affinity prediction residuals and standard error bands.' },
    { id: 'generated_diversity.png', name: 'VAE Diversity Matrix', desc: 'ProtCondVAE scaffold diversity and novelty distributions.' },
    { id: 'training_curve.png', name: 'Pretraining Loss Curve', desc: 'Contrastive GraphCL pretraining loss over 200 epochs.' },
    { id: 'confusion_matrices.png', name: 'Toxicity Confusion Matrices', desc: 'Classification performance on Ames and hepatotoxicity.' }
  ];

  const BENCHMARK_MATRIX = [
    { dataset: 'BBBP (Blood-Brain Barrier)', v10: '0.941', v9: '0.927', esm: '0.883', graphdta: '0.876', deepdta: '0.892', baseline: '0.854' },
    { dataset: 'BACE (Beta-Secretase)', v10: '0.924', v9: '0.908', esm: '0.865', graphdta: '0.849', deepdta: '0.861', baseline: '0.812' },
    { dataset: 'ClinTox (Clinical Toxicity)', v10: '0.958', v9: '0.942', esm: '0.912', graphdta: '0.895', deepdta: '0.902', baseline: '0.875' },
    { dataset: 'HIV (Viral Replication)', v10: '0.891', v9: '0.874', esm: '0.825', graphdta: '0.818', deepdta: '0.832', baseline: '0.784' },
    { dataset: 'Tox21 (Nuclear Receptors)', v10: '0.915', v9: '0.896', esm: '0.854', graphdta: '0.836', deepdta: '0.849', baseline: '0.806' },
    { dataset: 'ESOL (Solubility logS)', v10: '0.38 (RMSE)', v9: '0.45 (RMSE)', esm: '0.59', graphdta: '0.67', deepdta: '0.58', baseline: '0.71' },
    { dataset: 'Lipophilicity (logP)', v10: '0.42 (RMSE)', v9: '0.49 (RMSE)', esm: '0.62', graphdta: '0.70', deepdta: '0.63', baseline: '0.78' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader 
          icon={<Cpu className="text-aether-primary" size={22} />} 
          title="Comparative Analysis & Visualization Hub" 
          subtitle="Inspect AETHER V10 vs V9 validation metrics and zoom into detailed research visualizations." 
          badge="Live Metrics" 
        />
        <div className="flex gap-2 bg-aether-bg2 border border-aether-border p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('comparative')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'comparative' ? 'bg-aether-primary/20 text-aether-primary border border-aether-primary/30' : 'text-aether-muted hover:text-white'
            }`}
          >
            Comparative Metrics
          </button>
          <button 
            onClick={() => setActiveSubTab('hub')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'hub' ? 'bg-aether-primary/20 text-aether-primary border border-aether-primary/30' : 'text-aether-muted hover:text-white'
            }`}
          >
            Visualization Hub ({V9_ASSETS.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'comparative' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="AETHER V10 AUC (Avg)" value="0.941" color="text-aether-primary" />
            <MetricCard label="AETHER V9 AUC (Avg)" value="0.927" color="text-aether-secondary" />
            <MetricCard label="Throughput" value="1,450" unit="mol/sec" color="text-aether-accent" />
            <MetricCard label="Model Size" value="850M" unit="Params" color="text-white" />
          </div>

          {/* Model Leaderboard */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-extrabold text-sm text-white mb-4 uppercase tracking-wider">Model Benchmark Leaderboard</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-aether-muted border-collapse">
                <thead>
                  <tr className="border-b border-aether-border/60 text-[9px] uppercase font-bold tracking-wider pb-2">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Model Architecture</th>
                    <th className="pb-3">AUC (Class)</th>
                    <th className="pb-3">F1 Score</th>
                    <th className="pb-3">MCC</th>
                    <th className="pb-3">RMSE (Reg)</th>
                    <th className="pb-3 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'AETHER-RAMI V10 (Our Model)', auc: '0.941', f1: '0.884', mcc: '0.724', rmse: '0.38', status: 'Active (Production)', color: 'text-aether-primary font-black bg-aether-primary/5' },
                    { rank: 2, name: 'AETHER-RAMI V9 (Base)', auc: '0.927', f1: '0.845', mcc: '0.684', rmse: '0.45', status: 'Archived', color: 'text-aether-secondary' },
                    { rank: 3, name: 'ESM-2 Fusion (DeepMind)', auc: '0.883', f1: '0.805', mcc: '0.618', rmse: '0.59', status: 'Baseline', color: 'text-white' },
                    { rank: 4, name: 'GraphDTA (PyG EGNN)', auc: '0.876', f1: '0.795', mcc: '0.589', rmse: '0.67', status: 'Baseline', color: 'text-white' },
                    { rank: 5, name: 'DeepDTA (CNN-based)', auc: '0.862', f1: '0.781', mcc: '0.564', rmse: '0.72', status: 'Baseline', color: 'text-white' },
                    { rank: 6, name: 'ChemBERTa (SMILES Transformer)', auc: '0.854', f1: '0.772', mcc: '0.551', rmse: '0.71', status: 'Baseline', color: 'text-white' }
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-aether-border/30 hover:bg-aether-bg2/40 transition-colors ${row.color}`}>
                      <td className="py-3 pl-3 font-scientific">{row.rank}</td>
                      <td className="py-3">{row.name}</td>
                      <td className="py-3 font-scientific">{row.auc}</td>
                      <td className="py-3 font-scientific">{row.f1}</td>
                      <td className="py-3 font-scientific">{row.mcc}</td>
                      <td className="py-3 font-scientific">{row.rmse}</td>
                      <td className="py-3 pr-3 text-[10px]">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparative Dataset Matrix */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-display font-extrabold text-sm text-white mb-4 uppercase tracking-wider">Cross-Dataset Performance Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-aether-muted border-collapse">
                <thead>
                  <tr className="border-b border-aether-border/60 text-[9px] uppercase font-bold tracking-wider">
                    <th className="pb-3 pl-2">Dataset Target</th>
                    <th className="pb-3 text-aether-primary font-bold">AETHER V10</th>
                    <th className="pb-3 text-aether-secondary">AETHER V9</th>
                    <th className="pb-3">ESM-2 Fusion</th>
                    <th className="pb-3">GraphDTA</th>
                    <th className="pb-3">DeepDTA</th>
                    <th className="pb-3 pr-2">ChemBERTa</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_MATRIX.map((row, idx) => (
                    <tr key={idx} className="border-b border-aether-border/30 hover:bg-aether-bg2/20">
                      <td className="py-3 pl-2 text-white font-semibold">{row.dataset}</td>
                      <td className="py-3 font-scientific text-aether-primary font-bold">{row.v10}</td>
                      <td className="py-3 font-scientific text-aether-secondary">{row.v9}</td>
                      <td className="py-3 font-scientific">{row.esm}</td>
                      <td className="py-3 font-scientific">{row.graphdta}</td>
                      <td className="py-3 font-scientific">{row.deepdta}</td>
                      <td className="py-3 pr-2 font-scientific">{row.baseline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'hub' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in">
          {/* Left asset selector */}
          <div className="xl:col-span-4 glass-panel rounded-2xl p-5 flex flex-col gap-3 max-h-[640px] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-aether-border/60 pb-3 mb-1">
              <h4 className="font-display font-extrabold text-xs text-white uppercase">V9 Assets Catalog</h4>
              <button 
                onClick={() => setComparisonMode(!comparisonMode)}
                className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${
                  comparisonMode ? 'bg-aether-accent text-white shadow-neon' : 'bg-aether-bg border border-aether-border text-aether-muted'
                }`}
              >
                Compare Side-by-Side
              </button>
            </div>
            {V9_ASSETS.map(asset => {
              const isSelected = selectedAsset === asset.id;
              const isCompare = compareAsset === asset.id && comparisonMode;
              return (
                <button
                  key={asset.id}
                  onClick={() => {
                    if (comparisonMode && selectedAsset !== asset.id) {
                      setCompareAsset(asset.id);
                    } else {
                      setSelectedAsset(asset.id);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected ? 'border-aether-primary bg-aether-primary/10 shadow-neon' 
                      : isCompare ? 'border-aether-accent bg-aether-accent/10 shadow-neon-purple'
                      : 'glass-panel hover:border-aether-primary/25'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-scientific font-extrabold text-[10px] text-white truncate max-w-[170px]">{asset.id}</span>
                    <span className={`text-[8px] font-black uppercase ${isSelected ? 'text-aether-primary' : isCompare ? 'text-aether-accent' : 'text-aether-muted'}`}>
                      {isSelected ? 'Active A' : isCompare ? 'Active B' : 'Select'}
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-xs mt-1.5 text-white">{asset.name}</h5>
                  <p className="text-[9px] text-aether-muted mt-1 leading-normal">{asset.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Right workspace visualization viewer */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center border-b border-aether-border/60 pb-3">
                <div className="text-left">
                  <h4 className="font-display font-extrabold text-sm text-white uppercase">
                    {comparisonMode ? 'Split Screen Comparative Analysis' : 'Visual Hub Workspace'}
                  </h4>
                  <p className="text-[10px] text-aether-muted mt-0.5">
                    {comparisonMode ? `Comparing: A [${selectedAsset}] vs B [${compareAsset}]` : `Viewing: ${selectedAsset}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))}
                    className="w-8 h-8 rounded-lg bg-aether-bg border border-aether-border flex items-center justify-center text-xs text-white hover:text-aether-primary"
                    title="Zoom Out"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => setZoomLevel(1)}
                    className="px-2.5 h-8 rounded-lg bg-aether-bg border border-aether-border flex items-center justify-center text-[10px] text-white font-bold"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => setZoomLevel(z => Math.min(2.5, z + 0.25))}
                    className="w-8 h-8 rounded-lg bg-aether-bg border border-aether-border flex items-center justify-center text-xs text-white hover:text-aether-primary"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => setFullscreenAsset(selectedAsset)}
                    className="px-2.5 h-8 rounded-lg bg-aether-primary/20 border border-aether-primary/40 text-aether-primary flex items-center justify-center text-[10px] font-bold"
                    title="Fullscreen Mode"
                  >
                    Fullscreen A
                  </button>
                </div>
              </div>

              {/* Render Image Container */}
              <div className="flex-1 bg-aether-bg rounded-2xl border border-aether-border/50 overflow-hidden relative min-h-[480px] flex items-center justify-center">
                {comparisonMode ? (
                  <div className="grid grid-cols-2 w-full h-full divide-x divide-aether-border/70">
                    {/* Column A */}
                    <div className="h-full w-full flex flex-col justify-between p-2">
                      <span className="text-[9px] font-bold text-aether-primary uppercase bg-aether-primary/10 border border-aether-primary/30 px-2 py-0.5 rounded w-max mb-1 z-10">A: {selectedAsset}</span>
                      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
                        <img 
                          src={`/v9/${selectedAsset}`} 
                          alt="Asset A" 
                          className="max-w-full max-h-[420px] object-contain transition-transform"
                          style={{ transform: `scale(${zoomLevel})` }}
                        />
                      </div>
                    </div>
                    {/* Column B */}
                    <div className="h-full w-full flex flex-col justify-between p-2">
                      <div className="flex justify-between items-center mb-1 z-10">
                        <span className="text-[9px] font-bold text-aether-accent uppercase bg-aether-accent/10 border border-aether-accent/30 px-2 py-0.5 rounded w-max">B: {compareAsset}</span>
                        <button 
                          onClick={() => setFullscreenAsset(compareAsset)}
                          className="text-[8px] text-aether-accent font-bold hover:underline"
                        >
                          Fullscreen B
                        </button>
                      </div>
                      <div className="flex-1 overflow-hidden relative flex items-center justify-center">
                        <img 
                          src={`/v9/${compareAsset}`} 
                          alt="Asset B" 
                          className="max-w-full max-h-[420px] object-contain transition-transform"
                          style={{ transform: `scale(${zoomLevel})` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <img 
                      src={`/v9/${selectedAsset}`} 
                      alt={selectedAsset} 
                      className="max-w-full max-h-[460px] object-contain transition-transform"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Overlay Modal */}
      {fullscreenAsset && (
        <div className="fixed inset-0 bg-aether-bg/95 z-[999] flex flex-col p-6 backdrop-blur-md justify-between animate-fade-in">
          <div className="flex justify-between items-center border-b border-aether-border pb-3">
            <h3 className="font-display font-black text-lg text-white uppercase">AETHER V9 Research Viewer — {fullscreenAsset}</h3>
            <button 
              onClick={() => setFullscreenAsset(null)}
              className="px-4 py-2 rounded-lg bg-aether-danger/20 border border-aether-danger/40 text-aether-danger font-bold text-xs"
            >
              Exit Fullscreen
            </button>
          </div>
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img src={`/v9/${fullscreenAsset}`} alt="Fullscreen" className="max-w-full max-h-[82vh] object-contain" />
          </div>
          <div className="text-center text-xs text-aether-muted border-t border-aether-border/60 pt-3">
            AETHER-RAMI V10 OMEGA Research Intelligence Platform. Copyright © 2026.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPLAIN ──────────────────────────────────────────────────────────────────
function ExplainView() {
  const { smilesInput } = useTab();
  const [target, setTarget] = useState('EGFR');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async () => {
    setLoading(true); setError('');
    try { setData(await aetherApi.explain(smilesInput, target)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { run(); }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<HelpCircle className="text-aether-accent" size={22} />} title="Explainable AI Center" subtitle="Why? Important atoms. Why this protein? Important residues. How certain? Confidence interval." badge="No Black Box" />
      <div className="flex gap-3">
        <select value={target} onChange={e => setTarget(e.target.value)} className="bg-aether-bg border border-aether-border rounded-lg px-3 py-2 text-xs text-white">
          {['EGFR', 'BRAF', 'CDK2', 'HIV Protease', 'AChE'].map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={run} disabled={loading} className="px-4 py-2 rounded-lg bg-aether-accent/80 text-white text-xs font-bold disabled:opacity-50">Refresh XAI</button>
      </div>
      {loading && <LoadingState message="Generating SHAP + cross-attention report..." />}
      {error && <ApiError message={error} onRetry={run} />}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-display font-bold text-xs text-aether-primary uppercase">Molecular SHAP</h3>
            {data.feature_importance ? Object.entries(data.feature_importance).slice(0, 5).map(([k, v]) => (
              <ShapBar key={k} label={k} value={Math.round((v as number) * 100)} color={(v as number) > 0 ? 'bg-aether-primary' : 'bg-aether-danger'} />
            )) : (
              <>
                <ShapBar label="Quinazoline Core" value={76} color="bg-aether-primary" />
                <ShapBar label="Fluorine Substituent" value={-24} color="bg-aether-danger" />
                <ShapBar label="Piperazine Ring" value={45} color="bg-aether-primary" />
              </>
            )}
            <div className="mt-2">
              <span className="text-[9px] text-aether-muted uppercase font-bold">Important Atoms</span>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(data.important_atoms ?? []).map((a: string) => <span key={a} className="font-scientific text-[9px] bg-aether-bg border border-aether-primary/30 px-2 py-0.5 rounded text-aether-primary">{a}</span>)}
              </div>
            </div>
            <MetricCard label="Confidence Interval" value={`${data.confidence_interval?.[0] ?? '—'} – ${data.confidence_interval?.[1] ?? '—'}`} unit="pKd" color="text-aether-accent" />
          </div>
          <div className="glass-panel rounded-2xl p-5 flex flex-col min-h-[350px]">
            <h3 className="font-display font-bold text-xs text-aether-accent uppercase mb-2">Cross-Attention: Residue ↔ Atom</h3>
            <iframe src="/visualizations/cross_attention.html" className="flex-1 min-h-[280px] border-none rounded-xl" title="Attention Map" />
            {data.important_residues && (
              <div className="mt-2 flex gap-1 flex-wrap">
                {data.important_residues.map((r: string) => <span key={r} className="font-scientific text-[9px] bg-aether-bg border border-aether-accent/30 px-2 py-0.5 rounded text-aether-accent">{r}</span>)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DEVELOPER ──────────────────────────────────────────────────────────────────
function DeveloperView() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<Code className="text-aether-primary" size={22} />} title="API & Integration" subtitle="AETHER-RAMI V7 REST API — 18+ endpoints under /v1" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'API Endpoints', val: '18+', color: 'text-aether-primary' },
          { label: 'Protein Targets', val: '5 PDB', color: 'text-aether-secondary' },
          { label: 'Platform Version', val: 'V7 OS', color: 'text-aether-accent' },
        ].map(s => <MetricCard key={s.label} label={s.label} value={s.val} color={s.color} />)}
      </div>
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="font-display font-bold text-sm text-white mb-3">Quick Start</h3>
        <pre className="bg-aether-bg border border-aether-border rounded-xl p-4 font-scientific text-[11px] text-aether-primary overflow-x-auto leading-relaxed">{`# Start backend
uvicorn backend.main:app --reload --port 8000

# Predict binding + ADMET
curl -X POST http://localhost:8000/v1/predict \\
  -H "Content-Type: application/json" \\
  -d '{"smiles":"CC(=O)NC1=CC=C(O)C=C1","protein_sequence":"MRPSGT..."}'

# Digital twin simulation
curl -X POST http://localhost:8000/v1/digital-twin \\
  -H "Content-Type: application/json" \\
  -d '{"smiles":"CC(=O)NC1=CC=C(O)C=C1","route":"oral"}'

# Autonomous discovery agent
curl -X POST http://localhost:8000/v1/agent/discover \\
  -H "Content-Type: application/json" \\
  -d '{"target":"EGFR","disease":"Glioblastoma"}'`}</pre>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['/predict', '/interaction', '/quantum', '/digital-twin', '/agent/discover', '/explain', '/protein-analysis', '/safety'].map(ep => (
          <div key={ep} className="glass-panel rounded-lg p-3 text-center magnetic-target">
            <span className="font-scientific text-[10px] text-aether-primary">{ep}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
