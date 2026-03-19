const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    issue: { type: String, required: true },
    actionTaken: { type: String, required: true },
    technician: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
