'use client';

import React from 'react';

export function PageHeader({ icon, title, subtitle, badge }: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-display font-extrabold text-2xl tracking-tight text-white">{title}</h2>
        {badge && <span className="badge-api text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{badge}</span>}
      </div>
      <p className="text-xs text-aether-muted max-w-2xl">{subtitle}</p>
    </div>
  );
}

export function MetricCard({ label, value, unit, color = 'text-aether-primary' }: {
  label: string; value: string | number; unit?: string; color?: string;
}) {
  return (
    <div className="glass-panel-interactive magnetic-target rounded-xl p-4 flex flex-col gap-1">
      <span className="text-[9px] text-aether-muted uppercase tracking-wider font-bold">{label}</span>
      <span className={`font-scientific font-bold text-lg ${color}`}>
        {value}{unit && <span className="text-xs text-aether-muted ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export function PipelineStep({ num, title, desc, color, active }: {
  num: string; title: string; desc: string; color: string; active?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border bg-aether-bg/60 flex flex-col gap-2 magnetic-target transition-all ${color} ${active ? 'shadow-neon border-aether-primary/40' : ''}`}>
      <span className="text-xl font-scientific font-bold opacity-40">0{num}</span>
      <h4 className="font-display font-bold text-xs text-white">{title}</h4>
      <p className="text-[10px] text-aether-muted leading-relaxed">{desc}</p>
    </div>
  );
}

export function StatsCard({ count, label }: { count: string; label: string }) {
  return (
    <div className="glass-panel-interactive magnetic-target rounded-xl p-5 flex flex-col gap-1 text-center">
      <span className="font-scientific font-black text-xl text-aether-primary">{count}</span>
      <span className="text-[10px] text-aether-muted uppercase tracking-wider font-bold">{label}</span>
    </div>
  );
}

export function TimelineItem({ version, title, desc, active, isFuture }: {
  version: string; title: string; desc: string; active: boolean; isFuture?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 relative z-10 ${isFuture ? 'opacity-50' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-scientific font-black border-2 ${
        active ? 'bg-aether-primary/20 border-aether-primary text-aether-primary shadow-neon animate-pulse-slow'
          : isFuture ? 'bg-aether-bg2 border-aether-border text-aether-muted'
          : 'bg-aether-bg2 border-aether-border text-aether-muted'
      }`}>{version}</div>
      <h4 className={`font-display font-bold text-xs ${active ? 'text-white' : 'text-aether-muted'}`}>{title}</h4>
      <p className="text-[9px] text-aether-muted text-center leading-relaxed max-w-[110px]">{desc}</p>
    </div>
  );
}

export function GalleryCard({ src, title, desc, type = 'iframe' }: {
  src: string; title: string; desc: string; type?: 'iframe' | 'img';
}) {
  return (
    <div className="glass-panel-interactive magnetic-target rounded-2xl overflow-hidden flex flex-col group">
      <div className="p-4 border-b border-aether-border">
        <h3 className="font-display font-bold text-white text-sm">{title}</h3>
        <p className="text-[10px] text-aether-muted mt-0.5">{desc}</p>
      </div>
      <div className="h-[280px] bg-aether-bg overflow-hidden relative">
        {type === 'iframe' ? (
          <iframe src={src} className="w-full h-full border-none pointer-events-auto" title={title} />
        ) : (
          <img src={src} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
      </div>
    </div>
  );
}

export function ShapBar({ label, value, color }: { label: string; value: number; color: string }) {
  const isPos = value > 0;
  const displayVal = Math.abs(value);
  return (
    <div className="flex flex-col gap-1.5 text-xs text-aether-muted">
      <div className="flex justify-between font-bold">
        <span>{label}</span>
        <span className="font-scientific text-white">{isPos ? '+' : '-'}{displayVal}%</span>
      </div>
      <div className="w-full bg-aether-bg rounded-full h-2 overflow-hidden flex">
        {!isPos && <div className="flex-1" />}
        <div className={`${color} h-full transition-all duration-700`} style={{ width: `${displayVal / 2}%` }} />
        {isPos && <div className="flex-1" />}
      </div>
    </div>
  );
}

export function FlowStep({ label, active, done }: { label: string; active?: boolean; done?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
      done ? 'border-aether-success/40 bg-aether-success/10 text-aether-secondary'
        : active ? 'border-aether-primary/50 bg-aether-primary/10 text-aether-primary animate-pulse'
        : 'border-aether-border text-aether-muted'
    }`}>
      {done ? '✓' : active ? '●' : '○'} {label}
    </div>
  );
}

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 rounded-full border-2 border-aether-primary border-t-transparent animate-spin" />
      <span className="font-scientific text-xs text-aether-primary">{message}</span>
    </div>
  );
}

export function ApiError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="text-aether-danger text-sm font-bold">Backend Connection Error</span>
      <p className="text-xs text-aether-muted max-w-md">{message}</p>
      <p className="text-[10px] text-aether-muted">Ensure FastAPI is running: <code className="font-scientific text-aether-primary">uvicorn backend.main:app --reload --port 8000</code></p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 rounded-lg bg-aether-primary/20 border border-aether-primary/40 text-aether-primary text-xs font-bold">
          Retry Connection
        </button>
      )}
    </div>
  );
}
