'use client';

import React, { useMemo, useState } from 'react';
import { Sparkles, Dna, ExternalLink, Eye, Layers, Zap, Info } from 'lucide-react';

interface Molecule2DViewerProps {
  smiles: string;
  width?: number;
  height?: number;
  className?: string;
  showInteractions?: boolean;
  targetProtein?: string;
}

interface AtomNode {
  id: number;
  symbol: string;
  x: number;
  y: number;
  color: string;
  type: 'carbon' | 'nitrogen' | 'oxygen' | 'sulfur' | 'halogen' | 'other';
  interaction?: 'hbd' | 'hba' | 'aromatic' | 'hydrophobic' | 'halogen_bond' | 'covalent';
  targetContact?: string;
}

interface BondEdge {
  from: number;
  to: number;
  order: 1 | 2 | 3 | 'aromatic';
}

const ATOM_PALETTE: Record<string, { color: string; type: AtomNode['type'] }> = {
  C: { color: '#94A3B8', type: 'carbon' },
  c: { color: '#38BDF8', type: 'carbon' },
  N: { color: '#3B82F6', type: 'nitrogen' },
  n: { color: '#60A5FA', type: 'nitrogen' },
  O: { color: '#EF4444', type: 'oxygen' },
  o: { color: '#F87171', type: 'oxygen' },
  S: { color: '#F59E0B', type: 'sulfur' },
  s: { color: '#FBBF24', type: 'sulfur' },
  F: { color: '#10B981', type: 'halogen' },
  Cl: { color: '#34D399', type: 'halogen' },
  Br: { color: '#A3E635', type: 'halogen' },
  I: { color: '#C084FC', type: 'halogen' },
  P: { color: '#EC4899', type: 'other' }
};

