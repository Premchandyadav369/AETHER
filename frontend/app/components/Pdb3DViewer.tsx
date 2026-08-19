'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box, RefreshCw, Eye, Maximize2, Layers, ShieldCheck, Sparkles,
  Download, Camera, ZoomIn, ZoomOut, RotateCcw, Upload, Info, CheckCircle2
} from 'lucide-react';
import { KNOWN_PROTEINS } from '../lib/api';

export interface PdbAtom {
  id: number;
  name: string;
  resName: string;
  chain: string;
  resSeq: number;
  x: number;
  y: number;
  z: number;
  occupancy: number;
  bFactor: number;
  element: string;
  isHetatm: boolean;
  ssType?: 'helix' | 'sheet' | 'loop';
}

interface SecondaryStructure {
  helices: { startSeq: number; endSeq: number; chain: string }[];
  sheets: { startSeq: number; endSeq: number; chain: string }[];
}

interface Pdb3DViewerProps {
  pdbId?: string;
  pdbUrl?: string;
  height?: string;
  showBindingPocket?: boolean;
  highlightLigand?: boolean;
  onResidueSelect?: (residue: { name: string; seq: number; chain: string }) => void;
}

const ELEMENT_COLORS: Record<string, string> = {
  C: '#00E5FF',
  N: '#3B82F6',
  O: '#EF4444',
  S: '#F59E0B',
  P: '#EC4899',
  H: '#E2E8F0',
  F: '#10B981',
  CL: '#10B981',
  BR: '#84CC16',
  I: '#8B5CF6',
  DEFAULT: '#94A3B8'
};

const RESIDUE_HYDROPHOBICITY: Record<string, 'hydrophobic' | 'polar' | 'charged_pos' | 'charged_neg'> = {
  ALA: 'hydrophobic', VAL: 'hydrophobic', LEU: 'hydrophobic', ILE: 'hydrophobic',
  MET: 'hydrophobic', PHE: 'hydrophobic', TRP: 'hydrophobic', PRO: 'hydrophobic',
  SER: 'polar', THR: 'polar', CYS: 'polar', ASN: 'polar', GLN: 'polar', TYR: 'polar',
  LYS: 'charged_pos', ARG: 'charged_pos', HIS: 'charged_pos',
  ASP: 'charged_neg', GLU: 'charged_neg'
};

