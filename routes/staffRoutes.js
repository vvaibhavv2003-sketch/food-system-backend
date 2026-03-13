const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Add New Staff Member
// @route   POST /api/staff
router.post('/', async (req, res) => {
    const { firstName, lastName, email, mobile, password, gender, role, address } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email or mobile' });
        }

        // Create the staff member as a User
        const user = await User.create({
            name: `${firstName} ${lastName}`,
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

        if (user) {
            res.status(201).json({
                message: 'Staff member added successfully',
                staff: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                    gender: user.gender,
                    address: user.address
                }
            });
        }
    } catch (error) {
        console.error(`[STAFF-ADD-ERROR] ${error.message}`);
        res.status(400).json({ message: error.message || 'Invalid staff data' });
    }
});

// @desc    Get All Staff Members
// @route   GET /api/staff
router.get('/', async (req, res) => {
    try {
        // Find users who are NOT regular 'user' role (or you can specify specific roles if needed)
        // For simplicity, let's assume anything other than 'user' can be seen here, 
        // or we filter by multiple roles.
        const staff = await User.find({ role: { $ne: 'user' } }).select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
