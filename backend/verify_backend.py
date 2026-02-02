import requests
import pandas as pd
import io

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"Root: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")

def test_company_creation():
    data = {"name": "Test Corp", "industry": "Retail", "business_type": "Store"}
    r = requests.post(f"{BASE_URL}/companies/", json=data)
    print(f"Create Company: {r.status_code} - {r.json()}")
    return r.json().get('id')

def test_upload(company_id):
    if not company_id:
        print("Skipping upload test due to missing company ID")
        return
        
    df = pd.DataFrame({
        'Date': ['2023-01-01', '2023-01-02'],
        'Category': ['Sales', 'Rent'],
        'Amount': [1000, -500],
        'Type': ['Income', 'Expense']
    })
    
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    files = {'file': ('test.csv', csv_buffer.getvalue())}
    r = requests.post(f"{BASE_URL}/upload/{company_id}", files=files)
    print(f"Upload: {r.status_code}")
    if r.status_code == 200:
        print(r.json())
    else:
        print(r.text)

if __name__ == "__main__":
    test_health()
    cid = test_company_creation()
    test_upload(cid)
