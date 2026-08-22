'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Atom, Scan, Dna, Activity, Layers3, Sparkles } from 'lucide-react';
import Navigation, { ProteusNavTab } from './Navigation';
import RevealLayer, { SPOTLIGHT_R } from './RevealLayer';
import StructureMeta, { StructureInfo } from './StructureMeta';

// Primary protein visual asset variables as specified
// These URLs can be replaced at any time with direct CDN/PDB render links
export const PROTEIN_IMAGE_1 = ''; // Base full protein structure / ribbon representation
export const PROTEIN_IMAGE_2 = ''; // Reveal enhanced active site / binding pocket / ligand interactions

interface ProteinHeroProps {
  onExplore?: (structure: StructureInfo) => void;
  className?: string;
}

const PRESET_STRUCTURES: StructureInfo[] = [
  {
    pdbId: '6LU7',
    chain: 'A',
    resolution: '2.16 Å',
    ligand: 'N3 (Peptide-like Inhibitor)',
    structureType: 'Viral Main Protease (Mpro)'
  },
  {
    pdbId: '1M17',
    chain: 'A',
    resolution: '2.60 Å',
    ligand: 'AQ4 (Erlotinib)',
    structureType: 'Receptor Tyrosine Kinase (EGFR)'
  },
  {
    pdbId: '3FU2',
    chain: 'A',
    resolution: '1.65 Å',
    ligand: 'G12C Covalent Inhibitor',
    structureType: 'GTPase Switch-II Domain (KRAS)'
  },
  {
    pdbId: '4EY7',
    chain: 'A',
    resolution: '2.35 Å',
    ligand: 'E20 (Donepezil)',
    structureType: 'Cholinesterase Catalytic Gorge (AChE)'
  },
  {
    pdbId: '1HCK',
    chain: 'A',
    resolution: '1.90 Å',
    ligand: 'PVB (Staurosporine)',
    structureType: 'Cyclin-Dependent Kinase (CDK2)'
  }
];

