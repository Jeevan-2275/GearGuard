const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add equipment name'],
        trim: true
    },
    serial_number: {
        type: String,
        required: [true, 'Please add serial number'],
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please add category']
    },
    image_url: {
        type: String
    },
    purchase_date: {
        type: Date,
        required: [true, 'Please add purchase date']
    },
    warranty_expiry: {
        type: Date,
        required: [true, 'Please add warranty expiry date']
    },
    location: {
        type: String,
        required: [true, 'Please add location']
    },
    status: {
        type: String,
        enum: ['active', 'scrapped', 'maintenance'],
        default: 'active'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    assigned_employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    maintenance_team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceTeam',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);
