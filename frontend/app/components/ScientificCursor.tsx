'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Tab } from '../TabContext';

type CursorMode = 'molecular' | 'protein' | 'quantum' | 'magnetic';

function getCursorMode(tab: Tab): CursorMode {
  if (['proteins', 'workspace'].includes(tab)) return 'protein';
  if (['copilot', 'explain', 'dashboard'].includes(tab)) return 'quantum';
  if (['engine', 'molecules', 'druglab', 'knowledge'].includes(tab)) return 'magnetic';
  return 'molecular';
}

interface TrailPoint { x: number; y: number; t: number; }

export default function ScientificCursor({ activeTab }: { activeTab: Tab }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const velRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const clickPulseRef = useRef(0);
  const helixTrailRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);
  const bondsRef = useRef<{ x: number; y: number; life: number }[]>([]);
  const rafRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  const mode = getCursorMode(activeTab);

  const initQuantumParticles = useCallback(() => {
    const p = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      p.push({
        x: Math.cos(angle) * 20,
        y: Math.sin(angle) * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: Math.random(),
      });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    initQuantumParticles();
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - posRef.current.x;
      const dy = e.clientY - posRef.current.y;
      velRef.current = { x: dx, y: dy };
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      if (mode === 'protein') {
        helixTrailRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
        if (helixTrailRef.current.length > 40) helixTrailRef.current.shift();
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      isHoveringRef.current = !!(
        t.tagName === 'BUTTON' || t.tagName === 'A' ||
        t.closest('button') || t.closest('a') ||
        t.classList.contains('cursor-pointer') ||
        t.classList.contains('glass-panel-interactive') ||
        t.classList.contains('magnetic-target')
      );
      if (isHoveringRef.current && mode === 'molecular') {
        bondsRef.current.push({ x: e.clientX, y: e.clientY, life: 1 });
        if (bondsRef.current.length > 8) bondsRef.current.shift();
      }
    };

    const onClick = () => {
      clickPulseRef.current = 1;
      if (mode === 'quantum') {
        particlesRef.current.forEach(p => {
          p.vx = (Math.random() - 0.5) * 12;
          p.vy = (Math.random() - 0.5) * 12;
        });
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [mode, initQuantumParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = posRef.current;
      if (x < 0) { rafRef.current = requestAnimationFrame(draw); return; }

      const speed = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
      const orbitSpeed = 0.02 + Math.min(speed * 0.008, 0.12);
      t += orbitSpeed;

      if (clickPulseRef.current > 0) clickPulseRef.current *= 0.88;

      // Protein ribbon trail
      if (mode === 'protein' && helixTrailRef.current.length > 2) {
        const trail = helixTrailRef.current;
        for (let i = 1; i < trail.length; i++) {
          const age = (Date.now() - trail[i].t) / 600;
          const alpha = Math.max(0, 1 - age);
          const wave = Math.sin(i * 0.5 + t * 3) * 6;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x + wave, trail[i - 1].y);
          ctx.lineTo(trail[i].x + wave, trail[i].y);
          ctx.strokeStyle = `rgba(110, 231, 183, ${alpha * 0.6})`;
          ctx.lineWidth = 2.5 - i * 0.04;
          ctx.stroke();
        }
      }

      // Quantum particle cloud
      if (mode === 'quantum') {
        particlesRef.current.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.92; p.vy *= 0.92;
          const dist = Math.sqrt(p.x * p.x + p.y * p.y);
          if (dist > 35) { p.x *= 0.9; p.y *= 0.9; }
          p.life = (p.life + 0.02) % 1;
          const alpha = 0.3 + Math.sin(p.life * Math.PI * 2) * 0.2;
          ctx.beginPath();
          ctx.arc(x + p.x, y + p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.fill();
        });
        if (clickPulseRef.current > 0.1) {
          ctx.beginPath();
          ctx.arc(x, y, 30 * clickPulseRef.current, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 229, 255, ${clickPulseRef.current})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Molecular bonds on hover
      if (mode === 'molecular') {
        bondsRef.current = bondsRef.current.filter(b => b.life > 0);
        bondsRef.current.forEach(b => {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${b.life * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          b.life -= 0.04;
        });
      }

      // Electrons orbiting nucleus
      const electronCount = mode === 'magnetic' ? 5 : 3;
      const orbitR = isHoveringRef.current ? 28 : 22;
      for (let i = 0; i < electronCount; i++) {
        const angle = t * (1 + i * 0.3) + (i * Math.PI * 2) / electronCount;
        const ex = x + Math.cos(angle) * orbitR;
        const ey = y + Math.sin(angle) * orbitR * 0.7;
        ctx.beginPath();
        ctx.arc(ex, ey, mode === 'magnetic' ? 3 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = mode === 'magnetic' ? '#6EE7B7' : '#00E5FF';
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00E5FF';
      }
      ctx.shadowBlur = 0;

      // Orbit path
      ctx.beginPath();
      ctx.ellipse(x, y, orbitR, orbitR * 0.7, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Nucleus
      const nucleusR = isHoveringRef.current ? 7 : 5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, nucleusR);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, mode === 'protein' ? '#6EE7B7' : mode === 'quantum' ? '#8B5CF6' : '#00E5FF');
      grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.beginPath();
      ctx.arc(x, y, nucleusR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Hover bond ring
      if (isHoveringRef.current) {
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mode]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
      aria-hidden
    />
  );
}
