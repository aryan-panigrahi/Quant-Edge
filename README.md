# 🧠 NSE Precision Engine: Quant Edge Terminal

A professional, high-fidelity quantitative financial dashboard built for institutional-grade market analysis. The application utilizes a decoupled Full-Stack architecture to deliver real-time technical analysis, embedded Machine Learning forecasts, and Generative AI Wall Street intelligence reporting.

![Python](https://img.shields.io/badge/Backend-FastAPI-blue?style=flat-square)
![React](https://img.shields.io/badge/Frontend-React/Vite-cyan?style=flat-square)
![Tailwind](https://img.shields.io/badge/UI-Obsidian_Ledger-black?style=flat-square)

---

## 🏗️ Architecture

The terminal is designed around a modern, lightning-fast **Headless Architecture**:

1. **The AI Engine (Backend):** Built in **Python** using asynchronous **FastAPI**. It handles complex Numpy matrix calculations, Scikit-Learn predictions, and Google Gemini API inferences without blocking the UI. Includes recursive sanitization to filter out non-JSON compliant floats (like `NaN` or `Inf`).
2. **The Dashboard (Frontend):** Built in **React (Vite)** utilizing **Tailwind v3 CSS**. It utilizes the "Obsidian Ledger / Quant Terminal v2" design system, ensuring a brutalist, zero-radius, high-data-density aesthetic tailored for professional traders. Equipped with active null-safe handlers to ensure flawless operation during closed-market hours when live pricing data feeds are empty.

---

## ⚙️ Installation (Restore Environment)

If you are setting up the project on a new laptop or a fresh operating system:

### 1. Install Backend Dependencies
Ensure you have Python 3.10+ installed. Run the following command at the project root folder:
```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
Ensure you have Node.js v18+ installed. Navigate to the frontend directory and install NPM packages:
```bash
cd frontend
npm install
```

---

## 🚀 Quick Start (Running Both Servers)

Because this is a true decoupled web application, you must run both the backend server and the frontend client simultaneously.

### 1. Start the API Backend
Open your first terminal window and start the underlying Python AI/Data Engine:
```bash
# Ensure you are at the project root folder
uvicorn main:app --reload
```
*The backend will now quietly run on `http://127.0.0.1:8000`.*

### 2. Start the Quant Terminal UI
Open a **second** terminal window and boot the React Frontend:
```bash
# Navigate to the frontend directory
cd frontend

# Start the Vite development server
npm run dev
```
*The interface will automatically launch at `http://localhost:5173`. Open this link in Chrome or Edge.*

---

## 📋 Core Capabilities

### 🌏 Real-Time Market Pulse (Top Bar)
- **Nifty 50** intraday price tracking and trend deltas.
- **India VIX** fear gauge monitoring.
- **Traffic light system** algorithm calculating macro-trend recommendations based on volatility vs. price action.

### 📊 Quantitative Stock Analysis
- **High-Performance Charts:** Rendering thousands of data points flawlessly using `Recharts`. Overlays classic `SMA_20` indicators dynamically on historical data.
- **Confluence Verdict:** A real-time engine calculating the combined strength of `SMA`, `EMA`, `RSI`, `MACD`, and `Bollinger Bands` to trigger instantaneous Buy/Sell/Wait probabilities.
- **Graceful Off-Hours Fallback:** Automatically replaces missing telemetry fields (price, high, low, open, volume) with elegant place-holding metrics (`—`) rather than crashing when markets are closed or stock feeds are empty.

### 🤖 Generative AI Intelligence (Gemini)
- Plugs directly into the Google Gemini LLM API (requires a free API key during usage).
- Compiles thousands of discrete indicator signals and recent News Sentiment API data into a highly structured prompt.
- Returns a 3-paragraph executive "Wall Street" style intelligence brief summarizing fundamental + technical alignment.

### 📉 Machine Learning Price Projection
- Powered by `Scikit-Learn`'s Random Forest Regressor.
- Trains entirely on-the-fly using the live ticker data to generate a multi-lag model.
- Automatically projects a predictive 30-day future price path and models standard deviation variances natively into the API.

---

## 📁 Project Structure

```text
├── main.py                 # FastAPI Server (The Core Entry Point)
├── config.py               # Constants, tokens, technical indicator thresholds
├── data/
│   └── fetcher.py          # Data pipelines (yfinance, News API scraping)
├── analysis/
│   ├── technical.py        # Algorithmic trading indicators (SMA/MACD/RSI/Bollinger)
│   ├── ml_forecaster.py    # Random Forest Regressor implementation
│   └── ai_analyst.py       # Google Gemini LLM Prompt Engineering & Formatting
│
└── frontend/               # The React Client Setup
    ├── src/
    │   ├── App.jsx         # Main UI layout and data-fetching hooks
    │   ├── main.jsx        # React root initializer
    │   └── index.css       # Obsidian Ledger CSS/Tailwind rules (0px radius, tabular nums)
    ├── tailwind.config.js  # Quant terminal color tokens
    └── package.json        # Frontend NPM Dependencies
```

---

## ⚠️ Disclaimer

This is for **educational purposes only**, built specifically for AI demonstration. It is not professional financial advice. Always do your own research before executing capital trades.
