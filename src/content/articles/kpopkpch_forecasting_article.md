---
title: "Forecasting mandatory health insurance expenditures in Switzerland"
description: "An empirical application of the Dynamic Matrix Factor Model to Swiss OKP cost data"
author: "Raphaël Radzuweit"
pubDate: 2025-08-01
readingTimeInMinutes: 12
tags: ["forecasting", "econometrics", "health insurance", "public policy", "python"]
featured: true
heroImage: "https://images.pexels.com/photos/416779/pexels-photo-416779.jpeg"
---

# Forecasting Swiss Mandatory Health Insurance Costs: An Application of the Dynamic Matrix Factor Model

## Abstract

Swiss mandatory health insurance (OKP) expenditures per insured grew from approximately CHF 3,600 annually in 2016 to over CHF 4,700 by 2024, with marked heterogeneity across cantons—quarterly costs range from CHF 700 in Appenzell Innerrhoden to CHF 1,570 in Geneva. Forecasting these costs at fine geographic and institutional resolution poses a genuine econometric challenge: the data form a three-dimensional panel (time × canton × provider type) with substantial cross-sectional dependence and non-negligible missing observations. This paper applies the Dynamic Matrix Factor Model (DMFM) of Barigozzi & Trapin (2025) to this problem, estimating the model via Expectation-Maximisation with Kalman smoothing. Out-of-sample validation across 15 rolling windows yields a mean absolute percentage error (MAPE) of 8.3%, with minimal forecast bias. The model projects continued year-on-year cost growth in the range of 6–9% through 2026, with substantial cantonal variation.

---

## 1. Introduction

The Swiss healthcare system is frequently cited as one of the most expensive in the OECD, with total health expenditure exceeding 11% of GDP. A distinctive feature of this system is the mandatory basic health insurance (Obligatorische Krankenpflegeversicherung, OKP), which covers all residents and is financed through individual premiums rather than general taxation. Premiums are set by insurers subject to regulatory approval, and because they vary by canton of residence, forecasting costs at the cantonal level has direct policy relevance.

The question I address here is straightforward: can we produce reliable multi-step-ahead forecasts of per-insured healthcare costs, disaggregated by canton and provider type, using a parsimonious factor structure? The answer matters for premium setting, cantonal health budgets, and the broader policy debate on cost containment.

Traditional approaches to this problem either model aggregate series (losing geographic detail) or estimate separate models for each canton-provider pair (ignoring cross-sectional information). Neither is satisfactory. The DMFM offers a middle path: it captures common dynamics through a small number of latent factors while preserving the matrix structure of the data.

### Related literature

The theoretical foundation for this work is Barigozzi & Trapin (2025), who develop an EM-Kalman estimation procedure for large approximate dynamic matrix factor models. Their consistency results hold as both cross-sectional dimensions and the time dimension grow, which is precisely the asymptotic regime relevant here. Earlier contributions on matrix-variate factor models include Chen & Fan (2023) for static settings and Yu et al. (2022) for high-dimensional panels. For tensor extensions accommodating additional dimensions, see Cen & Lam (2025).

Applications of factor models to healthcare cost forecasting remain sparse. The literature has focused primarily on mortality forecasting (Lee-Carter and its extensions) and aggregate health expenditure projections. To my knowledge, this is the first application of the DMFM to granular health insurance cost data.

---

## 2. Data

### 2.1 Source and coverage

The data come from the Federal Statistical Office (FSO) monitoring of mandatory health insurance costs. I use quarterly observations from Q1 2016 through Q3 2025, yielding 39 time periods. The cross-sectional units are the 26 Swiss cantons, and the provider categories comprise:

- Hospital inpatient care (Hôpitaux séjours)
- Hospital outpatient care (Hôpitaux ambulatoires)
- Physicians (Médecins ambulatoires)
- Pharmacies
- Medications (Médicaments)
- Laboratories (Laboratoires)
- Physiotherapists (Physiothérapeutes)
- Home care services (SPITEX)
- Nursing homes (Établissements médico-sociaux)
- Other providers (Autres)

