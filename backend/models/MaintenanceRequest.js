const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['corrective', 'preventive'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    stage: {
        type: String,
        enum: ['new', 'in-progress', 'repaired', 'scrap'],
        default: 'new'
    },
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    assigned_team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceTeam',
        required: true
    },
    assigned_technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduled_date: {
        type: Date
    },
    completion_date: {
        type: Date
    },
    hours_spent: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
