
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Ensure we use the working model key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def calculate_projection(base_metrics: dict, modifiers: dict):
    """
    Deterministic math to project future state.
    modifiers: {
        "revenue_growth": 0.10 (10% increase),
        "expense_change": -0.05 (5% decrease)
    }
    """
    revenue_growth = modifiers.get("revenue_growth", 0.0)
    expense_change = modifiers.get("expense_change", 0.0)

    original_revenue = base_metrics.get("revenue", 0.0)
    original_expenses = base_metrics.get("expenses", 0.0)

    # Calculate new values
    new_revenue = original_revenue * (1 + revenue_growth)
    new_expenses = original_expenses * (1 + expense_change)
    new_profit = new_revenue - new_expenses

    return {
        "original": {
            "revenue": original_revenue,
            "expenses": original_expenses,
            "net_profit": base_metrics.get("net_profit", 0.0)
        },
        "projected": {
            "revenue": new_revenue,
            "expenses": new_expenses,
            "net_profit": new_profit
        },
        "deltas": {
            "revenue_change_percent": revenue_growth * 100,
            "expense_change_percent": expense_change * 100
        }
    }

def analyze_scenario(projection: dict, company_info: dict):
    """
    Asks AI to critique the scenario.
    """
    if not GEMINI_API_KEY:
        return "AI Analysis Unavailable (Key Missing)"

    model = genai.GenerativeModel('gemini-flash-latest')

    proj = projection['projected']
    deltas = projection['deltas']
    
    prompt = f"""
    You are a cynical, conservative CFO advising a {company_info.get('business_type', 'Business')} owner.
    
    They are proposing a strategic shift:
    - Target Revenue Growth: {deltas['revenue_change_percent']:.1f}%
    - Target Expense Change: {deltas['expense_change_percent']:.1f}%
    
    IMPACT:
    - New Revenue: ${proj['revenue']:,.2f}
    - New Net Profit: ${proj['net_profit']:,.2f}
    
    Evaluate the feasibility and risks. 
    1. If they plan to GROW Revenue (+20%+) but CUT Expenses, warn them about operational failure (who is doing the work?).
    2. If they increase expenses without revenue growth, warn about cash burn.
    3. Keep it brief (max 3 sentences). be direct.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Analysis Failed: {str(e)}"
