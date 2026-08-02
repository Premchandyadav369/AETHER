'use client';

import React from 'react';
import { Cpu, Download, ShieldCheck, Zap, BarChart3, ArrowUpRight, Sparkles } from 'lucide-react';
import { V10_MODELS, ModelMetric } from '../lib/api';

export default function ModelZoo() {
  return (
    <div className="flex flex-col gap-6">
      {/* Model Zoo Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>AI Model Zoo & Foundation Model Registry</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Auto-indexed PyTorch Graph Neural Nets, Multi-Modal Cross-Attention Transformers & Gradient Boosting Ensembles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
            9 Active Registry Models
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
            AUC: 0.954 (Cross-Attn)
          </span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {V10_MODELS.map((model, idx) => (
          <div
            key={idx}
            className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col justify-between gap-4 hover:border-cyan-500/40 transition-all group"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {model.type}
                </span>
                <span className={`text-[10px] font-mono font-bold ${model.status === 'Production' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {model.status}
                </span>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                {model.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {model.description}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">ROC-AUC Score:</span>
                <span className="text-emerald-400 font-bold">{model.auc}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">F1 Score:</span>
                <span className="text-cyan-400 font-bold">{model.f1}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">MCC Metric:</span>
                <span className="text-purple-400 font-bold">{model.mcc}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RMSE Error:</span>
                <span className="text-white font-bold">{model.rmse}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs font-mono">
              <span className="text-slate-500">Params: <strong className="text-slate-300">{model.parameters}</strong></span>
              <a
                href={`/v10/${model.file}`}
                download
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-cyan-800 transition-colors flex items-center gap-1.5 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{model.file}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
