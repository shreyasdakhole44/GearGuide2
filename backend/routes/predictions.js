const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prediction = require('../models/Prediction');

// @route   GET api/predictions
// @desc    Get all predictions
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const predictions = await Prediction.find().populate('machineId', ['name', 'location']).sort({ timestamp: -1 });
        res.json(predictions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/predictions/predict
// @desc    Generate a prediction internally (Ported from Python AI service)
// @access  Private
router.post('/predict', auth, async (req, res) => {
    const { machineId, log } = req.body;

    try {
        const logText = log ? log.toLowerCase() : '';

        // Simple rule-based NLP replacing the Python service
        let riskScore = 10;
        let issue = "Normal Operation";
        let recommendation = "Routine maintenance as scheduled.";

        if (logText.includes("overheating") || logText.includes("hot")) {
            riskScore += 40;
            issue = "Possible bearing failure or cooling system issue";
            recommendation = "Inspect motor and cooling system within 3 days";
        }

        if (logText.includes("vibration") || logText.includes("shaking")) {
            riskScore += 35;
            issue = "Misalignment or bearing wear";
            recommendation = "Check alignment and bearings immediately";
        }

        if (logText.includes("noise") || logText.includes("loud")) {
            riskScore += 20;
            issue = "Lubrication issue or loose parts";
            recommendation = "Lubricate and tighten securing bolts within 7 days";
        }

        if (logText.includes("leak")) {
            riskScore += 50;
            issue = "Seal failure";
            recommendation = "Replace seals immediately to prevent fluid loss";
        }

        if (riskScore > 95) {
            riskScore = 95;
        }

        if (riskScore === 10) {
            riskScore = Math.floor(Math.random() * 21) + 10; // Random 10 to 30
        }

        const newPrediction = new Prediction({
            machineId,
            riskScore,
            predictedIssue: issue,
            recommendation
        });

        const prediction = await newPrediction.save();
        res.json(prediction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;
