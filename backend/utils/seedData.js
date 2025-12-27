const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');
const Department = require('../models/Department');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

dotenv.config();

// Fixed IDs for reliable Postman testing
const ADMIN_ID = '654321654321654321654321';
const DEPT_ID = '123456123456123456123456';
const TEAM_ID = '789012789012789012789012';
const USER_TECH_ID = '987654987654987654987654';
const USER_MANAGER_ID = '111111222222333333444444';
const EQUIP_ID = 'abcdefabcdefabcdefabcdef';
const REQUEST_ID = 'deadbeefdeadbeefdeadbeef';

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected for Seeding');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Department.deleteMany({});
        await MaintenanceTeam.deleteMany({});
        await Equipment.deleteMany({});
        await MaintenanceRequest.deleteMany({});

        // 1. Create Admin
        await User.create({
            _id: ADMIN_ID,
            name: 'System Admin',
            email: 'admin@gearguard.com',
            password: 'password123',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/300?u=admin'
        });
        console.log('👤 Admin Seeded');

        // 1.5 Create Manager
        await User.create({
            _id: USER_MANAGER_ID,
            name: 'Sarah Manager',
            email: 'manager@gearguard.com',
            password: 'password123',
            role: 'manager',
            avatar: 'https://i.pravatar.cc/300?u=manager'
        });
        console.log('👔 Manager Seeded');

        // 2. Create Technician
        await User.create({
            _id: USER_TECH_ID,
            name: 'John Technician',
            email: 'tech@gearguard.com',
            password: 'password123',
            role: 'technician',
            avatar: 'https://i.pravatar.cc/300?u=tech'
        });
        console.log('🔧 Technician Seeded');

        // 3. Create Department
        await Department.create({
            _id: DEPT_ID,
            name: 'Production Floor',
            description: 'Main assembly line area'
        });
        console.log('🏢 Department Seeded');

        // 4. Create Maintenance Team
        await MaintenanceTeam.create({
            _id: TEAM_ID,
            team_name: 'Alpha Squad',
            description: 'Heavy machinery specialists',
            members: [USER_TECH_ID]
        });
        console.log('🛠️ Team Seeded');

        // 5. Create Equipment
        await Equipment.create({
            _id: EQUIP_ID,
            name: 'CNC Milling Machine',
            serial_number: 'CNC-2024-001',
            category: 'Machinery',
            location: 'Zone A-12',
            status: 'active',
            department: DEPT_ID,
            maintenance_team: TEAM_ID,
            assigned_employee: USER_TECH_ID,
            purchase_date: new Date('2023-01-15'),
            warranty_expiry: new Date('2026-01-15'),
            image_url: 'https://images.unsplash.com/photo-1565514020176-db8b7baab283?auto=format&fit=crop&q=80&w=300'
        });
        console.log('⚙️ Equipment Seeded');

        // 6. Create Maintenance Request
        await MaintenanceRequest.create({
            _id: REQUEST_ID,
            subject: 'Hydraulic Leak',
            description: 'Oil leaking from main piston.',
            type: 'corrective',
            priority: 'high',
            stage: 'new',
            equipment: EQUIP_ID,
            assigned_team: TEAM_ID,
            assigned_technician: USER_TECH_ID,
            created_by: ADMIN_ID
        });
        console.log('🚨 Request Seeded');

        console.log('--------------------------------------------------');
        console.log('🎉 Database Seeded Successfully!');
        console.log('--------------------------------------------------');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
