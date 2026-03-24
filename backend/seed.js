const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const InventoryMachine = require('./models/InventoryMachine');
const Machine = require('./models/Machine');
const MaintenanceLog = require('./models/MaintenanceLog');
const VajraLog = require('./models/VajraLog');
const Technician = require('./models/Technician');
const StorageReport = require('./models/StorageReport');

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
        await Technician.deleteMany({});
        await StorageReport.deleteMany({});

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
        const machines = await InventoryMachine.find();
        const logs = [
            { 
                machineId: machines[0]._id,
                assetName: 'HVAC-03',
                technician: 'J. DOE', 
                technicianEmail: 'sdakhole18@gmail.com',
                technicianInitials: 'JD',
                issue: 'Sensor drift corrected via manual bypass', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '45m',
                date: new Date(new Date().setDate(new Date().getDate() - 1))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'CNC-04',
                technician: 'M. CHEN', 
                technicianEmail: 'sdakhole18@gmail.com',
                technicianInitials: 'MC',
                issue: 'Spindle recalibration based on vibration spike', 
                protocolLevel: 'CRITICAL',
                status: 'COMPLETED',
                duration: '1h 20m',
                date: new Date(new Date().setDate(new Date().getDate() - 2))
            },
            { 
                machineId: machines[2]._id,
                assetName: 'ROBOT-01',
                technician: 'A. KUMAR', 
                technicianInitials: 'AK',
                issue: 'Hydraulic flush & seal replacement', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '2h 15m',
                date: new Date(new Date().setDate(new Date().getDate() - 3))
            },
            { 
                machineId: machines[3]._id,
                assetName: 'LATHE-02',
                technician: 'SARAH J.', 
                technicianInitials: 'S',
                issue: 'Emergency stop failure troubleshooting', 
                protocolLevel: 'CRITICAL',
                status: 'PENDING',
                duration: 'N/A',
                date: new Date(new Date().setDate(new Date().getDate() - 4))
            },
            { 
                machineId: machines[0]._id,
                assetName: 'PUMP-01',
                technician: 'MIKE R.', 
                technicianInitials: 'M',
                issue: 'Pressure valve lubrication', 
                protocolLevel: 'ROUTINE',
                status: 'SCHEDULED',
                duration: '30m',
                date: new Date(new Date().setDate(new Date().getDate() - 5))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'MILL-01',
                technician: 'J. DOE', 
                technicianInitials: 'JD',
                issue: 'Belt replacement & motor alignment', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '1h 10m',
                date: new Date(new Date().setDate(new Date().getDate() - 6))
            },
            { 
                machineId: machines[2]._id,
                assetName: 'ST-900 CORE',
                technician: 'SYSTEM AI', 
                technicianInitials: 'AI',
                issue: 'Neural link recalibration', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '5m',
                date: new Date(new Date().setDate(new Date().getDate() - 7))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'PACK-04',
                technician: 'M. CHEN', 
                technicianInitials: 'MC',
                issue: 'Conveyor sensor cleaning', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '15m',
                date: new Date(new Date().setDate(new Date().getDate() - 8))
            },
            { 
                machineId: machines[0]._id,
                assetName: 'HVAC-08',
                technician: 'A. KUMAR', 
                technicianInitials: 'AK',
                issue: 'Filter extraction and replacement', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '50m',
                date: new Date(new Date().setDate(new Date().getDate() - 9))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'PRESS-U7',
                technician: 'SARAH J.', 
                technicianInitials: 'S',
                issue: 'Hydraulic pressure test and seal check', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '1h 45m',
                date: new Date(new Date().setDate(new Date().getDate() - 10))
            },
            { 
                machineId: machines[0]._id,
                assetName: 'HVAC-03',
                technician: 'J. DOE', 
                technicianInitials: 'JD',
                issue: 'Manual sensor recalibration', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '25m',
                date: new Date(new Date().setDate(new Date().getDate() - 11))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'CNC-04',
                technician: 'SARAH J.', 
                technicianInitials: 'S',
                issue: 'High vibration alert - Spindle check', 
                protocolLevel: 'CRITICAL',
                status: 'COMPLETED',
                duration: '1h 50m',
                date: new Date(new Date().setDate(new Date().getDate() - 12))
            },
            { 
                machineId: machines[2]._id,
                assetName: 'ROBOT-01',
                technician: 'MIKE R.', 
                technicianInitials: 'M',
                issue: 'Hydraulic fluid top-up', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '15m',
                date: new Date(new Date().setDate(new Date().getDate() - 13))
            },
            { 
                machineId: machines[3]._id,
                assetName: 'MILL-PRO-07',
                technician: 'A. KUMAR', 
                technicianInitials: 'AK',
                issue: 'Belt tensioning procedure', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '40m',
                date: new Date(new Date().setDate(new Date().getDate() - 14))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'PRESS-UNIT-04',
                technician: 'SARAH J.', 
                technicianInitials: 'S',
                issue: 'Emergency stop circuit test', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '10m',
                date: new Date(new Date().setDate(new Date().getDate() - 15))
            },
            { 
                machineId: machines[2]._id,
                assetName: 'CNC-MASTER-01',
                technician: 'M. CHEN', 
                technicianInitials: 'MC',
                issue: 'Servo motor recalibration', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '2h 10m',
                date: new Date(new Date().setDate(new Date().getDate() - 16))
            },
            { 
                machineId: machines[0]._id,
                assetName: 'HVAC-01',
                technician: 'J. DOE', 
                technicianInitials: 'JD',
                issue: 'Filter extraction and disposal', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '35m',
                date: new Date(new Date().setDate(new Date().getDate() - 17))
            },
            { 
                machineId: machines[1]._id,
                assetName: 'CNC-04',
                technician: 'A. KUMAR', 
                technicianInitials: 'AK',
                issue: 'Cooling system pump maintenance', 
                protocolLevel: 'WARNING',
                status: 'COMPLETED',
                duration: '1h 15m',
                date: new Date(new Date().setDate(new Date().getDate() - 18))
            },
            { 
                machineId: machines[2]._id,
                assetName: 'ROBOT-01',
                technician: 'MIKE R.', 
                technicianInitials: 'M',
                issue: 'Joint actuator lubrication', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '20m',
                date: new Date(new Date().setDate(new Date().getDate() - 19))
            },
            { 
                machineId: machines[3]._id,
                assetName: 'PUMP-01',
                technician: 'SARAH J.', 
                technicianInitials: 'S',
                issue: 'Pressure valve verification', 
                protocolLevel: 'ROUTINE',
                status: 'COMPLETED',
                duration: '15m',
                date: new Date(new Date().setDate(new Date().getDate() - 20))
            }
        ];
        await MaintenanceLog.insertMany(logs);
        console.log('Seed: Inserted Maintenance Logs.');


        // 5. TECHNICIANS
        const techniciansListData = [
            { 
                name: 'Sarah Chen', 
                role: 'CERTIFIED TECH LVL 2', 
                email: 'technician@gearguide.co',
                activeDeployment: { level: 'CRITICAL', asset: 'CNC-04' },
                load: 35,
                estFinish: '15M',
                status: 'ACTIVE',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
            },
            { 
                name: 'Mike Ross', 
                role: 'CERTIFIED TECH LVL 1', 
                activeDeployment: { level: 'WARNING', asset: 'HVAC-03' },
                load: 60,
                estFinish: '45M',
                status: 'ACTIVE',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
            },
            { 
                name: 'Alex Kumar', 
                role: 'SENIOR MECHANIC', 
                activeDeployment: { level: 'ROUTINE', asset: 'ROBOT-01' },
                load: 100,
                estFinish: 'DONE',
                status: 'DONE',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
            }
        ];
        await Technician.insertMany(techniciansListData);
        console.log('Seed: Inserted Technicians.');

        // 6. STORAGE REPORTS
        const reports = [
            { filename: 'CNC-04_REPORT.PDF', type: 'PDF', technician: 'SARAH', uploadTime: '10:45', size: '2.4MB' },
            { filename: 'HVAC-03_SENSOR.JPG', type: 'JPG', technician: 'MIKE', uploadTime: '09:30', size: '1.8MB' },
            { filename: 'WO-234_NOTES.PDF', type: 'PDF', technician: 'ALEX', uploadTime: '08:15', size: '4.2MB' }
        ];
        await StorageReport.insertMany(reports);
        console.log('Seed: Inserted Storage Reports.');

        // 7. ACTIVE WORK ORDERS
        const WorkOrder = require('./models/WorkOrder');
        await WorkOrder.deleteMany({});
        const workOrders = [
            { id: 'WO-001', title: 'CNC-04 OVERHEAT', priority: 'P0', technician: 'SARAH', technicianEmail: 'sdakhole18@gmail.com', progress: 30, status: 'ACTIVE', sector: 'G-4' },
            { id: 'WO-002', title: 'HVAC-03 CALIBRATION', priority: 'P1', technician: 'MIKE', technicianEmail: 'sdakhole18@gmail.com', progress: 60, status: 'ACTIVE', sector: 'G-4' },
            { id: 'WO-003', title: 'ROBOT-01 ROUTINE', priority: 'P2', technician: 'ALEX', technicianEmail: 'sdakhole18@gmail.com', progress: 100, status: 'ACTIVE', sector: 'G-4' }
        ];
        await WorkOrder.insertMany(workOrders);
        console.log('Seed: Inserted Work Orders.');

        // 8. DOWNTIME ANALYSIS DATA
        const DowntimeData = require('./models/DowntimeData');
        await DowntimeData.deleteMany({});
        const downtimePoints = [
            { day: 'M', value: 1.2 },
            { day: 'T', value: 1.8 },
            { day: 'W', value: 3.8 },
            { day: 'T', value: 2.5 },
            { day: 'F', value: 1.5 },
            { day: 'S', value: 0.8 },
            { day: 'S', value: 0.5 }
        ];
        await DowntimeData.insertMany(downtimePoints);
        console.log('Seed: Inserted Downtime Data.');

        // 9. VAJRA LOGS
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
