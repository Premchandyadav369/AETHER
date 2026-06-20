'use client';

import React, { useEffect, useRef, useState } from 'react';

export type AnatomicalSystem = 'skeleton' | 'muscular' | 'circulatory' | 'nervous' | 'immune' | 'organs';
export type JourneyStage = 'administration' | 'absorption' | 'distribution' | 'metabolism' | 'excretion' | 'target_binding' | 'toxicity_risk' | 'interaction_risk' | 'confidence';
export type OrganId = 'brain' | 'heart' | 'lungs' | 'liver' | 'kidneys' | 'stomach' | 'intestines';

interface OrganDef {
  id: OrganId;
  x: number; y: number;
  radius: number;
  color: string;
  label: string;
  risk: number;
}

interface Connection {
  from: OrganId;
  to: OrganId;
  cp1x: number; cp1y: number; // control point
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
      { id: 'brain', x: 0, y: -120, radius: 24, color: '#8B5CF6', label: 'BRAIN', risk: organRisks.brain ?? 0.06 },
      { id: 'lungs', x: 45, y: -50, radius: 28, color: '#00E5FF', label: 'LUNGS', risk: organRisks.lungs ?? 0.02 },
      { id: 'heart', x: -20, y: -30, radius: 20, color: '#FF4D6D', label: 'HEART', risk: organRisks.heart ?? 0.04 },
      { id: 'liver', x: 40, y: 25, radius: 26, color: '#F59E0B', label: 'LIVER', risk: organRisks.liver ?? 0.12 },
      { id: 'stomach', x: -35, y: 35, radius: 22, color: '#A78BFA', label: 'STOMACH', risk: organRisks.stomach ?? 0.03 },
      { id: 'kidneys', x: -45, y: 90, radius: 18, color: '#6EE7B7', label: 'KIDNEYS', risk: organRisks.kidneys ?? 0.02 },
      { id: 'intestines', x: 0, y: 110, radius: 30, color: '#EC4899', label: 'INTESTINES', risk: organRisks.intestines ?? 0.01 },
    ];

    const connections: Connection[] = [
      { from: 'heart', to: 'brain', cp1x: -40, cp1y: -80 },
      { from: 'heart', to: 'lungs', cp1x: 10, cp1y: -60 },
      { from: 'heart', to: 'liver', cp1x: 10, cp1y: 0 },
      { from: 'heart', to: 'stomach', cp1x: -40, cp1y: 0 },
      { from: 'stomach', to: 'intestines', cp1x: -30, cp1y: 80 },
      { from: 'liver', to: 'kidneys', cp1x: 0, cp1y: 60 },
      { from: 'intestines', to: 'kidneys', cp1x: -20, cp1y: 110 },
      { from: 'kidneys', to: 'heart', cp1x: -80, cp1y: 20 },
    ];

    const getOrgan = (id: string) => organs.find(o => o.id === id)!;

    // Helper for quadratic bezier
    const getQuadraticPoint = (t: number, p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      return {
        x: uu * p0.x + 2 * u * t * p1.x + tt * p2.x,
        y: uu * p0.y + 2 * u * t * p1.y + tt * p2.y
      };
    };

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.save();

      const cx = w / 2, cy = h / 2 - 10;
      ctx.translate(cx, cy);

      const timeVal = Date.now() / 1000;
      pulseRef.current = (pulseRef.current + 0.05) % (Math.PI * 2);

      // ─── DRAW GRID & BACKGROUND HALO ───
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 180, 150 + i * 20, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ─── DRAW CONNECTIONS (NEURAL NETWORK) ───
      connections.forEach(conn => {
        const o1 = getOrgan(conn.from);
        const o2 = getOrgan(conn.to);
        
        ctx.beginPath();
        ctx.moveTo(o1.x, o1.y);
        ctx.quadraticCurveTo(conn.cp1x, conn.cp1y, o2.x, o2.y);
        
        // Base line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // ─── PARTICLES FOR JOURNEY STAGE ───
        // Determine if this connection should have active flowing particles based on stage
        let activeParticles = 0;
        let pColor = '#00E5FF';

        if (stage === 'administration' && conn.to === 'stomach') activeParticles = 3;
        else if (stage === 'absorption' && (conn.from === 'stomach' || conn.from === 'intestines')) activeParticles = 5;
        else if (stage === 'distribution') activeParticles = 4;
        else if (stage === 'metabolism' && (conn.to === 'liver' || conn.from === 'liver')) { activeParticles = 6; pColor = '#F59E0B'; }
        else if (stage === 'excretion' && (conn.to === 'kidneys' || conn.from === 'kidneys')) { activeParticles = 5; pColor = '#10B981'; }
        else if (stage === 'interaction_risk') { activeParticles = 3; pColor = '#FF4D6D'; }
        
        if (activeParticles > 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = pColor;
          ctx.fillStyle = pColor;
          
          for (let i = 0; i < activeParticles; i++) {
            const t = ((timeVal * 0.8) + (i / activeParticles)) % 1;
            const pt = getQuadraticPoint(t, o1, {x: conn.cp1x, y: conn.cp1y}, o2);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
      });

      // ─── DRAW ORGAN NODES (ABSTRACT GLASSMORPHISM) ───
      organs.forEach(org => {
        const isSelected = org.id === selectedOrgan;
        const isTarget = stage === 'target_binding' && org.id === 'lungs'; // Mock target
        const isRisk = stage === 'toxicity_risk' && org.id === 'heart'; // Mock risk

        // Outer glow
        ctx.shadowBlur = isSelected ? 30 : 15;
        ctx.shadowColor = isRisk ? '#FF4D6D' : (isTarget ? '#00E5FF' : org.color);

        // Fill
        const grad = ctx.createRadialGradient(org.x, org.y, 0, org.x, org.y, org.radius);
        grad.addColorStop(0, org.color + 'dd');
        grad.addColorStop(1, org.color + '22');
        ctx.fillStyle = grad;
        
        ctx.beginPath();
        let r = org.radius;
        if (isSelected || isTarget || isRisk) {
          r += Math.sin(pulseRef.current) * 3;
        }
        ctx.arc(org.x, org.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.shadowBlur = 0;
        ctx.strokeStyle = isRisk ? '#FF4D6D' : (isSelected ? '#FFFFFF' : org.color + '88');
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(org.x, org.y, r, 0, Math.PI * 2);
        ctx.stroke();

        // Ring for target or risk
        if (isTarget || isRisk) {
          ctx.strokeStyle = isRisk ? 'rgba(255, 77, 109, 0.5)' : 'rgba(0, 229, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(org.x, org.y, r + 8 + Math.sin(pulseRef.current * 2) * 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Label
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.6)';
        ctx.font = `600 10px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(org.label, org.x, org.y + org.radius + 16);
      });

      // ─── SHIELD (CONFIDENCE STAGE) ───
      if (stage === 'confidence') {
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 120, 180, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.setLineDash([10, 20]);
        ctx.beginPath();
        ctx.ellipse(0, 0, 130 + Math.sin(pulseRef.current)*5, 190 + Math.sin(pulseRef.current)*5, timeVal * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // HUD
      ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SYS_RENDER : ABSTRACT_PK_NETWORK`, 15, 25);
      ctx.fillText(`DRUG_PHASE : ${stage.toUpperCase()}`, 15, 40);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2 - 10;
    
    // Check hit boxes
    const mx = e.clientX - rect.left - cx;
    const my = e.clientY - rect.top - cy;

    const organs: OrganDef[] = [
      { id: 'brain', x: 0, y: -120, radius: 24, color: '', label: '', risk: 0 },
      { id: 'lungs', x: 45, y: -50, radius: 28, color: '', label: '', risk: 0 },
      { id: 'heart', x: -20, y: -30, radius: 20, color: '', label: '', risk: 0 },
      { id: 'liver', x: 40, y: 25, radius: 26, color: '', label: '', risk: 0 },
      { id: 'stomach', x: -35, y: 35, radius: 22, color: '', label: '', risk: 0 },
      { id: 'kidneys', x: -45, y: 90, radius: 18, color: '', label: '', risk: 0 },
      { id: 'intestines', x: 0, y: 110, radius: 30, color: '', label: '', risk: 0 },
    ];

    for (const org of organs) {
      const dist = Math.sqrt(Math.pow(mx - org.x, 2) + Math.pow(my - org.y, 2));
      if (dist <= org.radius + 10) {
        onOrganSelect(org.id);
        break;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full min-h-[460px] cursor-crosshair rounded-xl"
      onClick={handleClick}
    />
  );
}
