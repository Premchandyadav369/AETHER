'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Search, Filter, Copy, ExternalLink, Bookmark, Sparkles, ArrowUpDown } from 'lucide-react';
import { fetchCandidates, MoleculeCandidate } from '../lib/api';
import { useTab } from '../TabContext';

export default function CandidateRanking() {
  const { setSmilesInput, bookmarks, toggleBookmark, setActiveTab } = useTab();
  const [candidates, setCandidates] = useState<MoleculeCandidate[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTarget, setSearchTarget] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof MoleculeCandidate>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  useEffect(() => {
    fetchCandidates().then(data => setCandidates(data));
  }, []);

  const filtered = candidates.filter(c => {
    if (filterCategory === 'Top-10' && c.rank > 10) return false;
    if (filterCategory === 'Top-20' && c.rank > 20) return false;
    if (searchTarget && !c.target.toLowerCase().includes(searchTarget.toLowerCase()) && !c.smiles.toLowerCase().includes(searchTarget.toLowerCase())) return false;
    return true;
  }).sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    const headers = ['Rank', 'ID', 'Target', 'SMILES', 'pKd', 'Vina_Score', 'QED', 'SA', 'LogP', 'MW', 'Consensus_Score'];
    const rows = filtered.map(c => [c.rank, c.id, c.target, `"${c.smiles}"`, c.affinity, c.docking_score, c.qed, c.sa, c.logp, c.mw, c.consensus_score]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AETHER_V10_Top_Candidates.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Candidate Prioritization & Laboratory Ranking</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Top-100 leads, Top-20 preclinical candidates, Top-10 laboratory-priority molecules
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1 rounded-lg ${filterCategory === 'All' ? 'bg-cyan-950 text-cyan-400 font-bold border border-cyan-800' : 'text-slate-400'}`}
            >
              Top-100
            </button>
            <button
              onClick={() => setFilterCategory('Top-20')}
              className={`px-3 py-1 rounded-lg ${filterCategory === 'Top-20' ? 'bg-indigo-950 text-indigo-400 font-bold border border-indigo-800' : 'text-slate-400'}`}
            >
              Top-20 Preclinical
            </button>
            <button
              onClick={() => setFilterCategory('Top-10')}
              className={`px-3 py-1 rounded-lg ${filterCategory === 'Top-10' ? 'bg-purple-950 text-purple-400 font-bold border border-purple-800' : 'text-slate-400'}`}
            >
              Top-10 Lab Priority
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Sortable Table */}
      <div className="rounded-2xl glass-panel p-4 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="p-3 cursor-pointer" onClick={() => { setSortBy('rank'); setSortAsc(!sortAsc); }}>
                Rank <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-3">ID</th>
              <th className="p-3">Target</th>
              <th className="p-3">SMILES Structure</th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortBy('affinity'); setSortAsc(!sortAsc); }}>
                Affinity (pKd) <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => { setSortBy('docking_score'); setSortAsc(!sortAsc); }}>
                Vina (kcal/mol) <ArrowUpDown className="w-3 h-3 inline ml-1" />
              </th>
              <th className="p-3">QED</th>
              <th className="p-3">SA</th>
              <th className="p-3">Consensus Score</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-cyan-950/40 transition-colors group">
                <td className="p-3 font-bold text-white">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${c.rank <= 10 ? 'bg-purple-950 text-purple-400 border border-purple-800' : c.rank <= 20 ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' : 'bg-slate-900 text-slate-400'}`}>
                    #{c.rank}
                  </span>
                </td>
                <td className="p-3 text-cyan-400 font-bold">{c.id}</td>
                <td className="p-3 text-slate-200">{c.target}</td>
                <td className="p-3 text-slate-400 max-w-[200px] truncate" title={c.smiles}>
                  {c.smiles}
                </td>
                <td className="p-3 text-emerald-400 font-bold">{c.affinity}</td>
                <td className="p-3 text-cyan-300 font-bold">{c.docking_score}</td>
                <td className="p-3 text-white">{c.qed}</td>
                <td className="p-3 text-purple-400">{c.sa}</td>
                <td className="p-3 font-bold text-cyan-400">{c.consensus_score}</td>
                <td className="p-3 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSmilesInput(c.smiles);
                      setActiveTab('generator');
                    }}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-700 text-[10px]"
                    title="Load to Editor"
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => toggleBookmark(c.smiles)}
                    className={`p-1.5 rounded ${bookmarks.includes(c.smiles) ? 'text-purple-400 bg-purple-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
