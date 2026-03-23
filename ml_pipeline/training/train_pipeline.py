import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from ..models.failure_classifier import FailureClassifier
from .ops import MLOpsTracker

def run_training_pipeline():
    """
    FEATURE 6: Model Training Pipeline.
    """
    tracker = MLOpsTracker()
    print("[Training] Ingesting training datasets...")
    
    # 1. Simulate Dataset (Synthetic sensor data for training)
    # X: [vibration, temperature, torque, pressure, speed]
    # y: [0: nominal, 1: shaft_break, 2: bearing_failure, 3: overheating]
    X = np.random.rand(1000, 5) * 10 
    y = np.random.randint(0, 4, 1000)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 2. Train Model
    print("[Training] Fitting FailureClassifier (RandomForest)...")
    clf = FailureClassifier()
    clf.train(X_train, y_train)

    # 3. Evaluate
    y_pred = [clf.model.predict([x])[0] for x in X_test]
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, average='macro'),
        "recall": recall_score(y_test, y_pred, average='macro'),
        "f1": f1_score(y_test, y_pred, average='macro')
    }
    
    # 4. Store & Version
    params = {"n_estimators": 100, "max_depth": 10}
    tracker.log_experiment("failure_classifier_v1", metrics, params)
    clf.save("ml_pipeline/artifacts/failure_classifier_latest.joblib")
    
    print("[Training] Pipeline complete. Metrics:", metrics)

if __name__ == "__main__":
    run_training_pipeline()
