from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Local modules
import config as cfg
from data.fetcher import fetch_market_data, fetch_stock_data, fetch_live_quote, fetch_news_sentiment
from analysis.technical import add_all_indicators, get_signal_summary
from analysis.ml_forecaster import generate_forecast
from analysis.ai_analyst import generate_ai_report

app = FastAPI(title="NSE Precision Engine API", version="2.0.0")

# Enable CORS for React frontend (Vite defaults to localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIReportRequest(BaseModel):
    api_key: str

@app.get("/api/market")
def get_market_pulse():
    """Returns real-time Nifty 50 and VIX status."""
    try:
        market_data = fetch_market_data()
        if market_data is None or market_data.empty:
            raise HTTPException(status_code=500, detail="Market data unavailable")

        # Find columns
        nifty_col, vix_col = None, None
        for c in market_data.columns:
            if "NSEI" in str(c).upper(): nifty_col = c
            elif "VIX" in str(c).upper(): vix_col = c

        nifty_series = market_data[nifty_col].dropna()
        nifty_price = nifty_series.iloc[-1]
        prev_nifty = nifty_series.iloc[-2] if len(nifty_series) >= 2 else nifty_price
        
        vix_price = market_data[vix_col].dropna().iloc[-1] if vix_col else 0.0

        uptrend = (nifty_price - prev_nifty) > 0
        fear_low = (vix_price < cfg.VIX_MODERATE)

        if uptrend and fear_low: mood = "GREEN"
        elif uptrend and not fear_low: mood = "YELLOW"
        else: mood = "RED"

        # Prepare chart data (limit to 100 points for frontend perf)
        chart_data = [{"time": str(idx.time()), "value": val} for idx, val in nifty_series.tail(100).items()]

        return {
            "nifty_price": float(nifty_price),
            "nifty_change": float(nifty_price - prev_nifty),
            "nifty_pct": float(((nifty_price - prev_nifty) / prev_nifty) * 100),
            "vix": float(vix_price),
            "trend": "UP" if uptrend else "DOWN",
            "mood": mood,
            "chart": chart_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stock/{ticker}")
def get_stock_analysis(ticker: str):
    """Returns full intraday technical analysis for a specific ticker."""
    df = fetch_stock_data(ticker.upper(), "5d")
    
    if df is None or df.empty:
        raise HTTPException(status_code=404, detail="Stock data not found")

    df = add_all_indicators(df, 30) # 30 periods of 5min
    signal_info = get_signal_summary(df, 30)
    quote = fetch_live_quote(ticker)
    
    # Slice the last 150 points of chart data for the frontend
    chart_df = df.tail(150).copy()
    chart_df['date'] = chart_df.index.strftime('%d %b %H:%M') # e.g. 09 Apr 14:15
    chart_points = json.loads(chart_df.to_json(orient='records'))

    news_df = fetch_news_sentiment(ticker.upper())
    news_list = json.loads(news_df.to_json(orient='records')) if not news_df.empty else []

    import numpy as np
    def sanitize(obj):
        if isinstance(obj, dict): return {k: sanitize(v) for k, v in obj.items()}
        if isinstance(obj, list): return [sanitize(v) for v in obj]
        if isinstance(obj, np.integer): return int(obj)
        if hasattr(obj, 'item'): return obj.item()
        return obj

    return {
        "ticker": ticker.upper(),
        "live": sanitize(quote),
        "signals": sanitize(signal_info),
        "chart": chart_points,
        "news": sanitize(news_list)
    }

@app.get("/api/predict/{ticker}")
def get_stock_prediction(ticker: str):
    """Runs the Machine Learning model and returns 30-period (150 min) forecast."""
    df = fetch_stock_data(ticker.upper(), "5d")
    
    if df is None:
        raise HTTPException(status_code=404, detail="Data not found for prediction")
        
    forecast_df, accuracy = generate_forecast(df, days=30)
    
    if forecast_df is None:
        raise HTTPException(status_code=500, detail="Not enough data for ML")
        
    predictions = []
    for date, row in forecast_df.iterrows():
        predictions.append({
            "date": date.strftime('%H:%M'), # Intraday Future Time
            "predicted_price": float(row['Predicted_Close'])
        })
        
    return {
        "accuracy": accuracy,
        "forecast": predictions,
        "std_dev": float(df['Close'].tail(20).std())
    }

@app.post("/api/ai-report/{ticker}")
def build_ai_report(ticker: str, request: AIReportRequest):
    """Uses Gemini API to generate an intelligence readout."""
    try:
        df = fetch_stock_data(ticker.upper(), "5d")
        df = add_all_indicators(df, 30)
        signal_info = get_signal_summary(df, 30)
        news_df = fetch_news_sentiment(ticker.upper())
        
        report = generate_ai_report(request.api_key, ticker.upper(), df, signal_info, news_df)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
