'use client';

import React, { useState } from 'react';
import {
  HelpCircle, Sparkles, ArrowRight, Play, CheckCircle2, Heart,
  Dna, Microscope, FlaskConical, Layers, ShieldCheck, Zap, BookOpen,
  Info, ChevronRight, Check, Compass, Award, ExternalLink
} from 'lucide-react';
import { useTab, SectionTab } from '../TabContext';

interface DiseasePreset {
  id: string;
  title: string;
  subtitle: string;
  disease: string;
  targetProtein: string;
  pdbId: string;
  leadSmiles: string;
  leadName: string;
  icon: any;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  laymanGoal: string;
  actionRoute: SectionTab;
}

const DISEASE_PRESETS: DiseasePreset[] = [
  {
    id: 'lung_cancer',
    title: 'Stop Non-Small Cell Lung Cancer',
    subtitle: 'Block the hyperactive EGFR kinase machine',
    disease: 'Non-Small Cell Lung Cancer',
    targetProtein: 'EGFR Kinase Domain',
    pdbId: '1M17',
    leadSmiles: 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCC(F)CN1CCOCC1',
    leadName: 'Osimertinib-Derivative Lead ATH-01',
    icon: Dna,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
    badgeBg: 'bg-cyan-950',
    badgeBorder: 'border-cyan-700',
    laymanGoal: 'Cancer cells divide uncontrollably because the EGFR protein switch is stuck in the "ON" position. Our drug key slots into the hinge pocket to flip the switch "OFF".',
    actionRoute: 'generator'
  },
  {
    id: 'kras_pancreatic',
    title: 'Inactivate Undruggable KRAS G12C',
    subtitle: 'Irreversibly trap the mutant oncogenic switch',
    disease: 'Pancreatic & Non-Small Cell Lung Cancer',
    targetProtein: 'KRAS G12C Switch-II Pocket',
    pdbId: '3FU2',
    leadSmiles: 'CC1=C(C=C(C=C1)NC2=NC=CC(=N2)C3=CN=CC=C3)NC(=O)C=C',
    leadName: 'Sotorasib-Class Covalent Warhead Lead ATH-02',
    icon: Zap,
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
    badgeBg: 'bg-purple-950',
    badgeBorder: 'border-purple-700',
    laymanGoal: 'KRAS was considered "undruggable" for 40 years. Our molecule uses a tiny chemical hook (acrylamide) that permanently latches onto mutant Cysteine-12 to lock it inactive.',
    actionRoute: 'precision'
  },
  {
    id: 'breast_cancer',
    title: 'Halt Breast Cancer Cell Proliferation',
    subtitle: 'Dual CDK2 & Estrogen Receptor inhibition',
    disease: 'ER+ Metastatic Breast Cancer',
    targetProtein: 'CDK2 Kinase Complex',
    pdbId: '1HCK',
    leadSmiles: 'CCN(CC)CCNC(=O)c1c(C)[nH]c(c1C)/C=C/2\\C(=O)Nc3ccc(F)cc23',
    leadName: 'CDK2/4 Selective Cell-Cycle Brake ATH-03',
    icon: FlaskConical,
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-300',
    badgeBg: 'bg-pink-950',
    badgeBorder: 'border-pink-700',
    laymanGoal: 'CDK2 acts as the engine accelerator for cell duplication. By occupying the ATP fuel chamber, our drug cuts off the energy supply to stop tumor division.',
    actionRoute: 'digitaltwin'
  },
  {
    id: 'alzheimers_ache',
    title: 'Protect Neurotransmission in Alzheimer\'s',
    subtitle: 'Inhibit Acetylcholinesterase in the brain',
    disease: 'Alzheimer\'s Neurodegenerative Disease',
    targetProtein: 'Human Acetylcholinesterase (AChE)',
    pdbId: '4EY7',
    leadSmiles: 'CN1CCC2=C(C1)C=C(C=C2)OC(=O)c3ccccc3',
    leadName: 'Donepezil-Type Brain-Penetrant Lead ATH-04',
    icon: Heart,
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
    badgeBg: 'bg-emerald-950',
    badgeBorder: 'border-emerald-700',
    laymanGoal: 'In Alzheimer\'s, vital acetylcholine neurotransmitters are broken down too quickly. Our drug shields acetylcholine to sustain memory signals in brain synapses.',
    actionRoute: 'proteins'
  }
];

