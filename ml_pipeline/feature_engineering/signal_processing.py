import numpy as np
from typing import List, Dict

class SignalProcessor:
    """
    Processes raw sensor streams into ML-ready features.
    """
    def __init__(self, window_size: int = 50):
        self.window_size = window_size

    def calculate_rolling_stats(self, data: List[float]) -> Dict[str, float]:
        if len(data) < self.window_size:
            return {"mean": 0.0, "std": 0.0, "max": 0.0}
        
        window = np.array(data[-self.window_size:])
        return {
            "mean": np.mean(window),
            "std": np.std(window),
            "max": np.max(window),
            "gradient": (window[-1] - window[0]) / self.window_size
        }

    def compute_fft_features(self, vibration_signal: List[float]) -> Dict[str, float]:
        """
        Extracts dominant frequencies from vibration data.
        """
        if len(vibration_signal) < self.window_size:
            return {"peak_freq": 0.0, "total_power": 0.0}
        
        signal = np.array(vibration_signal[-self.window_size:])
        fft_values = np.fft.fft(signal)
        psd = np.abs(fft_values) ** 2
        
        return {
            "peak_freq": float(np.argmax(psd)),
            "total_power": float(np.sum(psd)),
            "entropy": float(-np.sum(psd * np.log(psd + 1e-12)))
        }

    def calculate_shaft_health_indices(self, vibration: float, torque: float) -> float:
        """
        Combined index: High vibration + Unstable torque = Lower health.
        """
        # Normalized indices (0 to 1)
        vibe_score = max(0.0, 1.0 - (vibration / 15.0))
        torque_score = max(0.0, 1.0 - (torque / 5000.0))
        return (vibe_score * 0.7) + (torque_score * 0.3)
