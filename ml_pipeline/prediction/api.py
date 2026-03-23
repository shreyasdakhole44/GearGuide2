from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .prediction_engine import PredictionEngine
from ..data_ingestion.sensor_ingestor import SensorIngestor
from ..data_ingestion.log_ingestor import LogIngestor
from ..database.db_manager import SessionLocal, init_db, MachineSensorData, MaintenanceLog
from ..post_processing.decision_engine import decision_engine
import uvicorn

app = FastAPI(title="ML-Sentinel: Predictive Maintenance Neural Core")
engine_core = PredictionEngine()

# --- INPUT SCHEMAS ---
class SensorPayload(BaseModel):
    machine_id: str
    vibration: float
    temperature: float
    torque: float
    speed: Optional[float] = 0.0
    tool_wear: Optional[float] = 0.0

class LogPayload(BaseModel):
    machine_id: str
    log_text: str

# --- INITIALIZATION ---
@app.on_event("startup")
async def startup_event():
    init_db()

# --- ENDPOINTS ---
@app.post("/predict")
async def predict_failure(payload: SensorPayload):
    """
    Main prediction endpoint that combines classification, RUL, and shaft analysis.
    """
    # For now, we use dummy historical data or fetch from local DB
    # In a full system, we would query the last N records for signal processing
    mock_vibe_history = [payload.vibration] * 50
    mock_torque_history = [payload.torque] * 50
    
    result = engine_core.process_realtime_data(
        payload.dict(), 
        mock_vibe_history, 
        mock_torque_history
    )
    
    # Optional: Log to ML Database
    db = SessionLocal()
    new_data = MachineSensorData(**payload.dict())
    db.add(new_data)
    db.commit()
    db.close()
    
    # --- POST-PROCESSING CONSISTENCY LAYER ---
    result = decision_engine.correct_prediction(result)
    
    return result

@app.post("/ingest-log")
async def ingest_log(payload: LogPayload):
    """
    Processes maintenance logs and stores extracted failure tags.
    """
    processor = LogIngestor()
    processed = processor.process_log(payload.dict())
    
    db = SessionLocal()
    new_log = MaintenanceLog(
        machine_id=processed["machine_id"],
        log_text=processed["log_text"],
        extracted_tags=processed["extracted_tags"]
    )
    db.add(new_log)
    db.commit()
    db.close()
    
    return {"status": "SUCCESS", "extracted": processed["extracted_tags"]}

@app.get("/health")
def health_check():
    return {"status": "ML_CORE_ONLINE", "version": "1.0.0-Sentinel"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
