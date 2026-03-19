import pandas as pd
import numpy as np
import joblib
import torch
import torch.nn as nn
import sys
import json

# Define the model class (must match train_model.py)
class NeuralNet(nn.Module):
    def __init__(self, input_size):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.BatchNorm1d(128),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

def predict():
    try:
        # Load models and scaler
        rf_model = joblib.load("rf_model.pkl")
        scaler = joblib.load("scaler.pkl")
        feature_columns = joblib.load("features.pkl")
        
        input_size = len(feature_columns)
        nn_model = NeuralNet(input_size)
        nn_model.load_state_dict(torch.load("nn_model.pt", map_location=torch.device('cpu')))
        nn_model.eval()

        # Parse command line arguments
        if len(sys.argv) < 12:
            print(json.dumps({"error": "Missing inputs. Need 11 sensor values."}))
            return

        inputs = [float(arg) for arg in sys.argv[1:12]]
        
        # Order: Torque, Temperature, Tool_Wear, Vibration, RPM, Power_Consumption, Air_Temperature, Pressure, Operating_Hours, Machine_Age, Last_Maintenance_Days
        user_dict = dict(zip(feature_columns, inputs))
        user_df = pd.DataFrame([user_dict])
        user_df = user_df[feature_columns]

        # scale
        user_input_scaled = scaler.transform(user_df)

        # RF prediction
        rf_p = rf_model.predict_proba(user_input_scaled)[0][1]

        # NN prediction
        user_tensor = torch.tensor(user_input_scaled, dtype=torch.float32)
        with torch.no_grad():
            nn_p = nn_model(user_tensor).detach().numpy()[0][0]

        # final prediction
        final_p = float((rf_p + nn_p) / 2)
        
        result = {
            "final_prob": final_p,
            "rf_prob": float(rf_p),
            "nn_prob": float(nn_p),
            "status": "Failure Risk" if final_p > 0.5 else "Healthy"
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    predict()
