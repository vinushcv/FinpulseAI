from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Company Schemas
class CompanyBase(BaseModel):
    name: str
    industry: str
    business_type: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Financial Record Schemas
class FinancialRecordCreate(BaseModel):
    period_start: datetime
    period_end: datetime
    revenue: float
    cogs: float
    opex: float
    net_profit: float
    assets: float
    liabilities: float
    equity: float
    raw_data_path: Optional[str] = None

class FinancialRecord(FinancialRecordCreate):
    id: int
    company_id: int
    class Config:
        from_attributes = True

# Assessment Schemas
class AssessmentBase(BaseModel):
    overall_score: int
    risk_level: str
    summary_report: str
    recommendations: str

class AssessmentCreate(AssessmentBase):
    pass

class Assessment(AssessmentBase):
    id: int
    company_id: int
    created_at: datetime
    class Config:
        from_attributes = True
