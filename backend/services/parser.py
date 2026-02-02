import pandas as pd
from fastapi import UploadFile
import io
import datetime

async def parse_financial_statement(file: UploadFile):
    """
    Parses an uploaded file (CSV/Excel) into a standardized dictionary.
    """
    content = await file.read()
    filename = file.filename.lower()
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        else:
            raise ValueError("Unsupported file format. Please upload CSV or Excel.")
            
        # Basic normalization (simplistic for MVP)
        # We assume columns like 'Category', 'Amount', 'Date' exist or we infer them
        # For this hackathon, let's assume a strictly formatted CSV for simplicity first, 
        # then make it robust.
        
        # Expected columns: Date, Category, Amount, Type (Income/Expense)
        df.columns = [c.lower().strip() for c in df.columns]
        
        return df.to_dict(orient="records")
        
    except Exception as e:
        raise ValueError(f"Error parsing file: {str(e)}")

def calculate_metrics(data: list):
    """
    Calculates basic financial metrics from parsed data.
    """
    if not data:
         return {
        "revenue": 0.0,
        "expenses": 0.0,
        "net_profit": 0.0,
        "period_start": datetime.datetime.now(),
        "period_end": datetime.datetime.now()
    }
    
    df = pd.DataFrame(data)
    
    # Simple heuristic to guess columns if not standard
    # Looking for 'amount', 'type', 'category'
    
    total_revenue = 0.0
    total_expenses = 0.0
    
    # Mock calculation if columns missing
    if 'amount' in df.columns and 'type' in df.columns:
        total_revenue = df[df['type'].str.lower() == 'income']['amount'].sum()
        total_expenses = df[df['type'].str.lower() == 'expense']['amount'].sum()
        
    elif 'amount' in df.columns:
        # Assume positive is income, negative is expense if simplified
        total_revenue = df[df['amount'] > 0]['amount'].sum()
        total_expenses = abs(df[df['amount'] < 0]['amount'].sum())
        
    return {
        "revenue": float(total_revenue),
        "expenses": float(total_expenses),
        "net_profit": float(total_revenue - total_expenses),
        "period_start": datetime.datetime.now(), # Placeholder
        "period_end": datetime.datetime.now() # Placeholder
    }
