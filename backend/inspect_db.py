
import sqlite3
import pandas as pd

# Connect to the database
conn = sqlite3.connect('finpulse.db')

def print_table(table_name):
    print(f"\n--- {table_name} ---")
    try:
        df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
        if df.empty:
            print("(No data)")
        else:
            # Show only the last 5 rows for readability
            print(df.tail(5).to_string(index=False))
    except Exception as e:
        print(f"Error reading {table_name}: {e}")

print("=== BACKEND DATABASE INSPECTOR ===")
print_table("companies")
print_table("financial_records")
print_table("assessments")

conn.close()
