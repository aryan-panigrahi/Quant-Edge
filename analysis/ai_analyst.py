"""
AI Analyst — 100% local, zero downloads, no API keys required.

Components:
  1. Financial Lexicon Sentiment Scorer
     Based on the Loughran-McDonald (2011) financial word lists —
     the gold-standard academic lexicon for financial text analysis.
     Embedded directly as Python sets; no files, no internet, no NLTK.

  2. Rule-based Report Synthesizer
     Reads GBR forecast direction + lexicon sentiment + technical signals
     and assembles a professional Bloomberg-style Markdown report.
"""

from __future__ import annotations
import re
import textwrap
import pandas as pd


# ────────────────────────────────────────────────────────────────────────────
# Loughran-McDonald Financial Sentiment Lexicon (condensed)
# Source: Loughran & McDonald (2011), "When Is a Liability Not a Liability?"
# These word lists are freely available for academic / research use.
# ────────────────────────────────────────────────────────────────────────────

_LM_POSITIVE = {
    "able", "abundant", "acclaimed", "accomplish", "accomplished", "achieves",
    "achieving", "active", "advance", "advanced", "advantage", "advantaged",
    "advantageous", "beat", "beats", "benefited", "beneficial", "benefit",
    "best", "better", "breakthrough", "capacity", "climb", "climbs",
    "confidence", "confident", "consistent", "deliver", "delivers", "dividend",
    "dominant", "drive", "drives", "earnings", "effective", "efficient",
    "exceed", "exceeds", "excellent", "exceptional", "expand", "expands",
    "expansion", "gain", "gains", "grew", "grow", "growing", "growth",
    "high", "higher", "highest", "improve", "improved", "improvement",
    "innovative", "leader", "leading", "momentum", "opportunity", "outperform",
    "outperforms", "positive", "profit", "profitable", "profitability",
    "progress", "prosper", "record", "recovery", "rebound", "reliable",
    "resilient", "revenue", "rise", "rises", "rising", "robust", "solid",
    "soar", "soars", "stable", "strength", "strong", "stronger", "strongest",
    "success", "successful", "superior", "surge", "surges", "sustainable",
    "upbeat", "upgrade", "uptrend", "value", "win", "wins"
}

_LM_NEGATIVE = {
    "abort", "adverse", "allegation", "allegations", "bankrupt", "bankruptcy",
    "below", "breach", "burden", "close", "closing", "collapse", "concern",
    "concerns", "controversy", "costly", "crisis", "cutback", "cutbacks",
    "debt", "decline", "declining", "default", "deficit", "delay", "delayed",
    "deteriorate", "deterioration", "difficult", "difficulty", "disappoint",
    "disappointing", "disappointment", "dispute", "disruption", "downgrade",
    "downside", "downturn", "drop", "drops", "dropped", "erosion", "fail",
    "failed", "failing", "failure", "fall", "falling", "falls", "fell",
    "fine", "fines", "fraud", "impairment", "inefficient", "inflate",
    "inflation", "instability", "insufficient", "investigation", "lawsuit",
    "layoff", "layoffs", "legal", "liability", "liquidation", "litigation",
    "loss", "losses", "low", "lower", "lowest", "miss", "missed", "misses",
    "negative", "overdue", "penalty", "poor", "recession", "restructuring",
    "risk", "risks", "risky", "scrutiny", "selloff", "shortfall", "shrink",
    "shrinks", "slows", "slump", "stagnant", "struggle", "struggling",
    "uncertain", "uncertainty", "underperform", "underperforms", "unexpected",
    "unstable", "volatile", "volatility", "warning", "weak", "weaker",
    "weakest", "weakness", "worries", "worry", "writedown", "writeoff"
}

# Finance-specific boosters
_BOOSTERS = {"significantly", "sharply", "strongly", "substantially", "dramatically", "surpasses"}


def _tokenize(text: str) -> list[str]:
    """Lowercase-split on word boundaries."""
    return re.findall(r"[a-z]+", text.lower())


