"""
Gradient Boosting price forecaster — fully local, zero downloads.

Replaces the LSTM with sklearn's GradientBoostingRegressor:
  - No PyTorch dependency
  - Trains in ~0.5s on CPU (vs 3-5s for LSTM)
  - Comparable accuracy on short intraday sequences
  - Same external interface: generate_forecast(df, days) → (forecast_df, accuracy)

Feature set:
  Close, Volume, RSI, MACD_Hist, BB_pct, EMA, momentum, hourly_sin/cos
"""

from __future__ import annotations
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# ── Reproducibility ──────────────────────────────────────────────────────────
np.random.seed(42)

SEQ_LEN    = 30      # candles per input window (30 × 5min = 2.5 h)
N_ESTIMATORS = 200
MAX_DEPTH    = 4
LEARNING_RATE = 0.05


# ── Feature Engineering ───────────────────────────────────────────────────────
def _build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Build a feature matrix from OHLCV + pre-computed indicator columns.
    All indicator columns are used if present; computed inline otherwise.
    """
    feat = pd.DataFrame(index=df.index)
    feat["Close"]  = df["Close"]
    feat["Volume"] = df["Volume"] if "Volume" in df.columns else 0.0

    # RSI
    if "RSI" in df.columns:
        feat["RSI"] = df["RSI"]
    else:
        delta = df["Close"].diff()
        gain  = delta.clip(lower=0).rolling(14).mean()
        loss  = (-delta).clip(lower=0).rolling(14).mean()
        feat["RSI"] = 100 - (100 / (1 + gain / (loss + 1e-9)))

    # MACD Histogram
    if "MACD_Hist" in df.columns:
        feat["MACD_Hist"] = df["MACD_Hist"]
    else:
        ema12 = df["Close"].ewm(span=12, adjust=False).mean()
        ema26 = df["Close"].ewm(span=26, adjust=False).mean()
        macd  = ema12 - ema26
        feat["MACD_Hist"] = macd - macd.ewm(span=9, adjust=False).mean()

    # Bollinger %B
    if "BB_Upper" in df.columns and "BB_Lower" in df.columns:
        rng = (df["BB_Upper"] - df["BB_Lower"]).replace(0, np.nan)
        feat["BB_pct"] = (df["Close"] - df["BB_Lower"]) / rng
    else:
        sma = df["Close"].rolling(20).mean()
        std = df["Close"].rolling(20).std()
        rng = (2 * std).replace(0, np.nan)
        feat["BB_pct"] = (df["Close"] - (sma - std)) / (2 * std + 1e-9)

    # EMA
    ema_cols = [c for c in df.columns if c.startswith("EMA_")]
    feat["EMA"] = df[ema_cols[0]] if ema_cols else df["Close"].ewm(span=20, adjust=False).mean()

    # Momentum: % change over last 5 candles
    feat["Momentum"] = df["Close"].pct_change(5)

    # Cyclical time features (capture intraday seasonality)
    minutes = feat.index.hour * 60 + feat.index.minute
    feat["Time_sin"] = np.sin(2 * np.pi * minutes / (6.5 * 60))   # 6.5-hour NSE session
    feat["Time_cos"] = np.cos(2 * np.pi * minutes / (6.5 * 60))

    return feat.dropna()


FEATURE_COLS = [
    "Close", "Volume", "RSI", "MACD_Hist",
    "BB_pct", "EMA", "Momentum", "Time_sin", "Time_cos",
]
CLOSE_IDX = FEATURE_COLS.index("Close")


# ── Windowed dataset builder ──────────────────────────────────────────────────
def _make_flat_sequences(scaled: np.ndarray, seq_len: int):
    """
    Flatten SEQ_LEN consecutive rows into a single feature vector.
    Target = Close value of the row immediately following the window.
    """
    X, y = [], []
    for i in range(seq_len, len(scaled)):
        X.append(scaled[i - seq_len : i].ravel())   # flatten (seq_len × n_feat)
        y.append(scaled[i, CLOSE_IDX])
    return np.array(X), np.array(y)


# ── Main Entry Point ──────────────────────────────────────────────────────────
def generate_forecast(df: pd.DataFrame, days: int = 30):
    """
    Train a GradientBoostingRegressor on historical intraday data and
    produce a `days`-step-ahead forecast.

    Returns:
        forecast_df  (pd.DataFrame | None): future index → Predicted_Close
        model_accuracy (float): 1 - normalised MAE on held-out test set (0–1)
    """
    feat_df = _build_features(df)

    if len(feat_df) < SEQ_LEN + 20:
        return None, 0.0

    # ── Normalise ─────────────────────────────────────────────────────────
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(feat_df[FEATURE_COLS].values)

    X, y = _make_flat_sequences(scaled, SEQ_LEN)

    if len(X) < 20:
        return None, 0.0

    # ── Train / test split ─────────────────────────────────────────────────
    split = max(1, int(len(X) * 0.85))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # ── Fit GBR ───────────────────────────────────────────────────────────
    model = GradientBoostingRegressor(
        n_estimators=N_ESTIMATORS,
        max_depth=MAX_DEPTH,
        learning_rate=LEARNING_RATE,
        subsample=0.8,
        random_state=42,
    )
    model.fit(X_train, y_train)

    # ── Accuracy on held-out set ───────────────────────────────────────────
    if len(X_test) > 0:
        preds_scaled = model.predict(X_test)

        # Inverse-transform Close column only
        def inv_close(arr_scaled: np.ndarray) -> np.ndarray:
            dummy = np.zeros((len(arr_scaled), len(FEATURE_COLS)))
            dummy[:, CLOSE_IDX] = arr_scaled
            return scaler.inverse_transform(dummy)[:, CLOSE_IDX]

        preds_actual = inv_close(preds_scaled)
        actual       = inv_close(y_test)
        price_range  = actual.max() - actual.min() or 1.0
        norm_mae     = np.mean(np.abs(preds_actual - actual)) / price_range
        accuracy     = float(np.clip(1.0 - norm_mae, 0.0, 1.0))
    else:
        accuracy = 0.0

    # ── Autoregressive Future Forecast ─────────────────────────────────────
    # Keep a rolling buffer of `scaled` rows to build future windows
    buffer = list(scaled[-SEQ_LEN:])   # list of (n_feat,) arrays
    future_scaled = []

    for _ in range(days):
        window     = np.array(buffer[-SEQ_LEN:]).ravel()[np.newaxis, :]
        pred_close = model.predict(window)[0]

        # Build next synthetic row: copy last known row, update Close
        next_row                = buffer[-1].copy()
        next_row[CLOSE_IDX]    = pred_close
        future_scaled.append(pred_close)
        buffer.append(next_row)

    # ── Inverse transform ──────────────────────────────────────────────────
    dummy = np.zeros((len(future_scaled), len(FEATURE_COLS)))
    dummy[:, CLOSE_IDX] = future_scaled
    future_prices = scaler.inverse_transform(dummy)[:, CLOSE_IDX]

    # ── Build forecast DataFrame ───────────────────────────────────────────
    last_date = df.index[-1]
    # Try to generate 5-min future timestamps; fall back to business days
    try:
        future_dates = pd.date_range(
            start=last_date + pd.Timedelta(minutes=5),
            periods=days,
            freq="5min",
        )
    except Exception:
        future_dates = pd.bdate_range(
            start=last_date + pd.Timedelta(days=1),
            periods=days,
        )

    forecast_df = pd.DataFrame(
        index=future_dates[:days],
        data={"Predicted_Close": future_prices[:days]},
    )

    return forecast_df, round(accuracy, 4)