export default function Pdb3DViewer({
  pdbId = '1M17',
  pdbUrl,
  height = 'h-[500px]',
  showBindingPocket = true,
  highlightLigand = true,
  onResidueSelect
}: Pdb3DViewerProps) {
  const [renderMode, setRenderMode] = useState<'ribbon' | 'ball_stick' | 'spacefill' | 'pocket'>('ribbon');
  const [colorScheme, setColorScheme] = useState<'secondary' | 'plddt' | 'chain' | 'hydrophobic' | 'element'>('secondary');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.008);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Parsed structure state
  const [atoms, setAtoms] = useState<PdbAtom[]>([]);
  const [hetatms, setHetatms] = useState<PdbAtom[]>([]);
  const [secStruct, setSecStruct] = useState<SecondaryStructure>({ helices: [], sheets: [] });
  const [stats, setStats] = useState({ totalAtoms: 0, residues: 0, chains: 1, hetatmCount: 0 });
  const [hoveredAtom, setHoveredAtom] = useState<PdbAtom | null>(null);
  const [selectedResidue, setSelectedResidue] = useState<string | null>(null);

  // 3D Camera / Orbit State
  const rotRef = useRef({ x: 0.3, y: 0.5, z: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1.0);
  const isDraggingRef = useRef<boolean>(false);
  const isPanningRef = useRef<boolean>(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const proteinInfo = KNOWN_PROTEINS.find(p => p.id.toUpperCase() === pdbId.toUpperCase()) || KNOWN_PROTEINS[0];
  const fileUrl = pdbUrl || proteinInfo?.file || `/v10/${pdbId.toLowerCase()}.pdb`;

  // Parse raw PDB string into structured atoms
  const parsePdbText = useCallback((text: string) => {
    const lines = text.split('\n');
    const parsedAtoms: PdbAtom[] = [];
    const parsedHetatms: PdbAtom[] = [];
    const helices: { startSeq: number; endSeq: number; chain: string }[] = [];
    const sheets: { startSeq: number; endSeq: number; chain: string }[] = [];
    const uniqueResidues = new Set<string>();
    const uniqueChains = new Set<string>();

    for (const line of lines) {
      const record = line.substring(0, 6).trim();

      if (record === 'HELIX') {
        const chain = line.substring(19, 20).trim();
        const startSeq = parseInt(line.substring(21, 25).trim(), 10);
        const endSeq = parseInt(line.substring(33, 37).trim(), 10);
        if (!isNaN(startSeq) && !isNaN(endSeq)) {
          helices.push({ startSeq, endSeq, chain });
        }
      } else if (record === 'SHEET') {
        const chain = line.substring(21, 22).trim();
        const startSeq = parseInt(line.substring(22, 26).trim(), 10);
        const endSeq = parseInt(line.substring(33, 37).trim(), 10);
        if (!isNaN(startSeq) && !isNaN(endSeq)) {
          sheets.push({ startSeq, endSeq, chain });
        }
      } else if (record === 'ATOM' || record === 'HETATM') {
        const id = parseInt(line.substring(6, 11).trim(), 10);
        const name = line.substring(12, 16).trim();
        const resName = line.substring(17, 20).trim();
        const chain = line.substring(21, 22).trim() || 'A';
        const resSeq = parseInt(line.substring(22, 26).trim(), 10);
        const x = parseFloat(line.substring(30, 38).trim());
        const y = parseFloat(line.substring(38, 46).trim());
        const z = parseFloat(line.substring(46, 54).trim());
        const occupancy = parseFloat(line.substring(54, 60).trim()) || 1.0;
        const bFactor = parseFloat(line.substring(60, 66).trim()) || 50.0;
        let element = line.substring(76, 78).trim().toUpperCase();
        if (!element && name) {
          element = name.replace(/[^A-Za-z]/g, '').substring(0, 1).toUpperCase();
        }

        if (isNaN(x) || isNaN(y) || isNaN(z)) continue;

        // Determine secondary structure
        let ssType: 'helix' | 'sheet' | 'loop' = 'loop';
        if (helices.some(h => h.chain === chain && resSeq >= h.startSeq && resSeq <= h.endSeq)) {
          ssType = 'helix';
        } else if (sheets.some(s => s.chain === chain && resSeq >= s.startSeq && resSeq <= s.endSeq)) {
          ssType = 'sheet';
        }

        const atom: PdbAtom = {
          id,
          name,
          resName,
          chain,
          resSeq,
          x,
          y,
          z,
          occupancy,
          bFactor,
          element: element || 'C',
          isHetatm: record === 'HETATM',
          ssType
        };

        if (record === 'ATOM') {
          parsedAtoms.push(atom);
          uniqueResidues.add(`${chain}_${resSeq}`);
          uniqueChains.add(chain);
        } else if (record === 'HETATM' && resName !== 'HOH') {
          // Keep non-water ligands
          parsedHetatms.push(atom);
        }
      }
    }

    // Center coordinates at origin
    if (parsedAtoms.length > 0) {
      let cx = 0, cy = 0, cz = 0;
      parsedAtoms.forEach(a => { cx += a.x; cy += a.y; cz += a.z; });
      cx /= parsedAtoms.length;
      cy /= parsedAtoms.length;
      cz /= parsedAtoms.length;

      parsedAtoms.forEach(a => { a.x -= cx; a.y -= cy; a.z -= cz; });
      parsedHetatms.forEach(a => { a.x -= cx; a.y -= cy; a.z -= cz; });
    }

    setAtoms(parsedAtoms);
    setHetatms(parsedHetatms);
    setSecStruct({ helices, sheets });
    setStats({
      totalAtoms: parsedAtoms.length,
      residues: uniqueResidues.size,
      chains: Math.max(1, uniqueChains.size),
      hetatmCount: parsedHetatms.length
    });
    setLoading(false);
  }, []);

  // Fetch PDB File
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(fileUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to load PDB from ${fileUrl}`);
        return res.text();
      })
      .then(text => {
        parsePdbText(text);
      })
      .catch(err => {
        console.warn('Local PDB fetch fallback:', err);
        // Fallback to RCSB PDB direct fetch if local artifact missing
        if (pdbId && pdbId.length === 4) {
          fetch(`https://files.rcsb.org/download/${pdbId.toUpperCase()}.pdb`)
            .then(res => res.text())
            .then(text => parsePdbText(text))
            .catch(e2 => {
              setError(`Could not load PDB: ${e2.message}`);
              setLoading(false);
            });
        } else {
          setError(`PDB file not found: ${err.message}`);
          setLoading(false);
        }
      });
  }, [fileUrl, pdbId, parsePdbText]);

  // Handle Custom File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parsePdbText(text);
    };
    reader.readAsText(file);
  };

  // Color helper based on selected scheme
  const getAtomColor = useCallback((atom: PdbAtom): string => {
    if (atom.isHetatm) {
      return ELEMENT_COLORS[atom.element] || '#EC4899';
    }

    if (colorScheme === 'secondary') {
      if (atom.ssType === 'helix') return '#A855F7'; // Purple alpha-helix
      if (atom.ssType === 'sheet') return '#00E5FF'; // Cyan beta-sheet
      return '#64748B'; // Slate coil / loop
    }

    if (colorScheme === 'plddt') {
      const b = atom.bFactor;
      if (b >= 90) return '#1D4ED8'; // Deep blue (Very High)
      if (b >= 70) return '#00E5FF'; // Cyan (Confident)
      if (b >= 50) return '#F59E0B'; // Yellow (Low)
      return '#EF4444'; // Orange / Red (Very Low)
    }

    if (colorScheme === 'chain') {
      const chainColors = ['#00E5FF', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];
      const idx = atom.chain.charCodeAt(0) % chainColors.length;
      return chainColors[idx];
    }

    if (colorScheme === 'hydrophobic') {
      const type = RESIDUE_HYDROPHOBICITY[atom.resName] || 'polar';
      if (type === 'hydrophobic') return '#F59E0B'; // Amber
      if (type === 'charged_pos') return '#3B82F6'; // Blue
      if (type === 'charged_neg') return '#EF4444'; // Red
      return '#10B981'; // Green polar
    }

    if (colorScheme === 'element') {
      return ELEMENT_COLORS[atom.element] || ELEMENT_COLORS.DEFAULT;
    }

    return '#00E5FF';
  }, [colorScheme]);

  // Main 3D Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Filter C-alpha atoms for ribbon backbone
    const caAtoms = atoms.filter(a => a.name === 'CA');
    const displayAtoms = renderMode === 'ball_stick' || renderMode === 'spacefill'
      ? (atoms.length > 1500 ? atoms.filter((_, i) => i % 2 === 0) : atoms)
      : caAtoms;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2 + panRef.current.x;
      const cy = height / 2 + panRef.current.y;

      if (isRotating && !isDraggingRef.current) {
        rotRef.current.y += rotationSpeed;
      }

      const rx = rotRef.current.x;
      const ry = rotRef.current.y;

      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const cosY = Math.cos(ry), sinY = Math.sin(ry);

      // Scale factor mapping angstroms to canvas pixels
      const scale = (Math.min(width, height) / 90.0) * zoomRef.current;

      // Project 3D atom to 2D screen coordinates with depth sorting
      interface ProjectedAtom {
        atom: PdbAtom;
        px: number;
        py: number;
        pz: number;
        color: string;
      }

      const projected: ProjectedAtom[] = [];

      // Project backbone / display atoms
      for (const a of displayAtoms) {
        // Y-axis rotation
        const x1 = a.x * cosY - a.z * sinY;
        const z1 = a.x * sinY + a.z * cosY;

        // X-axis rotation
        const y2 = a.y * cosX - z1 * sinX;
        const z2 = a.y * sinX + z1 * cosX;

        // Perspective division
        const fov = 400;
        const pz = z2 + 120;
        const perspective = fov / Math.max(10, pz + fov);

        const px = cx + x1 * scale * perspective;
        const py = cy + y2 * scale * perspective;

        projected.push({
          atom: a,
          px,
          py,
          pz: z2,
          color: getAtomColor(a)
        });
      }

      // Project HETATM ligands
      const projectedHetatms: ProjectedAtom[] = [];
      if (highlightLigand && hetatms.length > 0) {
        for (const a of hetatms) {
          const x1 = a.x * cosY - a.z * sinY;
          const z1 = a.x * sinY + a.z * cosY;
          const y2 = a.y * cosX - z1 * sinX;
          const z2 = a.y * sinX + z1 * cosX;

          const fov = 400;
          const pz = z2 + 120;
          const perspective = fov / Math.max(10, pz + fov);

          projectedHetatms.push({
            atom: a,
            px: cx + x1 * scale * perspective,
            py: cy + y2 * scale * perspective,
            pz: z2,
            color: ELEMENT_COLORS[a.element] || '#EC4899'
          });
        }
      }

      // Draw Spatial Background Grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 1. Render Mode: Ribbon (Spline Backbone)
      if (renderMode === 'ribbon' || renderMode === 'pocket') {
        // Group CA atoms by chain
        const chainsMap: Record<string, ProjectedAtom[]> = {};
        projected.forEach(p => {
          const c = p.atom.chain;
          if (!chainsMap[c]) chainsMap[c] = [];
          chainsMap[c].push(p);
        });

        Object.values(chainsMap).forEach(chainAtoms => {
          if (chainAtoms.length < 2) return;

          for (let i = 0; i < chainAtoms.length - 1; i++) {
            const p1 = chainAtoms[i];
            const p2 = chainAtoms[i + 1];

            // Check if consecutive residues
            if (Math.abs(p1.atom.resSeq - p2.atom.resSeq) > 2) continue;

            const isHelix = p1.atom.ssType === 'helix' && p2.atom.ssType === 'helix';
            const isSheet = p1.atom.ssType === 'sheet' && p2.atom.ssType === 'sheet';

            ctx.lineWidth = isHelix ? 4.5 * scale * 0.08 : isSheet ? 3.5 * scale * 0.08 : 2.0 * scale * 0.08;
            ctx.strokeStyle = p1.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();

            // Glow highlights for helices
            if (isHelix) {
              ctx.strokeStyle = `${p1.color}40`;
              ctx.lineWidth = 8.0 * scale * 0.08;
              ctx.stroke();
            }
          }
        });
      }

      // 2. Render Mode: Ball & Stick / Spacefill / Pocket Nodes
      // Sort all atoms back-to-front (Z-buffer painter algorithm)
      const allRenderable = [...projected, ...projectedHetatms].sort((a, b) => a.pz - b.pz);

      for (const p of allRenderable) {
        const isHovered = hoveredAtom && hoveredAtom.id === p.atom.id;
        const isHet = p.atom.isHetatm;
        const isPocketResidue = ['MET', 'THR', 'LYS', 'CYS', 'ASP', 'PHE'].includes(p.atom.resName.toUpperCase());

        let radius = 2.0;
        if (renderMode === 'spacefill') radius = 6.0;
        else if (renderMode === 'ball_stick') radius = isHet ? 4.5 : 2.8;
        else if (isHet) radius = 5.0;
        else if (renderMode === 'pocket' && isPocketResidue) radius = 4.0;

        radius *= (scale / 4.0) * (isHovered ? 1.5 : 1.0);
        radius = Math.max(1.5, Math.min(18, radius));

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
        ctx.fill();

        // 3D Specular reflection dot
        if (radius > 3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(p.px - radius * 0.3, p.py - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Highlight Active Pocket or Ligand with Outer Halo
        if (isHet || (showBindingPocket && isPocketResidue && renderMode === 'pocket')) {
          ctx.strokeStyle = isHet ? '#EC4899' : '#F59E0B';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.px, p.py, radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw Ligand Bond Connectors if HETATM
      if (highlightLigand && projectedHetatms.length > 1) {
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 2.0;
        for (let i = 0; i < projectedHetatms.length - 1; i++) {
          const h1 = projectedHetatms[i];
          const h2 = projectedHetatms[i + 1];
          const dist = Math.hypot(h1.px - h2.px, h1.py - h2.py);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(h1.px, h1.py);
            ctx.lineTo(h2.px, h2.py);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [atoms, hetatms, renderMode, colorScheme, isRotating, rotationSpeed, showBindingPocket, highlightLigand, hoveredAtom, getAtomColor]);

  // Mouse / Touch Drag Orbit Controls
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = e.button === 0;
    isPanningRef.current = e.button === 2 || e.shiftKey;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingRef.current || isPanningRef.current) {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;

      if (isPanningRef.current) {
        panRef.current.x += dx;
        panRef.current.y += dy;
      } else {
        rotRef.current.y += dx * 0.008;
        rotRef.current.x += dy * 0.008;
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Hover hit-testing
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const scale = (Math.min(canvas.width, canvas.height) / 90.0) * zoomRef.current;
      const cx = canvas.width / 2 + panRef.current.x;
      const cy = canvas.height / 2 + panRef.current.y;
      const cosX = Math.cos(rotRef.current.x), sinX = Math.sin(rotRef.current.x);
      const cosY = Math.cos(rotRef.current.y), sinY = Math.sin(rotRef.current.y);

      let closest: PdbAtom | null = null;
      let minD = 12;

      for (const a of atoms) {
        const x1 = a.x * cosY - a.z * sinY;
        const z1 = a.x * sinY + a.z * cosY;
        const y2 = a.y * cosX - z1 * sinX;
        const z2 = a.y * sinX + z1 * cosX;
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;
        const d = Math.hypot(px - mx, py - my);
        if (d < minD) {
          minD = d;
          closest = a;
        }
      }
      setHoveredAtom(closest);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    zoomRef.current = Math.max(0.2, Math.min(5.0, zoomRef.current + delta));
  };

  // Reset Camera View
  const resetCamera = () => {
    rotRef.current = { x: 0.3, y: 0.5, z: 0 };
    panRef.current = { x: 0, y: 0 };
    zoomRef.current = 1.0;
  };

  // Save Canvas PNG Snapshot
  const captureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pdbId}_3d_structure.png`;
    a.click();
  };

  return (
    <div className={`relative flex flex-col rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] ${height}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs font-mono text-slate-300 z-20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white">{proteinInfo?.id || pdbId}</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-300 font-bold truncate max-w-[200px]">{proteinInfo?.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                {proteinInfo?.resolution || '2.6 Å'}
              </span>
            </div>
          </div>
        </div>

        {/* Rendering Mode Selectors */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {(['ribbon', 'pocket', 'ball_stick', 'spacefill'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                renderMode === mode
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'ball_stick' ? 'Ball & Stick' : mode === 'spacefill' ? 'CPK Spacefill' : mode}
            </button>
          ))}
        </div>

        {/* Color Scheme Picker */}
        <div className="flex items-center gap-1.5">
          <select
            value={colorScheme}
            onChange={e => setColorScheme(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="secondary">Color: Secondary Structure</option>
            <option value="plddt">Color: pLDDT / B-Factor</option>
            <option value="chain">Color: Chain ID</option>
            <option value="hydrophobic">Color: Hydrophobicity</option>
            <option value="element">Color: Chemical Element</option>
          </select>

          {/* Action Buttons */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isRotating ? 'bg-cyan-950 text-cyan-400 border-cyan-500/50' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 3D Rotation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={captureSnapshot}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300"
            title="Export 3D Snapshot (PNG)"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          <label
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Upload Custom PDB File"
          >
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".pdb,.ent" onChange={handleFileUpload} className="hidden" />
          </label>

          <a
            href={fileUrl}
            download
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Download Raw .pdb File"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main 3D WebGL / Canvas Viewport */}
      <div className="relative flex-1 bg-[#02050f] flex items-center justify-center overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 font-mono text-xs text-cyan-300">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Parsing Real PDB 3D Coordinates ({pdbId})...</span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center gap-2 font-mono text-xs text-rose-400 p-4 text-center">
            <span>{error}</span>
            <button
              onClick={() => parsePdbText('')}
              className="px-3 py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700"
            >
              Retry Loading
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={e => e.preventDefault()}
          className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
        />

        {/* Floating Structure Metadata Badge */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/85 backdrop-blur border border-slate-800 text-[10px] font-mono text-slate-400 shadow-xl pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Total Atoms: <strong className="text-white">{stats.totalAtoms.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Residues: <strong className="text-purple-300">{stats.residues}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Chains: <strong className="text-emerald-300">{stats.chains}</strong></span>
          </div>
          {stats.hetatmCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              <span>Bound Ligand Atoms: <strong className="text-pink-300">{stats.hetatmCount}</strong></span>
            </div>
          )}
        </div>

        {/* Interactive Atom / Residue Inspector Tooltip */}
        {hoveredAtom && (
          <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-slate-950/90 backdrop-blur border border-cyan-500/50 text-[11px] font-mono text-white shadow-[0_0_20px_rgba(0,229,255,0.25)] pointer-events-none flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[9px]">
                {hoveredAtom.resName} {hoveredAtom.resSeq}
              </span>
              <span className="font-bold text-cyan-300">Atom: {hoveredAtom.name} ({hoveredAtom.element})</span>
              <span className="text-[9px] text-slate-400">Chain {hoveredAtom.chain}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
              <span>Coords: ({hoveredAtom.x.toFixed(1)}, {hoveredAtom.y.toFixed(1)}, {hoveredAtom.z.toFixed(1)})</span>
              <span>B-Factor: <strong className="text-emerald-400">{hoveredAtom.bFactor.toFixed(1)}</strong></span>
            </div>
          </div>
        )}

        {/* Right Corner Legend */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none font-mono text-[10px]">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800 text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>α-Helix</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 ml-1"></span>
            <span>β-Sheet</span>
            <span className="w-2 h-2 rounded-full bg-slate-500 ml-1"></span>
            <span>Loop</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9px]">
            Drag: Rotate • Right-Drag: Pan • Scroll: Zoom
          </div>
        </div>
      </div>
    </div>
  );
}
