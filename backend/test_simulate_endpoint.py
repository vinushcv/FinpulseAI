
import requests
import json

url = "http://localhost:8000/simulate"

payload = {
    "base_metrics": {
        "revenue": 1000,
        "expenses": 800,
        "net_profit": 200,
        "period_start": "2023-01-01",
        "period_end": "2023-01-31"
    },
    "modifiers": {
        "revenue_growth": 0.1,
        "expense_change": 0.05
    },
    "company_info": {
        "name": "Test Co",
        "industry": "Tech",
        "business_type": "SaaS"
    }
}

try:
    print(f"Sending request to {url}...")
    r = requests.post(url, json=payload)
    print(f"Status Code: {r.status_code}")
    if r.status_code == 200:
        print("Response received:")
        print(json.dumps(r.json(), indent=2))
    else:
        print(f"Error: {r.text}")
except Exception as e:
    print(f"Failed to connect: {e}")
