---
title: "Forecasting mandatory health insurance expenditures in Switzerland"
description: "Using a dynamic matrix factor model to consistently forecast the mandatory health insurance expenditures in Switzerland."
author: "Raphaël Radzuweit"
pubDate: 2025-08-01
tags: ["forecasting", "econometrics", "health insurance", "public policy"]
featured: true
heroImage: "https://images.pexels.com/photos/416779/pexels-photo-416779.jpeg"
---

# Forecasting Swiss Mandatory Health Insurance (OKP) Costs with KPOKPCH

*A high-dimensional Dynamic Matrix Factor Model (DMFM) implementation in Python*

## Abstract

Mandatory health insurance (OKP) expenditures in Switzerland surpassed CHF 4 700 per person in 2024 and are projected to exceed CHF 5 000 per person by 2026. To support granular, interpretable forecasting at the canton–provider–cohort level, I am introducing a Python package implementing a **Dynamic Matrix Factor Model (DMFM)** using Expectation–Maximization and Kalman smoothing techniques. Building on the work of Barigozzi & Trapin (2025), this framework accommodates high-dimensional matrices and missing data, enabling conditional and unconstrained cost forecasting across complex spatiotemporal structures.

---

## 1. Motivation

Swiss healthcare costs have been increasing steadily—from 12.4% of GDP in 2007 to over 17% by 2017. In the space of the mandatory health insurance, there is a need for an open-source **fine-grained, data-driven models** that can uncover latent cost dynamics at regional and institutional levels.

My implementation addresses this need by:
- Modeling high-dimensional matrices (e.g., canton × provider group × time)
- Capturing unobserved latent structures through dynamic matrix factorization
- Enabling counterfactual scenario analysis and conditional forecasting

---

## 2. Model Overview

### 2.1 Observation Equation

Let $Y_t \in \mathbb{R}^{p_1 \cdot p_2}$ denote the matrix of observed costs at time $t$. It is decomposed as:

$$Y_t = R F_t C^\top + E_t$$

- $R$: $p_1 \cdot k_1$ row loading matrix  
- $C$: $p_2 \cdot k_2$ column loading matrix  
- $F_t$: $k_1 \cdot k_2$ latent factor matrix  
- $E_t$: idiosyncratic noise

### 2.2 Factor Dynamics

The factor evolution is governed by a Matrix Autoregressive (MAR) process:

$$F_t = \sum_{\ell=1}^{P} A_\ell F_{t-\ell} B_\ell^\top + U_t$$

where:
- $A_\ell$, $B_\ell$: autoregressive parameter matrices  
- $U_t$: innovations with structured covariance

### 2.3 Estimation Procedure

We adopt an EM–Kalman smoother approach:
- **E-step**: Estimate factors via Kalman smoothing  
- **M-step**: Update model parameters via maximum likelihood  
- **Missing values**: handled via masking and conditional expectations

The approach yields consistent estimates even in large panels as $p_1$, $p_2$, $T \to \infty$.

---

## 3. Case Study: Swiss OKP Forecasting
To be published soon.

---

## 4. Strengths

- **High-dimensional capabilities**: effective even with hundreds of series
- **Built-in support for missing data**
- **Latent factor interpretability**: age, region, care-type clustering
- **Conditional forecasting**: scenario analysis for policy evaluation
- **Open source & reproducible**

---

## 5. References

- Barigozzi, M., & Trapin, L. (2025). *Estimation of large approximate dynamic matrix factor models via the EM algorithm and Kalman filtering.* [arXiv:2502.04112](https://arxiv.org/abs/2502.04112).
- Cen, Z., & Lam, C. (2025). Tensor time series imputation through tensor factor modelling. Journal of Econometrics, 249, 105974. [arXiv:2403.13153](https://arxiv.org/abs/2403.13153).
- Yu, J., Wang, H., Ai, M., & Zhang, H. (2022). Optimal distributed subsampling for maximum quasi-likelihood estimators with massive data. Journal of the American Statistical Association, 117(537), 265–276. [arXiv:2407.05624](https://arxiv.org/abs/2407.05624).
