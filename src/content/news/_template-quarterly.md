---
title: "Swiss health costs, quarterly: QX YYYY"
description: "Our own rolling-4Q forecast scorecard and cost breakdown for QX YYYY, from the KPOKPCH dynamic matrix factor model."
pubDate: YYYY-MM-DD
tags: ["health insurance", "public policy", "cost growth", "economic outlook", "forecasting"]
draft: true
---

<!--
HOWTO -- quarterly forecast-scorecard template

This is a template, not a post: the leading underscore in the filename
(`_template-quarterly.md`) excludes it from Astro's content collection
entirely (Astro's own convention -- underscore-prefixed files under a
content collection directory are never loaded), and `draft: true` above is
belt-and-suspenders in case that file ever gets renamed. Copy this file to
`MOKKE-YYYY-qX.md` (matching the existing posts' filename/slug convention),
strip this comment block, and fill in the six sections below.

WHAT THIS SERIES IS, AND ISN'T
This series reports on OUR OWN model, not the FOPH/BAG's MOKKE commentary.
Every number in the six sections below is computed by us from the raw
MOKKE open data (via KPOKPCH), or is our own model's forecast. MOKKE is
cited once, in the footer, as a data source -- never summarized as content,
never as the source of a ranking, a phrase, or a "fastest-growing category"
claim. Concretely:
  - Do not reuse the FOPH cost-monitoring communique's structure, its list
    of "fastest-growing cost categories," or any of its sentences. If a
    sentence in this post could have been lifted from a FOPH press release,
    rewrite it from the numbers up.
  - Every figure and every ranking (cantons, cost groups) must trace to a
    number `quarterly_stats.py` printed, not to a FOPH table.
  - MOKKE/opendata.swiss is a data source, cited in the footer with a link.
    It is never the byline for a ranking or a growth claim in the body.

VINTAGE DISCIPLINE
A post dated for quarter QX YYYY may only use data through QX YYYY -- run
`quarterly_stats.py` with `--cutoff <that quarter>`, never a later one, and
never mix in anything published after this post's `pubDate` (later data,
policy outcomes that postdate the cutoff, later repo milestones). Each
post's figure is regenerated at that post's own vintage too (`--figure`
below) -- never reuse a figure generated at a different vintage.

HOW TO GET THE NUMBERS (run from the KPOKPCH repo root)

    uv run python applications/swiss_health_costs/quarterly_stats.py \
        --cutoff 2025Q4 --n-sims 1000 --figure

Add `--n-sims 5000` for a post whose figure will be the committed,
citable one (this repo used 5000 for the Q4 2025 and Q1 2026 posts). The
script prints, in order: the headline rolling-4Q YoY growth (this quarter
and last), cantonal dispersion (max/min/spread), cost-group movers
(fastest/slowest, biggest quarter-on-quarter accelerator), the scorecard
(a fresh S1 fit at the PREVIOUS quarter's vintage, forecasting exactly this
quarter -- point + 80% band, plus hit/miss against the actual headline),
and the outlook (a fresh S1 fit at THIS quarter's vintage, forecasting 4
quarters ahead). `--figure` additionally renders the annualized fan chart
to `docs/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png` --copy
that PNG into this website repo's `public/figures/` and reference it as
`/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png`.

For a BACKFILLED quarter (a vintage before this script/model existed
publicly): the scorecard is still `quarterly_stats.py`'s own rolling-origin
refit at the prior quarter's vintage -- that's a genuine backtest (the fit
only sees data through that earlier quarter), not a live prediction that
existed at the time. Label it explicitly as a backtest, e.g. "backtest
forecast, origin 2024Q4" -- never word it as if the model had actually
published that forecast back then.

SECTION-BY-SECTION
1. Headline: one line with the rolling-4Q YoY growth figure `quarterly_stats.py`
   prints, one sentence comparing it to last quarter's (accelerating /
   decelerating / flat -- the script tells you which).
2. Scorecard: what the model projected for this quarter as of last vintage's
   forecast (point + 80% band), the actual, hit/miss, one interpretive
   sentence (don't just repeat the numbers -- say what a hit or a miss
   here actually means).
3. One figure: the `--figure` output for this vintage, embedded as
   `![Annualized forecast fan chart, <cutoff> vintage](/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png)`.
4. Under the surface: 2-3 observations from the script's cantonal-dispersion
   and cost-group-movers output -- our own labels, our own numbers, our own
   framing. Not a copy of any FOPH ranking.
5. Refreshed outlook: the script's outlook figure (4 quarters ahead, point +
   80% band), one sentence.
6. Standing footer (reuse verbatim, only the two links + this repo's name
   need to stay current):

   *Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring
   dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All
   analysis and forecasts are our own -- see the
   [methodology article](/articles/kpopkpch_forecasting_article) and the
   [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*
-->

## Swiss health costs grew [+X.X%] in QX YYYY, [accelerating/decelerating] from [+X.X%] last quarter

Rolling-4-quarter, population-weighted cost per insured, year-on-year -- our own computation from the KPOKPCH tensor, not FOPH's own summary.

### Scorecard: how did our forecast do?

As of the [previous-quarter] vintage, our model projected [+X.X%] for this quarter (80% band [+X.X%] to [+X.X%]). The actual came in at [+X.X%] -- a [hit/miss]. [One honest sentence of interpretation.]

![Annualized forecast fan chart, QX YYYY vintage](/figures/forecast_ch_hairlines_annualized_yoy_YYYYQX.png)

### Under the surface

- [Cantonal dispersion: max/min canton, spread vs a year ago.]
- [Cost-group mover 1: our own ranking, our own label.]
- [Cost-group mover 2, or the biggest quarter-on-quarter accelerator.]

### Refreshed outlook

Looking 4 quarters ahead, the model now projects [+X.X%] by [target quarter] (80% band [+X.X%] to [+X.X%]).

---

*Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All analysis and forecasts are our own -- see the [methodology article](/articles/kpopkpch_forecasting_article) and the [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*
