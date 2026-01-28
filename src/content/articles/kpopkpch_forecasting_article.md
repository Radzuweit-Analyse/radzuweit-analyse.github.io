---
title: "Forecasting mandatory health insurance expenditures in Switzerland"
description: "Using a dynamic matrix factor model to consistently forecast the mandatory health insurance expenditures in Switzerland."
author: "Raphaël Radzuweit"
pubDate: 2025-08-01
readingTimeInMinutes: 7
tags: ["forecasting", "econometrics", "health insurance", "public policy", "python"]
featured: true
heroImage: "https://images.pexels.com/photos/416779/pexels-photo-416779.jpeg"
---

# Forecasting Swiss Mandatory Health Insurance (OKP) Costs with KPOKPCH

*A high-dimensional Dynamic Matrix Factor Model (DMFM) implementation in Python*

## Abstract

Mandatory health insurance (OKP) expenditures in Switzerland surpassed CHF 4 700 per person in 2024 and are projected to exceed CHF 5 000 per person by 2026. To support granular, interpretable forecasting at the canton–provider–cohort level, I developed **KPOKPCH**, a Python package implementing a **Dynamic Matrix Factor Model (DMFM)** using Expectation–Maximization and Kalman smoothing techniques. Building on the work of Barigozzi & Trapin (2025), this framework accommodates high-dimensional matrices and missing data, enabling conditional and unconstrained cost forecasting across complex spatiotemporal structures.

The package is available on [GitHub](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH) and provides tools for forecasting health costs across 26 Swiss cantons and multiple provider groups simultaneously.

---

## 1. Motivation

Swiss healthcare costs have been increasing steadily from 12.4% of GDP in 2007 to over 17% by 2017. In the mandatory health insurance space, there is a need for **open-source, fine-grained, data-driven models** that can uncover latent cost dynamics at regional and institutional levels.

### Why DMFM for Healthcare Forecasting?

Traditional forecasting methods face several challenges when applied to Swiss health insurance data:

- **High dimensionality**: 26 cantons × multiple provider groups × time creates a large parameter space
- **Missing data**: Not all canton-provider combinations have complete time series
- **Cross-sectional dependencies**: Cantons and provider types are not independent
- **Temporal dynamics**: Seasonal patterns and autoregressive dynamics must be captured

The DMFM framework addresses these challenges by:
- Modeling high-dimensional matrices (canton × provider × time) through low-rank factorization
- Capturing unobserved latent structures through dynamic matrix factors
- Handling missing data natively via masking in the EM algorithm
- Enabling both conditional forecasting (scenario analysis) and unconstrained forecasting

---

## 2. Model Overview

### 2.1 Observation Equation

Let $Y_t \in \mathbb{R}^{p_1 \times p_2}$ denote the matrix of observed costs at time $t$. It is decomposed as:

$$Y_t = R F_t C^\top + E_t$$

where:
- $R \in \mathbb{R}^{p_1 \times k_1}$: row loading matrix (captures canton-specific patterns)
- $C \in \mathbb{R}^{p_2 \times k_2}$: column loading matrix (captures provider-specific patterns)
- $F_t \in \mathbb{R}^{k_1 \times k_2}$: latent factor matrix at time $t$
- $E_t$: idiosyncratic noise with covariance structure $H \otimes K$

The key insight is that instead of modeling $p_1 \times p_2$ series independently, we capture the dynamics through $k_1 \times k_2$ latent factors where $k_1 \ll p_1$ and $k_2 \ll p_2$.

### 2.2 Factor Dynamics

The factor evolution is governed by a **Matrix Autoregressive (MAR)** process:

$$F_t = C + \sum_{\ell=1}^{P} A_\ell F_{t-\ell} B_\ell^\top + U_t$$

where:
- $C \in \mathbb{R}^{k_1 \times k_2}$: drift matrix (can be set to zero)
- $A_\ell \in \mathbb{R}^{k_1 \times k_1}$, $B_\ell \in \mathbb{R}^{k_2 \times k_2}$: autoregressive parameter matrices
- $U_t$: innovations with covariance matrix $P \otimes Q$
- $P$: MAR order (typically $P=1$ for quarterly data)

This specification allows for rich dynamics while maintaining parsimony. The MAR(1) model with $k_1 = k_2 = 2$ has only $2 \times (2 \times 2 + 2 \times 2) = 16$ parameters for the dynamics, regardless of the number of cantons or provider groups.

