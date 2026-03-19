import pandas as pd
import numpy as np
import joblib
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

# =========================
# LOAD DATA
# =========================
# If dataset doesn't exist, create it
if not os.path.exists("model_train/final_dataset.csv"):
    print("Dataset not found, generating synthetic data...")
    import generate_data

df = pd.read_csv("model_train/final_dataset.csv")

print(df.head())
print("\n✅ Data loaded successfully")
print("Dataset shape:", df.shape)

# =========================
# PREPROCESSING
# =========================
print("\n preprocessing data..")

# clean column names
df.columns = df.columns.str.strip()

# drop useless column
df = df.drop(columns=["Machine_ID"], errors="ignore")

print("\nColumns in dataset:")
print(df.columns)

# define features and target
x = df.drop("Machine_Failure", axis=1)
y = df["Machine_Failure"]

# save feature order
feature_columns = x.columns
joblib.dump(feature_columns, "features.pkl")

# =========================
# TRAIN TEST SPLIT
# =========================
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42
)

# =========================
# SCALING
# =========================
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.transform(x_test)

# =========================
# RANDOM FOREST MODEL
# =========================
print("\n Training RandomForest...")

rf_model = RandomForestClassifier(
    n_estimators=500,
    max_depth=20,
    min_samples_split=3,
    class_weight="balanced",
    random_state=42
)

rf_model.fit(x_train_scaled, y_train)

# =========================
# PYTORCH MODEL
# =========================
print("\nTraining PyTorch model...")

x_train_t = torch.tensor(x_train_scaled, dtype=torch.float32)
y_train_t = torch.tensor(y_train.values, dtype=torch.float32).view(-1, 1)
x_test_t = torch.tensor(x_test_scaled, dtype=torch.float32)

class NeuralNet(nn.Module):
    def __init__(self, input_dim):
        super(NeuralNet, self).__init__()
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

nn_model = NeuralNet(x_train_scaled.shape[1])

loss_fn = nn.BCELoss()
optimizer = torch.optim.Adam(nn_model.parameters(), lr=0.001)

# training loop
for epoch in range(50):
    nn_model.train()

    output = nn_model(x_train_t)
    loss = loss_fn(output, y_train_t)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")

# =========================
# SAVE MODELS
# =========================
joblib.dump(rf_model, "rf_model.pkl")
joblib.dump(scaler, "scaler.pkl")
torch.save(nn_model.state_dict(), "nn_model.pt")

print("\n💾 Models saved successfully")
