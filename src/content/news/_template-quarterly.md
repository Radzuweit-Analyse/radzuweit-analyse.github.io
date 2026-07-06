---
title: "Swiss health costs, quarterly: QX YYYY"
description: "Our own rolling-4Q forecast scorecard and cost breakdown for QX YYYY, from the KPOKPCH dynamic matrix factor model."
pubDate: YYYY-MM-DD
tags: ["health insurance", "public policy", "cost growth", "economic outlook", "forecasting"]
draft: true
---

<!--
HOWTO: quarterly forecast-scorecard template

This is a template, not a post. The leading underscore in the filename
(`_template-quarterly.md`) excludes it from Astro's content collection
entirely (Astro's own convention: underscore-prefixed files under a
content collection directory are never loaded), and `draft: true` above is
belt and suspenders in case that file ever gets renamed. Copy this file to
`MOKKE-YYYY-qX.md` (matching the existing posts' filename/slug convention),
strip this comment block, and fill in the six sections below.

WHAT THIS SERIES IS, AND ISN'T
This series reports on our own model, not the FOPH/BAG's MOKKE commentary.
Every number in the six sections below is computed by us from the raw
MOKKE open data (via KPOKPCH), or is our own model's forecast. MOKKE is
cited once, in the footer, as a data source. It is never summarized as
content, and never the source of a ranking, a phrase, or a "fastest
growing category" claim. Concretely:
  - Do not reuse the FOPH cost-monitoring communique's structure, its list
    of "fastest growing cost categories," or any of its sentences. If a
    sentence in this post could have been lifted from a FOPH press release,
    rewrite it from the numbers up.
  - Every figure and every ranking (cantons, cost groups) must trace to a
    number `quarterly_stats.py` printed, not to a FOPH table.
  - MOKKE/opendata.swiss is a data source, cited in the footer with a link.
    It is never the byline for a ranking or a growth claim in the body.

VINTAGE DISCIPLINE
A post dated for quarter QX YYYY may only use data through QX YYYY. Run
`quarterly_stats.py` with `--cutoff <that quarter>`, never a later one, and
never mix in anything published after this post's `pubDate` (later data,
policy outcomes that postdate the cutoff, later repo milestones). Each
post's figure is regenerated at that post's own vintage too (`--figure`
below). Never reuse a figure generated at a different vintage.

PROVISIONAL QUARTERS (standing rule)
The most recent quarter in any KPOKPCH data vintage is provisional. Early
invoicing is still catching up, and that single quarter can be revised
upward or downward once later releases fill in. Two consequences follow
everywhere in this series:
  - Any annual or annualized figure that would otherwise mix a trusted
    model forecast with that provisional quarter uses the model's own
    estimate of it instead (this is what `quarterly_stats.py` and the
    underlying pipeline now do by default; see the methodology article's
    limitations section). Report the raw, as-published actual alongside it
    once, labelled, as the transparency line, the way the Q1 2026 post's
    scorecard and the methodology article's 2026 forecast section do.
  - Every scorecard verdict (hit or miss) graded against a provisional
    actual is provisional too. Say so plainly rather than presenting it as
    final, and re-check it in the next update once the data has settled.

HOW TO GET THE NUMBERS (run from the KPOKPCH repo root)

    uv run python applications/swiss_health_costs/quarterly_stats.py \
        --cutoff 2025Q4 --n-sims 1000 --figure

Add `--n-sims 5000` for a post whose figure will be the committed,
citable one (this repo used 5000 for the Q4 2025 and Q1 2026 posts). The
script prints, in order: the headline rolling-4Q YoY growth (this quarter
and last), cantonal dispersion (max/min/spread), cost-group movers
(fastest/slowest, biggest quarter-on-quarter accelerator), the scorecard
(a fresh S1 fit at the previous quarter's vintage, forecasting exactly this
quarter, point plus 80% band, plus hit/miss against the actual headline),
and the outlook (a fresh S1 fit at this quarter's vintage, forecasting 4
quarters ahead). `--figure` additionally renders the annualized fan chart
to `docs/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png`. Copy
that PNG into this website repo's `public/figures/` and reference it as
`/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png`.

For a backfilled quarter (a vintage before this script or model existed
publicly), the scorecard is still `quarterly_stats.py`'s own rolling-origin
refit at the prior quarter's vintage. That is a genuine backtest (the fit
only sees data through that earlier quarter), not a live prediction that
existed at the time. Label it explicitly as a backtest, for example
"backtest forecast, origin 2024Q4." Never word it as if the model had
actually published that forecast back then.

SECTION BY SECTION
1. Headline: one line with the rolling-4Q YoY growth figure `quarterly_stats.py`
   prints, one sentence comparing it to last quarter's (accelerating,
   decelerating, or flat; the script tells you which). Note in passing that
   the freshest print is provisional.
2. Scorecard: what the model projected for this quarter as of last vintage's
   forecast (point plus 80% band), the actual, hit or miss, one interpretive
   sentence (say what a hit or a miss here actually means, and flag if the
   actual it's graded against is still provisional).
3. One figure: the `--figure` output for this vintage, embedded as
   `![Annualized forecast fan chart, <cutoff> vintage](/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png)`.
4. Under the surface: two or three observations from the script's cantonal
   dispersion and cost-group-movers output, our own labels, our own
   numbers, our own framing. Not a copy of any FOPH ranking.
5. Refreshed outlook: the script's outlook figure (4 quarters ahead, point
   plus 80% band), one sentence.
6. Standing footer (reuse verbatim, only the two links and this repo's name
   need to stay current):

   *Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring
   dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All
   analysis and forecasts are our own. See the
   [methodology article](/articles/kpopkpch_forecasting_article) and the
   [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*

PROSE STYLE
Write like a person, not a press release or an AI assistant. No em dashes,
no spaced or double hyphens standing in for them (use a comma, a
parenthetical, or a new sentence instead). No filler connectors ("it's
worth noting," "importantly," "moreover," and the like). No "not just X,
but Y" constructions. No rule-of-three flourishes. Bold only the single
most important figure in the post, if any; never bold for mid-sentence
emphasis. No exclamation marks, no emojis. Short, declarative sentences.
Concrete numbers over adjectives: "grew 5.1%," not "grew sharply."
-->

## Swiss health costs grew [X.X%] in QX YYYY, [accelerating / decelerating / holding steady]

Rolling-4-quarter, population-weighted cost per insured, year on year: our own computation from the KPOKPCH tensor, not FOPH's own summary. [One sentence comparing to last quarter's figure.] This quarter's print is provisional and can still revise.

### Scorecard: how did our forecast do?

As of the [previous-quarter] vintage, our model projected [X.X%] for this quarter (80% band [X.X%] to [X.X%]). The actual came in at [X.X%]: a [hit / miss]. [One honest sentence of interpretation. If the actual is provisional, say so and note the verdict may be revisited.]

![Annualized forecast fan chart, QX YYYY vintage](/figures/forecast_ch_hairlines_annualized_yoy_YYYYQX.png)

### Under the surface

[Cantonal dispersion: max/min canton, spread vs a year ago.] [Cost-group mover: our own ranking, our own label.] [Optionally, the biggest quarter-on-quarter accelerator.]

### Refreshed outlook

Looking 4 quarters ahead, the model now projects [X.X%] by [target quarter] (80% band [X.X%] to [X.X%]).

---

*Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All analysis and forecasts are our own. See the [methodology article](/articles/kpopkpch_forecasting_article) and the [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*
