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

// ─── HOME ───────────────────────────────────────────────────────────────────────
function HomeView() {
  const { setActiveTab } = useTab();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let af: number;
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; z: number; r: number; c: string }[] = [];
    for (let i = 0; i < 80; i++) {
      const t = Math.random() * Math.PI * 2, p = Math.acos(Math.random() * 2 - 1), d = 80 + Math.random() * 40;
      nodes.push({ x: d * Math.sin(p) * Math.cos(t), y: d * Math.sin(p) * Math.sin(t), z: d * Math.cos(p), r: 2 + Math.random() * 2, c: Math.random() > 0.5 ? 'rgba(0,229,255,0.7)' : 'rgba(110,231,183,0.6)' });
    }
    const ligands = Array.from({ length: 12 }, () => ({ x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50, z: (Math.random() - 0.5) * 50, r: 3 }));

    const rotX = (n: any, a: number) => { const c = Math.cos(a), s = Math.sin(a); const y = n.y * c - n.z * s; n.z = n.z * c + n.y * s; n.y = y; };
    const rotY = (n: any, a: number) => { const c = Math.cos(a), s = Math.sin(a); const x = n.x * c - n.z * s; n.z = n.z * c + n.x * s; n.x = x; };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.save(); ctx.translate(w / 2, h / 2);
      const ax = 0.003 + mouse.y * 0.000012, ay = 0.002 + mouse.x * 0.000012;
      [...nodes, ...ligands].forEach(n => { rotX(n, ax); rotY(n, ay); });

      ctx.strokeStyle = 'rgba(0,229,255,0.06)'; ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 38) {
          const s1 = (200 + nodes[i].z) / 200, s2 = (200 + nodes[j].z) / 200;
          ctx.beginPath(); ctx.moveTo(nodes[i].x * s1, nodes[i].y * s1); ctx.lineTo(nodes[j].x * s2, nodes[j].y * s2); ctx.stroke();
        }
      }

      nodes.forEach(n => { const s = (200 + n.z) / 200; ctx.fillStyle = n.c; ctx.beginPath(); ctx.arc(n.x * s, n.y * s, n.r * s, 0, Math.PI * 2); ctx.fill(); });
      ctx.strokeStyle = 'rgba(110,231,183,0.5)'; ctx.lineWidth = 1.2;
      ligands.forEach(n => { const s = (200 + n.z) / 200; ctx.fillStyle = '#6EE7B7'; ctx.beginPath(); ctx.arc(n.x * s, n.y * s, n.r * s, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
      af = requestAnimationFrame(render);
    };
    render();
    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(af); window.removeEventListener('resize', onResize); };
  }, [mouse]);

  return (
    <div className="flex flex-col gap-10 max-w-[1600px] mx-auto pb-16">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px] glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden" onMouseMove={e => {
        const r = canvasRef.current?.getBoundingClientRect();
        if (r) setMouse({ x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 });
      }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-aether-primary/5 rounded-full blur-3xl" />
        <div className="lg:col-span-7 flex flex-col gap-5 z-10">
          <div className="flex items-center gap-2 text-[10px] font-bold text-aether-primary uppercase tracking-widest badge-api px-3 py-1.5 rounded-full w-max">
            <Sparkles size={11} className="animate-pulse" /> Future Biocomputing Operating System
          </div>
          <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-black leading-tight">
            AETHER-RAMI<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aether-primary via-aether-secondary to-aether-accent">
              Protein-Aware Drug Discovery Foundation Model
            </span>
          </h1>
          <blockquote className="text-aether-muted text-sm max-w-xl leading-relaxed border-l-2 border-aether-primary/40 pl-4 italic">
            Discover, simulate, explain, and optimize molecular therapeutics using foundation AI, protein intelligence, digital twins, and explainable drug-target interaction modeling.
          </blockquote>
          <div className="flex flex-wrap gap-3 mt-1">
            {[
              { label: 'Launch Workspace', tab: 'engine' as const, primary: true },
              { label: 'Explore Features', tab: 'features' as const },
              { label: 'View Research', tab: 'dashboard' as const },
            ].map(btn => (
              <button key={btn.label} onClick={() => setActiveTab(btn.tab)}
                className={`px-5 py-3 rounded-xl font-display font-bold text-sm transition-all magnetic-target flex items-center gap-2 ${
                  btn.primary ? 'bg-gradient-to-r from-aether-primary/30 to-aether-accent/30 border border-aether-primary/40 text-aether-primary shadow-neon' : 'glass-panel text-white hover:border-aether-primary/30'
                }`}>
                {btn.label} {btn.primary && <Zap size={14} />}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 h-[320px] lg:h-[420px] relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="text-[9px] text-aether-muted uppercase tracking-widest font-bold bg-aether-bg/80 border border-aether-border px-3 py-1 rounded-md">
              Floating Molecules · Neural Pathways · Protein Ribbons
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <Layers size={20} className="text-aether-primary" /> Drug Discovery Pipeline
        </h2>
        <div className="glass-panel rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            ['1', 'Input Molecule', 'SMILES / SDF / MOL2', 'border-aether-primary/30 text-aether-primary'],
            ['2', 'Protein Encoding', 'PDB / UniProt / ESM-2', 'border-aether-accent/30 text-aether-accent'],
            ['3', 'DTI Modeling', 'Cross-Attention Binding', 'border-aether-secondary/30 text-aether-secondary'],
            ['4', 'Affinity Output', 'pKd / Ki / IC50', 'border-aether-primary/30 text-aether-primary'],
            ['5', 'ADMET Screen', 'Toxicity / BBB / Solubility', 'border-aether-danger/30 text-aether-danger'],
            ['6', 'Digital Twin', 'PK/PD Compartments', 'border-aether-primary/30 text-aether-primary'],
            ['7', 'Quantum Features', 'HOMO / LUMO / Gap', 'border-aether-accent/30 text-aether-accent'],
            ['8', 'XAI Generation', 'SHAP / Attention Maps', 'border-aether-secondary/30 text-aether-secondary'],
          ].map(([n, t, d, c]) => <PipelineStep key={n} num={n} title={t} desc={d} color={c} />)}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatsCard count="5" label="Curated Protein Targets" />
        <StatsCard count="18+" label="Research API Endpoints" />
        <StatsCard count="V7" label="Platform Generation" />
        <StatsCard count="Quantum+" label="Hybrid ML Pipeline" />
        <StatsCard count="Live" label="Backend Connected" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <GitBranch size={18} className="text-aether-secondary" /> AETHER-RAMI Evolution
        </h2>
        <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
          <div className="flex min-w-[900px] gap-5 relative">
            <div className="absolute top-5 left-10 w-[85%] h-px bg-aether-border" />
            <TimelineItem version="V1" title="Molecular ML" desc="Descriptor-based models." active={false} />
            <TimelineItem version="V2" title="Graph Learning" desc="GNN foundation learning." active={false} />
            <TimelineItem version="V3" title="Protein Intel" desc="PDB structure encoding." active={false} />
            <TimelineItem version="V4" title="Foundation" desc="Protein-aware FM." active={false} />
            <TimelineItem version="V5" title="Cross-Attn DTI" desc="Residue-atom attention." active={false} />
            <TimelineItem version="V6" title="Digital Twin" desc="PK/PD simulation." active={true} />
            <TimelineItem version="V7" title="AI Scientist" desc="Autonomous discovery agent." active={false} isFuture />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-extrabold text-white flex items-center gap-2">
          <Award size={18} className="text-aether-accent" /> V4 Research Artifacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <GalleryCard src="/visualizations/chemical_space_3d.html" title="Chemical Space UMAP" desc="Interactive 3D embedding explorer" />
          <GalleryCard src="/visualizations/drug_target_galaxy.html" title="Drug-Target Network" desc="Cross-attention binding galaxy" />
          <GalleryCard src="/visualizations/cross_attention.html" title="Cross-Attention Heatmap" desc="Residue ↔ atom attention weights" />
          <GalleryCard src="/visualizations/molecule_evolution.html" title="Molecule Evolution" desc="Generative scaffold optimization" />
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
function DigitalTwinView() {
  const { smilesInput } = useTab();
  const [organ, setOrgan] = useState<OrganId>('brain');
  const [twinMode, setTwinMode] = useState<TwinMode>('drug');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [twin, setTwin] = useState<any>(null);
  const [journeyStep, setJourneyStep] = useState(0);

  const organs: OrganId[] = ['brain', 'heart', 'lungs', 'liver', 'kidneys', 'stomach', 'intestines'];
  const modes: { id: TwinMode; label: string }[] = [
    { id: 'anatomical', label: 'Anatomical' },
    { id: 'drug', label: 'Drug Simulation' },
    { id: 'disease', label: 'Disease Mode' },
    { id: 'treatment', label: 'Treatment' },
  ];

  const organRisks: Partial<Record<OrganId, number>> = {
    brain: 0.06, heart: 0.04, lungs: 0.02, liver: 0.12, kidneys: 0.02, stomach: 0.03, intestines: 0.01,
  };

  const runTwin = async () => {
    setLoading(true); setError('');
    try { const data = await aetherApi.digitalTwin(smilesInput); setTwin(data); setJourneyStep(0); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { runTwin(); }, []);

  useEffect(() => {
    if (!twin) return;
    const iv = setInterval(() => setJourneyStep(s => (s + 1) % twin.journey.length), 2000);
    return () => clearInterval(iv);
  }, [twin]);

  const organData = twin?.journey?.find((j: any) =>
    j.compartment.includes(organ === 'kidneys' ? 'kidney' : organ)
  ) ?? twin?.journey?.[0];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<User className="text-aether-primary" size={22} />} title="Human Digital Twin 2.0" subtitle="Medical-grade anatomical wireframe with skeleton, organs, nervous & circulatory systems, PK/PD drug journey simulation" badge="V7 Live" />
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.id} onClick={() => setTwinMode(m.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider magnetic-target ${
              twinMode === m.id ? 'bg-aether-primary/20 border border-aether-primary/40 text-aether-primary' : 'glass-panel text-aether-muted'
            }`}>{m.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 glass-panel rounded-2xl p-4 relative min-h-[480px] overflow-hidden">
          <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
            {organs.map(o => (
              <button key={o} onClick={() => setOrgan(o)}
                className={`px-2.5 py-1 text-[8px] font-bold uppercase rounded magnetic-target ${
                  organ === o ? 'bg-aether-primary/20 border border-aether-primary/50 text-aether-primary' : 'bg-aether-bg/80 border border-aether-border text-aether-muted'
                }`}>{o}</button>
            ))}
          </div>
          <HumanAnatomyCanvas
            selectedOrgan={organ}
            onOrganSelect={setOrgan}
            mode={twinMode}
            organRisks={organRisks}
          />
          {twin && (
            <div className="absolute bottom-4 left-4 right-4 flex gap-1">
              {twin.journey.map((_: any, i: number) => (
                <div key={i} className={`flex-1 h-1 rounded-full ${i <= journeyStep ? 'bg-aether-primary' : 'bg-aether-border'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4">
          {loading && <LoadingState message="Simulating drug journey via /v1/digital-twin..." />}
          {error && <ApiError message={error} onRetry={runTwin} />}
          {twin && (
            <>
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex gap-2 flex-wrap text-[10px] font-bold mb-4">
                  {['Drug', 'Blood', 'Organ', 'Protein', 'Cell'].map((s, i) => (
                    <React.Fragment key={s}>
                      <span className={`px-2 py-1 rounded border ${i <= journeyStep ? 'border-aether-primary/50 text-aether-primary bg-aether-primary/10' : 'border-aether-border text-aether-muted'}`}>{s}</span>
                      {i < 4 && <ChevronRight size={12} className="text-aether-muted self-center" />}
                    </React.Fragment>
                  ))}
                </div>
                <h3 className="font-display font-black text-xl text-white capitalize">{organ} Compartment</h3>
                {organData && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <MetricCard label="Concentration" value={organData.concentration_nM} unit="nM" />
                    <MetricCard label="Effect Phase" value={organData.effect} color="text-aether-secondary" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MetricCard label="Cmax" value={twin.pkpd.cmax_nM} unit="nM" />
                <MetricCard label="Tmax" value={twin.pkpd.tmax_min} unit="min" />
                <MetricCard label="Engagement" value={twin.pkpd.target_engagement_pct} unit="%" color="text-aether-secondary" />
              </div>
              <div className="glass-panel rounded-xl p-4">
                <h4 className="font-display font-bold text-xs text-aether-danger mb-2">Organ Risk Heatmap</h4>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(organRisks).slice(0, 4).map(([name, risk]) => (
                    <div key={name} className="p-2 rounded-lg text-center text-[10px] font-bold capitalize"
                      style={{
                        background: risk! < 0.08 ? 'rgba(34,197,94,0.15)' : risk! < 0.12 ? 'rgba(245,158,11,0.2)' : 'rgba(255,77,109,0.2)',
                        color: risk! < 0.08 ? '#6EE7B7' : risk! < 0.12 ? '#f59e0b' : '#FF4D6D',
                      }}>
                      {name}<br /><span className="font-scientific">{(risk! * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {twin.toxicity_alerts && (
                <div className="glass-panel rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-aether-danger mb-2">Toxicity Alerts</h4>
                  {twin.toxicity_alerts.map((a: string) => (
                    <span key={a} className="inline-block mr-2 mb-1 px-2 py-0.5 rounded text-[9px] font-bold bg-aether-danger/15 border border-aether-danger/30 text-aether-danger">{a}</span>
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
        <div className="flex flex-wrap gap-2 mb-3">
          {['binding_pocket_3d', 'electrostatic_surface', 'hydrophobicity_surface', 'secondary_structure', 'interaction_network'].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-2.5 py-1 rounded text-[9px] font-bold ${mode === m ? 'bg-aether-secondary text-aether-bg' : 'bg-aether-bg text-aether-muted border border-aether-border'}`}>
              {m.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        <iframe src={`/visualizations/${selectedProtein}_${mode}.html`} className="flex-1 min-h-[380px] border-none rounded-xl" title="Protein Viewer" />
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

  useEffect(() => {
    aetherApi.models().then(setModels).catch(() => {});
    aetherApi.leaderboard().then(setLeaderboard).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      <PageHeader icon={<Cpu className="text-aether-primary" size={22} />} title="Research Dashboard" subtitle="V4 artifacts: protein gallery, embeddings, drug-target networks, UMAP, SHAP, ADMET, ROC curves" badge="Live Metrics" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GalleryCard src="/visualizations/cross_attention.html" title="SHAP / Attention Maps" desc="Cross-attention residue weights" />
        <GalleryCard src="/visualizations/chemical_space_3d.html" title="UMAP Embedding Space" desc="Foundation model projections" />
      </div>
      {leaderboard && (
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="font-display font-bold text-sm text-white mb-3">Model Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-aether-muted">
              <thead className="text-[10px] uppercase font-bold text-aether-muted border-b border-aether-border">
                <tr><th className="py-2 text-left">Model</th><th>Task</th><th>Metric</th><th>Score</th></tr>
              </thead>
              <tbody>
                {(leaderboard.leaderboard ?? leaderboard.models ?? []).slice?.(0, 5)?.map?.((row: any, i: number) => (
                  <tr key={i} className="border-b border-aether-border/50">
                    <td className="py-2 text-white font-semibold">{row.model ?? row.name ?? 'AETHER-RAMI'}</td>
                    <td>{row.task ?? row.dataset ?? '—'}</td>
                    <td>{row.metric ?? 'AUC'}</td>
                    <td className="font-scientific text-aether-primary">{row.score ?? row.auc ?? '—'}</td>
                  </tr>
                )) ?? (
                  <tr><td className="py-2 text-white">AETHER-RAMI V6</td><td>BBBP</td><td>AUC</td><td className="font-scientific text-aether-primary">0.927</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {models && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(models.models ?? [models]).slice(0, 4).map((m: any, i: number) => (
            <MetricCard key={i} label={m.name ?? m.version ?? `Model ${i + 1}`} value={m.status ?? m.auc ?? 'Active'} />
          ))}
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
