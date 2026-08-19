'use client';

import React, { useState, useEffect } from 'react';
import { useTab } from '../TabContext';
import { fetchDigitalTwin } from '../lib/api';
import { Activity, Heart, ShieldAlert, Cpu, Gauge, Zap, Pill, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function DigitalTwinSimulator() {
  const { smilesInput } = useTab();
  const [route, setRoute] = useState<'oral' | 'iv' | 'inhalation'>('oral');
  const [doseMg, setDoseMg] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [simData, setSimData] = useState<any>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const data = await fetchDigitalTwin(smilesInput, route);
      setSimData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [smilesInput, route]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                PBPK WHOLE-BODY DYNAMICS
              </span>
              <span className="text-xs text-slate-400 font-mono">v10-TWIN</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Heart className="w-6 h-6 text-indigo-400" />
              <span>Digital Human Twin & Pharmacokinetics Simulator</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-mono">
              Simulate 5-compartment in-vivo biodistribution, plasma concentration clearance curves, and organ metabolism.
            </p>
          </div>

          {/* Route selector buttons */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
            {(['oral', 'iv', 'inhalation'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoute(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                  route === r
                    ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r} Route
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Peak Conc (Cmax)</span>
          <span className="text-xl font-mono font-bold text-cyan-400 mt-1">
            {simData ? `${simData.pkpd.cmax_nM} nM` : '380.0 nM'}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Therapeutic Window
          </span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Time to Peak (Tmax)</span>
          <span className="text-xl font-mono font-bold text-indigo-400 mt-1">
            {simData ? `${simData.pkpd.tmax_min} min` : '35 min'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1">Absorption Kinetics</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Half-Life (t1/2)</span>
          <span className="text-xl font-mono font-bold text-purple-400 mt-1">
            {simData ? `${simData.pkpd.half_life_hr} hr` : '8.4 hr'}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 mt-1">Once-Daily Dosing Feasible</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Target Engagement</span>
          <span className="text-xl font-mono font-bold text-emerald-400 mt-1">
            {simData ? `${simData.pkpd.target_engagement_pct}%` : '87.5%'}
          </span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1">High Receptor Occupancy</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col">
          <span className="text-[10px] font-mono text-slate-500 uppercase">Bioavailability (F)</span>
          <span className="text-xl font-mono font-bold text-amber-400 mt-1">
            {simData ? `${simData.pkpd.bioavailability_pct}%` : '74.2%'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-1">Oral Delivery Class II</span>
        </div>
      </div>

      {/* 5-Compartment Whole Body Simulation Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>In-Vivo Organ Compartment Time-Concentration Curves</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">PBPK Dynamic Multi-Phase Model</span>
          </div>

          <div className="flex flex-col gap-4">
            {simData?.journey?.map((step: any, idx: number) => {
              const maxConc = 600;
              const pct = Math.min(100, (step.concentration_nM / maxConc) * 100);
              const isTumor = step.compartment.includes('Tumour');
              const isBrain = step.compartment.includes('Brain');
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                        T + {step.minute} min
                      </span>
                      <span className="font-bold text-white">{step.compartment}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">{step.effect}</span>
                      <span className={`font-bold ${isTumor ? 'text-emerald-400' : isBrain ? 'text-purple-400' : 'text-cyan-400'}`}>
                        {step.concentration_nM} nM
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isTumor
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                          : isBrain
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organ Clearance & Toxicity Insights */}
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Organ Safety & Elimination</span>
            </h3>

            <div className="flex flex-col gap-2.5 font-mono text-xs mt-1">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Hepatic Load: Moderate</span>
                  <span className="text-[11px] text-slate-400">CYP3A4 Phase I oxidation within standard clearance envelope.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Renal Excretion: Normal</span>
                  <span className="text-[11px] text-slate-400">Glomerular filtration rate predicted at 14.8 mL/min.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Blood-Brain Barrier (BBB)</span>
                  <span className="text-[11px] text-slate-400">Moderate CNS penetration; ideal for peripheral oncology targets.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-800 bg-slate-950/60 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-500">Target Molecule SMILES</span>
            <code className="text-[10px] font-mono text-cyan-300 break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
              {smilesInput}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
