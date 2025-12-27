const { User, Department, MaintenanceTeam, Equipment, MaintenanceRequest, TeamMember } = require('./models');
const sequelize = require('./config/database');
require('dotenv').config();

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('🔄 Database reset and synchronized');

        // 1. Create Departments
        const departments = await Department.bulkCreate([
            { name: 'Production', description: 'Main manufacturing floor' },
            { name: 'Assembly', description: 'Final product assembly' },
            { name: 'Logistics', description: 'Warehousing and shipping' },
            { name: 'Facilities', description: 'Building maintenance and utilities' },
            { name: 'Quality Control', description: 'Testing and inspection' }
        ]);
        console.log('✅ Departments created');

        // 2. Create Users
        const password = 'password123';
        const users = await User.bulkCreate([
            { name: 'Admin User', email: 'admin@gearguard.com', password, role: 'admin', department_id: departments[0].id },
            { name: 'Mike Manager', email: 'manager@gearguard.com', password, role: 'manager', department_id: departments[0].id },
            { name: 'Sarah Tech', email: 'tech1@gearguard.com', password, role: 'technician', department_id: departments[3].id },
            { name: 'John Spark', email: 'tech2@gearguard.com', password, role: 'technician', department_id: departments[3].id },
            { name: 'Dave Fixit', email: 'tech3@gearguard.com', password, role: 'technician', department_id: departments[3].id },
            { name: 'Alice Operator', email: 'alice@gearguard.com', password, role: 'employee', department_id: departments[0].id },
            { name: 'Bob Builder', email: 'bob@gearguard.com', password, role: 'employee', department_id: departments[1].id }
        ]);
        console.log('✅ Users created');

        // 3. Create Maintenance Teams
        const teams = await MaintenanceTeam.bulkCreate([
            { team_name: 'Alpha Squad', description: 'Heavy Machinery Specialists' },
            { team_name: 'Beta Spark', description: 'Electrical and Control Systems' },
            { team_name: 'Gamma Facilities', description: 'General Building Maintenance' }
        ]);

        // Assign techs to teams
        await TeamMember.bulkCreate([
            { team_id: teams[0].id, user_id: users[2].id, role: 'leader' }, // Sarah -> Alpha
            { team_id: teams[1].id, user_id: users[3].id, role: 'leader' }, // John -> Beta
            { team_id: teams[2].id, user_id: users[4].id, role: 'member' }  // Dave -> Gamma
        ]);
        console.log('✅ Maintenance Teams created');

        // 4. Create Equipment
        const equipment = await Equipment.bulkCreate([
            { name: 'CNC Miller XN-500', serial_number: 'CNC-2024-001', type: 'Machining', location: 'Zone A', status: 'operational', department_id: departments[0].id, team_id: teams[0].id },
            { name: 'Hydraulic Press 50T', serial_number: 'HP-50-88', type: 'Press', location: 'Zone B', status: 'operational', department_id: departments[0].id, team_id: teams[0].id },
            { name: 'Conveyor Belt System', serial_number: 'CV-100-22', type: 'Logistics', location: 'Loading Dock', status: 'under_maintenance', department_id: departments[2].id, team_id: teams[0].id },
            { name: 'Industrial HVAC Unit', serial_number: 'HVAC-09', type: 'Facilities', location: 'Roof', status: 'operational', department_id: departments[3].id, team_id: teams[2].id },
            { name: 'Forklift Toyota 22', serial_number: 'FL-22-99', type: 'Vehicle', location: 'Warehouse', status: 'operational', department_id: departments[2].id, team_id: teams[0].id },
            { name: 'Robot Arm ABB', serial_number: 'RB-ABB-22', type: 'Assembly', location: 'Line 2', status: 'operational', department_id: departments[1].id, team_id: teams[1].id },
            { name: 'Laser Cutter Pro', serial_number: 'LC-PRO-X', type: 'Machining', location: 'Zone A', status: 'maintenance_required', department_id: departments[0].id, team_id: teams[1].id },
            { name: 'Packaging Unit', serial_number: 'PKG-200', type: 'Assembly', location: 'Line 3', status: 'retired', department_id: departments[1].id, team_id: teams[0].id }
        ]);
        console.log('✅ Equipment created');

        // 5. Create Maintenance Requests
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

        await MaintenanceRequest.bulkCreate([
            // New Requests
            { subject: 'Strange noise from CNC', description: 'Loud grinding noise when operating at high RPM.', type: 'corrective', priority: 'high', stage: 'new', equipment_id: equipment[0].id, team_id: teams[0].id, created_by: users[5].id },
            { subject: 'Forklift leaking oil', description: 'Small puddle found under forklift after shift.', type: 'corrective', priority: 'medium', stage: 'new', equipment_id: equipment[4].id, team_id: teams[0].id, created_by: users[2].id },

            // In Progress
            { subject: 'Conveyor Belt Jam', description: 'Belt is sticking at the main turn. Needs lubrication and alignment.', type: 'corrective', priority: 'critical', stage: 'in_progress', equipment_id: equipment[2].id, team_id: teams[0].id, assigned_to: users[2].id, created_by: users[1].id, scheduled_date: today },
            { subject: 'Preventive HVAC Check', description: 'Quarterly filter change and system diagnostic.', type: 'preventive', priority: 'medium', stage: 'in_progress', equipment_id: equipment[3].id, team_id: teams[2].id, assigned_to: users[4].id, created_by: users[1].id, scheduled_date: today },

            // Pending/Scheduled (Future Calendar Items)
            { subject: 'Laser Cutter Calibration', description: 'Annual rigorous calibration for precision.', type: 'preventive', priority: 'high', stage: 'new', equipment_id: equipment[6].id, team_id: teams[1].id, scheduled_date: tomorrow, created_by: users[0].id },
            { subject: 'Robot Arm Software Update', description: 'Firmware update v2.0 installation.', type: 'preventive', priority: 'low', stage: 'new', equipment_id: equipment[5].id, team_id: teams[1].id, scheduled_date: nextWeek, created_by: users[0].id },

            // Completed
            { subject: 'Press Sensor Replacement', description: 'Replaced faulty pressure sensor on hydraulic press.', type: 'corrective', priority: 'medium', stage: 'repaired', equipment_id: equipment[1].id, team_id: teams[1].id, assigned_to: users[3].id, created_by: users[5].id, duration: 2.5, scheduled_date: yesterday },

            // Scrap
            { subject: 'Old Packaging Unit Decommission', description: 'Unit is beyond economical repair. Scrapping for parts.', type: 'corrective', priority: 'low', stage: 'scrap', equipment_id: equipment[7].id, team_id: teams[0].id, created_by: users[1].id, scrap_reason: 'Too expensive to fix motor.' }
        ]);

        console.log('✅ Maintenance Requests created');
        console.log('🚀 Full Demo Database Seeding Completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
