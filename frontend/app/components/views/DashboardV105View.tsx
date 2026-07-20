'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  GitBranch, Terminal, ShieldAlert, Cpu, Download, Database, 
  FlaskConical, RefreshCw, Play, Save, Sliders, CheckCircle, 
  Activity, Layers
} from 'lucide-react';

// Targets and their structural details for simulation/3Dmol fallback
interface ProteinTarget {
  id: string;
  name: string;
  pdbId: string;
  defaultDrug: string;
  sequence: string;
  residues: { name: string; pos: number; weight: number; role: string }[];
}

const TARGETS: Record<string, ProteinTarget> = {
  EGFR: {
    id: 'EGFR',
    name: 'Epidermal Growth Factor Receptor',
    pdbId: '1M17',
    defaultDrug: 'Gefitinib',
    sequence: 'MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRMFNNCEVVLGNLEITYVQRNYDLSFLKTIQEVAGYVLIALNTVERIPENLQIIRGNMYYENSYALAVLSNYDANKTGLKELPMRNLQEILHGAVRFSNNPALCNVESIQWRDIVSSDFLSMSMDFQNHLGSCQKCDPSCPNGSCWGAGEENCQKLTKIICAQQCSGRCRGKSPSDCCHNQCAAGCTGPRESDCLVCRKFRDEATCKDTCPPLMLYNPTTYQMDVNPEGKYSFGATCVKKCPRNYVVTDHGSCVRACGADSYEMEEDGVRKCKKCEGPCRKVCNGIGIGEFKDSLSINATNIKHFKNCTSISGDLHILPVAFRGDSFTHTPPLDPQELDILKTVKEITGFLLIQAWPENRTDLHAFENLEIIRGRTKQHGQFSLAVVSLNITSLGLRSLKEISDGDVIISGNKNLCYANTINWKKLFGTSGQKTKIISNRGENSCKATGQVCHALCSPEGCWGPEPRDCVSCRNVSRGRECVDKCNLLEGEPREFVENSECIQCHPECLPQAMNITCTGRGPDNCIQCAHYIDGPHCVKTCPAGVMGENNTLVWKYADAGHVCHLCHPNCTYGCTGPGLEGCPTNGPKIPSIATGMVGALLLLLVVALGIGLFMRRRHIVRKRTLRRLLQERELVEPLTPSGEAPNQALLRILKETEFKKIKVLGSGAFGTVYKGLWIPEGEKVKIPVAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQGFFSSPSTSRTPLLSSLSATSNNSTVACIDRNGLQSCPIKEDSFLQRYSSDPTGALTEDSIDDTFLPVPEYINQSVPKRPAGSVQNPVYHNQPLNPAPSRDPHYQDPHSTAVGNPEYLNTVQPTCVNSTFDSPAHWAQKGSHQISLDNPDYQQDFFPKEAKPNGIFKGSTAENAEYLRVAPQSSEFIGA',
    residues: [
      { name: 'Thr790', pos: 790, weight: 0.942, role: 'Gatekeeper Resistance Residue' },
      { name: 'Leu718', pos: 718, weight: 0.885, role: 'Hydrophobic Pocket Attributor' },
      { name: 'Met793', pos: 793, weight: 0.812, role: 'H-Bond Hinge Linker' },
      { name: 'Cys797', pos: 797, weight: 0.765, role: 'Covalent Warhead Target' },
      { name: 'Phe723', pos: 723, weight: 0.698, role: 'Phosphate-Binding Loop Anchor' }
    ]
  },
  BRAF: {
    id: 'BRAF',
    name: 'B-Raf Proto-Oncogene Kinase',
    pdbId: '1UWH',
    defaultDrug: 'Vemurafenib',
    sequence: 'MAALSGGGGGGAEPGQALFNGDMEPEAGAGAGAAASSAADPAIPEEVWNIKQMIKLTQEHIEALLDKFGGEHNPPSIYLDAYEEYTSKLDALQQREQQLLESLGNGTDFSVSSSASMDTVTSSSSSSLSVLPSSLSVFQNPTDVARSNPKSPQKPIVRVFLPNKQRTVVPARCGVTVRDSLKKALMMRGLIPECCAVYRIQDGEKKPIGWDTDISWLTGEELHVEVLENVPLTTHNFVRKTFFTLAFCDFCRKLLFQGFRCQTCGYKFHQRCSTEVPLMCVNYDQLDLLFVSKFFEHHPIPQEEASLAETALTSGSSPSAPASDSIGPQILTSPSPSKSIPIPQPFRPADEDHRNQFGQRDRSSSAPNVHINTIEPVNIDDLIRDQGFRGDGGSTTGLSATPPASLPGSLTNVKALQKSPGPQRERKSSSSSEDRNRMKTLGRRDSSDDWEIPDGQITVGQRIGSGSFGTVYKGKWHGDVAVKMLNVTAPTPQQLQAFKNEVGVLRKTRHVNILLFMGYSTKPQLAIVTQWCEGSSLYHHLHIIETKFEMIKLIDIARQTAQGMDYLHAKSIIHRDLKSNNIFLHEDLTVKIGDFGLATVKSRWSGSHQFEQLSGSILWMAPEVIRMQDKNPYSFQSDVYAFGIVLYELMTGQLPYSNINNRDQIIFMVGRGYLSPDLSKVRSNCPKAMKRLMAECLKKKRDERPLFPQILASIELLARSLPKIHRSASEPSLNAGFQTEDFSLYACASPKTPIQAGGYGAFPVH',
    residues: [
      { name: 'Asp594', pos: 594, weight: 0.963, role: 'DFG Motif Activation Loop Coordinator' },
      { name: 'Glu501', pos: 501, weight: 0.911, role: 'Catalytic Salt-Bridge Hinge' },
      { name: 'Phe595', pos: 595, weight: 0.844, role: 'DFG-In Conformer Stabilization' },
      { name: 'Cys532', pos: 532, weight: 0.789, role: 'Adenine-Pocket Hinge Partner' },
      { name: 'Trp531', pos: 531, weight: 0.722, role: 'Gatekeeper Hydrophobic Pocket' }
    ]
  },
  AChE: {
    id: 'AChE',
    name: 'Acetylcholinesterase',
    pdbId: '4EY7',
    defaultDrug: 'Donepezil',
    sequence: 'MRPPQCLLHTPSLASPLLLLLLWLLGGGVGAEGREDAELLVTVRGGRLRGIRLKTPGGPVSAFLGIPFAEPPMGPRRFLPPEPKQPWSGVVDATTFQSVCYQYVDTLYPGFEGTEMWNPNRELSEDCLYLNVWTPYPRPTSPTPVLVWIYGGGFYSGASSLDVYDGRFLVQAERTVLVSMNYRVGAFGFLALPGSREAPGNVGLLDQRLALQWVQENVAAFGGDPTSVTLFGESAGAASVGMHLLSPPSRGLFHRAVLQSGAPNGPWATVGMGEARRRATQLAHLVGCPPGGTGGNDTELVACLRTRPAQVLVNHEWHVLPQESVFRFSFVPVVDGDFLSDTPEALINAGDFHGLQVLVGVVKDEGSYFLVYGAPGFSKDNESLISRAEFLAGVRVGVPQVSDLAAEAVVLHYTDWLHPEDPARLREALSDVVGDHNVVCPVAQLAGRLAAQGARVYAYVFEHRASTLSWPLWMGVPHGYEIEFIFGIPLDPSRNYTAEEKIFAQRLMRYWANFARTGDPNEPRDPKAPQWPPYTAGAQQYVSLDLRPLEVRRGLRAQACAFWNRFLPKLLSATDTLDEAERQWKAEFHRWSSYMVHWKNQFDHYSKQDRCSDL',
    residues: [
      { name: 'Trp86', pos: 86, weight: 0.978, role: 'Choline Binding Anionic Subsite' },
      { name: 'Tyr337', pos: 337, weight: 0.925, role: 'Gorge Bottle-Neck Bottleneck Control' },
      { name: 'Ser203', pos: 203, weight: 0.892, role: 'Catalytic Triad Nucleophile' },
      { name: 'Trp286', pos: 286, weight: 0.854, role: 'Peripheral Anionic Site (PAS) Hub' },
      { name: 'Phe338', pos: 338, weight: 0.741, role: 'Acyl Binding Pocket Restricter' }
    ]
  },
  HIV_TAR: {
    id: 'HIV_TAR',
    name: 'HIV-1 TAR RNA Loop',
    pdbId: '1ANR',
    defaultDrug: 'Amprenavir',
    sequence: 'GGUCUCUCUGGUUAGACCAGAUCUGAGCCUGGGAGCUCUCUGGCUAACCCAGAGAACCC',
    residues: [
      { name: 'U23', pos: 23, weight: 0.956, role: 'Bulge Nucleotide for Small Molecule Binding' },
      { name: 'G26', pos: 26, weight: 0.899, role: 'Triplex Helix Junction Nucleobase' },
      { name: 'A22', pos: 22, weight: 0.834, role: 'Arginine-Rich Peptide Recognition Site' },
      { name: 'U40', pos: 40, weight: 0.798, role: 'Major Groove Compaction Anchor' },
      { name: 'C24', pos: 24, weight: 0.688, role: 'Bulge Flanking Stabilization Base' }
    ]
  }
};

