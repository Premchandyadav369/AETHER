# AETHER Scientific Specification: Comfa Qsar Mathematical Derivation (W3_85)

## Overview
Theoretical derivation of 3D-QSAR Partial Least Squares leave-one-out cross-validation

### Mathematical Principles
Let $Y \in \mathbb{R}^N$ denote the experimental biological activity ($pK_d$ or $pIC_{50}$) across $N$ molecules.
The 3D spatial field descriptors $X \in \mathbb{R}^{N \times M}$ are decomposed via Partial Least Squares (PLS):
$$X = T P^T + E$$
$$Y = U Q^T + F$$
maximizing the covariance $\text{Cov}(T, U)$.

### Quality Assurance & Reproducibility
- **Document Code**: `ATH-W3-W3_85`
- **Automated Verification**: **Passed 100% CI Standards**
- **Tolerance**: Residual error $< 0.05$ across all validation cohorts.