def score_headlines(headlines: list[str]) -> list[dict]:
    """
    Score a list of financial headlines using the L-M lexicon.

    Returns a list of dicts:
      { "label": "positive"|"negative"|"neutral",
        "score": float,   # winning label confidence (0–1)
        "positive": float,
        "negative": float,
        "neutral":  float }
    """
    results = []
    for headline in headlines:
        tokens   = _tokenize(headline)
        if not tokens:
            results.append({"label": "neutral", "score": 1.0,
                            "positive": 0.0, "negative": 0.0, "neutral": 1.0})
            continue

        boost = 1.5 if any(t in _BOOSTERS for t in tokens) else 1.0
        pos   = sum(1 for t in tokens if t in _LM_POSITIVE) * boost
        neg   = sum(1 for t in tokens if t in _LM_NEGATIVE) * boost
        total = pos + neg or 1e-6

        pos_conf = pos / (total + len(tokens) * 0.05)
        neg_conf = neg / (total + len(tokens) * 0.05)
        neu_conf = max(0.0, 1.0 - pos_conf - neg_conf)

        if pos > neg:
            label = "positive"
        elif neg > pos:
            label = "negative"
        else:
            label = "neutral"

        results.append({
            "label":    label,
            "score":    round(max(pos_conf, neg_conf, neu_conf), 4),
            "positive": round(pos_conf, 4),
            "negative": round(neg_conf, 4),
            "neutral":  round(neu_conf, 4),
        })

    return results


def sentiment_label(compound: float) -> str:
    """Map a -1…+1 compound score to a display label."""
    if compound > 0.05:
        return "Positive 🟢"
    elif compound < -0.05:
        return "Negative 🔴"
    return "Neutral ⚪"


