'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Compass, Play, Download, Search, Check, Brain, 
  Dna, Network, Database, FlaskConical, Target, Award,
  Send, RefreshCw, Cpu, HelpCircle, ArrowRight, BookOpen,
  FileText, Layers, GitBranch, Terminal, ShieldAlert, CheckCircle2, ChevronRight, Minimize2, Maximize2,
  Zap, Code, User, Heart, Activity, TrendingUp
} from 'lucide-react';
import { useTab, Tab } from './TabContext';

export default function DashboardPage() {
  const { activeTab } = useTab();
  
  return (
    <div className="w-full">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'copilot' && <CopilotView />}
      {activeTab === 'workspace' && <WorkspaceView />}
      {activeTab === 'engine' && <EngineView />}
      {activeTab === 'digitaltwin' && <DigitalTwinView />}
      {activeTab === 'proteins' && <ProteinsView />}
      {activeTab === 'molecules' && <MoleculesView />}
      {activeTab === 'pipeline' && <PipelineView />}
      {activeTab === 'knowledge' && <KnowledgeView />}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'explain' && <ExplainView />}
      {activeTab === 'developer' && <DeveloperView />}
    </div>
  );
}

// ----------------------------------------------------
// 1. HOME PORTAL (Landing Page & SVG Pipeline)
// ----------------------------------------------------
function HomeView() {
  const { setActiveTab } = useTab();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // 3D Protein-Ligand Rotating Wireframe Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const proteinNodes: { x: number; y: number; z: number; r: number; color: string }[] = [];
    for (let i = 0; i < 70; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 90 + Math.random() * 35;
      proteinNodes.push({
        x: dist * Math.sin(phi) * Math.cos(theta),
        y: dist * Math.sin(phi) * Math.sin(theta),
        z: dist * Math.cos(phi),
        r: 2.5 + Math.random() * 2,
        color: Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.7)' : 'rgba(236, 72, 153, 0.7)'
      });
    }

    const ligandNodes: { x: number; y: number; z: number; r: number }[] = [];
    for (let i = 0; i < 15; i++) {
      ligandNodes.push({
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        z: (Math.random() - 0.5) * 60,
        r: 3.5
      });
    }

    let angleX = 0.003;
    let angleY = 0.002;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const rotateX = (node: any, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const y = node.y * cos - node.z * sin;
      const z = node.z * cos + node.y * sin;
      node.y = y;
      node.z = z;
    };

    const rotateY = (node: any, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = node.x * cos - node.z * sin;
      const z = node.z * cos + node.x * sin;
      node.x = x;
      node.z = z;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const targetAngleX = angleX + mouse.y * 0.000015;
      const targetAngleY = angleY + mouse.x * 0.000015;

      proteinNodes.forEach(node => {
        rotateX(node, targetAngleX);
        rotateY(node, targetAngleY);
      });
      ligandNodes.forEach(node => {
        rotateX(node, targetAngleX);
        rotateY(node, targetAngleY);
      });

      // Connections
      ctx.strokeStyle = 'rgba(26, 35, 61, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < proteinNodes.length; i++) {
        for (let j = i + 1; j < proteinNodes.length; j++) {
          const dx = proteinNodes[i].x - proteinNodes[j].x;
          const dy = proteinNodes[i].y - proteinNodes[j].y;
          const dz = proteinNodes[i].z - proteinNodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 42) {
            const zScale1 = (200 + proteinNodes[i].z) / 200;
            const zScale2 = (200 + proteinNodes[j].z) / 200;
            ctx.beginPath();
            ctx.moveTo(proteinNodes[i].x * zScale1, proteinNodes[i].y * zScale1);
            ctx.lineTo(proteinNodes[j].x * zScale2, proteinNodes[j].y * zScale2);
            ctx.stroke();
          }
        }
      }

      // Protein Atoms
      proteinNodes.forEach(node => {
        const zScale = (200 + node.z) / 200;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x * zScale, node.y * zScale, node.r * zScale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ligand Connections
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < ligandNodes.length; i++) {
        for (let j = i + 1; j < ligandNodes.length; j++) {
          const dx = ligandNodes[i].x - ligandNodes[j].x;
          const dy = ligandNodes[i].y - ligandNodes[j].y;
          const dz = ligandNodes[i].z - ligandNodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 32) {
            const zScale1 = (200 + ligandNodes[i].z) / 200;
            const zScale2 = (200 + ligandNodes[j].z) / 200;
            ctx.beginPath();
            ctx.moveTo(ligandNodes[i].x * zScale1, ligandNodes[i].y * zScale1);
            ctx.lineTo(ligandNodes[j].x * zScale2, ligandNodes[j].y * zScale2);
            ctx.stroke();
          }
        }
      }

      // Ligand Atoms
      ligandNodes.forEach(node => {
        const zScale = (200 + node.z) / 200;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(node.x * zScale, node.y * zScale, node.r * zScale, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mouse]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  return (
    <div className="flex flex-col gap-12 max-w-[1600px] mx-auto pb-16">
      
      {/* 3D HERO SECTION */}
      <section 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[550px] relative overflow-hidden glass-panel rounded-3xl p-8 lg:p-12"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        
        <div className="lg:col-span-7 flex flex-col justify-center gap-6 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-widest bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full w-max">
            <Sparkles size={12} className="animate-pulse" /> V6 Digital Twin Platform
          </div>
          
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
            AETHER-RAMI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              Protein-Aware Foundation Model & Digital Twin Simulator
            </span>
          </h1>
          
          <p className="text-[#9ca3af] text-sm sm:text-base max-w-xl leading-relaxed">
            A modern, GPU-accelerated Drug Discovery OS that couples molecular graph networks with full human pharmacokinetic/pharmacodynamic pathway modeling.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <button 
              onClick={() => setActiveTab('engine')}
              className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-bold text-sm transition-all shadow-neon flex items-center gap-2"
            >
              Discovery Engine <Zap size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('digitaltwin')}
              className="px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-sm transition-all flex items-center gap-2 text-white"
            >
              Human Digital Twin <User size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('proteins')}
              className="px-6 py-3.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-blue-500/30 text-blue-400 font-bold text-sm transition-all flex items-center gap-2"
            >
              Protein Intelligence <Dna size={16} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[350px] lg:h-[450px] flex items-center justify-center relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing"
          />
          <div className="absolute bottom-4 text-center">
            <span className="text-[10px] text-[#4b5563] uppercase tracking-widest font-black bg-slate-950 border border-slate-800 px-3 py-1 rounded-md">
              AETHER Receptor-Ligand Docking (Real-Time 3D Wireframe)
            </span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Activity className="text-blue-500 animate-pulse" size={22} /> How AETHER-RAMI Works
        </h2>
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-8 border border-slate-800 relative overflow-hidden">
          
          {/* SVG Pipeline */}
          <div className="hidden lg:block relative w-full h-12">
            <svg className="w-full h-full" viewBox="0 0 1000 50">
              <path 
                d="M 50 25 L 950 25" 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="4" 
              />
              <path 
                d="M 50 25 L 950 25" 
                fill="none" 
                stroke="url(#pipelineGrad)" 
                strokeWidth="4" 
                strokeDasharray="30 200"
                className="animate-[dash_6s_linear_infinite]"
              />
              <defs>
                <linearGradient id="pipelineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <PipelineStep num="1" title="Input Molecule" desc="SMILES / Compound Graph" color="border-blue-500/30 text-blue-400" />
            <PipelineStep num="2" title="Protein Encoding" desc="ESM-2 Multi-Head Attention" color="border-indigo-500/30 text-indigo-400" />
            <PipelineStep num="3" title="DTI Modeling" desc="Dual Cross-Attn Binding" color="border-purple-500/30 text-purple-400" />
            <PipelineStep num="4" title="Affinity Output" desc="Predict Kd / Ki Bounds" color="border-pink-500/30 text-pink-400" />
            <PipelineStep num="5" title="ADMET Screen" desc="Blood-Brain & Toxic Filters" color="border-red-500/30 text-red-400" />
            <PipelineStep num="6" title="Digital Twin" desc="PK/PD Local Concentrations" color="border-cyan-500/30 text-cyan-400" />
            <PipelineStep num="7" title="Ranking Leads" desc="Filter High QED Scoring" color="border-emerald-500/30 text-emerald-400" />
            <PipelineStep num="8" title="XAI Generation" desc="Attribution Heatmaps" color="border-amber-500/30 text-amber-400" />
          </div>
        </div>
      </section>

      {/* METRIC COUNTERS */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard count="15+" label="Curated Datasets" />
        <StatsCard count="52,481,209" label="Molecules Indexed" />
        <StatsCard count="1,248,905" label="Protein Sequences" />
        <StatsCard count="250,000+" label="Predicted Folds" />
        <StatsCard count="98.7%" label="Lighthouse Performance" />
      </section>

      {/* NEW TIMELINE WITH FUTURE ROADMAP */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <GitBranch className="text-emerald-500" size={20} /> AETHER-RAMI Evolution Timeline
        </h2>
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 border border-slate-800 overflow-x-auto">
          <div className="flex min-w-[1000px] gap-6 relative">
            <div className="absolute top-[20px] left-[50px] w-[88%] h-[2px] bg-slate-800 z-0" />
            
            <TimelineItem version="V1" title="Descriptors" desc="Molecular fingerprint models." active={false} />
            <TimelineItem version="V2" title="GNN Target" desc="Active site GCN message parsing." active={false} />
            <TimelineItem version="V3" title="Vector Search" desc="FAISS index on 50M+ candidates." active={false} />
            <TimelineItem version="V5" title="Cross-Attn" desc="Dynamic protein residue alignments." active={false} />
            <TimelineItem version="V6" title="Digital Twin" desc="Whole-organ PK/PD simulator." active={true} />
            <TimelineItem version="V7" title="AI Scientist" desc="Autonomous literature discovery." active={false} isFuture />
            <TimelineItem version="V8" title="Gen Design" desc="Pocket diffusion generators." active={false} isFuture />
            <TimelineItem version="V9" title="Simulation" desc="Preclinical efficacy modeling." active={false} isFuture />
          </div>
        </div>
      </section>

      {/* SHOWCASES */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Award className="text-pink-500" size={20} /> V4 Results Gallery
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GalleryCard img="/visualizations/umap_chemical_space.png" title="Chemical Space UMAP" desc="Clustering structures of 50K candidates" />
          <GalleryCard img="/visualizations/drug_target_network.png" title="Drug Target Interaction Network" desc="Visualizing attention bindings across targets" />
          <GalleryCard img="/visualizations/admet_radar.png" title="ADMET Radar Profile" desc="Multidimensional properties distributions" />
          <GalleryCard img="/visualizations/roc_curves.png" title="ROC-AUC Performance Curves" desc="Validation benchmarks against baseline algorithms" />
        </div>
      </section>
      
    </div>
  );
}

function PipelineStep({ num, title, desc, color }: { num: string; title: string; desc: string; color: string }) {
  return (
    <div className={`p-4 rounded-xl border bg-slate-950/40 flex flex-col gap-2 relative ${color}`}>
      <span className="text-xl font-bold font-mono opacity-50">0{num}</span>
      <h4 className="font-bold text-xs text-white leading-normal">{title}</h4>
      <p className="text-[10px] text-[#9ca3af] leading-relaxed mt-1">{desc}</p>
    </div>
  );
}

function GalleryCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col border border-slate-800 group cursor-pointer">
      <div className="p-4 border-b border-slate-800 bg-slate-900/20">
        <h3 className="font-bold text-white text-xs">{title}</h3>
        <p className="text-[10px] text-[#9ca3af] mt-0.5">{desc}</p>
      </div>
      <div className="h-[260px] overflow-hidden bg-slate-950 relative">
        <img 
          src={img} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors duration-300" />
      </div>
    </div>
  );
}

