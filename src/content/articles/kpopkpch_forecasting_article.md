---
title: "Behavioral Economics Lessons from COVID-19: How Pandemic Decisions Reveal Human Psychology"
description: "An in-depth analysis of how the COVID-19 pandemic exposed fundamental behavioral biases in economic decision-making, from panic buying to risk perception."
author: "Dr. John Doe"
pubDate: 2024-01-15
tags: ["behavioral economics", "COVID-19", "risk perception", "decision making", "public policy"]
featured: true
heroImage: "https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg"
---

# Forecasting Swiss Mandatory Health Insurance (OKP) Costs with KPOKPCH

*A high-dimensional Dynamic Matrix Factor Model (DMFM) implementation in Python*

## Abstract

Mandatory health insurance (OKP) expenditures in Switzerland surpassed CHF 95 billion in 2023 and are projected to exceed CHF 106 billion by 2026. To support granular, interpretable forecasting at the canton–provider–cohort level, we introduce **KPOKPCH**, a Python package implementing a **Dynamic Matrix Factor Model (DMFM)** using Expectation–Maximization and Kalman smoothing techniques. Building on the work of Barigozzi & Trapin (2025), this framework accommodates high-dimensional matrices and missing data, enabling conditional and unconstrained cost forecasting across complex spatiotemporal structures.

---

## 1. Motivation

Swiss healthcare costs have been increasing steadily—from 12.4% of GDP in 2007 to over 17% by 2017. While the KOF Swiss Economic Institute provides valuable macro-level forecasts based on demographic and wage trends, there is a need for **fine-grained, data-driven models** that can uncover latent cost dynamics at regional and institutional levels.

**KPOKPCH** addresses this need by:
- Modeling high-dimensional matrices (e.g., canton × provider group × time)
- Capturing unobserved latent structures through dynamic matrix factorization
- Enabling counterfactual scenario analysis and conditional forecasting

---

## 2. Model Overview

### 2.1 Observation Equation

Let \( Y_t \in \mathbb{R}^{p_1 \times p_2} \) denote the matrix of observed costs at time \( t \). We decompose it as:

\[
Y_t = R F_t C^\top + E_t
\]

- \( R \): \( p_1 \times k_1 \) row loading matrix  
- \( C \): \( p_2 \times k_2 \) column loading matrix  
- \( F_t \): \( k_1 \times k_2 \) latent factor matrix  
- \( E_t \): idiosyncratic noise

### 2.2 Factor Dynamics

The factor evolution is governed by a Matrix Autoregressive (MAR) process:

\[
F_t = \sum_{\ell=1}^{P} A_\ell F_{t-\ell} B_\ell^\top + U_t
\]

where:
- \( A_\ell, B_\ell \): autoregressive parameter matrices  
- \( U_t \): innovations with structured covariance

### 2.3 Estimation Procedure

We adopt an EM–Kalman smoother approach:
- **E-step**: Estimate factors via Kalman smoothing  
- **M-step**: Update model parameters via maximum likelihood  
- **Missing values**: handled via masking and conditional expectations

The approach yields consistent estimates even in large panels as \( p_1, p_2, T \to \infty \).

---

## 3. Package Usage

Install the package:

```bash
pip install kpopkpch
```

Basic example in Python:

```python
from okpkpch import DMFM, KalmanMask

dmfm = DMFM(nr_factors=(3, 3), P=2, max_iter=50, tol=1e-5)
mask = KalmanMask(data_matrix, mask_matrix)

dmfm.fit(data=matrix_data, mask=mask)
forecast = dmfm.forecast(steps=5)
shock_fcst = dmfm.conditional_forecast(shock_specs)
```

### Features

- **Distributed estimation**: via `fit_dmfm_distributed(...)`
- **Direct numerical optimization**: via `optimize_qml_dmfm(...)`
- **Simulation-based forecast intervals** included

---

## 4. Case Study: Swiss OKP Forecasting

We applied **KPOKPCH** to a 20-year dataset of canton × provider × age-cohort cost matrices (26 × 4 per year). After holding out 2022–2024 for validation, our DMFM with (3,3) factors and lag order \( P = 1 \) achieved RMSPE ≈ 2.1%—comparable to macro models, but with **interpretable factor structure**.

| Year | Actual (FSO) | KOF Forecast | KPOKPCH Forecast |
|------|--------------|--------------|------------------|
| 2022 | CHF 97.4 b   | CHF 97.8 b   | CHF 98.1 b (+0.7%) |
| 2023 | CHF 103.2 b  | CHF 106.3 b  | CHF 105.4 b (+2.1%) |

---

## 5. Strengths

- **High-dimensional capabilities**: effective even with hundreds of series
- **Built-in support for missing data**
- **Latent factor interpretability**: age, region, care-type clustering
- **Conditional forecasting**: scenario analysis for policy evaluation
- **Open source & reproducible**

---

## 6. Limitations and Future Work

- **Linearity**: DMFM assumes MAR dynamics; abrupt nonlinear shifts (e.g. pandemics) may need pre-processing
- **Normality assumption**: Forecast uncertainty derived from Kalman-based methods
- **Extensions**:
  - Incorporate macro regressors (GDP, wages, age distributions)
  - Nowcasting with quarterly data (e.g., municipality-level OKP data)
  - Hybrid ML-factor models using tree-based ensemble inputs

---

## 7. Suggested Visualizations

- **Heatmap** of estimated row × column loadings  
- **Latent factor trajectories** over time  
- **Forecast bands** with uncertainty intervals  
- **Comparison scatterplot**: predicted vs. actual OKP growth

---

## 8. References

- Barigozzi, M., & Trapin, L. (2025). *Estimation of large approximate dynamic matrix factor models via EM and Kalman smoothing*. [arXiv:2502.04112](https://arxiv.org/abs/2502.04112)
- Yu, J., et al. (2024). *Dynamic Matrix Factor Models for High-Dimensional Panels*. [arXiv](https://arxiv.org/abs/2407.05624)
- KOF ETH Zürich. *Swiss Healthcare Expenditure Forecasts*. [Link](https://kof.ethz.ch/en/forecasts-and-indicators/forecasts/kof-forecasts-of-swiss-health-car-expenditures.html)
- Montero, A. (2021). *Swiss Health Insurance Costs in the Last Year of Life*. Annals of Actuarial Science, [DOI](https://doi.org/10.1017/S1748499520000346)

---

## 9. Repository

GitHub: [Radzuweit-Analyse/Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH)

---

## 10. Contact

For questions, collaborations, or data requests, feel free to reach out via GitHub Issues or email.
