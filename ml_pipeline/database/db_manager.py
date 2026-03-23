import os
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database Configuration
DATABASE_URL = os.getenv("ML_DATABASE_URL", "sqlite:///./ml_predictive.db")

Base = declarative_base()

class MachineSensorData(Base):
    __tablename__ = "machine_sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    vibration = Column(Float)
    temperature = Column(Float)
    torque = Column(Float)
    speed = Column(Float)
    tool_wear = Column(Float)
    power_consumption = Column(Float)

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    log_text = Column(String)
    extracted_tags = Column(JSON) # e.g., ["shaft_break", "overheating"]

class PredictionResult(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    failure_probability = Column(Float)
    predicted_failure_type = Column(String)
    rul_hours = Column(Float)
    model_version = Column(String)

# Engine setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
