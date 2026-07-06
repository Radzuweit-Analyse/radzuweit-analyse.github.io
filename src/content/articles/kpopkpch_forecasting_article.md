---
title: "Forecasting mandatory health insurance expenditures in Switzerland"
description: "Applying a Dynamic Matrix Factor Model to Swiss OKP cost data: method, an honest validation record, a COVID-era negative result, and the 2026 forecast."
author: "Raphaël Radzuweit"
pubDate: 2026-07-01
updatedDate: 2026-07-06
readingTimeInMinutes: 12
tags: ["forecasting", "econometrics", "health insurance", "public policy", "python"]
featured: true
heroImage: "/figures/forecast_ch_hairlines_annualized_yoy.png"
---

# Forecasting Swiss mandatory health insurance costs with a Dynamic Matrix Factor Model

## Abstract

Switzerland's mandatory health insurance (OKP) costs form a panel of 26 cantons and 11 cost groups, observed quarterly since 2016. I apply the Dynamic Matrix Factor Model (DMFM) of Barigozzi and Trapin (2025), estimated by the EM algorithm with a Kalman filter and smoother, to forecast this panel. In rolling-origin validation (ten origins, 2022Q4 to 2025Q1, horizons of one to seven quarters), the model beats a status quo benchmark and a naive trend benchmark, significantly through six quarters (Diebold-Mariano test, Harvey correction). The model projects 5.0 percent cost growth for 2026, with an 80 percent interval of 2.3 to 8.7 percent. An earlier draft of this article reported 6 to 9 percent. I also report a negative result: modeling the COVID-19 disruption explicitly does not improve forecast accuracy. The prediction intervals reflect innovation uncertainty only, and I discuss that limitation directly. Code, data, and the validation suite are at [Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). A quarterly scorecard tracks forecast performance in the [update series](/news).

## 1. Introduction

Switzerland's mandatory health insurance (Obligatorische Krankenpflegeversicherung, OKP) covers essentially the entire resident population. Its cost growth feeds directly into the following year's premiums. Costs are published quarterly, broken out by canton and by type of care provider: inpatient hospital stays, outpatient physician visits, pharmacies, home care, and related categories. The panel is genuinely two-dimensional. A canton's costs and a cost category's costs both move with the rest of the panel, for different reasons and at different speeds. Forecasting it well means finding a small number of common trends while keeping both the cantonal detail and the cost-category detail, across 26 times 11, or 286, individual series.

The Dynamic Matrix Factor Model of Barigozzi and Trapin (2025) fits this shape of problem. It decomposes a matrix-valued time series into row loadings (cantons), column loadings (cost groups), and a low-dimensional common factor that evolves over time. Estimation uses the Expectation-Maximization algorithm with a Kalman filter and smoother. I implement and apply the model as [KPOKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH), an open-source package built around the Swiss OKP application. Section 2 describes the data. Section 3 sets out the model, the estimation approach, and a rank-selection decision. Section 4 reports rolling-origin validation. Section 5 reports a negative result on the COVID-19 disruption. Section 6 gives the 2026 forecast. Section 7 covers limitations, and Section 8 concludes. The [quarterly update series](/news) scores the current forecast against realized outcomes every quarter; this article is the methodology behind that series.

## 2. Data

The panel spans 2016Q1 through 2026Q1, 41 quarterly observations, across all 26 cantons and 11 cost groups: hospital inpatient stays, hospital outpatient care, two categories of ambulatory physician services (with and without in-house laboratory work), physician-dispensed medications, pharmacies, laboratories, physiotherapy, home care (Spitex), nursing homes, and a residual "other" category. Observations are gross benefits per insured (Prestations brutes par assuré), in Swiss francs.

The data come from the Federal Office of Public Health's (BAG/OFSP) [OKP cost-monitoring dashboard](https://www.bag.admin.ch/en/monitoring-of-ongoing-cost-development) (MOKKE), published quarterly through [opendata.swiss](https://opendata.swiss/). The retrieval logic is adapted from [cleanopendata/foph-healthinsurance](https://github.com/cleanopendata/foph-healthinsurance). All results here use a committed data snapshot, retrieved 2026-07-03, so the validation results are reproducible against a fixed panel. Refreshing the snapshot is a documented, single-command procedure, and any change against the committed data is reviewed before it is recommitted. A supplementary dataset on health-personnel density by canton, from the Federal Statistical Office (OFS), sits alongside the main panel but is not yet part of the model (Section 8). The Switzerland-wide aggregate is a population-weighted average across cantons, using an insured-population series from the same BAG dashboard. Cantonal observations are per-insured rates, not totals, so an unweighted sum would carry no economic meaning.

## 3. Method

### 3.1 Model specification

Let $Y_t$ denote the $26 \times 11$ matrix of per-insured costs at quarter $t$. The DMFM specifies

$$
Y_t = R F_t C' + E_t,
$$

