const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const migratePasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food-delivery');
        console.log('Connected to MongoDB');

        const users = await User.find({});
        let count = 0;

        for (const user of users) {
            // Check if password works as a bcrypt hash (starts with $2a$ or $2b$ and length is 60)
            const isHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');

            if (!isHash || user.password.length < 50) {
                console.log(`Hashing password for user: ${user.email}`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                user.password = hashedPassword;
                await user.save();
                count++;
            }
        }

        console.log(`Migration complete. Updated ${count} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migratePasswords();
