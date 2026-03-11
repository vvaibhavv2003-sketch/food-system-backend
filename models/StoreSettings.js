const mongoose = require('mongoose');

const storeSettingsSchema = mongoose.Schema({
    storeName: { type: String, default: 'Toasty Bites' },
    heroTitle: { type: String, default: 'Experience The Taste of Italy' },
    heroSubtitle: { type: String, default: 'We provide the best food delivery service with a wide variety of meals to choose from.' },
    heroImages: {
        type: [String], default: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80', // New
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'  // New
        ]
    },
    heroImage: { type: String },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    upiId: { type: String, default: '' },
    printerType: { type: String, default: 'thermal' },
    address: { type: String, default: '' },
    gstNo: { type: String, default: '' },
    fssaiNo: { type: String, default: '' },
    taxPercent: { type: Number, default: 5 }
}, {
    timestamps: true
});

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

module.exports = StoreSettings;
