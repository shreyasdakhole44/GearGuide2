const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const InventoryMachine = require('./models/InventoryMachine');
const Machine = require('./models/Machine');
const MaintenanceLog = require('./models/MaintenanceLog');
const VajraLog = require('./models/VajraLog');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gearguide');
        console.log('Seed: MongoDB Connected...');

        // Clear existing data
        await User.deleteMany({});
        await InventoryMachine.deleteMany({});
        await Machine.deleteMany({});
        await MaintenanceLog.deleteMany({});
        await VajraLog.deleteMany({});

        console.log('Seed: Cleared existing database records.');

        // 1. DUMMY USERS
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@gearguide.co',
                password: hashedPassword,
                role: 'admin',
                company: 'Industrial GigaPlant',
                companyLocation: 'Detroit, USA',
                website: 'https://gigaplant.io'
            },
            {
                name: 'Shreyas Dakhole',
                email: 'technician@gearguide.co',
                password: hashedPassword,
                role: 'technician',
                company: 'GearGuide Systems',
                companyLocation: 'Pune, India',
                website: 'https://gearguide.ai'
            }
        ];
        await User.insertMany(users);
        console.log('Seed: Inserted Users.');

        // 2. DUMMY INVENTORY MACHINES (3D Floor)
        const invMachines = [
            { name: 'CNC-MASTER-01', type: 'CNC Lathe', serial: 'SN-9922-A', purchaseDate: new Date('2024-01-01'), health: 92, temp: 42, vibe: 0.2, posX: -5, posZ: -2 },
            { name: 'ROBO-ARM-X2', type: 'Robotic Arm', serial: 'SN-4410-B', purchaseDate: new Date('2024-03-15'), health: 38, temp: 78, vibe: 1.4, posX: 0, posZ: 2 },
            { name: 'PRESS-UNIT-04', type: 'Hydraulic Press', serial: 'SN-1120-C', purchaseDate: new Date('2023-11-20'), health: 65, temp: 55, vibe: 0.8, posX: 5, posZ: -3 },
            { name: 'MILL-PRO-07', type: 'Milling center', serial: 'SN-8833-D', purchaseDate: new Date('2024-02-10'), health: 88, temp: 45, vibe: 0.3, posX: -3, posZ: 5 }
        ];
        await InventoryMachine.insertMany(invMachines);
        console.log('Seed: Inserted Inventory Machines.');

        // 3. DUMMY GLOBAL MACHINES (Dashboard)
        const globalMachinesData = [
            { name: 'Drill-X Main', type: 'Drill', location: 'Section A', installationDate: new Date('2023-01-01'), status: 'operational' },
            { name: 'Press-Y Core', type: 'Press', location: 'Section B', installationDate: new Date('2023-05-01'), status: 'operational' },
            { name: 'Lathe-Z Aux', type: 'Lathe', location: 'Section C', installationDate: new Date('2023-09-01'), status: 'maintenance' }
        ];
        const insertedGlobalMachines = await Machine.insertMany(globalMachinesData);
        console.log('Seed: Inserted Global Machines.');

        // 4. MAINTENANCE LOGS
        const logs = [
            { 
                machineId: insertedGlobalMachines[0]._id, 
                technician: 'Shreyas Dakhole', 
                issue: 'Shield drift detected', 
                actionTaken: 'Shield recalibration and axis alignment.', 
                date: new Date('2025-10-12') 
            },
            { 
                machineId: insertedGlobalMachines[1]._id, 
                technician: 'Technician 09', 
                issue: 'Dry joint friction', 
                actionTaken: 'Joint lubrication and grease packing.', 
                date: new Date('2025-08-04') 
            }
        ];
        await MaintenanceLog.insertMany(logs);
        console.log('Seed: Inserted Maintenance Logs.');

        // 5. VAJRA LOGS
        const vajraLogs = [
            { temperature: 45.2, humidity: 28, gasLevel: 12, vibration: '0', timestamp: new Date() },
            { temperature: 48.7, humidity: 32, gasLevel: 15, vibration: '1', timestamp: new Date() }
        ];
        await VajraLog.insertMany(vajraLogs);
        console.log('Seed: Inserted Vajra Logs.');

        console.log('Seed: Database synchronization complete!');
        process.exit();
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedDB();
