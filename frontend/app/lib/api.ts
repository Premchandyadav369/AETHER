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

  health: () => apiFetch('/'),

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
};

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export function formatRisk(pct: number): string {
  if (pct < 0.15) return 'Low';
  if (pct < 0.35) return 'Moderate';
  return 'High';
}
