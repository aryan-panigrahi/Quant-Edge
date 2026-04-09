import google.generativeai as genai
import pandas as pd
import config as cfg

def generate_ai_report(api_key: str, ticker: str, df: pd.DataFrame, signal_info: dict, news_df: pd.DataFrame) -> str:
    """
    Connects to Google's Gemini LLM to generate a professional analyst report.
    Returns the string text of the report.
    """
    if not api_key:
        return "⚠️ Error: Please provide a Gemini API Key in the sidebar to run the AI Analyst."
        
    try:
        genai.configure(api_key=api_key)
        # Use gemini-1.5-flash for fastest response, perfectly capable for this task
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Compile the current state into context for the LLM
        current_price = df['Close'].iloc[-1]
        volatility = df['Close'].pct_change().std() * 100
        
        indicator_states = "\n".join([f"- {name}: {sig}" for name, sig in signal_info['indicators'].items()])
        
        # Compile recent news headlines
        if not news_df.empty:
            headlines = "\n".join([f"- {row['Title']} ({row['Sentiment']})" for _, row in news_df.head(5).iterrows()])
        else:
            headlines = "No recent major headlines."
            
        prompt = f"""
        You are an elite quantitative analyst working for a tier-1 hedge fund in Mumbai.
        You are providing a rapid intelligence briefing on {ticker}.
        
        CURRENT MARKET DATA:
        - Price: ₹{current_price:,.2f}
        - Historical Volatility: {volatility:.2f}%
        
        QUANTITATIVE SIGNALS:
        - Overall Algorithmic Signal: {signal_info['overall']} (Strength: {int(signal_info['strength']*100)}%)
        {indicator_states}
        
        RECENT NEWS CATALYSTS:
        {headlines}
        
        Write a concise, highly professional 3-paragraph executive summary formatted in Markdown.
        Use a cold, analytical, Bloomberg-terminal tone (no emojis, no overly enthusiastic words).
        
        Paragraph 1: Technical Assessment (Analyze the indicator clusters and what price action suggests).
        Paragraph 2: Fundamental & News Impact (Synthesize the news headlines and how they support or contradict the technicals).
        Paragraph 3: Institutional Recommendation (A clear, risk-managed instruction on how to trade this right now based on confluence).
        
        Your response must look like a professional terminal readout. Use bolding for key metrics.
        """
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        return f"⚠️ **AI Engine Error:** Unable to connect to Gemini API.\n\nDetails: {str(e)}"