where $R$ ($26 \times k_1$) and $C$ ($11 \times k_2$) are loading matrices, $F_t$ ($k_1 \times k_2$) is a latent factor matrix, and $E_t$ is idiosyncratic noise. The factor matrix follows a first-order matrix autoregression,

$$
F_t = A F_{t-1} B' + U_t,
$$

fitted as an unconstrained Kronecker product. Getting the estimator's vectorization convention right took a substantial share of the implementation effort, including a dedicated regression test.

Two specifications are estimated, both on the raw quarterly data:

1. S1 (headline specification): year-on-year log-differences, $y_t = \log Y_t - \log Y_{t-4}$. This is stationary by construction, consistent with the model's estimation theory.
2. S2 (robustness specification): seasonally adjusted log-levels, with dynamics estimated directly on the levels.

S2 is not competitive. A stationary autoregression fit to levels reverts to the sample-average level by construction. That is a poor fit for a series that has trended upward for a decade, and the gap widens with the forecast horizon. S1 avoids this because differencing removes the trend before mean reversion is imposed. S2 stays in the codebase as a documented, validated record of a specification that does not work well here.

### 3.2 Rank selection

Two criteria for choosing $(k_1, k_2)$ disagree, and the disagreement is worth stating plainly. A Bayesian information criterion grid search and an eigenvalue-ratio criterion, the standard in-sample tools for this, both select $k_1 = k_2 = 1$: a single common trend on each side of the panel. Rolling-origin validation points to $k_1 = 1, k_2 = 2$ instead. The second cost-group factor lowers RMSE by 9 to 25 percent at every horizon tested, with no loss of stability in the fitted dynamics across rolling windows, and the gap held up when I re-checked it against two additional quarters of data. I read this as underfitting by the in-sample criteria: a second cost-group factor captures structure that a single factor misses. Production estimation uses $k_1 = 1, k_2 = 2$. This is a case where the out-of-sample check overruled the in-sample one.

## 4. Validation

I evaluate S1 by rolling-origin pseudo-out-of-sample validation. The model is refit at ten origins from 2022Q4 through 2025Q1, forecast one to seven quarters ahead from each origin, and compared against the outcome once it was realized. Fewer origins have a realized outcome at longer horizons, since fewer are old enough to reach five, six, or seven quarters ahead.

| horizon | n origins | status quo | S1 (YoY DMFM) | S2 (levels) | naive trend |
|---|---|---|---|---|---|
| 1 | 10 | 1.2 | 0.7 | 3.6 | 0.8 |
| 2 | 10 | 2.4 | 1.2 | 7.5 | 1.3 |
| 3 | 10 | 3.6 | 1.6 | 11.6 | 1.7 |
| 4 | 10 | 4.5 | 1.8 | 15.5 | 2.0 |
| 5 | 9 | 5.6 | 2.0 | 16.3 | 2.4 |
| 6 | 8 | 6.8 | 2.5 | 17.1 | 3.0 |
| 7 | 7 | 7.9 | 2.8 | 17.9 | 3.3 |

*Table 1. RMSE, annualized Switzerland-wide total, thousands of CHF per insured.*

![RMSE by forecast horizon, S1 (YoY DMFM) versus the status-quo, levels, and naive-trend benchmarks](/figures/validation_rmse_by_horizon.png)

*Figure 1. RMSE by forecast horizon, S1 (YoY DMFM) versus the status-quo, levels, and naive-trend benchmarks.*

S1 has lower RMSE than the status-quo model at every horizon. The improvement is statistically significant (Diebold-Mariano test, Harvey small-sample correction) at horizons 1 through 6. At horizon 7 the test is uninformative: the variance estimator turns non-positive with only seven origins, so I report that horizon as inconclusive. S1 also has lower raw RMSE than a naive rolling-12-month-trend benchmark at every horizon. S2 is not competitive with either benchmark at any horizon, consistent with the mean-reversion problem in Section 3.1.

Prediction intervals come from simulating factor and idiosyncratic paths from the estimated innovation covariances: 1,000 simulated paths by default, 5,000 for the figures in this article. Checked against realized outcomes at the same ten origins, the 80 percent interval on the annualized Switzerland-wide total covers 32 of 40 origin-horizon pairs (horizons 1 through 4), close to nominal. The 95 percent interval covers all 40, which at this sample size is not distinguishable from correct calibration. Forty origin-horizon pairs is a small basis for calibrating a prediction interval, so I treat both coverage figures as approximate.

## 5. A negative result: the COVID-19 disruption

A disruption the size of the COVID-19 pandemic seems like it should need explicit treatment: a shock term, or masking the affected quarters as missing. I tested that. Three variants, compared with the same rolling-origin validation: (A) no special treatment, letting COVID-affected quarters enter the year-on-year series as ordinary observations; (B) estimated shock effects for the pandemic dip and rebound, through the model's shock-estimation machinery; (C) the affected quarters masked as missing data, handled by the EM algorithm's existing missing-data mechanism.

