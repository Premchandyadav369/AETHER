'use client';

import React from 'react';

export interface StructureInfo {
  pdbId: string;
  chain?: string;
  resolution?: string;
  ligand?: string;
  structureType?: string;
  className?: string;
}

export default function StructureMeta({
  pdbId = '6LU7',
  chain = 'A',
  resolution = '2.16 Å',
  ligand = 'N3',
  structureType = 'Viral Protease',
  className = ''
}: StructureInfo) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[9px] tracking-[0.18em] uppercase text-white/50 select-none ${className}`}
      aria-label="Protein Structure Metadata HUD"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-white/30">STRUCTURE</span>
        <span className="font-semibold text-white/90">{pdbId}</span>
      </div>

      {chain && (
        <div className="flex items-center gap-1.5">
          <span className="text-white/30">CHAIN</span>
          <span className="font-semibold text-white/90">{chain}</span>
        </div>
      )}

      {resolution && (
        <div className="flex items-center gap-1.5">
          <span className="text-white/30">RESOLUTION</span>
          <span className="font-semibold text-white/90">{resolution}</span>
        </div>
      )}

      {ligand && (
        <div className="flex items-center gap-1.5">
          <span className="text-white/30">LIGAND</span>
          <span className="font-semibold text-[#e8702a]">{ligand}</span>
        </div>
      )}

      {structureType && (
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-white/30">TYPE</span>
          <span className="font-semibold text-white/70">{structureType}</span>
        </div>
      )}
    </div>
  );
}