All figures are expressed as gross benefits per insured (Prestations brutes par assuré) in Swiss francs.

### 2.2 Descriptive statistics

The data exhibit substantial heterogeneity across cantons. In Q1 2016, per-insured quarterly costs ranged from CHF 694 in Appenzell Innerrhoden to CHF 1,179 in Basel-Stadt—a ratio of nearly 1.7. By Q3 2025, this gap persists: Appenzell Innerrhoden recorded CHF 895, while Geneva reached CHF 1,445.

Table 1 reports quarterly per-insured costs for selected cantons:

| Canton | 2016Q1 | 2020Q4 | 2025Q3 | CAGR (%) |
|--------|--------|--------|--------|----------|
| ZH     | 934    | 1,060  | 1,184  | 2.6      |
| BE     | 990    | 1,097  | 1,220  | 2.3      |
| GE     | 1,170  | 1,294  | 1,445  | 2.3      |
| TI     | 1,069  | 1,286  | 1,442  | 3.3      |
| AI     | 694    | 735    | 895    | 2.8      |
| BS     | 1,179  | 1,330  | 1,393  | 1.8      |

*Note: All figures in CHF per insured per quarter. CAGR computed over 2016Q1–2025Q3.*

The simple average across cantons grew from approximately CHF 908 per quarter in 2016Q1 to CHF 1,130 by 2025Q3—a compound annual rate of 2.4%. Growth accelerated notably after 2021, with year-on-year changes ranging from −4.3% (Q2 2020, during the first COVID-19 lockdown) to +8.2% (Q2 2021, post-lockdown catch-up).

### 2.3 Missing observations

Roughly 10% of canton-provider-quarter cells are missing, concentrated in smaller cantons and newer provider categories. The category "Psychothérapeutes" (psychotherapists, separately billable since 2022) has 95% missing values over the full sample and is merged into "Autres" for estimation.

---

## 3. Econometric Framework

### 3.1 Model specification

Let $Y_t \in \mathbb{R}^{p_1 \times p_2}$ denote the matrix of observed per-insured costs at time $t$, with rows indexing cantons ($p_1 = 26$) and columns indexing provider groups ($p_2 = 10$). The DMFM decomposes this matrix as:

$$
Y_t = R F_t C' + E_t
$$

where $R \in \mathbb{R}^{p_1 \times k_1}$ and $C \in \mathbb{R}^{p_2 \times k_2}$ are loading matrices, $F_t \in \mathbb{R}^{k_1 \times k_2}$ is the latent factor matrix, and $E_t$ is idiosyncratic error with separable covariance $\text{Cov}(\text{vec}(E_t)) = K \otimes H$.

The critical assumption is that $k_1 \ll p_1$ and $k_2 \ll p_2$, so the common component $R F_t C'$ is low-rank. In the present application, I find that $k_1 = 1$ and $k_2 = 3$ suffice—a single canton factor and three provider factors capture the bulk of cross-sectional covariation.

The factor matrix evolves according to a Matrix Autoregressive (MAR) process:

$$
F_t = A F_{t-1} B' + U_t
$$

where $A \in \mathbb{R}^{k_1 \times k_1}$, $B \in \mathbb{R}^{k_2 \times k_2}$, and $U_t$ has covariance $Q \otimes P$. This specification yields $k_1^2 + k_2^2 = 1 + 9 = 10$ autoregressive parameters regardless of the number of cantons or provider groups—a considerable reduction from the $p_1 p_2 = 260$ parameters that would be required in a vector autoregression.

### 3.2 Estimation

Estimation follows Barigozzi & Trapin (2025). The algorithm iterates between:

**E-step:** Given current parameter estimates, compute smoothed factor estimates $\hat{F}_{t|T}$ and their covariances via the Kalman filter and smoother. Missing observations are handled by zeroing out the corresponding rows of the Kalman gain—no imputation is required.

