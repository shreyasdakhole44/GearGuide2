import pandas as pd
import numpy as np
import os

# Generate synthetic dataset for Machine Health Prediction
np.random.seed(42)
num_samples = 1000

data = {
    "Torque": np.random.uniform(10, 100, num_samples),
    "Temperature": np.random.uniform(20, 120, num_samples),
    "Tool_Wear": np.random.uniform(0, 250, num_samples),
    "Vibration": np.random.uniform(0.1, 5.0, num_samples),
    "RPM": np.random.uniform(1000, 5000, num_samples),
    "Power_Consumption": np.random.uniform(500, 3000, num_samples),
    "Air_Temperature": np.random.uniform(15, 50, num_samples),
    "Pressure": np.random.uniform(20, 150, num_samples),
    "Operating_Hours": np.random.uniform(0, 5000, num_samples),
    "Machine_Age": np.random.uniform(0, 20, num_samples),
    "Last_Maintenance_Days": np.random.uniform(0, 365, num_samples)
}

df = pd.DataFrame(data)

# Simple logic for failure: high temperature and high vibration
df["Machine_Failure"] = (
    (df["Temperature"] > 100) & (df["Vibration"] > 4.0) |
    (df["Tool_Wear"] > 220) |
    (df["Pressure"] > 130)
).astype(int)

# Add some noise
noise = np.random.choice([0, 1], size=num_samples, p=[0.95, 0.05])
df["Machine_Failure"] = np.logical_xor(df["Machine_Failure"], noise).astype(int)

os.makedirs("model_train", exist_ok=True)
df.to_csv("model_train/final_dataset.csv", index=False)
print("✅ Synthetic dataset created: model_train/final_dataset.csv")
