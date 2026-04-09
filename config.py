"""
Centralized configuration for the AI Stock Analyst & Predictor.
All magic numbers and defaults live here.

Design tokens derived from Stitch "Nifty Pro Terminal" design system.
"""

# ─── Default Tickers ───────────────────────────────────────────
DEFAULT_STOCK = "RELIANCE.NS"
MARKET_TICKERS = ["^NSEI", "^INDIAVIX"]

WATCHLIST = [
    "RELIANCE.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "ICICIBANK.NS",
    "ZOMATO.NS",
    "ADANIENT.NS",
    "SBIN.NS",
    "BHARTIARTL.NS",
    "ITC.NS",
]

# ─── Technical Analysis Defaults ───────────────────────────────
DEFAULT_MA_WINDOW = 20
MA_MIN = 5
MA_MAX = 200

DEFAULT_RSI_PERIOD = 14
RSI_OVERBOUGHT = 70
RSI_OVERSOLD = 30

MACD_FAST = 12
MACD_SLOW = 26
MACD_SIGNAL = 9

BOLLINGER_WINDOW = 20
BOLLINGER_STD = 2

# ─── VIX Thresholds ───────────────────────────────────────────
VIX_LOW = 13.0
VIX_MODERATE = 18.0
VIX_HIGH = 25.0

# ─── Cache TTLs (seconds) ─────────────────────────────────────
CACHE_TTL_MARKET = 60
CACHE_TTL_STOCK = 60
CACHE_TTL_NEWS = 300

# ─── Refresh Rates ────────────────────────────────────────────
REFRESH_MIN = 30
REFRESH_MAX = 300
REFRESH_DEFAULT = 60

# ─── Backtesting ──────────────────────────────────────────────
DEFAULT_CAPITAL = 100000
RISK_FREE_RATE = 0.065
TRADING_DAYS = 252

# ─── Stitch Design Tokens: "Nifty Pro Terminal" ──────────────
# Tonal Layering (no shadows, depth via background shifts)
COLORS = {
    # Surface hierarchy (Layer 0 → 2)
    "surface":                "#0a0e14",
    "surface_dim":            "#0a0e14",
    "surface_container_lowest": "#000000",
    "surface_container_low":  "#0e141c",
    "surface_container":      "#121a25",
    "surface_container_high": "#16202e",
    "surface_container_highest": "#1a2637",
    "surface_bright":         "#1e2d41",
    "surface_variant":        "#1a2637",

    # Text hierarchy
    "on_surface":             "#d9e6fd",
    "on_surface_variant":     "#9facc1",

    # Borders — 1px structural, no glows
    "outline":                "#6a768a",
    "outline_variant":        "#3c495b",

    # Bullish / Bearish — muted, not neon
    "primary":                "#6cdd81",
    "primary_dim":            "#5ecf74",
    "primary_container":      "#00531f",
    "on_primary_container":   "#76e88a",

    "secondary":              "#ff7167",
    "secondary_dim":          "#ff7167",
    "secondary_container":    "#7d000a",
    "on_secondary_container": "#ffa9a0",

    # Neutral / Tertiary
    "tertiary":               "#f7f9ff",
    "tertiary_container":     "#e6ebf5",

    # Functional aliases
    "accent_green":           "#5ecf74",
    "accent_red":             "#ff7167",
    "accent_yellow":          "#e5a644",
    "accent_blue":            "#5b8def",
    "text_primary":           "#d9e6fd",
    "text_secondary":         "#9facc1",
    "text_muted":             "#6a768a",
}

# ─── Plotly Chart Template ────────────────────────────────────
CHART_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="#000000",  # recessed chart area
    font=dict(family="Inter, sans-serif", color="#9facc1", size=11),
    xaxis=dict(
        gridcolor="rgba(60, 73, 91, 0.3)",
        zerolinecolor="rgba(60, 73, 91, 0.4)",
        tickfont=dict(size=10),
    ),
    yaxis=dict(
        gridcolor="rgba(60, 73, 91, 0.3)",
        zerolinecolor="rgba(60, 73, 91, 0.4)",
        tickfont=dict(size=10),
    ),
    margin=dict(l=50, r=20, t=35, b=30),
    legend=dict(
        bgcolor="rgba(0,0,0,0)",
        font=dict(size=10, color="#9facc1"),
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="left",
        x=0,
    ),
    title=dict(
        font=dict(size=12, color="#9facc1"),
        x=0,
        xanchor="left",
    ),
)
