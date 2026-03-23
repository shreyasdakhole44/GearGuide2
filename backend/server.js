const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Connect Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gearguide');
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/machines', require('./routes/machines'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/machine-health', require('./routes/machineHealth'));
app.use('/api/vajranet', require('./routes/vajra'));
app.use('/api/inventory-machines', require('./routes/inventoryMachines'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
