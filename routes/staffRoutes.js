const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Add New Staff Member
// @route   POST /api/staff
router.post('/', async (req, res) => {
    console.log('[STAFF-API] Received add staff request:', req.body);
    const { firstName, lastName, email, mobile, password, gender, role, address } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

        if (userExists) {
            console.log('[STAFF-API] Create failed: User already exists');
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        // Create the staff member as a User
        const user = await User.create({
            name: `${firstName || ''} ${lastName || ''}`.trim(),
            firstName,
            lastName,
            email,
            mobile,
            password, // Model will hash this
            role: role || 'staff',
            gender,
            address,
            isVerified: true // Automatically verify staff accounts
        });

        console.log('[STAFF-API] Success: Staff member created with ID:', user._id);
        res.status(201).json({
            message: 'Staff member added successfully',
            staff: user
        });
    } catch (error) {
        console.error(`[STAFF-API-ERROR] ${error.message}`);
        res.status(400).json({ message: error.message || 'Invalid staff data' });
    }
});

// @desc    Get All Staff Members
// @route   GET /api/staff
router.get('/', async (req, res) => {
    try {
        console.log('[STAFF-API] Fetching staff list...');
        // Find users who are NOT regular 'user' role
        // This query will catch 'Admin', 'admin', 'staff', 'delivery', etc.
        const staff = await User.find({ 
            role: { $nin: ['user', 'User'] } 
        }).select('-password');
        
        console.log(`[STAFF-API] Found ${staff.length} staff members`);
        res.json(staff);
    } catch (error) {
        console.error(`[STAFF-API-GET-ERROR] ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
