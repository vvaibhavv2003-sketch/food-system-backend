const mongoose = require('mongoose');
const Order = require('./models/Order');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const checkOrders = async () => {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(3);
    console.log(JSON.stringify(orders, null, 2));
    process.exit();
};

checkOrders();
