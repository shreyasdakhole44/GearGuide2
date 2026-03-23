const mongoose = require('mongoose');

const inventoryMachineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    serial: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyEnd: { type: Date },
    health: { type: Number, default: 90 },
    temp: { type: Number, default: 40 },
    vibe: { type: Number, default: 0.1 },
    posX: { type: Number, default: 0 },
    posZ: { type: Number, default: 0 },
    status: { type: String, default: 'operational' }
}, { timestamps: true });

module.exports = mongoose.model('InventoryMachine', inventoryMachineSchema);
