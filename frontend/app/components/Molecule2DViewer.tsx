'use client';

import React from 'react';
import { Sparkles, Dna, ExternalLink } from 'lucide-react';

interface Molecule2DViewerProps {
  smiles: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function Molecule2DViewer({ smiles, width = 240, height = 180, className = '' }: Molecule2DViewerProps) {
  // Extract simple ring count and pseudo atom representation from SMILES string
  const atoms = smiles.replace(/[^A-Za-z]/g, '').slice(0, 12).split('');
  const rings = (smiles.match(/\d/g) || []).length;
  
  return (
    <div className={`relative flex flex-col items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800 p-3 overflow-hidden group ${className}`}>
      {/* Background SVG diagram */}
      <svg width={width} height={height} viewBox="0 0 200 150" className="w-full h-auto drop-shadow-[0_0_10px_rgba(0,229,255,0.2)]">
        <defs>
          <linearGradient id="bondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Central Hexagon Ring 1 */}
        <polygon points="100,35 130,52 130,87 100,105 70,87 70,52" fill="none" stroke="url(#bondGrad)" strokeWidth="2.5" />
        <circle cx="100" cy="70" r="18" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="4 2" className="animate-spin-slow origin-[100px_70px]" />

        {/* Outer Ring 2 if multiple rings */}
        {rings >= 2 && (
          <polygon points="130,52 160,35 180,60 160,85 130,87" fill="none" stroke="#3b82f6" strokeWidth="2" />
        )}

        {/* Side Chains & Branches */}
        <line x1="70" y1="52" x2="45" y2="35" stroke="#00e5ff" strokeWidth="2" />
        <line x1="45" y1="35" x2="25" y2="45" stroke="#10b981" strokeWidth="2" />
        <line x1="100" y1="105" x2="100" y2="130" stroke="#8b5cf6" strokeWidth="2" />
        <line x1="100" y1="130" x2="120" y2="142" stroke="#ec4899" strokeWidth="2" />
        <line x1="100" y1="130" x2="80" y2="142" stroke="#f59e0b" strokeWidth="2" />

        {/* Atom Nodes */}
        <circle cx="100" cy="35" r="4" fill="#00e5ff" />
        <circle cx="130" cy="52" r="4" fill="#3b82f6" />
        <circle cx="130" cy="87" r="4" fill="#8b5cf6" />
        <circle cx="100" cy="105" r="4" fill="#ec4899" />
        <circle cx="70" cy="87" r="4" fill="#10b981" />
        <circle cx="70" cy="52" r="4" fill="#00e5ff" />
        <circle cx="45" cy="35" r="3.5" fill="#f59e0b" />
        <circle cx="25" cy="45" r="4" fill="#ef4444" />

        {/* Atom Labels */}
        <text x="25" y="48" fontSize="9" fill="#ef4444" fontFamily="monospace" textAnchor="middle" fontWeight="bold">O</text>
        <text x="45" y="30" fontSize="9" fill="#f59e0b" fontFamily="monospace" textAnchor="middle" fontWeight="bold">N</text>
        <text x="120" y="146" fontSize="9" fill="#ec4899" fontFamily="monospace" textAnchor="middle" fontWeight="bold">F</text>
        <text x="80" y="146" fontSize="9" fill="#10b981" fontFamily="monospace" textAnchor="middle" fontWeight="bold">OH</text>
      </svg>

      <div className="w-full mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
        <span className="truncate max-w-[140px] text-cyan-400" title={smiles}>
          {smiles.slice(0, 20)}...
        </span>
        <a 
          href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(smiles)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
          title="Open PubChem"
        >
          <span>PubChem</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
