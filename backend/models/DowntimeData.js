const mongoose = require('mongoose');

const DowntimeDataSchema = new mongoose.Schema({
    day: { type: String, required: true }, // e.g., 'M', 'T', 'W'
    value: { type: Number, required: true }, // e.g., 3.8
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DowntimeData', DowntimeDataSchema);
