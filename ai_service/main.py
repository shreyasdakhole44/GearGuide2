from fastapi import FastAPI, HTTPException, Body, UploadFile, File
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import joblib
import torch
import torch.nn as nn
import numpy as np
import os
import json
import asyncio
import tempfile
from typing import List

# Import Sentinel Modules
from ai_agent.grok_reasoning_agent import generate_root_cause, generate_maintenance_explanation, answer_operator_query
from vector_db.maintenance_vector_store import store_maintenance_log, search_similar_failures, get_machine_history, initialize_db
from ingestion.pdf_parser import extract_text_from_pdf, parse_maintenance_data
from reports.pdf_report_generator import generate_maintenance_report
import sys

# Add root project path to sys.path for cross-module imports
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

from ml_pipeline.post_processing.decision_engine import decision_engine
from ml_pipeline.context.context_builder import context_builder

# -------------------------------
# Neural Network Model Definition
# -------------------------------

class HealthNN(nn.Module):
    def __init__(self, input_dim):
        super(HealthNN, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.fc(x)


# -------------------------------
# FastAPI Setup
# -------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_db()
    yield

app = FastAPI(title="Sentinel Core - Executive Command Center", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# File Paths
# -------------------------------

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
RF_MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.pkl")
NN_MODEL_PATH = os.path.join(MODEL_DIR, "nn_model.pt")
FEATURES_PATH = os.path.join(MODEL_DIR, "features.pkl")

# -------------------------------
# Global Variables
# -------------------------------

scaler = None
rf_model = None
nn_model = None

feature_order = [
    'torque',
    'temperature',
    'tool_wear',
    'vibration',
    'rpm',
    'power_consumption',
    'air_temperature',
    'pressure',
    'operating_hours',
    'machine_age',
    'last_maintenance_days'
]

# -------------------------------
# Load Models
# -------------------------------

try:

    if os.path.exists(FEATURES_PATH):
        feature_order = joblib.load(FEATURES_PATH)

    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)

    if os.path.exists(RF_MODEL_PATH):
        rf_model = joblib.load(RF_MODEL_PATH)

    if os.path.exists(NN_MODEL_PATH):
        nn_model = HealthNN(len(feature_order))
        nn_model.load_state_dict(torch.load(NN_MODEL_PATH))
        nn_model.eval()

    print("AI Assets Initialized")

except Exception as e:
    print("CRITICAL MODEL LOAD ERROR:", e)


# Lifespan handled via @asynccontextmanager

# -------------------------------
# Core Prediction Logic (Isolated for reuse)
# -------------------------------

def run_prediction_core(data: dict):
    """
    Internal helper to run the core ML logic without repeating code.
    This ensures the 'ML prediction system is NOT changed' requirement.
    """
    input_values = []
    
    # Feature extraction mapping for the existing model
    for f in feature_order:
        try:
            val = data.get(f)
            input_values.append(float(val if val is not None else 0))
        except:
            input_values.append(0.0)

    X = np.array([input_values])

    # Model Inference (Untouched logic)
    if scaler and rf_model and nn_model:
        X_scaled = scaler.transform(X)
        rf_prob = float(rf_model.predict_proba(X_scaled)[0][1])
        X_tensor = torch.FloatTensor(X_scaled)
        with torch.no_grad():
            nn_prob = float(nn_model(X_tensor).item())
        final_prob = (rf_prob + nn_prob) / 2
    else:
        # Fallback logic parity
        temp = float(data.get("temperature") or 0)
        vibr = float(data.get("vibration") or 0)
        final_prob = 0.82 if (temp > 85 or vibr > 1.1) else 0.12

    machine_age = float(data.get("machine_age") or 5)
    hours = float(data.get("operating_hours") or 1000)
    
    # -------------------------------
    # AI Safety Guardrails (Parity)
    # -------------------------------
    guardrail_status = "VALIDATED"
    guardrail_intervention = False
    intervention_reason = ""
    if machine_age > 20 or hours > 20000:
        guardrail_status = "GUARDRAIL_INTERVENTION"
        guardrail_intervention = True
        intervention_reason = "Machine has exceeded its engineered service lifecycle (EOL)."
    
    m_log = str(data.get("maintenance_log") or "").lower()
    if any(word in m_log for word in ["decommission", "irreparable", "scrap", "terminal"]):
        guardrail_status = "GUARDRAIL_INTERVENTION"
        guardrail_intervention = True
        intervention_reason = "Documented irreversible wear condition detected."

    if guardrail_intervention:
        return {
            "guardrail_status": guardrail_status,
            "neural_insight": "AI SAFETY GUARDRAIL ACTIVE",
            "reason": intervention_reason,
            "root_cause_analysis": ["Lifecycle depletion"],
            "recommended_actions": ["Initiate decommissioning workflow"],
            "failure_probability": "100%",
            "is_critical": True,
            "priority_level": "TERMINAL",
            "dispatch_timeline": "CEASE OPERATIONS",
            "potential_savings": "$0 (Asset Depleted)",
            "roi_projection": "0%",
            "final_prob": 1.0,
            "real_time_sensor_snapshot": {k: str(data.get(k, 0)) for k in feature_order}
        }

    # -------------------------------
    # Pattern Detection (Heuristics Parity)
    # -------------------------------
    temp = float(data.get("temperature") or 0)
    vibr = float(data.get("vibration") or 0)
    torque = float(data.get("torque") or 0)
    p_cons = float(data.get("power_consumption") or 0)
    tool_w = float(data.get("tool_wear") or 0)
    rpm = float(data.get("rpm") or 0)
    press = float(data.get("pressure") or 0)

    thermal_crisis = temp > 90
    bearing_degradation = (vibr > 1.2) or (vibr > 0.8 and rpm > 3500)
    drive_overload = (torque > 80) and (p_cons > 1800)
    critical_wear = (tool_w > 240) or (tool_w > 180 and hours > 4000)
    pressure_failure = (press > 145) or (press > 0 and press < 40)

    if thermal_crisis or bearing_degradation or drive_overload or critical_wear or pressure_failure:
        final_prob = max(final_prob, 0.72)
        if thermal_crisis and bearing_degradation: final_prob = 0.94
    
    is_critical = final_prob > 0.7

    # Diagnostic Insight Generation (Parity)
    if thermal_crisis:
        insight = "Critical Thermal Excursion"
        reason = f"Actuator temperature reached {temp}°C, exceeding safe operating threshold."
        causes = ["Cooling fan failure", "Thermal paste degradation"]
        actions = ["Initiate emergency cooling", "Verify fan integrity"]
    elif bearing_degradation:
        insight = "Kinematic Instability Detected"
        reason = f"Vibration levels ({vibr} mm/s) at high RPM ({rpm}) indicate resonance."
        causes = ["Bearing race pitting", "Improper shaft alignment"]
        actions = ["Schedule lubrication", "Perform laser alignment"]
    elif drive_overload:
        insight = "Electro-Mechanical Overload"
        reason = f"High torque ({torque} Nm) combined with excessive power suggests strain."
        causes = ["Gearbox binding", "Payload exceeding limits"]
        actions = ["Check gearbox oil", "Reduce load factor"]
    elif critical_wear:
        insight = "Precision Component Depletion"
        reason = f"Combined wear index ({tool_w}) and runtime ({hours}h) suggest EOL status."
        causes = ["Abrasive wear cycle"]
        actions = ["Replace tool assembly"]
    elif pressure_failure:
        insight = "Pneumatic/Hydraulic Instability"
        reason = f"System pressure variant ({press}) outside nominal window."
        causes = ["Seal leakage", "Compressor bypass failure"]
        actions = ["Inspect air lines"]
    else:
        insight = "Routine operational wear"
        reason = "Machine parameters within acceptable tolerance for current lifecycle stage."
        causes = ["Normal mechanical fatigue"]
        actions = ["Continue monitoring", "Schedule inspection in 30 days"]

    health_score = round(float(1 - final_prob) * 100, 2)
    f_time = "2-4 hours" if is_critical and final_prob > 0.9 else "6-12 hours" if is_critical else "30+ days"
    conf = f"{80 + (final_prob * 10):.1f}%"
    
    pot_sav = final_prob * 45000
    roi = (pot_sav / 1200) * 100

    return {
        "guardrail_status": guardrail_status,
        "neural_insight": insight,
        "reason": reason,
        "root_cause_analysis": causes,
        "recommended_actions": actions,
        "system_health_score": f"{health_score}%",
        "failure_probability": f"{final_prob * 100:.1f}%",
        "predicted_failure_time": f_time,
        "priority_level": "CRITICAL" if is_critical and final_prob > 0.9 else "HIGH" if is_critical else "NORMAL",
        "confidence_score": conf,
        "dispatch_timeline": "IMMEDIATE DISPATCH" if is_critical else "SCHEDULE INSPECTION IN 30 DAYS",
        "potential_savings": f"${pot_sav:,.2f}",
        "roi_projection": f"{roi:.1f}%",
        "final_prob": final_prob,
        "is_critical": is_critical,
        "real_time_sensor_snapshot": {k: str(data.get(k, 0)) for k in feature_order}
    }

# -------------------------------
# Endpoints
# -------------------------------

@app.post("/predict")
async def predict(data: dict = Body(...)):
    try:
        # Extract Identification Kernel Metadata
        machine_id = data.get("machine_id", "Unknown")
        machine_model = data.get("machine_model", "ST-900 INDUSTRIAL CORE")
        machine_type = data.get("machine_type", "INDUSTRIAL UNIT")
        
        # Build Machine Context
        context = context_builder.build_machine_context(machine_id, machine_model)
        
        report = run_prediction_core(data)
        
        # FEATURE 2: Grok Reasoning Agent (Non-deterministic explanations) - NOW CONTEXT AWARE
        report["technical_explanation"] = generate_root_cause(report, context)
        report["maintenance_briefing"] = generate_maintenance_explanation(report, context)
        
        # FEATURE 3: Vector Store archival - ENHANCED METADATA
        log_text = data.get("maintenance_log")
        if log_text:
            store_maintenance_log(
                machine_id=machine_id,
                machine_model=machine_model,
                machine_type=machine_type,
                log_text=log_text
            )
            
        # --- POST-PROCESSING CONSISTENCY LAYER ---
        report = decision_engine.correct_prediction(report, context)
            
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/machines/analyze")
async def analyze_machines(request: dict = Body(...)):
    """
    FEATURE 1 & 8: Batch Processing for multiple machines.
    """
    machines = request.get("machines", [])
    if not machines:
        raise HTTPException(status_code=400, detail="No machine data provided.")

    async def analyze_unit(m):
        # Extract context for each machine in batch
        m_id = m.get("machine_id", "Unknown")
        m_model = m.get("machine_model", "ST-900 INDUSTRIAL CORE")
        context = context_builder.build_machine_context(m_id, m_model)
        
        res = run_prediction_core(m)
        res["machine_id"] = m_id
        res["technical_explanation"] = generate_root_cause(res, context)
        
        # --- POST-PROCESSING CONSISTENCY LAYER ---
        res = decision_engine.correct_prediction(res, context)
        
        return res

    results = await asyncio.gather(*[analyze_unit(m) for m in machines])
    
    # Ranking (Ensuring list type for robust sorting)
    results = sorted(list(results), key=lambda x: x.get("final_prob", 0), reverse=True)
    
    return {"results": results}

@app.post("/upload-maintenance-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    FEATURE 4: PDF Ingestion.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Document must be PDF.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        text = extract_text_from_pdf(tmp_path)
        data = parse_maintenance_data(text)
        report = run_prediction_core(data)
        
        m_id = data.get("machine_id", "PDF_EXTRACT")
        m_model = data.get("machine_model", "ST-900 INDUSTRIAL CORE")
        context = context_builder.build_machine_context(m_id, m_model)
        
        if data.get("maintenance_log"):
            store_maintenance_log(
                machine_id=m_id,
                machine_model=m_model,
                machine_type=data.get("machine_type", "PDF PROFILE"),
                log_text=data["maintenance_log"]
            )
            
        # --- POST-PROCESSING CONSISTENCY LAYER ---
        report = decision_engine.correct_prediction(report, context)
            
        return {
            "parsed_data": data,
            "diagnostic": report
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/generate-report")
async def generate_report_endpoint(report_data: dict = Body(...)):
    """
    FEATURE 5: PDF Report Generation.
    """
    filename = f"report_{report_data.get('machine_id', 'asset')}.pdf"
    output_path = os.path.join(tempfile.gettempdir(), filename)
    
    generate_maintenance_report(report_data, output_path)
    return {"status": "SUCCESS", "filename": filename, "download_link": f"/temp/{filename}"}

@app.post("/maintenance-summary")
async def maintenance_summary(request: dict = Body(...)):
    """
    FEATURE 7: Command Center Summary.
    """
    results = request.get("results", [])
    critical = [m for m in results if m.get("is_critical")]
    
    msg = "SYSTEM STABLE: All assets within nominal range."
    if critical:
        msg = "CRITICAL ALERT: Immediate intervention required for:\n"
        for m in critical:
            msg += f"- {m.get('machine_id')}: {m.get('neural_insight')}\n"
            
    return {"summary": msg, "count": len(results), "critical": len(critical)}

@app.get("/machines/{machine_id}/history")
async def get_history(machine_id: str):
    return {"history": get_machine_history(machine_id)}

@app.post("/chat")
async def chat(request: dict = Body(...)):
    """
    Updated Chat using the Reasoning Agent.
    """
    machine_report = request.get("machine_report", {})
    user_query = request.get("query", "")
    
    if not machine_report:
        return {"response": "SENTINEL: Neural link disrupted. No report available."}
        
    response = answer_operator_query(machine_report, user_query)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
