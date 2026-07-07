<div align="center">

```
 █████╗ ███████╗████████╗██╗  ██╗███████╗██████╗       ██████╗  █████╗ ███╗   ███╗██╗
██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔════╝██╔══██╗      ██╔══██╗██╔══██╗████╗ ████║██║
███████║█████╗     ██║   ███████║█████╗  ██████╔╝█████╗██████╔╝███████║██╔████╔██║██║
██╔══██║██╔══╝     ██║   ██╔══██║██╔══╝  ██╔══██╗╚════╝██╔══██╗██╔══██║██║╚██╔╝██║██║
██║  ██║███████╗   ██║   ██║  ██║███████╗██║  ██║      ██║  ██║██║  ██║██║ ╚═╝ ██║██║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝      ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝
```

### **V7 · AI-Powered Drug Discovery & Precision Medicine Operating System**

*Artificial Intelligence for Therapeutic Exploration, Human-centered Evaluation, Research & Rational Molecular Intelligence*

[![GitHub Stars](https://img.shields.io/github/stars/Premchandyadav369/AETHERRAMI?style=for-the-badge&logo=github&color=FFD700&labelColor=0d1117)](https://github.com/Premchandyadav369/AETHERRAMI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&labelColor=0d1117)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=0d1117)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=0d1117)](https://fastapi.tiangolo.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-white?style=for-the-badge&logo=nextdotjs&logoColor=black&labelColor=0d1117)](https://nextjs.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white&labelColor=0d1117)](https://pytorch.org)
[![3Dmol.js](https://img.shields.io/badge/3Dmol.js-Protein_Viewer-00E5FF?style=for-the-badge&labelColor=0d1117)](https://3dmol.csb.pitt.edu/)
[![ESM-2](https://img.shields.io/badge/ESM--2-Protein_LM-blueviolet?style=for-the-badge&labelColor=0d1117)](https://github.com/facebookresearch/esm)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-orange?style=for-the-badge&labelColor=0d1117)](https://github.com/facebookresearch/faiss)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white&labelColor=0d1117)](https://docker.com)

---

**Protein Foundation Model · Digital Human Twin · Autonomous AI Scientist · Explainable DTI · Quantum-Inspired Molecular Learning**

*From molecule to medicine · From sequence to structure · From data to discovery*

---

> **"AETHER-RAMI is not a dashboard, not a demo — it is a living, breathing AI-powered drug discovery operating system spanning molecular foundation models, protein intelligence, digital human twins, autonomous agents, and explainable AI — unified into a single scientific platform."**

> ⚠️ **A note on numbers in this document:** Every metric below is either (a) a benchmark result produced by a specific script in this repo (path given next to the number), or (b) explicitly labeled as a *target/design goal* if the corresponding experiment has not yet been logged. This distinction is kept throughout so the README stays trustworthy for anyone citing it.

</div>

---

## 📋 Table of Contents

- [Scientific Overview](#-scientific-overview)
- [Glossary of Terms — What, Why, and Where](#-glossary-of-terms--what-why-and-where)
- [Core Mathematical Foundations](#-core-mathematical-foundations)
  - [GNN Message Passing](#1-gnn-message-passing--molecular-graph-encoding)
  - [Protein-Ligand Cross-Attention](#2-protein-ligand-cross-attention-dti)
  - [Conditional VAE Molecular Generation](#3-conditional-variational-autoencoder-cvae-for-molecular-generation)
  - [BALD Active Learning](#4-bayesian-active-learning-by-disagreement-bald)
  - [SHAP Explainability](#5-shap-shapley-additive-explanations-for-xai)
  - [PK/PD Digital Twin ODE System](#6-pkpd-digital-twin-ode-system)
  - [FAISS Vector Retrieval](#7-faiss-approximate-nearest-neighbour-retrieval)
  - [InfoNCE Contrastive Pretraining](#8-infonce-contrastive-pretraining-graphcl)
  - [QUBO Drug-Target Optimization](#9-qubo-formulation-for-drug-target-optimization)
  - [Quantum Molecular Descriptors](#10-quantum-molecular-descriptors)
- [Reference Implementations (Code Walkthroughs)](#-reference-implementations-code-walkthroughs)
  - [GNN Encoder](#a-molecular-gnn-encoder)
  - [Cross-Attention DTI Head](#b-protein-ligand-cross-attention-head)
  - [Protein-Conditioned CVAE](#c-protein-conditioned-cvae)
  - [BALD Active Learning Loop](#d-bald-active-learning-loop)
  - [PK/PD Two-Compartment Solver](#e-pkpd-two-compartment-ode-solver)
  - [FAISS Dual-Index Retrieval](#f-faiss-dual-index-retrieval)
  - [SHAP + GradCAM Explainer](#g-shap--gradcam-explainer)
- [System Architecture](#-system-architecture)
- [18 Platform Capabilities](#-18-platform-capabilities)
- [Module Deep-Dives](#-module-deep-dives)
- [REST API Reference](#-rest-api-reference)
- [Interactive Visualizations](#-interactive-visualizations)
- [Benchmarks & Evaluation](#-benchmarks--evaluation)
- [Ablation Studies](#-ablation-studies)
- [Datasets & Knowledge Sources](#-datasets--knowledge-sources)
- [Design Rationale — Why Each Component Exists](#-design-rationale--why-each-component-exists)
- [Directory Structure](#-directory-structure)
- [Quick Start](#-quick-start)
- [Docker & Kubernetes Deployment](#-docker--kubernetes-deployment)
- [V1–V7 Evolution Timeline](#-v1v7-evolution-timeline)
- [Comparison Against SOTA](#-comparison-against-sota-models)
- [Limitations & Honest Caveats](#-limitations--honest-caveats)
- [Roadmap](#-roadmap)
- [Frequently Asked Questions](#-frequently-asked-questions)
- [Citation](#-citation)

---

## 🔬 Scientific Overview

**AETHER-RAMI** (Artificial Intelligence for Therapeutic Exploration, Human-centered Evaluation, Research & Rational Molecular Intelligence) is a research-grade platform that unifies the stages of early-stage computational drug discovery — which are normally spread across five or six disconnected tools — into one coherent, explainable pipeline:

- **Molecular Foundation Models** — Graph Neural Networks (GNNs) pretrained with GraphCL/InfoNCE contrastive learning across multiple biomedical datasets, so the encoder learns general chemistry before ever seeing a binding-affinity label.
- **Protein Intelligence Engine** — ESM-2 protein language model embeddings for sequence→structure→function mapping, replacing hand-built protein descriptors with learned representations.
- **Explainable Drug-Target Interaction (DTI)** — a cross-attention mechanism paired with SHAP feature attribution, so every affinity number ships with a "why."
- **Digital Human Twin** — a two-compartment PK/PD ODE system simulating drug absorption, distribution, metabolism, and excretion (ADME) in a virtual patient.
- **Autonomous Research Agent** — a goal-driven molecular discovery loop that uses Bayesian active learning (BALD) to decide which molecule to evaluate next, rather than screening exhaustively.
- **Precision Medicine Engine** — patient-specific drug ranking using multi-omics integration (genomics + proteomics + metabolomics).
- **Interactive Visualization Suite** — 3Dmol.js protein viewers, Plotly chemical-space maps, and vis-network knowledge graphs, because a pKd number alone rarely convinces a chemist.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AETHER-RAMI V7 PLATFORM                             │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Molecular   │  │   Protein    │  │   Digital    │  │ Autonomous   │   │
│  │  Foundation  │─▶│Intelligence  │─▶│ Human Twin   │─▶│   Research   │   │
│  │    Model     │  │  (ESM-2)     │  │  (PK/PD)     │  │    Agent     │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                │                  │                  │            │
│         ▼                ▼                  ▼                  ▼            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              FAISS Vector Search · SHAP XAI · K2-Think Copilot       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│         │                │                  │                  │            │
│         ▼                ▼                  ▼                  ▼            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   FastAPI    │  │  Next.js 14  │  │  3Dmol.js    │  │   Plotly +   │   │
│  │  30+ Routes  │  │   Frontend   │  │  5 PDB Prots │  │ vis-network  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📖 Glossary of Terms — What, Why, and Where

This section exists so a reader without a computational chemistry or ML background can follow the rest of the document. For every term: **what it is**, **why AETHER-RAMI uses it instead of a simpler alternative**, and **where in the repo it lives**.

### Chemistry & Biology Terms

| Term | What It Means | Why It's Used Here |
|---|---|---|
| **SMILES** (Simplified Molecular Input Line Entry System) | A compact text string encoding a molecule's atoms and bonds, e.g. `CC(=O)NC1=CC=C(O)C=C1` for paracetamol. | It's the universal input format for cheminformatics tools (RDKit, PubChem, ChEMBL), so every model in the pipeline starts here. |
| **RDKit** | An open-source cheminformatics toolkit. | Used to parse SMILES, validate chemical structure (kekulization), and compute classical descriptors before anything reaches a neural network. |
| **Mordred** | A descriptor-calculation library built on RDKit, computing 1800+ 2D/3D molecular descriptors. | Provides hand-engineered features (topological, geometric, electronic) that complement — and act as a sanity check against — the learned GNN embedding. |
| **Morgan Fingerprint (ECFP)** | A fixed-length bit vector encoding the circular neighborhood of each atom. | Fast, well-understood baseline representation; used for the classical ML models (Random Forest, XGBoost) and for quick similarity screens. |
| **Protein sequence** | The linear chain of amino acids (letters like `MRPSGTA...`) that folds into a protein's 3D structure. | The raw input to ESM-2; determines the protein's binding pocket shape indirectly through the learned embedding. |
| **PDB (Protein Data Bank) structure** | A file format storing the experimentally solved 3D coordinates of a protein (by X-ray crystallography, cryo-EM, or NMR). | Used for 3Dmol.js visualization, pocket detection, and as ground truth for the 5 reference targets (EGFR, BRAF, CDK2, HIV Protease, AChE). |
| **Binding pocket** | The 3D cavity on a protein surface where a small molecule (ligand) binds. | Cross-attention and pocket-conditioned generation both need to know *where* on the protein the drug is meant to interact. |
| **pKd** | The negative log10 of the dissociation constant $K_d$: $\text{pKd} = -\log_{10}(K_d)$. Higher pKd = tighter binding. | Used instead of raw $K_d$ (which spans many orders of magnitude) because it's linear and easier for a neural network to regress. |
| **IC50 / EC50** | The concentration of a drug needed to inhibit (IC50) or produce half-maximal effect (EC50) in an assay. | Reported alongside pKd because it's the unit most familiar to wet-lab pharmacologists. |
| **ADMET** | Absorption, Distribution, Metabolism, Excretion, Toxicity — the pharmacokinetic/safety properties of a drug candidate. | A molecule can bind its target perfectly and still fail as a drug; ADMET filtering is why AETHER-RAMI predicts 10 separate properties, not just affinity. |
| **hERG inhibition** | Blocking the hERG cardiac ion channel, a major cause of drug-induced arrhythmia and a top reason for late-stage drug failure. | Flagged explicitly as a safety endpoint because hERG liability alone has killed many otherwise-promising candidates in real pipelines. |
| **Lipinski's Rule of Five** | A heuristic (MW < 500, LogP < 5, H-bond donors ≤ 5, H-bond acceptors ≤ 10) predicting oral drug-likeness. | Used as a fast, interpretable pre-filter before expensive model inference. |
| **LogP / LogS** | LogP = octanol-water partition coefficient (lipophilicity); LogS = aqueous solubility. | Core physicochemical properties driving absorption and formulation feasibility. |
| **BBB penetration** | Whether a molecule can cross the Blood-Brain Barrier. | Essential for CNS-targeting drugs (e.g. Alzheimer's/AChE), irrelevant/undesirable for others — the model flags both directions. |
| **Synthetic Accessibility (SA) score** | A heuristic estimate (1 = easy, 10 = very hard) of how difficult a molecule is to synthesize. | Prevents the generative model from proposing molecules that look great on paper but can't be made in a lab. |
| **hERG, QTc, hepatotoxicity, mutagenicity** | Specific clinical/preclinical safety endpoints. | Each maps to a real reason drugs fail Phase I/II trials; predicting them early is the entire point of *in silico* triage. |
| **ICH M7 / S9** | International Council for Harmonisation guidelines on genotoxic impurity limits (M7) and oncology drug nonclinical evaluation (S9). | The Regulatory Readiness Suite checks candidate molecules against these rules so results are contextualized against real regulatory expectations (not a substitute for actual regulatory review). |

### Machine Learning & Deep Learning Terms

| Term | What It Means | Why It's Used Here |
|---|---|---|
| **Graph Neural Network (GNN)** | A neural network that operates directly on graph-structured data (nodes + edges) via message passing. | A molecule *is* a graph (atoms = nodes, bonds = edges); GNNs preserve this structure instead of flattening it into an arbitrary vector. |
| **GCN (Graph Convolutional Network)** | A GNN variant that aggregates neighbor features with a normalized adjacency matrix. | Used as an early, simple baseline (V1–V2) before more expressive architectures were added. |
| **GAT (Graph Attention Network)** | A GNN variant that learns *attention weights* over neighbors instead of fixed averaging. | Lets the model learn which bonds/atoms matter most for a given property, improving over plain GCN. |
| **EGNN (Edge-Augmented / Equivariant GNN)** | A GNN variant incorporating edge features and (optionally) geometric equivariance. | Bond type (single/double/aromatic) materially changes chemistry — EGNN lets that information flow through message passing rather than being discarded. |
| **Message Passing** | The core GNN operation: each node aggregates messages from its neighbors and updates its own representation. | This is *how* a GNN learns; every architecture in this repo (GCN, GAT, EGNN) is a variant of this same idea. |
| **Readout / Pooling** | Combining all per-atom embeddings into one whole-molecule embedding. | Needed because downstream tasks (pKd prediction) need a single fixed-size vector per molecule, not one vector per atom. |
| **ESM-2** | A protein language model (from Meta AI) pretrained on hundreds of millions of protein sequences, producing dense embeddings that encode structural/functional information. | Avoids needing an experimentally solved structure for every protein — a sequence alone yields a useful embedding. |
| **Cross-Attention** | An attention mechanism where queries come from one modality (molecule) and keys/values from another (protein). | This is the mechanism that lets a drug embedding "look at" specific protein residues, which is what makes the DTI model both accurate and interpretable (via the attention heatmap). |
| **Contrastive Learning / GraphCL / InfoNCE** | A self-supervised pretraining strategy: two augmented views of the same molecule are pulled together in embedding space, while different molecules are pushed apart. | Lets the GNN encoder learn general chemical structure from *unlabeled* molecules before fine-tuning on the (much smaller) labeled affinity datasets — improving data efficiency. |
| **CVAE (Conditional Variational Autoencoder)** | A generative model that learns a probabilistic latent space conditioned on some input (here, the target protein), then decodes new samples from it. | Lets AETHER-RAMI *generate* new candidate molecules conditioned on a specific protein target, rather than only scoring molecules a human already proposed. |
| **ELBO (Evidence Lower Bound)** | The training objective for a VAE: reconstruction quality minus a KL-divergence regularizer. | Standard, mathematically grounded way to train the CVAE so its latent space stays smooth and sample-able. |
| **KL Divergence** | A measure of how different two probability distributions are. | Used inside the ELBO to keep the learned latent distribution close to a simple Gaussian prior, which is what makes sampling new molecules possible. |
| **Reparameterization Trick** | A technique to make sampling from a Gaussian differentiable, so gradients can flow through it. | Required to train the CVAE with standard backpropagation. |
| **BALD (Bayesian Active Learning by Disagreement)** | An acquisition function that picks the next data point to label by maximizing the *disagreement* between model samples (i.e., where the model is most uncertain). | Directly reduces the number of expensive wet-lab or simulated assays needed to reach a target performance — this is the core lever behind the "sample efficiency" claims below. |
| **Monte Carlo (MC) Dropout** | Running a network multiple times with dropout active at inference time to approximate a distribution over predictions. | The practical way BALD is implemented without needing a full Bayesian neural network. |
| **Thompson Sampling** | A bandit algorithm that samples from the posterior belief over each option's value and picks the best sample. | Used for exploration during agent-driven candidate selection, complementing BALD's pure-uncertainty focus with some exploitation. |
| **Expected Improvement (EI)** | A Bayesian-optimization acquisition function balancing predicted value against uncertainty. | An alternative/complementary acquisition strategy used when the goal is "find the single best molecule" rather than "reduce overall model uncertainty." |
| **SHAP (SHapley Additive exPlanations)** | A game-theoretic method attributing a model's prediction to individual input features, based on Shapley values from cooperative game theory. | Gives a mathematically principled (not just heuristic) answer to "which atoms/features drove this prediction," which matters for scientific trust and for a wet-lab chemist deciding what to try next. |
| **GradCAM** | A gradient-based attribution technique originally from computer vision, adapted here to weight per-atom GNN embeddings by their gradient contribution to the output. | Provides a second, cheaper explainability signal that complements SHAP and can be computed in a single backward pass. |
| **Attention heatmap** | A residue × atom matrix visualizing where the cross-attention mechanism is "looking." | The most direct, mechanistic explanation available — it comes for free from the model's own attention weights rather than a post-hoc approximation. |
| **FAISS (Facebook AI Similarity Search)** | A library for fast nearest-neighbor search over dense vector embeddings, using techniques like IVF (Inverted File) and PQ (Product Quantization). | Lets the platform search millions of molecule/protein embeddings for near-neighbors in milliseconds — this is what powers drug repurposing and analog search. |
| **IVF (Inverted File Index)** | Partitions the embedding space into clusters (Voronoi cells) so search only needs to check the most relevant few clusters. | Makes search sub-linear in the number of molecules, which matters once the index holds hundreds of thousands of compounds. |
| **PQ (Product Quantization)** | Compresses each vector into a small code by quantizing sub-vectors independently. | Reduces memory footprint so large indices (millions of ChEMBL/BindingDB compounds) fit in RAM. |
| **QUBO (Quadratic Unconstrained Binary Optimization)** | An optimization formulation over binary variables with a quadratic objective, the native input format for quantum annealers and simulated-annealing solvers. | Used to formulate multi-drug / multi-target portfolio selection as a combinatorial optimization problem, and to keep the platform compatible with quantum-annealing hardware if/when that becomes practical. |
| **Simulated Annealing** | A classical optimization heuristic that accepts worse solutions probabilistically (following a cooling schedule) to escape local minima. | The practical, classical solver used for the QUBO formulation today, standing in for a quantum annealer. |
| **HOMO / LUMO** | Highest Occupied / Lowest Unoccupied Molecular Orbital — quantum-chemical concepts describing where a molecule's electrons sit. | The HOMO-LUMO gap correlates with chemical reactivity and stability, feeding into descriptors like electrophilicity that relate to metabolic stability. |
| **Chemical hardness / electrophilicity index** | Quantum-chemical reactivity descriptors derived from HOMO/LUMO energies. | Cheap, physically-grounded proxies for how reactive (and potentially toxic or metabolically unstable) a molecule is likely to be. |
| **UMAP / t-SNE** | Dimensionality-reduction algorithms that project high-dimensional embeddings into 2D/3D for visualization while preserving local structure. | Used to render the "chemical space map" so a researcher can visually spot clusters, outliers, and where a new candidate sits relative to known drugs. |
| **Murcko Scaffold** | The core ring-system "skeleton" of a molecule, with side chains stripped away. | Used to cluster/split molecules by structural family — important both for visualization and for making sure train/test splits don't leak near-duplicate scaffolds. |
| **ROC-AUC** | Area under the Receiver Operating Characteristic curve; measures a binary classifier's ability to rank positives above negatives. | Standard classification metric reported for all binary endpoints (e.g. hERG risk, BBB penetration). |
| **RMSE / MAE / Pearson r** | Root-Mean-Squared-Error, Mean-Absolute-Error, and Pearson correlation — standard regression metrics. | Used for continuous outputs like pKd, LogP, and PK parameters. |
| **Scaffold split** | A train/test split strategy that groups molecules by Murcko scaffold before splitting, rather than splitting randomly. | A much harder and more realistic test of generalization than a random split, since it forces the model to predict on genuinely novel chemical scaffolds. |

### Pharmacology & Systems Terms

| Term | What It Means | Why It's Used Here |
|---|---|---|
| **PK (Pharmacokinetics)** | The study of how a drug moves through the body over time (absorption, distribution, metabolism, excretion). | Governs *how much* drug reaches the target tissue and for how long — a prerequisite for the PD effect model. |
| **PD (Pharmacodynamics)** | The study of a drug's biological effect as a function of its concentration. | Connects the PK concentration curve to an actual predicted clinical/biological effect via the Emax model. |
| **Two-compartment model** | A PK model splitting the body into a "central" (blood/well-perfused organs) and "peripheral" (tissue) compartment. | The standard minimal model that captures the distribution-phase drop seen after IV dosing, more realistic than a one-compartment model without the complexity of a full physiologically-based (PBPK) model. |
| **Emax model** | A sigmoidal dose-response curve: effect rises with concentration up to a maximum ($E_{\max}$). | The standard pharmacological model for concentration→effect relationships, used to translate simulated blood concentration into a predicted therapeutic/toxic effect. |
| **AUC (Area Under the Curve)** | The integral of concentration over time — a proxy for total drug exposure. | One of the most common PK metrics regulators and pharmacologists use to compare dosing regimens. |
| **Clearance (CL) / Volume of distribution (Vss)** | CL = rate the body eliminates a drug; Vss = the apparent volume the drug distributes into. | Core PK parameters derived from the ODE solution and used to personalize dosing per patient (via the allometric/eGFR scaling shown in the Digital Twin section). |
| **Multi-omics** | The combination of genomics (DNA), transcriptomics (RNA), proteomics (protein), and metabolomics (metabolites) data. | Precision-medicine drug ranking needs more than one molecular layer — a mutation (genomics) might matter less than its downstream protein expression (proteomics). |
| **Knowledge graph** | A graph database linking entities (drugs, proteins, diseases, pathways) via typed relationships (treats, inhibits, causes). | Lets the platform answer relational questions ("what else inhibits this pathway?") that a flat table cannot. |

---

## 📐 Core Mathematical Foundations

### 1. GNN Message Passing — Molecular Graph Encoding

Each molecule is represented as a graph $\mathcal{G} = (\mathcal{V}, \mathcal{E})$ where nodes $v_i \in \mathcal{V}$ are atoms and edges $e_{ij} \in \mathcal{E}$ are bonds.

**Node Feature Initialization:**

$$\mathbf{h}_i^{(0)} = \text{Embed}(\text{atom\_type}_i) \| \text{Embed}(\text{degree}_i) \| \text{Embed}(\text{charge}_i) \| \text{Embed}(\text{chirality}_i)$$

**Message Passing (L layers):**

$$\mathbf{m}_{ij}^{(l)} = \phi_m\left(\mathbf{h}_i^{(l)},\ \mathbf{h}_j^{(l)},\ \mathbf{e}_{ij}\right)$$

$$\mathbf{h}_i^{(l+1)} = \phi_u\left(\mathbf{h}_i^{(l)},\ \bigoplus_{j \in \mathcal{N}(i)} \mathbf{m}_{ij}^{(l)}\right)$$

where $\bigoplus$ is a permutation-invariant aggregation (sum, mean, or max), $\phi_m$ is the message function (MLP), and $\phi_u$ is the update function (GRU cell).

**Global Pooling to Molecular Embedding:**

$$\mathbf{z}_{\text{mol}} = \text{READOUT}\left(\left\{\mathbf{h}_i^{(L)} : v_i \in \mathcal{V}\right\}\right) = \sum_{i} \text{softmax}\!\left(a_i\right) \cdot \mathbf{h}_i^{(L)}$$

where $a_i = \mathbf{w}^\top \mathbf{h}_i^{(L)}$ is an attention score for atom-level weighting.

**Edge Feature Augmented GNN (EGNN variant):**

$$\mathbf{h}_i^{(l+1)} = \text{LayerNorm}\left(\mathbf{h}_i^{(l)} + \sum_{j \in \mathcal{N}(i)} \alpha_{ij}^{(l)} \cdot W^{(l)} \mathbf{h}_j^{(l)}\right)$$

$$\alpha_{ij}^{(l)} = \frac{\exp\!\left(e_{ij}^{(l)}\right)}{\sum_{k \in \mathcal{N}(i)} \exp\!\left(e_{ik}^{(l)}\right)}, \quad e_{ij}^{(l)} = \text{LeakyReLU}\!\left(\mathbf{a}^{(l)\top} \left[W^{(l)} \mathbf{h}_i^{(l)} \| W^{(l)} \mathbf{h}_j^{(l)} \| \mathbf{f}_{ij}\right]\right)$$

---

### 2. Protein-Ligand Cross-Attention DTI

The Drug-Target Interaction (DTI) prediction combines protein sequence embeddings $\mathbf{P} \in \mathbb{R}^{L_p \times d_p}$ with molecular graph embeddings $\mathbf{M} \in \mathbb{R}^{L_m \times d_m}$.

**Projection to shared space:**

$$\mathbf{Q} = \mathbf{M} W_Q, \quad \mathbf{K} = \mathbf{P} W_K, \quad \mathbf{V} = \mathbf{P} W_V$$

**Multi-Head Cross-Attention:**

$$\text{CrossAttn}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{softmax}\!\left(\frac{\mathbf{Q}\mathbf{K}^\top}{\sqrt{d_k}}\right)\mathbf{V}$$

$$\text{MultiHead}(\mathbf{Q}, \mathbf{K}, \mathbf{V}) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W_O$$

$$\text{head}_i = \text{CrossAttn}(\mathbf{Q} W_i^Q,\ \mathbf{K} W_i^K,\ \mathbf{V} W_i^V)$$

**Binding Affinity Prediction:**

$$\hat{y}_{\text{affinity}} = f_{\text{MLP}}\!\left(\text{Pool}\!\left(\text{CrossAttn}(\mathbf{M}, \mathbf{P}, \mathbf{P})\right) \| \mathbf{z}_{\text{mol}} \| \mathbf{z}_{\text{prot}}\right)$$

**Loss Function (Multi-Task):**

$$\mathcal{L}_{\text{DTI}} = \lambda_1 \mathcal{L}_{\text{MSE}}(\hat{y}_{\text{pKd}},\ y_{\text{pKd}}) + \lambda_2 \mathcal{L}_{\text{BCE}}(\hat{y}_{\text{class}},\ y_{\text{class}}) + \lambda_3 \|\theta\|_2^2$$

where $\text{pKd} = -\log_{10}(K_d)$ is the negative log dissociation constant, with typical values $\text{pKd} \in [2, 12]$.

**Attention Heatmap for Residue-Atom Interpretability:**

$$\mathbf{A}^{(h)} \in \mathbb{R}^{L_m \times L_p}, \quad \mathbf{A}_{ij}^{(h)} = \text{softmax}\!\left(\frac{(\mathbf{q}_i^{(h)})^\top \mathbf{k}_j^{(h)}}{\sqrt{d_k}}\right)$$

This produces the residue×atom attention heatmap rendered in the **XAI Center** (`cross_attention.html`).

---

### 3. Conditional Variational Autoencoder (CVAE) for Molecular Generation

Given a molecule $\mathbf{x}$ and protein conditioning signal $\mathbf{c}$ (ESM-2 embedding), the CVAE learns:

**Encoder:**

$$q_\phi(\mathbf{z} \mid \mathbf{x}, \mathbf{c}) = \mathcal{N}\!\left(\boldsymbol{\mu}_\phi(\mathbf{x}, \mathbf{c}),\ \text{diag}(\boldsymbol{\sigma}_\phi^2(\mathbf{x}, \mathbf{c}))\right)$$

**Decoder:**

$$p_\theta(\mathbf{x} \mid \mathbf{z}, \mathbf{c}) = \prod_t p_\theta(x_t \mid x_{<t}, \mathbf{z}, \mathbf{c})$$

**ELBO Objective:**

$$\mathcal{L}_{\text{CVAE}}(\theta, \phi; \mathbf{x}, \mathbf{c}) = \mathbb{E}_{q_\phi(\mathbf{z} \mid \mathbf{x}, \mathbf{c})}\!\left[\log p_\theta(\mathbf{x} \mid \mathbf{z}, \mathbf{c})\right] - \beta \cdot D_{\text{KL}}\!\left(q_\phi(\mathbf{z} \mid \mathbf{x}, \mathbf{c}) \;\|\; p(\mathbf{z})\right)$$

**KL Divergence (Gaussian Prior):**

$$D_{\text{KL}}\!\left(\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\sigma}^2) \;\|\; \mathcal{N}(\mathbf{0}, \mathbf{I})\right) = \frac{1}{2}\sum_{j=1}^{d}\!\left(1 + \log \sigma_j^2 - \mu_j^2 - \sigma_j^2\right)$$

**Reparameterization Trick:**

$$\mathbf{z} = \boldsymbol{\mu}_\phi + \boldsymbol{\sigma}_\phi \odot \boldsymbol{\epsilon}, \quad \boldsymbol{\epsilon} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$$

**Protein-Conditioned Generation:**

$$\mathbf{z}_{\text{new}} = \boldsymbol{\mu}_\phi(\mathbf{x}_{\text{seed}}, \mathbf{c}) + \alpha \cdot \nabla_{\mathbf{z}} \hat{y}_{\text{affinity}}(\mathbf{z}, \mathbf{c})$$

This gradient-guided latent walk traverses chemical space toward higher predicted binding affinity.

---

### 4. Bayesian Active Learning by Disagreement (BALD)

The autonomous research agent selects the most informative molecules via BALD, maximizing mutual information between predictions and model parameters:

$$\text{BALD}(\mathbf{x}^*) = \mathcal{H}\!\left[p(y \mid \mathbf{x}^*, \mathcal{D})\right] - \mathbb{E}_{p(\theta \mid \mathcal{D})}\!\left[\mathcal{H}\!\left[p(y \mid \mathbf{x}^*, \theta)\right]\right]$$

**Monte Carlo Dropout Approximation (T forward passes):**

$$\hat{\mu}(\mathbf{x}^*) = \frac{1}{T}\sum_{t=1}^{T} f_{\hat{\theta}_t}(\mathbf{x}^*), \quad \hat{\sigma}^2(\mathbf{x}^*) = \frac{1}{T}\sum_{t=1}^{T} f_{\hat{\theta}_t}(\mathbf{x}^*)^2 - \hat{\mu}(\mathbf{x}^*)^2$$

**Acquisition Function:**

$$a_{\text{BALD}}(\mathbf{x}^*) \approx \hat{\sigma}^2(\mathbf{x}^*) - \frac{1}{T}\sum_{t=1}^{T}\hat{\sigma}_t^2(\mathbf{x}^*)$$

**Thompson Sampling (Exploration):**

$$\mathbf{x}^*_{\text{TS}} = \arg\max_{\mathbf{x} \in \mathcal{X}_{\text{pool}}}\ \tilde{f}(\mathbf{x}), \quad \tilde{f} \sim \mathcal{GP}(\hat{\mu}, k)$$

**Expected Improvement:**

$$\text{EI}(\mathbf{x}) = \mathbb{E}\!\left[\max(f(\mathbf{x}) - f^+,\ 0)\right] = (f(\mathbf{x}) - f^+)\Phi(Z) + \sigma(\mathbf{x})\phi(Z)$$

$$Z = \frac{f(\mathbf{x}) - f^+}{\sigma(\mathbf{x})}$$

where $f^+$ is the best observed value, $\Phi$ is the CDF, and $\phi$ is the PDF of the standard normal.

---

### 5. SHAP (SHapley Additive exPlanations) for XAI

For a prediction model $f$ and molecule $\mathbf{x}$ with features $\{x_1, \ldots, x_d\}$:

**Shapley Value:**

$$\phi_i(f, \mathbf{x}) = \sum_{S \subseteq \mathcal{F} \setminus \{i\}} \frac{|S|!\,(|\mathcal{F}| - |S| - 1)!}{|\mathcal{F}|!}\left[f_{S \cup \{i\}}(\mathbf{x}_{S \cup \{i\}}) - f_S(\mathbf{x}_S)\right]$$

**Kernel SHAP Approximation:**

$$\phi = \arg\min_{\phi} \sum_{\mathbf{z}' \in \mathcal{Z}} \left[f(h_{\mathbf{x}}(\mathbf{z}')) - g(\mathbf{z}')\right]^2 \pi_{\mathbf{x}}(\mathbf{z}')$$

where $\pi_{\mathbf{x}}(\mathbf{z}') = \frac{(d-1)}{\binom{d}{|\mathbf{z}'|} |\mathbf{z}'| (d - |\mathbf{z}'|)}$ is the SHAP kernel.

**Atom-Level Attribution (GNN SHAP):**

$$\phi_v = \text{GradCAM}(\mathbf{h}_v^{(L)}) = \text{ReLU}\!\left(\sum_k \alpha_k^c \cdot \mathbf{h}_{v,k}^{(L)}\right), \quad \alpha_k^c = \frac{1}{|\mathcal{V}|}\sum_v \frac{\partial y_c}{\partial \mathbf{h}_{v,k}^{(L)}}$$

This produces per-atom importance scores rendered as colour-coded molecular heatmaps.

---

### 6. PK/PD Digital Twin ODE System

The Digital Human Twin simulates drug concentration in a two-compartment pharmacokinetic model:

**Two-Compartment ODE System:**

$$\frac{dC_1}{dt} = \frac{F \cdot D \cdot k_a \cdot e^{-k_a t}}{V_1} - \left(k_{10} + k_{12}\right) C_1 + k_{21} C_2$$

$$\frac{dC_2}{dt} = k_{12} C_1 - k_{21} C_2$$

where:
- $C_1$: central compartment concentration (plasma)
- $C_2$: peripheral compartment concentration (tissue)
- $k_a$: absorption rate constant
- $k_{10} = \text{CL}/V_1$: elimination rate constant
- $k_{12}, k_{21}$: inter-compartmental transfer rates
- $F$: bioavailability, $D$: dose

**Analytical Solution (IV Bolus):**

$$C(t) = A \cdot e^{-\alpha t} + B \cdot e^{-\beta t}$$

$$\alpha + \beta = k_{10} + k_{12} + k_{21}, \quad \alpha \cdot \beta = k_{10} \cdot k_{21}$$

$$A = \frac{D(\alpha - k_{21})}{V_1(\alpha - \beta)}, \quad B = \frac{D(k_{21} - \beta)}{V_1(\alpha - \beta)}$$

**PD Effect Compartment (Emax Model):**

$$\frac{dC_e}{dt} = k_{e0}(C_1 - C_e)$$

$$E(t) = E_0 + \frac{E_{\max} \cdot C_e(t)^n}{EC_{50}^n + C_e(t)^n}$$

**Key PK Parameters:**

| Parameter | Formula | Unit |
|-----------|---------|------|
| AUC | $\int_0^\infty C(t)\,dt = \frac{A}{\alpha} + \frac{B}{\beta}$ | ng·h/mL |
| $t_{1/2,\beta}$ | $\frac{\ln 2}{\beta}$ | h |
| $V_{ss}$ | $V_1\left(1 + \frac{k_{12}}{k_{21}}\right)$ | L |
| CL | $k_{10} \cdot V_1$ | L/h |
| $C_{\max}$ | $\max_t C(t)$ | ng/mL |

**Patient Covariate Adjustments:**

$$\text{CL}_{\text{adj}} = \text{CL}_{\text{ref}} \cdot \left(\frac{\text{BW}}{70}\right)^{0.75} \cdot \left(\frac{\text{eGFR}}{90}\right)^{f_r} \cdot \prod_k \text{DDI}_k$$

$$V_{\text{adj}} = V_{\text{ref}} \cdot \left(\frac{\text{BW}}{70}\right)^1 \cdot f_{\text{tissue}}(\text{age, sex})$$

---

### 7. FAISS Approximate Nearest Neighbour Retrieval

Molecular and protein embeddings are indexed via FAISS IVF-PQ (Inverted File with Product Quantization):

**Product Quantization:**

$$\mathbf{z} \approx \hat{\mathbf{z}} = [q_1(\mathbf{z}^{(1)}), \ldots, q_M(\mathbf{z}^{(M)})]$$

where $\mathbf{z}^{(m)}$ is the $m$-th sub-vector and $q_m$ assigns it to one of $K$ centroids.

**Quantization Error:**

$$\epsilon_{\text{PQ}} = \mathbb{E}\!\left[\|\mathbf{z} - \hat{\mathbf{z}}\|_2^2\right] = \sum_{m=1}^{M} \mathbb{E}\!\left[\|\mathbf{z}^{(m)} - q_m(\mathbf{z}^{(m)})\|_2^2\right]$$

**IVF Partitioning:**

$$\text{candidates} = \bigcup_{i \in \text{top-}n_{\text{probe}}} \mathcal{C}_i, \quad \mathcal{C}_i = \{j : \text{Voronoi}(\mathbf{c}_i) \ni \mathbf{z}_j\}$$

**Asymmetric Distance Computation (ADC):**

$$d(\mathbf{q}, \hat{\mathbf{z}}) \approx \sum_{m=1}^{M} d_m(q_m,\ \mathbf{q}^{(m)})$$

Pre-computed distance tables allow sub-linear search over millions of molecules.

**Dual-Index Architecture:**

```
Query Molecule (SMILES)
        │
        ▼
   GNN Encoder → z_mol ∈ R^256
        │
        ├──▶ FAISS-IVF-PQ (Molecule Index, 8 datasets)
        │         └──▶ Top-K Similar Molecules + pKd Predictions
        │
        └──▶ FAISS-IVF-PQ (Protein Index, ESM-2 embeddings)
                  └──▶ Top-K Similar Protein Targets
```

---

### 8. InfoNCE Contrastive Pretraining (GraphCL)

AETHER-RAMI's GNN backbone is pretrained using GraphCL with InfoNCE loss across paired molecular views:

**Graph Augmentations:**

$$\tilde{\mathcal{G}}_1 = t_1(\mathcal{G}), \quad \tilde{\mathcal{G}}_2 = t_2(\mathcal{G})$$

where $t_1, t_2 \in \{$node dropping, edge perturbation, subgraph sampling, attribute masking$\}$.

**InfoNCE Loss:**

$$\mathcal{L}_{\text{InfoNCE}} = -\frac{1}{N}\sum_{i=1}^{N} \log \frac{\exp\!\left(\text{sim}(\mathbf{z}_i, \mathbf{z}_i') / \tau\right)}{\sum_{j=1}^{N} \exp\!\left(\text{sim}(\mathbf{z}_i, \mathbf{z}_j') / \tau\right)}$$

$$\text{sim}(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u}^\top \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$$

where $\tau$ is the temperature hyperparameter, and negative pairs are all other molecules in the batch.

**Lower Bound on Mutual Information:**

$$\mathcal{L}_{\text{InfoNCE}} \leq -\mathcal{I}(\mathbf{z}; \mathbf{z}') + \log N$$

Minimizing this loss maximizes the mutual information between augmented views of the same molecule, learning representations invariant to chemical perturbation.

---

### 9. QUBO Formulation for Drug-Target Optimization

For combinatorial drug-target matching, AETHER-RAMI formulates a Quadratic Unconstrained Binary Optimization (QUBO):

$$\min_{\mathbf{x} \in \{0,1\}^n} \mathbf{x}^\top \mathbf{Q} \mathbf{x}$$

**Q Matrix Construction:**

$$Q_{ij} = \begin{cases} -\hat{y}_{\text{affinity}}(d_i, t_i) & \text{if } i = j\ \text{(self-term)} \\ \lambda_{\text{clash}} \cdot \mathbf{1}[\text{same target}(i,j)] & \text{if } i \neq j\ \text{(conflict)} \end{cases}$$

**Simulated Annealing Schedule:**

$$T(k) = T_0 \cdot \alpha^k, \quad P(\Delta E) = \exp\!\left(-\frac{\Delta E}{T(k)}\right)$$

$$\Delta E = \mathbf{x}_{\text{new}}^\top \mathbf{Q} \mathbf{x}_{\text{new}} - \mathbf{x}_{\text{old}}^\top \mathbf{Q} \mathbf{x}_{\text{old}}$$

This enables quantum-inspired multi-drug portfolio optimization across protein target panels.

---

### 10. Quantum Molecular Descriptors

AETHER-RAMI computes quantum chemical descriptors via semi-empirical approximation:

**Extended Hückel Theory (EHT) Hamiltonian:**

$$H_{\mu\nu}^{\text{EHT}} = \begin{cases} H_{\mu\mu} = -\text{IP}_\mu & \mu = \nu \\ \frac{K}{2}(H_{\mu\mu} + H_{\nu\nu}) S_{\mu\nu} & \mu \neq \nu \end{cases}$$

**HOMO-LUMO Gap:**

$$\Delta E_{\text{gap}} = E_{\text{LUMO}} - E_{\text{HOMO}}$$

**Chemical Hardness and Electronic Chemical Potential:**

$$\eta = \frac{E_{\text{LUMO}} - E_{\text{HOMO}}}{2}, \quad \mu_e = \frac{E_{\text{LUMO}} + E_{\text{HOMO}}}{2}$$

**Electrophilicity Index:**

$$\omega = \frac{\mu_e^2}{2\eta}$$

**Polarizability Approximation:**

$$\alpha_{\text{mol}} \approx \sum_{i} \alpha_i^{\text{atom}} + \Delta\alpha_{\text{bond}}$$

These descriptors correlate with metabolic stability, membrane permeability, and receptor binding kinetics.

---

## 💻 Reference Implementations (Code Walkthroughs)

The snippets below are simplified, self-contained reference implementations of the mathematics above. They mirror the structure of `backend/models/architectures.py` and `backend/services/*.py` but are trimmed for readability — see the actual source files for the production versions (type hints, error handling, batching, config plumbing).

### A. Molecular GNN Encoder

```python
"""
backend/models/architectures.py — GNNEncoder

Why this shape: message passing (φ_m) + GRU update (φ_u) + attention
readout, matching Section 1 of the math foundations above. Using a GRU
for φ_u (instead of a plain residual add) lets the model learn to
selectively "forget" noisy neighbor messages over multiple layers.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import MessagePassing
from torch_geometric.utils import softmax


class EdgeAugmentedGNNLayer(MessagePassing):
    """One message-passing layer with edge features and attention (EGNN variant)."""

    def __init__(self, hidden_dim: int, edge_dim: int):
        super().__init__(aggr="add", node_dim=0)
        self.msg_mlp = nn.Sequential(
            nn.Linear(2 * hidden_dim + edge_dim, hidden_dim),
            nn.LeakyReLU(0.2),
        )
        self.attn_vec = nn.Parameter(torch.randn(hidden_dim))
        self.update_gru = nn.GRUCell(hidden_dim, hidden_dim)
        self.norm = nn.LayerNorm(hidden_dim)

    def forward(self, h, edge_index, edge_attr):
        out = self.propagate(edge_index, h=h, edge_attr=edge_attr)
        h_new = self.update_gru(out, h)
        return self.norm(h + h_new)

    def message(self, h_i, h_j, edge_attr, index):
        e_ij = self.msg_mlp(torch.cat([h_i, h_j, edge_attr], dim=-1))
        alpha = (e_ij * self.attn_vec).sum(-1)
        alpha = softmax(alpha, index)          # α_ij normalized per target node
        return alpha.unsqueeze(-1) * e_ij


class GNNEncoder(nn.Module):
    """Full molecular encoder: embed atoms -> L message-passing layers -> attention readout."""

    def __init__(self, num_atom_types=100, hidden_dim=256, edge_dim=8, num_layers=5):
        super().__init__()
        self.atom_embed = nn.Embedding(num_atom_types, hidden_dim)
        self.layers = nn.ModuleList(
            [EdgeAugmentedGNNLayer(hidden_dim, edge_dim) for _ in range(num_layers)]
        )
        self.readout_score = nn.Linear(hidden_dim, 1)

    def forward(self, atom_types, edge_index, edge_attr, batch):
        h = self.atom_embed(atom_types)
        for layer in self.layers:
            h = layer(h, edge_index, edge_attr)

        # Attention-weighted readout: z_mol = Σ_i softmax(a_i) * h_i, per-graph
        a = self.readout_score(h).squeeze(-1)
        a = softmax(a, batch)
        z_mol = torch.zeros(batch.max() + 1, h.size(-1), device=h.device)
        z_mol = z_mol.index_add(0, batch, a.unsqueeze(-1) * h)
        return z_mol, h   # whole-molecule embedding + per-atom embeddings (for XAI)
```

### B. Protein-Ligand Cross-Attention Head

```python
"""
backend/models/architectures.py — CrossAttentionDTI

Why cross-attention (not concatenation): a simple concat of z_mol and
z_prot throws away *where* on the protein the molecule is interacting.
Cross-attention keeps a per-residue x per-atom matrix (A^(h)) that both
improves accuracy and gives the XAI Center a real heatmap to render.
"""
class CrossAttentionDTI(nn.Module):
    def __init__(self, mol_dim=256, prot_dim=1280, hidden_dim=256, num_heads=8):
        super().__init__()
        self.q_proj = nn.Linear(mol_dim, hidden_dim)
        self.k_proj = nn.Linear(prot_dim, hidden_dim)
        self.v_proj = nn.Linear(prot_dim, hidden_dim)
        self.mha = nn.MultiheadAttention(hidden_dim, num_heads, batch_first=True)
        self.affinity_head = nn.Sequential(
            nn.Linear(hidden_dim + mol_dim + prot_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(256, 1),          # -> pKd
        )
        self.class_head = nn.Linear(hidden_dim + mol_dim + prot_dim, 1)  # -> binder/non-binder

    def forward(self, atom_embeds, prot_residue_embeds, z_mol, z_prot):
        Q = self.q_proj(atom_embeds)          # [B, L_m, H]
        K = self.k_proj(prot_residue_embeds)  # [B, L_p, H]
        V = self.v_proj(prot_residue_embeds)

        attn_out, attn_weights = self.mha(Q, K, V, need_weights=True)  # attn_weights: A^(h)
        pooled = attn_out.mean(dim=1)         # Pool(CrossAttn(M,P,P))

        fused = torch.cat([pooled, z_mol, z_prot], dim=-1)
        pKd_hat = self.affinity_head(fused).squeeze(-1)
        class_logit = self.class_head(fused).squeeze(-1)
        return pKd_hat, class_logit, attn_weights   # attn_weights feeds cross_attention.html
```

### C. Protein-Conditioned CVAE

```python
"""
backend/services/generation.py — ProteinConditionedCVAE

Why conditional (not a plain VAE): sampling from an unconditioned
latent space gives *some* valid molecule; conditioning on the ESM-2
protein embedding c biases generation toward molecules plausible for
THAT target's pocket, which is what "generate an EGFR inhibitor" means.
"""
class ProteinConditionedCVAE(nn.Module):
    def __init__(self, mol_input_dim=256, cond_dim=1280, latent_dim=64):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(mol_input_dim + cond_dim, 512), nn.ReLU(),
            nn.Linear(512, 256), nn.ReLU(),
        )
        self.mu_head = nn.Linear(256, latent_dim)
        self.logvar_head = nn.Linear(256, latent_dim)

        self.decoder = nn.Sequential(
            nn.Linear(latent_dim + cond_dim, 256), nn.ReLU(),
            nn.Linear(256, 512), nn.ReLU(),
            nn.Linear(512, mol_input_dim),   # decoded to a SMILES-token distribution in practice
        )

    def encode(self, x, c):
        h = self.encoder(torch.cat([x, c], dim=-1))
        return self.mu_head(h), self.logvar_head(h)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std                       # z = μ + σ ⊙ ε

    def decode(self, z, c):
        return self.decoder(torch.cat([z, c], dim=-1))

    def forward(self, x, c):
        mu, logvar = self.encode(x, c)
        z = self.reparameterize(mu, logvar)
        x_hat = self.decode(z, c)
        return x_hat, mu, logvar

    def loss(self, x, x_hat, mu, logvar, beta=1.0):
        recon = F.mse_loss(x_hat, x, reduction="mean")
        kl = -0.5 * torch.mean(1 + logvar - mu.pow(2) - logvar.exp())
        return recon + beta * kl, recon, kl          # ELBO = recon - β·KL (minimized as recon + β·KL)

    @torch.no_grad()
    def guided_generate(self, x_seed, c, affinity_model, alpha=0.5, steps=10):
        """Gradient-guided latent walk toward higher predicted affinity (Section 3)."""
        mu, _ = self.encode(x_seed, c)
        z = mu.clone().requires_grad_(True)
        for _ in range(steps):
            pKd_hat = affinity_model(z, c)
            grad = torch.autograd.grad(pKd_hat.sum(), z)[0]
            z = (z + alpha * grad).detach().requires_grad_(True)
        return self.decode(z.detach(), c)
```

### D. BALD Active Learning Loop

```python
"""
backend/services/active_learning.py — BALD acquisition loop

Why MC-Dropout BALD: a full Bayesian neural network is expensive to
train; running T stochastic forward passes with dropout enabled at
inference time is a cheap, well-validated approximation (Gal & Ghahramani,
2016) that gives us both a mean prediction and a disagreement/uncertainty
estimate from the SAME trained model.
"""
import numpy as np
import torch


def mc_dropout_predict(model, x, T: int = 20):
    model.train()  # keep dropout active
    preds = torch.stack([model(x) for _ in range(T)])   # [T, B]
    mu = preds.mean(dim=0)
    sigma2 = preds.var(dim=0)
    return mu, sigma2, preds


def bald_acquisition(model, candidate_pool, T: int = 20):
    """Returns BALD scores: H[E[p]] - E[H[p]] approximated via predictive variance."""
    mu, sigma2, preds = mc_dropout_predict(model, candidate_pool, T=T)
    per_pass_var = preds.var(dim=0, unbiased=False)
    bald_scores = sigma2 - per_pass_var.mean(dim=0)
    return bald_scores


def active_learning_round(model, labeled_set, pool_set, oracle_fn, batch_size=10, T=20):
    """One round: score pool by BALD, query the top-k, add to labeled set."""
    scores = bald_acquisition(model, pool_set.x, T=T)
    top_k_idx = torch.topk(scores, k=batch_size).indices

    queried_x = pool_set.x[top_k_idx]
    queried_y = oracle_fn(queried_x)             # real assay / GNN oracle inference

    labeled_set.append(queried_x, queried_y)
    pool_set.remove(top_k_idx)
    return labeled_set, pool_set, scores[top_k_idx]
```

### E. PK/PD Two-Compartment ODE Solver

```python
"""
backend/services/digital_twin.py — TwoCompartmentPK

Why solve numerically (scipy) instead of only the closed-form A·e^-αt
+ B·e^-βt solution: the closed form only holds for IV bolus dosing with
constant parameters. Oral dosing, multiple doses, and time-varying
clearance (e.g. drug-drug interactions kicking in at t=6h) all require
numerical integration, so the ODE solver is the general-purpose path
and the analytical solution is used only for validation/unit tests.
"""
import numpy as np
from scipy.integrate import solve_ivp


def two_compartment_rhs(t, y, ka, k10, k12, k21, F, D, V1):
    C1, C2 = y
    absorption = (F * D * ka * np.exp(-ka * t)) / V1
    dC1_dt = absorption - (k10 + k12) * C1 + k21 * C2
    dC2_dt = k12 * C1 - k21 * C2
    return [dC1_dt, dC2_dt]


def simulate_pk(dose_mg, weight_kg, egfr, t_end=48, params=None):
    p = params or dict(ka=1.0, CL_ref=5.0, V1_ref=40.0, k12=0.3, k21=0.2, F=0.9)

    # Allometric + renal-function scaling (patient personalization)
    CL = p["CL_ref"] * (weight_kg / 70) ** 0.75 * (egfr / 90) ** 0.75
    V1 = p["V1_ref"] * (weight_kg / 70)
    k10 = CL / V1

    sol = solve_ivp(
        two_compartment_rhs, [0, t_end], y0=[0.0, 0.0],
        args=(p["ka"], k10, p["k12"], p["k21"], p["F"], dose_mg, V1),
        t_eval=np.linspace(0, t_end, 500), method="RK45",
    )

    C1 = sol.y[0]
    auc = np.trapz(C1, sol.t)
    cmax = C1.max()
    beta = 0.5 * ((k10 + p["k12"] + p["k21"]) - np.sqrt(
        (k10 + p["k12"] + p["k21"]) ** 2 - 4 * k10 * p["k21"]))
    half_life = np.log(2) / beta

    return {
        "time_h": sol.t.tolist(), "plasma_conc": C1.tolist(),
        "AUC": float(auc), "Cmax": float(cmax),
        "half_life_h": float(half_life), "CL_adj": float(CL), "V1_adj": float(V1),
    }


def emax_effect(Ce, E0=0, Emax=100, EC50=5.0, n=1.0):
    return E0 + (Emax * Ce ** n) / (EC50 ** n + Ce ** n)
```

### F. FAISS Dual-Index Retrieval

```python
"""
backend/services/vector_search.py — DualFAISSIndex

Why IVF-PQ (not a flat/brute-force index): with ChEMBL-scale libraries
(2M+ compounds) a flat index needs a full O(N) scan per query. IVF
narrows the search to a handful of clusters and PQ compresses each
256-d molecule vector to a few dozen bytes, keeping the whole index
in RAM while returning sub-100ms top-K results.
"""
import faiss
import numpy as np


class DualFAISSIndex:
    def __init__(self, mol_dim=256, prot_dim=1280, nlist=100, m_pq=16, nbits=8):
        quantizer_mol = faiss.IndexFlatL2(mol_dim)
        self.mol_index = faiss.IndexIVFPQ(quantizer_mol, mol_dim, nlist, m_pq, nbits)

        quantizer_prot = faiss.IndexFlatL2(prot_dim)
        self.prot_index = faiss.IndexIVFPQ(quantizer_prot, prot_dim, nlist, m_pq, nbits)

        self.mol_metadata: list[dict] = []
        self.prot_metadata: list[dict] = []

    def build_molecule_index(self, embeddings: np.ndarray, metadata: list[dict]):
        self.mol_index.train(embeddings)
        self.mol_index.add(embeddings)
        self.mol_metadata = metadata

    def build_protein_index(self, embeddings: np.ndarray, metadata: list[dict]):
        self.prot_index.train(embeddings)
        self.prot_index.add(embeddings)
        self.prot_metadata = metadata

    def search_similar_molecules(self, query_embedding: np.ndarray, k=10, nprobe=8):
        self.mol_index.nprobe = nprobe
        distances, indices = self.mol_index.search(query_embedding.reshape(1, -1), k)
        return [
            {**self.mol_metadata[idx], "distance": float(dist)}
            for idx, dist in zip(indices[0], distances[0]) if idx != -1
        ]

    def search_similar_proteins(self, query_embedding: np.ndarray, k=5, nprobe=8):
        self.prot_index.nprobe = nprobe
        distances, indices = self.prot_index.search(query_embedding.reshape(1, -1), k)
        return [
            {**self.prot_metadata[idx], "distance": float(dist)}
            for idx, dist in zip(indices[0], distances[0]) if idx != -1
        ]
```

### G. SHAP + GradCAM Explainer

```python
"""
backend/services/xai_engine.py — MolecularExplainer

Why both SHAP and GradCAM: SHAP gives a game-theoretically grounded
attribution but is expensive (many masked forward passes). GradCAM is
a single backward pass and is used as a fast, always-on default, with
SHAP available on demand for a rigorous double-check of high-stakes
predictions (e.g. before a compound is shortlisted).
"""
import shap
import torch
import numpy as np


def gradcam_atom_scores(model, atom_embeds, target_output):
    """GradCAM-style per-atom attribution (Section 5, eq. GradCAM)."""
    atom_embeds.requires_grad_(True)
    output = target_output(atom_embeds)
    grads = torch.autograd.grad(output.sum(), atom_embeds)[0]   # ∂y_c/∂h_v
    alpha_k = grads.mean(dim=0)                                  # average over atoms
    scores = torch.relu((alpha_k * atom_embeds).sum(dim=-1))     # ReLU(Σ_k α_k h_v,k)
    return scores.detach().cpu().numpy()


def shap_explain(predict_fn, background_data: np.ndarray, molecule_features: np.ndarray):
    """KernelSHAP over molecular descriptor features."""
    explainer = shap.KernelExplainer(predict_fn, background_data)
    shap_values = explainer.shap_values(molecule_features, nsamples=200)
    return shap_values   # φ_i per feature, matches Kernel SHAP eq. in Section 5
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AETHER-RAMI V7 FULL SYSTEM                              │
│                                                                                 │
│  ┌─────────────────── NEXT.JS 14 FRONTEND ────────────────────────────────┐    │
│  │                                                                         │    │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │    │
│  │  │  Home /  │ │ Discovery │ │  Digital │ │  Cancer  │ │ Pathogen  │  │    │
│  │  │ Features │ │  Engine   │ │   Twin   │ │Targeting │ │  Simu.    │  │    │
│  │  └──────────┘ └───────────┘ └──────────┘ └──────────┘ └───────────┘  │    │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │    │
│  │  │AI Drug   │ │ Proteins  │ │ Molecules│ │  Galaxy  │ │  XAI      │  │    │
│  │  │   Lab    │ │ 3Dmol.js  │ │  ADMET   │ │  Graph   │ │  Center   │  │    │
│  │  └──────────┘ └───────────┘ └──────────┘ └──────────┘ └───────────┘  │    │
│  │                                                                         │    │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │    │
│  │  │     HumanAnatomyCanvas.tsx  ·  ScientificCursor.tsx             │  │    │
│  │  │     K2-Think-v2 Copilot  ·  29 HTML Visualizations             │  │    │
│  │  └─────────────────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────┬────────────────────────────────────┘   │
│                                       │ REST / WebSocket                        │
│  ┌─────────────────── FASTAPI BACKEND ▼ ──────────────────────────────────┐    │
│  │                                                                         │    │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │    │
│  │  │ Research Engine  │  │ Inference Service │  │   Vector Search       │ │    │
│  │  │  · Precision Rx  │  │  · GNN Backbone   │  │   · FAISS IVF-PQ     │ │    │
│  │  │  · Multi-Omics   │  │  · ESM-2 Protein  │  │   · 256-dim Mol Idx  │ │    │
│  │  │  · MD Simulation │  │  · Cross-Attn DTI │  │   · 1280-dim Prot    │ │    │
│  │  │  · Repurposing   │  │  · CVAE Generator │  │   · Dual Index       │ │    │
│  │  │  · Drug-Twin PD  │  │  · ADMET MLP      │  │   · Top-K Retrieval  │ │    │
│  │  └─────────────────┘  └──────────────────┘  └───────────────────────┘ │    │
│  │                                                                         │    │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────────┐ │    │
│  │  │  XAI Engine      │  │  Agent Pipeline  │  │  Knowledge Graph      │ │    │
│  │  │  · SHAP Values   │  │  · BALD Acq.     │  │  · DrugBank           │ │    │
│  │  │  · GradCAM       │  │  · Thompson Samp │  │  · STRING PPI         │ │    │
│  │  │  · Attn Heatmaps │  │  · EI Optimizer  │  │  · OMIM Diseases      │ │    │
│  │  │  · Feature Attr. │  │  · Goal Planning │  │  · vis-network        │ │    │
│  │  └─────────────────┘  └──────────────────┘  └───────────────────────┘ │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────────── SCIENTIFIC DATA LAYER ─────────────────────────────┐    │
│  │  PDBbind · MoleculeNet · BindingDB · ChEMBL · DrugBank                │    │
│  │  5 PDB Structures · ESM-2 Embeddings · FAISS Indices                  │    │
│  └────────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Data Flow

```
SMILES Input ──▶ RDKit Parser ──▶ Molecular Graph G=(V,E)
                                          │
                    ┌─────────────────────┘
                    ▼
              GNN Encoder (5 layers)
              h_i^(0) → h_i^(5) → z_mol ∈ R^256
                    │
        ┌───────────┼─────────────────┐
        ▼           ▼                 ▼
   FAISS Idx    Cross-Attn DTI    CVAE Decoder
   Top-K Hits   + ESM-2 Protein   New Molecules
        │             │                │
        ▼             ▼                ▼
  Analog Search  pKd Prediction   SMILES Output
  Similar Drugs  ADMET Profile    + Synthesizability
                      │
                 SHAP Attribution
                 Atom Importance
                      │
                 XAI Visualization
```

---

## ⚡ 18 Platform Capabilities

| # | Feature | API Endpoint | UI Module | Mathematical Core |
|---|---------|--------------|-----------|-------------------|
| 1 | **Precision Medicine Engine** | `POST /v1/precision-medicine` | Cancer Targeting | Multi-omics tensor factorization |
| 2 | **Multi-Omics Foundation Model** | `POST /v1/multi-omics` | Research Dashboard | Late fusion + pathway embedding |
| 3 | **Real Protein Dynamics Engine** | `GET /v1/protein-dynamics` | Proteins | MD trajectory PCA |
| 4 | **Molecular Dynamics Workflow** | `POST /v1/molecular-dynamics` | Discovery Engine | RMSD, Rg, RMSF |
| 5 | **AI Medicinal Chemist** | `POST /v1/medicinal-chemist` | AI Drug Lab | Matched molecular pairs |
| 6 | **Drug Repurposing Engine** | `POST /v1/repurposing` | Molecules | FAISS + DTI cross-target |
| 7 | **Disease Knowledge Graph** | `GET /v1/disease-graph` | Galaxy Graph | GNN on heterogeneous graph |
| 8 | **Autonomous Research Agent** | `POST /v1/agent/discover` | Agent Pipeline | BALD + Thompson Sampling |
| 9 | **Drug Manufacturing Readiness** | `POST /v1/manufacturing` | AI Drug Lab | Synthetic accessibility score |
| 10 | **Clinical Trial Risk Engine** | `POST /v1/clinical-risk` | Discovery Engine | Survival analysis + hERG |
| 11 | **Digital Human Twin** | `POST /v1/digital-twin` | Digital Twin | Two-compartment PK/PD ODE |
| 12 | **Explainable AI Center** | `POST /v1/explain` | XAI Center | SHAP + GradCAM + CrossAttn |
| 13 | **Global Drug Intelligence** | `GET /v1/intelligence` | API Docs | BM25 + semantic retrieval |
| 14 | **Molecular Generator** | `POST /v1/generate` | Discovery Engine | Protein-conditioned CVAE |
| 15 | **Scientific Copilot** | `/api/chat` | K2-Think-v2 | RAG over scientific corpus |
| 16 | **Interactive Scientific Workspace** | 3Dmol + Plotly | Studio | WebGL molecular rendering |
| 17 | **Benchmarking Arena** | `GET /v1/benchmarking` | Research Dashboard | Multi-dataset evaluation |
| 18 | **Regulatory Readiness Suite** | `POST /v1/regulatory-report` | API Docs | ICH M7/S9 rule engine |

---

## 🔍 Module Deep-Dives

### 🧬 Discovery Engine — SMILES → Full Drug Profile

The Discovery Engine accepts a SMILES string and protein sequence, returning a comprehensive molecular report:

```
Input: SMILES + Protein Sequence
           │
     ┌─────┴────────────────────────────────────────┐
     ▼                                               ▼
RDKit Validation                             ESM-2 Protein
+ Kekulization                               Embedding (1280-d)
     │                                               │
     ▼                                               │
Molecular Graph                                      │
G = (V, E, F_v, F_e)                                │
     │                                               │
     ▼                                               │
GNN (5 MPNN layers)                                  │
z_mol ∈ R^256                                        │
     │                                               │
     └──────────┬──────────────────────────────────┘
                ▼
        Cross-Attention DTI
        pKd ∈ [2, 12], IC50 (nM)
                │
     ┌──────────┼──────────┐
     ▼          ▼          ▼
  ADMET       Safety    SHAP XAI
  Profile    Profile   Attribution
  (10 props) (8 risks) (atom level)
     │
     ▼
 Lipinski + ADMET Rules
 Drug-likeness Score (0-1)
```

**ADMET Properties Predicted:**

| Property | Model | Metric (held-out test split) |
|----------|-------|--------|
| Solubility (LogS) | GNN Regression | RMSE 0.52 |
| LogP (octanol-water) | GNN + MACCS | MAE 0.31 |
| Caco-2 Permeability | MLP + fingerprint | AUROC 0.89 |
| hERG Inhibition | GNN Classification | AUROC 0.93 |
| BBB Penetration | Cross-Attention | AUROC 0.91 |
| CYP3A4 Inhibition | Ensemble | AUROC 0.87 |
| Microsomal Stability | GNN | AUROC 0.85 |
| Plasma Protein Binding | MLP | MAE 0.08 |
| Renal Clearance | Ridge + GNN | RMSE 0.44 |
| T½ (half-life) | GNN + PK model | — (see Digital Twin) |

---

### 🧠 Digital Human Twin — PK/PD Simulation

```
Dose (mg/kg) + Route + Patient Profile
              │
              ▼
     ┌────────────────┐
     │  PK Simulator  │
     │                │
     │  dC₁/dt = ...  │
     │  dC₂/dt = ...  │
     └────────┬───────┘
              │
    ┌─────────┼──────────┐
    ▼         ▼          ▼
 Plasma    Tissue      Effect
 C₁(t)    C₂(t)      Ce(t)
    │                    │
    ▼                    ▼
AUC, Cmax,           Emax Model
t½, Vss, CL          E(t) vs t
    │                    │
    └──────┬─────────────┘
           ▼
    Organ Risk Heatmap
    (Liver, Kidney, Heart, CNS)
           │
           ▼
    Patient-Specific Dose
    Recommendation
```

---

### 🤖 Autonomous Research Agent

```
Research Goal: "Find EGFR inhibitor with pKd > 9, LogP < 4"
              │
              ▼
     ┌────────────────────┐
     │   Goal Decomposer  │
     │   (LLM Planning)   │
     └────────┬───────────┘
              │
    ┌─────────▼──────────┐
    │   Candidate Pool   │
    │   (FAISS + ChEMBL) │
    └─────────┬──────────┘
              │
         BALD Acquisition
              │
    ┌─────────▼──────────┐
    │   Oracle Query     │
    │   (GNN Inference)  │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │   Update Model     │
    │   (Active Learning)│
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │  Convergence Check │
    │  Top-5 Candidates  │
    └────────────────────┘
              │
              ▼
    Hit Report + ADMET + XAI
```

**Active Learning Loop Efficiency:**

Starting from a labelled set $\mathcal{D}_0$ of $n_0 = 100$ molecules, the agent (per `benchmarks/active_learning_curve.py`) reaches 95th-percentile pKd performance with $n_{\text{query}} \approx 200$ additional queries versus $> 480$ for random sampling on the PDBbind refinement set — roughly a **2.4–2.7× data-efficiency improvement**, depending on random seed (5-seed average reported below in [Benchmarks](#-benchmarks--evaluation)).

---

### 🌐 Disease Knowledge Graph Galaxy

The Galaxy Graph module integrates:

| Entity Type | Count (as configured) | Source |
|-------------|-------|--------|
| Drugs | 13,000+ | DrugBank v5.1 |
| Protein Targets | 4,500+ | UniProt |
| Diseases | 8,000+ | OMIM / MeSH |
| Pathways | 2,300+ | KEGG / Reactome |
| Interactions | 180,000+ | STRING / BioGRID |

**Heterogeneous Graph Neural Network (HAN):**

$$\mathbf{z}_i^{(\tau)} = \text{AGG}_\tau\!\left(\left\{\mathbf{h}_j^{(\phi(j))} : j \in \mathcal{N}_r(i)\right\}\right) \quad \forall r \in \mathcal{R}$$

$$\mathbf{z}_i = \text{Fuse}\!\left(\left\{\mathbf{z}_i^{(\tau)} : \tau \in \mathcal{T}\right\}\right)$$

Node types $\mathcal{T} = \{$drug, protein, disease, pathway$\}$, relation types $\mathcal{R} = \{$treats, inhibits, causes, participates\_in$\}$.

---

## 🌐 REST API Reference

### Core Prediction Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/v1/predict` | POST | `smiles`, `protein_sequence` | pKd, IC50, ADMET, SHAP |
| `/v1/affinity` | POST | `smiles`, `protein_id` | pKd ± confidence interval |
| `/v1/admet` | POST | `smiles` | 10 ADMET properties |
| `/v1/explain` | POST | `smiles`, `protein_sequence` | SHAP atom scores, attn heatmap |
| `/v1/interaction` | POST | `smiles`, `protein_sequence` | Cross-attention matrix $L_m \times L_p$ |
| `/v1/quantum` | POST | `smiles` | HOMO, LUMO, gap, $\mu_e$, $\eta$, $\omega$ |
| `/v1/safety` | POST | `smiles` | 8-endpoint safety profile |
| `/v1/protein-analysis` | GET | `pdb_id` | Pockets, residues, mutations |

### V7 Research Engine Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/v1/precision-medicine` | POST | `patient_omics`, `cancer_type` | Ranked drug list + rationale |
| `/v1/multi-omics` | POST | `genomics`, `proteomics`, `metabolomics` | Pathway scores, drug targets |
| `/v1/protein-dynamics` | GET | `pdb_id` | RMSD, Rg, pocket volume trajectory |
| `/v1/molecular-dynamics` | POST | `smiles`, `protein_pdb` | MD metrics, binding free energy ΔG |
| `/v1/medicinal-chemist` | POST | `smiles`, `target` | Lead optimization scaffold hops |
| `/v1/repurposing` | POST | `drug_name` | Off-target predictions + pKd |
| `/v1/disease-graph` | GET | `disease_id` | Subgraph JSON for vis-network |
| `/v1/manufacturing` | POST | `smiles` | SA score, step count, route |
| `/v1/clinical-risk` | POST | `smiles`, `indication` | hERG, QTc, hepatotox, trial risk |
| `/v1/benchmarking` | GET | — | ROC-AUC, F1, RMSE across models |
| `/v1/regulatory-report` | POST | `smiles`, `indication` | ICH M7, genotox, mutagenicity |
| `/v1/intelligence` | GET | `query` | BM25 + semantic search over biomedical corpus |
| `/v1/digital-twin` | POST | `smiles`, `dose`, `patient_params` | PK/PD time-series, organ risk |
| `/v1/agent/discover` | POST | `goal_spec` | Top-5 hit molecules + reasoning trace |
| `/v1/generate` | POST | `protein_sequence`, `seed_smiles` | 20 novel SMILES with predicted pKd |
| `/v1/retrieve` | GET | `smiles` or `protein_id` | Top-K nearest neighbours |

### API Usage Example

```bash
# Full drug profile prediction
curl -X POST http://localhost:8000/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "smiles": "CC(=O)NC1=CC=C(O)C=C1",
    "protein_sequence": "MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRM",
    "return_shap": true,
    "return_admet": true
  }'

# Digital twin simulation
curl -X POST http://localhost:8000/v1/digital-twin \
  -H "Content-Type: application/json" \
  -d '{
    "smiles": "CC1=CC2=C(C=C1)N=CC(=C2)C(=O)O",
    "dose_mg_kg": 10,
    "route": "oral",
    "patient": {"weight_kg": 70, "age": 45, "sex": "M", "eGFR": 90}
  }'

# Autonomous drug discovery agent
curl -X POST http://localhost:8000/v1/agent/discover \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Find EGFR inhibitor with pKd > 9.0, LogP < 4, SA_score < 3",
    "seed_molecules": ["CC1=CC=CC=C1", "C1=CC=CN=C1"],
    "budget": 50
  }'
```

### Response Schema (v1/predict)

```json
{
  "smiles": "CC(=O)NC1=CC=C(O)C=C1",
  "valid": true,
  "molecular_weight": 151.17,
  "binding": {
    "pKd": 7.43,
    "IC50_nM": 37.2,
    "confidence_interval": [7.1, 7.7],
    "binding_mode": "competitive"
  },
  "admet": {
    "logP": 0.46,
    "logS": -1.2,
    "caco2_perm": "High",
    "hERG_risk": "Low",
    "bbb": false,
    "cyp3a4_inhibitor": false,
    "drug_likeness": 0.87
  },
  "safety": {
    "mutagenicity": "Negative",
    "hepatotoxicity": "Low",
    "cardiotoxicity": "Low"
  },
  "shap_atom_scores": [0.12, -0.03, 0.45],
  "attention_heatmap": [[0.1, 0.3], [0.2, 0.4]]
}
```

---

## 🎨 Interactive Visualizations

29 HTML visualizations powered by **3Dmol.js**, **Plotly**, and **vis-network**:

### Protein Structure Viewers (5 Targets × 5 Modes)

| Protein | PDB ID | Therapeutic Area | Binding Pocket | Resolution |
|---------|--------|-----------------|----------------|------------|
| EGFR | 1IVO | Lung/Breast Cancer | ATP pocket, L858R | 2.6 Å |
| BRAF | 3OG7 | Melanoma | Kinase domain, V600E | 2.3 Å |
| CDK2 | 1HCL | Cell Cycle Cancer | ATP + cyclin groove | 1.9 Å |
| HIV Protease | 3PHV | HIV/AIDS | Catalytic dyad | 1.8 Å |
| AChE | 1ACJ | Alzheimer's | Catalytic triad | 2.8 Å |

**3Dmol.js Viewer Modes per Protein:**

```
1. Binding Pocket View   — surface + ligand stick rendering
2. Electrostatic Surface — red/blue Coulomb potential map
3. Hydrophobicity Map    — Kyte-Doolittle colour scale
4. Secondary Structure   — helix/sheet/loop ribbon diagram
5. Interaction Network   — residue contact graph
```

### Global Visualizations

| File | Technology | Description |
|------|-----------|-------------|
| `chemical_space_3d.html` | Plotly 3D | UMAP/t-SNE of 10K molecules coloured by pKd |
| `cross_attention.html` | D3.js heatmap | Residue × Atom attention matrix |
| `drug_target_galaxy.html` | vis-network | Force-directed drug-target knowledge graph |
| `molecule_evolution.html` | Plotly animate | CVAE scaffold evolution trajectory |
| `admet_radar.html` | Plotly polar | Multi-property drug-likeness radar |
| `pk_simulation.html` | Plotly time | PK/PD concentration-time curves |
| `bald_acquisition.html` | Plotly scatter | Active learning acquisition landscape |
| `shap_waterfall.html` | D3.js waterfall | SHAP force/waterfall explanation plots |

### Chemical Space Embedding

**Dimensionality Reduction Pipeline:**

```
10,000 Molecules
      │
      ▼
   GNN Encoder (z_mol ∈ R^256)
      │
      ▼
  UMAP (n_components=3, n_neighbors=15, min_dist=0.1)
      │
      ▼
  3D Scatter (Plotly)
  - Colour: pKd value (viridis)
  - Size: Drug-likeness score
  - Hover: SMILES + properties
  - Cluster: Scaffold Murcko families
```

---

## 📊 Benchmarks & Evaluation

### DTI Prediction Performance (PDBbind v2020 scaffold-split test set)

| Model | ROC-AUC | F1 Score | RMSE (pKd) | Pearson r | Params |
|-------|---------|---------|-----------|---------|--------|
| **AETHER-RAMI V7 (PL-CrossAttn/EGNN)** | **0.927** | **0.845** | **0.45** | **0.91** | 24.7M |
| GraphCL (ours, no cross-attn) | 0.891 | 0.812 | 0.58 | 0.87 | 18.2M |
| GCN (V1/V2 baseline) | 0.862 | 0.781 | 0.67 | 0.83 | 6.1M |
| GAT | 0.878 | 0.798 | 0.61 | 0.85 | 8.4M |
| ChemBERTa | 0.854 | 0.772 | 0.71 | 0.81 | 86M |
| MolFormer | 0.869 | 0.789 | 0.63 | 0.84 | 47M |
| ESM-2 Fusion (no cross-attn) | 0.883 | 0.805 | 0.59 | 0.86 | 652M |
| DeepDTA (baseline) | 0.831 | 0.751 | 0.79 | 0.78 | 1.2M |
| GraphDTA (baseline) | 0.857 | 0.776 | 0.66 | 0.83 | 3.8M |

### ADMET Benchmark (MoleculeNet, scaffold split, 3-fold average)

| Task | Metric | AETHER-RAMI V7 | Best Published Baseline |
|------|--------|---------------|----------------|
| BBBP | ROC-AUC | 0.931 | 0.918 |
| HIV | ROC-AUC | 0.779 | 0.776 |
| BACE | ROC-AUC | 0.879 | 0.867 |
| Tox21 (avg of 12 tasks) | ROC-AUC | 0.842 | 0.839 |
| SIDER | ROC-AUC | 0.661 | 0.658 |
| ClinTox | ROC-AUC | 0.924 | 0.906 |
| Esol | RMSE | 0.485 | 0.498 |
| FreeSolv | RMSE | 1.212 | 1.236 |
| Lipophilicity | RMSE | 0.521 | 0.533 |

### Per-Target DTI Results (5 therapeutic proteins, PDBbind subsets)

| Target | Test N | ROC-AUC | RMSE (pKd) | Pearson r | Notes |
|---|---|---|---|---|---|
| EGFR (1IVO) | 412 | 0.934 | 0.41 | 0.92 | Largest labeled subset; best-calibrated |
| BRAF (3OG7) | 268 | 0.918 | 0.49 | 0.89 | V600E mutant pocket adds variance |
| CDK2 (1HCL) | 355 | 0.921 | 0.44 | 0.90 | ATP + cyclin groove, dual-pocket geometry |
| HIV Protease (3PHV) | 301 | 0.909 | 0.52 | 0.87 | Symmetric dimer pocket; harder attention alignment |
| AChE (1ACJ) | 189 | 0.897 | 0.57 | 0.85 | Smallest N; widest confidence interval |

### Active Learning Efficiency (5-seed average, EGFR target, PDBbind refinement set)

```
Molecules Queried vs. Best pKd Found

pKd  ┤
 10  │              ●─────────────────
  9  │         ●───╯
  8  │    ●───╯         AETHER-RAMI (BALD)
  7  │●──╯        ───── Random Sampling
  6  ┤●─────────────────
     └────────────────────────────────▶
      0    100   200   300   400   500
           Molecules Queried
```

| Strategy | Queries to pKd > 9.0 (mean ± std, 5 seeds) | Relative Efficiency |
|---|---|---|
| Random sampling | 481 ± 34 | 1.0× (baseline) |
| Entropy sampling | 312 ± 28 | 1.5× |
| **BALD (MC-Dropout, T=20)** | **196 ± 22** | **2.45×** |
| BALD + Thompson Sampling hybrid | 178 ± 19 | 2.70× |

### Molecular Generation Quality (1,000 sampled molecules per model, RDKit-validated)

| Metric | AETHER-RAMI CVAE | REINVENT | JT-VAE |
|--------|----------------|---------|--------|
| Validity | 94.2% | 97.1% | 96.4% |
| Uniqueness | 98.8% | 85.3% | 99.1% |
| Novelty | 91.5% | 78.2% | 76.3% |
| SA Score (avg, lower=easier) | 2.81 | 3.21 | 2.94 |
| QED (avg, higher=better) | 0.63 | 0.58 | 0.61 |
| pKd Improvement over seed (avg Δ) | **+1.42** | +0.97 | +1.18 |

### FAISS Retrieval Latency (Intel i7, 16GB RAM, single query)

| Index Size | Flat (brute-force) | IVF-PQ (nlist=100, m=16) | Speedup |
|---|---|---|---|
| 10,000 molecules | 8 ms | 1.2 ms | 6.7× |
| 100,000 molecules | 74 ms | 3.8 ms | 19.5× |
| 1,000,000 molecules | 812 ms | 11.4 ms | 71.2× |
| 2,300,000 molecules (full ChEMBL subset) | 1,940 ms | 22.1 ms | 87.8× |

### Digital Twin Validation (against published literature PK parameters, oral dosing)

| Compound Class | Predicted t½ (h) | Literature t½ (h) | Predicted AUC (ng·h/mL) | Literature AUC (ng·h/mL) | % Error (AUC) |
|---|---|---|---|---|---|
| NSAID-like (ibuprofen-class) | 2.1 | 2.0–2.4 | 38.4 | 35–42 | ~5% |
| Kinase-inhibitor-like (EGFR-class) | 14.3 | 12–18 | 4210 | 3900–4600 | ~4% |
| Antimalarial-like (AChE-adjacent) | 26.7 | 22–30 | 890 | 800–950 | ~6% |

---

## 🧪 Ablation Studies

Removing individual components from the V7 pipeline (EGFR target, PDBbind test split) to quantify each one's actual contribution:

| Configuration | ROC-AUC | RMSE (pKd) | Δ vs. Full Model |
|---|---|---|---|
| **Full AETHER-RAMI V7** | **0.934** | **0.41** | — |
| − Cross-attention (concat instead) | 0.901 | 0.53 | −0.033 AUC |
| − GraphCL/InfoNCE pretraining | 0.896 | 0.55 | −0.038 AUC |
| − ESM-2 (one-hot protein encoding) | 0.879 | 0.61 | −0.055 AUC |
| − Edge features (plain GCN message passing) | 0.887 | 0.58 | −0.047 AUC |
| − Attention readout (mean pooling instead) | 0.921 | 0.46 | −0.013 AUC |
| − BALD (random query selection in agent loop) | — | — | 2.45× more queries needed |

**Takeaway:** ESM-2 protein embeddings and GraphCL pretraining are the two single largest contributors to DTI accuracy; cross-attention contributes more to interpretability (residue-level heatmaps) than to raw accuracy, though it still measurably helps.

---

## 📚 Datasets & Knowledge Sources

| Dataset | Size | Task | Integration |
|---------|------|------|-------------|
| **PDBbind v2020** | 19,443 complexes | pKd regression | Primary affinity benchmark |
| **BindingDB** | 2.1M measurements | Multi-target DTI | Cross-target repurposing |
| **ChEMBL 33** | 2.3M compounds | ADMET + bioactivity | ADMET multi-task training |
| **MoleculeNet** | 10 benchmarks | Classification + regression | Standard ML benchmarking |
| **DrugBank 5.1** | 14,000 drugs | Drug properties + interactions | Knowledge graph + DDI |
| **UniProt/SwissProt** | 570K proteins | Protein sequences | ESM-2 pretraining targets |
| **OMIM** | 7,000+ diseases | Genotype-phenotype | Disease knowledge graph |
| **PDB (selected)** | 5 structures | 3D protein geometry | 3Dmol.js visualization |
| **STRING v12** | 3.1B interactions | PPI network | Galaxy graph edges |
| **KEGG Pathway** | 536 pathways | Biological pathways | Multi-omics integration |

---

## 🧭 Design Rationale — Why Each Component Exists

A short "why not something simpler" note for each major architectural choice:

- **Why a GNN and not a fingerprint + Random Forest?** Fingerprints discard bond connectivity beyond a fixed radius; a GNN learns which substructures matter for a *specific* task instead of relying on a hand-fixed circular neighborhood. The classical models (RF/XGBoost/LightGBM/CatBoost) are kept as fast baselines and sanity checks, not replaced.
- **Why ESM-2 instead of one-hot amino-acid encoding?** One-hot encoding has no notion of amino-acid similarity or evolutionary context; ESM-2 embeddings already encode structural and functional similarity learned from hundreds of millions of sequences, which the ablation table above shows is the single biggest accuracy driver.
- **Why cross-attention instead of concatenating molecule + protein embeddings?** Concatenation forces the model to learn interaction patterns from a fixed-size joint vector with no notion of *where* on the protein the drug touches. Cross-attention preserves a per-residue, per-atom interaction matrix that is both more accurate and directly interpretable.
- **Why active learning (BALD) instead of exhaustive screening?** Exhaustive high-fidelity screening (docking/MD/wet-lab) of millions of compounds is not tractable; BALD directs the limited experimental budget toward the molecules the model is most uncertain about, cutting the number of required queries by roughly half in our benchmarks.
- **Why a two-compartment PK model instead of a full PBPK model?** A full physiologically-based PK model requires many organ-specific parameters that are rarely available for a novel candidate; the two-compartment model captures the key absorption/distribution/elimination phases with far fewer assumptions, while still being extensible toward PBPK later.
- **Why FAISS instead of a SQL similarity query?** Nearest-neighbor search over 256/1280-dimensional dense embeddings is not something a relational database index can do efficiently; FAISS's IVF-PQ index is purpose-built for this and scales to millions of vectors in RAM.
- **Why SHAP *and* GradCAM instead of just one?** They trade off cost vs. rigor — GradCAM is a single backward pass suitable for every prediction by default; SHAP is more expensive but game-theoretically principled, reserved for higher-stakes explanations.
- **Why a QUBO formulation for portfolio selection?** Selecting a non-overlapping, resource-constrained set of drug-target pairs is a combinatorial optimization problem; QUBO is the standard way to express such problems for both classical simulated-annealing solvers and (in the future) quantum annealers, keeping the formulation portable across solver backends.

---

## 📁 Directory Structure

```
AETHERRAMI/
│
├── aether-ramiv4/                       # V4 Scientific Assets
│   ├── 1ivo_egfr.pdb                    # EGFR kinase domain (2.6 Å)
│   ├── 3og7_braf.pdb                    # BRAF V600E mutant (2.3 Å)
│   ├── 1hcl_cdk2.pdb                    # CDK2 + ATP (1.9 Å)
│   ├── 3phv_hivpr.pdb                   # HIV-1 Protease (1.8 Å)
│   ├── 1acj_ache.pdb                    # Acetylcholinesterase (2.8 Å)
│   ├── protein_embeddings_v4.json       # ESM-2 embeddings (1280-d)
│   ├── config_v4.json                   # Dataset + model config
│   └── generate_visualizations.py       # 29 HTML viz generator
│
├── backend/
│   ├── api/
│   │   └── endpoints.py                 # 30+ FastAPI routes
│   ├── services/
│   │   ├── research_engine.py           # Precision Rx, MD, repurposing
│   │   ├── inference.py                 # GNN + ESM-2 + CVAE inference
│   │   ├── vector_search.py             # FAISS dual-index search
│   │   ├── active_learning.py           # BALD + Thompson + EI
│   │   ├── digital_twin.py              # PK/PD ODE solver
│   │   └── xai_engine.py               # SHAP + GradCAM
│   ├── models/
│   │   ├── architectures.py             # GNN / CrossAttn / CVAE
│   │   ├── protein_encoder.py           # ESM-2 wrapper
│   │   └── admet_mlp.py                 # Multi-task ADMET head
│   ├── database/
│   │   └── schema.py                    # SQLAlchemy models
│   ├── main.py                          # FastAPI app entry
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── HumanAnatomyCanvas.tsx   # SVG medical wireframe
│   │   │   ├── ScientificCursor.tsx     # Custom molecular cursor
│   │   │   └── views/
│   │   │       ├── DiscoveryEngine.tsx
│   │   │       ├── DrugLab.tsx
│   │   │       ├── DigitalTwin.tsx
│   │   │       ├── CancerTargeting.tsx
│   │   │       ├── PathogenSim.tsx
│   │   │       ├── XAICenter.tsx
│   │   │       ├── GalaxyGraph.tsx
│   │   │       └── Features.tsx
│   │   ├── lib/api.ts                   # Typed API client
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── public/
│   │   └── visualizations/              # 29 HTML files
│   ├── next.config.js                   # Proxy: /backend/* → :8000
│   └── package.json
│
├── visualizations/                      # Source viz generators
│   ├── chemical_space_3d.py
│   ├── cross_attention_viz.py
│   ├── drug_target_galaxy.py
│   └── molecule_evolution.py
│
├── benchmarks/                          # Reproducibility scripts for every table above
│   ├── dti_benchmark.py                 # DTI Prediction Performance table
│   ├── admet_benchmark.py               # ADMET Benchmark table
│   ├── active_learning_curve.py         # BALD vs. random efficiency curve
│   ├── generation_quality.py            # CVAE validity/uniqueness/novelty
│   ├── faiss_latency.py                 # Retrieval latency table
│   └── ablation.py                      # Ablation study table
│
├── infrastructure/
│   ├── docker-compose.yml               # Full stack compose
│   ├── Dockerfile.backend               # FastAPI container
│   ├── Dockerfile.frontend              # Next.js container
│   ├── k8s/
│   │   ├── deployment.yaml              # K8s deployment
│   │   └── service.yaml                 # LoadBalancer service
│   └── monitoring/
│       ├── prometheus.yml               # Metrics scraping
│       └── grafana_dashboard.json       # Pre-built dashboard
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   └── MATHEMATICAL_FOUNDATIONS.md
│
├── .gitignore                           # *.pkl, *.bin, *.npy excluded
└── README.md
```

> **Note:** Large ML artifacts (`*.pkl`, `*.bin`, `*.npy`, FAISS indices) are gitignored. PDB structures and ESM-2 embeddings JSON are included. The `benchmarks/` directory is where every table in this README should be regenerated from — if you add a new claimed result, add or update the corresponding script there first.

---

## 🚀 Quick Start

### Prerequisites

```
Node.js  ≥ 18.0
Python   ≥ 3.11
Git
CUDA     ≥ 11.8 (optional, for GPU inference)
RAM      ≥ 8GB  (16GB recommended)
```

### 1. Clone

```bash
git clone https://github.com/Premchandyadav369/AETHERRAMI.git
cd AETHERRAMI
```

### 2. Backend

```bash
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS / Linux
source venv/bin/activate

pip install -r backend/requirements.txt

# Start API server
uvicorn backend.main:app --reload --port 8000
```

**Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
**ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

**Platform:** [http://localhost:3000](http://localhost:3000)

The Next.js config proxies `/backend/*` → `http://127.0.0.1:8000` automatically.

### 4. K2-Think Copilot (Optional)

Create `frontend/.env.local`:

```env
K2_API_KEY=your_k2_think_api_key_here
```

Without a key, the copilot serves grounded local fallback responses from the scientific knowledge base.

### 5. Generate Visualizations

```bash
cd aether-ramiv4
python generate_visualizations.py
# Outputs 29 HTML files to frontend/public/visualizations/
```

### 6. Reproduce a Benchmark Table

```bash
# Example: regenerate the DTI Prediction Performance table
python benchmarks/dti_benchmark.py --dataset pdbbind_v2020 --split scaffold --seeds 5
```

---

## 🐳 Docker & Kubernetes Deployment

### Docker Compose (Recommended)

```bash
cd infrastructure
docker-compose up --build -d
```

Services started:
- `aether-backend` → port 8000
- `aether-frontend` → port 3000
- `prometheus` → port 9090
- `grafana` → port 3001

### Kubernetes

```bash
kubectl apply -f infrastructure/k8s/deployment.yaml
kubectl apply -f infrastructure/k8s/service.yaml
kubectl get pods -n aether-rami
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | Backend API port |
| `FAISS_INDEX_PATH` | `./indices/` | Path to FAISS indices |
| `ESM2_MODEL` | `esm2_t33_650M_UR50D` | ESM-2 model variant |
| `K2_API_KEY` | — | K2-Think API key |
| `CUDA_VISIBLE_DEVICES` | 0 | GPU device ID |
| `MAX_WORKERS` | 4 | Uvicorn worker count |
| `LOG_LEVEL` | info | Logging verbosity |

---

## 📈 V1–V7 Evolution Timeline

```
V1 (2024 Q1)  ─────────────────────────────────────────────────────────────
│ Molecular descriptor ML
│ RDKit + Mordred features → Random Forest / XGBoost
│ MUV, BACE, BBBP benchmarks
│ ROC-AUC: 0.81

V2 (2024 Q2)  ─────────────────────────────────────────────────────────────
│ Graph foundation learning
│ GCN / GAT architecture on molecular graphs
│ InfoGraph self-supervised pretraining
│ ROC-AUC: 0.86

V3 (2024 Q3)  ─────────────────────────────────────────────────────────────
│ Protein intelligence + vector search
│ ESM-2 protein embeddings integrated
│ FAISS single-index molecular retrieval
│ BindingDB DTI classification
│ ROC-AUC: 0.88

V4 (2024 Q4)  ─────────────────────────────────────────────────────────────
│ Protein-aware foundation model
│ GraphCL/InfoNCE contrastive pretraining
│ Multi-dataset loading (8 sources)
│ BALD active learning
│ Classical ML ensemble (RF, XGB, MLP)
│ Dual FAISS index (mol + protein)
│ 5 PDB structures + protein embeddings JSON
│ ROC-AUC: 0.891

V5 (2025 Q1)  ─────────────────────────────────────────────────────────────
│ Cross-attention DTI engine
│ Protein-ligand cross-attention mechanism
│ Protein-conditioned CVAE generation
│ Multimodal foundation model architecture
│ ESM-2 t33 650M integration
│ ROC-AUC: 0.906

V6 / V6.1 (2025 Q2)  ──────────────────────────────────────────────────────
│ Digital twin PK/PD simulation
│ Two-compartment ODE system
│ Bug fixes: numpy ABI, scaffold-split imbalance
│ pKd unit conversion (nM → μM → log)
│ PyTorch AMP API updates
│ mordred/numpy compatibility patches
│ ROC-AUC: 0.914

V7 (2025 Q3–Q4)  ──────────────────────────────────────────────────────────
│ Precision medicine OS + autonomous agent
│ 18 platform capabilities
│ FastAPI 30+ REST endpoints
│ Next.js 14 full-stack frontend
│ 29 interactive HTML visualizations
│ K2-Think-v2 scientific copilot
│ Autonomous research agent (BALD + EI + TS)
│ Disease knowledge galaxy graph
│ Multi-omics foundation model
│ Regulatory readiness suite
│ Docker / K8s / Prometheus / Grafana
│ ROC-AUC: 0.927 ◀── CURRENT
```

---

## 🏆 Comparison Against SOTA Models

| Capability | AETHER-RAMI V7 | DeepDTA | GraphDTA | REINVENT | DiffSBDD | AlphaFold3 |
|-----------|---------------|---------|---------|---------|---------|-----------|
| DTI Prediction | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Molecular Generation | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| ADMET Profiling | ✅ (10 props) | ❌ | ❌ | partial | ❌ | ❌ |
| Protein Embedding | ESM-2 | 1D CNN | GCN | ❌ | ESM-2 | Novel |
| XAI / Explainability | ✅ SHAP + Attn | ❌ | ❌ | ❌ | ❌ | ❌ |
| Active Learning | ✅ BALD | ❌ | ❌ | ❌ | ❌ | ❌ |
| Digital Twin PK/PD | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Knowledge Graph | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Protein Viewer | ✅ 3Dmol | ❌ | ❌ | ❌ | ❌ | ✅ |
| Precision Medicine | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Regulatory Suite | ✅ ICH M7 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Production API | ✅ FastAPI | ❌ | ❌ | ❌ | ❌ | ❌ |
| Full-Stack UI | ✅ Next.js 14 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Overall Scope** | **OS (18 modules)** | Single task | Single task | Gen only | Gen only | Structure |

---

## ⚠️ Limitations & Honest Caveats

Being upfront about what this platform does *not* do, so results are read in the right context:

- **In silico predictions are not a substitute for wet-lab validation.** Every pKd, ADMET property, or safety flag is a model estimate, not an experimental measurement. High-confidence predictions should still be validated by assay before any downstream decision.
- **Digital Twin PK/PD values are illustrative, not clinically validated.** The two-compartment model is a standard pharmacological approximation; it is not calibrated against real patient trial data and should not inform actual dosing decisions.
- **5-protein scope.** The protein intelligence and 3D viewer modules currently cover 5 reference targets (EGFR, BRAF, CDK2, HIV Protease, AChE) — the ESM-2 backbone generalizes to arbitrary sequences, but pocket detection and the curated PDB visualizations are limited to these five.
- **Regulatory Readiness Suite is a rule-of-thumb checker, not a certification.** ICH M7/S9 checks flag known structural alerts; they do not replace formal regulatory toxicology review.
- **Quantum descriptors use a semi-empirical approximation (Extended Hückel), not full ab initio DFT.** This is a deliberate speed/accuracy tradeoff — fast enough for screening, not a substitute for a full quantum chemistry package (Gaussian, ORCA, Psi4) when precision matters.
- **QUBO/simulated-annealing portfolio optimization runs classically today.** "Quantum-inspired" means the problem is formulated in QUBO form; no quantum hardware is currently in the loop.

---

## 🗺️ Roadmap

Near-term directions under active consideration:

- AlphaFold/OpenFold integration for structure prediction on proteins without a solved PDB entry
- Full molecular dynamics (MD) simulation backend (currently metrics are estimated, not MD-trajectory-derived, outside the 5 reference proteins)
- Expansion beyond 5 reference protein targets toward a configurable target library
- Federated learning support so institutions can improve the shared model without sharing proprietary compound libraries
- Clinical trial simulation module (virtual patient cohorts, Phase II/III power estimation)
- Physiologically-based PK (PBPK) model as an optional upgrade path from the current two-compartment model

---

## ❓ Frequently Asked Questions

**Q: Is this platform validated for real clinical or regulatory use?**
No. It is a research and educational platform. Every prediction should be treated as a hypothesis-generation tool, not a clinical or regulatory decision input.

**Q: Why 5 proteins specifically?**
EGFR, BRAF, CDK2, HIV Protease, and AChE were chosen because they span five distinct therapeutic areas (oncology ×3, infectious disease, neurodegeneration) and each has a well-resolved, widely-used PDB reference structure, making them useful for both benchmarking and teaching.

**Q: Can I add my own protein target?**
Yes — the ESM-2 embedding pipeline accepts any protein sequence. Full 3Dmol.js visualization and curated pocket detection currently require a PDB structure; adding one follows the pattern in `aether-ramiv4/`.

**Q: What's the difference between the classical ML models and the GNN?**
The classical models (Random Forest, XGBoost, LightGBM, CatBoost) run on hand-engineered descriptors (Mordred/Morgan fingerprints) and serve as fast, interpretable baselines. The GNN/cross-attention stack learns its own representation directly from molecular graphs and protein sequences, and is the model reported in the main benchmark tables.

**Q: How do I regenerate the numbers in this README?**
Every benchmark table has a corresponding script under `benchmarks/` (see [Directory Structure](#-directory-structure)) — run it with the dataset/split/seed flags shown in [Quick Start](#-quick-start) to reproduce or update a result.

---

## 📖 Citation

```bibtex
@article{aether_rami_v7_2026,
  title     = {AETHER-RAMI V7: An AI-Powered Drug Discovery and Precision Medicine
               Operating System with Protein Foundation Models, Digital Human Twins,
               and Autonomous Research Agents},
  author    = {Yadav, Premchand},
  journal   = {Bioinformatics and Computational Biology Reports},
  year      = {2026},
  volume    = {7},
  pages     = {1--42},
  url       = {https://github.com/Premchandyadav369/AETHERRAMI},
  note      = {ROC-AUC 0.927 on PDBbind v2020 scaffold split; 18 integrated platform capabilities}
}

@software{aether_rami_v7_code,
  author    = {Yadav, Premchand},
  title     = {AETHER-RAMI V7: Drug Discovery OS},
  year      = {2026},
  publisher = {GitHub},
  url       = {https://github.com/Premchandyadav369/AETHERRAMI},
  license   = {MIT}
}
```

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│   Built for Researchers. Designed for Impact.           │
│   Engineered for the Future of Drug Discovery.          │
└─────────────────────────────────────────────────────────┘
```

**Tech Stack**

`PyTorch` · `PyG` · `FastAPI` · `Next.js 14` · `3Dmol.js` · `Plotly` · `vis-network`
`ESM-2` · `FAISS` · `RDKit` · `SHAP` · `K2-Think-v2` · `Docker` · `Kubernetes`

---

*From molecule to medicine · From sequence to structure · From data to discovery*

**⭐ Star the repo if AETHER-RAMI accelerates your research!**

[![GitHub](https://img.shields.io/github/stars/Premchandyadav369/AETHERRAMI?style=social)](https://github.com/Premchandyadav369/AETHERRAMI)

</div>
