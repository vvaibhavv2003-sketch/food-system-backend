const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const fixNames = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders.`);

        for (const order of orders) {
            // Check if user is a valid ObjectId (length 24 hex)
            if (order.user && typeof order.user === 'string' && order.user.match(/^[0-9a-fA-F]{24}$/)) {

                const user = await User.findById(order.user);
                if (user) {
                    // Update deliveryAddress.name
                    if (!order.deliveryAddress) {
                        order.deliveryAddress = {};
                    }

                    // Only update if it's missing or Guest
                    // Actually, force update to be sure
                    order.deliveryAddress.name = user.name;

                    // Important for nested objects in Mixed types or strictly defined schemas
                    order.markModified('deliveryAddress');

                    await order.save();
                    console.log(`Order ${order._id}: Updated Name to '${user.name}'`);
                } else {
                    console.log(`Order ${order._id}: User ID ${order.user} not found.`);
                }
            } else {
                // Formatting for log
                // console.log(`Order ${order._id}: User field is '${order.user}' (Guest/System)`);
            }
        }

        console.log('All orders processed.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixNames();
