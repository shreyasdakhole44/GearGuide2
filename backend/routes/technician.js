const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// @route   GET api/technicians
// @desc    Get all active technicians
// @access  Public
router.get('/', async (req, res) => {
    try {
        const technicians = await Technician.find().sort({ lastUpdated: -1 });
        res.json(technicians);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/technicians
// @desc    Add or update a technician
// @access  Public
router.post('/', async (req, res) => {
    const { name, role, activeDeployment, load, estFinish, status, avatar } = req.body;
    try {
        const newTech = new Technician({
            name, role, activeDeployment, load, estFinish, status, avatar
        });
        const tech = await newTech.save();
        res.json(tech);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
