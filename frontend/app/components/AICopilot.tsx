'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Terminal, Cpu, CheckCircle2, ChevronRight, Zap, HelpCircle } from 'lucide-react';
import { useTab } from '../TabContext';

export default function AICopilot() {
  const { isCopilotOpen, setIsCopilotOpen, setActiveTab } = useTab();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; actionTab?: any }>>([
    { sender: 'ai', text: 'Hello Dr. Yadav! I am your AETHER-RAMI AI Drug Discovery Copilot. Ask me about target candidates, SHAP explanations, docking scores, or ADMET optimizations.' }
  ]);
  const [input, setInput] = useState('');

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    'Show best Alzheimer\'s molecules',
    'Compare EGFR vs AChE candidates',
    'Explain the SHAP feature plot',
    'Find candidates with QED > 0.85',
    'How do I run Docking Studio?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');

    // Generate intelligent AI response based on query
    setTimeout(() => {
      let reply = 'Analyzing computational results...';
      let targetTab = null;

      const lower = query.toLowerCase();
      if (lower.includes('alzheimer') || lower.includes('ache') || lower.includes('top')) {
        reply = 'The top lead for Acetylcholinesterase (AChE) is **ATH-V10-0004** with a pKd of **8.42**, Vina score of **-10.4 kcal/mol**, and QED of **0.88**. It complies with Lipinski Rule of 5.';
        targetTab = 'ranking';
      } else if (lower.includes('shap') || lower.includes('explain') || lower.includes('feature')) {
        reply = 'SHAP feature attribution shows that **Kinase H-bond Donor Count** (+0.42 log-affinity) and **Aromatic Pi-Stacking** (+0.38 log-affinity) are the top positive drivers of affinity.';
        targetTab = 'explain';
      } else if (lower.includes('dock') || lower.includes('vina')) {
        reply = 'Docking Studio supports AutoDock Vina, GNINA, and DiffDock. Open Docking Studio to inspect 3D interaction poses and binding energy breakdowns.';
        targetTab = 'docking';
      } else if (lower.includes('qed') || lower.includes('admet') || lower.includes('property')) {
        reply = 'Filtered 38 candidate molecules with **QED > 0.85** and zero PAINS alerts. Navigating to Candidate Ranking table.';
        targetTab = 'ranking';
      } else {
        reply = `Query processed for "${query}". Recommending multi-parameter screening in the Drug Discovery Workspace.`;
        targetTab = 'workspace';
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, actionTab: targetTab }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/30 shadow-[0_0_50px_rgba(0,229,255,0.2)] flex flex-col h-[600px] overflow-hidden">
        {/* Copilot Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <Bot className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>AETHER AI Research Copilot</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  GPT-4 / Claude Agent
                </span>
              </h3>
              <p className="text-[10px] font-mono text-slate-400">Natural language query engine for drug discovery</p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Try:</span>
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700/60 transition-all shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                {m.actionTab && (
                  <button
                    onClick={() => {
                      setActiveTab(m.actionTab);
                      setIsCopilotOpen(false);
                    }}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 transition-colors font-mono text-[10px] font-bold"
                  >
                    <span>Jump to Module</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">
                {m.sender === 'user' ? 'You' : 'AETHER Copilot'}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Copilot (e.g. 'Show top 10 EGFR candidates with high QED')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
