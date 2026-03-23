import numpy as np
from typing import Dict, Any, List
from ..feature_engineering.signal_processing import SignalProcessor

class ShaftPredictionModule:
    """
    FEATURE 5: Dedicated shaft failure detection.
    Integrates vibration spikes, torque fluctuation, and rotational imbalance.
    """
    def __init__(self, vibration_threshold: float = 12.0, torque_std_threshold: float = 150.0):
        self.vibe_threshold = vibration_threshold
        self.torque_std_threshold = torque_std_threshold
        self.signal_processor = SignalProcessor()

    def analyze_shaft_health(self, 
                             vibration_window: List[float], 
                             torque_window: List[float], 
                             maintenance_tags: List[str]) -> Dict[str, Any]:
        """
        Combines current sensor state with historical context to detect shaft snapping risks.
        """
        vibe_stats = self.signal_processor.calculate_rolling_stats(vibration_window)
        fft_stats = self.signal_processor.compute_fft_features(vibration_window)
        torque_stats = self.signal_processor.calculate_rolling_stats(torque_window)

        # 1. Detect Imbalance (FFT Power + Peak Frequency inconsistency)
        imbalance_risk = 0.0
        if fft_stats["total_power"] > 500: # Arbitrary power units
            imbalance_risk = 0.6
        
        # 2. Detect Torque Oscillation (High STD in torque window)
        torque_instability = 0.0
        if torque_stats["std"] > self.torque_std_threshold:
            torque_instability = 0.8

        # 3. Vibration Spikes
        vibe_spike = 1.0 if vibe_stats["max"] > self.vibe_threshold else 0.0

        # 4. Contextual Match (Log history)
        context_match = 1.0 if "shaft_break" in maintenance_tags else 0.0

        # Weighted calculation
        risk_score = (vibe_spike * 0.4) + (torque_instability * 0.3) + (imbalance_risk * 0.2) + (context_match * 0.1)
        
        return {
            "machine_id": "M101", # Placeholder
            "failure_probability": float(risk_score),
            "predicted_failure": "shaft_break" if risk_score > 0.6 else "nominal",
            "remaining_life_hours": max(0.0, 100.0 * (1 - risk_score)),
            "risk_drivers": {
                "imbalance": imbalance_risk,
                "torque_instability": torque_instability,
                "vibration_spike": vibe_spike
            }
        }
