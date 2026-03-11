const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const OtpData = require('./models/OtpData');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const clearUsers = async () => {
    try {
        await User.deleteMany({});
        await OtpData.deleteMany({});
        console.log('User and OtpData collections cleared.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

clearUsers();