### 2.3 Estimation Procedure

KPOKPCH implements the EM–Kalman smoother approach from Barigozzi & Trapin (2025):

**E-step (Kalman smoothing)**:
1. Convert the matrix observation equation to state-space form
2. Run the Kalman filter forward to compute filtered estimates
3. Run the Kalman smoother backward to obtain smoothed factor estimates
4. Compute sufficient statistics for parameter updates

**M-step (Maximum Likelihood)**:
1. Update factor loadings $R$, $C$ via regression on smoothed factors
2. Update idiosyncratic covariances $H$, $K$ from residuals
3. Update MAR parameters $A_\ell$, $B_\ell$ via vectorized VAR regression
4. Update innovation covariances $P$, $Q$

**Missing Data**: Handled seamlessly via masking—missing observations are excluded from the Kalman update step without requiring imputation.

The algorithm iterates until convergence (measured by log-likelihood change) or reaches maximum iterations. The approach yields consistent estimates even in large panels as $p_1$, $p_2$, $T \to \infty$.

---

## 3. Implementation Features

### 3.1 Core Capabilities

The `KPOKPCH` package provides:

- **`DMFMModel`**: Main model class with configurable dimensions and MAR order
- **`fit_dmfm()`**: EM algorithm with convergence diagnostics
- **Initialization methods**: SVD-based and Principal Eigenvector initialization
- **Missing data support**: Native handling via boolean masks
- **Forecasting utilities**:
  - Seasonal differencing and integration
  - Multi-step ahead forecasting
  - Canton-level and aggregate forecasts
  - Growth rate calculations (Q4-over-Q4)

### 3.2 Data Structure

The package expects data in tensor format:
```python
Y: np.ndarray  # Shape (T, num_cantons, num_provider_groups)
mask: np.ndarray  # Shape (T, num_cantons, num_provider_groups), True = observed
```

For example, with quarterly data from 2019–2024, 26 cantons, and 10 provider groups:
```python
Y.shape  # (24, 26, 10)
```

### 3.3 Example Usage

```python
from KPOKPCH.forecast import forecast_dmfm, ForecastConfig

# Configure model
config = ForecastConfig(
    k1=2,                    # Number of canton factors
    k2=2,                    # Number of provider factors
    P=1,                     # MAR order
    seasonal_period=4,       # Quarterly seasonal differencing
    max_iter=100,           # Maximum EM iterations
    diagonal_idiosyncratic=False  # Full covariance matrices
)

# Fit and forecast
result = forecast_dmfm(Y, steps=8, config=config)

# Extract results
forecasts = result.forecast        # Shape: (8, 26, 10)
fitted_model = result.model        # DMFMModel instance
```

The package also includes utilities for:
- Loading CSV data in canton × provider format
- Computing yearly aggregates from quarterly forecasts
- Generating period labels (e.g., 2025Q1, 2025Q2, ...)
- Plotting historical data with forecasts

---

## 4. Application to Swiss OKP Data

### 4.1 Data Description

The model is applied to Swiss mandatory health insurance cost data with:
- **Time dimension**: Quarterly observations (2019Q1–2024Q3)
- **Canton dimension**: 26 Swiss cantons plus CH (national aggregate)
- **Provider dimension**: Hospital inpatient, Hospital outpatient, Physicians, Pharmacies, Nursing homes, etc.

Total data size: ~24 quarters × 27 regions × 10 provider groups = 6,480 observations

### 4.2 Handling Missing Data

Some canton-provider combinations have sparse data (e.g., "Psychothérapeutes" with 94.9% missing values). The implementation handles this in two ways:

1. **Merging sparse groups**: Psychothérapeutes costs are merged into "Autres" before modeling
2. **Native missing data handling**: The EM algorithm naturally handles remaining gaps via masking

### 4.3 Forecasting Workflow

The forecasting script ([forecast_costs_dmfm.py](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH/Prognose-OKPCH/forecast_costs_dmfm.py)) implements:

1. **Data loading and preprocessing**:
   - Load tensor data from CSV
   - Scale to thousands for numerical stability
   - Merge sparse provider groups

2. **Model fitting**:
   - Apply seasonal differencing (period = 4)
   - Fit DMFM with $k_1 = k_2 = 2$, $P = 1$
   - Monitor convergence via log-likelihood

