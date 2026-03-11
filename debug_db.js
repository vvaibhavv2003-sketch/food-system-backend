const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const OtpData = require('./models/OtpData');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const debugData = async () => {
    try {
        const users = await User.find({}, 'name email mobile role isVerified');
        const otps = await OtpData.find({});

        console.log('--- USER COLLECTION ---');
        console.log(users);
        console.log('\n--- OTPDATA COLLECTION ---');
        console.log(otps);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

debugData();
