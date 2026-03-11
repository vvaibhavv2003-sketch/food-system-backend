const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const deleteUsers = async () => {
    try {
        // Deleting the user likely causing the "Already exists" error (from screenshot)
        await User.deleteOne({ email: 'vvaibhavv2003@gmail.com' });

        // Also deleting the test user I created earlier
        await User.deleteOne({ email: 'test_script@example.com' });

        console.log('Users deleted successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

deleteUsers();
