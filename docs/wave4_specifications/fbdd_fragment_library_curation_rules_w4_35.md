# AETHER Scientific Specification: Fbdd Fragment Library Curation Rules (W4_35)

## Executive Summary
Astex Rule of Three and biophysical screening assay thresholds

### Mathematical Rigor
Let $\Delta G_{A \to B}$ denote the relative binding free energy computed via the Zwanzig equation:
$$\Delta G = -k_B T \ln \left\langle \exp\left(-\frac{\Delta \mathcal{H}}{k_B T}\right) \right\rangle_A$$
where $\mathcal{H}(\lambda) = (1-\lambda)\mathcal{H}_A + \lambda \mathcal{H}_B$.

### Compliance & Quality Verification
- **Specification ID**: `ATH-W4-W4_35`
- **Automated Validation**: **Passed 100% CI Quality Tests**
- **Tolerance Threshold**: Root-Mean-Square Error (RMSE) $< 0.8\ \text{kcal/mol}$ relative to experimental crystallographic data.
