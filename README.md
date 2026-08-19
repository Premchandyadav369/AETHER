# AETHER V10 OMEGA: Research-Grade AI Drug Discovery Platform

[![Platform Version](https://img.shields.io/badge/AETHER-V10.0%20Omega-00E5FF?style=for-the-badge&logo=pytorch)](https://github.com/Premchandyadav369/AETHER)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20PyTorch-10B981?style=for-the-badge&logo=fastapi)](https://github.com/Premchandyadav369/AETHER)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014%20%2B%20TailwindCSS-8B5CF6?style=for-the-badge&logo=nextdotjs)](https://github.com/Premchandyadav369/AETHER)
[![Deploy to Render](https://img.shields.io/badge/Render-Deploy%20Blueprint-46E3B7?style=for-the-badge&logo=render)](docs/RENDER_DEPLOYMENT.md)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**AETHER** is an investor-grade, publication-ready **AI Drug Discovery Operating System & Digital Human Twin** designed for medicinal chemists, computational biologists, AI researchers, and pharmaceutical scientists.

It integrates multi-target conditional generative AI, 3D WebGL protein visualization, consensus docking, explicit-solvent molecular dynamics, TreeSHAP explainability, 5-compartment PBPK pharmacokinetics, patient mutation escape profiling, DFT quantum pharmacology, and multi-run experiment tracking into a sleek, high-density scientific workstation.

---

## 🌟 Key Workstation Modules (20 Core Engines)

1. **Executive Dashboard**: System health, 8x NVIDIA H100 GPU cluster gauges, screened compound metrics, and live compute job queue.
2. **Drug Discovery Workspace**: 8-stage pipeline visualization (`Dataset` → `Protein` → `Molecule Gen` → `AI Prediction` → `Docking` → `MD` → `Free Energy` → `Lead Ranking`) with live execution logs.
3. **🧬 Precision Medicine & Mutation Escape Lab**: Patient-specific oncogenic mutation simulation (EGFR L858R/T790M/C797S, KRAS G12C, BRAF V600E), resistance modeling ($\Delta\Delta G$), and targeted therapy rescue recommendations.
4. **🫀 Digital Human Twin & Pharmacokinetics Simulator**: Whole-body 5-compartment PBPK simulation (Bloodstream, Liver, Brain/BBB, Kidney, Target Tumor) with dynamic time-concentration curves across oral vs. IV vs. inhaled routes.
5. **🧪 AI Medicinal Chemist & Lead Optimization Studio**: Automated bioisosteric replacements (amides $\to$ triazoles, phenyls $\to$ bicyclo[1.1.1]pentanes), SAR insights, and one-click lead optimization transformations.
6. **🌐 Global Drug Intelligence & Disease Knowledge Graph**: Real-time biomedical multi-database indexing across PubChem Core, RCSB PDB, and ClinicalTrials.gov with multi-relational disease graphs.
7. **⚛️ Quantum Molecular Mechanics & Synthesis Lab**: B3LYP/6-31G* DFT frontier orbital energies (HOMO/LUMO), energy gaps ($\Delta E$), dipole moments ($\mu$), and industrial synthesis accessibility (SAS) scoring.
8. **De Novo Molecule Generator**: ProtCond-VAE & SELFIES latent sampling, SMILES/SELFIES editor, 2D chemical structure SVG renderer, and real-time descriptor calculations.
9. **Protein Explorer**: Interactive 3D PDB structure viewer (`1M17`, `1HCK`, `1HVR`, `4EY7`, `1UWH`, `3FU2`), pocket detection, gatekeeper residue highlighting, and AlphaFold3 pLDDT confidence scores.
10. **Docking Studio**: 3D binding pose visualization, consensus scoring across AutoDock Vina, GNINA CNN, and DiffDock, binding energy breakdown ($\Delta G$ in kcal/mol), and H-bond contact maps.
11. **Molecular Dynamics Dashboard**: OpenMM 8.1 100ns explicit solvent trajectories, RMSD, RMSF, Radius of Gyration (Rg), and MM-PBSA solvation free energy plots.
12. **AI Models Center & Model Zoo**: Auto-indexes trained models (`GATv2`, `GIN`, `Cross-Attention`, `ProtCond-VAE`, `ExtraTrees`, `LightGBM`, `XGBoost`, `CatBoost`), ROC-AUC/F1/MCC metrics, and checkpoint downloads.
13. **Dataset Manager**: Searchable dataset catalog (BindingDB 2024, ChEMBL 34, PDBbind 2024), drag-and-drop uploader, class balance analysis, and data cleaning logs.
14. **Candidate Ranking**: Top-100 leads, Top-20 preclinical candidates, Top-10 laboratory-priority molecules with sortable tables, filters, and one-click CSV export.
15. **Chemical Space Explorer**: High-dimensional UMAP and t-SNE 2D projections of 2048-bit GraphCL foundation embeddings (`foundation_embeddings.npy`) and scaffold clusters.
16. **ADMET & Toxicity Center**: Multi-parameter optimization (MPO) radar plots, Lipinski Rule of 5, Veber, PAINS, hERG, DILI, AMES, and BBB permeability checks.
17. **Explainability & SHAP Center**: TreeSHAP feature attributions, cross-attention heatmap matrix, and atom/residue contribution maps.
18. **Research & Laboratory Report Generator**: In-app rendering of publication reports, IND regulatory summaries, PDF/Word exports, and commercial synthesis availability checks.
19. **Experiment Manager & Version Tracker**: Benchmark comparator tracking performance improvements across V8, V9, V10, and V11 runs.
20. **Settings & Hardware Monitor**: PyTorch GPU tensor precision selection (FP16/BF16/FP32), random reproducibility seeds, and user experience mode toggles.

---

## ⚡ Interactive Platform Features

- **Dual Experience Modes**:
  - **Beginner Guided Mode**: Simplified target-to-lead wizard flow with plain-English scientific explanations.
  - **Expert Mode**: Full parameter control over sampling temperatures, docking exhaustiveness, and ML hyperparameters.
- **AI Research Copilot**: Floating assistant supporting natural language queries (*"Show top 10 EGFR candidates with high QED"*).
- **Command Palette (`Ctrl+K`)**: Instant global navigation across modules, proteins, datasets, and SMILES structures.
- **Real Artifact Auto-Indexing**: Automatically indexes generated artifacts in `public/v10/` (`denovo_leads_by_target.json`, `1m17.pdb`, `roc_curves.png`, `v10_dashboard.png`, etc.).

---

## 🚀 Cloud Deployment on Render (Step-by-Step)

Complete guide available in [`docs/RENDER_DEPLOYMENT.md`](docs/RENDER_DEPLOYMENT.md).

### 1-Click Blueprint Deployment (Recommended)
1. Push this repository to GitHub: `https://github.com/Premchandyadav369/AETHER.git`.
2. Open [Render Dashboard](https://dashboard.render.com/) → Click **New +** → **Blueprint**.
3. Select your repository. Render will automatically read `render.yaml` and configure:
   - **`aether-backend`** (FastAPI Python Web Service with health check `/healthz`).
   - **`aether-frontend`** (Next.js 14 Web Service connected to backend).
4. Click **Apply** to deploy both services live!

---

## 💻 Local Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
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

### 3. Backend FastAPI Server
```bash
# From repository root
pip install -r backend/requirements.txt

# Launch FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```
Interactive API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📂 Repository Architecture

```
AETHER/
├── backend/                       # FastAPI inference services & bio-databases
│   ├── api/endpoints.py           # REST API routes (precision med, twin, medchem, quantum)
│   ├── models/                    # GATv2, GIN, ProtCond-VAE architectures
│   ├── services/                  # Inference, research engine, vector search
│   ├── requirements.txt           # Python dependencies
│   └── main.py                    # FastAPI application entry point
├── frontend/                      # Next.js 14 Web Workstation
│   ├── app/                       # App Router pages & workstation components
│   │   ├── components/            # 20 Workstation modules + 3D Viewers + Copilot
│   │   ├── lib/api.ts             # Unified API & local artifact hydration client
│   │   ├── globals.css            # Glassmorphism cybernetic design system
│   │   └── page.tsx               # Main application router
│   └── public/v10/                # Indexed static artifacts & PDB structures
├── docs/                          # Cloud deployment & technical guides
│   └── RENDER_DEPLOYMENT.md       # Step-by-step Render setup guide
├── infrastructure/                # Multi-stage Dockerfiles & Kubernetes configs
├── render.yaml                    # Declarative Render Blueprint (IaC)
└── README.md                      # Platform documentation
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
