'use client';

import React, { useEffect, useRef, useState } from 'react';

export type AnatomicalSystem = 'skeleton' | 'muscular' | 'circulatory' | 'nervous' | 'immune' | 'organs';
export type JourneyStage = 'administration' | 'absorption' | 'distribution' | 'metabolism' | 'excretion' | 'target_binding' | 'toxicity_risk' | 'interaction_risk' | 'confidence';
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
  system: AnatomicalSystem;
  stage: JourneyStage;
  organRisks?: Partial<Record<OrganId, number>>;
}

export default function HumanAnatomyCanvas({
  selectedOrgan,
  onOrganSelect,
  system = 'organs',
  stage = 'administration',
  organRisks = {},
}: HumanAnatomyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let af: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const organs: OrganDef[] = [
      { id: 'brain', x: 0, y: -130, z: 0, rx: 22, ry: 18, color: '#8B5CF6', label: 'Brain', risk: organRisks.brain ?? 0.06 },
      { id: 'lungs', x: -16, y: -45, z: 8, rx: 15, ry: 24, color: '#00E5FF', label: 'Lungs', risk: organRisks.lungs ?? 0.02 },
      { id: 'heart', x: 8, y: -40, z: 12, rx: 11, ry: 13, color: '#FF4D6D', label: 'Heart', risk: organRisks.heart ?? 0.04 },
      { id: 'liver', x: 20, y: 6, z: 5, rx: 18, ry: 11, color: '#F59E0B', label: 'Liver', risk: organRisks.liver ?? 0.12 },
      { id: 'stomach', x: -12, y: 10, z: 3, rx: 14, ry: 9, color: '#A78BFA', label: 'Stomach', risk: organRisks.stomach ?? 0.03 },
      { id: 'kidneys', x: -15, y: 22, z: -8, rx: 8, ry: 12, color: '#6EE7B7', label: 'Kidneys', risk: organRisks.kidneys ?? 0.02 },
      { id: 'intestines', x: 0, y: 40, z: 0, rx: 22, ry: 15, color: '#EC4899', label: 'Intestines', risk: organRisks.intestines ?? 0.01 },
    ];

    // Detailed 3D coordinates for skeleton joints
    const skeleton: { x: number; y: number; z: number; type?: string }[] = [
      { x: 0, y: -150, z: 0, type: 'head' }, { x: 0, y: -132, z: 0 }, { x: 0, y: -110, z: 0 },
      { x: -12, y: -102, z: 0 }, { x: 12, y: -102, z: 0 }, // shoulders
      { x: -38, y: -88, z: 5 }, { x: 38, y: -88, z: 5 }, // elbows
      { x: -55, y: -38, z: 10 }, { x: 55, y: -38, z: 10 }, // wrists
      { x: 0, y: -90, z: 0 }, { x: 0, y: -50, z: 0 }, { x: 0, y: -10, z: 0 }, // spine
      { x: 0, y: 28, z: 0 }, { x: 0, y: 58, z: 0 }, // pelvis
      { x: -26, y: 62, z: 0 }, { x: 26, y: 62, z: 0 }, // hips
      { x: -28, y: 125, z: 5 }, { x: 28, y: 125, z: 5 }, // knees
      { x: -30, y: 195, z: 10 }, { x: 30, y: 195, z: 10 }, // ankles
    ];

    const bonds: [number, number][] = [
      [0, 1], [1, 2], [2, 9], [9, 10], [10, 11], [11, 12], [12, 13], // spine
      [2, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], // arms
      [13, 14], [13, 15], [14, 16], [15, 17], [16, 18], [17, 19], // legs
    ];

    const rotY = (p: { x: number; y: number; z: number }, a: number) => {
      const c = Math.cos(a), s = Math.sin(a);
      const x = p.x * c - p.z * s;
      p.z = p.z * c + p.x * s;
      p.x = x;
    };

    const project = (p: { x: number; y: number; z: number }, cx: number, cy: number) => {
      const scale = 320 / (320 + p.z);
      return { x: cx + p.x * scale, y: cy + p.y * scale, scale };
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2 - 10;
      angleRef.current += 0.007 + mouseRef.current.x * 0.000015;
      const angle = angleRef.current;
      pulseRef.current = (pulseRef.current + 0.01) % (Math.PI * 2);

      const skel = skeleton.map(p => ({ ...p }));
      const orgs = organs.map(o => ({ ...o }));
      skel.forEach(p => rotY(p, angle));
      orgs.forEach(o => rotY(o, angle));

      // Grid base
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 220, 100 + i * 15, 25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ─── 1. SKELETON SYSTEM ───
      if (system === 'skeleton') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 2.5;
        bonds.forEach(([a, b]) => {
          const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        });

        // Ribs
        const chest = project(skel[9], cx, cy);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.2;
        for (let i = -3; i <= 3; i++) {
          ctx.beginPath();
          ctx.ellipse(chest.x, chest.y + i * 10 * chest.scale, 28 * chest.scale, 8 * chest.scale, 0, 0, Math.PI);
          ctx.stroke();
        }

        // Joints
        skel.forEach((p, i) => {
          const pr = project(p, cx, cy);
          ctx.fillStyle = i === 0 ? 'rgba(255, 255, 255, 0.15)' : '#4DA3FF';
          ctx.beginPath();
          ctx.arc(pr.x, pr.y, (i === 0 ? 22 : 4) * pr.scale, 0, Math.PI * 2);
          ctx.fill();
          if (i > 0) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      }

      // ─── 2. MUSCULAR SYSTEM ───
      if (system === 'muscular') {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.28)';
        ctx.lineWidth = 1.2;
        // Draw muscle wireframes along skeleton bonds
        bonds.forEach(([a, b]) => {
          const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
          const dx = p2.x - p1.x, dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / len, ny = dx / len;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo((p1.x + p2.x) / 2 + nx * 14 * p1.scale, (p1.y + p2.y) / 2 + ny * 14 * p1.scale, p2.x, p2.y);
          ctx.quadraticCurveTo((p1.x + p2.x) / 2 - nx * 14 * p1.scale, (p1.y + p2.y) / 2 - ny * 14 * p1.scale, p1.x, p1.y);
          ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
          ctx.fill();
          ctx.stroke();
        });
      }

      // ─── 3. CIRCULATORY SYSTEM ───
      if (system === 'circulatory') {
        // Red (Arteries) and Blue (Veins) paths
        ctx.lineWidth = 1.5;
        const arterialGradient = ctx.createLinearGradient(cx, cy - 100, cx, cy + 200);
        arterialGradient.addColorStop(0, '#FF4D6D');
        arterialGradient.addColorStop(1, '#8B5CF6');

        bonds.forEach(([a, b]) => {
          const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
          ctx.strokeStyle = 'rgba(255, 77, 109, 0.45)';
          ctx.beginPath(); ctx.moveTo(p1.x - 2, p1.y); ctx.lineTo(p2.x - 2, p2.y); ctx.stroke();

          ctx.strokeStyle = 'rgba(77, 163, 255, 0.45)';
          ctx.beginPath(); ctx.moveTo(p1.x + 2, p1.y); ctx.lineTo(p2.x + 2, p2.y); ctx.stroke();
        });
      }

      // ─── 4. NERVOUS SYSTEM ───
      if (system === 'nervous') {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 1;
        // Central spinal cord + branching fibers
        skel.slice(9, 14).forEach((p, idx) => {
          const pr = project(p, cx, cy);
          ctx.beginPath();
          ctx.moveTo(pr.x, pr.y);
          ctx.lineTo(pr.x - 50 * pr.scale, pr.y + 15 * pr.scale);
          ctx.moveTo(pr.x, pr.y);
          ctx.lineTo(pr.x + 50 * pr.scale, pr.y + 15 * pr.scale);
          ctx.stroke();
        });

        // Spine cord
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
        const spine = skel.slice(1, 14);
        ctx.beginPath();
        spine.forEach((p, idx) => {
          const pr = project(p, cx, cy);
          if (idx === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        });
        ctx.stroke();
      }

      // ─── 5. IMMUNE SYSTEM ───
      if (system === 'immune') {
        // Lymph nodes as tiny green target nodes
        skel.forEach((p, i) => {
          if (i % 2 === 0) {
            const pr = project(p, cx, cy);
            ctx.fillStyle = 'rgba(110, 231, 183, 0.7)';
            ctx.beginPath();
            ctx.arc(pr.x - 12 * pr.scale, pr.y - 8 * pr.scale, 3, 0, Math.PI * 2);
            ctx.arc(pr.x + 12 * pr.scale, pr.y + 8 * pr.scale, 3, 0, Math.PI * 2);
            ctx.fill();
            // Pulse rings
            ctx.strokeStyle = 'rgba(110, 231, 183, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pr.x - 12 * pr.scale, pr.y - 8 * pr.scale, 3 + Math.sin(pulseRef.current) * 8, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      // ─── 6. ORGAN SYSTEMS ───
      if (system === 'organs') {
        orgs.forEach(org => {
          const pr = project(org, cx, cy);
          const isSelected = org.id === selectedOrgan;
          const organRisk = org.risk;

          // Render Organ Glassmorphic Shading
          const grad = ctx.createRadialGradient(pr.x, pr.y, 0, pr.x, pr.y, org.rx * pr.scale);
          grad.addColorStop(0, org.color + 'dd');
          grad.addColorStop(0.6, org.color + '66');
          grad.addColorStop(1, org.color + '00');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(pr.x, pr.y, org.rx * pr.scale, org.ry * pr.scale, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = isSelected ? '#00E5FF' : org.color + 'bb';
          ctx.lineWidth = isSelected ? 2.5 : 1;
          ctx.beginPath();
          ctx.ellipse(pr.x, pr.y, org.rx * pr.scale, org.ry * pr.scale, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Selection dashed outline
          if (isSelected) {
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.ellipse(pr.x, pr.y, (org.rx + 8) * pr.scale, (org.ry + 8) * pr.scale, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          if (pr.scale > 0.5) {
            ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(226, 232, 240, 0.85)';
            ctx.font = `bold ${Math.max(8, 9 * pr.scale)}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(org.label, pr.x, pr.y + org.ry * pr.scale + 12);
          }
        });
      }

      // ─── ADMET DRUG JOURNEY SIMULATION PATHS ───
      // Overlay flowing particles based on active stage
      const timeVal = Date.now() / 1000;
      ctx.fillStyle = '#00E5FF';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00E5FF';

      if (stage === 'administration') {
        // Particles entering stomach mouth area down to esophagus
        const mouth = project(skel[1], cx, cy);
        const stomach = project({ x: -12, y: 10, z: 3 }, cx, cy);
        for (let i = 0; i < 6; i++) {
          const t = ((timeVal + i * 0.3) % 1.5) / 1.5;
          const px = mouth.x + (stomach.x - mouth.x) * t;
          const py = mouth.y + (stomach.y - mouth.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } 
      else if (stage === 'absorption') {
        // Diffusing particles pulsing from Stomach / Intestines outwardly
        const stomach = project({ x: -12, y: 10, z: 3 }, cx, cy);
        const intestines = project({ x: 0, y: 40, z: 0 }, cx, cy);
        
        [stomach, intestines].forEach(organNode => {
          const ringRadius = 15 + Math.sin(pulseRef.current * 2) * 20;
          ctx.strokeStyle = 'rgba(110, 231, 183, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(organNode.x, organNode.y, ringRadius * organNode.scale, 0, Math.PI * 2);
          ctx.stroke();

          // Diffusing sparks
          for (let i = 0; i < 8; i++) {
            const angleVal = (i / 8) * Math.PI * 2;
            const dist = 12 + ((timeVal * 30 + i * 10) % 25);
            ctx.fillStyle = '#6EE7B7';
            ctx.beginPath();
            ctx.arc(
              organNode.x + Math.cos(angleVal) * dist * organNode.scale,
              organNode.y + Math.sin(angleVal) * dist * organNode.scale,
              2, 0, Math.PI * 2
            );
            ctx.fill();
          }
        });
      } 
      else if (stage === 'distribution') {
        // Rushing particles flowing through all skeleton-mapped blood vessels
        ctx.fillStyle = '#4DA3FF';
        bonds.forEach(([a, b]) => {
          const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
          const t = (timeVal * 1.5) % 1;
          const px = p1.x + (p2.x - p1.x) * t;
          const py = p1.y + (p2.y - p1.y) * t;
          ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
        });
      } 
      else if (stage === 'metabolism') {
        // Heavy particle convergence in the Liver
        const liver = project({ x: 20, y: 6, z: 5 }, cx, cy);
        ctx.fillStyle = '#F59E0B';
        for (let i = 0; i < 15; i++) {
          const ang = (i * 0.45) + timeVal * 2;
          const radius = (i * 1.2) % (15 * liver.scale);
          ctx.beginPath();
          ctx.arc(liver.x + Math.cos(ang) * radius, liver.y + Math.sin(ang) * radius, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } 
      else if (stage === 'excretion') {
        // Excreting from kidneys down the bladder exit paths
        const kidneys = project({ x: -15, y: 22, z: -8 }, cx, cy);
        ctx.fillStyle = '#10B981';
        for (let i = 0; i < 8; i++) {
          const t = ((timeVal * 1.2 + i * 0.25) % 1);
          const py = kidneys.y + t * 90 * kidneys.scale;
          const px = kidneys.x + Math.sin(py * 0.1) * 6 * kidneys.scale;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } 
      else if (stage === 'target_binding') {
        // Highlight binding hotspot target at specific tumors or lungs
        const targetOrg = project({ x: -16, y: -45, z: 8 }, cx, cy); // Lungs tumor example
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(targetOrg.x, targetOrg.y, 25 * targetOrg.scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00E5FF';
        ctx.beginPath();
        ctx.arc(targetOrg.x, targetOrg.y, 6 + Math.abs(Math.sin(pulseRef.current * 3)) * 4, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (stage === 'toxicity_risk') {
        // Heart off-target cardiac warnings represented by red warning radar arcs
        const heart = project({ x: 8, y: -40, z: 12 }, cx, cy);
        ctx.strokeStyle = '#FF4D6D';
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(heart.x, heart.y, i * 12 * heart.scale * (1 + (timeVal % 0.8) / 0.8), 0, Math.PI * 2);
          ctx.stroke();
        }
      } 
      else if (stage === 'interaction_risk') {
        // Multiple contrasting colors flowing in arteries/veins representing drug interference
        bonds.forEach(([a, b], idx) => {
          const p1 = project(skel[a], cx, cy), p2 = project(skel[b], cx, cy);
          const t = (timeVal * 1.2 + idx * 0.1) % 1;
          const px = p1.x + (p2.x - p1.x) * t;
          const py = p1.y + (p2.y - p1.y) * t;
          ctx.fillStyle = idx % 2 === 0 ? '#00E5FF' : '#FF4D6D';
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } 
      else if (stage === 'confidence') {
        // Glowing cyan aura shield wrapping the body
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 75, 195, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 82 + Math.sin(pulseRef.current) * 4, 202 + Math.sin(pulseRef.current) * 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // HUD Text label overlay
      ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SYS_RENDER: ${system.toUpperCase()}`, 15, 25);
      ctx.fillText(`DRUG_PHASE: ${stage.toUpperCase()}`, 15, 38);

      af = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(af);
      window.removeEventListener('resize', resize);
    };
  }, [selectedOrgan, system, stage, organRisks]);

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
      className="w-full h-full min-h-[460px] cursor-pointer"
      onMouseMove={e => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) mouseRef.current = { x: e.clientX - rect.left - rect.width / 2, y: 0 };
      }}
      onClick={handleClick}
    />
  );
}
