const express = require('express');
const router = express.Router();
const DowntimeData = require('../models/DowntimeData');

// @route   GET api/analytics/downtime
router.get('/downtime', async (req, res) => {
    try {
        const data = await DowntimeData.find().sort({ date: 1 });
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
