from .failure_classifier import FailureClassifier
from .rul_lstm import RULPredictor
from .shaft_prediction import ShaftPredictionModule
from ..data_ingestion.sensor_ingestor import SensorIngestor
import numpy as np
from typing import Dict, Any, List

class PredictionEngine:
    """
    FEATURE 7: Prediction Engine.
    Orchestrates the entire ML inference flow.
    """
    def __init__(self):
        self.classifier = FailureClassifier()
        self.rul_predictor = RULPredictor()
        self.shaft_module = ShaftPredictionModule()
        self.sensor_ingestor = SensorIngestor()

    def process_realtime_data(self, 
                              sensor_data: Dict[str, Any], 
                              historical_vibe: List[float], 
                              historical_torque: List[float],
                              maintenance_tags: List[str] = []) -> Dict[str, Any]:
        """
        Main entry point for real-time inference.
        """
        # 1. Ingest/Clean
        clean_data = self.sensor_ingestor.preprocess(sensor_data)
        
        # 2. Run Shaft Specialized Module
        shaft_report = self.shaft_module.analyze_shaft_health(
            historical_vibe, 
            historical_torque, 
            maintenance_tags
        )
        
        # 3. Base Classification (Ensemble)
        # Mocking feature vector for demo
        feat_vector = np.array([[clean_data["vibration"], clean_data["temperature"], clean_data["torque"]]])
        class_report = self.classifier.predict(feat_vector)
        
        # 4. RUL Forecasting
        mock_seq = np.array(historical_vibe)
        rul_val = self.rul_predictor.predict_rul(mock_seq)
        
        # 5. Synthesis
        final_probability = max(shaft_report["failure_probability"], class_report["failure_probability"])
        predicted_failure = shaft_report["predicted_failure"] if shaft_report["failure_probability"] > 0.5 else class_report["predicted_class"]
        
        return {
            "machine_id": sensor_data.get("machine_id", "UNKNOWN"),
            "failure_probability": round(final_probability, 2),
            "predicted_failure": predicted_failure,
            "remaining_life_hours": int(rul_val),
            "telemetry_health": "WARNING" if final_probability > 0.6 else "STABLE"
        }
