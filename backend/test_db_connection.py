
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")

print(f"Testing connection to: {database_url.split('@')[1] if '@' in database_url else 'LOCAL'}") # Obfuscate password in output

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("✅ Connection successful!")
        for row in result:
            print(f"Query Result: {row[0]}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
