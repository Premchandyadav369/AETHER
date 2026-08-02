'use client';

import React, { useState } from 'react';
import { Settings, Cpu, ShieldCheck, RefreshCw, Save, Key } from 'lucide-react';
import { useTab } from '../TabContext';

export default function SettingsPage() {
  const { userMode, setUserMode } = useTab();
  const [seed, setSeed] = useState<number>(42);
  const [precision, setPrecision] = useState<'fp16' | 'fp32' | 'bf16'>('fp16');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>Platform Hardware & System Settings</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Configure GPU precision, random seeds, docking engine parameters, and API endpoints
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Settings Saved!' : 'Save System Config'}</span>
        </button>
      </div>

      <div className="rounded-2xl glass-panel p-6 border border-slate-800 flex flex-col gap-6">
        {/* User Mode Toggle */}
        <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
          <label className="text-sm font-bold text-white">Platform Experience Mode</label>
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setUserMode('beginner')}
              className={`px-4 py-2 rounded-xl border ${userMode === 'beginner' ? 'bg-cyan-950 text-cyan-400 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
            >
              Beginner Guided Mode (Wizard Flow)
            </button>
            <button
              onClick={() => setUserMode('expert')}
              className={`px-4 py-2 rounded-xl border ${userMode === 'expert' ? 'bg-cyan-950 text-cyan-400 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
            >
              Expert Mode (Granular Parameter Tuning)
            </button>
          </div>
        </div>

        {/* Floating Point Precision */}
        <div className="flex flex-col gap-2 pb-4 border-b border-slate-800">
          <label className="text-sm font-bold text-white">PyTorch GPU Tensor Precision</label>
          <div className="flex items-center gap-3 font-mono text-xs">
            {['fp16', 'bf16', 'fp32'].map(p => (
              <button
                key={p}
                onClick={() => setPrecision(p as any)}
                className={`px-4 py-2 rounded-xl border ${precision === p ? 'bg-purple-950 text-purple-300 border-purple-600 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                {p.toUpperCase()} Tensor Cores
              </button>
            ))}
          </div>
        </div>

        {/* Reproducibility Seed */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-white">Global Reproducibility Random Seed</label>
          <input
            type="number"
            value={seed}
            onChange={e => setSeed(parseInt(e.target.value))}
            className="w-48 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
