const mongoose = require('mongoose');

const TechnicianSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: 'CERTIFIED TECH LVL 2' },
    activeDeployment: {
        level: { type: String, enum: ['CRITICAL', 'WARNING', 'ROUTINE'], default: 'ROUTINE' },
        asset: { type: String, required: true }
    },
    load: { type: Number, min: 0, max: 100, default: 0 },
    estFinish: { type: String, default: '15M' },
    status: { type: String, enum: ['ACTIVE', 'DONE'], default: 'ACTIVE' },
    avatar: { type: String, default: '' },
    email: { type: String, default: 'technician@gearguide.co' },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Technician', TechnicianSchema);
