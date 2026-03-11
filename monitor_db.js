const mongoose = require('mongoose');
const User = require('./models/User');
const OtpData = require('./models/OtpData');
const dotenv = require('dotenv');

dotenv.config();

const monitorDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/toasty_bites');
        console.log('--- Real-time DB Monitor Started ---');
        console.log('Watching for User creation...');

        let lastUserCount = -1;
        let lastOtpCount = -1;

        setInterval(async () => {
            const userCount = await User.countDocuments();
            const otpCount = await OtpData.countDocuments();

            if (userCount !== lastUserCount || otpCount !== lastOtpCount) {
                console.log(`[${new Date().toLocaleTimeString()}] Users: ${userCount} | OTPs Pending: ${otpCount}`);
                lastUserCount = userCount;
                lastOtpCount = otpCount;
            }
        }, 1000);
    } catch (error) {
        console.error('Monitor failed:', error.message);
    }
};

monitorDB();
