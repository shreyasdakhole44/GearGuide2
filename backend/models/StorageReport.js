const mongoose = require('mongoose');

const StorageReportSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'JPG', 'DOC', 'CSV', 'EXCEL', 'FILE', 'DOCUMENT'], default: 'PDF' },
    technician: { type: String, required: true },
    uploadTime: { type: String, required: true },
    size: { type: String, default: '2.4MB' },
    fileData: { type: Buffer },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StorageReport', StorageReportSchema);
