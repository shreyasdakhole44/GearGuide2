const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');

// @route   GET api/workorders
router.get('/', async (req, res) => {
    try {
        const orders = await WorkOrder.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
