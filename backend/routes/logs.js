const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MaintenanceLog = require('../models/MaintenanceLog');

// @route   POST api/logs
// @desc    Add new maintenance log
// @access  Private
router.post('/', auth, async (req, res) => {
    const { machineId, issue, actionTaken, technician, date } = req.body;

    try {
        const newLog = new MaintenanceLog({
            machineId, issue, actionTaken, technician, date
        });

        const log = await newLog.save();
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/logs
// @desc    Get all maintenance logs
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const logs = await MaintenanceLog.find().populate('machineId', ['name', 'location']).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
