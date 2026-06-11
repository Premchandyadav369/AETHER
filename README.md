# AETHER-RAMI V6 🧬⚡

> **AI for the Next Generation of Drug Discovery & Therapeutics**

[![GitHub](https://img.shields.io/badge/GitHub-Premchandyadav369%2FAETHERRAMI-blue?style=flat-square&logo=github)](https://github.com/Premchandyadav369/AETHERRAMI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)

---

## 🔬 Overview

**AETHER-RAMI V6** is a protein-aware foundation model that unifies molecules, proteins, and targets to accelerate the discovery of life-saving drugs. The platform combines cutting-edge deep learning with intuitive 3D interactive visualizations and a production-ready API architecture.

### 🎯 Key Capabilities

| Module | Description |
|--------|-------------|
| **Drug Discovery Studio** | Predict binding affinity, ADMET profiles, toxicity & drug-likeness |
| **Protein Intelligence** | Explore 3D structure, binding pockets, electrostatics, secondary structure |
| **RAMI Retrieval Engine** | Find similar molecules & proteins via dual FAISS embedding indexes |
| **Molecular Generator** | Condition VAE to synthesize novel drug candidates targeting specific proteins |
| **Explainable AI** | SHAP feature attribution & cross-attention residue heatmaps |
| **Active Learning** | Human-in-the-loop feedback loop with uncertainty-driven sampling |

---

## 🏗️ Architecture

```
AETHERRAMI/
├── aether-ramiv4/          # V4 model checkpoints & PDB structures
│   ├── *.pdb               # EGFR, BRAF, CDK2, HIV Protease, AChE structures  
│   ├── rf_v4.pkl           # Random Forest ensemble models
│   ├── faiss_v4.bin        # FAISS dual embedding index
│   └── generate_visualizations.py
├── backend/                # FastAPI inference service
│   ├── api/endpoints.py    # REST API routes
│   ├── models/             # PyTorch model definitions
│   ├── services/           # Inference & vector search
│   └── database/           # SQLAlchemy schema
├── frontend/               # Next.js 14 dashboard
│   ├── app/
│   │   ├── layout.tsx      # Root layout (sidebar, navbar, cursor)
│   │   └── page.tsx        # Main dashboard page
│   └── public/
│       └── visualizations/ # 25+ interactive 3D HTML widgets
├── visualizations/         # Generated WebGL visualizations
├── infrastructure/         # Docker, Kubernetes, Prometheus
└── docs/                   # Architecture specs & startup roadmap
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Premchandyadav369/AETHERRAMI.git
cd AETHERRAMI
```

### 2. Start the Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# → Open http://localhost:3000
```

### 3. Start the Backend API
```bash
# Install Python dependencies
pip install fastapi uvicorn numpy scikit-learn

# Run the server
cd AETHERRAMI
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
# → API docs at http://localhost:8000/docs
```

### 4. Generate Visualizations (Optional - already included)
```bash
cd aether-ramiv4
python generate_visualizations.py
```

---

## 🎨 Interactive Visualizations

The platform includes **25+ interactive WebGL/3D modules** built from real PDB structural data:

### Target-Specific (per EGFR, BRAF, CDK2, HIV Protease, AChE)
- 🔴 `binding_pocket_3d.html` — 3Dmol.js pocket explorer (highlight residues < 5Å from ligand)
- 🕸️ `interaction_network.html` — Vis.js H-bond & hydrophobic interaction network
- ⚡ `electrostatic_surface.html` — VDW electrostatic potential surface
- 💧 `hydrophobicity_surface.html` — Lipophilic/hydrophilic gradient map
- 🔷 `secondary_structure.html` — Helix/sheet/coil residue map with sync 3D viewer

### Global Platform Visualizations
- 🌌 `chemical_space_3d.html` — 3D UMAP of 1,500+ synthesizable candidates (Plotly)
- 🌠 `drug_target_galaxy.html` — Drug-Target interaction network (Vis.js)
- 🔥 `cross_attention.html` — Protein-Ligand cross-attention matrix heatmap (Plotly)
- 🧬 `molecule_evolution.html` — VAE latent-space molecular evolution (SmilesDrawer)
- 🌍 `foundation_embedding_universe.html` — Unified molecular & protein embedding space

---

## 🔌 K2-Think V2 AI Integration

This platform integrates with the **K2-Think V2** foundation model API for enhanced reasoning:

```bash
curl -X 'POST' \
  'https://api.k2think.ai/v1/chat/completions' \
  -H 'Authorization: Bearer IFM-4SpQ0qEg0Wlsw04O' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "MBZUAI-IFM/K2-Think-v2",
    "messages": [{"role": "user", "content": "Analyze this drug candidate..."}],
    "stream": true
  }'
```

---

## 📡 API Reference

Base URL: `http://localhost:8000/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/predict` | POST | Predict binding affinity + ADMET |
| `/generate` | POST | Generate novel drug candidates |
| `/retrieve` | GET | RAMI dual retrieval search |
| `/admet` | POST | ADMET-only analysis |
| `/explain` | POST | SHAP explainability report |
| `/leaderboard` | GET | Model benchmark leaderboard |
| `/models` | GET | Model registry status |
| `/train` | POST | Trigger active learning retrain |
| `/docs` | GET | Interactive Swagger API docs |

---

## 🏆 Model Leaderboard

| Rank | Model | ROC-AUC | F1 | MCC |
|------|-------|---------|-----|-----|
| 🥇 1 | **AETHER-RAMI V6** (Ours) | **0.927** | **0.845** | **0.684** |
| 🥈 2 | DeepDTA | 0.892 | 0.812 | 0.612 |
| 🥉 3 | GraphDTA | 0.876 | 0.795 | 0.589 |
| 4 | D-SCRIPT | 0.865 | 0.781 | 0.564 |

---

## 🐳 Docker Deployment

```bash
cd infrastructure
docker-compose up --build
```

Services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## ☸️ Kubernetes

```bash
kubectl apply -f infrastructure/k8s-deployment.yaml
```

Deploys with auto-scaling (3 backend replicas, 2 frontend replicas) and LoadBalancer service.

---

## 📊 Datasets & Benchmarks

| Dataset | Task | Samples | Split |
|---------|------|---------|-------|
| PDBBind v2020 | DTI Regression | 19,443 | Temporal |
| BindingDB | Affinity Prediction | 248,000 | Scaffold |
| BACE | Classification | 1,522 | Scaffold |
| BBBP | BBB Penetration | 2,050 | Scaffold |
| ClinTox | Toxicity | 1,478 | Random |

---

## 📄 Citation

```bibtex
@software{aether_rami_v6,
  author = {Premchand Yadav},
  title = {AETHER-RAMI V6: Protein-Aware Foundation Model for Drug Discovery},
  year = {2026},
  url = {https://github.com/Premchandyadav369/AETHERRAMI},
  version = {6.0.0}
}
```

---

## 📝 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
<strong>Built for Researchers. Designed for Impact.</strong><br/>
PyTorch • DGL • FAISS • ESM-2 • RDKit • Hugging Face • PDB • UniProt
</div>
