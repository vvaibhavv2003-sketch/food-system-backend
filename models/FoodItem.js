const mongoose = require('mongoose');

const foodItemSchema = mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping 'id' for compatibility with existing frontend logic
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    isVeg: { type: Boolean, required: true, default: true },
    rating: { type: Number, required: true, default: 4.5 },
    deliveryTime: { type: String, default: '30-40 min' },
    votes: { type: Number, default: 0 }
}, {
    timestamps: true
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
