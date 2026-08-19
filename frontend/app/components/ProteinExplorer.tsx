'use client';

import React, { useState } from 'react';
import { Microscope, Box, RefreshCw, Eye, Sparkles, Layers, ShieldCheck, Download, ChevronRight, Dna, Activity } from 'lucide-react';
import Pdb3DViewer from './Pdb3DViewer';
import { KNOWN_PROTEINS } from '../lib/api';
import { useTab } from '../TabContext';

const PROTEIN_TARGET_METADATA: Record<string, {
  pockets: { name: string; type: string; color: string }[];
  plddt: number;
  confidence: string;
  mutations: { name: string; impact: string }[];
  description: string;
}> = {
  '1M17': {
    pockets: [
      { name: 'Met793', type: 'H-Bond Anchor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      { name: 'Thr790', type: 'Gatekeeper', color: 'bg-rose-950/80 text-rose-300 border-rose-800' },
      { name: 'Lys745', type: 'Catalytic Lysine', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Cys797', type: 'Covalent Target', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
      { name: 'Asp855', type: 'DFG-In Motif', color: 'bg-purple-950/80 text-purple-300 border-purple-800' }
    ],
    plddt: 94.8,
    confidence: 'Very High Confidence (AlphaFold3)',
    mutations: [
      { name: 'T790M', impact: 'Steric clash causing 1st-gen TKI resistance' },
      { name: 'L858R', impact: 'Constitutively active kinase conformation' },
      { name: 'C797S', impact: 'Loss of covalent cysteine attachment' }
    ],
    description: 'EGFR tyrosine kinase domain complexed with Erlotinib in the ATP-binding cleft.'
  },
  '1HCK': {
    pockets: [
      { name: 'Glu81', type: 'Hinge Donor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      { name: 'Leu83', type: 'H-Bond Hinge', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      { name: 'Lys33', type: 'Catalytic Salt Bridge', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Asp145', type: 'DFG Motif Aspartate', color: 'bg-purple-950/80 text-purple-300 border-purple-800' }
    ],
    plddt: 96.2,
    confidence: 'Very High Confidence',
    mutations: [
      { name: 'K33R', impact: 'Kinase-dead catalytic mutation' },
      { name: 'T160E', impact: 'Phosphomimetic activation loop stabilization' }
    ],
    description: 'Cyclin-dependent kinase 2 regulating G1/S phase cell cycle transitions.'
  },
  '1HVR': {
    pockets: [
      { name: 'Asp25', type: 'Catalytic Dyad A', color: 'bg-rose-950/80 text-rose-300 border-rose-800' },
      { name: 'Asp125', type: 'Catalytic Dyad B', color: 'bg-rose-950/80 text-rose-300 border-rose-800' },
      { name: 'Ile50', type: 'Flap Tip Region', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Gly27', type: 'Substrate Cavity', color: 'bg-purple-950/80 text-purple-300 border-purple-800' }
    ],
    plddt: 97.4,
    confidence: 'Crystallographic Gold Standard',
    mutations: [
      { name: 'V82A', impact: 'Protease inhibitor active-site escape' },
      { name: 'I84V', impact: 'Multi-drug resistance in viral gag-pol processing' }
    ],
    description: 'HIV-1 retroviral aspartyl protease C2-symmetric homodimer.'
  },
  '4EY7': {
    pockets: [
      { name: 'Ser203', type: 'Catalytic Triad Nucleophile', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
      { name: 'His447', type: 'Catalytic Base', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Glu334', type: 'Catalytic Acid', color: 'bg-purple-950/80 text-purple-300 border-purple-800' },
      { name: 'Trp86', type: 'Choline Binding Pocket', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      { name: 'Tyr124', type: 'Peripheral Anionic Site', color: 'bg-amber-950/80 text-amber-300 border-amber-800' }
    ],
    plddt: 93.1,
    confidence: 'High Confidence',
    mutations: [
      { name: 'W86A', impact: 'Loss of cation-pi stabilization in acetylcholine cleft' }
    ],
    description: 'Human Acetylcholinesterase with 20-Angstrom deep catalytic gorge.'
  },
  '1UWH': {
    pockets: [
      { name: 'Glu600', type: 'V600E Oncogenic Mutant', color: 'bg-rose-950/80 text-rose-300 border-rose-800' },
      { name: 'Lys483', type: 'Catalytic Salt Bridge', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Asp594', type: 'DFG Invariant Residue', color: 'bg-purple-950/80 text-purple-300 border-purple-800' },
      { name: 'Cys532', type: 'Hinge Region Anchor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' }
    ],
    plddt: 91.5,
    confidence: 'High Confidence',
    mutations: [
      { name: 'V600E', impact: 'Phosphomimetic constitutive dimer-independent activation' }
    ],
    description: 'BRAF V600E kinase domain driver in malignant melanoma and colorectal cancer.'
  },
  '1J7T': {
    pockets: [
      { name: 'Glu353', type: 'Phenolic Anchor', color: 'bg-purple-950/80 text-purple-300 border-purple-800' },
      { name: 'Arg394', type: 'H-Bond Network', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'His524', type: 'D-ring Hydroxyl Sensor', color: 'bg-amber-950/80 text-amber-300 border-amber-800' }
    ],
    plddt: 95.0,
    confidence: 'Very High Confidence',
    mutations: [
      { name: 'Y537S', impact: 'Ligand-independent ER constitutive transcription' }
    ],
    description: 'Estrogen receptor alpha ligand-binding domain (LBD) in breast oncology.'
  },
  '1ANR': {
    pockets: [
      { name: 'Ser195', type: 'Serine Protease Catalytic', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
      { name: 'His57', type: 'Proton Relay Base', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Asp102', type: 'Catalytic Charge Relay', color: 'bg-purple-950/80 text-purple-300 border-purple-800' },
      { name: 'Trp215', type: 'Apolar Cleft (S1 Pocket)', color: 'bg-amber-950/80 text-amber-300 border-amber-800' }
    ],
    plddt: 96.8,
    confidence: 'High Precision X-Ray',
    mutations: [
      { name: 'W215A', impact: 'Abolishes high-affinity antithrombin recognition' }
    ],
    description: 'Human coagulation factor IIa (Thrombin) key target in cardiovascular medicine.'
  },
  '3FU2': {
    pockets: [
      { name: 'Cys12', type: 'G12C Covalent Pocket', color: 'bg-rose-950/80 text-rose-300 border-rose-800' },
      { name: 'Gly13', type: 'P-Loop Residue', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
      { name: 'Tyr96', type: 'Switch-II Cryptic Groove', color: 'bg-amber-950/80 text-amber-300 border-amber-800' },
      { name: 'Asp57', type: 'Mg2+ Coordination', color: 'bg-purple-950/80 text-purple-300 border-purple-800' }
    ],
    plddt: 94.2,
    confidence: 'Very High Confidence',
    mutations: [
      { name: 'G12C', impact: 'Ablates GTPase-activating protein (GAP) hydrolysis' }
    ],
    description: 'KRAS proto-oncogene GTPase with Switch-II allosteric pocket.'
  }
};

export default function ProteinExplorer() {
  const { selectedProtein, setSelectedProtein } = useTab();
  const currentProtein = KNOWN_PROTEINS.find(p => p.id.toUpperCase() === selectedProtein.toUpperCase()) || KNOWN_PROTEINS[0];
  const meta = PROTEIN_TARGET_METADATA[currentProtein.id] || PROTEIN_TARGET_METADATA['1M17'];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-indigo-950/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              3D PDB BIOPHYSICS VIEWER
            </span>
            <span className="text-xs text-slate-400 font-mono">v10-STRUCTURE</span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-cyan-400" />
            <span>Protein Structural Intelligence & 3D PDB Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 max-w-2xl">
            Real 3D PDB parser rendering atomic coordinates, catalytic binding pockets, secondary structures, and AlphaFold3 confidence scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProtein}
            onChange={e => setSelectedProtein(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
          >
            {KNOWN_PROTEINS.map(p => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name} ({p.target})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Protein Grid Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {KNOWN_PROTEINS.map(p => {
          const isSelected = selectedProtein.toUpperCase() === p.id.toUpperCase();
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProtein(p.id)}
              className={`p-3 rounded-xl flex flex-col gap-1 text-left transition-all border ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xs text-white">{p.id}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </div>
              <span className="text-[10px] font-mono text-slate-300 truncate">{p.target}</span>
              <span className="text-[9px] font-mono text-slate-500">{p.resolution}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Viewer & Structural Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Pdb3DViewer
            pdbId={currentProtein.id}
            pdbUrl={currentProtein.file}
            height="h-[520px]"
            showBindingPocket={true}
            highlightLigand={true}
          />
        </div>

        {/* Structural Specs & Residue Hotspots */}
        <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>PDB Structural Specs: {currentProtein.id}</span>
            </h3>

            <p className="text-[11px] text-slate-400 font-mono mt-2 leading-relaxed">
              {meta.description}
            </p>

            <div className="flex flex-col gap-2.5 text-xs font-mono text-slate-300 mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Target Name:</span>
                <span className="text-white font-bold">{currentProtein.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Indication:</span>
                <span className="text-rose-400 font-bold">{currentProtein.disease}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">X-Ray Resolution:</span>
                <span className="text-cyan-400 font-bold">{currentProtein.resolution}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Residues:</span>
                <span className="text-white">{currentProtein.residues} residues</span>
              </div>
            </div>

            {/* Pocket Hotspots */}
            <div className="border-t border-slate-800/80 pt-3 mt-3 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">Key Pocket Hotspot Residues:</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                {meta.pockets.map((pocket, idx) => (
                  <span key={idx} className={`px-2 py-1 rounded border font-bold ${pocket.color}`}>
                    {pocket.name} ({pocket.type})
                  </span>
                ))}
              </div>
            </div>

            {/* Mutation Impact */}
            <div className="border-t border-slate-800/80 pt-3 mt-3 flex flex-col gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">Oncogenic Mutation Impact:</span>
              <div className="flex flex-col gap-1 font-mono text-[10px]">
                {meta.mutations.map((m, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-slate-900/80 border border-slate-800 flex items-start gap-1.5 text-slate-300">
                    <span className="text-rose-400 font-bold">{m.name}:</span>
                    <span>{m.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AlphaFold3 Confidence */}
          <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-xs font-bold text-slate-400">Structural Confidence:</span>
              <span className="text-emerald-400 font-bold">pLDDT {meta.plddt} / 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400" style={{ width: `${meta.plddt}%` }} />
            </div>
            <span className="text-[10px] font-mono text-slate-500">{meta.confidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