**M-step:** Given smoothed factors, update loadings $(R, C)$ by regression, idiosyncratic covariances $(H, K)$ from residuals, and MAR parameters $(A, B)$ by vectorised least squares.

I apply seasonal differencing (order 4) before estimation to remove the pronounced quarterly pattern in healthcare utilisation. Forecasts are then integrated back to levels.

### 3.3 Rank selection

The number of factors $(k_1, k_2)$ is chosen by minimising the Bayesian Information Criterion over a grid search. Across the 15 validation windows, the modal selection is $(k_1, k_2) = (1, 3)$, though some windows favour $(1, 4)$ or $(1, 2)$. The single row factor can be interpreted as a "Swiss-wide cost trend" that loads heterogeneously on cantons; the three column factors distinguish provider groups with differing dynamics.

---

## 4. Empirical Results

### 4.1 Out-of-sample validation

I assess forecast accuracy using expanding-window validation. The first window trains on data through Q1 2021 and forecasts the subsequent four quarters; the window then expands by one quarter and the exercise repeats. This yields 15 forecast windows, with training sets ending between Q1 2021 and Q3 2024.

Table 2 reports the results:

| Metric | Mean | Std. Dev. |
|--------|------|-----------|
| RMSE   | 0.0115 | 0.0020 |
| MAE    | 0.0071 | 0.0015 |
| MAPE   | 8.31%  | 2.05%  |
| Bias   | −0.38% | 0.27%  |

The MAPE of 8.3% is reasonable for quarterly health cost data, which are subject to both sampling variation and genuine volatility from epidemiological shocks. The bias is slightly negative, indicating a tendency to under-forecast by about 0.4%—a minor and potentially correctable deficiency.

Figure 1 (not shown) plots actual versus predicted values for the Swiss aggregate across all validation windows. The correlation exceeds 0.99, and the scatter clusters tightly around the 45-degree line. Forecast errors show no systematic pattern by horizon: one-step-ahead errors are only marginally smaller than four-step-ahead errors, suggesting that the factor dynamics provide genuine predictive content rather than merely interpolating.

### 4.2 Full-sample estimates

Estimating on the complete sample (Q1 2016 – Q3 2025), the model selects $k_1 = 1$ and $k_2 = 3$. The row loading vector $R$ reveals that Geneva, Ticino, and Basel-Stadt load most heavily on the common factor, consistent with their status as high-cost cantons. The column loadings $C$ distinguish hospital care (both inpatient and outpatient) from ambulatory physician services and from pharmacy/medication expenditures.

The MAR coefficient matrices $A$ and $B$ imply stable dynamics: the maximum eigenvalue of the companion matrix is 0.87, well inside the unit circle. This rules out explosive behaviour in long-horizon forecasts.

### 4.3 Forecasts through 2026

Using the full-sample estimates, I generate forecasts for four quarters ahead (Q4 2025 through Q3 2026). Table 3 reports per-insured quarterly costs for selected cantons:

| Canton | 2025Q4 | 2026Q1 | 2026Q2 | 2026Q3 | YoY Growth 2026Q3 (%) |
|--------|--------|--------|--------|--------|----------------------|
| ZH     | 1,255  | 1,202  | 1,255  | 1,264  | 6.8                  |
| BE     | 1,368  | 1,305  | 1,300  | 1,314  | 7.7                  |
| GE     | 1,653  | 1,544  | 1,587  | 1,584  | 9.6                  |
| TI     | 1,594  | 1,502  | 1,606  | 1,544  | 7.1                  |
| AI     | 961    | 892    | 914    | 956    | 6.8                  |
| UR     | 1,086  | 1,071  | 1,108  | 1,131  | 15.1                 |
| NW     | 1,169  | 1,162  | 1,178  | 1,239  | 15.4                 |

*Note: All figures in CHF per insured per quarter. YoY growth compares 2026Q3 forecast to 2025Q3 observed.*

