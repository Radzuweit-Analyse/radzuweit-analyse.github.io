---
title: "Swiss health costs, quarterly: Q1 2025"
description: "Our own rolling-4Q forecast scorecard and cost breakdown for Q1 2025, from the KPOKPCH dynamic matrix factor model."
pubDate: 2025-05-10
tags: ["health insurance", "public policy", "cost growth", "economic outlook"]
---

## Swiss health costs grew 4.8% in Q1 2025, a slight acceleration from Q4 2024

Rolling-4-quarter, population-weighted cost per insured rose 4.80% year on year through Q1 2025, up from 4.40% the previous quarter. That is a 0.40 percentage point acceleration. This is our own computation from the KPOKPCH tensor, built on the FOPH/BAG MOKKE cost-monitoring data, not FOPH's own summary of it. The most recent quarter in any release is provisional (early invoicing is still catching up), so this figure can still revise; our scorecard entries note that.

### Scorecard: how did our backtest do?

KPOKPCH did not exist publicly in Q1 2025, so there is no live forecast to grade. Instead, a rolling-origin backtest, a fresh S1 (YoY DMFM) fit using only data through 2024Q4, exactly as production fits at each new vintage, projected 5.2% for Q1 2025 (80% band 2.9% to 7.8%). The actual, 4.80%, falls inside that band: a hit. The band is wide enough, close to 5 percentage points corner to corner, that a hit here mostly confirms the model wasn't badly miscalibrated a quarter out, not that it pinned the number precisely.

![Annualized forecast fan chart, Q1 2025 vintage](/figures/forecast_ch_hairlines_annualized_yoy_2025Q1.png)

### Under the surface

Cantonal spread narrowed slightly. Zug led at 7.47% and Schaffhausen trailed at 1.78%, a 5.69 point spread, down from 6.70 points a year earlier. SPITEX (home care) and the residual "Autres" group grew fastest, at 11.15% and 10.27% respectively, both well above the CH-wide average. Medication costs (Médicaments, médecin-dispensed) brought up the rear at 2.65%. "Autres" was also this quarter's biggest accelerator, up 3.27 percentage points on its own growth rate from Q4 2024, the single largest quarter-on-quarter swing among our 11 cost groups.

### Refreshed outlook

Looking 4 quarters ahead from this vintage, the model projects 4.65% by Q1 2026 (80% band 1.75% to 8.72%). That band reflects how much uncertainty compounds at a one-year horizon on a 37-quarter estimation sample.

---

*Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All analysis and forecasts are our own. See the [methodology article](/articles/kpopkpch_forecasting_article) and the [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*
