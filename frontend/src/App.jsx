import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Activity, Target, Brain, Lock, RefreshCw, Zap, Globe, Info, ChevronUp, ChevronDown, TerminalSquare } from 'lucide-react';

export default function App() {
  const [marketData, setMarketData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AI State
  const [aiReport, setAiReport] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Terminal State
  const [showHelp, setShowHelp] = useState(false);

  // Fetch Market Pulse
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/market')
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(err => console.error("Market fetch error"));
  }, []);

  // Fetch Stock Data
  useEffect(() => {
    if (!ticker.trim()) {
      setStockData(null);
      return;
    }
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/stock/${ticker}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.signals) setStockData(data);
        else setStockData(null);
      })
      .catch(err => setStockData(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ai-report/${ticker}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const data = await res.json();
      setAiReport(data.report);
    } catch (e) {
      setAiReport("⚠️ Error generating report. Check connection and API Key.");
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-outline flex flex-col font-sans text-gray-200 relative overflow-x-hidden">
      
      {/* 1. COMPACT TOP HEADER */}
      <header className="h-[48px] bg-background flex items-center justify-between px-4 border-b border-outline shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Zap className="text-primary w-4 h-4" />
            <h1 className="text-sm font-bold tracking-widest">
              QUANT<span className="text-primary">EDGE</span>
            </h1>
          </div>
          <div className="h-4 w-[1px] bg-outline"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">TICKER:</span>
            <input 
              type="text" 
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              className="bg-surface border border-outline rounded-none px-3 py-1 w-48 text-white font-mono text-xs focus:outline-none focus:border-primary transition-all uppercase"
              placeholder="e.g. RELIANCE.NS, TSLA"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[10px] font-mono text-accent uppercase tracking-widest pr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Node Connected [127.0.0.1:8000]
          </span>
        </div>
      </header>

      {/* 2. MAIN TERMINAL GRID */}
      <main className="w-full h-[calc(100vh-48px)] grid grid-cols-12 grid-rows-1 gap-[1px] bg-outline z-0 shrink-0">
        
        {/* PANEL A: MACRO & SIGNALS (Left Sidebar) */}
        <section className="col-span-3 bg-background flex flex-col overflow-y-auto custom-scrollbar">
          
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Market Pulse</h2>
          </div>

          <div className="p-4 space-y-6">
            {marketData ? (
              <div className="space-y-4">
                <div className="bg-surface p-3 border border-outline">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500 font-mono">NIFTY 50</span>
                    <span className={`text-xs font-bold ${marketData.nifty_change > 0 ? 'text-accent' : 'text-danger'}`}>
                      {marketData.nifty_pct > 0 ? '+' : ''}{marketData.nifty_pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-light text-white font-mono tracking-tight">
                    {marketData.nifty_price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>
                  <div className="h-10 mt-2 -mx-1 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketData.chart}>
                        <Line type="step" dataKey="value" stroke={marketData.nifty_change > 0 ? '#6bfe9c' : '#ee7d77'} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-surface p-3 border border-outline flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 font-mono block mb-1">INDIA VIX</span>
                    <span className="text-xl font-light text-white font-mono tracking-tight">{marketData.vix.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-mono block mb-1">MACRO TREND</span>
                    <span className={`text-sm font-bold tracking-widest ${marketData.mood === 'GREEN' ? 'text-accent' : marketData.mood === 'RED' ? 'text-danger' : 'text-yellow-500'}`}>
                      {marketData.trend}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-xs text-gray-500 font-mono flex items-center"><RefreshCw className="w-3 h-3 animate-spin mr-2"/> Syncing Market...</div>
            )}

            {/* Confluence Signals */}
            {stockData && (
               <div className="pt-2 border-t border-outline/50">
                 <h3 className="text-xs font-mono text-gray-500 mb-3">CONFLUENCE VERDICT: {ticker}</h3>
                 
                 <div className={`p-4 border ${stockData.signals.overall === 'BUY' ? 'border-accent bg-accent/5' : stockData.signals.overall === 'SELL' ? 'border-danger bg-danger/5' : 'border-gray-500 bg-gray-500/5'} mb-4`}>
                    <div className="flex justify-between items-end">
                      <span className={`text-4xl font-black tracking-tighter leading-none ${stockData.signals.overall === 'BUY' ? 'text-accent' : stockData.signals.overall === 'SELL' ? 'text-danger' : 'text-gray-400'}`}>
                        {stockData.signals.overall}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        CONFIDENCE: {Math.round(stockData.signals.strength * 100)}%
                      </span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-[2px]">
                   {Object.entries(stockData.signals.indicators).map(([key, value]) => (
                     <div key={key} className="flex justify-between items-center bg-surface p-2 border border-outline">
                       <span className="text-xs text-gray-400 font-mono">{key}</span>
                       <span className={value === 'BUY' ? 'text-accent text-xs font-bold' : value === 'SELL' ? 'text-danger text-xs font-bold' : 'text-gray-400 text-xs'}>
                         {value}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>
        </section>

        {/* PANEL B: PRIMARY WORKSPACE (Center Chart) */}
        <section className="col-span-6 bg-background flex flex-col relative min-h-0">
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-gray-400" />
              <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Interactive Chart Engine</h2>
            </div>
            {stockData?.live && (
              <span className="text-lg font-light text-white font-mono tracking-tighter">
                {stockData.live.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </span>
            )}
          </div>
          
          <div className="flex-1 p-4 w-full h-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-primary">
                <RefreshCw className="w-6 h-6 animate-spin mb-3" />
                <span className="text-xs font-mono uppercase tracking-widest">Compiling Nodes...</span>
              </div>
            ) : stockData?.chart ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockData.chart}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stockData.chart[stockData.chart.length-1]?.Close > stockData.chart[0]?.Close ? '#6bfe9c' : '#ee7d77'} stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0a0e14" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="1 4" stroke="#1a2637" vertical={true} />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke="#3c495b" 
                    tick={{fill: '#6a768a', fontSize: 10, fontFamily: 'monospace'}} 
                    tickMargin={10} 
                    minTickGap={40} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="#3c495b" 
                    tick={{fill: '#6a768a', fontSize: 10, fontFamily: 'monospace'}} 
                    orientation="right" 
                    tickFormatter={(val) => val.toLocaleString()} 
                  />
                  <Tooltip 
                    cursor={{ stroke: '#3c495b', strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0e141c', border: '1px solid #3c495b', borderRadius: '0', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#bac7dd' }}
                  />
                  
                  <Area 
                    type="step" 
                    dataKey="Close" 
                    stroke={stockData.chart[stockData.chart.length-1]?.Close > stockData.chart[0]?.Close ? '#6bfe9c' : '#ee7d77'} 
                    strokeWidth={1.5} 
                    fill="url(#chartGradient)" 
                    isAnimationActive={false}
                  />
                  
                  {stockData.chart[0]?.SMA_20 && (
                    <Line 
                      type="monotone" 
                      dataKey="SMA_20" 
                      stroke="#bac7dd" 
                      strokeOpacity={0.5} 
                      strokeWidth={1} 
                      dot={false} 
                      isAnimationActive={false} 
                      name="SMA-20" 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-danger font-mono text-sm">
                 DATA STREAM FAILED OR EMPTY.
              </div>
            )}
          </div>
        </section>

        {/* PANEL C: INTELLIGENCE & NEWS (Right Sidebar) */}
        <section className="col-span-3 bg-background flex flex-col min-h-0">
          
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">AI Intelligence</h2>
          </div>

          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Gemini Setup Form (Top Half) */}
            <div className="p-4 border-b border-outline flex-1 overflow-y-auto custom-scrollbar shrink-0 max-h-[50%]">
              <div className="bg-surface border border-outline p-3 space-y-2 mb-4 shrink-0">
                 <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mb-1">
                   <Lock className="w-3 h-3" />
                   <span>SECURE LLM CONNECTION</span>
                 </div>
                 <input 
                   type="password" 
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   placeholder="Enter Gemini API Key..." 
                   className="w-full bg-background border border-outline px-2 py-1.5 text-[10px] text-white font-mono focus:outline-none focus:border-primary transition-all rounded-none"
                 />
                 <button 
                   onClick={generateAI}
                   disabled={aiLoading || !apiKey}
                   className="w-full bg-outline hover:bg-primary/20 text-white font-mono text-[10px] tracking-widest uppercase py-1.5 transition-all border border-transparent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {aiLoading ? 'Synthesizing...' : 'Run Analysis'}
                 </button>
              </div>

              {/* AI Report Markdown Container */}
              <div className="w-full">
                 {aiLoading ? (
                   <div className="h-24 flex flex-col items-center justify-center text-primary/50 space-y-3">
                     <div className="w-full h-1 bg-surface overflow-hidden relative">
                       <div className="absolute top-0 left-0 h-full bg-primary/50 w-1/3 animate-ping"></div>
                     </div>
                     <span className="text-[10px] font-mono tracking-widest">INGESTING DATASET...</span>
                   </div>
                 ) : aiReport ? (
                   <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-sans leading-relaxed text-[11px]"
                        dangerouslySetInnerHTML={{__html: aiReport.replace(/\n\n/g, '<br/><br/>')}} />
                 ) : (
                   <div className="h-24 flex flex-col items-center justify-center text-gray-600 font-mono text-[10px] px-6 text-center border border-dashed border-outline/50 p-4">
                     No intelligence report generated. Insert API key.
                   </div>
                 )}
              </div>
            </div>

            {/* LIVE NEWS MATRIX (Bottom Half) */}
            <div className="flex-1 flex flex-col min-h-[50%] bg-surface/30">
               <div className="p-2 border-b border-outline bg-surface sticky top-0 flex items-center gap-2">
                 <Globe className="w-3 h-3 text-gray-400" />
                 <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Live News Matrix</h3>
               </div>
               <div className="p-3 overflow-y-auto custom-scrollbar space-y-2">
                 {loading ? (
                   <div className="text-[10px] font-mono text-gray-500 text-center mt-4">Scanning news endpoints...</div>
                 ) : stockData?.news && stockData.news.length > 0 ? (
                   stockData.news.map((item, idx) => (
                     <a key={idx} href={item.Link} target="_blank" rel="noreferrer" className="block p-3 border border-outline bg-background hover:bg-surfaceLight hover:border-primary transition-all group">
                       <div className="flex justify-between items-start mb-2">
                         <span className="text-[9px] font-mono text-primary truncate max-w-[60%]">{item.Source}</span>
                         <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider ${item.Sentiment.includes('Pos') ? 'text-accent bg-accent/10 border border-accent/20' : item.Sentiment.includes('Neg') ? 'text-danger bg-danger/10 border border-danger/20' : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'}`}>
                           {item.Sentiment.replace(/[^A-Za-z]/g, '')} {/* Remove emojis for brutalist look */}
                         </span>
                       </div>
                       <p className="text-[11px] text-gray-300 group-hover:text-white leading-snug line-clamp-2">{item.Title}</p>
                     </a>
                   ))
                 ) : (
                   <div className="text-[10px] font-mono text-gray-500 text-center mt-4 border border-dashed border-outline/50 p-4">No recent market news found.</div>
                 )}
               </div>
            </div>

          </div>
        </section>
      </main>

      {/* 3. STATIC HOW TO GUIDE (Scroll Down) */}
      <footer className="w-full bg-surface border-t-2 border-outline pb-12 pt-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-8 flex items-center">
            <TerminalSquare className="mr-3 text-primary w-6 h-6"/> System Terminal Databank
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">1</span> 
                Ticking Input
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                The terminal links directly to global data pipelines. For <span className="text-white">US Stocks</span>, standard abbreviations (e.g. <code>AAPL</code>, <code>MSFT</code>) work. For <span className="text-white">Indian Equities</span>, you must append <code>.NS</code> (e.g. <code>RELIANCE.NS</code>, <code>TCS.NS</code>) for NSE listings.
              </p>
            </div>
            
            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">2</span> 
                Confluence Paradigm
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                The platform computes an institutional-grade <span className="text-accent font-bold">BUY</span> / <span className="text-danger font-bold">SELL</span> verdict. This is derived from a "Confluence" (agreement) of 5 complex metrics natively crunching high-frequency data in our FastAPI backend (SMA, EMA, RSI, MACD, Bollinger Bands). 
              </p>
            </div>

            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">3</span> 
                AI Synthesis (Gemini)
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Paste your secure Google Gemini API key to trigger the AI intelligence engine. The LLM will parse the numeric algorithmic data <i>and</i> the Live News Matrix simultaneously to deliver an executive human-readable recommendation.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-outline pt-6">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              Disclaimer: The Quantitative Terminal outputs algorithmic predictions. Execute trades explicitly at your own risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
