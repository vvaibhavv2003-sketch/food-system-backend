const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');
const Category = require('./models/Category');
const User = require('./models/User'); // Added User model
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const checkCounts = async () => {
    try {
        const foodCount = await FoodItem.countDocuments();
        const categoryCount = await Category.countDocuments();
        const userCount = await User.countDocuments(); // Count users
        console.log(`Food Items: ${foodCount}`);
        console.log(`Categories: ${categoryCount}`);
        console.log(`Users: ${userCount}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

checkCounts();
