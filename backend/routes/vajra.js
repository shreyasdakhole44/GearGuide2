const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VajraLog = require('../models/VajraLog');

// @route   POST api/vajranet/archive
// @desc    Archive live telemetry from VajraNet hardware
// @access  Private
router.post('/archive', auth, async (req, res) => {
    try {
        const { temperature, humidity, gasLevel, vibration } = req.body;
        
        const newLog = new VajraLog({
            temperature,
            humidity,
            gasLevel,
            vibration
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