Neither B nor C improved on A. B produced RMSE 2 to 7 percent higher than A at horizons 1 through 4, and at one of ten origins its estimated innovation covariance was not positive definite, which crashed the downstream simulation. C was substantially worse still: RMSE 1.3 to 3 times A's, materially miscalibrated coverage at longer horizons, and two further simulation crashes. Masking discards about a fifth of an already short, 37-observation training series, and it shows. Production keeps variant A: no explicit COVID-19 treatment. A tested and rejected alternative is useful information on its own, so I report it here even though it did not change what shipped.

## 6. The 2026 forecast

Fitted on the full sample through 2026Q1, S1 projects Switzerland-wide OKP costs per insured growing 5.0 percent in 2026 relative to 2025, with an 80 percent interval of 2.3 to 8.7 percent. The most recent quarter in any OKP release is provisional. Invoicing for that quarter is still incomplete at the time of publication, and a single distorted quarter can pull a full calendar year's total away from the underlying trend. The primary figure above uses the model's own estimate of that quarter, the same treatment already given to it during estimation (Section 7). The raw, as-published actual for that quarter gives a 2026 growth figure of 2.2 percent instead; I report that alongside the primary figure as a transparency line. Each quarter's scorecard in the [update series](/news) gets re-checked once the provisional data settle, since a forecast graded against a still-revising actual is not a final verdict.

The forecast fan chart at the top of this article shows the annualized rolling-four-quarter series through the current forecast horizon. The interval widens with the horizon as factor-path uncertainty and idiosyncratic uncertainty both accumulate.

## 7. Limitations

Two limitations deserve more than a passing mention.

The prediction intervals reflect innovation uncertainty only. The simulated 80 and 95 percent bands treat the fitted loadings, the factor dynamics, and both covariance matrices as known quantities. They are not treated as themselves estimated with uncertainty from 41 quarterly observations. There is no parameter-uncertainty propagation: no parametric bootstrap on resampled data, no Bayesian posterior over parameters. The bands understate total forecast uncertainty, and increasingly so at longer horizons, where estimation error compounds on top of the innovation uncertainty the bands do capture. Empirical coverage has only been checked against realized outcomes through horizon 4. The horizon 5 to 7 bands come from the same simulation but are unvalidated as of this snapshot.

The levels specification (S2) is a documented negative finding. I keep it in the codebase because a stationary model fit directly to trending levels is a natural first thing to try, and a validated record of why it fails here is useful.

More narrowly, the model assumes the factor structure itself is stable over time. A genuine structural break, a new billing category, a major regulatory change, would need fresh validation. The forecasts are also unconditional: they say nothing about cost-containment policy, demographic change, or technology adoption, only about the historical dynamics of the panel.

## 8. Extensions

Several extensions are scoped but not built. Population-weighted normalization at the cantonal level, beyond the Switzerland-wide aggregate, is a natural next step. Wiring the health-personnel-density series into the model as a covariate comes after that. Further out: tensor-aware imputation (Cen and Lam, 2025) for forecasting ahead of a fully published cross-section, and an alternative prediction-interval construction (Barigozzi and Hallin, 2019) as a check on the simulated bands in Section 4. There is also an open question about which long-run mean the year-on-year specification should revert to. The full year-on-year sample, 2017 through 2026, averages about 3.7 percent per year; the most recent three years average closer to 4.7 percent per year. That choice needs its own validated specification variant, not a silent change.

## 9. Conclusion

The Dynamic Matrix Factor Model forecasts a genuinely two-dimensional panel, cantons and cost categories, without collapsing either dimension. Applied to Swiss OKP costs, it beats a status-quo benchmark and a naive-trend benchmark, significantly through six quarters of rolling-origin validation. It currently projects 5.0 percent cost growth for 2026. Its prediction intervals are validated in some places and not in others, and I have said which is which. One tested alternative, COVID-19 shock modeling, did not work and is reported anyway. Code, data, and the full test suite are at [Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). The [quarterly update series](/news) records how the forecast is re-scored as new data arrive.

## References

Barigozzi, M. and Trapin, L. (2025). Dynamic Matrix Factor Models. [arXiv:2502.04112](https://arxiv.org/abs/2502.04112)

Barigozzi, M. and Hallin, M. (2019). Generalized dynamic factor models and volatilities: consistency, rates, and prediction intervals. *Journal of Econometrics*, 216, 4 to 34. [arXiv:1811.10045](https://arxiv.org/abs/1811.10045)

Cen, Z. and Lam, C. (2025). Tensor time series imputation through tensor factor modelling. *Journal of Econometrics*. [arXiv:2403.13153](https://arxiv.org/abs/2403.13153)

Yu, L., He, Y., Kong, X. and Zhang, X. (2022). Projected estimation for large-dimensional matrix factor models. *Journal of Econometrics*, 229(1), 201 to 217. [arXiv:2003.10285](https://arxiv.org/abs/2003.10285)

---

*Code and data: [github.com/Radzuweit-Analyse/Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring dashboard, via [opendata.swiss](https://opendata.swiss/).*
