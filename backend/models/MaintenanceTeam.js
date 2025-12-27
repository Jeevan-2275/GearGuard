const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema({
    team_name: {
        type: String,
        required: [true, 'Please add a team name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
