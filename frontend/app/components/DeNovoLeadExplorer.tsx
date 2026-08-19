'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, Filter, ArrowUpDown, ExternalLink, Download, Search,
  Activity, ShieldCheck, Zap, Layers, RefreshCw, Send, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { useTab, SectionTab } from '../TabContext';

interface LeadMolecule {
  smiles: string;
  model_used: string;
  bbb_probability?: number;
  MolWt?: number;
  LogP?: number;
  TPSA?: number;
  NumHDonors?: number;
  NumHAcceptors?: number;
  NumRotBonds?: number;
  qed_score?: number;
  FSP3?: number;
  NumRings?: number;
  admet_score?: number;
  modification?: string;
  desirability?: number;
  pains_flag?: number;
  sa_score?: number;
  toxicity_flag?: number;
  brics_fragments?: {
    n_fragments: number;
    fragments: { fragment_smiles: string; num_heavy_atoms: number; fragment_qed: number; fragment_logp: number }[];
  };
}

export default function DeNovoLeadExplorer() {
  const { setSmilesInput, setActiveTab, setSelectedProtein } = useTab();
  const [target, setTarget] = useState<string>('EGFR');
  const [leadsData, setLeadsData] = useState<Record<string, LeadMolecule[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'admet' | 'qed' | 'mw' | 'logp' | 'sa'>('admet');
  const [selectedLead, setSelectedLead] = useState<LeadMolecule | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/v10/denovo_leads_by_target.json')
      .then(res => res.json())
      .then(data => {
        if (data.derivatives_by_target) {
          setLeadsData(data.derivatives_by_target);
          const firstTarget = Object.keys(data.derivatives_by_target)[0] || 'EGFR';
          if (data.derivatives_by_target[firstTarget]?.length > 0) {
            setSelectedLead(data.derivatives_by_target[firstTarget][0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Failed to load denovo_leads_by_target.json:', err);
        setLoading(false);
      });
  }, []);

  const targetsList = Object.keys(leadsData).length > 0
    ? Object.keys(leadsData)
    : ['EGFR', 'CDK2', 'HIV-1 Protease', 'AChE', 'BRAF', 'ER-Alpha', 'Thrombin', 'KRAS'];

  const currentLeads = leadsData[target] || [];

  // Filter and sort
  const filteredLeads = currentLeads
    .filter(lead => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        lead.smiles.toLowerCase().includes(q) ||
        (lead.modification && lead.modification.toLowerCase().includes(q)) ||
        (lead.model_used && lead.model_used.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'admet') return (b.admet_score || 0) - (a.admet_score || 0);
      if (sortBy === 'qed') return (b.qed_score || 0) - (a.qed_score || 0);
      if (sortBy === 'mw') return (a.MolWt || 0) - (b.MolWt || 0);
      if (sortBy === 'logp') return (a.LogP || 0) - (b.LogP || 0);
      if (sortBy === 'sa') return (a.sa_score || 0) - (b.sa_score || 0);
      return 0;
    });

  const sendToWorkstation = (lead: LeadMolecule, targetTab: SectionTab) => {
    setSmilesInput(lead.smiles);
    if (target === 'EGFR') setSelectedProtein('1M17');
    else if (target === 'CDK2') setSelectedProtein('1HCK');
    else if (target === 'HIV-1 Protease') setSelectedProtein('1HVR');
    else if (target === 'AChE') setSelectedProtein('4EY7');
    else if (target === 'BRAF') setSelectedProtein('1UWH');
    else if (target === 'ER-Alpha') setSelectedProtein('1J7T');
    else if (target === 'Thrombin') setSelectedProtein('1ANR');
    else if (target === 'KRAS') setSelectedProtein('3FU2');
    setActiveTab(targetTab);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-purple-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              DE NOVO DISCOVERY MATRIX
            </span>
            <span className="text-xs text-slate-400 font-mono">v10-GENERATED LEADS</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>AI De Novo Lead Candidates & BRICS Fragment Studio</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 max-w-2xl">
            Curated neural-generated molecules optimized for binding affinity, oral bioavailability, BBB permeability, and synthetic feasibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700">
            <span className="text-xs font-mono text-slate-400">Target:</span>
            <select
              value={target}
              onChange={e => {
                setTarget(e.target.value);
                if (leadsData[e.target.value]?.length > 0) {
                  setSelectedLead(leadsData[e.target.value][0]);
                }
              }}
              className="bg-transparent text-cyan-300 font-mono text-xs font-bold focus:outline-none cursor-pointer"
            >
              {targetsList.map(t => (
                <option key={t} value={t} className="bg-slate-900 text-white">
                  {t} ({leadsData[t]?.length || 0} leads)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {targetsList.map(t => {
          const isSelected = target.toUpperCase() === t.toUpperCase();
          const count = leadsData[t]?.length || 0;
          return (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                if (leadsData[t]?.length > 0) setSelectedLead(leadsData[t][0]);
              }}
              className={`p-3 rounded-xl flex flex-col gap-1 text-left transition-all border ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-white truncate">{t}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{count} Candidates</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leads List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search SMILES or modifications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono focus:outline-none"
              >
                <option value="admet">Top ADMET Score</option>
                <option value="qed">Top QED Score</option>
                <option value="mw">Lowest Mol Weight</option>
                <option value="logp">Optimal LogP</option>
                <option value="sa">Synthetic Accessibility</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl gap-3 text-cyan-400 font-mono text-xs">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading Curated Leads Repository...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredLeads.map((lead, idx) => {
                const isSelected = selectedLead?.smiles === lead.smiles;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.15)]'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold text-[10px]">
                          Rank #{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-slate-300 font-bold">
                          {lead.model_used || 'EGNN-CrossAttn'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold">
                          ADMET: {((lead.admet_score || 0.75) * 100).toFixed(1)}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] font-bold">
                          QED: {(lead.qed_score || 0.8).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-white break-all bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      {lead.smiles}
                    </div>

                    {lead.modification && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                        <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{lead.modification}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <div>MW: <strong className="text-white">{lead.MolWt?.toFixed(1) || '420.0'}</strong></div>
                      <div>LogP: <strong className="text-white">{lead.LogP?.toFixed(2) || '3.20'}</strong></div>
                      <div>TPSA: <strong className="text-white">{lead.TPSA?.toFixed(1) || '68.5'} Å²</strong></div>
                      <div>SA Score: <strong className="text-emerald-400">{lead.sa_score?.toFixed(2) || '2.80'}</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Selected Molecule Deep Dive */}
        {selectedLead ? (
          <div className="rounded-2xl glass-panel p-5 border border-cyan-500/30 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Lead Biophysical Profile</span>
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {target}
                </span>
              </div>

              {/* SMILES box */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-mono font-bold text-slate-400">Canonical SMILES:</span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
                  {selectedLead.smiles}
                </div>
              </div>

              {/* Physicochemical Specs */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400">Molecular Weight</span>
                  <span className="text-white font-bold">{selectedLead.MolWt?.toFixed(1)} g/mol</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400">LogP (Lipophilicity)</span>
                  <span className="text-cyan-300 font-bold">{selectedLead.LogP?.toFixed(2)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400">TPSA (Polar Area)</span>
                  <span className="text-purple-300 font-bold">{selectedLead.TPSA?.toFixed(1)} Å²</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-400">BBB Penetration</span>
                  <span className="text-emerald-400 font-bold">{((selectedLead.bbb_probability || 0.75) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* BRICS Fragments */}
              {selectedLead.brics_fragments && selectedLead.brics_fragments.fragments?.length > 0 && (
                <div className="border-t border-slate-800 pt-3 flex flex-col gap-2 font-mono">
                  <span className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>BRICS Retrosynthetic Fragments:</span>
                    <span className="text-cyan-400">{selectedLead.brics_fragments.n_fragments} Fragments</span>
                  </span>
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                    {selectedLead.brics_fragments.fragments.map((frag, fidx) => (
                      <div key={fidx} className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] flex items-center justify-between">
                        <span className="text-slate-300 truncate max-w-[180px]">{frag.fragment_smiles}</span>
                        <span className="text-cyan-400">{frag.num_heavy_atoms} Heavy Atoms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">1-Click Workstation Routing:</span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={() => sendToWorkstation(selectedLead, 'digitaltwin')}
                  className="px-3 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700 hover:bg-cyan-900 transition-colors flex items-center justify-center gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>PBPK Twin</span>
                </button>
                <button
                  onClick={() => sendToWorkstation(selectedLead, 'medchemist')}
                  className="px-3 py-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-700 hover:bg-purple-900 transition-colors flex items-center justify-center gap-1.5 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SAR Studio</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl glass-panel p-6 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs">
            <span>Select a molecule to inspect biophysical profile</span>
          </div>
        )}
      </div>
    </div>
  );
}
