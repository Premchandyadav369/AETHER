# AETHER-RAMI V10 OMEGA: Research-Grade AI Drug Discovery Platform

[![Platform Version](https://img.shields.io/badge/AETHER--RAMI-V10.0%20Omega-00E5FF?style=for-the-badge&logo=pytorch)](https://github.com/Premchandyadav369/AETHERRAMI)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20PyTorch-10B981?style=for-the-badge&logo=fastapi)](https://github.com/Premchandyadav369/AETHERRAMI)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%2B%20TailwindCSS-8B5CF6?style=for-the-badge&logo=nextdotjs)](https://github.com/Premchandyadav369/AETHERRAMI)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**AETHER-RAMI V10 Omega** is an investor-grade, publication-ready **AI Drug Discovery Operating System** designed for medicinal chemists, computational biologists, AI researchers, and pharmaceutical scientists.

It combines multi-target conditional generative AI, 3D WebGL protein visualization, consensus docking, explicit-solvent molecular dynamics, TreeSHAP explainability, and multi-run experiment tracking into a sleek, high-density scientific workstation.

---

## 🌟 Key Workstation Modules

1. **Executive Dashboard**: System health, 8x NVIDIA H100 GPU cluster gauges, screened compound metrics, and live compute job queue.
2. **Drug Discovery Workspace**: 8-stage pipeline visualization (`Dataset` → `Protein` → `Molecule Gen` → `AI Prediction` → `Docking` → `MD` → `Free Energy` → `Lead Ranking`) with live execution logs.
3. **De Novo Molecule Generator**: ProtCond-VAE & SELFIES latent sampling, SMILES/SELFIES editor, 2D chemical structure SVG renderer, and real-time descriptor calculations.
4. **Protein Explorer**: Interactive 3D PDB structure viewer (`1M17`, `1HCK`, `1HVR`, `4EY7`, `1UWH`, `3FU2`), pocket detection, gatekeeper residue highlighting, and AlphaFold3 pLDDT confidence scores.
5. **Docking Studio**: 3D binding pose visualization, consensus scoring across AutoDock Vina, GNINA CNN, and DiffDock, binding energy breakdown (ΔG in kcal/mol), and H-bond contact maps.
6. **Molecular Dynamics Dashboard**: OpenMM 8.1 100ns explicit solvent trajectories, RMSD, RMSF, Radius of Gyration (Rg), and MM-PBSA solvation free energy plots.
7. **AI Models Center & Model Zoo**: Auto-indexes trained models (`GATv2`, `GIN`, `Cross-Attention`, `ProtCond-VAE`, `ExtraTrees`, `LightGBM`, `XGBoost`, `CatBoost`), ROC-AUC/F1/MCC metrics, and checkpoint downloads.
8. **Dataset Manager**: Searchable dataset catalog (BindingDB 2024, ChEMBL 34, PDBbind 2024), drag-and-drop uploader, class balance analysis, and data cleaning logs.
9. **Candidate Ranking**: Top-100 leads, Top-20 preclinical candidates, Top-10 laboratory-priority molecules with sortable tables, filters, and one-click CSV export.
10. **Chemical Space Explorer**: High-dimensional UMAP and t-SNE 2D projections of 2048-bit GraphCL foundation embeddings (`foundation_embeddings.npy`) and scaffold clusters.
11. **ADMET & Toxicity Center**: Multi-parameter optimization (MPO) radar plots, Lipinski Rule of 5, Veber, PAINS, hERG, DILI, AMES, and BBB permeability checks.
12. **Explainability & SHAP Center**: TreeSHAP feature attributions, cross-attention heatmap matrix, and atom/residue contribution maps.
13. **Research & Laboratory Report Generator**: In-app rendering of `publication_report.html` (12.8 MB indexed document), PDF/Word exports, and commercial synthesis availability checks.
14. **Experiment Manager & Version Tracker**: Benchmark comparator tracking performance improvements across V8, V9, V10, and V11 runs.
15. **Settings & Hardware Monitor**: PyTorch GPU tensor precision selection (FP16/BF16/FP32), random reproducibility seeds, and user experience mode toggles.

---

## ⚡ Interactive Platform Features

- **Dual Experience Modes**:
  - **Beginner Guided Mode**: Simplified target-to-lead wizard flow with plain-English scientific explanations.
  - **Expert Mode**: Full parameter control over sampling temperatures, docking exhaustiveness, and ML hyperparameters.
- **AI Research Copilot**: Floating assistant supporting natural language queries (*"Show top 10 EGFR candidates with high QED"*).
- **Command Palette (`Ctrl+K`)**: Instant global navigation across modules, proteins, datasets, and SMILES structures.
- **Real Artifact Auto-Indexing**: Automatically indexes generated artifacts in `public/v10/` (`denovo_leads_by_target.json`, `1m17.pdb`, `roc_curves.png`, `v10_dashboard.png`, etc.).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later
- **Python**: v3.10 or later
- **npm** or **yarn**

### 2. Frontend Installation & Startup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Backend FastApi Server (Optional)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Launch FastAPI server
python -m uvicorn main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📂 Repository Architecture

```
AETHERRAMI/
├── aetherramiresultsv10/     # Raw pipeline execution outputs (PDBs, PNGs, CSVs, PKLs, PTs)
├── backend/                  # FastAPI inference services, vector search, research engine
│   ├── api/endpoints.py      # REST API routes
│   └── main.py               # FastAPI application entry point
├── frontend/                 # Next.js 14 Web Application
│   ├── app/                  # App Router pages and workstation components
│   │   ├── components/       # 15 Workstation modules + 3D Viewers + Copilot
│   │   ├── lib/api.ts        # Unified API & local artifact hydration client
│   │   ├── globals.css       # Glassmorphism, cybernetic design system
│   │   └── page.tsx          # Main application router
│   └── public/v10/           # Indexed static artifacts & PDB structures
└── README.md                 # Platform documentation
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