export default function Molecule2DViewer({
  smiles,
  width = 280,
  height = 200,
  className = '',
  showInteractions = true,
  targetProtein = 'EGFR'
}: Molecule2DViewerProps) {
  const [hoveredAtom, setHoveredAtom] = useState<AtomNode | null>(null);
  const [activeLayer, setActiveLayer] = useState<'all' | 'pharmacophore' | 'bonds'>('all');

  // Real Dynamic 2D Chemical Graph Generator from SMILES
  const { nodes, edges, rings, interactionContacts } = useMemo(() => {
    const rawTokens: string[] = [];
    let i = 0;
    while (i < smiles.length) {
      if (smiles[i] === 'C' && i + 1 < smiles.length && smiles[i + 1] === 'l') {
        rawTokens.push('Cl');
        i += 2;
      } else if (smiles[i] === 'B' && i + 1 < smiles.length && smiles[i + 1] === 'r') {
        rawTokens.push('Br');
        i += 2;
      } else if (/[A-Za-z0-9\(\)\=\#\[\]\-\@]/.test(smiles[i])) {
        rawTokens.push(smiles[i]);
        i++;
      } else {
        i++;
      }
    }

    const parsedNodes: AtomNode[] = [];
    const parsedEdges: BondEdge[] = [];
    const ringOpenings: Record<string, number> = {};
    const branchStack: number[] = [];
    let prevAtomIdx: number | null = null;
    let nextBondOrder: 1 | 2 | 3 | 'aromatic' = 1;

    let currX = 100;
    let currY = 100;
    let angle = 0;
    const bondLength = 26;

    for (const token of rawTokens) {
      if (token === '=') {
        nextBondOrder = 2;
      } else if (token === '#') {
        nextBondOrder = 3;
      } else if (token === '(') {
        if (prevAtomIdx !== null) branchStack.push(prevAtomIdx);
      } else if (token === ')') {
        if (branchStack.length > 0) prevAtomIdx = branchStack.pop()!;
      } else if (/\d/.test(token)) {
        // Ring closure
        if (ringOpenings[token] !== undefined && prevAtomIdx !== null) {
          const targetIdx = ringOpenings[token];
          parsedEdges.push({ from: prevAtomIdx, to: targetIdx, order: 'aromatic' });
          delete ringOpenings[token];
        } else if (prevAtomIdx !== null) {
          ringOpenings[token] = prevAtomIdx;
        }
      } else if (/[A-Za-z]/.test(token)) {
        const atomSymbol = token;
        const atomInfo = ATOM_PALETTE[atomSymbol] || { color: '#94A3B8', type: 'carbon' };
        const atomId = parsedNodes.length;

        // Assign interaction roles based on chemical nature
        let interaction: AtomNode['interaction'] = undefined;
        let targetContact: string | undefined = undefined;

        if (atomSymbol === 'N' || atomSymbol === 'n') {
          interaction = 'hba';
          targetContact = targetProtein === 'EGFR' ? 'Met793 H-Bond' : 'Hinge Anchor';
        } else if (atomSymbol === 'O' || atomSymbol === 'o') {
          interaction = 'hba';
          targetContact = targetProtein === 'EGFR' ? 'Thr790 / Lys745' : 'Catalytic Pocket';
        } else if (atomSymbol === 'F' || atomSymbol === 'Cl') {
          interaction = 'halogen_bond';
          targetContact = 'Back Pocket Lipophilic';
        } else if (atomSymbol === 'c' || (atomSymbol === 'C' && nextBondOrder === 2)) {
          interaction = 'aromatic';
          targetContact = 'Aromatic Pi-Pi Stacking';
        } else {
          interaction = 'hydrophobic';
        }

        // Layout coordinates with 120-deg branching geometry
        if (prevAtomIdx !== null) {
          const deltaAngle = (atomId % 2 === 0 ? 1 : -1) * (Math.PI / 3);
          angle += deltaAngle;
          currX += Math.cos(angle) * bondLength;
          currY += Math.sin(angle) * bondLength;

          parsedEdges.push({ from: prevAtomIdx, to: atomId, order: nextBondOrder });
          nextBondOrder = 1;
        }

        parsedNodes.push({
          id: atomId,
          symbol: atomSymbol.toUpperCase(),
          x: currX,
          y: currY,
          color: atomInfo.color,
          type: atomInfo.type,
          interaction,
          targetContact
        });

        prevAtomIdx = atomId;
      }
    }

    // Auto-fit nodes to SVG bounding viewBox
    if (parsedNodes.length > 0) {
      const xs = parsedNodes.map(n => n.x);
      const ys = parsedNodes.map(n => n.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);

      const spanX = Math.max(20, maxX - minX);
      const spanY = Math.max(20, maxY - minY);
      const padding = 30;

      const targetW = 220;
      const targetH = 150;
      const scaleX = (targetW - padding * 2) / spanX;
      const scaleY = (targetH - padding * 2) / spanY;
      const scale = Math.min(scaleX, scaleY, 1.8);

      const offsetX = (targetW - spanX * scale) / 2 - minX * scale;
      const offsetY = (targetH - spanY * scale) / 2 - minY * scale;

      parsedNodes.forEach(n => {
        n.x = n.x * scale + offsetX;
        n.y = n.y * scale + offsetY;
      });
    }

    // Detect rings for aromatic centroid halos
    const detectedRings = parsedEdges.filter(e => e.order === 'aromatic').length;
    const interactions = parsedNodes.filter(n => n.targetContact !== undefined);

    return {
      nodes: parsedNodes,
      edges: parsedEdges,
      rings: detectedRings,
      interactionContacts: interactions
    };
  }, [smiles, targetProtein]);

  return (
    <div className={`relative flex flex-col rounded-xl bg-slate-950/90 border border-slate-800/80 p-3 overflow-hidden group shadow-lg ${className}`}>
      {/* Top Mini Control Toolbar */}
      <div className="flex items-center justify-between w-full mb-1 text-[10px] font-mono text-slate-400 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-bold text-white uppercase">{targetProtein} Ligand</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveLayer(activeLayer === 'all' ? 'pharmacophore' : 'all')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors ${
              activeLayer === 'pharmacophore' ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Pharmacophore Interacting Hotspots"
          >
            Hotspots
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex items-center justify-center w-full py-1">
        <svg
          width={width}
          height={height}
          viewBox="0 0 220 150"
          className="w-full h-auto drop-shadow-[0_0_12px_rgba(0,229,255,0.15)] select-none"
        >
          <defs>
            <linearGradient id="bondLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="pocketGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Pharmacophore Hotspot Halos */}
          {showInteractions && interactionContacts.map((contact, idx) => (
            <g key={`halo-${idx}`}>
              <circle
                cx={contact.x}
                cy={contact.y}
                r={12}
                fill={contact.interaction === 'hba' ? '#EF444420' : contact.interaction === 'hbd' ? '#3B82F620' : '#10B98120'}
                stroke={contact.interaction === 'hba' ? '#EF444480' : contact.interaction === 'hbd' ? '#3B82F680' : '#10B98180'}
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              {/* Interaction contact line towards target residue */}
              <line
                x1={contact.x}
                y1={contact.y}
                x2={contact.x + (contact.id % 2 === 0 ? 18 : -18)}
                y2={contact.y - 14}
                stroke={contact.interaction === 'hba' ? '#EF4444' : '#00E5FF'}
                strokeWidth={1.2}
                strokeDasharray="2 2"
              />
              <circle
                cx={contact.x + (contact.id % 2 === 0 ? 18 : -18)}
                cy={contact.y - 14}
                r={2}
                fill="#00E5FF"
              />
            </g>
          ))}

          {/* Chemical Bonds */}
          {edges.map((edge, idx) => {
            const n1 = nodes[edge.from];
            const n2 = nodes[edge.to];
            if (!n1 || !n2) return null;

            const isDouble = edge.order === 2;
            const isTriple = edge.order === 3;
            const isAromatic = edge.order === 'aromatic';

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={isAromatic ? '#38BDF8' : '#64748B'}
                  strokeWidth={isDouble ? 3.5 : isTriple ? 4.5 : 1.8}
                  strokeLinecap="round"
                />
                {isDouble && (
                  <line
                    x1={n1.x + 2}
                    y1={n1.y + 2}
                    x2={n2.x + 2}
                    y2={n2.y + 2}
                    stroke="#00E5FF"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                )}
                {isAromatic && (
                  <line
                    x1={n1.x}
                    y1={n1.y}
                    x2={n2.x}
                    y2={n2.y}
                    stroke="#00E5FF"
                    strokeWidth={1.0}
                    strokeDasharray="3 2"
                  />
                )}
              </g>
            );
          })}

          {/* Atom Nodes */}
          {nodes.map((node) => {
            const isCarbon = node.symbol === 'C';
            const isHovered = hoveredAtom?.id === node.id;
            const radius = isCarbon ? 3.5 : 6.0;

            return (
              <g
                key={`node-${node.id}`}
                onMouseEnter={() => setHoveredAtom(node)}
                onMouseLeave={() => setHoveredAtom(null)}
                className="cursor-pointer transition-transform"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? radius * 1.5 : radius}
                  fill={isCarbon ? '#0F172A' : node.color}
                  stroke={isCarbon ? '#00E5FF' : '#FFFFFF'}
                  strokeWidth={isHovered ? 2 : 1}
                />
                {!isCarbon && (
                  <text
                    x={node.x}
                    y={node.y + 3.5}
                    fontSize={8.5}
                    fontWeight="bold"
                    fill="#0F172A"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {node.symbol}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered Atom Interaction Tooltip */}
      {hoveredAtom && (
        <div className="absolute top-8 left-2 right-2 p-2 rounded-lg bg-slate-950/95 border border-cyan-500/50 text-[10px] font-mono text-white shadow-xl z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-cyan-300">Atom #{hoveredAtom.id + 1}: {hoveredAtom.symbol}</span>
            <span className="text-slate-400">({hoveredAtom.type})</span>
          </div>
          {hoveredAtom.targetContact && (
            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[9px] font-bold">
              {hoveredAtom.targetContact}
            </span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="w-full mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5">
        <span className="truncate max-w-[130px] text-cyan-300 font-bold" title={smiles}>
          {smiles}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{nodes.length} Atoms</span>
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(smiles)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
            title="Inspect on PubChem"
          >
            <span>PubChem</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
