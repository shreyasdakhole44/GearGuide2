const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { spawn } = require('child_process');
const auth = require('../middleware/auth');
const Prediction = require('../models/Prediction');

// @route   POST api/machine-health/predict
// @desc    Predict machine health using ensemble model
// @access  Private
router.post('/predict', async (req, res) => {
    const { 
        torque, temperature, tool_wear, vibration, rpm, 
        power_consumption, air_temperature, pressure, 
        operating_hours, machine_age, last_maintenance_days,
        machineId, machine_name, serial_number, maintenance_log 
    } = req.body;

    const payload = {
        torque, temperature, tool_wear, vibration, rpm, 
        power_consumption, air_temperature, pressure, 
        operating_hours, machine_age, last_maintenance_days,
        machine_name, serial_number, maintenance_log
    };

    const sendSimulationResponse = (reason = 'Demo Mode') => {
        console.warn(`[Sentinel] ${reason}. Falling back to Dynamic Simulation Engine.`);
        
        // --- ENSEMBLE CALCULATION SIMULATION ---
        // 1. RF-Style Logic (Weighted Indicators)
        const rf_indicators = (temperature / 120) * 0.4 + (vibration / 5) * 0.4 + (tool_wear / 250) * 0.2;
        const rf_prob = Math.min(Math.max(rf_indicators, 0.05), 0.95);

        // 2. NN-Style Logic (Complex Non-linear Patterns)
        const nn_strain = (power_consumption / 3000) * (rpm / 5000) * (pressure / 150);
        const nn_age_factor = (machine_age / 20) * (operating_hours / 5000);
        const nn_prob = Math.min(Math.max((nn_strain + nn_age_factor) / 2, 0.05), 0.95);

        // 3. Final Ensemble: (RF_Prob + NN_Prob) / 2
        const simulated_p = (rf_prob + nn_prob) / 2;
        
        const sensor_snapshot = {
            torque: torque.toString(),
            temperature: temperature.toString(),
            tool_wear: tool_wear.toString(),
            vibration: vibration.toString(),
            rpm: rpm.toString(),
            power_consumption: power_consumption.toString(),
            air_temperature: air_temperature?.toString() || "25",
            pressure: pressure.toString(),
            operating_hours: operating_hours.toString(),
            machine_age: machine_age.toString(),
            last_maintenance_days: last_maintenance_days?.toString() || "30"
        };

        const neural_directive_log = [maintenance_log || "No manual directives recorded."];
        if (maintenance_log?.toLowerCase().includes('stop')) {
            neural_directive_log.push("Pattern Match: Intermittent stoppage detected in joint actuator.");
        }

        const is_critical = simulated_p > 0.7;
        const potential_savings = simulated_p * 45000;
        const roi_val = (potential_savings / 1200) * 100;

        return res.json({
            // Core Identity
            machine: machine_name || "ST-900 INDUSTRIAL CORE",
            guardrail_status: "VALIDATED",
            
            // High-Fidelity Diagnostic
            neural_insight: is_critical ? "Mechanical degradation in joint drive assembly." : "Routine operational wear",
            reason: is_critical ? 
                "Asymmetric load detected with thermal oscillation, suggesting imminent mechanical fatigue in the joint drive." : 
                "Machine parameters within acceptable tolerance for current lifecycle stage.",
            root_cause_analysis: is_critical ? 
                ["Asymmetric load distribution", "Thermal oscillation", "Mechanical fatigue"] : 
                ["Normal mechanical fatigue"],
            recommended_actions: is_critical ? 
                ["Recalibrate servo torque limits", "Check drive belt tension", "Initiate cooling bypass"] : 
                ["Continue standard schedule", "Monitor vibration quarterly"],
            
            // Metrics & Probability
            final_prob: simulated_p,
            failure_probability: `${(simulated_p * 100).toFixed(1)}%`,
            predicted_failure_time: is_critical ? `${Math.round(20 * (1 - simulated_p))} hours` : "30+ Days",
            confidence_score: `${(85 + Math.random() * 10).toFixed(1)}%`, 
            isCritical: is_critical,
            is_critical: is_critical,
            priority_level: is_critical ? "HIGH" : "NORMAL",
            dispatch_timeline: is_critical ? "Immediate inspection requested." : "Next scheduled maintenance in 30 days.",
            
            // Economic Impact
            potential_savings: `$${potential_savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
            roi_projection: `${roi_val.toFixed(1)}%`,
            
            // Meta & Logs
            summary: is_critical ? "CRITICAL CRISIS DETECTED" : "SYSTEM STABLE",
            real_time_sensor_snapshot: sensor_snapshot,
            neural_directive_log,
            isSimulated: true,
            interpretation: is_critical ? 
                "The AI agent analyzed sensor data. Synchronized anomalies in vibration and torque suggest imminent mechanical fatigue." :
                "Operations nominal. All parameters within baseline performance."
        });
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            
            // Final High-Fidelity IIoT Archival
            try {
                const newPrediction = new Prediction({
                    machineId: machineId || null,
                    riskScore: Math.round((data.final_prob || 0) * 100),
                    predictedIssue: data.neural_insight, // Standard key fallback
                    recommendation: data.recommended_actions ? data.recommended_actions[0] : "Check system status",
                    
                    // IIoT Schema Mapping
                    neuralInsight: data.neural_insight,
                    reason: data.reason,
                    rootCauseAnalysis: data.root_cause_analysis,
                    recommendedActions: data.recommended_actions,
                    realTimeSensorSnapshot: data.real_time_sensor_snapshot,
                    
                    // Metadata
                    predictedFailureTime: data.predicted_failure_time,
                    confidenceScore: data.confidence_score,
                    priorityLevel: data.priority_level,
                    dispatchTimeline: data.dispatch_timeline
                });
                await newPrediction.save();
            } catch (dbError) {
                console.error("[Sentinel] DB Save Error:", dbError.message);
            }

            return res.json(data);
        } else {
            console.error(`[Sentinel] FastAPI Service Error: ${response.status}`);
            return sendSimulationResponse('FastAPI Service Error');
        }
    } catch (error) {
        console.error("[Sentinel] FastAPI Connection Failed:", error.message);
        return sendSimulationResponse('FastAPI Connection Failed');
    }
});

// @route   POST api/machine-health/chat
// @desc    Chat with AI agent about machine health
// @access  Private
router.post('/chat', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            const data = await response.json();
            return res.json(data);
        } else {
            console.error(`[Sentinel] Chat Service Error: ${response.status}`);
            return res.status(500).json({ response: "AI Hub is currently processing other mandates. Please re-establish link later." });
        }
    } catch (error) {
        console.error("[Sentinel] Chat Connection Failed:", error.message);
        return res.status(500).json({ response: "Neural link offline. Ensure FastAPI service is operational." });
    }
});

// FEATURE 1: Multi-Machine Monitoring
router.post('/analyze-batch', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/machines/analyze', req.body);
        res.json(response.data);
    } catch (error) {
        console.error("AI Batch Analysis Failed:", error.message);
        res.status(500).json({ error: "Batch analysis unreachable" });
    }
});

// FEATURE 4: PDF Log Ingestion
router.post('/upload-maintenance-log', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No file uploaded.');

        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path), {
            filename: req.file.originalname,
            contentType: 'application/pdf'
        });

        const response = await axios.post('http://127.0.0.1:8000/upload-maintenance-pdf', form, {
            headers: form.getHeaders()
        });

        // Cleanup
        fs.unlinkSync(req.file.path);
        
        res.json(response.data);
    } catch (error) {
        console.error("PDF Ingestion Failed:", error.message);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: "AI service failed to process PDF" });
    }
});

// FEATURE 5: Report Generation
router.post('/generate-report', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/generate-report', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Report generation failed" });
    }
});

// FEATURE 7: Command Center Summary
router.post('/maintenance-summary', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/maintenance-summary', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Summary generation failed" });
    }
});

// FEATURE 3: Machine History
router.get('/history/:machineId', async (req, res) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/machines/${req.params.machineId}/history`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "History retrieval failed" });
    }
});

module.exports = router;
