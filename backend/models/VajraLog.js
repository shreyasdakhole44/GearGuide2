const mongoose = require('mongoose');

const vajraLogSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    gasLevel: { type: Number, required: true },
    vibration: { type: String, required: true }, // '1' or '0'
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VajraLog', vajraLogSchema);