// Initial nodes
interface VersionNode {
  id: string;
  label: string;
  parent: string | null;
  smiles: string;
  modification: string;
  desirability: number;
  saScore: number;
  qed: number;
  logp: number;
  violations: number;
  timestamp: string;
  commitHash: string;
}

const INITIAL_NODES: VersionNode[] = [
  {
    id: 'v0-base',
    label: 'Parent Donepezil',
    parent: null,
    smiles: 'COc1cc2c(cc1OC)CC(CC2)CC(=O)Cc1ccccc1',
    modification: 'None (Base Compound)',
    desirability: 0.2005,
    saScore: 2.15,
    qed: 0.84,
    logp: 3.82,
    violations: 0,
    timestamp: '10:14:23 AM',
    commitHash: 'aether-9f82d1c'
  }
];

export default function DashboardV105View() {
  const [activeTarget, setActiveTarget] = useState<string>('AChE');
  const [smiles, setSmiles] = useState<string>('COc1cc2c(cc1OC)CC(CC2)CC(=O)Cc1ccccc1');
  const [transformation, setTransformation] = useState<string>('Fluorination');
  const [refinementRounds, setRefinementRounds] = useState<number>(3);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [optProgress, setOptProgress] = useState<number>(0);
  const [optStep, setOptStep] = useState<string>('');

  const [highlightedResidues, setHighlightedResidues] = useState<Record<string, boolean>>({
    Trp86: true,
    Tyr337: true
  });
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [lodLevel, setLodLevel] = useState<'high' | 'medium' | 'low'>('medium');

  const [mpoWeights, setMpoWeights] = useState({
    bbb: 0.70,
    qed: 0.85,
    lipinski: 0.50,
    physics: 0.60,
    clash: 0.80
  });

  const [wellPlate, setWellPlate] = useState<Record<string, { type: 'empty' | 'positive' | 'negative' | 'bald' | 'entropy' | 'coerset', smiles: string, score: number }>>(() => {
    const initial: Record<string, any> = {};
    initial['A01'] = { type: 'positive', smiles: 'CONTROL_BUFFER', score: 0.999 };
    initial['H12'] = { type: 'negative', smiles: 'DMSO_BLANK', score: 0.002 };
    initial['A02'] = { type: 'bald', smiles: 'NS(=O)(=O)c1cc2c(cc1Cl)NC=NS2(=O)=O', score: 0.842 };
    initial['A03'] = { type: 'bald', smiles: 'Nc1ccc(-c2nc3ccc(O)cc3s2)cc1I', score: 0.793 };
    initial['A04'] = { type: 'bald', smiles: 'CC(C)(C)NCC(O)COc1cccc2c1CCC(=O)N2', score: 0.712 };
    initial['A05'] = { type: 'bald', smiles: 'OC(CCN1CCCC1)(c1ccccc1)C1CCCCC1', score: 0.654 };
    initial['A06'] = { type: 'entropy', smiles: 'COc1ccc([C@@H]2Sc3ccccc3N(CCN(C)C)C(=O)[C@@H]2OC(C)=O)cc1', score: 0.912 };
    initial['A07'] = { type: 'entropy', smiles: 'COc1cc([C@@H]2c3cc4c(cc3[C@@H](O[C@@H]3O[C@@H]5CO[C@@H](C)O[C@H]5[C@H](O)[C@H]3O)C3COC(=O)[C@@H]32)OCO4)cc(OC)c1O', score: 0.887 };
    initial['A08'] = { type: 'coerset', smiles: 'CC/C(=C(/CC)c1ccc(O)cc1)c1ccc(O)cc1', score: 0.724 };
    return initial;
  });

  const [selectedWell, setSelectedWell] = useState<string | null>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] AETHER-RAMI V10.5 OMEGA cluster daemon initialized.',
    '[SYSTEM] Node check: 2x NVIDIA Tesla T4 GPUs online. VRAM allocated: 4.8GB / 32GB',
    '[SYSTEM] Dataset scan complete. Found 1,966 BBBP samples, 1,513 BACE records.',
    '[SYSTEM] EGNN-CrossAttn pretraining active... InfoNCE Loss: 0.1420'
  ]);
  const [consolePlaying, setConsolePlaying] = useState<boolean>(true);
  const [logIndex, setLogIndex] = useState<number>(0);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<VersionNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('v0-base');

  const [auditLogs, setAuditLogs] = useState<{ action: string; time: string; operator: string }[]>([
    { action: 'Dashboard loaded in light clinical theme.', time: '08:58:05', operator: 'LIMS_DAEMON' },
    { action: 'Target protein switched to Acetylcholinesterase (AChE 4EY7).', time: '08:58:12', operator: 'SYS_CHEMIST' }
  ]);

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  const handleTargetChange = (targetId: string) => {
    setActiveTarget(targetId);
    const target = TARGETS[targetId];
    let defaultSmiles = '';
    if (targetId === 'EGFR') defaultSmiles = 'COc1cc2ncnc(Nc3ccc(F)c(Cl)c3)c2cc1OCCCN1CCOCC1';
    else if (targetId === 'BRAF') defaultSmiles = 'CC(C)S(=O)(=O)Nc1ccc(F)c(C(=O)c2c[nH]c3ncc(F)cc23)c1F';
    else if (targetId === 'AChE') defaultSmiles = 'COc1cc2c(cc1OC)CC(CC2)CC(=O)Cc1ccccc1';
    else if (targetId === 'HIV_TAR') defaultSmiles = 'CC(C)CN(C[C@@H](O)[C@@H](Cc1ccccc1)NC(=O)O[C@@H]2CO[@H]3O[C@@H]23)S(=O)(=O)c4ccc(N)cc4';

    setSmiles(defaultSmiles);

    const rootNode: VersionNode = {
      id: `${targetId}-root`,
      label: `Parent ${target.defaultDrug}`,
      parent: null,
      smiles: defaultSmiles,
      modification: 'None (Base Target Compound)',
      desirability: targetId === 'EGFR' ? 0.2075 : targetId === 'BRAF' ? 0.3120 : targetId === 'AChE' ? 0.2005 : 0.2450,
      saScore: 2.45,
      qed: 0.62,
      logp: 3.12,
      violations: 0,
      timestamp: new Date().toLocaleTimeString(),
      commitHash: `aether-${Math.random().toString(16).substring(2, 9)}`
    };
    setNodes([rootNode]);
    setSelectedNodeId(rootNode.id);

    const nextRes: Record<string, boolean> = {};
    target.residues.forEach(r => {
      nextRes[r.name] = true;
    });
    setHighlightedResidues(nextRes);

    setAuditLogs(prev => [
      { action: `Switched target to ${target.name} (${target.pdbId}). Mapped core residues.`, time: new Date().toTimeString().split(' ')[0], operator: 'SYS_CHEMIST' },
      ...prev
    ]);
  };

  const runDeNovoOptimization = () => {
    if (optimizing) return;
    setOptimizing(true);
    setOptProgress(0);
    setOptStep('Initializing neural mutator...');

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setOptProgress(currentStep * 20);

      if (currentStep === 1) {
        setOptStep('Constructing bioisostere fragmentation...');
      } else if (currentStep === 2) {
        setOptStep(`Applying transformation: ${transformation}...`);
      } else if (currentStep === 3) {
        setOptStep('Inference via E(n)-Equivariant GNN...');
      } else if (currentStep === 4) {
        setOptStep('Recalculating multi-parameter ADMET trade-offs...');
      } else if (currentStep === 5) {
        clearInterval(interval);
        setOptimizing(false);
        setOptStep('Refinement completed!');

        let modifiedSmiles = smiles;
        if (transformation === 'Fluorination') modifiedSmiles += '(F)';
        else if (transformation === 'Chlorine-to-Fluorine swap') modifiedSmiles = smiles.replace('Cl', 'F');
        else if (transformation === 'Hydroxylation') modifiedSmiles += '(OH)';

        const parentNode = selectedNode;
        const newDesirability = Math.min(0.985, +(parentNode.desirability + 0.523 * (refinementRounds / 5)).toFixed(4));
        const newSaScore = +(parentNode.saScore + 0.45).toFixed(2);
        const newQed = Math.min(0.92, +(parentNode.qed + 0.08).toFixed(2));
        const newLogp = +(parentNode.logp - 0.35).toFixed(2);

        const newId = `v${nodes.length}`;
        const newNode: VersionNode = {
          id: newId,
          label: `Round ${nodes.length} - ${transformation}`,
          parent: parentNode.id,
          smiles: modifiedSmiles,
          modification: `${transformation} (rounds: ${refinementRounds})`,
          desirability: newDesirability,
          saScore: newSaScore,
          qed: newQed,
          logp: newLogp,
          violations: parentNode.violations,
          timestamp: new Date().toLocaleTimeString(),
          commitHash: `aether-${Math.random().toString(16).substring(2, 9)}`
        };

        setNodes(prev => [...prev, newNode]);
        setSelectedNodeId(newId);

        setAuditLogs(prev => [
          { action: `Created de novo analog ${newId} with desirability ${newDesirability}.`, time: new Date().toTimeString().split(' ')[0], operator: 'SYS_CHEMIST' },
          ...prev
        ]);
      }
    }, 800);
  };

  useEffect(() => {
    if (!consolePlaying) return;
    const interval = setInterval(() => {
      const logs = [
        `[TRAIN] Epoch ${100 + logIndex}: train_loss = 0.0583, cross_attention_max = 0.982`,
        `[GNN] Computed attributions for ${activeTarget} pocket residues`,
        `[LIMS] Plating task verification: scaffold diversity = ${calcPlatedDiversity()}`,
        `[GPU] Core Temperature: 68°C. Power: 145W per T4 unit.`,
        `[MODEL] Evaluated BindingDTA metrics: Kd R² = 0.823`
      ];
      setTerminalLogs(prev => [...prev, logs[logIndex % logs.length]]);
      setLogIndex(prev => prev + 1);

      if (terminalBottomRef.current) {
        terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [consolePlaying, logIndex, activeTarget]);

  const calcPlatedDiversity = () => {
    const activeWells = Object.values(wellPlate).filter(w => w.type !== 'empty');
    if (activeWells.length <= 1) return '0.000';
    const base = 0.85;
    const variety = activeWells.map(w => w.type).filter((v, i, a) => a.indexOf(v) === i).length;
    return Math.min(0.985, base + variety * 0.025 + activeWells.length * 0.002).toFixed(3);
  };

  const toggleResidueHighlight = (resName: string) => {
    setHighlightedResidues(prev => ({
      ...prev,
      [resName]: !prev[resName]
    }));
  };

  const render3DProteinScene = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameId = useRef<number>(0);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let rotation = 0;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const target = TARGETS[activeTarget];

        ctx.font = '10px monospace';
        ctx.fillStyle = '#0D9488';
        ctx.fillText(`TARGET: ${activeTarget} | PDB: ${target.pdbId}`, 15, 25);
        ctx.fillText(`LOD: ${lodLevel.toUpperCase()} | GL_CONTEXT_POOL_ACTIVE`, 15, 40);

        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(30, 58, 138, 0.15)';
        
        const pointCount = lodLevel === 'high' ? 80 : lodLevel === 'medium' ? 50 : 30;

        ctx.beginPath();
        for (let i = 0; i < pointCount; i++) {
          const t = (i / pointCount) * Math.PI * 8;
          const r = 60 + Math.sin(t * 1.5) * 15;
          const x = cx + Math.cos(t + rotation) * r;
          const y = cy + Math.sin(t * 0.8) * 40 + Math.cos(t + rotation) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#0D9488';
        ctx.lineWidth = 6;
        ctx.beginPath();
        for (let i = 0; i < pointCount / 2; i++) {
          const t = (i / (pointCount / 2)) * Math.PI * 4;
          const r = 40 + Math.cos(t) * 10;
          const x = cx - 50 + Math.cos(t - rotation * 0.5) * r;
          const y = cy + 20 + Math.sin(t * 1.2) * 30;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        target.residues.forEach((res, index) => {
          const angle = (index / target.residues.length) * Math.PI * 2 + rotation;
          const rx = cx + Math.cos(angle) * 70;
          const ry = cy + Math.sin(angle) * 60;
          const isHighlighted = highlightedResidues[res.name];

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(rx, ry);
          ctx.strokeStyle = isHighlighted ? 'rgba(13, 148, 136, 0.4)' : 'rgba(31, 41, 55, 0.05)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(rx, ry, isHighlighted ? 7 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted ? '#0D9488' : '#9CA3AF';
          ctx.fill();

          if (isHighlighted) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0D9488';
            ctx.fillStyle = '#0D9488';
            ctx.beginPath();
            ctx.arc(rx, ry, 9, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(13, 148, 136, 0.3)';
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            ctx.font = 'bold 9px system-ui';
            ctx.fillStyle = '#1F2937';
            ctx.fillText(`${res.name} (${res.weight})`, rx + 10, ry + 3);
          }
        });

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#EAB308';
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + rotation * 2;
          const lx = cx + Math.cos(angle) * 20;
          const ly = cy + Math.sin(angle) * 15;
          if (i === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        rotation += 0.005 * rotationSpeed;
        frameId.current = requestAnimationFrame(draw);
      };

      draw();

      return () => cancelAnimationFrame(frameId.current);
    }, [activeTarget, highlightedResidues, rotationSpeed, lodLevel]);

    return <canvas ref={canvasRef} width={450} height={280} className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl" />;
  };

  const downloadPlateCSV = () => {
    let csvContent = 'Well,Row,Column,Type,SMILES,Score\r\n';
    const sortedWells = Object.keys(wellPlate).sort();
    sortedWells.forEach(well => {
      const data = wellPlate[well];
      csvContent += `${well},${well[0]},${well.substring(1)},${data.type.toUpperCase()},${data.smiles},${data.score}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AETHER_PLATE_${activeTarget}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAuditLogs(prev => [
      { action: `Exported 96-well configuration Hamilton/Tecan CSV.`, time: new Date().toTimeString().split(' ')[0], operator: 'SYS_CHEMIST' },
      ...prev
    ]);
  };

  const exportELNData = () => {
    const elnPayload = {
      experiment_meta: {
        platform: 'AETHER-RAMI V10.5 OMEGA',
        timestamp: new Date().toISOString(),
        operator: 'SYS_CHEMIST'
      },
      current_target: TARGETS[activeTarget],
      current_lead: selectedNode,
      lineage_tree: nodes,
      mpo_weights: mpoWeights,
      plate_metrics: {
        scaffold_diversity: calcPlatedDiversity(),
        plated_count: Object.keys(wellPlate).length
      }
    };

    const blob = new Blob([JSON.stringify(elnPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AETHER_ELN_RECORD_${activeTarget}.json`);
    link.click();
  };

  const calculatedMPO = useMemo(() => {
    const nVal = selectedNode;
    const bbbVal = nVal.logp > 2 && nVal.logp < 4 ? 0.95 : 0.40;
    const qedVal = nVal.qed;
    const lipinskiVal = nVal.violations === 0 ? 1.0 : 0.5;
    const physicsVal = 0.72;
    const clashVal = 0.95;

    const weightedSum = (
      bbbVal * mpoWeights.bbb +
      qedVal * mpoWeights.qed +
      lipinskiVal * mpoWeights.lipinski +
      physicsVal * mpoWeights.physics +
      clashVal * mpoWeights.clash
    );
    const weightSum = mpoWeights.bbb + mpoWeights.qed + mpoWeights.lipinski + mpoWeights.physics + mpoWeights.clash;
    return +(weightedSum / weightSum).toFixed(4);
  }, [selectedNode, mpoWeights]);

  const handleWellClick = (well: string) => {
    setSelectedWell(well);
  };

  const assignWellType = (type: 'empty' | 'positive' | 'negative' | 'bald' | 'entropy' | 'coerset') => {
    if (!selectedWell) return;
    
    setWellPlate(prev => {
      const copy = { ...prev };
      if (type === 'empty') {
        delete copy[selectedWell];
      } else {
        copy[selectedWell] = {
          type,
          smiles: type === 'positive' ? 'CONTROL_BUFFER' : type === 'negative' ? 'DMSO_BLANK' : selectedNode.smiles,
          score: type === 'positive' ? 0.999 : type === 'negative' ? 0.002 : +(0.5 + Math.random() * 0.4).toFixed(3)
        };
      }
      return copy;
    });

    setAuditLogs(prev => [
      { action: `Assigned Well ${selectedWell} as ${type.toUpperCase()}.`, time: new Date().toTimeString().split(' ')[0], operator: 'SYS_CHEMIST' },
      ...prev
    ]);
  };

  const downloadPublicationHTML = () => {
    const reportHTML = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            h1 { color: #0d9488; border-bottom: 2px solid #e2e8f0; pb: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>AETHER-RAMI V10.5 OMEGA De Novo Design Report</h1>
          <p><strong>Target:</strong> ${TARGETS[activeTarget].name} (${activeTarget})</p>
          <p><strong>Parent Compound:</strong> ${TARGETS[activeTarget].defaultDrug}</p>
          <p><strong>Optimized Lead Compound:</strong> ${selectedNode.smiles}</p>
          <p><strong>Lineage Hash:</strong> ${selectedNode.commitHash}</p>
          <p><strong>Synthetic Accessibility Score:</strong> ${selectedNode.saScore}</p>
          <p><strong>QED Drug Beauty:</strong> ${selectedNode.qed}</p>
          <p><strong>Desirability:</strong> ${calculatedMPO}</p>
        </body>
      </html>
    `;
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AETHER_REPORT_${activeTarget}.html`;
    link.click();
  };

  const radarChartPoints = useMemo(() => {
    const center = 100;
    const radius = 70;
    
    const nVal = selectedNode;
    const bbbVal = nVal.logp > 2 && nVal.logp < 4 ? 0.95 : 0.40;
    const qedVal = nVal.qed;
    const lipinskiVal = nVal.violations === 0 ? 1.0 : 0.5;
    const physicsVal = 0.72;
    const desirabilityVal = calculatedMPO;

    const values = [bbbVal, qedVal, lipinskiVal, physicsVal, desirabilityVal];
    
    return values.map((val, idx) => {
      const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
      const r = val * radius;
      return {
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r,
        labelX: center + Math.cos(angle) * (radius + 20),
        labelY: center + Math.sin(angle) * (radius + 15)
      };
    });
  }, [selectedNode, calculatedMPO]);

  return (
    <div className="bg-white text-slate-800 p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden font-sans max-w-[1680px] mx-auto relative z-20">
      
      {/* Platform Title Bar */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">CSIR Enterprise dry-lab infrastructure</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            AETHER-RAMI <span className="text-teal-600 font-extrabold">V10.5 OMEGA</span> Workbench
          </h1>
        </div>

        {/* Global Cluster Drawer Status */}
        <div className="flex flex-wrap gap-4 items-center bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="text-teal-600" size={16} />
            <div>
              <div className="font-semibold text-slate-700">2x Tesla T4 GPUs</div>
              <div className="text-[10px] text-slate-500 font-mono">Volatile VRAM: 4.8GB / 32GB</div>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              Active Job #8472 
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-teal-100 text-teal-800 font-bold">EGNN-INF</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">ETC: 14.2s (45% Complete)</div>
          </div>
        </div>
      </header>

      {/* Main 3-Column Grid + Split screen right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Workbench (Columns 1-3) */}
        <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Molecular Sandbox & Git Lineage */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FlaskConical className="text-teal-600" size={14} /> Molecular Sandbox
                </h3>
                <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">2D Structure</span>
              </div>

              {/* 2D Canvas Placeholder showing SMILES and SVG shape */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] relative">
                <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-400">SMILES CANVAS</span>
                
                {/* SVG Chemistry representation updating based on selection */}
                <svg className="w-32 h-24 text-slate-700" viewBox="0 0 100 80">
                  <path d="M20,40 L40,30 L60,40 L80,30" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  {transformation === 'Fluorination' && (
                    <g>
                      <path d="M80,30 L90,15" fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="2,2" />
                      <text x="88" y="12" fill="#0D9488" fontSize="8" fontWeight="bold">F</text>
                    </g>
                  )}
                  {transformation === 'Hydroxylation' && (
                    <g>
                      <path d="M80,30 L90,15" fill="none" stroke="#0D9488" strokeWidth="2" />
                      <text x="86" y="12" fill="#0D9488" fontSize="8" fontWeight="bold">OH</text>
                    </g>
                  )}
                  <circle cx="20" cy="40" r="3" fill="#1E3A8A" />
                  <circle cx="40" cy="30" r="3" fill="#1F2937" />
                  <circle cx="60" cy="40" r="3" fill="#1F2937" />
                  <circle cx="80" cy="30" r="3" fill="#1F2937" />
                  <text x="15" y="52" fill="#1E3A8A" fontSize="7" fontWeight="bold">N</text>
                  <text x="56" y="52" fill="#1F2937" fontSize="7" fontWeight="bold">O</text>
                </svg>

                <div className="w-full text-center mt-3">
                  <div className="text-[10px] font-mono text-slate-600 truncate px-2" title={smiles}>
                    {smiles}
                  </div>
                </div>
              </div>

              {/* Mutator Actions */}
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Parent Chemical Lead</label>
                  <select 
                    value={activeTarget} 
                    onChange={e => handleTargetChange(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  >
                    <option value="EGFR">Gefitinib (EGFR Target)</option>
                    <option value="BRAF">Vemurafenib (BRAF Target)</option>
                    <option value="AChE">Donepezil (AChE Target)</option>
                    <option value="HIV_TAR">Amprenavir (HIV TAR RNA)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">SMARTS Transformation</label>
                  <select 
                    value={transformation} 
                    onChange={e => setTransformation(e.target.value)}
                    className="w-full mt-1 bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                  >
                    <option value="Fluorination">Fluorination (Block oxidation)</option>
                    <option value="Chlorine-to-Fluorine swap">Cl-to-F Bioisostere exchange</option>
                    <option value="Hydroxylation">Hydroxylation (Solubility boost)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Refinement Rounds</span>
                    <span className="text-teal-600">{refinementRounds} Rds</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={refinementRounds} 
                    onChange={e => setRefinementRounds(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <button 
                onClick={runDeNovoOptimization}
                disabled={optimizing}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {optimizing ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    <span>{optStep} ({optProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run De Novo Refinement</span>
                  </>
                )}
              </button>
            </div>

            {/* Git-Style Molecular Versioning Tree */}
            <div className="mt-4 bg-slate-50 border border-slate-150 rounded-xl p-3">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 mb-2">
                <GitBranch size={13} className="text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Data Lineage & Commits</span>
              </div>
              <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                {nodes.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`flex items-start gap-2 p-2 rounded-lg text-left transition-all ${
                      selectedNodeId === node.id 
                        ? 'bg-indigo-50 border border-indigo-200 shadow-sm' 
                        : 'hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-indigo-700 font-bold">{node.commitHash}</span>
                        <span className="text-[8px] text-slate-400">{node.timestamp}</span>
                      </div>
                      <h4 className="text-[10px] font-semibold text-slate-800 truncate">{node.label}</h4>
                      <p className="text-[8px] text-slate-500 truncate">{node.modification}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: 3D Target Structural Canvas */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Activity className="text-teal-600" size={14} /> Structural Pocket (3D)
                </h3>
                <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">WebGL</span>
              </div>

              {/* 3D Container rendering Canvas */}
              <div className="relative aspect-video w-full border border-slate-200 rounded-xl overflow-hidden mb-4">
                {render3DProteinScene()}
                
                {/* 3D controls */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button 
                    onClick={() => setRotationSpeed(prev => prev === 0 ? 1 : 0)} 
                    className="p-1 rounded bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 text-[9px] font-semibold"
                  >
                    {rotationSpeed === 0 ? 'Rotate' : 'Freeze'}
                  </button>
                  <button 
                    onClick={() => setLodLevel(prev => prev === 'high' ? 'low' : prev === 'medium' ? 'high' : 'medium')} 
                    className="p-1 rounded bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 text-[9px] font-semibold"
                  >
                    LOD: {lodLevel.toUpperCase()}
                  </button>
                </div>
              </div>

              {/* Residue Hotspot Table with switches */}
              <div className="flex flex-col gap-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Dynamic Neural Attributions (10Å Pocket)</div>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-[10px] text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-2">Residue</th>
                        <th className="p-2 text-right">Attention</th>
                        <th className="p-2 text-center">GL Overlay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TARGETS[activeTarget].residues.map(res => (
                        <tr key={res.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-2 font-semibold text-slate-800">
                            {res.name}
                            <span className="block text-[8px] text-slate-400 font-normal">{res.role}</span>
                          </td>
                          <td className="p-2 text-right font-mono text-teal-600 font-bold">{res.weight}</td>
                          <td className="p-2 text-center">
                            <input 
                              type="checkbox" 
                              checked={!!highlightedResidues[res.name]}
                              onChange={() => toggleResidueHighlight(res.name)}
                              className="w-3.5 h-3.5 accent-teal-600 rounded cursor-pointer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MPO Weight Adjustment Matrix */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sliders size={13} className="text-slate-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">MPO Weights Calibration</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {Object.keys(mpoWeights).map((key) => {
                  const val = mpoWeights[key as keyof typeof mpoWeights];
                  return (
                    <div key={key} className="flex flex-col gap-0.5">
                      <div className="flex justify-between text-slate-600">
                        <span className="uppercase font-semibold">{key}</span>
                        <span>{val.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={val} 
                        onChange={e => setMpoWeights(p => ({ ...p, [key]: Number(e.target.value) }))}
                        className="w-full accent-slate-600 cursor-pointer h-1"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 3: HTS 96-Well Grid & GPU Terminal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Database className="text-teal-600" size={14} /> Active Well Plate Config
                </h3>
                <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">A01-H12</span>
              </div>

              {/* 96-well grid layout (8 rows x 12 columns) */}
              <div className="flex flex-col items-center mb-3">
                <div className="text-[9px] font-mono text-slate-400 mb-1">HTS Screen Selector</div>
                <div className="grid grid-cols-12 gap-0.5 border border-slate-200 p-1 bg-slate-50 rounded-xl w-full">
                  {Array.from({ length: 8 }).map((_, rIdx) => {
                    const rowLetter = String.fromCharCode(65 + rIdx);
                    return Array.from({ length: 12 }).map((_, cIdx) => {
                      const colNum = String(cIdx + 1).padStart(2, '0');
                      const wellId = `${rowLetter}${colNum}`;
                      const val = wellPlate[wellId];

                      let style = 'bg-transparent border-slate-200 text-slate-400';
                      if (val?.type === 'positive') style = 'bg-rose-500 border-rose-600 text-white';
                      else if (val?.type === 'negative') style = 'bg-blue-500 border-blue-600 text-white';
                      else if (val?.type === 'bald') style = 'bg-teal-500 border-teal-600 text-white';
                      else if (val?.type === 'entropy') style = 'bg-emerald-500 border-emerald-600 text-white';
                      else if (val?.type === 'coerset') style = 'bg-indigo-500 border-indigo-600 text-white';

                      return (
                        <button
                          key={wellId}
                          onClick={() => handleWellClick(wellId)}
                          className={`aspect-square w-full rounded-full border text-[7px] font-bold flex items-center justify-center transition-all ${style} ${
                            selectedWell === wellId ? 'ring-2 ring-teal-600 ring-offset-1' : ''
                          }`}
                          title={`${wellId}: ${val ? val.type.toUpperCase() : 'EMPTY'}`}
                        >
                          {cIdx === 0 && rIdx % 2 === 0 ? rowLetter : ''}
                        </button>
                      );
                    });
                  })}
                </div>
              </div>

              {/* Well assignment controller */}
              {selectedWell && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1.5">
                    <span>Assign Well: {selectedWell}</span>
                    <button onClick={() => setSelectedWell(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => assignWellType('positive')} className="px-1.5 py-1 rounded bg-rose-500 text-white text-[8px] font-bold uppercase">POS</button>
                    <button onClick={() => assignWellType('negative')} className="px-1.5 py-1 rounded bg-blue-500 text-white text-[8px] font-bold uppercase">NEG</button>
                    <button onClick={() => assignWellType('bald')} className="px-1.5 py-1 rounded bg-teal-500 text-white text-[8px] font-bold uppercase">BALD</button>
                    <button onClick={() => assignWellType('entropy')} className="px-1.5 py-1 rounded bg-emerald-500 text-white text-[8px] font-bold uppercase">ENT</button>
                    <button onClick={() => assignWellType('coerset')} className="px-1.5 py-1 rounded bg-indigo-500 text-white text-[8px] font-bold uppercase">CORE</button>
                    <button onClick={() => assignWellType('empty')} className="px-1.5 py-1 rounded bg-slate-300 text-slate-700 text-[8px] font-bold uppercase">Clear</button>
                  </div>
                </div>
              )}

              {/* Statistics & PAINS warnings */}
              <div className="flex flex-col gap-2 mb-4 text-[10px]">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-medium">Plated Scaffold Diversity:</span>
                  <span className="font-mono font-bold text-slate-800">{calcPlatedDiversity()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-medium">Hamilton Target Machine:</span>
                  <span className="font-bold text-slate-700">Hamilton_Microlab_STAR_V3</span>
                </div>
                
                {selectedNode.saScore > 3.0 && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-2.5 flex items-start gap-2">
                    <ShieldAlert size={14} className="mt-0.5 text-rose-600 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-[9px] uppercase">PAINS Structural Alert hit</div>
                      <p className="text-[8px] text-rose-700 leading-normal">Analog flagged for toxicity or structural alerts: CYP aniline liability detected.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Live Terminal Panel */}
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-[9px] text-emerald-400 mb-3 relative">
                <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 mb-1.5 text-slate-500">
                  <span className="flex items-center gap-1.5"><Terminal size={10} /> Live WebSocket Stream</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setConsolePlaying(!consolePlaying)} className="hover:text-white">
                      {consolePlaying ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={() => setTerminalLogs([])} className="hover:text-white">Clear</button>
                  </div>
                </div>
                <div className="h-[90px] overflow-y-auto flex flex-col gap-1 select-text">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-2">
                <button 
                  onClick={downloadPlateCSV}
                  className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Download size={12} /> Export Hamilton CSV
                </button>
                <button 
                  onClick={exportELNData}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                  title="Export Benchling-compatible ELN"
                >
                  <Save size={12} /> ELN
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 4 / RIGHT PANEL: Split Screen PDF Viewer */}
        <div className="xl:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative">
          <div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle className="text-teal-600" size={14} /> Publication Report Viewer
                </h3>
                <span className="text-[8px] text-slate-400">PDFObject simulated rendering engine</span>
              </div>
              <button 
                onClick={downloadPublicationHTML}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[9px] font-black uppercase flex items-center gap-1"
              >
                <Download size={10} /> PDF
              </button>
            </div>

            {/* Scientific Publication Draft View */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-[460px] overflow-y-auto text-xs shadow-inner">
              <div className="text-center border-b border-slate-100 pb-4 mb-4">
                <h2 className="font-bold text-slate-900 text-sm leading-snug">
                  De Novo Design of Sub-nanomolar Derivatives Targeting {activeTarget} via E(n)-Equivariant Attributions
                </h2>
                <div className="text-[9px] text-slate-500 font-mono mt-1">AETHER-RAMI OMEGA Research Group — Vol 10.5</div>
              </div>

              {/* Manuscript abstract */}
              <div className="mb-4">
                <h4 className="font-bold text-slate-800 text-[10px] uppercase border-l-2 border-teal-600 pl-1.5 mb-1.5">Abstract</h4>
                <p className="text-slate-600 text-[9px] leading-relaxed text-justify">
                  Targeted therapy against {activeTarget} ({TARGETS[activeTarget].pdbId}) represents a primary therapeutic modality. Here, we present the structural optimization of {TARGETS[activeTarget].defaultDrug} using advanced 3D coordinate-flow mapping. Through iterative {refinementRounds}-round refinement utilizing the <strong>{selectedNode.commitHash}</strong> architecture, we synthesized the derivative <strong>{selectedNode.label}</strong>. The analog presents an estimated desirability of <strong>{calculatedMPO}</strong> with SA index of <strong>{selectedNode.saScore}</strong>.
                </p>
              </div>

              {/* SVG Radar Chart component */}
              <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-150 rounded-xl p-3 my-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase mb-2">MPO Desirability Radar Profile</span>
                <div className="relative w-[200px] h-[200px]">
                  <svg width="200" height="200" className="overflow-visible">
                    {[0.25, 0.5, 0.75, 1.0].map((r, i) => (
                      <polygon
                        key={i}
                        points={Array.from({ length: 5 }).map((_, idx) => {
                          const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
                          const d = r * 70;
                          return `${100 + Math.cos(angle) * d},${100 + Math.sin(angle) * d}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeWidth="1"
                      />
                    ))}
                    
                    {Array.from({ length: 5 }).map((_, idx) => {
                      const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
                      return (
                        <line
                          key={idx}
                          x1="100"
                          y1="100"
                          x2={100 + Math.cos(angle) * 70}
                          y2={100 + Math.sin(angle) * 70}
                          stroke="rgba(148, 163, 184, 0.3)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    <polygon
                      points={radarChartPoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="rgba(13, 148, 136, 0.25)"
                      stroke="#0D9488"
                      strokeWidth="2"
                    />

                    {radarChartPoints.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#0D9488"
                      />
                    ))}

                    {['BBB', 'QED', 'LIPINSKI', 'PHYSICS', 'DESIRABILITY'].map((label, idx) => {
                      const p = radarChartPoints[idx];
                      return (
                        <text
                          key={label}
                          x={p.labelX}
                          y={p.labelY}
                          fill="#475569"
                          fontSize="8"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Table of Regression Baselines */}
              <div>
                <h4 className="font-bold text-slate-800 text-[10px] uppercase border-l-2 border-teal-600 pl-1.5 mb-2">BindingDTA Baseline Registry</h4>
                <table className="w-full text-[9px] border-collapse border border-slate-100">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-1.5 border border-slate-100">Metric (DTA)</th>
                      <th className="p-1.5 border border-slate-100 text-center">Single-Split</th>
                      <th className="p-1.5 border border-slate-100 text-center">5-Fold CV</th>
                      <th className="p-1.5 border border-slate-100 text-center">Ridge+PCA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1.5 border border-slate-100 font-semibold">Kd (Affinity)</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.656</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.684</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.710</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-1.5 border border-slate-100 font-semibold">Ki (Inhibition)</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.572</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.601</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.638</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 border border-slate-100 font-semibold">IC50 (Response)</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.672</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.695</td>
                      <td className="p-1.5 border border-slate-100 text-center">0.734</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Audit trail / regulatory compliance logger */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase mb-2">
              <span>Regulatory Compliance Audit Trail</span>
              <span className="text-emerald-600 font-bold">Secure SHA-256</span>
            </div>
            <div className="bg-slate-100 rounded-xl p-2.5 text-[8px] font-mono text-slate-600 flex flex-col gap-1 max-h-[80px] overflow-y-auto">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex justify-between border-b border-slate-200/50 pb-1">
                  <span>[{log.time}] {log.action}</span>
                  <span className="text-slate-400 font-semibold">{log.operator}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ADDITIONAL ENTERPRISE FEATURES SECTION */}
      <div className="mt-8 border-t border-slate-200 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Feature A: Lead Optimization Comparison Matrix */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Layers size={14} className="text-teal-600" /> Lead Optimization Comparison Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] border-collapse bg-white border border-slate-100 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 font-bold">
                <tr>
                  <th className="p-2">Property</th>
                  <th className="p-2">Parent Compound</th>
                  <th className="p-2 text-teal-700">Optimized Analog ({selectedNode.commitHash})</th>
                  <th className="p-2 text-right">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-2 font-semibold">QED (Drug Likeness)</td>
                  <td className="p-2">0.62</td>
                  <td className="p-2 text-teal-700 font-bold">{selectedNode.qed}</td>
                  <td className="p-2 text-right font-mono text-emerald-600 font-bold">
                    +{((selectedNode.qed - 0.62) * 100).toFixed(0)}%
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-2 font-semibold">Desirability Index</td>
                  <td className="p-2">0.20</td>
                  <td className="p-2 text-teal-700 font-bold">{calculatedMPO}</td>
                  <td className="p-2 text-right font-mono text-emerald-600 font-bold">
                    +{((calculatedMPO - 0.20) * 100).toFixed(0)}%
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-2 font-semibold">Partition Coefficient (LogP)</td>
                  <td className="p-2">3.12</td>
                  <td className="p-2 text-teal-700 font-bold">{selectedNode.logp}</td>
                  <td className="p-2 text-right font-mono text-slate-500">
                    {(selectedNode.logp - 3.12).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Synthetic Accessibility (SA)</td>
                  <td className="p-2">2.45</td>
                  <td className="p-2 text-teal-700 font-bold">{selectedNode.saScore}</td>
                  <td className="p-2 text-right font-mono text-rose-600">
                    +{(selectedNode.saScore - 2.45).toFixed(2)} (more complex)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature B: Quantum Mechanical HOMO-LUMO Bandgap Console */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Cpu size={14} className="text-teal-600" /> Quantum Mechanical Band-Gap Simulation
          </h3>
          <div className="flex gap-4 items-center bg-white border border-slate-100 p-3 rounded-xl">
            {/* SVG energy levels rendering */}
            <svg width="140" height="120" className="overflow-visible flex-shrink-0 bg-slate-50 rounded-lg p-1">
              <line x1="20" y1="20" x2="120" y2="20" stroke="#FF4D6D" strokeWidth="3" />
              <text x="70" y="15" fill="#FF4D6D" fontSize="8" fontWeight="bold" textAnchor="middle">LUMO: -1.24 eV</text>

              <line x1="20" y1="90" x2="120" y2="90" stroke="#00E5FF" strokeWidth="3" />
              <text x="70" y="102" fill="#00E5FF" fontSize="8" fontWeight="bold" textAnchor="middle">HOMO: -5.84 eV</text>

              <path d="M70,25 L70,85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
              <polygon points="70,25 67,31 73,31" fill="#475569" />
              <polygon points="70,85 67,79 73,79" fill="#475569" />
              
              <text x="80" y="55" fill="#475569" fontSize="9" fontWeight="black" className="font-mono">ΔE = 4.60 eV</text>
            </svg>
            <div className="flex-1 text-[10px] flex flex-col gap-1 text-slate-600">
              <div className="font-bold text-slate-700">Electrostatic Potential Map:</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Nucleophilic Region (oxygen/nitrogen lone pairs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Electrophilic Region (optimized fluorine/chlorine swap)</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">DFT B3LYP/6-31G(d) calculated convergence.</div>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER METADATA SECTION */}
      <footer className="mt-8 border-t border-slate-200 pt-5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-3">
        <div>AETHER-RAMI V10.5 OMEGA Research Intelligence Platform. Copyright © 2026.</div>
        <div className="flex items-center gap-1.5 font-semibold text-slate-600">
          <span>Made by</span>
          <span className="text-teal-600 font-extrabold">V C Premchand Yadav</span>
          <span className="text-slate-300">|</span>
          <a href="https://github.com/Premchandyadav369" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">GitHub</a>
          <span className="text-slate-300">|</span>
          <a href="https://www.linkedin.com/in/premchand-yadav-a785691a2/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">LinkedIn</a>
        </div>
      </footer>

    </div>
  );
}
