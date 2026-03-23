const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const InventoryMachine = require('../models/InventoryMachine');

// @route   POST api/inventory-machines
// @desc    Add new inventory machine
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, type, serial, purchaseDate, warrantyEnd, posX, posZ } = req.body;

    try {
        const newMachine = new InventoryMachine({
            name, type, serial, purchaseDate, warrantyEnd, posX, posZ
        });

        const machine = await newMachine.save();
        res.json(machine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/inventory-machines
// @desc    Get all inventory machines
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const machines = await InventoryMachine.find().sort({ createdAt: -1 });
        res.json(machines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
