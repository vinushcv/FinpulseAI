from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    industry = Column(String)
    business_type = Column(String) # e.g., Manufacturing, Retail, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    financial_records = relationship("FinancialRecord", back_populates="company")
    assessments = relationship("Assessment", back_populates="company")

class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    
    # Financial metrics (simplified for MVP)
    revenue = Column(Float)
    cogs = Column(Float)
    opex = Column(Float)
    net_profit = Column(Float)
    assets = Column(Float)
    liabilities = Column(Float)
    equity = Column(Float)
    
    # Raw data storage (e.g., JSON of the full CSV)
    raw_data_path = Column(String, nullable=True)

    company = relationship("Company", back_populates="financial_records")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    overall_score = Column(Integer) # 0-100
    risk_level = Column(String) # Safe, Caution, Critical
    
    summary_report = Column(Text) # AI generated text
    recommendations = Column(Text) # JSON or markdown list
    
    company = relationship("Company", back_populates="assessments")
