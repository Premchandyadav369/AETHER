'use client';

import React, { useState } from 'react';
import { Database, Upload, Search, CheckCircle2, FileText, Download, BarChart3, Filter } from 'lucide-react';

export default function DatasetManager() {
  const [search, setSearch] = useState('');
  const datasets = [
    { name: 'BindingDB 2024 V10 Cleaned', records: '2,840,000', format: 'SDF / Parquet', size: '1.4 GB', active: true, balance: '52% Active / 48% Decoy' },
    { name: 'ChEMBL 34 Kinase Subset', records: '980,000', format: 'CSV / HDF5', size: '620 MB', active: true, balance: '45% Active / 55% Decoy' },
    { name: 'PDBbind 2024 Refined Set', records: '24,500 Complexes', format: 'PDB / SDF', size: '3.8 GB', active: true, balance: '3D Co-Crystallized' },
    { name: 'ZINC20 Lead-Like Library', records: '14,200,000', format: 'SMILES / FAISS', size: '8.2 GB', active: false, balance: 'Virtual Screen Pool' },
    { name: 'AETHER De Novo Generated Batch V10', records: '100 Lead Candidates', format: 'JSON / CSV', size: '260 KB', active: true, balance: 'Target-Conditioned' }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <span>Multi-Omics & Chemical Dataset Manager</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Searchable bioactivity data, structural complexes, ECFP4 fingerprint indexes & data cleaning logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search datasets..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Panel */}
      <div className="p-8 rounded-2xl glass-panel border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center gap-3 hover:border-cyan-400 transition-colors cursor-pointer group bg-slate-950/40">
        <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
        <div className="text-center">
          <h4 className="font-bold text-sm text-white">Drag and Drop Datasets (CSV, SDF, MOL2, PDB, FASTA)</h4>
          <p className="text-xs text-slate-400 font-mono mt-1">Automatic deduplication, descriptor calculation, and class balance analysis</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-800 text-cyan-300 font-mono font-bold text-xs">
          Browse File System
        </button>
      </div>

      {/* Dataset Inventory Table */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col gap-4">
        <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-3">Active Pipeline Datasets</h3>
        <div className="flex flex-col gap-3 font-mono text-xs">
          {datasets.map((d, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{d.name}</h4>
                  <span className="text-[10px] text-slate-400">{d.balance}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                <span>Records: <strong className="text-cyan-400">{d.records}</strong></span>
                <span>Format: <strong className="text-white">{d.format}</strong></span>
                <span>Size: <strong className="text-purple-400">{d.size}</strong></span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
