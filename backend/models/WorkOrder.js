const mongoose = require('mongoose');

const WorkOrderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    priority: { type: String, enum: ['P0', 'P1', 'P2'], default: 'P1' },
    technician: { type: String, default: 'SARAH' },
    technicianEmail: { type: String, default: 'technician@gearguide.co' },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'PENDING', 'COMPLETED'], default: 'ACTIVE' },
    sector: { type: String, default: 'G-4' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
