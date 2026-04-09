"""
Technical analysis indicators.
All functions take a DataFrame with a 'Close' column and return the DataFrame
with new columns added.
"""

import pandas as pd
import config as cfg


def add_sma(df: pd.DataFrame, window: int = None) -> pd.DataFrame:
    """Simple Moving Average."""
    w = window or cfg.DEFAULT_MA_WINDOW
    df[f"SMA_{w}"] = df["Close"].rolling(window=w).mean()
    return df


def add_ema(df: pd.DataFrame, window: int = None) -> pd.DataFrame:
    """Exponential Moving Average — reacts faster to recent prices."""
    w = window or cfg.DEFAULT_MA_WINDOW
    df[f"EMA_{w}"] = df["Close"].ewm(span=w, adjust=False).mean()
    return df


def add_rsi(df: pd.DataFrame, period: int = None) -> pd.DataFrame:
    """
    Relative Strength Index (0-100).
    > 70 = overbought, < 30 = oversold.
    """
    p = period or cfg.DEFAULT_RSI_PERIOD
    delta = df["Close"].diff()

    gain = delta.where(delta > 0, 0.0)
    loss = (-delta).where(delta < 0, 0.0)

    avg_gain = gain.rolling(window=p, min_periods=p).mean()
    avg_loss = loss.rolling(window=p, min_periods=p).mean()

    # Use Wilder's smoothing after the initial SMA
    for i in range(p, len(avg_gain)):
        avg_gain.iloc[i] = (avg_gain.iloc[i - 1] * (p - 1) + gain.iloc[i]) / p
        avg_loss.iloc[i] = (avg_loss.iloc[i - 1] * (p - 1) + loss.iloc[i]) / p

    rs = avg_gain / avg_loss
    df["RSI"] = 100 - (100 / (1 + rs))
    return df


def add_macd(
    df: pd.DataFrame,
    fast: int = None,
    slow: int = None,
    signal: int = None,
) -> pd.DataFrame:
    """
    MACD = fast EMA - slow EMA.
    Signal = EMA of MACD.
    Histogram = MACD - Signal.
    """
    f = fast or cfg.MACD_FAST
    s = slow or cfg.MACD_SLOW
    sig = signal or cfg.MACD_SIGNAL

    ema_fast = df["Close"].ewm(span=f, adjust=False).mean()
    ema_slow = df["Close"].ewm(span=s, adjust=False).mean()

    df["MACD"] = ema_fast - ema_slow
    df["MACD_Signal"] = df["MACD"].ewm(span=sig, adjust=False).mean()
    df["MACD_Hist"] = df["MACD"] - df["MACD_Signal"]
    return df


def add_bollinger_bands(
    df: pd.DataFrame,
    window: int = None,
    num_std: float = None,
) -> pd.DataFrame:
    """
    Bollinger Bands = SMA ± (num_std × rolling std).
    Price near upper band = potentially overbought.
    Price near lower band = potentially oversold.
    """
    w = window or cfg.BOLLINGER_WINDOW
    n = num_std or cfg.BOLLINGER_STD

    sma = df["Close"].rolling(window=w).mean()
    std = df["Close"].rolling(window=w).std()

    df["BB_Upper"] = sma + (n * std)
    df["BB_Middle"] = sma
    df["BB_Lower"] = sma - (n * std)
    return df


def add_all_indicators(df: pd.DataFrame, ma_window: int = None) -> pd.DataFrame:
    """Add all indicators to the dataframe."""
    w = ma_window or cfg.DEFAULT_MA_WINDOW
    df = add_sma(df, w)
    df = add_ema(df, w)
    df = add_rsi(df)
    df = add_macd(df)
    df = add_bollinger_bands(df)
    return df


def get_signal_summary(df: pd.DataFrame, ma_window: int = None) -> dict:
    """
    Generate a comprehensive signal summary from the latest row.
    Returns a dict with signal, strength, and individual indicator readings.
    """
    w = ma_window or cfg.DEFAULT_MA_WINDOW
    last = df.iloc[-1]
    signals = {}

    # SMA Signal
    sma_col = f"SMA_{w}"
    if sma_col in df.columns:
        signals["SMA"] = "BUY" if last["Close"] > last[sma_col] else "SELL"

    # EMA Signal
    ema_col = f"EMA_{w}"
    if ema_col in df.columns:
        signals["EMA"] = "BUY" if last["Close"] > last[ema_col] else "SELL"

    # RSI Signal
    if "RSI" in df.columns and pd.notna(last["RSI"]):
        rsi_val = last["RSI"]
        if rsi_val > cfg.RSI_OVERBOUGHT:
            signals["RSI"] = "SELL"
        elif rsi_val < cfg.RSI_OVERSOLD:
            signals["RSI"] = "BUY"
        else:
            signals["RSI"] = "NEUTRAL"

    # MACD Signal
    if "MACD" in df.columns and "MACD_Signal" in df.columns:
        if pd.notna(last["MACD"]) and pd.notna(last["MACD_Signal"]):
            signals["MACD"] = "BUY" if last["MACD"] > last["MACD_Signal"] else "SELL"

    # Bollinger Bands Signal
    if "BB_Upper" in df.columns and "BB_Lower" in df.columns:
        if pd.notna(last["BB_Upper"]) and pd.notna(last["BB_Lower"]):
            if last["Close"] >= last["BB_Upper"]:
                signals["Bollinger"] = "SELL"
            elif last["Close"] <= last["BB_Lower"]:
                signals["Bollinger"] = "BUY"
            else:
                signals["Bollinger"] = "NEUTRAL"

    # Overall verdict
    buy_count = sum(1 for v in signals.values() if v == "BUY")
    sell_count = sum(1 for v in signals.values() if v == "SELL")
    total = len(signals)

    if total == 0:
        overall = "NEUTRAL"
        strength = 0
    elif buy_count > sell_count:
        overall = "BUY"
        strength = buy_count / total
    elif sell_count > buy_count:
        overall = "SELL"
        strength = sell_count / total
    else:
        overall = "NEUTRAL"
        strength = 0.5

    return {
        "overall": overall,
        "strength": strength,
        "indicators": signals,
        "details": {
            "price": last["Close"],
            "sma": last.get(sma_col),
            "ema": last.get(ema_col),
            "rsi": last.get("RSI"),
            "macd": last.get("MACD"),
            "macd_signal": last.get("MACD_Signal"),
            "bb_upper": last.get("BB_Upper"),
            "bb_lower": last.get("BB_Lower"),
        },
    }
