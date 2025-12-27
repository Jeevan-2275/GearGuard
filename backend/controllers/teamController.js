const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await MaintenanceTeam.find().populate('members', 'name email role');
        res.status(200).json({ success: true, count: teams.length, data: teams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id).populate('members', 'name email role');

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create team
// @route   POST /api/teams
// @access  Private/Admin
exports.createTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.create(req.body);
        res.status(201).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private/Admin
exports.updateTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private/Admin
exports.deleteTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        await team.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private/Admin
exports.addTeamMember = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);
        const { userId } = req.body;

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Check if member already exists
        if (team.members.includes(userId)) {
            return res.status(400).json({ success: false, message: 'User already in team' });
        }

        team.members.push(userId);
        await team.save();

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Private
exports.getTeam = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id).populate('members', 'name email role');

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private/Admin
exports.removeTeamMember = async (req, res) => {
    try {
        const team = await MaintenanceTeam.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        // Check if member exists
        if (!team.members.includes(req.params.userId)) {
            return res.status(400).json({ success: false, message: 'User not in team' });
        }

        team.members = team.members.filter(member => member.toString() !== req.params.userId);
        await team.save();

        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
