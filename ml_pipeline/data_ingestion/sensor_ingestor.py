import json
from datetime import datetime
from typing import Dict, Any

class SensorIngestor:
    """
    Standardizes and validates incoming sensor telemetry.
    """
    def __init__(self):
        self.required_fields = ["machine_id", "vibration", "temperature", "torque"]

    def validate_payload(self, payload: Dict[str, Any]) -> bool:
        return all(field in payload for field in self.required_fields)

    def preprocess(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalization and basic cleaning.
        """
        # Example clipping for vibration outliers (extreme noise)
        if "vibration" in payload:
            payload["vibration"] = max(0.0, min(payload["vibration"], 50.0))
        
        # Ensure timestamp exists
        if "timestamp" not in payload:
            payload["timestamp"] = datetime.utcnow().isoformat()
            
        return payload

def ingest_sensor_bundle(bundle: Dict[str, Any]):
    ingestor = SensorIngestor()
    if ingestor.validate_payload(bundle):
        return ingestor.preprocess(bundle)
    else:
        raise ValueError("Incomplete sensor data bundle.")
