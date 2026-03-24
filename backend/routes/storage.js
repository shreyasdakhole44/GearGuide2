const express = require('express');
const router = express.Router();
const multer = require('multer');
const StorageReport = require('../models/StorageReport');

// Multer memory storage (stores file in memory before saving to Mongo)
const storageInstance = multer.memoryStorage();
const upload = multer({ storage: storageInstance });

// @route   GET api/storage
// @desc    Get all storage reports
router.get('/', async (req, res) => {
    try {
        const reports = await StorageReport.find().sort({ date: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/storage/upload
// @desc    Upload an Excel file to MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const { filename, originalname, size, buffer } = req.file;
        const technician = req.body.technician || 'SYSTEM';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const fileSizeMB = (size / (1024 * 1024)).toFixed(2) + ' MB';

        // Determine type based on extension
        const ext = originalname.split('.').pop().toUpperCase();
        let type = 'FILE';
        if (['XLS', 'XLSX'].includes(ext)) type = 'EXCEL';
        else if (ext === 'CSV') type = 'CSV';
        else if (ext === 'PDF') type = 'PDF';
        else if (ext === 'JPG' || ext === 'JPEG') type = 'JPG';
        else if (ext === 'DOC' || ext === 'DOCX') type = 'DOC';

        const newReport = new StorageReport({
            filename: originalname,
            type: type,
            technician: technician,
            uploadTime: currentTime,
            size: fileSizeMB,
            fileData: buffer
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error('Upload error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/storage
// @desc    Add a storage report (Legacy/Manual)
router.post('/', async (req, res) => {
    const { filename, type, technician, uploadTime, size } = req.body;
    try {
        const newReport = new StorageReport({
            filename, type, technician, uploadTime, size
        });
        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
