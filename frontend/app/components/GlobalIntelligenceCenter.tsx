'use client';

import React, { useState, useEffect } from 'react';
import { fetchGlobalIntelligence, fetchDiseaseGraph } from '../lib/api';
import { Globe2, Search, Database, Network, ArrowUpRight, Sparkles, RefreshCw, Layers } from 'lucide-react';

export default function GlobalIntelligenceCenter() {
  const [query, setQuery] = useState('EGFR inhibitor NSCLC');
  const [loading, setLoading] = useState(false);
  const [intelData, setIntelData] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>(null);

  const searchIntelligence = async () => {
    setLoading(true);
    try {
      const [intel, graph] = await Promise.all([
        fetchGlobalIntelligence(query),
        fetchDiseaseGraph()
      ]);
      setIntelData(intel);
      setGraphData(graph);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchIntelligence();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-blue-950/40 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
                GLOBAL BIOMEDICAL RETRIEVAL
              </span>
              <span className="text-xs text-slate-400 font-mono">v10-INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-sky-400" />
              <span>Global Drug Intelligence & Disease Knowledge Graph</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Live multi-database query indexing PubChem, ClinicalTrials.gov, RCSB PDB, and multi-relational disease graphs.
            </p>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="mt-4 flex items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchIntelligence()}
              placeholder="Search target, molecule, or disease (e.g. KRAS G12C, Osimertinib, Glioblastoma)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
          <button
            onClick={searchIntelligence}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Search Live Bio-DBs</span>
          </button>
        </div>
      </div>

      {/* Disease Knowledge Graph */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Network className="w-4 h-4 text-sky-400" />
            <span>Multi-Modal Disease Knowledge Graph</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Nodes: Drugs • Proteins • Diseases • Pathways</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {graphData?.nodes?.map((node: any) => (
            <div
              key={node.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${node.color}20`,
                    color: node.color,
                    borderColor: `${node.color}40`,
                    borderWidth: '1px'
                  }}
                >
                  {node.type}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
              </div>
              <span className="font-mono font-bold text-xs text-white">{node.label}</span>
            </div>
          ))}
        </div>

        {/* Graph Relationships / Edges */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-500">Biological Graph Relationships (Edges)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {graphData?.edges?.map((edge: any, i: number) => (
              <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span className="text-sky-300 font-bold uppercase">{edge.source}</span>
                <span className="text-[10px] text-slate-500 italic">── {edge.relation} ──▶</span>
                <span className="text-indigo-300 font-bold uppercase">{edge.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Bio-Database Hits & Clinical Trials */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Indexed Records from Global Scientific Repositories</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Real-time PubChem + ClinicalTrials.gov + RCSB PDB</span>
        </div>

        <div className="flex flex-col gap-3">
          {intelData?.results?.map((item: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800/40">
                    {item.source}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                    {item.type}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{item.id}</span>
                </div>
                <h4 className="text-xs font-bold text-white font-mono mt-1">{item.title}</h4>
                {item.details && <p className="text-[11px] text-slate-400 font-mono mt-0.5">{item.details}</p>}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono text-[10px]">
                  <span className="text-slate-500 block">Relevance</span>
                  <span className="text-emerald-400 font-bold">{(item.relevance * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
