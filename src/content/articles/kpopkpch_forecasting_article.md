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

> **In short**: Swiss mandatory health insurance (OKP) costs form a panel of 26 cantons and 11 cost groups, quarterly since 2016. I fit a Dynamic Matrix Factor Model (DMFM, Barigozzi and Trapin 2025) to this panel and forecast it forward. In rolling-origin validation (10 origins, 2022Q4 to 2025Q1, horizons 1 to 7 quarters) the model beats both a status-quo benchmark and a naive rolling-trend benchmark, significantly at every horizon through six quarters. It currently projects **+5.0%** annualized cost growth for 2026 (80% band +2.3% to +8.7%), below the 6 to 9% range this article quoted in an earlier, less careful draft. This piece also reports a negative result (COVID-era shock modeling didn't help) and is upfront about what the prediction intervals do and don't capture. Code, data, and the full validation suite are on [GitHub](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). A running scorecard of how each quarter's forecast actually performed lives in the [quarterly update series](/news).

## Introduction

Switzerland's mandatory health insurance (Obligatorische Krankenpflegeversicherung, OKP) covers essentially the whole resident population, and its cost growth feeds directly into next year's premiums. Costs are published quarterly, broken out by canton and by the type of care provider: inpatient hospital stays, outpatient physician visits, pharmacies, home care, and so on. That structure is genuinely two-dimensional. A canton's costs and a cost category's costs both move together with the rest of the panel, but for different reasons and probably at different speeds. Forecasting this well means finding a small number of common trends without either throwing away the cantonal detail (by looking only at the Swiss-wide total) or overfitting 26 times 11, or 286, separate series independently.

The Dynamic Matrix Factor Model of [Barigozzi and Trapin (2025)](https://arxiv.org/abs/2502.04112) is built for exactly this shape of problem. It factors a matrix-valued time series into row loadings (here, cantons), column loadings (cost groups), and a low-dimensional common factor that evolves over time, estimated by EM with a Kalman filter and smoother rather than by flattening the panel into one long vector. I implement and apply it here as [KPOKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH), an open-source package with the Swiss OKP application as its running example. This article works through the method, an honest account of how well it validates out of sample, a negative result worth reporting on its own, and the current 2026 forecast. Every quarter, the [quarterly update series](/news) scores that forecast against what actually happened and refreshes it. This article is the methodology behind that series, not a one-off exercise.

## Data

The panel runs quarterly from 2016Q1 through 2026Q1, 41 observations, across all 26 cantons and 11 cost groups: hospital inpatient stays, hospital outpatient care, two flavours of ambulatory physician services (with and without in-house lab work), physician-dispensed medications, pharmacies, laboratories, physiotherapy, home care (Spitex), nursing homes, and a residual "other" category. Figures are gross benefits per insured (Prestations brutes par assuré), in Swiss francs.

The source is the Federal Office of Public Health's (BAG/OFSP) [OKP cost-monitoring dashboard](https://www.bag.admin.ch/en/monitoring-of-ongoing-cost-development) (MOKKE), published quarterly via [opendata.swiss](https://opendata.swiss/). The fetching logic is adapted from [cleanopendata/foph-healthinsurance](https://github.com/cleanopendata/foph-healthinsurance). I use a committed data snapshot (retrieved 2026-07-03) so the validation numbers below are reproducible against a fixed panel rather than whatever opendata.swiss happens to serve on a given day. Refreshing it is a documented, one-command step, and any diff against the committed snapshot is reviewed before it's ever recommitted. A small, currently unused OFS dataset on health-personnel density by canton is prepared alongside the main panel but not yet wired into the model (more on that below). An insured-population series, also from the BAG dashboard, is used to build a Switzerland-wide aggregate as a population-weighted average across cantons rather than a naive sum. Cantons are per-insured rates, not totals, so summing them has no economic meaning.

## Method

Let $Y_t$ be the $26 \times 11$ matrix of per-insured costs at quarter $t$. The DMFM writes

$$
Y_t = R F_t C' + E_t,
$$

with $R$ ($26 \times k_1$) and $C$ ($11 \times k_2$) loading matrices, a small latent factor matrix $F_t$ ($k_1 \times k_2$), and idiosyncratic noise $E_t$. The factor matrix follows a first-order matrix autoregression, $F_t = A F_{t-1} B' + U_t$, estimated here as an unconstrained Kronecker product rather than separately identified $A$ and $B$. That detail matters less for the economics than for getting the estimator's vectorization convention right, which is where a fair amount of the implementation effort (and a regression test) actually went.

Two specifications are fit, both estimated on the raw quarterly data rather than fixed to a random walk:

- S1 (headline): year-on-year log-differences, $y_t = \log Y_t - \log Y_{t-4}$. Stationary by construction, which is what the model's estimation theory assumes.
- S2 (robustness check): seasonally-adjusted log-levels, fit with dynamics estimated directly rather than differenced.

S2 turns out not to be competitive. A stationary autoregression fit directly on levels reverts to the sample-average level, by construction. That is a costly restriction on a series that has trended upward for a decade, and the restriction gets worse, not better, as the forecast horizon grows. S1 doesn't have this problem because differencing removes the trend before the mean-reversion assumption is ever imposed. I keep S2 in the codebase as a documented robustness check precisely because it fails informatively, not because it's a candidate for production.

The rank story is worth being explicit about, because the two criteria I have for picking $(k_1, k_2)$ disagree. A BIC grid search and an eigenvalue-ratio criterion, the standard, in-sample ways of choosing the number of factors, both select $k_1 = k_2 = 1$: a single common trend on each side. But rolling-origin validation tells a different story. $k_1 = 1, k_2 = 2$ (a second cost-group factor) beats the in-sample-selected rank by 9 to 25% lower RMSE at every horizon, with no loss of stability in the fitted dynamics across rolling windows. That gap held up when I re-checked it against two additional quarters of data. I read this as genuine underfitting by the in-sample criteria: a second cost-group factor captures real structure that a single factor misses. I pin production to $k_1=1, k_2=2$ rather than defer to the automatic selection. This is a case where an out-of-sample check overruled an in-sample one, and I'd rather report that explicitly than paper over the disagreement.

## Validation

I evaluate S1 by rolling-origin pseudo-out-of-sample validation: refit the model at each of 10 origins from 2022Q4 through 2025Q1, forecast 1 to 7 quarters ahead from each, and compare the forecast to what was actually observed once it arrived. Origin counts shrink past horizon 4 simply because fewer origins are old enough to have a realized 5, 6, or 7-quarter-ahead outcome yet.

| horizon | n origins | status quo | S1 (YoY DMFM) | S2 (levels) | naive trend |
|---|---|---|---|---|---|
| 1 | 10 | 1.2 | 0.7 | 3.6 | 0.8 |
| 2 | 10 | 2.4 | 1.2 | 7.5 | 1.3 |
| 3 | 10 | 3.6 | 1.6 | 11.6 | 1.7 |
| 4 | 10 | 4.5 | 1.8 | 15.5 | 2.0 |
| 5 | 9 | 5.6 | 2.0 | 16.3 | 2.4 |
| 6 | 8 | 6.8 | 2.5 | 17.1 | 3.0 |
| 7 | 7 | 7.9 | 2.8 | 17.9 | 3.3 |

*RMSE, annualized Switzerland-wide total, thousands CHF per insured.*

![RMSE by forecast horizon, S1 (YoY DMFM) vs the status-quo, levels, and naive-trend benchmarks](/figures/validation_rmse_by_horizon.png)

S1 beats the pre-existing status-quo model at every horizon, and the gap is statistically significant (Diebold-Mariano, Harvey small-sample correction) at horizons 1 through 6. At horizon 7 the test itself becomes uninformative (the variance estimator turns non-positive with only 7 origins to work with), so I report that as a non-result rather than either a win or a loss. S1 also beats a naive rolling-12-month-trend benchmark on raw RMSE at every horizon. S2 is not competitive with either benchmark at any horizon, consistent with the mean-reversion problem described above.

Prediction intervals are built by simulating factor and idiosyncratic paths from the estimated innovation covariances (1,000 draws by default, 5,000 for the figures in this article), not by a closed-form formula. Checked against realized outcomes at the same 10 origins, the 80% interval on the annualized Switzerland-wide total covers almost exactly 80% of realized outcomes (32 of 40 origin-horizon pairs, horizons 1 to 4). The 95% interval covers all 40, which at this sample size isn't distinguishable from correct calibration either way. I'd treat both numbers as indicative rather than precise. Forty origin-horizon pairs is not a lot of data to calibrate a prediction interval against, and I say so rather than round it up to a stronger claim.

## A negative result: COVID-19 needed no special treatment

It's tempting to assume a disruption as large as the COVID-19 pandemic needs explicit handling, a shock term, or masking the affected quarters as missing, rather than just letting the model see it like any other data point. I tested that assumption rather than asserting it. Three variants, compared by the same rolling-origin validation as above: (A) no special treatment, letting COVID-affected quarters enter the year-on-year series untouched, (B) estimating dedicated shock effects for the pandemic dip and rebound via the model's own shock-estimation machinery, and (C) masking the affected quarters as missing data and letting the EM algorithm's missing-data handling take over.

Neither alternative improved on doing nothing. B was 2 to 7% worse than A in RMSE at horizons 1 through 4, and at one of ten origins its estimated innovation covariance came out non-positive-definite, crashing the downstream simulation outright. That is a stability failure on top of the accuracy loss. C was far worse again (RMSE 1.3 to 3 times A's, badly miscalibrated coverage at longer horizons, two more simulation-crashing failures), the expected cost of throwing away a fifth of an already-short 37-observation training series for one disruption. Production keeps variant A: no COVID treatment. I'm reporting this mainly because "we tried a more sophisticated approach and it didn't help" is a useful data point that's easy to skip past in a methods writeup that only describes what shipped.

## The 2026 forecast

Fit on the full sample through 2026Q1, S1 currently projects Switzerland-wide OKP costs per insured growing +5.0% in 2026 relative to 2025 (80% interval: +2.3% to +8.7%). The most recent quarter in any OKP release is provisional. Early invoicing is still catching up, and a single distorted quarter can drag a full calendar year's total in a direction the underlying trend disagrees with. For that reason, the primary annual figure above uses the model's own estimate of that quarter rather than its as-published value, the same treatment the fitting procedure already gives it (see the limitations section below). Taking the raw, as-published actual for that quarter instead gives +2.2% for 2026, the transparency line I still report alongside the primary figure. Every quarter's scorecard in the [update series](/news) gets re-checked once the provisional data firms up, since a quarter graded against a still-revising actual is not a final verdict.

The forecast fan chart at the top of this article shows the annualized rolling-4-quarter series through the current forecast horizon. The interval widens with horizon as both factor-path and idiosyncratic uncertainty compound.

## Limitations

Two limitations are worth stating plainly rather than burying in a footnote.

The prediction intervals reflect innovation noise only. The simulated 80/95% bands treat the fitted loadings, the factor dynamics, and both covariance matrices as known, not as themselves estimated with uncertainty from 41 quarterly observations. There is no parameter-uncertainty propagation: no parametric bootstrap refitting on resampled data, no Bayesian posterior over parameters. So the bands understate total forecast uncertainty, increasingly so at longer horizons where estimation error compounds on top of the innovation noise the bands do capture. Empirical coverage has only actually been checked against realized outcomes through horizon 4. The horizon 5 to 7 bands are produced by the identical simulation machinery but are, as of this snapshot, unvalidated.

The levels specification (S2) is a documented dead end, not a footnote. I keep it in the codebase specifically because a stationary model fit directly on trending levels is a natural first thing to try, and it's useful to have a citable, validated record of why it doesn't work here rather than a private note that it didn't seem to help.

More narrowly: the model assumes the factor structure itself is stable, so a genuine structural break, a new billing category, a major regulatory change, would need to be re-validated rather than assumed away. And the forecasts are unconditional. They don't take a stance on cost-containment policy, demographic shifts, or technology adoption, only on the historical dynamics of the panel itself.

## What's next

A few extensions are scoped but not yet built. Population-weighted normalization at the canton level, rather than only in the Switzerland-wide aggregate, is a natural refinement. Wiring in the health-personnel-density series already prepared alongside the cost panel, as an exogenous covariate rather than leaving it unused, is next after that. Further out: tensor-aware imputation (Cen and Lam 2025) for forecasting ahead of a fully-published cross-section, and an alternative prediction-interval construction (Barigozzi and Hallin 2019) as a check on the simulated bands above. There's also an open modeling question about which long-run mean the year-on-year specification should revert to. The full year-on-year sample (2017 to 2026) averages about 3.7% per year, while the most recent three years alone run closer to 4.7% per year. That is worth validating as its own specification variant rather than swapping in silently.

## Conclusion

The Dynamic Matrix Factor Model gives a principled way to forecast a genuinely two-dimensional panel, cantons and cost categories, without collapsing either dimension away. Applied to Swiss OKP costs, it beats both a status-quo and a naive-trend benchmark significantly through six quarters of rolling-origin validation, currently points to +5.0% cost growth for 2026, and comes with an honest account of where its intervals are and aren't validated, plus at least one negative result (COVID shock modeling) reported because it's useful, not because it's flattering. Code, data, and the full test suite are at [Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). The [quarterly update series](/news) is where the forecast gets re-scored as new data arrives.

## References

Barigozzi, M. and Trapin, L. (2025). Dynamic Matrix Factor Models. [arXiv:2502.04112](https://arxiv.org/abs/2502.04112)

Barigozzi, M. and Hallin, M. (2019). Generalized dynamic factor models and volatilities: consistency, rates, and prediction intervals. *Journal of Econometrics*, 216, 4 to 34. [arXiv:1811.10045](https://arxiv.org/abs/1811.10045)

Cen, Z. and Lam, C. (2025). Tensor time series imputation through tensor factor modelling. *Journal of Econometrics*. [arXiv:2403.13153](https://arxiv.org/abs/2403.13153)

Yu, L., He, Y., Kong, X. and Zhang, X. (2022). Projected estimation for large-dimensional matrix factor models. *Journal of Econometrics*, 229(1), 201 to 217. [arXiv:2003.10285](https://arxiv.org/abs/2003.10285)

---

*Code and data: [github.com/Radzuweit-Analyse/Kostenprognose-OKPCH](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH). Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring dashboard, via [opendata.swiss](https://opendata.swiss/).*
