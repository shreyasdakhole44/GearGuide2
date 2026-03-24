const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryMachine', required: true },
    assetName: { type: String, required: true }, // For fallback or display if population fails
    issue: { type: String, required: true },
    protocolLevel: { type: String, enum: ['ROUTINE', 'MEDIUM', 'CRITICAL', 'WARNING'], default: 'ROUTINE' },
    technician: { type: String, required: true },
    technicianEmail: { type: String, default: 'technician@gearguide.co' },
    technicianInitials: { type: String },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'SCHEDULED'], default: 'COMPLETED' },
    duration: { type: String, default: '45m' },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);

