const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: false },
    riskScore: { type: Number, required: true },
    predictedIssue: { type: String, required: true },
    recommendation: { type: String, required: true },
    
    // High-Fidelity IIoT Data
    neuralInsight: { type: String },
    reason: { type: String },
    rootCauseAnalysis: [{ type: String }],
    recommendedActions: [{ type: String }],
    realTimeSensorSnapshot: { type: mongoose.Schema.Types.Mixed }, // Dynamic sensor object (supports strings/numbers)
    
    // Metadata
    predictedFailureTime: { type: String },
    confidenceScore: { type: String },
    priorityLevel: { type: String },
    dispatchTimeline: { type: String },
    
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
