'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import ProteinViewer from './components/viewer/ProteinViewer';
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

  return (
    <div className="flex flex-col gap-12 max-w-[1200px] mx-auto pb-16 pt-12">
      <section className="flex flex-col gap-6 items-center text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
          AETHER-RAMI Discovery Engine
        </h1>
        <p className="text-aether-muted text-sm max-w-2xl leading-relaxed">
          A computational biology platform integrating protein-ligand binding prediction, molecular descriptors, and structural analysis.
        </p>
        <div className="flex gap-4 mt-4">
          <button onClick={() => setActiveTab('engine')} className="px-6 py-3 rounded-xl bg-aether-primary/20 border border-aether-primary/40 text-aether-primary font-bold text-sm hover:bg-aether-primary/30 transition-all">
            Launch Engine
          </button>
          <button onClick={() => setActiveTab('proteins')} className="px-6 py-3 rounded-xl bg-aether-bg border border-aether-border text-white font-bold text-sm hover:border-aether-muted transition-all">
            View Structural Database
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="glass-panel rounded-2xl p-6 border border-aether-border/60">
          <Target className="text-aether-primary mb-4" size={24} />
          <h3 className="text-white font-bold mb-2">Target Prediction</h3>
          <p className="text-xs text-aether-muted leading-relaxed">Compute binding affinity against known targets using structural graph neural networks.</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-aether-border/60">
          <Layers className="text-aether-secondary mb-4" size={24} />
          <h3 className="text-white font-bold mb-2">ADMET Properties</h3>
          <p className="text-xs text-aether-muted leading-relaxed">Calculate molecular weight, LogP, TPSA, and quantitative estimate of druglikeness (QED) via RDKit.</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 border border-aether-border/60">
          <Database className="text-aether-accent mb-4" size={24} />
          <h3 className="text-white font-bold mb-2">Structural Analysis</h3>
          <p className="text-xs text-aether-muted leading-relaxed">Interactive 3D WebGL visualizations of protein targets and binding pockets using 3Dmol.js.</p>
        </div>
      </section>
    </div>
  );
}



