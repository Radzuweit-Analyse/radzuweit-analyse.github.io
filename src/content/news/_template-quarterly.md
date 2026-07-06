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
strip this comment block, and fill in the six content slots below.

WHAT THIS SERIES IS, AND ISN'T
This series reports on our own model. Every number in the six slots below
is computed by us from the raw MOKKE open data (via KPOKPCH), or is our own
model's forecast. MOKKE is cited once, in the footer, as a data source. It
is never summarized as content, and never the source of a ranking, a
phrase, or a "fastest growing category" claim. Concretely:
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
    once, labelled, when it materially changes the picture, the way the
    Q1 2026 post's scorecard and the methodology article's 2026 forecast
    section do. Not every post needs this line; only add it where the
    provisional print is doing real work in the narrative.
  - Every scorecard verdict (hit or miss) graded against a provisional
    actual is provisional too. Say so plainly rather than presenting it as
    final, and re-check it in the next update once the data has settled.

HOW TO GET THE NUMBERS (run from the KPOKPCH repo root)

    uv run python applications/swiss_health_costs/quarterly_stats.py \
        --cutoff 2025Q4 --n-sims 1000 --figure

Add `--n-sims 5000` for a post whose figure will be the committed,
citable one. The script prints, in order: the headline rolling-4Q YoY
growth (this quarter and last), cantonal dispersion (max/min/spread),
cost-group movers (fastest/slowest, biggest quarter-on-quarter
accelerator), the scorecard (a fresh S1 fit at the previous quarter's
vintage, forecasting exactly this quarter, point plus 80% band, plus
hit/miss against the actual headline), and the outlook (a fresh S1 fit at
this quarter's vintage, forecasting 4 quarters ahead). `--figure`
additionally renders the annualized fan chart to
`docs/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png`. Copy that
PNG into this website repo's `public/figures/` and reference it as
`/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png`.

For a backfilled quarter (a vintage before this script or model existed
publicly), the scorecard is still `quarterly_stats.py`'s own rolling-origin
refit at the prior quarter's vintage. That is a genuine backtest (the fit
only sees data through that earlier quarter), not a live prediction that
existed at the time. Label it explicitly as a backtest, for example
"backtest forecast, origin 2024Q4." Never word it as if the model had
actually published that forecast back then.

SIX CONTENT SLOTS
1. Headline (H2): the rolling-4Q YoY growth figure, one comparison to last
   quarter (accelerating, decelerating, or flat), and whatever was actually
   notable this quarter (a record spread, a first decline, the largest
   swing yet, a near-miss). Lead with the notable thing, not a fixed
   formula. Note in passing, once, that the freshest print is provisional.
2. Scorecard: what the model projected for this quarter as of last
   vintage's forecast (point plus 80% band), the actual, hit or miss, one
   interpretive sentence on what that hit or miss actually means. Flag if
   the actual it's graded against is still provisional.
3. One figure: the `--figure` output for this vintage, embedded as
   `![Annualized forecast fan chart, <cutoff> vintage](/figures/forecast_ch_hairlines_annualized_yoy_<cutoff>.png)`.
4. Under the surface: cantonal dispersion (max/min canton, spread vs a
   year ago) and a cost-group mover, in our own words. Cap this slot at
   the two most telling numbers; name cantons and cost groups without
   restating every individual rate, and optionally mention the biggest
   quarter-on-quarter accelerator qualitatively. The repo and the figure
   carry the full detail; this slot does not need to.
5. Refreshed outlook: the script's outlook figure (4 quarters ahead, point
   plus 80% band), one sentence.
6. Standing footer (reuse verbatim, only the two links and this repo's name
   need to stay current):

   *Data: Federal Office of Public Health (BAG/OFSP) OKP cost-monitoring
   dashboard (MOKKE), via [opendata.swiss](https://opendata.swiss/). All
   analysis and forecasts are our own. See the
   [methodology article](/articles/kpopkpch_forecasting_article) and the
   [KPOKPCH repository](https://github.com/Radzuweit-Analyse/Kostenprognose-OKPCH).*

VARY THE PHRASING EVERY QUARTER
This is a series a reader may follow for years. Nothing outside the
standing footer should read the same way twice in a row. Before writing,
skim the last two or three published posts and make sure this one doesn't
reuse their sentence frames. Specifically banned, because a past pass
found them repeated across most or all posts:
  - Headline skeleton "Swiss health costs grew X% in QY, <participle>"
    repeated verbatim post to post. Vary the lead every time.
  - The full rolling-4Q/population-weighted/provisional-quarter
    explanation restated in full every quarter. State it fully in one
    post if a new reader needs it; elsewhere, a half-sentence or the
    standing footer is enough.
  - Scorecard verdicts phrased as "The actual, X%, lands inside that
    band: a hit." The colon-verdict construction generally, not just this
    exact sentence, is banned. Say hit or miss in whatever words fit that
    quarter's story.
  - Outlook sections opening with "Looking 4 quarters ahead from this
    vintage." Vary how the horizon is introduced.
  - Pet phrases, retired for good: "the freshest print," "brought up the
    rear," "this series has flagged before," "corner to corner."
  - The "X, not Y" / "rather than Y" corrective tic (stating a fact, then
    denying a misreading of it). Write the positive claim strongly enough
    that the misreading doesn't arise, instead of stating and then
    correcting it. This construction should be rare across the whole
    series, not a habit within a single post.

PROSE STYLE
Write like a person, not a press release or an AI assistant. No em dashes,
no spaced or double hyphens standing in for them (use a comma, a
parenthetical, or a new sentence instead). No filler connectors ("it's
worth noting," "importantly," "moreover," and the like). No "not just X,
but Y" constructions. No rule-of-three flourishes. Bold only the single
most important figure in the post, if any; never bold for mid-sentence
emphasis. No exclamation marks, no emojis. Vary sentence length
deliberately; three sentences in a row with the same shape reads like a
template even when the words differ. One appositive or parenthetical per
sentence, at most. Concrete numbers over adjectives: "grew 5.1%," not
"grew sharply." In prose, one decimal place at most, and integers where
the decimal adds nothing ("a spread of 8 points," not "a spread of 7.97
points"); that precision still belongs in the figure and the repo.
-->