export default function ProteinHero({ onExplore, className = '' }: ProteinHeroProps) {
  const [activeStructure, setActiveStructure] = useState<StructureInfo>(PRESET_STRUCTURES[0]);
  const [activeNavTab, setActiveNavTab] = useState<ProteusNavTab>('Structure');
  const [isPointerInside, setIsPointerInside] = useState<boolean>(false);

  // Core cursor tracking refs as specified
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  // Mouse / Pointer Event tracking & RequestAnimationFrame smoothing loop
  useEffect(() => {
    // Initial center placement for touch / mobile fallback before first mouse movement
    const initX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const initY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
    mouse.current = { x: initX, y: initY };
    smooth.current = { x: initX, y: initY };

    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isPointerInside) setIsPointerInside(true);
    };

    const handlePointerLeave = () => {
      setIsPointerInside(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    // Eased interpolation loop (smooth += (mouse - smooth) * 0.1)
    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;

      setCursorPos({
        x: smooth.current.x,
        y: smooth.current.y
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPointerInside]);

  return (
    <div
      className={`min-h-screen bg-black tracking-[-0.02em] select-none ${className}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Main Fullscreen Hero Section */}
      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
        aria-label="PROTEUS Protein Structure Explorer"
      >
        {/* Layer 6: Fixed Navigation (z-[100]) */}
        <Navigation
          activeTab={activeNavTab}
          onTabChange={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'Binding Sites') {
              // Position reveal spotlight over the catalytic binding pocket
              const cx = window.innerWidth * 0.55;
              const cy = window.innerHeight * 0.52;
              mouse.current = { x: cx, y: cy };
            }
          }}
          onGetStarted={() => onExplore?.(activeStructure)}
        />

        {/* Layer 1: Base Protein Structure (z-10) */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom pointer-events-none"
          style={{
            backgroundImage: PROTEIN_IMAGE_1 ? `url(${PROTEIN_IMAGE_1})` : undefined
          }}
        >
          {/* Graceful Fallback: Scientific Ribbon Backbone & Alpha-Helices Rendering */}
          {!PROTEIN_IMAGE_1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <svg
                viewBox="0 0 1440 900"
                className="w-full h-full object-contain opacity-75 scale-105"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="baseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="backboneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="40%" stopColor="#64748b" />
                    <stop offset="80%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>

                {/* Ambient Deep Structural Cloud */}
                <ellipse cx="740" cy="460" rx="420" ry="320" fill="url(#baseGlow)" />

                {/* Domain I & II Alpha-Helices (Ribbon curves) */}
                <path
                  d="M480,580 C440,490 520,380 620,360 C720,340 760,420 840,390 C920,360 980,440 920,530 C860,620 740,660 640,630 Z"
                  stroke="url(#backboneGrad)"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60"
                />

                {/* Secondary Beta-Sheet Pleats */}
                <path
                  d="M580,420 L660,450 L640,510 L560,480 Z"
                  fill="url(#sheetGrad)"
                  stroke="#334155"
                  strokeWidth="2"
                  className="opacity-70"
                />
                <path
                  d="M680,410 L760,440 L740,500 L660,470 Z"
                  fill="url(#sheetGrad)"
                  stroke="#334155"
                  strokeWidth="2"
                  className="opacity-80"
                />
                <path
                  d="M780,400 L860,430 L840,490 L760,460 Z"
                  fill="url(#sheetGrad)"
                  stroke="#334155"
                  strokeWidth="2"
                  className="opacity-70"
                />

                {/* Connecting Loop Networks & Helical Splines */}
                <path
                  d="M520,520 Q560,340 680,310 T840,340 T960,480 T820,620 T620,600 Z"
                  stroke="#64748b"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray="14 6"
                  className="opacity-50"
                />
                <path
                  d="M600,340 Q720,260 860,330 T940,540 T780,610 T560,530"
                  stroke="#475569"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="opacity-40"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Layer 2: Protein Detail Reveal Layer (z-30 with soft spotlight mask) */}
        <RevealLayer image={PROTEIN_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y}>
          {/* Graceful Fallback: Enhanced Active-Site & Ligand Interaction Visualization */}
          {!PROTEIN_IMAGE_2 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <svg
                viewBox="0 0 1440 900"
                className="w-full h-full object-contain opacity-95 scale-105"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="revealGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#e8702a" stopOpacity="0.25" />
                    <stop offset="70%" stopColor="#e8702a" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="pocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="50%" stopColor="#e8702a" />
                    <stop offset="100%" stopColor="#c2410c" />
                  </linearGradient>
                  <linearGradient id="ligandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                </defs>

                {/* Enhanced Catalytic Pocket Glowing Halo */}
                <circle cx="720" cy="460" r="280" fill="url(#revealGlow)" />

                {/* High-Resolution Illuminated Backbone with Enhanced Depth */}
                <path
                  d="M480,580 C440,490 520,380 620,360 C720,340 760,420 840,390 C920,360 980,440 920,530 C860,620 740,660 640,630 Z"
                  stroke="#94a3b8"
                  strokeWidth="28"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90"
                />

                {/* Catalytic Active-Site Binding Pocket Surface Envelope */}
                <path
                  d="M660,420 C640,390 690,360 740,380 C790,400 810,450 780,490 C750,530 670,520 650,480 Z"
                  fill="url(#pocketGrad)"
                  fillOpacity="0.3"
                  stroke="#e8702a"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />

                {/* Bound Drug Ligand Molecule (N3 / Inhibitor Scaffold) */}
                <g className="filter drop-shadow-[0_0_12px_rgba(232,112,42,0.6)]">
                  {/* Covalent / H-Bond Intermolecular Vector Lines */}
                  <line x1="680" y1="440" x2="710" y2="425" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <line x1="710" y1="425" x2="750" y2="435" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="750" y1="435" x2="770" y2="475" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  <line x1="750" y1="435" x2="785" y2="415" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="710" y1="425" x2="700" y2="390" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Active Site Catalytic Dyad Atoms (His41 & Cys145) */}
                  <circle cx="680" cy="440" r="8" fill="#e8702a" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="710" cy="425" r="7" fill="#FFFFFF" stroke="#e8702a" strokeWidth="2" />
                  <circle cx="750" cy="435" r="9" fill="#e8702a" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="770" cy="475" r="7" fill="#fdba74" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="785" cy="415" r="6" fill="#38bdf8" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="700" cy="390" r="6" fill="#ef4444" stroke="#FFFFFF" strokeWidth="2" />

                  {/* Hydrogen-Bonding Network Dashed Vectors */}
                  <line x1="710" y1="425" x2="730" y2="370" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="750" y1="435" x2="795" y2="455" stroke="#fb923c" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Explicit Residue Badges */}
                  <text x="645" y="445" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">HIS-41</text>
                  <text x="765" y="495" fill="#fb923c" fontSize="10" fontFamily="monospace" fontWeight="bold">CYS-145</text>
                  <text x="805" y="415" fill="#38bdf8" fontSize="9" fontFamily="monospace">THR-25</text>
                </g>
              </svg>
            </div>
          )}
        </RevealLayer>

        {/* Layer 3: Subtle Atmospheric Vignette Overlay (z-40) */}
        <div
          className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/50"
          aria-hidden="true"
        />

        {/* Micro-Labels: Restrained Structural Annotations (z-50) */}
        <div className="hidden lg:block absolute top-[28%] left-14 z-50 pointer-events-none font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase">
          <span>PDB {activeStructure.pdbId}</span>
          <span className="block text-white/20 mt-0.5">α-HELIX DOMAIN</span>
        </div>

        <div className="hidden lg:block absolute top-[36%] right-16 z-50 pointer-events-none font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase text-right">
          <span>ACTIVE SITE</span>
          <span className="block text-[#e8702a]/70 mt-0.5">RESIDUE CYS-145</span>
        </div>

        {/* Layer 4: Main Hero Heading (z-50) */}
        <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.95] max-w-5xl">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{
                letterSpacing: '-0.05em',
                animationDelay: '0.25s'
              }}
            >
              See what binds
            </span>
            <span
              className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
              style={{
                letterSpacing: '-0.08em',
                animationDelay: '0.42s'
              }}
            >
              beneath the structure
            </span>
          </h1>
        </div>

        {/* Layer 5: Bottom-Left Scientific Editorial Description (z-50) */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[280px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed font-sans font-normal">
            Every protein fold encodes a molecular story — from conserved residues and catalytic domains to the pockets where ligands bind and function begins.
          </p>
        </div>

        {/* Layer 5: Bottom-Right CTA & Supporting Copy (z-50) */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[280px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans font-normal">
            Inspect domains, residues, binding pockets, ligands, mutations, and molecular interactions directly inside the structure.
          </p>

          <button
            onClick={() => onExplore?.(activeStructure)}
            className="w-full sm:w-auto bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 flex items-center justify-center gap-2 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-[#e8702a]"
          >
            <span>Explore Structure</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Layer 5: Reusable Scientific Metadata HUD (Bottom Center z-50) */}
        <div
          className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 hero-anim hero-fade pointer-events-auto"
          style={{ animationDelay: '0.95s' }}
        >
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
            <StructureMeta
              pdbId={activeStructure.pdbId}
              chain={activeStructure.chain}
              resolution={activeStructure.resolution}
              ligand={activeStructure.ligand}
              structureType={activeStructure.structureType}
            />

            {/* Quick Structure Preset Selector */}
            <div className="hidden sm:flex items-center gap-1 border-l border-white/15 pl-3">
              {PRESET_STRUCTURES.map((st) => (
                <button
                  key={st.pdbId}
                  onClick={() => setActiveStructure(st)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono transition-colors ${
                    activeStructure.pdbId === st.pdbId
                      ? 'bg-[#e8702a] text-white font-bold'
                      : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${st.pdbId}: ${st.structureType}`}
                >
                  {st.pdbId}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Subtle Molecular Center Cursor Indicator */}
        {cursorPos.x > -100 && cursorPos.y > -100 && (
          <div
            className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block"
            style={{
              left: `${cursorPos.x}px`,
              top: `${cursorPos.y}px`,
              opacity: isPointerInside ? 0.4 : 0
            }}
            aria-hidden="true"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          </div>
        )}
      </section>
    </div>
  );
}
