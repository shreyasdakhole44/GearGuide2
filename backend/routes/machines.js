const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Machine = require('../models/Machine');

// @route   POST api/machines
// @desc    Add new machine
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name, type, location, installationDate, status } = req.body;

    try {
        const newMachine = new Machine({
            name, type, location, installationDate, status
        });

        const machine = await newMachine.save();
        res.json(machine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/machines
// @desc    Get all machines
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const machines = await Machine.find().sort({ createdAt: -1 });
        res.json(machines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/machines/:id
// @desc    Update machine
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, type, location, installationDate, status } = req.body;

    const machineFields = {};
    if (name) machineFields.name = name;
    if (type) machineFields.type = type;
    if (location) machineFields.location = location;
    if (installationDate) machineFields.installationDate = installationDate;
    if (status) machineFields.status = status;

    try {
        let machine = await Machine.findById(req.params.id);

        if (!machine) return res.status(404).json({ message: 'Machine not found' });

        machine = await Machine.findByIdAndUpdate(
            req.params.id,
            { $set: machineFields },
            { new: true }
        );

        res.json(machine);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/machines/:id
// @desc    Delete machine
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) return res.status(404).json({ message: 'Machine not found' });

        await Machine.findByIdAndDelete(req.params.id);

        res.json({ message: 'Machine removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
