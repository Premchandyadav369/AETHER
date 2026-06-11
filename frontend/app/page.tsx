'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Compass, Play, Download, Search, Check, Brain, 
  Dna, Network, Database, FlaskConical, Target, Award
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedProtein, setSelectedProtein] = useState('egfr');
  const [activeViewerMode, setActiveViewerMode] = useState('pocket_3d');
  
  const proteinsList = [
    { id: 'egfr', name: 'EGFR Target', pdb: '1M17', desc: 'Kinase', affinity: '8.76 pKd' },
    { id: 'braf', name: 'BRAF Target', pdb: '1UWH', desc: 'Kinase', affinity: '9.12 pKd' },
    { id: 'cdk2', name: 'CDK2 Target', pdb: '1HCK', desc: 'Cell Cycle', affinity: '8.56 pKd' },
    { id: 'hiv_protease', name: 'HIV Protease', pdb: '1HVR', desc: 'Viral Protease', affinity: '9.45 pKd' },
    { id: 'ache', name: 'AChE Target', pdb: '4EY7', desc: 'Hydrolase', affinity: '9.02 pKd' }
  ];

  // Helper to determine what html file to display inside the 3D Viewer iframe
  const getViewerIframeSrc = () => {
    // Return relative path matching the generated visualizations directory structure
    // Since Next.js public directory serves static assets, we can copy them there or link them.
    // In our workspace they are in C:\Users\PREMCHANDYADAV\OneDrive\Desktop\Project\AETHERRAMI\visualizations
    // Let's reference them as `/visualizations/[protein]_[mode].html`
    return `/visualizations/${selectedProtein}_${activeViewerMode}.html`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-16">
      
      {/* Top Section: Hero & Core Visualizers */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Hero & Stats (7 columns) */}
        <div className="xl:col-span-7 flex flex-col justify-between gap-6">
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-center h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-widest mb-4">
              <Sparkles size={14} /> AI-Powered Target Validation
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              AI for the Next Generation of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                Drug Discovery & Therapeutics
              </span>
            </h1>
            
            <p className="text-[#9ca3af] text-sm md:text-base max-w-xl mb-6 leading-relaxed">
              AETHER-RAMI V6 is a protein-aware foundation model that unifies molecules, proteins, and disease targets to accelerate the discovery of life-saving drugs.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all shadow-neon flex items-center gap-2">
                Explore Platform <Compass size={16} />
              </button>
              <button className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 font-semibold text-sm transition-all flex items-center gap-2 text-white">
                View Research Paper <Play size={16} />
              </button>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatsCard count="13+" label="Datasets" />
            <StatsCard count="52M+" label="Molecules" />
            <StatsCard count="1.2M+" label="Protein Sequences" />
            <StatsCard count="250K+" label="Protein Structures" />
            <StatsCard count="95+" label="AI Models" />
          </div>
        </div>

        {/* Right column: Interactive 3D Protein Viewer (5 columns) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col flex-1 min-h-[480px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg text-white">3D Protein Viewer</h3>
                <span className="text-xs text-[#9ca3af]">Complex: {selectedProtein.toUpperCase()} with bound ligand</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveViewerMode('binding_pocket_3d')}
                  className={`px-3 py-1 rounded text-xs transition-all ${activeViewerMode === 'binding_pocket_3d' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-[#9ca3af]'}`}
                >
                  Pocket
                </button>
                <button 
                  onClick={() => setActiveViewerMode('electrostatic_surface')}
                  className={`px-3 py-1 rounded text-xs transition-all ${activeViewerMode === 'electrostatic_surface' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-[#9ca3af]'}`}
                >
                  Charges
                </button>
                <button 
                  onClick={() => setActiveViewerMode('secondary_structure')}
                  className={`px-3 py-1 rounded text-xs transition-all ${activeViewerMode === 'secondary_structure' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-[#9ca3af]'}`}
                >
                  Cartoon
                </button>
              </div>
            </div>
            
            {/* Embedded 3D Canvas */}
            <div className="flex-1 bg-[#090d16] rounded-xl border border-[#1a233d] overflow-hidden relative min-h-[300px]">
              <iframe 
                src={getViewerIframeSrc()}
                className="w-full h-full border-none"
                title="Protein Viewer"
              />
            </div>

            {/* Protein Selector Thumbnails */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {proteinsList.map((prot) => (
                <button
                  key={prot.id}
                  onClick={() => setSelectedProtein(prot.id)}
                  className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                    selectedProtein === prot.id
                      ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                      : 'bg-slate-950 border border-slate-800 text-[#9ca3af] hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs">{prot.pdb}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-85 mt-1">{prot.id === 'hiv_protease' ? 'HIV-PR' : prot.id.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 border border-[#1a233d]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" size={18} />
          <input 
            type="text" 
            placeholder="Search molecule (SMILES), protein sequence (FASTA) or disease target..." 
            className="w-full bg-[#090d16] border border-[#1a233d] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#f3f4f6] placeholder-[#4b5563] focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all shadow-neon w-full sm:w-auto">
          Query Foundation Model
        </button>
      </div>

      {/* Grid: 3D UMAP, Network, Generation, SHAP (Mid Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Chemical Space Explorer */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[380px]">
          <h3 className="font-bold text-base text-white flex items-center gap-2 mb-2">
            <Compass className="text-blue-400" size={16} /> Chemical Space Explorer
          </h3>
          <p className="text-xs text-[#9ca3af] mb-4">3D UMAP projection of 50K+ synthesizable candidates</p>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-950 border border-[#1a233d]">
            <iframe 
              src="/visualizations/chemical_space_3d.html" 
              className="w-full h-full border-none"
              title="Chemical Space"
            />
          </div>
        </div>

        {/* Drug Repurposing Network */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[380px]">
          <h3 className="font-bold text-base text-white flex items-center gap-2 mb-2">
            <Network className="text-purple-400" size={16} /> Drug-Target Galaxy Network
          </h3>
          <p className="text-xs text-[#9ca3af] mb-4">Dual cross-attention similarity mapping</p>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-950 border border-[#1a233d]">
            <iframe 
              src="/visualizations/drug_target_galaxy.html" 
              className="w-full h-full border-none"
              title="Drug Target Galaxy"
            />
          </div>
        </div>

        {/* Protein-Ligand Cross Attention */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col h-[380px]">
          <h3 className="font-bold text-base text-white flex items-center gap-2 mb-2">
            <Dna className="text-pink-400" size={16} /> Protein-Ligand Cross Attention
          </h3>
          <p className="text-xs text-[#9ca3af] mb-4">Residue-atom interaction heatmap weights</p>
          <div className="flex-1 rounded-xl overflow-hidden bg-slate-950 border border-[#1a233d]">
            <iframe 
              src="/visualizations/cross_attention.html" 
              className="w-full h-full border-none"
              title="Cross Attention Heatmap"
            />
          </div>
        </div>
      </div>

      {/* Lower Row: Platform Studio Cards & Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Platform Core Modules (2 Columns layout inside grid) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <h2 className="font-extrabold text-2xl tracking-tight text-white">
            AETHER-RAMI V6 Platform Studio
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StudioCard 
              icon={<FlaskConical className="text-blue-400" />}
              title="Drug Discovery Studio"
              desc="Upload PDBs and SMILES to calculate structure-based binding affinity, ADMET profiles, and risk markers."
            />
            <StudioCard 
              icon={<Dna className="text-pink-400" />}
              title="Protein Intelligence"
              desc="Analyze structural folds, active pockets, electrostatics surfaces, and secondary structure topologies."
            />
            <SidebarCard 
              icon={<Database className="text-purple-400" />}
              title="RAMI Retrieval Engine"
              desc="Search through embedding spaces containing 52M+ compounds and targets via dual FAISS indices."
            />
            <SidebarCard 
              icon={<Brain className="text-green-400" />}
              title="Molecular Generator"
              desc="Run conditional Variational Autoencoders (CVAEs) to synthesize candidate drugs targeting specific proteins."
            />
          </div>
        </div>

        {/* Model Leaderboard */}
        <div className="flex flex-col gap-4">
          <h2 className="font-extrabold text-2xl tracking-tight text-white">
            Model Leaderboard
          </h2>
          
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center text-xs font-bold text-[#4b5563] pb-2 border-b border-[#1a233d]">
              <span>MODEL NAME</span>
              <span>ROC-AUC</span>
            </div>
            
            <LeaderboardItem rank={1} name="AETHER-RAMI V6 (Our Model)" score="0.927" isActive />
            <LeaderboardItem rank={2} name="DeepDTA" score="0.892" />
            <LeaderboardItem rank={3} name="GraphDTA" score="0.876" />
            <LeaderboardItem rank={4} name="D-SCRIPT" score="0.865" />
          </div>
        </div>
      </div>

      {/* Logos and system status Footer */}
      <footer className="mt-8 border-t border-[#1a233d] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4b5563]">
        <div className="flex items-center gap-6">
          <span>Built for Researchers. Designed for Impact.</span>
          <div className="flex flex-wrap gap-4 text-[10px] uppercase font-bold text-[#9ca3af]/40">
            <span>PyTorch</span>
            <span>DGL</span>
            <span>FAISS</span>
            <span>ESM-2</span>
            <span>RDKit</span>
            <span>Hugging Face</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-neon-green" />
          <span className="text-[#9ca3af] font-semibold">System Status: All Systems Operational</span>
        </div>
      </footer>
      
    </div>
  );
}

function StatsCard({ count, label }: { count: string; label: string }) {
  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col items-center justify-center text-center border border-[#1a233d]">
      <span className="font-black text-lg md:text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
        {count}
      </span>
      <span className="text-[10px] text-[#9ca3af] uppercase tracking-wider font-semibold mt-1">
        {label}
      </span>
    </div>
  );
}

function StudioCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-panel rounded-xl p-6 border border-[#1a233d] hover:border-blue-500/30 transition-all flex flex-col gap-3 group cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white text-base mb-1">{title}</h4>
        <p className="text-xs text-[#9ca3af] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SidebarCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-panel rounded-xl p-6 border border-[#1a233d] hover:border-purple-500/30 transition-all flex flex-col gap-3 group cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white text-base mb-1">{title}</h4>
        <p className="text-xs text-[#9ca3af] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function LeaderboardItem({ rank, name, score, isActive = false }: { rank: number; name: string; score: string; isActive?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
      isActive 
        ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 shadow-neon' 
        : 'bg-slate-950 border-slate-900 text-[#f3f4f6]'
    }`}>
      <div className="flex items-center gap-3">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
          rank === 1 ? 'bg-yellow-500/25 text-yellow-500' : 'bg-slate-800 text-[#9ca3af]'
        }`}>
          {rank}
        </span>
        <span className="text-sm font-semibold">{name}</span>
      </div>
      <span className="text-sm font-extrabold font-mono">{score}</span>
    </div>
  );
}