The year-on-year growth rates for 2026Q3—ranging from 5% to 15% across cantons—are higher than the historical average of 2–3% but consistent with the post-2021 acceleration. The model projects the strongest growth in smaller central Swiss cantons (Uri, Nidwalden, Obwalden), while urban cantons (Basel-Stadt, Zurich) show more moderate increases.

These projections should be interpreted cautiously: the confidence intervals (not yet implemented) would likely be wide, particularly for small cantons where idiosyncratic variation dominates.

---

## 5. Discussion

### 5.1 Interpretation of factors

The single row factor captures a Swiss-wide cost trend common to all cantons but with heterogeneous loadings. High-cost cantons (Geneva, Basel-Stadt, Ticino) load more strongly, implying that aggregate shocks—whether policy changes, epidemiological events, or technological diffusion—affect them disproportionately. This is consistent with the observation that cost containment measures often have larger absolute effects in already-expensive regions.

The three column factors admit an economic interpretation. The first distinguishes hospital-based care from ambulatory care; the second separates medication-related costs (pharmacies, Médicaments) from direct service provision; the third captures the distinct dynamics of long-term care (SPITEX, nursing homes). This structure is not imposed a priori but emerges from the data.

### 5.2 Policy implications

The forecasts suggest that the recent acceleration in health costs is not transitory. If the projections materialise, premiums will need to rise substantially in 2027 to maintain insurer solvency. For cantons with above-average growth (Uri, Nidwalden, Obwalden), premium increases could approach or exceed 10%.

Whether policy intervention can alter this trajectory is beyond the scope of a forecasting exercise. What the model does provide is a baseline against which the effects of reforms—reference pricing, ambulatory tariff revisions, hospital planning—can eventually be assessed.

### 5.3 Limitations

Several caveats apply. First, the model assumes that the factor structure is stable over time; structural breaks (such as the 2022 introduction of separate psychotherapy billing) may violate this assumption. Second, the Gaussian likelihood underlying the EM algorithm may be misspecified for cost data, which are bounded below and potentially skewed. Third, uncertainty quantification is incomplete: the current implementation provides point forecasts only, and bootstrap or Bayesian intervals would strengthen the analysis.

Finally, the forecasts are unconditional. They do not incorporate exogenous information on demographics, technology adoption, or policy changes. Extending the model to include covariates is a natural direction for future work.

---

## 6. Conclusion

This paper applies the Dynamic Matrix Factor Model of Barigozzi & Trapin (2025) to Swiss mandatory health insurance cost data. The model achieves an out-of-sample MAPE of 8.3% across 15 validation windows, with negligible bias. Forecasts through 2026 project continued cost growth of 6–9% annually, with substantial heterogeneity across cantons.

The DMFM offers a principled approach to high-dimensional panel forecasting that balances parsimony against flexibility. For Swiss health policy, the value lies in providing granular, interpretable projections that can inform premium regulation and cantonal budgeting. The methodology is implemented in the open-source Python package [KPOKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH), with replication code available in the repository.

---

## References

Barigozzi, M. & Trapin, L. (2025). Estimation and inference for large approximate dynamic matrix factor models. *Working paper*, [arXiv:2502.04112](https://arxiv.org/abs/2502.04112).

Cen, Z. & Lam, C. (2025). Tensor time series imputation through tensor factor modelling. *Journal of Econometrics*, 249, 105974.

Chen, E. Y. & Fan, J. (2023). Statistical inference for high-dimensional matrix-variate factor models. *Journal of the American Statistical Association*, forthcoming.

Federal Statistical Office (2024). *Monitoring der Krankenversicherungs-Kostenentwicklung*. Neuchâtel: BFS.

Yu, L., He, Y., Kong, X. & Zhang, X. (2022). Projected estimation for large-dimensional matrix factor models. *Journal of Econometrics*, 229(1), 201–217.

---

*Code and data: [github.com/Radzuweit-Analyse/Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH)*
*Last updated: January 2025*
