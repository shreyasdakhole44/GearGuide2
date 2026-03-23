import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from typing import List, Dict, Any

class FailureClassifier:
    """
    Classifies the type of machine failure based on engineered features.
    """
    def __init__(self, model_path: str = None):
        if model_path:
            self.model = joblib.load(model_path)
        else:
            # Default placeholder model
            self.model = RandomForestClassifier(n_estimators=100, max_depth=10)
            self._is_trained = False

    def train(self, X_train: np.ndarray, y_train: np.ndarray):
        self.model.fit(X_train, y_train)
        self._is_trained = True

    def predict(self, features: np.ndarray) -> Dict[str, Any]:
        """
        Returns failure probability and predicted class.
        """
        if not hasattr(self, "_is_trained") or not self._is_trained:
            # Mock prediction for initialization/demo phase
            return {
                "failure_probability": 0.05,
                "predicted_class": "nominal",
                "is_simulated": True
            }
        
        probs = self.model.predict_proba(features)[0]
        prediction = self.model.predict(features)[0]
        
        return {
            "failure_probability": float(np.max(probs)),
            "predicted_class": str(prediction),
            "is_simulated": False
        }

    def save(self, path: str):
        joblib.dump(self.model, path)
