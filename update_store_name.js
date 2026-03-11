const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StoreSettings = require('./models/StoreSettings');
const connectDB = require('./config/db');

dotenv.config();

const updateStoreName = async () => {
    try {
        await connectDB();

        const settings = await StoreSettings.findOne();
        if (settings) {
            settings.storeName = "Toasty Bites";
            await settings.save();
            console.log('Store name updated to Toasty Bites');
        } else {
            console.log('No store settings found to update.');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

updateStoreName();
