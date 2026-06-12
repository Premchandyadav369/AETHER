'use client';

import React, { useEffect, useRef } from 'react';

export type TwinMode = 'anatomical' | 'drug' | 'disease' | 'treatment';
export type OrganId = 'brain' | 'heart' | 'lungs' | 'liver' | 'kidneys' | 'stomach' | 'intestines';

interface OrganDef {
  id: OrganId;
  x: number; y: number; z: number;
  rx: number; ry: number;
  color: string;
  label: string;
  risk: number;
}

interface HumanAnatomyCanvasProps {
  selectedOrgan: OrganId;
  onOrganSelect?: (id: OrganId) => void;
  mode?: TwinMode;
  drugPulse?: number;
  organRisks?: Partial<Record<OrganId, number>>;
}

export default function HumanAnatomyCanvas({
  selectedOrgan,
  onOrganSelect,
  mode = 'anatomical',
  drugPulse = 0,
  organRisks = {},
}: HumanAnatomyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<{ t: number; organ: OrganId }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let af: number;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const organs: OrganDef[] = [
      { id: 'brain', x: 0, y: -128, z: 0, rx: 22, ry: 18, color: '#8B5CF6', label: 'Brain', risk: organRisks.brain ?? 0.06 },
      { id: 'lungs', x: -18, y: -42, z: 8, rx: 16, ry: 22, color: '#00E5FF', label: 'Lungs', risk: organRisks.lungs ?? 0.02 },
      { id: 'heart', x: 8, y: -38, z: 12, rx: 12, ry: 14, color: '#FF4D6D', label: 'Heart', risk: organRisks.heart ?? 0.04 },
      { id: 'liver', x: 22, y: 8, z: 5, rx: 18, ry: 12, color: '#f59e0b', label: 'Liver', risk: organRisks.liver ?? 0.12 },
      { id: 'stomach', x: -12, y: 12, z: 3, rx: 14, ry: 10, color: '#a78bfa', label: 'Stomach', risk: organRisks.stomach ?? 0.03 },
      { id: 'kidneys', x: -16, y: 22, z: -6, rx: 8, ry: 12, color: '#6EE7B7', label: 'Kidneys', risk: organRisks.kidneys ?? 0.02 },
      { id: 'intestines', x: 0, y: 38, z: 0, rx: 20, ry: 14, color: '#ec4899', label: 'Intestines', risk: organRisks.intestines ?? 0.01 },
    ];

    const skeleton: { x: number; y: number; z: number }[] = [
      { x: 0, y: -145, z: 0 }, { x: 0, y: -128, z: 0 }, { x: 0, y: -108, z: 0 },
      { x: -8, y: -100, z: 0 }, { x: 8, y: -100, z: 0 },
      { x: -42, y: -88, z: 0 }, { x: 42, y: -88, z: 0 },
      { x: -58, y: -35, z: 0 }, { x: 58, y: -35, z: 0 },
      { x: -68, y: 18, z: 0 }, { x: 68, y: 18, z: 0 },
      { x: -72, y: 72, z: 0 }, { x: 72, y: 72, z: 0 },
      { x: 0, y: -95, z: 0 }, { x: 0, y: -55, z: 0 }, { x: 0, y: -15, z: 0 },
      { x: 0, y: 25, z: 0 }, { x: 0, y: 55, z: 0 },
      { x: -28, y: 58, z: 0 }, { x: 28, y: 58, z: 0 },
      { x: -32, y: 115, z: 0 }, { x: 32, y: 115, z: 0 },
      { x: -34, y: 175, z: 0 }, { x: 34, y: 175, z: 0 },
      { x: -36, y: 228, z: 0 }, { x: 36, y: 228, z: 0 },
    ];

    const bonds: [number, number][] = [
      [0, 1], [1, 2], [2, 13], [13, 14], [14, 15], [15, 16], [16, 17],
      [2, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10],
      [16, 18], [16, 19], [18, 20], [19, 21], [20, 22], [21, 23], [22, 24], [23, 25],
    ];

    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a);
      const x = p.x * c - p.z * s;
      p.z = p.z * c + p.x * s;
      p.x = x;
    };

    const project = (p: { x: number; y: number; z: number }, cx: number, cy: number) => {
      const scale = 280 / (280 + p.z);
      return { x: cx + p.x * scale, y: cy + p.y * scale, scale };
    };

    const riskColor = (risk: number) => {
      if (risk < 0.08) return 'rgba(34,197,94,0.35)';
      if (risk < 0.15) return 'rgba(245,158,11,0.45)';
      return 'rgba(255,77,109,0.55)';
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2 + 10;
      angleRef.current += 0.008 + mouseRef.current.x * 0.00002;
      const angle = angleRef.current;

      const skel = skeleton.map(p => ({ ...p }));
      const orgs = organs.map(o => ({ ...o }));
      skel.forEach(p => rotY(p, angle));
      orgs.forEach(o => rotY(o, angle));

      // Grid floor
      ctx.strokeStyle = 'rgba(0,229,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 200, 80 + i * 15, 20, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nervous system
      if (mode === 'anatomical' || mode === 'disease') {
        ctx.strokeStyle = 'rgba(0,229,255,0.25)';
        ctx.lineWidth = 1.5;
        const spine = skel.slice(13, 18);
        for (let i = 0; i < spine.length - 1; i++) {
          const a = project(spine[i], cx, cy), b = project(spine[i + 1], cx, cy);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        const brainP = project(skel[1], cx, cy);
        ctx.beginPath(); ctx.arc(brainP.x, brainP.y, 28 * brainP.scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(139,92,246,0.3)'; ctx.stroke();
      }

      // Ribcage
      const chest = project(skel[14], cx, cy);
      ctx.strokeStyle = 'rgba(0,229,255,0.15)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(chest.x, chest.y, 38 * chest.scale, 48 * chest.scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(chest.x, chest.y + i * 8 * chest.scale, (32 - Math.abs(i) * 4) * chest.scale, 6 * chest.scale, 0, 0, Math.PI);
        ctx.stroke();
      }

      // Skeleton bonds
      ctx.strokeStyle = 'rgba(110,231,183,0.35)';
      ctx.lineWidth = 2;
      bonds.forEach(([a, b]) => {
        const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
      });

      // Skull
      const head = project(skel[1], cx, cy);
      ctx.fillStyle = 'rgba(0,229,255,0.08)';
      ctx.strokeStyle = 'rgba(0,229,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(head.x, head.y, 24 * head.scale, 28 * head.scale, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Joint nodes
      skel.forEach((p, i) => {
        const pr = project(p, cx, cy);
        const r = i <= 2 ? 3.5 : 2;
        ctx.fillStyle = 'rgba(110,231,183,0.6)';
        ctx.beginPath(); ctx.arc(pr.x, pr.y, r * pr.scale, 0, Math.PI * 2); ctx.fill();
      });

      // Circulatory - drug mode
      if (mode === 'drug' || mode === 'treatment') {
        const pulse = (Date.now() % 2000) / 2000;
        ctx.strokeStyle = 'rgba(255,77,109,0.5)';
        ctx.lineWidth = 2;
        const path = skel.slice(1, 18);
        for (let i = 0; i < path.length - 1; i++) {
          const a = project(path[i], cx, cy), b = project(path[i + 1], cx, cy);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        for (let i = 0; i < 5; i++) {
          const t = (pulse + i * 0.2) % 1;
          const idx = Math.floor(t * (path.length - 1));
          const frac = (t * (path.length - 1)) % 1;
          const a = project(path[idx], cx, cy), b = project(path[Math.min(idx + 1, path.length - 1)], cx, cy);
          const px = a.x + (b.x - a.x) * frac, py = a.y + (b.y - a.y) * frac;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
          grad.addColorStop(0, '#00E5FF');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Organs
      orgs.forEach(org => {
        const pr = project(org, cx, cy);
        const isSelected = org.id === selectedOrgan;
        const risk = org.risk;

        if (mode === 'disease') {
          ctx.fillStyle = riskColor(risk);
          ctx.beginPath();
          ctx.ellipse(pr.x, pr.y, org.rx * pr.scale * 1.2, org.ry * pr.scale * 1.2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        const grad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, org.rx * pr.scale);
        grad.addColorStop(0, org.color + 'cc');
        grad.addColorStop(0.7, org.color + '66');
        grad.addColorStop(1, org.color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(pr.x, pr.y, org.rx * pr.scale, org.ry * pr.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#00E5FF' : org.color + '88';
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.beginPath();
        ctx.ellipse(pr.x, pr.y, org.rx * pr.scale, org.ry * pr.scale, 0, 0, Math.PI * 2);
        ctx.stroke();

        if (isSelected) {
          ctx.strokeStyle = 'rgba(0,229,255,0.4)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.ellipse(pr.x, pr.y, (org.rx + 8) * pr.scale, (org.ry + 8) * pr.scale, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        if (pr.scale > 0.5) {
          ctx.fillStyle = isSelected ? '#ffffff' : org.color;
          ctx.font = `bold ${Math.max(8, 9 * pr.scale)}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(org.label, pr.x, pr.y + org.ry * pr.scale + 12);
        }
      });

      // Mode label
      ctx.fillStyle = 'rgba(0,229,255,0.6)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`MODE: ${mode.toUpperCase()}`, 12, 20);

      af = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(af); window.removeEventListener('resize', resize); };
  }, [selectedOrgan, mode, drugPulse, organRisks]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onOrganSelect) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const organs: OrganId[] = ['brain', 'heart', 'lungs', 'liver', 'kidneys', 'stomach', 'intestines'];
    const idx = Math.floor(((e.clientX - rect.left) / rect.width) * organs.length) % organs.length;
    onOrganSelect(organs[idx]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[420px] cursor-crosshair"
      onMouseMove={e => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) mouseRef.current = { x: e.clientX - rect.left - rect.width / 2, y: 0 };
      }}
      onClick={handleClick}
    />
  );
}
