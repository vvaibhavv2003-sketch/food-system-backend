const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    items: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true, default: 'Pending' }, // Pending, Confirmed, Delivered
    user: { type: String, default: 'Guest' }, // Eventually link to User ID
    deliveryAddress: {
        name: { type: String },
        street: { type: String },
        city: { type: String },
        zip: { type: String },
        phone: { type: String },
        lat: { type: Number },
        lng: { type: Number }
    },
    paymentMethod: { type: String, default: 'COD' }, // 'COD', 'Card', 'UPI'
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