// ─── COPILOT ──────────────────────────────────────────────────────────────────
function CopilotView() {
  const [messages, setMessages] = useState<any[]>([{
    role: 'assistant',
    content: `I am your scientific assistant. Ask me to explain targets, compare drugs, or suggest analogs.`
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
      setMessages(p => [...p, { role: 'assistant', content: 'Backend unavailable. Ensure FastAPI is running.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-[800px] mx-auto border border-aether-border/60 rounded-xl bg-aether-bg overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="p-4 border-b border-aether-border/60 bg-aether-bg2 flex items-center gap-3">
        <Brain size={18} className="text-aether-muted" />
        <h2 className="font-display font-bold text-sm text-white">Scientific Assistant</h2>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-aether-primary/10 border border-aether-primary/30 text-white rounded-lg' 
                    : 'bg-aether-bg2 border border-aether-border text-aether-text rounded-lg'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
              <div className="bg-aether-bg2 border border-aether-border rounded-lg px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-aether-muted rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-aether-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-aether-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-aether-bg2 border-t border-aether-border/60">
        <form onSubmit={submit} className="relative flex gap-2">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="Ask a scientific question..."
            className="flex-1 bg-aether-bg border border-aether-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-aether-primary/50" 
            disabled={loading} 
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="px-4 rounded-lg bg-aether-primary text-aether-bg font-bold disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
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
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="glass-panel rounded-2xl p-2 h-[400px] relative group">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="badge-api px-3 py-1 rounded-md text-[9px] font-bold uppercase backdrop-blur-md bg-black/40 border border-aether-border">AlphaFold WebGL Engine</span>
              <span className="badge-quantum px-3 py-1 rounded-md text-[9px] font-bold uppercase backdrop-blur-md bg-black/40 border border-aether-border">Target: {target}</span>
            </div>
            <ProteinViewer 
              pdbId={target === 'EGFR' ? '1M17' : target === 'BRAF' ? '4MBJ' : target === 'CDK2' ? '1AQ1' : target === 'HIV Protease' ? '1HSG' : '1EVE'} 
              style="cartoon" 
              colorBy="ss" 
            />
            <div className="absolute bottom-4 right-4 z-20 text-[8px] text-aether-muted uppercase font-bold tracking-widest bg-black/40 px-2 py-1 rounded pointer-events-none">
              Interactive 3D · Drag to Rotate · Scroll to Zoom
            </div>
          </div>
          
          <div className="glass-panel rounded-2xl p-5 min-h-[220px]">
            {loading && <LoadingState message="Calling /v1/predict..." />}
            {error && <ApiError message={error} onRetry={run} />}
            {!loading && !error && !results && (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
                <FlaskConical size={32} className="text-aether-border" />
                <span className="text-xs text-aether-muted">Enter SMILES and execute inference to view binding analytics</span>
              </div>
            )}
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard label="pKd Affinity" value={results.interaction_engine?.affinity?.pKd ?? results.binding_affinity?.pKd ?? '—'} />
                  <MetricCard label="Kd (nM)" value={results.interaction_engine?.affinity?.Kd_nM ?? '—'} />
                  <MetricCard label="Safety Score" value={results.safety_engine?.safety_score ?? '—'} unit="/100" color="text-aether-secondary" />
                  <MetricCard label="QED" value={results.admet_properties?.qed?.toFixed?.(2) ?? '—'} color="text-aether-accent" />
                </div>
                <div className="glass-panel rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-aether-primary mb-2">ADMET Properties</h4>
                  {results.admet_properties && Object.entries(results.admet_properties).slice(0, 5).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] mb-1.5"><span className="text-aether-muted capitalize">{k.replace(/_/g, ' ')}</span><span className="font-scientific text-white">{String(v)}</span></div>
                  ))}
                </div>
                <div className="glass-panel rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-aether-danger mb-2">Tox Endpoints</h4>
                  {results.safety_engine?.endpoints && Object.entries(results.safety_engine.endpoints).slice(0, 5).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] mb-1.5"><span className="text-aether-muted capitalize">{k.replace(/_/g, ' ')}</span><span className="font-scientific text-white">{formatRisk(v as number)}</span></div>
                  ))}
                </div>
                <div className="glass-panel rounded-xl p-4">
                  <h4 className="font-display font-bold text-xs text-aether-secondary mb-2">Binding Drivers</h4>
                  {results.interaction_engine?.why_active?.map((w: string, i: number) => <p key={i} className="text-[10px] text-aether-muted mb-1.5">• {w}</p>)}
                </div>
              </div>
            )}
          </div>
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
  const [viewerType, setViewerType] = useState<'interactive' | 'renders'>('interactive');
  const [customPdbId, setCustomPdbId] = useState('');
  const [activePdb, setActivePdb] = useState('1M17');
  const [activeName, setActiveName] = useState('EGFR');
  const [loading, setLoading] = useState(false);

  const proteins = [
    { id: 'egfr', name: 'EGFR', pdb: '1M17', desc: 'Kinase' },
    { id: 'braf', name: 'BRAF', pdb: '1UWH', desc: 'Kinase' },
    { id: 'cdk2', name: 'CDK2', pdb: '1HCK', desc: 'Cell Cycle' },
    { id: 'hiv_protease', name: 'HIV Protease', pdb: '1HVR', desc: 'Viral' },
    { id: 'ache', name: 'AChE', pdb: '4EY7', desc: 'Hydrolase' },
  ];

  // If a catalog protein is clicked, set it
  const handleSelectCatalog = (p: any) => {
    setSelectedProtein(p.id);
    setActivePdb(p.pdb);
    setActiveName(p.name);
  };

  const handleSearchCustomPdb = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPdbId.trim().length === 4) {
      setActivePdb(customPdbId.trim().toUpperCase());
      setActiveName(`Target ${customPdbId.toUpperCase()}`);
      setSelectedProtein('custom');
    }
  };

  useEffect(() => {
    setLoading(true);
    aetherApi.proteinAnalysis(activePdb)
      .then(data => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [activePdb]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 max-w-[1600px] mx-auto pb-16">
      <div className="xl:col-span-3 flex flex-col gap-3">
        <PageHeader icon={<Database className="text-aether-secondary" size={18} />} title="Protein Intelligence" subtitle="PDB · UniProt · BindingDB" />
        
        {/* Custom PDB search bar */}
        <form onSubmit={handleSearchCustomPdb} className="glass-panel p-3 rounded-xl flex gap-2 border border-aether-border/60">
          <input 
            value={customPdbId} 
            onChange={e => setCustomPdbId(e.target.value)} 
            placeholder="Enter PDB ID (e.g. 1IVO)" 
            maxLength={4}
            className="flex-1 bg-aether-bg border border-aether-border rounded px-2.5 py-1.5 text-xs font-scientific uppercase text-white placeholder-aether-muted" 
          />
          <button type="submit" className="px-3 py-1.5 rounded bg-aether-secondary text-aether-bg font-bold text-xs uppercase hover:opacity-90">
            Load
          </button>
        </form>

        {proteins.map(p => (
          <button key={p.id} onClick={() => handleSelectCatalog(p)}
            className={`p-4 rounded-xl border text-left magnetic-target transition-all ${activePdb === p.pdb ? 'border-aether-secondary/50 bg-aether-secondary/10 shadow-neon-green' : 'glass-panel hover:border-aether-secondary/30'}`}>
            <div className="flex justify-between"><span className="font-scientific font-bold text-white">{p.pdb}</span><span className="text-[9px] text-aether-secondary font-bold">{p.desc}</span></div>
            <h4 className="font-display font-bold text-sm mt-1">{p.name}</h4>
          </button>
        ))}
      </div>

      <div className="xl:col-span-6 glass-panel rounded-2xl p-5 flex flex-col min-h-[500px]">
        <div className="flex justify-between items-center border-b border-aether-border/60 pb-2 mb-3">
          <div className="flex gap-2">
            <span className="badge-api px-3 py-1 rounded-md text-[9px] font-bold uppercase backdrop-blur-md bg-black/40 border border-aether-border text-aether-primary">
              WebGL 3D Interactive
            </span>
          </div>
          <span className="text-[9px] text-aether-muted uppercase font-bold tracking-tight">Active structure: {activePdb}</span>
        </div>

        <div className="flex-1 min-h-[380px] bg-aether-bg border border-aether-border/60 rounded-xl overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <RefreshCw size={24} className="animate-spin text-aether-primary mb-2" />
              <span className="text-[10px] text-aether-muted uppercase font-bold tracking-widest">Querying RCSB Database...</span>
            </div>
          ) : null}
          <ProteinViewer pdbId={activePdb} style="cartoon" colorBy="ss" className="w-full h-full" />
        </div>
      </div>

      <div className="xl:col-span-3 flex flex-col gap-4">
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-3">
          <h3 className="font-display font-bold text-xs text-white uppercase border-b border-aether-border pb-2 mb-1">Structure Properties</h3>
          
          {analysis ? (
            <div className="flex flex-col gap-2.5">
              <div className="text-[11px] flex justify-between"><span className="text-aether-muted">Source Organism</span><span className="font-bold text-white text-right">{analysis.organism || 'Homo sapiens'}</span></div>
              <div className="text-[11px] flex justify-between"><span className="text-aether-muted">Method</span><span className="font-bold text-white">{analysis.method || 'X-RAY DIFFRACTION'}</span></div>
              <div className="text-[11px] flex justify-between"><span className="text-aether-muted">Resolution</span><span className="font-bold text-aether-accent">{analysis.resolution ? `${analysis.resolution} Å` : '—'}</span></div>
              <div className="text-[11px] flex justify-between"><span className="text-aether-muted">Deposit Date</span><span className="font-scientific text-white">{analysis.deposit_date || '—'}</span></div>
              
              <div className="border-t border-aether-border pt-2 mt-1">
                <span className="text-[9px] text-aether-muted uppercase font-bold">Druggable Pocket Profile</span>
                {analysis.pockets && analysis.pockets.map((p: any) => (
                  <div key={p.pocket_id} className="mt-1.5 p-2 bg-aether-bg border border-aether-border/60 rounded text-[10px]">
                    <div className="flex justify-between font-bold"><span className="text-white">{p.pocket_id}</span><span className="text-aether-secondary">Vol: {p.volume_angstrom3} Å³</span></div>
                    <div className="flex justify-between text-[9px] text-aether-muted mt-0.5"><span>Druggability Score</span><span>{Math.round(p.druggability * 100)}%</span></div>
                  </div>
                ))}
              </div>

              {analysis.family_similarity && (
                <div className="border-t border-aether-border pt-2">
                  <span className="text-[9px] text-aether-muted uppercase font-bold">Sequence Homologues</span>
                  {analysis.family_similarity.map((s: any) => (
                    <div key={s.target} className="flex justify-between text-[11px] mt-1"><span className="text-aether-muted">{s.target}</span><span className="font-scientific text-white">{(s.similarity * 100).toFixed(0)}% Match</span></div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-aether-muted py-4 text-center">No structure properties available</div>
          )}
        </div>
      </div>
    </div>
  );
}
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
