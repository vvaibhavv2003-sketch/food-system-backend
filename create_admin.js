const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-delivery');
        console.log('Connected to MongoDB');

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminMobile = process.env.ADMIN_MOBILE;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if admin exits
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            // Optional: Update password if needed
            // existingAdmin.password = await bcrypt.hash(adminPassword, 10);
            // await existingAdmin.save();
            // console.log('Admin password updated.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const adminUser = new User({
            name: 'Super Admin',
            email: adminEmail,
            mobile: adminMobile,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        await adminUser.save();
        console.log(`Admin user created successfully!`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Mobile: ${adminMobile}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
