const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const allUsers = await User.find({});
        console.log(`Total users found: ${allUsers.length}`);

        const roles = {};
        allUsers.forEach(u => {
            roles[u.role] = (roles[u.role] || 0) + 1;
        });

        console.log('Role distribution:', roles);

        allUsers.forEach(u => {
            console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, CreatedAt: ${u.createdAt}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
