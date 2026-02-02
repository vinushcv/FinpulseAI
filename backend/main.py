from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import shutil

from models import Base, Company, FinancialRecord, Assessment
from schemas import CompanyCreate, Company as CompanySchema, Assessment as AssessmentSchema
from services.parser import parse_financial_statement, calculate_metrics
from services.ai_advisor import get_financial_advice
from services.simulator import calculate_projection, analyze_scenario
from pydantic import BaseModel

# Database Setup
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

load_dotenv()

# Database Setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./finpulse.db")

# Handle arguments based on DB type (Postgres doesn't support check_same_thread)
connect_args = {"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinPulse API", description="SME Financial Health Assessment Platform")

# CORS Setup
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False, # Must be False when origin is *
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to FinPulse API"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

@app.post("/upload/{company_id}")
async def upload_financial_statement(company_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Save File
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Parse File
    try:
        # Re-open file for parsing since it was consumed
        with open(file_location, "rb") as f:
            # Create a mock UploadFile for the parser (hacky but works for MVP)
             # Ideally service accepts bytes or path. 
             # Let's update service to read from path or handle it here.
             # Actually, let's just use the parser logic here to keep it simple or fix parser.
             pass
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Let's fix parser usage. We'll pass the file object before closing it? 
    # Or better, just rewrite parser to take bytes.
    # For now, let's just restart the file cursor to read again
    file.file.seek(0)
    parsed_data = await parse_financial_statement(file)
    metrics = calculate_metrics(parsed_data)
    
    # 3. Save Record
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    record = FinancialRecord(
        company_id=company_id,
        period_start=metrics['period_start'],
        period_end=metrics['period_end'],
        revenue=metrics['revenue'],
        cogs=0.0, # TODO: Extract detailed categories
        opex=metrics['expenses'],
        net_profit=metrics['net_profit'],
        assets=0.0,
        liabilities=0.0,
        equity=0.0,
        raw_data_path=file_location
    )
    db.add(record)
    db.commit()
    
    # 4. Run AI Analysis
    company_info = {
        "name": company.name,
        "industry": company.industry,
        "business_type": company.business_type
    }
    
    print(f"----- CALCULATED METRICS FOR AI -----\n{metrics}\n-------------------------------------")
    ai_result = get_financial_advice(metrics, company_info)
    
    # 5. Save Assessment
    # Handle error in AI result
    if isinstance(ai_result, dict) and "error" in ai_result:
        # Log error but don't fail, maybe just save basic
        assessment = Assessment(
            company_id=company_id,
            overall_score=0,
            risk_level="Unknown",
            summary_report="AI Analysis Failed: " + ai_result["error"],
            recommendations="[]"
        )
    else:
        # Parse JSON from AI (assuming strict format or use robust parser)
        # For valid JSON string response
        import json
        try:
            # Clean md code blocks if any
            clean_json = ai_result.replace("```json", "").replace("```", "")
            data = json.loads(clean_json)
            assessment = Assessment(
                company_id=company_id,
                overall_score=100 - data.get('risk_score', 0), # Inverting for Health Score (0 Risk -> 100 Health)
                risk_level="Calculated", 
                summary_report=data.get('executive_summary', ''),
                recommendations=json.dumps(data.get('recommendations', []))
            )
        except:
             assessment = Assessment(
                company_id=company_id,
                overall_score=50,
                risk_level="Parse Error",
                summary_report=ai_result, # Save raw text
                recommendations="[]"
            )

    db.add(assessment)
    db.commit()

    return {
        "status": "success", 
        "metrics": metrics, 
        "assessment": {
            "score": assessment.overall_score,
            "risk": assessment.risk_level,
            "summary": assessment.summary_report,
            "recommendations": assessment.recommendations
        }
    }

@app.post("/companies/", response_model=CompanySchema)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@app.get("/companies/", response_model=List[CompanySchema])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()

class SimulationRequest(BaseModel):
    base_metrics: dict
    modifiers: dict
    company_info: dict

@app.post("/simulate")
def run_simulation(request: SimulationRequest):
    # 1. Calculate Math
    projection = calculate_projection(request.base_metrics, request.modifiers)
    
    # 2. AI Analysis
    risk_analysis = analyze_scenario(projection, request.company_info)
    
    return {
        "projection": projection,
        "ai_analysis": risk_analysis
    }
