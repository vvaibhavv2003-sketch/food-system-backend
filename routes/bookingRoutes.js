const express = require('express');
const router = express.Router();
const TableBooking = require('../models/TableBooking');
const transporter = require('../utils/mailer');

// @desc    Book a table
// @route   POST /api/bookings
router.post('/', async (req, res) => {
    console.log('[BOOKING-API] Received booking request:', req.body);
    const { name, email, mobile, date, time, guests, tableNumber } = req.body;

    try {
        if (!name || !email || !mobile || !date || !time || !guests || !tableNumber) {
            return res.status(400).json({ message: 'Missing required booking fields' });
        }

        const booking = await TableBooking.create({
            tableNumber,
            name,
            email,
            mobile,
            date,
            time,
            guests
        });

        console.log(`[BOOKING-API] Success: Table ${tableNumber} booked for ${name} on ${date}`);

        // Handle Confirmation Email asynchronously (DO NOT await so user doesn't wait)
        const sendEmail = async () => {
            try {
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') {
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
                                    <p><b>Table:</b> ${tableNumber}</p>
                                    <p><b>Booking Charge:</b> ₹100 (Paid at Counter/Simulation)</p>
                                </div>
                                <p>We look forward to serving you!</p>
                                <p>Best regards,<br>The Gourmet Team</p>
                            </div>
                        `
                    };
                    await transporter.sendMail(mailOptions);
                    console.log(`[BOOKING-EMAIL] Confirmation sent successfully to ${email}`);
                } else {
                    console.log(`[BOOKING-SIMULATION] Email skipped: No credentials in .env`);
                }
            } catch (err) {
                console.error(`[BOOKING-EMAIL-ERROR] Failed to send email: ${err.message}`);
            }
        };

        // Fire and forget
        sendEmail();

        res.status(201).json({
            success: true,
            message: 'Table booked successfully!',
            booking
        });
    } catch (error) {
        console.error('[BOOKING-API-ERROR] Internal Error:', error.message);
        res.status(500).json({ message: 'Server error: Failed to book table' });
    }
});

// @desc    Get table statuses
// @route   GET /api/bookings/status
router.get('/status', async (req, res) => {
    try {
        let queryDate = req.query.date;
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // If no date provided, default to today
        if (!queryDate) {
            queryDate = todayStr;
        }

        console.log(`[BOOKING-STATUS] Querying tables for date: ${queryDate}`);

        // Find bookings for this date
        // Try exact match first
        let bookings = await TableBooking.find({ date: queryDate });
        
        // If no bookings found and it's today's date in YYYY-MM-DD, 
        // try finding with potential MM/DD/YYYY format just in case
        if (bookings.length === 0 && queryDate === todayStr) {
            const alternativeDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }); // MM/DD/YYYY
            console.log(`[BOOKING-STATUS] No YYYY-MM-DD bookings, trying alternative: ${alternativeDate}`);
            bookings = await TableBooking.find({ date: alternativeDate });
        }

        console.log(`[BOOKING-STATUS] Found ${bookings.length} active bookings`);

        // We have 12 tables
        const tables = Array.from({ length: 12 }, (_, i) => {
            const tableNum = i + 1;
            // Support both "T-001" and "1" style table numbers if necessary
            // Looking at the frontend, it says "T-001" but usually backend stores numbers
            const booking = bookings.find(b => {
                const bTable = String(b.tableNumber).replace('T-', '').replace('-', '');
                return parseInt(bTable) === tableNum;
            });

            return {
                number: tableNum,
                displayId: `T-${String(tableNum).padStart(3, '0')}`,
                status: booking ? (booking.status || 'Booked') : 'Available',
                bookedBy: booking ? booking.name : null
            };
        });

        res.json(tables);
    } catch (error) {
        console.error('[BOOKING-STATUS-ERROR] Fetch Status Error:', error.message);
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
