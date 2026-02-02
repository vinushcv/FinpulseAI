import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def get_financial_advice(financial_data: dict, company_info: dict):
    if not GEMINI_API_KEY:
        return {
            "error": "Gemini API Key not found. Please set GEMINI_API_KEY in .env",
            "narrative": "AI analysis unavailable.",
            "risk_score": 50,
            "recommendations": ["Configure API Key"]
        }

    model = genai.GenerativeModel('gemini-flash-latest')
    
    # Extract key metrics for explicit prompt injection to avoid hallucinations
    revenue = financial_data.get('revenue', 0)
    expenses = financial_data.get('expenses', 0)
    profit = financial_data.get('net_profit', 0)

    prompt = f"""
    You are an expert financial advisor for SMEs. Analyze the following financial data for a {company_info.get('business_type')} company in the {company_info.get('industry')} industry.
    
    CRITICAL FINANCIAL METRICS:
    - Revenue: ${revenue:,.2f}
    - Expenses: ${expenses:,.2f}
    - Net Profit: ${profit:,.2f}
    
    Full Financial Data:
    {financial_data}
    
    Company Name: {company_info.get('name')}
    
    INSTRUCTIONS:
    1. If Net Profit is NEGATIVE, the Risk Score MUST be above 70 (High Risk).
    2. If Net Profit is POSITIVE but small (<10% margin), Risk Score should be 40-60 (Moderate).
    3. Reference the specific Revenue and Profit numbers in your summary.
    
    Provide:
    1. A brief executive summary of their financial health (Mention the specific numbers).
    2. A Risk Score from 0 (Safe) to 100 (Critical).
    3. 3-5 actionable strategic recommendations to improve cash flow and profitability.
    
    Format the output as JSON with keys: "executive_summary", "risk_score", "recommendations" (list of strings).
    """
    
    print("----- GENERATED PROMPT -----")
    print(prompt)
    print("----------------------------")
    
    try:
        response = model.generate_content(prompt)
        # simplistic parsing, ideally we ensure JSON mode or parse carefully
        return response.text 
    except Exception as e:
        return {"error": str(e)}
