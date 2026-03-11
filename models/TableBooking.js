const mongoose = require('mongoose');

const tableBookingSchema = mongoose.Schema({
    tableNumber: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: String, required: true },
    amount: { type: Number, default: 100 },
    isPaid: { type: Boolean, default: false },
    status: { type: String, enum: ['Available', 'Running', 'Booked'], default: 'Booked' }
}, {
    timestamps: true
});

const TableBooking = mongoose.model('TableBooking', tableBookingSchema);

module.exports = TableBooking;
