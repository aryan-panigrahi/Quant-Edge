"""
Data fetching layer — all yfinance and news API calls live here.
Includes caching, error handling, and graceful fallbacks.
"""

import yfinance as yf
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from GoogleNews import GoogleNews

import config as cfg

# ── Ensure VADER lexicon is available ──────────────────────────
try:
    nltk.data.find("sentiment/vader_lexicon.zip")
except LookupError:
    nltk.download("vader_lexicon", quiet=True)


# ── Market Data (Nifty 50 + VIX) ──────────────────────────────
def fetch_market_data() -> pd.DataFrame | None:
    """
    Fetch intraday Nifty 50 and India VIX data.
    Returns a DataFrame with 'Close' prices, or None on failure.
    """
    try:
        data = yf.download(
            cfg.MARKET_TICKERS,
            period="5d",       # 5 days so we always have data even on holidays
            interval="5m",
            progress=False,
            threads=True,
        )

        if data.empty:
            return None

        # Handle MultiIndex columns from multi-ticker download
        if isinstance(data.columns, pd.MultiIndex):
            df_close = data["Close"]
        else:
            df_close = data[["Close"]]

        # Keep only today's data if available, else last trading day
        df_close = df_close.dropna(how="all")
        return df_close

    except Exception:
        return None


# ── Individual Stock Data ──────────────────────────────────────
def fetch_stock_data(ticker: str, period: str = "5d") -> pd.DataFrame | None:
    """
    Fetch intraday OHLCV data (5m interval) for a single stock.
    Tries Ticker.history first, falls back to yf.download.
    """
    try:
        stock = yf.Ticker(ticker)
        data = stock.history(period=period, interval="5m", auto_adjust=True)

        # Fallback
        if data.empty:
            data = yf.download(ticker, period=period, interval="5m", progress=False)

        if data.empty:
            return None

        # Remove timezone info to avoid datetime math issues
        if data.index.tz is not None:
            data.index = data.index.tz_localize(None)

        return data

    except Exception:
        return None


# ── Live Quote (Current Price + Change) ───────────────────────
def fetch_live_quote(ticker: str) -> dict | None:
    """
    Fetch live quote info (current price, change, volume, etc.).
    """
    try:
        stock = yf.Ticker(ticker)
        info = stock.fast_info
        hist = stock.history(period="2d")

        if hist.empty:
            return None

        current = hist["Close"].iloc[-1]
        previous = hist["Close"].iloc[-2] if len(hist) >= 2 else current
        change = current - previous
        change_pct = (change / previous) * 100 if previous != 0 else 0

        return {
            "price": current,
            "change": change,
            "change_pct": change_pct,
            "volume": hist["Volume"].iloc[-1] if "Volume" in hist.columns else 0,
            "high": hist["High"].iloc[-1],
            "low": hist["Low"].iloc[-1],
            "open": hist["Open"].iloc[-1],
        }
    except Exception:
        return None


# ── News Sentiment ─────────────────────────────────────────────
def fetch_news_sentiment(ticker: str) -> pd.DataFrame:
    """
    Fetch news from Google News, score sentiment with VADER.
    Returns DataFrame with columns: Date, Title, Source, Score, Sentiment, Link
    """
    try:
        stock = yf.Ticker(ticker)
        news_items = stock.news
        
        if not news_items:
            return pd.DataFrame()

        analyzer = SentimentIntensityAnalyzer()
        rows = []

        for item in news_items[:12]:
            # Handle nested logic depending on yfinance version
            content = item.get("content", item)
            
            title = content.get("title", "")
            if not title:
                continue

            link = content.get("clickThroughUrl", {}).get("url", content.get("link", "#"))
            date_str = content.get("pubDate", "Recent").split("T")[0]
            
            provider = content.get("provider", {})
            source = provider.get("displayName", content.get("publisher", "Market News"))
            
            score = analyzer.polarity_scores(title)["compound"]

            if score > 0.05:
                label = "Positive 🟢"
            elif score < -0.05:
                label = "Negative 🔴"
            else:
                label = "Neutral ⚪"

            rows.append({
                "Date": date_str,
                "Title": title,
                "Source": source,
                "Score": round(score, 3),
                "Sentiment": label,
                "Link": link,
            })

        return pd.DataFrame(rows)

    except Exception:
        return pd.DataFrame()
