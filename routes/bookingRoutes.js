const express = require('express');
const router = express.Router();
const TableBooking = require('../models/TableBooking');
const transporter = require('../utils/mailer');

// @desc    Book a table
// @route   POST /api/bookings
router.post('/', async (req, res) => {
    const { name, email, mobile, date, time, guests, tableNumber } = req.body;

    try {
        const booking = await TableBooking.create({
            tableNumber,
            name,
            email,
            mobile,
            date,
            time,
            guests
        });

        // Send Confirmation Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Table Booked Successfully - Gourmet',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #ff5200;">Reservation Confirmed!</h2>
                    <p>Hello <b>${name}</b>,</p>
                    <p>Your table has been successfully booked at Gourmet.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><b>Date:</b> ${date}</p>
                        <p><b>Time:</b> ${time}</p>
                        <p><b>Guests:</b> ${guests}</p>
                        <p><b>Booking Charge:</b> ₹100 (Paid at Counter/Simulation)</p>
                    </div>
                    <p>We look forward to serving you!</p>
                    <p>Best regards,<br>The Gourmet Team</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
            await transporter.sendMail(mailOptions);
            console.log(`[BOOKING-EMAIL] Confirmation sent to ${email}`);
        } else {
            console.log(`[BOOKING-SIMULATION] Table booked for ${name}. Email skipped (no credentials).`);
        }

        res.status(201).json({
            success: true,
            message: 'Table booked successfully! Confirmation email sent.',
            booking
        });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: 'Server error: Failed to book table' });
    }
});

// @desc    Get table statuses
// @route   GET /api/bookings/status
router.get('/status', async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const bookings = await TableBooking.find({ date: date });

        // We have 12 tables
        const tables = Array.from({ length: 12 }, (_, i) => {
            const tableNum = i + 1;
            const booking = bookings.find(b => b.tableNumber === tableNum);

            return {
                number: tableNum,
                status: booking ? (booking.status || 'Booked') : 'Available'
            };
        });

        res.json(tables);
    } catch (error) {
        console.error('Fetch Status Error:', error);
        res.status(500).json({ message: 'Server error: Failed to fetch statuses' });
    }
});

// @desc    Update table status
// @route   PUT /api/bookings/status/:tableNumber
router.put('/status/:tableNumber', async (req, res) => {
    const { tableNumber } = req.params;
    const { status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        // Find if there's an existing booking for today
        let booking = await TableBooking.findOne({ tableNumber, date: today }).sort({ createdAt: -1 });

        if (booking) {
            booking.status = status;
            await booking.save();
        } else {
            // If no booking but status is changing from Available, create a placeholder
            if (status !== 'Available') {
                booking = await TableBooking.create({
                    tableNumber,
                    status,
                    name: 'Walk-in / Admin Set',
                    email: 'admin@gourmet.com',
                    mobile: '0000000000',
                    date: today,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    guests: 'N/A'
                });
            }
        }

        res.json({ success: true, message: `Table ${tableNumber} updated to ${status}` });
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ message: 'Server error: Failed to update status' });
    }
});

module.exports = router;