# ── Rule-based Report Synthesizer ────────────────────────────────────────────
def generate_ai_report(
    api_key: str,            # kept for backwards-compat, ignored
    ticker: str,
    df: pd.DataFrame,
    signal_info: dict,
    news_df: pd.DataFrame,
) -> str:
    """
    Generate a Bloomberg-style analyst report entirely from local data.
    No internet, no API keys, no downloads.
    """
    # ── 1. Market snapshot ──────────────────────────────────────────────────
    current_price = float(df["Close"].iloc[-1])
    prev_price    = float(df["Close"].iloc[-2]) if len(df) >= 2 else current_price
    price_change  = current_price - prev_price
    price_pct     = (price_change / prev_price * 100) if prev_price else 0.0
    volatility    = float(df["Close"].pct_change().std() * 100)

    # ── 2. Signal summary ───────────────────────────────────────────────────
    overall    = signal_info.get("overall", "NEUTRAL")
    strength   = int(signal_info.get("strength", 0.5) * 100)
    indicators = signal_info.get("indicators", {})

    bullish_count = sum(1 for v in indicators.values()
                        if "BUY" in str(v).upper() or "BULLISH" in str(v).upper())
    bearish_count = sum(1 for v in indicators.values()
                        if "SELL" in str(v).upper() or "BEARISH" in str(v).upper())
    total_sigs    = len(indicators) or 1
    bull_pct      = int(bullish_count / total_sigs * 100)
    bear_pct      = int(bearish_count / total_sigs * 100)
    ind_lines     = "\n".join(f"  - **{k}:** {v}" for k, v in indicators.items())

    # ── 3. Sentiment aggregation ────────────────────────────────────────────
    if not news_df.empty and "Score" in news_df.columns:
        avg_score      = float(news_df["Score"].mean())
        pos_count      = int((news_df["Score"] > 0.05).sum())
        neg_count      = int((news_df["Score"] < -0.05).sum())
        total_articles = len(news_df)
        sentiment_str  = (
            "**Predominantly Positive**" if avg_score >  0.15 else
            "**Mildly Positive**"        if avg_score >  0.05 else
            "**Mildly Negative**"        if avg_score > -0.15 else
            "**Predominantly Negative**"
        )
        top_headlines = "\n".join(
            f"  - {row['Title']} ({row.get('Sentiment', '')})"
            for _, row in news_df.head(5).iterrows()
        )
    else:
        avg_score = 0.0
        pos_count = neg_count = total_articles = 0
        sentiment_str  = "**Neutral / No Data**"
        top_headlines  = "  - No recent headlines available."

    # ── 4. Direction words ──────────────────────────────────────────────────
    direction_tech = (
        "upside continuation"       if overall in ("BUY", "STRONG BUY")   else
        "downside pressure"         if overall in ("SELL", "STRONG SELL")  else
        "range-bound consolidation"
    )
    sentiment_bias = (
        "constructive" if avg_score >  0.05 else
        "cautious"     if avg_score < -0.05 else
        "neutral"
    )
    rec_action = (
        f"**ACCUMULATE** on dips toward the nearest support, targeting a risk/reward "
        f"of 1:2.5 given {strength}% algorithmic conviction."
    ) if overall in ("BUY", "STRONG BUY") else (
        f"**REDUCE EXPOSURE** at current levels; trail stop-loss above the recent swing high "
        f"with {strength}% bearish signal alignment."
    ) if overall in ("SELL", "STRONG SELL") else (
        f"**HOLD / MONITOR** — await a decisive range break before initiating new positions. "
        f"Signal strength at {strength}% is insufficient for a high-conviction directional trade."
    )

    news_confluence = (
        "The positive news flow provides a **fundamental tailwind** that reinforces the bullish technical setup."
        if avg_score > 0.05 and overall in ("BUY", "STRONG BUY") else
        "The negative news flow **compounds the bearish technical signal**, increasing downside risk."
        if avg_score < -0.05 and overall in ("SELL", "STRONG SELL") else
        "The news flow **diverges from the technical signal** — wait for confirmation before committing capital."
        if (avg_score > 0.05) != (overall in ("BUY", "STRONG BUY")) else
        "News and technicals are broadly **aligned in neutral territory** — no high-conviction catalyst present."
    )

    # ── 5. Compose report ───────────────────────────────────────────────────
    report = textwrap.dedent(f"""\
    ## {ticker} — Quantitative Intelligence Briefing

    **Price:** ₹{current_price:,.2f}  |  **Change:** {price_change:+.2f} ({price_pct:+.2f}%)  |  **Historical Volatility:** {volatility:.2f}%

    ---

    ### Technical Assessment

    The indicator cluster for **{ticker}** is registering a **{overall}** signal at **{strength}% strength**.
    Of {total_sigs} quantitative indicators assessed, {bullish_count} ({bull_pct}%) are aligned bullishly
    and {bearish_count} ({bear_pct}%) are skewed bearishly, suggesting {direction_tech}.

{ind_lines}

    The price is currently ₹{current_price:,.2f}, with intraday volatility tracking at **{volatility:.2f}%** —
    {"elevated, warranting tighter position sizing." if volatility > 2.0 else "contained, permitting standard position sizing."}

    ---

    ### News & Sentiment Impact

    Loughran-McDonald lexicon analysis across **{total_articles} recent headlines** yields an aggregate score of
    **{avg_score:+.3f}**, classified as {sentiment_str}.
    {pos_count} articles carry a positive bias; {neg_count} carry a negative bias.
    The news flow is **{sentiment_bias}** relative to the technical posture.

    Recent catalysts:
{top_headlines}

    {news_confluence}

    ---

    ### Institutional Recommendation

    {rec_action}

    **Risk Parameters:** Define stop-loss at the prior session low. Position size should not exceed
    {"2% of portfolio NAV given elevated volatility." if volatility > 2.0 else "3–5% of portfolio NAV given controlled volatility."}
    Monitor for any change in the signal cluster before adding to the position.

    *— Generated by QuantEdge AI Analyst Engine (L-M Lexicon + Gradient Boosting, local inference)*
    """)

    return report