3. **Forecasting**:
   - Generate 8-step ahead forecasts (2 years)
   - Integrate seasonal differences back to levels
   - Aggregate across provider groups for canton totals

4. **Diagnostics and output**:
   - Check model stability (maximum eigenvalue)
   - Compute Q4-over-Q4 growth rates
   - Generate plots and CSV exports

---

## 5. Model Diagnostics

### 5.1 Stability Check

The MAR dynamics are stable if all eigenvalues of the companion matrix lie inside the unit circle. The package provides:

```python
is_stable, max_eigenvalue = result.model.dynamics.check_stability()
```

For Swiss OKP data, typical results show $\lambda_{\max} < 1$, indicating stable dynamics.

### 5.2 Forecast Validation

Growth rate diagnostics compare forecasted Q4-over-Q4 growth with historical patterns:
- Historical average YoY growth: ~3.0%
- Recent years (2022-2024): ~4.4%
- Forecasted growth: Model-implied estimates

This provides a sanity check on forecast reasonableness.

---

## 6. Strengths and Limitations

### Strengths

- **Dimension reduction**: Models $p_1 \times p_2$ series with $k_1 \times k_2$ factors ($k_i \ll p_i$)
- **Built-in missing data support**: No imputation required
- **Interpretable factors**: Row/column loadings capture canton/provider patterns
- **Conditional forecasting**: Can fix certain canton-provider combinations and forecast others
- **Seasonal adjustment**: Native support for quarterly differencing
- **Open source & reproducible**: Full Python implementation with example scripts

### Limitations

- **Computational cost**: EM algorithm can be slow for very large tensors
- **Factor number selection**: Requires choosing $k_1$, $k_2$ via cross-validation or information criteria
- **Gaussian assumption**: Model assumes normally distributed innovations
- **No uncertainty quantification yet**: Point forecasts only (bootstrap or Bayesian extensions possible)

---

## 7. Extensions and Future Work

Potential extensions include:

1. **Automatic factor selection**: Implement information criteria (AIC, BIC) for choosing $k_1$, $k_2$
2. **Uncertainty quantification**: Add bootstrap or Bayesian inference for forecast intervals
3. **Exogenous regressors**: Extend model to include demographic or economic covariates
4. **Time-varying parameters**: Allow loadings or dynamics to evolve over time
5. **Higher-order tensors**: Extend to 3+ dimensional arrays (canton × provider × age group × time)

---

## 8. Conclusion

KPOKPCH provides a flexible, open-source implementation of Dynamic Matrix Factor Models for forecasting high-dimensional time series panels with missing data. Applied to Swiss mandatory health insurance costs, the model successfully captures latent dynamics across 26 cantons and multiple provider groups, generating interpretable and stable multi-step forecasts.

The package is designed for researchers and practitioners working with multi-dimensional panel data who need principled dimension reduction, missing data handling, and forecast generation. All code and example scripts are available on GitHub.

---

## 9. References

- **Barigozzi, M., & Trapin, L. (2025)**. *Estimation of large approximate dynamic matrix factor models via the EM algorithm and Kalman filtering.* [arXiv:2502.04112](https://arxiv.org/abs/2502.04112).

- **Cen, Z., & Lam, C. (2025)**. Tensor time series imputation through tensor factor modelling. *Journal of Econometrics*, 249, 105974. [arXiv:2403.13153](https://arxiv.org/abs/2403.13153).

- **Yu, J., Wang, H., Ai, M., & Zhang, H. (2022)**. Optimal distributed subsampling for maximum quasi-likelihood estimators with massive data. *Journal of the American Statistical Association*, 117(537), 265–276. [arXiv:2407.05624](https://arxiv.org/abs/2407.05624).

- **Federal Statistical Office (FSO)**. Statistics on mandatory health insurance. [www.bfs.admin.ch](https://www.bfs.admin.ch/)

---

## Code Availability

GitHub repository: [https://github.com/yourusername/Kostenprognose-OKPCH](https://github.com/yourusername/Kostenprognose-OKPCH)

Package documentation: See [README.md](README.md) and inline docstrings

Example forecasting script: [forecast_costs_dmfm.py](Prognose-OKPCH/forecast_costs_dmfm.py)

---

*Last updated: January 2025*