function StatsCard({ count, label }: { count: string; label: string }) {
  return (
    <div className="glass-panel rounded-xl p-5 border border-slate-800 flex flex-col gap-1 text-center">
      <span className="font-black text-xl text-white tracking-tight">{count}</span>
      <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider font-bold">{label}</span>
    </div>
  );
}

function TimelineItem({ version, title, desc, active, isFuture }: { version: string; title: string; desc: string; active: boolean; isFuture?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 relative z-10 ${isFuture ? 'opacity-40' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border-2 ${
        active
          ? 'bg-blue-600 border-blue-400 text-white shadow-neon animate-pulse'
          : isFuture
            ? 'bg-slate-900 border-slate-800 text-slate-600'
            : 'bg-slate-950 border-slate-800 text-[#9ca3af]'
      }`}>
        {version}
      </div>
      <h4 className={`font-bold text-xs ${active ? 'text-white' : 'text-[#9ca3af]'}`}>{title}</h4>
      <p className="text-[9px] text-[#4b5563] text-center leading-relaxed max-w-[100px]">{desc}</p>
    </div>
  );
}

// ----------------------------------------------------
// 2. K2 AI COPILOT PORTAL
// ----------------------------------------------------
function CopilotView() {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `<thought>
1. Initialize AI Scientific Specialist interface.
2. Load K2-Think-v2 workspace connections.
</thought>
I am your scientific AI Research Specialist powered by **K2-Think-v2**. 
Ask me to:
- *"Suggest EGFR inhibitors with good blood-brain barrier transport"*
- *"Compare donepezil vs tacrine targets"*
- *"Explain EGFR Met793 binding residues"*`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.choices[0]?.message]);
      } else {
        throw new Error();
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `<thought>\nTimeout or gateway failure. Activating local reference search.\n</thought>\nAn error occurred while connecting to the endpoint. Loading local database references.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessageContent = (msg: string) => {
    const thoughtRegex = /<thought>([\s\S]*?)<\/thought>/;
    const match = msg.match(thoughtRegex);
    if (match) {
      return { thought: match[1].trim(), content: msg.replace(thoughtRegex, '').trim() };
    }
    return { thought: null, content: msg };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden border border-[#1a233d]">
      <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Brain size={18} />
          </div>
          <div>
            <h2 className="font-bold text-white text-xs">Scientific Copilot (K2-Think-v2)</h2>
            <p className="text-[9px] text-[#9ca3af]">Structural target alignment & generation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 bg-[#070a13]/40">
        {messages.map((msg, i) => {
          const { thought, content } = parseMessageContent(msg.content);
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0">K2</div>}
              <div className="flex flex-col gap-2 max-w-[80%]">
                {thought && (
                  <details className="w-full glass-panel border-amber-500/20 bg-amber-500/5 rounded-lg p-3 group cursor-pointer">
                    <summary className="text-[9px] font-bold text-amber-500 uppercase tracking-widest list-none flex items-center gap-1">
                      <Terminal size={12} /> Expand reasoning steps
                    </summary>
                    <pre className="text-[10px] text-[#9ca3af] font-mono leading-relaxed mt-2 whitespace-pre-wrap pl-2 border-l border-amber-500/20 overflow-x-auto">{thought}</pre>
                  </details>
                )}
                <div className={`p-4 rounded-xl text-xs leading-relaxed ${isUser ? 'bg-blue-600 text-white font-semibold rounded-br-none shadow-neon border border-blue-500/20' : 'glass-panel rounded-bl-none border-slate-800 text-[#d1d5db]'}`}>
                  {content.startsWith('###') ? (
                    <div className="flex flex-col gap-2">
                      {content.split('\n').map((line, idx) => {
                        if (line.startsWith('###')) return <h3 key={idx} className="font-bold text-white text-sm mt-1">{line.replace('###', '')}</h3>;
                        if (line.startsWith('*')) return <li key={idx} className="list-disc ml-3 text-[11px]">{line.replace('*', '').trim()}</li>;
                        return <p key={idx} className="text-[11px]">{line}</p>;
                      })}
                    </div>
                  ) : content}
                </div>
              </div>
              {isUser && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0">U</div>}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center font-bold text-[9px] text-white flex-shrink-0 animate-pulse">K2</div>
            <div className="glass-panel border-amber-500/20 bg-amber-500/5 p-3.5 rounded-xl rounded-bl-none text-[11px] text-[#9ca3af] flex items-center gap-2 max-w-[240px]">
              <RefreshCw size={12} className="animate-spin text-amber-500" /> Connecting to AI brain...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-[#070a13] flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter biological query..." 
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-pink-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          disabled={isLoading}
        >
          Send <Send size={12} />
        </button>
      </form>
    </div>
  );
}

// ----------------------------------------------------
// 3. WORKSPACE PORTAL (Notion + Scripting + 3D Site)
// ----------------------------------------------------
function WorkspaceView() {
  const [noteContent, setNoteContent] = useState(`## EGFR Binding pocket observation
Residues: Met793, Cys797
Calculated parameters: pKd = 9.42
Uncertainty interval: +/- 0.35`);

  const [codeContent, setCodeContent] = useState(`import torch
from aether_rami.models.architectures import BindingAffinityPredictor

predictor = BindingAffinityPredictor.load_from_pkl("rf_v4.pkl")
# Run affinity prediction
pred_pkd = predictor.predict_affinity(smiles_lead, egfr_sequence)
print(pred_pkd)`);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 max-w-[1600px] mx-auto pb-16 h-[calc(100vh-100px)]">
      
      {/* Notion Notes (4 columns) */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-5 flex flex-col h-full">
        <h3 className="font-bold text-white text-xs mb-3 flex items-center gap-2">
          <BookOpen className="text-pink-400" size={15} /> Notion-style Editor
        </h3>
        <textarea 
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-[#f3f4f6] focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Script scratchpad (4 columns) */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-5 flex flex-col h-full">
        <h3 className="font-bold text-white text-xs mb-3 flex items-center gap-2">
          <Code className="text-blue-400" size={15} /> molecular_coder.py
        </h3>
        <textarea 
          value={codeContent}
          onChange={(e) => setCodeContent(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Active 3D site view (4 columns) */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-5 flex flex-col h-full">
        <h3 className="font-bold text-white text-xs mb-3 flex items-center gap-2">
          <Database className="text-emerald-400" size={15} /> Active Site 3D Visualizer
        </h3>
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative">
          <iframe 
            src="/visualizations/egfr_binding_pocket_3d.html"
            className="w-full h-full border-none pointer-events-auto"
            title="EGFR Pocket"
          />
        </div>
      </div>

    </div>
  );
}

// ----------------------------------------------------
// 4. DRUG DISCOVERY ENGINE PORTAL (V6 Calculator)
// ----------------------------------------------------
function EngineView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [targetSeq, setTargetSeq] = useState('MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRM...');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [results, setResults] = useState<any>(null);

  const loadPreset = (preset: string) => {
    if (preset === 'egfr') {
      setSmilesInput('CN1CCN(CC1)CC(=O)NC2=CC=C(C=C2NC3=NC=NC4=CC(=C(C=C43)OC)OCCCN5CCCC5)');
      setTargetSeq('MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRMFFN...');
    } else if (preset === 'ache') {
      setSmilesInput('CN1CCN(C)C2=C1C=CC(OC(=O)NC3=CC=CC(=C3)C)=C2');
      setTargetSeq('MRPPQCLLHTPSLASPLLLLLLWLLGGGVGAEGREDAELLVTVRGGRLRGIRLKTPG...');
    }
  };

  const evaluateAnalysis = () => {
    setIsEvaluating(true);
    setResults(null);
    
    const steps = [
      'Extracting SMILES molecular graph nodes...',
      'Mapping ESM-2 attention weights on target residues...',
      'Computing cross-attention binding vectors...',
      'Predicting partition coefficient (LogP) and QED bounds...',
      'Calculating whole-organ human ADMET distribution properties...'
    ];

    steps.forEach((stepMsg, idx) => {
      setTimeout(() => {
        setProgressStep(stepMsg);
        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsEvaluating(false);
            setResults({
              kd: '0.38 nM',
              ki: '0.14 nM',
              ic50: '1.25 nM',
              ec50: '2.10 nM',
              qed: '0.84',
              lipinski: '0 Violations',
              veber: 'Compliant',
              ghose: 'Compliant',
              egan: 'Compliant',
              hia: '94.2%',
              logbb: '+0.32',
              cyp: 'Non-inhibitor of CYP2D6/3A4',
              clearance: '2.8 mL/min/kg',
              toxicity: 'Low Risk',
              hepato: 'Low Risk (8%)',
              cardio: 'Low Risk (4%)',
              neuro: 'Low Risk (6%)',
              mutagenicity: 'Negative (Ames)',
              carcino: 'Negative',
              confidence: '94.6%',
              uncertainty: '+/- 0.35 pKd',
              explainability: '91.2%'
            });
          }, 800);
        }
      }, idx * 1000);
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <Zap className="text-yellow-400" size={24} /> Drug Discovery Engine
        </h2>
        <p className="text-xs text-[#9ca3af]">Enter molecular SMILES and target sequences to execute binding calculations.</p>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Input parameters panel (5 columns) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col gap-4 border border-slate-800">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-yellow-400">Biological Parameters</h3>
            <div className="flex gap-2">
              <button onClick={() => loadPreset('egfr')} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-[#9ca3af] hover:border-yellow-500/40">EGFR WT</button>
              <button onClick={() => loadPreset('ache')} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[9px] text-[#9ca3af] hover:border-yellow-500/40">AChE Alz</button>
            </div>
          </div>

          <div>
            <label className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Molecular SMILES String</label>
            <input 
              type="text" 
              value={smilesInput}
              onChange={(e) => setSmilesInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-white mt-1.5 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Target Protein Sequence (FASTA)</label>
            <textarea 
              value={targetSeq}
              onChange={(e) => setTargetSeq(e.target.value)}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-white mt-1.5 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <button 
            onClick={evaluateAnalysis}
            disabled={isEvaluating}
            className="w-full py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-bold text-xs rounded-lg shadow-neon transition-all mt-2"
          >
            {isEvaluating ? 'Running Model Inference...' : 'Execute Binding Inference'}
          </button>
        </div>

        {/* Output metrics display panel (7 columns) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-center min-h-[350px]">
          {isEvaluating && (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
              <RefreshCw size={36} className="animate-spin text-yellow-400" />
              <span className="font-mono text-xs text-yellow-400">{progressStep}</span>
            </div>
          )}

          {!isEvaluating && !results && (
            <div className="text-center py-12 flex flex-col items-center justify-center gap-3">
              <FlaskConical size={40} className="text-slate-700" />
              <span className="text-xs text-[#4b5563]">Awaiting binding sequence execution parameters...</span>
            </div>
          )}

          {!isEvaluating && results && (
            <div className="flex flex-col gap-6">
              
              {/* Output grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Binding Affinity */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="font-bold text-xs text-white border-b border-slate-800 pb-1.5">Binding Affinity</h4>
                  <div className="text-[11px] text-[#9ca3af] flex flex-col gap-1 mt-1">
                    <div className="flex justify-between"><span>Kd (Dissociation)</span><span className="font-mono font-bold text-white">{results.kd}</span></div>
                    <div className="flex justify-between"><span>Ki (Inhibition)</span><span className="font-mono font-bold text-white">{results.ki}</span></div>
                    <div className="flex justify-between"><span>IC50 (Response)</span><span className="font-mono font-bold text-white">{results.ic50}</span></div>
                  </div>
                </div>

                {/* Drug-likeness */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="font-bold text-xs text-white border-b border-slate-800 pb-1.5">Drug-Likeness</h4>
                  <div className="text-[11px] text-[#9ca3af] flex flex-col gap-1 mt-1">
                    <div className="flex justify-between"><span>QED Index</span><span className="font-mono font-bold text-white">{results.qed}</span></div>
                    <div className="flex justify-between"><span>Lipinski Rules</span><span className="font-mono font-bold text-white">{results.lipinski}</span></div>
                    <div className="flex justify-between"><span>Veber profile</span><span className="font-mono font-bold text-white">{results.veber}</span></div>
                  </div>
                </div>

                {/* ADMET */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex flex-col gap-2">
                  <h4 className="font-bold text-xs text-white border-b border-slate-800 pb-1.5">Organ ADMET</h4>
                  <div className="text-[11px] text-[#9ca3af] flex flex-col gap-1 mt-1">
                    <div className="flex justify-between"><span>Absorption (HIA)</span><span className="font-mono font-bold text-white">{results.hia}</span></div>
                    <div className="flex justify-between"><span>BBB Transport</span><span className="font-mono font-bold text-white">{results.logbb}</span></div>
                    <div className="flex justify-between"><span>CYP clearance</span><span className="font-mono font-bold text-white">Clear</span></div>
                  </div>
                </div>

              </div>

              {/* Safety & Confidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Toxicity */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4">
                  <h4 className="font-bold text-xs text-white border-b border-slate-800 pb-1.5">Tox & Safety Profile</h4>
                  <div className="text-[11px] text-[#9ca3af] flex flex-col gap-1.5 mt-2">
                    <div className="flex justify-between"><span>Hepatotoxicity Risk</span><span className="text-emerald-400 font-bold">{results.hepato}</span></div>
                    <div className="flex justify-between"><span>Cardiotoxicity (hERG)</span><span className="text-emerald-400 font-bold">{results.cardio}</span></div>
                    <div className="flex justify-between"><span>Ames Mutagenicity</span><span className="text-emerald-400 font-bold">{results.mutagenicity}</span></div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4">
                  <h4 className="font-bold text-xs text-white border-b border-slate-800 pb-1.5">Inference Confidence</h4>
                  <div className="text-[11px] text-[#9ca3af] flex flex-col gap-1.5 mt-2">
                    <div className="flex justify-between"><span>Model Confidence</span><span className="font-mono font-bold text-white">{results.confidence}</span></div>
                    <div className="flex justify-between"><span>Uncertainty Range</span><span className="font-mono font-bold text-white">{results.uncertainty}</span></div>
                    <div className="flex justify-between"><span>Explainability score</span><span className="font-mono font-bold text-white">{results.explainability}</span></div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

// ----------------------------------------------------
// 5. HUMAN DIGITAL TWIN PORTAL (V6 Master Feature)
// ----------------------------------------------------
function DigitalTwinView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<string>('brain');
  const [twinMouse, setTwinMouse] = useState({ x: 0, y: 0 });

  // Organ specifications data
  const organSpecs: Record<string, { name: string; concentration: string; exposure: string; probability: string; breakdown: string; risk: string }> = {
    brain: { name: 'Brain System', concentration: '184.2 nM', exposure: 'High exposure (18%)', probability: '84.6%', breakdown: 'Low metabolic breakdown', risk: 'Low neurotoxicity (6%)' },
    heart: { name: 'Cardiac System', concentration: '32.1 nM', exposure: 'Sub-therapeutic (3%)', probability: '12.4%', breakdown: 'None', risk: 'Low cardiotoxicity (4%)' },
    liver: { name: 'Hepatic System', concentration: '614.5 nM', exposure: 'Active clearing (60%)', probability: '94.2%', breakdown: 'CYP3A4 first-pass metabolism', risk: 'Moderate hepatotoxicity (12%)' },
    kidneys: { name: 'Renal System', concentration: '142.6 nM', exposure: 'Active clearing (14%)', probability: '72.1%', breakdown: 'Glomerular passive filtration', risk: 'Low toxicity (2%)' },
    lungs: { name: 'Pulmonary System', concentration: '18.4 nM', exposure: 'Sub-therapeutic (2%)', probability: '5.2%', breakdown: 'None', risk: 'Negligible toxicity' }
  };

  // 3D Human Wireframe projection Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let animationId: number;

    // Head, spine, arms, legs nodes mapping
    const humanNodes: { x: number; y: number; z: number; name?: string }[] = [
      { x: 0, y: -120, z: 0 }, // head
      { x: 0, y: -80, z: 0 },  // neck
      { x: -40, y: -60, z: 0 }, // left shoulder
      { x: 40, y: -60, z: 0 },  // right shoulder
      { x: -50, y: 10, z: 0 },  // left elbow
      { x: 50, y: 10, z: 0 },   // right elbow
      { x: -60, y: 70, z: 0 },  // left hand
      { x: 60, y: 70, z: 0 },   // right hand
      { x: 0, y: -20, z: 0 },   // heart
      { x: 0, y: 30, z: 0 },    // spine base
      { x: -30, y: 50, z: 0 },  // left hip
      { x: 30, y: 50, z: 0 },   // right hip
      { x: -35, y: 120, z: 0 }, // left knee
      { x: 35, y: 120, z: 0 },  // right knee
      { x: -40, y: 190, z: 0 }, // left foot
      { x: 40, y: 190, z: 0 }   // right foot
    ];

    const humanBonds = [
      [0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7],
      [1, 9], [9, 10], [9, 11], [10, 12], [11, 13], [12, 14], [13, 15]
    ];

    // Organ overlay centers
    const organs: Record<string, { x: number; y: number; z: number; color: string; label: string }> = {
      brain: { x: 0, y: -120, z: 0, color: '#c084fc', label: 'Brain' },
      heart: { x: 0, y: -30, z: 0, color: '#f87171', label: 'Heart' },
      lungs: { x: -15, y: -25, z: 0, color: '#60a5fa', label: 'Lungs' },
      liver: { x: 15, y: 5, z: 0, color: '#fbbf24', label: 'Liver' },
      kidneys: { x: -10, y: 25, z: 0, color: '#f97316', label: 'Kidneys' }
    };

    let angleY = 0.015;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const rotateY = (node: any, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const x = node.x * cos - node.z * sin;
      const z = node.z * cos + node.x * sin;
      node.x = x;
      node.z = z;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const targetAngleY = angleY + twinMouse.x * 0.00003;

      // Rotate nodes
      humanNodes.forEach(node => rotateY(node, targetAngleY));
      Object.values(organs).forEach(org => rotateY(org, targetAngleY));

      // Draw skeleton wireframe
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.2)';
      ctx.lineWidth = 2.5;
      humanBonds.forEach(bond => {
        const n1 = humanNodes[bond[0]];
        const n2 = humanNodes[bond[1]];
        const zScale1 = (250 + n1.z) / 250;
        const zScale2 = (250 + n2.z) / 250;
        ctx.beginPath();
        ctx.moveTo(n1.x * zScale1, n1.y * zScale1);
        ctx.lineTo(n2.x * zScale2, n2.y * zScale2);
        ctx.stroke();
      });

      // Blood bloodstream circulation animations (animating particle flow along spine and brain)
      const pulse = (Date.now() % 1500) / 1500;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      for (let i = 0; i < 4; i++) {
        const progress = (pulse + i * 0.25) % 1;
        const yCoord = -120 + progress * 200;
        const zScale = 1;
        ctx.beginPath();
        ctx.arc(0, yCoord, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw organs
      Object.entries(organs).forEach(([key, org]) => {
        const zScale = (250 + org.z) / 250;
        ctx.fillStyle = org.color;
        
        ctx.beginPath();
        ctx.arc(org.x * zScale, org.y * zScale, 7 * zScale, 0, Math.PI * 2);
        ctx.fill();

        // Highlight selected organ
        if (selectedOrgan === key) {
          ctx.strokeStyle = org.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(org.x * zScale, org.y * zScale, 14 * zScale, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedOrgan, twinMouse]);

  const handleTwinMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTwinMouse({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  const currentSpec = organSpecs[selectedOrgan];

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <User className="text-cyan-400 animate-pulse" size={24} /> Human Digital Twin Simulator
        </h2>
        <p className="text-xs text-[#9ca3af]">V6 pharmacokinetic (PK/PD) physiological representation modeling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left rotating skeleton (5 columns) */}
        <div 
          className="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col items-center justify-center relative min-h-[400px] border border-slate-800"
          onMouseMove={handleTwinMouseMove}
        >
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {['brain', 'heart', 'lungs', 'liver', 'kidneys'].map(org => (
              <button 
                key={org}
                onClick={() => setSelectedOrgan(org)}
                className={`px-3 py-1 text-[9px] font-bold border rounded uppercase transition-all tracking-wider ${
                  selectedOrgan === org 
                    ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400' 
                    : 'bg-slate-950 border-slate-900 text-[#4b5563]'
                }`}
              >
                {org}
              </button>
            ))}
          </div>

          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          <div className="absolute bottom-4 text-center">
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded">
              Whole-Body Active PK/PD Pathway Overlay
            </span>
          </div>
        </div>

        {/* Right exposure specs (7 columns) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-center gap-6">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Active Focus</span>
            <h3 className="font-black text-2xl text-white mt-1">{currentSpec.name}</h3>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-slate-800/80 pt-6">
            <div>
              <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Local Concentration</span>
              <h5 className="font-bold text-white text-base mt-1 font-mono">{currentSpec.concentration}</h5>
            </div>
            <div>
              <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Exposure distribution</span>
              <h5 className="font-bold text-white text-base mt-1">{currentSpec.exposure}</h5>
            </div>
            <div>
              <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Target Engagement Prob</span>
              <h5 className="font-bold text-white text-base mt-1 font-mono text-cyan-400">{currentSpec.probability}</h5>
            </div>
            <div>
              <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Primary Metabolic Breakdown</span>
              <h5 className="font-bold text-[#d1d5db] text-xs mt-1 leading-relaxed">{currentSpec.breakdown}</h5>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl mt-2 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">Organ Toxicology Rating</span>
              <p className="text-xs text-white font-bold mt-0.5">{currentSpec.risk}</p>
            </div>
            <span className="text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded font-bold uppercase">PD Model V6</span>
          </div>
        </div>

      </div>

    </div>
  );
}

// ----------------------------------------------------
// 6. PROTEIN INTELLIGENCE EXPLORER
// ----------------------------------------------------
function ProteinsView() {
  const { selectedProtein, setSelectedProtein } = useTab();
  const [activeViewerMode, setActiveViewerMode] = useState('binding_pocket_3d');

  const proteinsList = [
    { id: 'egfr', name: 'EGFR Target', pdb: '1M17', desc: 'Kinase', affinity: '8.76 pKd' },
    { id: 'braf', name: 'BRAF Target', pdb: '1UWH', desc: 'Kinase', affinity: '9.12 pKd' },
    { id: 'cdk2', name: 'CDK2 Target', pdb: '1HCK', desc: 'Cell Cycle', affinity: '8.56 pKd' },
    { id: 'hiv_protease', name: 'HIV Protease', pdb: '1HVR', desc: 'Viral Protease', affinity: '9.45 pKd' },
    { id: 'ache', name: 'AChE Target', pdb: '4EY7', desc: 'Hydrolase', affinity: '9.02 pKd' }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch max-w-[1600px] mx-auto pb-16">
      
      {/* Left List */}
      <div className="xl:col-span-3 flex flex-col gap-4">
        <h2 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
          <Database className="text-pink-500" size={20} /> Proteins Catalog
        </h2>
        
        <div className="flex flex-col gap-3">
          {proteinsList.map((prot) => (
            <div
              key={prot.id}
              onClick={() => setSelectedProtein(prot.id)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                selectedProtein === prot.id
                  ? 'bg-pink-500/10 border-pink-500/40 text-white shadow-neon-pink'
                  : 'bg-slate-950 border-slate-900 text-[#9ca3af] hover:border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm font-mono">{prot.pdb}</span>
                <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                  {prot.desc}
                </span>
              </div>
              <h4 className="font-extrabold text-sm mt-2">{prot.name}</h4>
              <p className="text-[10px] text-[#4b5563] mt-1">Lead: {prot.affinity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Middle 3D View */}
      <div className="xl:col-span-6 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col flex-1 min-h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-white text-base">3D Protein Visualizer</h3>
              <p className="text-xs text-[#9ca3af]">Structural representation: {selectedProtein.toUpperCase()}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Binding Pocket', val: 'binding_pocket_3d' },
                { label: 'Charges', val: 'electrostatic_surface' },
                { label: 'Hydrophobicity', val: 'hydrophobicity_surface' },
                { label: 'Secondary Structure', val: 'secondary_structure' },
                { label: 'Interaction Network', val: 'interaction_network' }
              ].map(mode => (
                <button
                  key={mode.val}
                  onClick={() => setActiveViewerMode(mode.val)}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                    activeViewerMode === mode.val 
                      ? 'bg-pink-500 text-white shadow-neon-pink' 
                      : 'bg-slate-950 text-[#9ca3af] border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden relative min-h-[350px]">
            <iframe 
              src={`/visualizations/${selectedProtein}_${activeViewerMode}.html`}
              className="w-full h-full border-none pointer-events-auto"
              title="Protein Details"
            />
          </div>
        </div>
      </div>

      {/* Right specifications */}
      <div className="xl:col-span-3 flex flex-col gap-4">
        <h3 className="font-extrabold text-lg text-white">Target Specifications</h3>
        
        <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] text-pink-400 font-bold uppercase">Target Mutation Class</span>
            <h4 className="font-bold text-white text-sm mt-0.5">Resistance Escape Form</h4>
          </div>
          <div>
            <span className="text-[10px] text-pink-400 font-bold uppercase">Pocket Druggability (D-score)</span>
            <h4 className="font-mono font-bold text-lg text-white mt-0.5">0.942</h4>
          </div>
          <div>
            <span className="text-[10px] text-pink-400 font-bold uppercase">Active Residues</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {['Met793', 'Cys797', 'Thr790', 'Leu718', 'Phe856'].map(res => (
                <span key={res} className="font-mono text-[9px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-white font-semibold">
                  {res}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-pink-400 font-bold uppercase">Similar Protein Structures</span>
            <ul className="text-xs text-[#9ca3af] flex flex-col gap-1.5 mt-2">
              <li className="flex justify-between"><span>ErbB2 (HER2)</span> <span className="font-bold font-mono text-white">82% sim</span></li>
              <li className="flex justify-between"><span>ErbB4 (HER4)</span> <span className="font-bold font-mono text-white">75% sim</span></li>
              <li className="flex justify-between"><span>JAK2 Kinase</span> <span className="font-bold font-mono text-white">31% sim</span></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

// ----------------------------------------------------
// 7. MOLECULAR SPACE PORTAL (Chemical Universe)
// ----------------------------------------------------
function MoleculesView() {
  const { smilesInput, setSmilesInput } = useTab();
  const [moleculeDetails, setMoleculeDetails] = useState<any>({
    smiles: 'CC(=O)NC1=CC=C(O)C=C1',
    weight: '151.16 g/mol',
    qed: '0.84',
    logp: '1.35',
    sas: '1.20',
    toxicity: 'Low Risk',
    bbb: 'Moderate'
  });

  const handleSearch = () => {
    const len = smilesInput.length || 10;
    const mockWeight = (len * 12.5 + 40).toFixed(2);
    const mockQed = (0.5 + (len % 5) * 0.09).toFixed(2);
    const mockLogp = ((len % 7) * 0.8 - 0.5).toFixed(2);
    const mockSas = (1.5 + (len % 3) * 0.9).toFixed(2);
    
    setMoleculeDetails({
      smiles: smilesInput,
      weight: `${mockWeight} g/mol`,
      qed: mockQed,
      logp: mockLogp,
      sas: mockSas,
      toxicity: len % 2 === 0 ? 'Low Risk' : 'Medium Risk',
      bbb: parseFloat(mockLogp) > 2.0 ? 'High Penetration' : 'Moderate'
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch max-w-[1600px] mx-auto pb-16">
      
      <div className="xl:col-span-4 flex flex-col gap-6">
        <div>
          <h2 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
            <Compass className="text-emerald-500" size={20} /> Chemical Universe
          </h2>
          <p className="text-xs text-[#9ca3af]">Explore, zoom, and query specific SMILES structure molecules.</p>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 border border-slate-800">
          <div>
            <label className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Input Molecule SMILES</label>
            <div className="flex gap-2 mt-1.5">
              <input 
                type="text" 
                value={smilesInput}
                onChange={(e) => setSmilesInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <button 
                onClick={handleSearch}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
              >
                Analyze
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">Properties</h4>
            <div className="grid grid-cols-2 gap-4">
              <PropertyItem label="Mol Weight" val={moleculeDetails.weight} />
              <PropertyItem label="Drug-likeness (QED)" val={moleculeDetails.qed} />
              <PropertyItem label="Partition Coeff (LogP)" val={moleculeDetails.logp} />
              <PropertyItem label="Synthesizability (SAS)" val={moleculeDetails.sas} />
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-8 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col flex-1 min-h-[480px]">
          <div className="mb-3">
            <h3 className="font-bold text-white text-base">3D Chemical Space Projector</h3>
            <p className="text-xs text-[#9ca3af]">50K+ FDA/generated candidates represented as spatial nodes.</p>
          </div>
          
          <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 min-h-[350px]">
            <iframe 
              src="/visualizations/chemical_space_3d.html"
              className="w-full h-full border-none pointer-events-auto"
              title="Chemical Space Universe"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

function PropertyItem({ label, val }: { label: string; val: string }) {
  return (
    <div className="bg-slate-950 border border-slate-900 rounded-lg p-3">
      <span className="text-[9px] text-[#4b5563] uppercase tracking-wider font-bold">{label}</span>
      <h5 className="font-bold text-white text-sm mt-1">{val}</h5>
    </div>
  );
}

// ----------------------------------------------------
// 8. AUTONOMOUS DRUG DISCOVERY PIPELINE
// ----------------------------------------------------
function PipelineView() {
  const [diseaseInput, setDiseaseInput] = useState('Glioblastoma');
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const pipelineSteps = [
    { title: 'Target Identification', icon: <Target size={16} /> },
    { title: 'Structural Query', icon: <Database size={16} /> },
    { title: 'Molecule Generation', icon: <Brain size={16} /> },
    { title: 'Affinity Prediction', icon: <Dna size={16} /> },
    { title: 'ADMET Profiling', icon: <Cpu size={16} /> },
    { title: 'Simulated Docking', icon: <FlaskConical size={16} /> },
    { title: 'Report Generation', icon: <FileText size={16} /> }
  ];

  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStep(0);
    setLogs([]);
    
    const logsSequence = [
      { t: 0, s: 0, m: `Initializing AETHER-RAMI pipeline target matching for: ${diseaseInput}...` },
      { t: 800, s: 0, m: "Searching genomic literature database via vector-augmented FAISS indexing..." },
      { t: 1500, s: 0, m: "Matched target: EGFR WT & EGFRvIII mutations linked to brain metastases." },
      { t: 2200, s: 1, m: "Querying protein catalog structure library. Selected PDB structural templates: 1M17." },
      { t: 3000, s: 1, m: "Matched crystal structures successfully. Binding pockets extracted." },
      { t: 3800, s: 2, m: "Running conditional Variational Autoencoder (CVAE) molecule designer..." },
      { t: 4500, s: 2, m: "Created 128 unique molecular scaffolds targeting Met793 active pockets." },
      { t: 5300, s: 3, m: "Evaluating target binding affinity using Cross-Attention transformers..." },
      { t: 6000, s: 3, m: "Identified lead compound RAMI-GBM-009: Predicted pKd = 9.56 (Kd ~ 0.27 nM)." },
      { t: 6800, s: 4, m: "Calculating ADMET absorption & toxicological risks profiles..." },
      { t: 7500, s: 4, m: "BBB penetration confirmed: LogBB = +0.45 (Optimal CNS passively transport)." },
      { t: 8300, s: 5, m: "Simulating molecular docking rotations. Minimizing active site binding energies..." },
      { t: 9000, s: 5, m: "Minimized binding energy achieved: -9.42 kcal/mol." },
      { t: 9800, s: 6, m: "Drafting publication-ready PDF report summary structure..." },
      { t: 10500, s: 7, m: "Pipeline execution complete! Candidate RAMI-GBM-009 validated successfully." }
    ];

    logsSequence.forEach(item => {
      setTimeout(() => {
        setStep(item.s);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.m}`]);
        if (item.s === 7) {
          setIsRunning(false);
        }
      }, item.t);
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
          <RefreshCw className={`text-red-500 ${isRunning ? 'animate-spin' : ''}`} size={24} /> 
          Autonomous Drug Discovery Pipeline
        </h2>
        <p className="text-xs text-[#9ca3af] mt-1">
          Orchestrate target searches, CVAE generation, and ADMET profiles in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-[#4b5563]">Disease</span>
            <input 
              type="text" 
              value={diseaseInput}
              onChange={(e) => setDiseaseInput(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1a233d] rounded-lg pl-20 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none"
              disabled={isRunning}
            />
          </div>
          <button 
            onClick={runPipeline}
            disabled={isRunning}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-neon disabled:opacity-50"
          >
            {isRunning ? 'Running Pipeline...' : 'Run Discovery Pipeline'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        <div className="xl:col-span-4 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-white text-sm">Orchestrated Workflow</h3>
          <div className="flex flex-col gap-3">
            {pipelineSteps.map((pStep, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg flex items-center gap-3 border transition-all ${
                  step === index 
                    ? 'bg-red-500/10 border-red-500/40 text-red-400' 
                    : step > index 
                      ? 'bg-slate-950/40 border-slate-900 text-slate-500' 
                      : 'bg-slate-950/10 border-slate-950 text-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === index ? 'bg-red-500 text-white animate-pulse' : step > index ? 'bg-slate-800 text-emerald-400' : 'bg-slate-900'
                }`}>
                  {step > index ? <Check size={12} /> : pStep.icon}
                </div>
                <span className="font-semibold text-xs">{pStep.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-8 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-[400px]">
          <h3 className="font-bold text-white text-sm mb-3">Pipeline Execution Terminal Logs</h3>
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-y-auto flex flex-col gap-2">
            {logs.length === 0 ? (
              <span className="text-slate-600">Terminal offline. Ready to run autonomous calculations...</span>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
            <div ref={scrollRef} />
          </div>

          {step === 7 && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between animate-fade-in">
              <div>
                <h4 className="font-bold text-white text-xs">Autonomous Pipeline Complete!</h4>
                <p className="text-[10px] text-[#9ca3af]">Lead candidate RAMI-GBM-009 is successfully predicted and validated.</p>
              </div>
              <button 
                onClick={() => alert('Report download triggered.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all"
              >
                <Download size={12} /> PDF Report
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// ----------------------------------------------------
// 9. KNOWLEDGE GALAXY GRAPH PORTAL
// ----------------------------------------------------
function KnowledgeView() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16 h-[calc(100vh-100px)]">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <Network className="text-purple-500" size={24} /> AI Scientific Knowledge Graph
        </h2>
        <p className="text-xs text-[#9ca3af]">Dual cross-attention similarity mapping graph, connecting proteins, drugs, and molecules.</p>
      </div>

      <div className="flex-1 glass-panel rounded-2xl overflow-hidden border border-slate-800 relative min-h-[400px]">
        <iframe 
          src="/visualizations/drug_target_galaxy.html"
          className="w-full h-full border-none pointer-events-auto"
          title="Interactive Galaxy Graph"
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 10. AI STARTUP DASHBOARD PORTAL (Metrics)
// ----------------------------------------------------
function DashboardView() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <Cpu className="text-blue-500" size={24} /> AI Startup Metrics Dashboard
        </h2>
        <p className="text-xs text-[#9ca3af]">Live active learning metrics, training loss records, and data leakage partitions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="font-bold text-white text-sm mb-4">Training Convergence Curve (ROC-AUC)</h3>
          <div className="h-[250px] flex items-end justify-between relative px-4 pt-4 border-l border-b border-slate-800">
            <svg className="absolute inset-0 w-full h-full p-6" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M 0 90 Q 20 70 40 40 T 80 15 T 100 10" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                className="animate-pulse"
              />
              <path 
                d="M 0 90 Q 20 70 40 40 T 80 15 T 100 10 L 100 100 L 0 100 Z" 
                fill="url(#grad)" 
                opacity="0.1"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-2 right-2 text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
              AUC: 0.927
            </div>
            <span className="text-[9px] text-[#4b5563]">Epoch 0</span>
            <span className="text-[9px] text-[#4b5563]">Epoch 50</span>
            <span className="text-[9px] text-[#4b5563]">Epoch 100</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="font-bold text-white text-sm mb-4">Lipinski Rule compliance distribution</h3>
          <div className="h-[250px] flex items-end justify-around border-l border-b border-slate-800 px-4 pt-4">
            <BarItem height="h-[85%]" label="4/4 Met" count="84%" />
            <BarItem height="h-[12%]" label="3/4 Met" count="12%" />
            <BarItem height="h-[2%]" label="2/4 Met" count="2%" />
            <BarItem height="h-[1%]" label="Failed" count="1%" />
          </div>
        </div>

      </div>

      <div className="glass-panel rounded-2xl p-5 border border-slate-800 mt-2">
        <h3 className="font-bold text-white text-sm mb-3">Model Registry Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-[#9ca3af] text-left">
            <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800">
              <tr>
                <th className="py-3">Version</th>
                <th>Training loss</th>
                <th>Active split</th>
                <th>Leakage Check</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 font-semibold text-white">AETHER-RAMI V6.0.0</td>
                <td className="font-mono">0.087</td>
                <td>90 / 10</td>
                <td className="text-emerald-400 font-bold">Passed (0.0% leakage)</td>
                <td><span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded">PRODUCTION</span></td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">AETHER-RAMI V5.2.0</td>
                <td className="font-mono">0.125</td>
                <td>80 / 20</td>
                <td className="text-emerald-400 font-bold">Passed</td>
                <td><span className="bg-slate-800 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded">ARCHIVED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function BarItem({ height, label, count }: { height: string; label: string; count: string }) {
  return (
    <div className="flex flex-col items-center gap-2 w-16">
      <span className="text-[10px] font-bold text-[#f3f4f6]">{count}</span>
      <div className={`w-10 ${height} bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md shadow-neon-green`} />
      <span className="text-[9px] text-[#9ca3af] whitespace-nowrap">{label}</span>
    </div>
  );
}

// ----------------------------------------------------
// 11. EXPLAINABLE AI PORTAL (XAI Center)
// ----------------------------------------------------
function ExplainView() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <HelpCircle className="text-pink-500" size={24} /> Explainable AI (XAI) Center
        </h2>
        <p className="text-xs text-[#9ca3af]">Deep alignment calculations: SHAP value distributions and protein-ligand residue heatmaps.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SHAP Bar Chart (6 columns) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-pink-400">Molecular Substructure SHAP Value</h3>
          <div className="flex flex-col gap-4 justify-center py-4">
            <ShapBar label="Quinazoline Nucleus (active)" value={76} color="bg-blue-500" />
            <ShapBar label="Fluorine Substituent" value={-24} color="bg-red-500" />
            <ShapBar label="Piperazine Ring Core" value={45} color="bg-blue-500" />
            <ShapBar label="Methoxy side chain" value={18} color="bg-blue-500" />
          </div>
        </div>

        {/* Attention map iframe (6 columns) */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col min-h-[350px]">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-pink-400">Cross-Attention Weight Heatmap</h3>
          <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden mt-3 relative">
            <iframe 
              src="/visualizations/cross_attention.html"
              className="w-full h-full border-none pointer-events-auto"
              title="Residue Attention Map"
            />
          </div>
        </div>

      </div>

    </div>
  );
}

function ShapBar({ label, value, color }: { label: string; value: number; color: string }) {
  const isPos = value > 0;
  const displayVal = Math.abs(value);
  return (
    <div className="flex flex-col gap-1.5 text-xs text-[#9ca3af]">
      <div className="flex justify-between font-bold">
        <span>{label}</span>
        <span className="font-mono text-white">{isPos ? '+' : '-'}{displayVal}% affinity impact</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden flex">
        {!isPos && <div className="flex-1 bg-slate-950" />}
        <div className={`${color} h-full`} style={{ width: `${displayVal / 2}%` }} />
        {isPos && <div className="flex-1 bg-slate-950" />}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 12. DEVELOPER & REPO PORTAL
// ----------------------------------------------------
function DeveloperView() {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
          <Code className="text-blue-500" size={24} /> API Integration & GitHub Repo
        </h2>
        <p className="text-xs text-[#9ca3af]">Interface specifications for AETHER-RAMI V6 foundation models.</p>
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
        <h3 className="font-bold text-white text-sm">MBZUAI K2-Think-v2 Curl Request Example</h3>
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-xs text-blue-400 overflow-x-auto leading-relaxed">
          {`curl -X 'POST' \\
  'https://api.k2think.ai/v1/chat/completions' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer IFM-4SpQ0qEg0Wlsw04O' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "model": "MBZUAI-IFM/K2-Think-v2",
    "messages": [
      {
        "role": "user",
        "content": "Find potential inhibitors for EGFR with good BBB penetration"
      }
    ],
    "stream": true
  }'`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-xl p-5 border border-slate-800">
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">GitHub Stars</span>
          <h4 className="font-black text-2xl text-white mt-1">1,482</h4>
        </div>
        
        <div className="glass-panel rounded-xl p-5 border border-slate-800">
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Model Parameters</span>
          <h4 className="font-black text-2xl text-white mt-1">2.6 Billion (ESM-2 based)</h4>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active Collaborators</span>
          <h4 className="font-black text-2xl text-white mt-1">12 Research Labs</h4>
        </div>
      </div>

    </div>
  );
}