const GLOSSARY_ITEMS = [
  {
    term: 'Target Protein (The Lock)',
    layman: 'A large, folded microscopic biological machine in our cells. In disease, this protein malfunctions or drives tumor growth.',
    analogy: 'The lock on a door that needs to be secured or blocked.'
  },
  {
    term: 'Drug Candidate / Ligand (The Key)',
    layman: 'A small chemical molecule precisely shaped to fit into the target protein pocket to shut down its harmful disease activity.',
    analogy: 'A custom-cut key designed to fit into the lock perfectly.'
  },
  {
    term: 'SMILES String (Molecular Code)',
    layman: 'A simple text-based format that chemists and AI models use to describe atomic structures (e.g. C for Carbon, N for Nitrogen, O for Oxygen).',
    analogy: 'Like writing a musical chord sheet or a computer code for atoms.'
  },
  {
    term: 'Binding Pocket (The Keyhole)',
    layman: 'A 3D hollow groove on the surface of the protein lined with amino acid residues where the drug molecule attaches.',
    analogy: 'The exact interior contours of the lock where the key teeth engage.'
  },
  {
    term: 'Binding Affinity (Stickiness / pKd)',
    layman: 'A measure of how tightly and effectively the drug key binds into the protein lock. Higher pKd (or lower negative kcal/mol energy) means stronger stickiness.',
    analogy: 'A powerful magnetic pull that prevents the key from falling out.'
  },
  {
    term: 'ADMET (The Drug\'s Human Journey)',
    layman: 'Absorption (how it enters blood), Distribution (where it travels), Metabolism (how liver processes it), Excretion (how kidneys clean it), Toxicity (is it safe for the heart and liver?).',
    analogy: 'A safety inspection ensuring the car travels safely to its destination without breaking down or causing accidents.'
  },
  {
    term: 'Retrosynthesis (The Chemical Recipe)',
    layman: 'Working backwards from the final drug molecule to find simple, cheap starting ingredients and steps to brew it in a real laboratory.',
    analogy: 'A master chef\'s step-by-step recipe to cook a gourmet dish from grocery store ingredients.'
  }
];

