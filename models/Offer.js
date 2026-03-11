const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: 'Limited Offer' },
    description: { type: String },
    discount: { type: Number, default: 0 },
    price: { type: Number },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number }, // Added originalPrice support
        description: { type: String },
        image: { type: String },
        isVeg: { type: Boolean, default: true }
    }],
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
