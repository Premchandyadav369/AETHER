const API_BASE = '/backend/v1';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${err}`);
  }
  return res.json();
}

export const aetherApi = {
  predict: (smiles: string, protein_sequence: string) =>
    apiFetch('/predict', {
      method: 'POST',
      body: JSON.stringify({ smiles, protein_sequence }),
    }),

  admet: (smiles: string) =>
    apiFetch('/admet', {
      method: 'POST',
      body: JSON.stringify({ smiles }),
    }),

  affinity: (smiles: string, seq: string) =>
    apiFetch('/affinity', {
      method: 'POST',
      body: JSON.stringify({ smiles, seq }),
    }),

  explain: (smiles: string, target: string) =>
    apiFetch('/explain', {
      method: 'POST',
      body: JSON.stringify({ smiles, target }),
    }),

  interaction: (smiles: string, target: string) =>
    apiFetch('/interaction', {
      method: 'POST',
      body: JSON.stringify({ smiles, target }),
    }),

  proteinAnalysis: (pdb_id: string) =>
    apiFetch(`/protein-analysis?pdb_id=${encodeURIComponent(pdb_id)}`),

  safety: (smiles: string, target = 'EGFR') =>
    apiFetch('/safety', {
      method: 'POST',
      body: JSON.stringify({ smiles, target }),
    }),

  quantum: (smiles: string, target = 'EGFR') =>
    apiFetch('/quantum', {
      method: 'POST',
      body: JSON.stringify({ smiles, target }),
    }),

  digitalTwin: (smiles: string, route = 'oral') =>
    apiFetch('/digital-twin', {
      method: 'POST',
      body: JSON.stringify({ smiles, route }),
    }),

  discover: (target: string, disease: string) =>
    apiFetch('/agent/discover', {
      method: 'POST',
      body: JSON.stringify({ target, disease }),
    }),

  drugSearch: (smiles: string) =>
    apiFetch(`/drug-search?smiles=${encodeURIComponent(smiles)}`),

  proteinSearch: (pdb_id: string) =>
    apiFetch(`/protein-search?pdb_id=${encodeURIComponent(pdb_id)}`),

  generate: (protein_target: string, disease?: string) =>
    apiFetch('/generate', {
      method: 'POST',
      body: JSON.stringify({ protein_target, disease }),
    }),

  models: () => apiFetch('/models'),

  leaderboard: () => apiFetch('/leaderboard'),

  health: async () => {
    const res = await fetch('/backend/');
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json();
  },

  precisionMedicine: (mutations: string[], biomarkers?: string[], disease = 'NSCLC') =>
    apiFetch('/precision-medicine', {
      method: 'POST',
      body: JSON.stringify({ mutations, biomarkers, disease }),
    }),

  multiOmics: (disease: string) =>
    apiFetch('/multi-omics', { method: 'POST', body: JSON.stringify({ disease }) }),

  proteinDynamics: (pdb_id: string) =>
    apiFetch(`/protein-dynamics?pdb_id=${encodeURIComponent(pdb_id)}`),

  molecularDynamics: (smiles: string, target: string) =>
    apiFetch('/molecular-dynamics', { method: 'POST', body: JSON.stringify({ smiles, target }) }),

  medicinalChemist: (smiles: string, target: string) =>
    apiFetch('/medicinal-chemist', { method: 'POST', body: JSON.stringify({ smiles, target }) }),

  repurposing: (drug_name: string) =>
    apiFetch('/repurposing', { method: 'POST', body: JSON.stringify({ drug_name }) }),

  diseaseGraph: () => apiFetch('/disease-graph'),

  manufacturing: (smiles: string) =>
    apiFetch('/manufacturing', { method: 'POST', body: JSON.stringify({ smiles, target: 'EGFR' }) }),

  clinicalRisk: (smiles: string, target: string) =>
    apiFetch('/clinical-risk', { method: 'POST', body: JSON.stringify({ smiles, target }) }),

  benchmarking: () => apiFetch('/benchmarking'),

  regulatoryReport: (smiles: string, target: string) =>
    apiFetch('/regulatory-report', { method: 'POST', body: JSON.stringify({ smiles, target }) }),

  intelligence: (query: string) =>
    apiFetch(`/intelligence?query=${encodeURIComponent(query)}`),

  fetchPubChemData: async (smiles: string) => {
    try {
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/MolecularWeight,MolecularFormula,IUPACName,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,HeavyAtomCount/JSON`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const props = data?.PropertyTable?.Properties?.[0];
      if (!props) return null;
      return {
        mw: parseFloat(props.MolecularWeight || '0'),
        formula: props.MolecularFormula || '',
        iupac: props.IUPACName || '',
        logp: parseFloat(props.XLogP || '0'),
        tpsa: parseFloat(props.TPSA || '0'),
        hbd: parseInt(props.HBondDonorCount || '0', 10),
        hba: parseInt(props.HBondAcceptorCount || '0', 10),
        rotBonds: parseInt(props.RotatableBondCount || '0', 10),
        heavyAtoms: parseInt(props.HeavyAtomCount || '0', 10),
        cid: props.CID || null
      };
    } catch {
      return null;
    }
  },

  fetchRcsbPdbData: async (pdbId: string) => {
    try {
      const url = `https://data.rcsb.org/rest/v1/core/entry/${encodeURIComponent(pdbId.toLowerCase())}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return {
        title: data?.struct?.title || '',
        method: data?.exptl?.[0]?.method || 'X-RAY DIFFRACTION',
        resolution: data?.rcsb_entry_info?.resolution_combined?.[0] ? `${data.rcsb_entry_info.resolution_combined[0]} Å` : 'N/A',
        depositDate: data?.rcsb_accession_info?.deposit_date ? data.rcsb_accession_info.deposit_date.split('T')[0] : '',
        organism: data?.rcsb_entry_container_identifiers?.pubmed_id ? 'Homo sapiens' : 'Target Organism'
      };
    } catch {
      return null;
    }
  }
};

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export function formatRisk(pct: number): string {
  if (pct < 0.15) return 'Low';
  if (pct < 0.35) return 'Moderate';
  return 'High';
}
