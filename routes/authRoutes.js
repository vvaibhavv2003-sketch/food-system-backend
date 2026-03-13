const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpData = require('../models/OtpData');
const nodemailer = require('nodemailer');

// // Helper to generate 4 digit OTP
// const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const transporter = require('../utils/mailer');

// Verify email connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error(`[EMAIL-CONFIG-ERROR] Connection failed: ${error.message}`);
    } else {
        console.log('[EMAIL-CONFIG-SUCCESS] Server is ready to take our messages');
    }
});

/*
// Helper to send Email OTP
const sendEmailOTP = async (email, otp) => {
    try {
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
            console.log('-----------------------------------------');
            console.log(`[EMAIL-SIMULATION]`);
            console.log(`Target Email: ${email}`);
            console.log(`Generated OTP: ${otp}`);
            console.log(`Action Required: Add EMAIL_USER and EMAIL_PASS to .env for real delivery.`);
            console.log('-----------------------------------------');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Gourmet - Your Verification Code',
            text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`,
            html: `<h1>Gourmet Verification</h1><p>Your OTP for registration is: <b>${otp}</b></p><p>It will expire in 10 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL-SUCCESS] OTP sent to ${email}`);
    } catch (error) {
        console.error(`[EMAIL-CRITICAL-FAIL] Error sending email: ${error.message}`);
    }
};
*/

// @desc    Register Intent & Send OTP
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    let { email, mobile } = req.body;
    if (email) email = email.trim().toLowerCase();

    // DEBUG: Log registration attempt
    console.log(`[AUTH-DEBUG] Registering Email: '${email}', Mobile: '${mobile}'`);

    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

        if (userExists) {
            console.log(`[AUTH-DEBUG] User exists found: ID=${userExists._id}, Email=${userExists.email}, Mobile=${userExists.mobile}`);
            return res.status(400).json({ message: 'User already exists (Email or Mobile)' });
        }

        /* 
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Store OTP temporarily
        await OtpData.findOneAndUpdate(
            { mobile },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        // Send Email OTP
        await sendEmailOTP(email, otp);

        console.log(`[AUTH-DEBUG] Register request completed. OTP created for ${mobile}. NO USER CREATED YET.`);
        */

        res.status(200).json({
            message: 'OTP disabled for now',
            // otp: otp // Keep for your testing
        });
    } catch (error) {
        console.error(`[AUTH-DEBUG] Error in register: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify OTP & Create User
// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { mobile, otp, userData } = req.body;

    try {
        /*
        const otpRecord = await OtpData.findOne({ mobile });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not requested or expired' });
        }

        if (otpRecord.otp === otp && otpRecord.expiresAt > Date.now()) {
        */
            // OTP is valid (Flow bypassed), now create the user
            const { name, email, password, role } = userData;

            // Double check if user was created in the meantime
            const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
            if (userExists) {
                return res.status(400).json({ message: 'User already registered' });
            }

            const user = await User.create({
                name,
                email,
                mobile,
                password, // Model will hash this
                role: role || 'user',
                isVerified: true
            });

            // Clean up OTP record
            await OtpData.deleteOne({ mobile });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: 'mock-jwt-token-123',
                message: 'Account verified and created successfully'
            });
        /*
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    let { identifier, password } = req.body; // Identifier = email OR mobile
    if (identifier) identifier = identifier.trim().toLowerCase();

    try {
        // Find by email or mobile
        const user = await User.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                token: 'mock-jwt-token-123'
            });
        } else {
            res.status(401).json({ message: 'Invalid email/mobile or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email or Mobile is required' });

    const searchVal = email.trim();

    try {
        // Search by email (case-insensitive) OR search by mobile
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${searchVal}$`, 'i') } },
                { mobile: searchVal }
            ]
        });

        if (!user) {
            console.log(`[AUTH-DEBUG] User lookup failed for: '${searchVal}'`);

            // DEBUG: Dump all users to console to see what IS in the DB
            const allUsers = await User.find({}, 'email mobile name');
            console.log('--- ALL REGISTERED USERS ---');
            allUsers.forEach(u => console.log(`ID: ${u._id}, Name: ${u.name}, Email: '${u.email}', Mobile: '${u.mobile}'`));
            console.log('----------------------------');

            return res.status(404).json({ message: `No account found with ${searchVal}` });
        }

        /*
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log(`[AUTH-DEBUG] Found user: ${user.email}. Sending OTP...`);
        await sendEmailOTP(user.email, otp);
        */

        res.json({ message: `Success! OTP feature is temporarily disabled.` });
    } catch (error) {
        console.error(`[AUTH-DEBUG] Forgot Password Error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    let { email, otp, newPassword } = req.body;
    if (!email) return res.status(400).json({ message: 'Identifier (Email/Mobile) is required' });

    const searchVal = email.trim();

    try {
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${searchVal}$`, 'i') } },
                { mobile: searchVal }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        /*
        if (user.otp === otp && user.otpExpires > Date.now()) {
        */
            user.password = newPassword; // Model will hash this
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({ message: 'Password reset successfully. Please login.' });
        /*
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        */
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', async (req, res) => {
    const { userId, name, mobile } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (mobile !== undefined) {
            if (!mobile) {
                return res.status(400).json({ message: 'Mobile number cannot be empty' });
            }
            // Check if mobile is already taken by another user
            const mobileExists = await User.findOne({ mobile, _id: { $ne: userId } });
            if (mobileExists) {
                return res.status(400).json({ message: 'Mobile number already in use' });
            }
            user.mobile = mobile;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            role: updatedUser.role,
            token: 'mock-jwt-token-123' // Keep token for simplicity
        });
    } catch (error) {
        console.error(`[PROFILE-UPDATE-ERROR] ${error.message}`);
        res.status(500).json({ message: error.message || 'Server error occurred' });
    }
});

module.exports = router;
