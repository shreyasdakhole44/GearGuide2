const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    installationDate: { type: Date, required: true },
    status: { type: String, enum: ['operational', 'maintenance', 'offline'], default: 'operational' },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
