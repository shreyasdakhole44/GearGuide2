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

// @route   GET api/inventory-machines/stats
// @desc    Get inventory machine statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const total = await InventoryMachine.countDocuments();
        const healthy = await InventoryMachine.countDocuments({ health: { $gt: 70 } });
        const warning = await InventoryMachine.countDocuments({ health: { $lte: 70, $gt: 40 } });
        const critical = await InventoryMachine.countDocuments({ health: { $lte: 40 } });

        res.json({ total, healthy, warning, critical });
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

// @route   PATCH api/inventory-machines/:id
// @desc    Update an inventory machine
// @access  Private
router.patch('/:id', auth, async (req, res) => {
    try {
        let machine = await InventoryMachine.findById(req.params.id);
        if (!machine) return res.status(404).json({ msg: 'Machine not found' });

        machine = await InventoryMachine.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(machine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/inventory-machines/:id
// @desc    Delete an inventory machine
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const machine = await InventoryMachine.findById(req.params.id);
        if (!machine) return res.status(404).json({ msg: 'Machine not found' });

        await InventoryMachine.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Machine removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
