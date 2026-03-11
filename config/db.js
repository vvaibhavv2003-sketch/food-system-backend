const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS servers to Google's public DNS to fix potential querySrv ECONNREFUSED errors
// This is often needed when local DNS (ISP/Router) doesn't handle SRV records correctly for Node.js
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environments (.env file)');
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
