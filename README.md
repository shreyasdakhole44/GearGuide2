# GearGuide | AI Predictive Maintenance Ecosystem

GearGuide is a high-fidelity industrial monitoring system that combines machine learning, 3D digital twins, and LLM-powered technical reasoning to predict and explain equipment failures before they occur.

## 🚀 Key Features

### 1. Sentinel AI Command Center
- **Neural Diagnostics**: Real-time failure probability analysis using Random Forest and Neural Network ensembles.
- **Grok-3 Reasoning**: Automated root cause analysis and technical briefings powered by Groq LLMs.
- **Mission Briefings**: Detailed PDF reports generated automatically for maintenance teams.

### 2. Inventory Machine Dashboard (VajraNet)
- **3D Digital Twin**: Real-time 3D floor visualization with health-coded machine nodes.
- **Onboarding Workflow**: Smart machine registration with auto-fill nomenclature and warranty tracking.
- **Telemetry Drill-down**: Detailed vibration and temperature gradients for individual assets.

### 3. Industrial Data Ingestion
- **PDF Archive**: Indexing and searching legacy maintenance logs using FAISS vector storage.
- **Sensor Simulation**: High-fidelity data stream for demonstration and training.

---

## 🛠️ Installation & Execution

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. AI Service (Python Backend)
```bash
cd ai_service
# Create and activate virtual environment
python -m venv .venv
source .venv/Scripts/activate # Windows: .venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run service
python main.py
```

### 2. Node Backend (Proxy & API)
```bash
cd backend
npm install
node server.js
```

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## ⚠️ Configuration (IMPORTANT)

This project requires environment variables for AI features. Ensure the following files are configured (they are ignored by git for security):

### `ai_service/.env`
```env
GROQ_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
HF_TOKEN=your_token_here (optional)
```

### `backend/.env`
*(If applicable, ensure database URLs and tokens are set here)*

---

## 🏗️ Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Three.js (R3F), Recharts.
- **Backend**: Node.js, Express, FastAPI, Python.
- **AI/ML**: PyTorch, Scikit-Learn, FAISS, Sentence-Transformers, Groq API.
- **Graphics**: @react-three/fiber, @react-three/drei.

---
*Created by [RAJRAUT2324](https://github.com/RAJRAUT2324)*