export default function BeginnerGuideHub() {
  const { setSmilesInput, setSelectedProtein, setActiveTab } = useTab();
  const [selectedGlossary, setSelectedGlossary] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(1);

  const launchPreset = (preset: DiseasePreset) => {
    setSelectedProtein(preset.pdbId);
    setSmilesInput(preset.leadSmiles);
    setActiveTab(preset.actionRoute);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Welcome Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Beginner & New User Command Center</span>
            </span>
            <span className="text-xs font-mono text-slate-400">Drug Discovery in Plain English</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            How Drug Discovery Works & 1-Click Guided Journeys
          </h1>
          <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-sans">
            Designing a life-saving medicine is like crafting a high-precision 3D key to fit into a microscopic disease lock.
            Use this interactive hub to explore how every engine works in simple layman terms, or launch a 1-click disease discovery template below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => launchPreset(DISEASE_PRESETS[0])}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-slate-950 hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Quick-Start Discovery</span>
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Open 8-Stage Pipeline</span>
          </button>
        </div>
      </div>

      {/* 4-Step Simplified Drug Discovery Journey */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>The 4-Step Journey from Disease to Medicine</span>
            </h2>
            <p className="text-xs font-mono text-slate-400">The entire scientific process simplified for anyone to follow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: 1,
              title: '1. Choose Target Lock',
              desc: 'Select the disease-causing protein structure (e.g. EGFR for Lung Cancer or KRAS for Pancreatic).',
              tab: 'proteins' as SectionTab,
              icon: Microscope,
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
            },
            {
              step: 2,
              title: '2. Generate Drug Key',
              desc: 'Use AI generative neural models (ProtCond-VAE) to sample molecules that match the target shape.',
              tab: 'generator' as SectionTab,
              icon: Sparkles,
              color: 'text-purple-400 border-purple-500/30 bg-purple-950/20'
            },
            {
              step: 3,
              title: '3. Test 3D Docking Fit',
              desc: 'Simulate the 3D atomic collision and measure how strongly the key sticks into the protein pocket.',
              tab: 'docking' as SectionTab,
              icon: Layers,
              color: 'text-pink-400 border-pink-500/30 bg-pink-950/20'
            },
            {
              step: 4,
              title: '4. Check Body Safety & Lab Recipe',
              desc: 'Simulate human organ absorption (PBPK Twin) and generate step-by-step chemical synthesis steps.',
              tab: 'digitaltwin' as SectionTab,
              icon: ShieldCheck,
              color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
            }
          ].map(item => (
            <div
              key={item.step}
              onClick={() => setActiveTab(item.tab)}
              className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer flex flex-col justify-between gap-3 group hover:border-cyan-400 hover:scale-[1.02] ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-black text-xs text-white">
                  {item.step}
                </span>
                <item.icon className="w-5 h-5 text-current opacity-80 group-hover:opacity-100" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 pt-2 border-t border-slate-800/80">
                <span>Explore Step</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Disease Discovery Presets */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span>Ready-to-Run Disease Discovery Presets (1-Click Launch)</span>
          </h2>
          <p className="text-xs font-mono text-slate-400">Click any preset to instantly configure the target protein, drug lead, and biophysical simulations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DISEASE_PRESETS.map(preset => {
            const Icon = preset.icon;
            return (
              <div
                key={preset.id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-4 bg-slate-950/80 group shadow-lg"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${preset.badgeBg} ${preset.badgeBorder} border text-white`}>
                      {preset.disease}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      PDB: {preset.pdbId}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{preset.subtitle}</span>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    {preset.laymanGoal}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span>Target: <strong className="text-white">{preset.targetProtein}</strong></span>
                    <span>Lead: <strong className="text-purple-300">{preset.leadName}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => launchPreset(preset)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-500 hover:to-indigo-600 text-cyan-300 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch This Disease Discovery Pipeline</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Plain-English Glossary & Science Explainers */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col gap-5 bg-slate-950/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Interactive Plain-English Science Glossary</span>
            </h2>
            <p className="text-xs font-mono text-slate-400">Master every key term without needing a PhD in chemistry or biophysics</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
            {GLOSSARY_ITEMS.length} Key Concepts Explained
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Glossary Navigation List */}
          <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-1">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGlossary(idx)}
                className={`p-3 rounded-xl text-left text-xs font-mono font-bold transition-all flex items-center justify-between ${
                  selectedGlossary === idx
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span>{item.term}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedGlossary === idx ? 'translate-x-0.5 text-cyan-300' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          {/* Active Concept Explanation Card */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex flex-col justify-between gap-4 shadow-xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-black text-lg text-white">
                  {GLOSSARY_ITEMS[selectedGlossary].term}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-mono font-bold">
                  Plain-English Breakdown
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">What it means:</span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {GLOSSARY_ITEMS[selectedGlossary].layman}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex flex-col gap-1.5">
                <span className="text-xs font-mono text-purple-300 font-bold uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Real-World Analogy:</span>
                </span>
                <p className="text-xs text-purple-200 italic font-sans leading-relaxed">
                  "{GLOSSARY_ITEMS[selectedGlossary].analogy}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span>Concept {selectedGlossary + 1} of {GLOSSARY_ITEMS.length}</span>
              <button
                onClick={() => setSelectedGlossary((selectedGlossary + 1) % GLOSSARY_ITEMS.length)}
                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <span>Next Concept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
