const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const FoodItem = require('../models/FoodItem');
const Offer = require('../models/Offer');
const Category = require('../models/Category');
const transporter = require('../utils/mailer');
const { sendNewsletterEmail } = require('../utils/newsletterManager');

// @desc    Send automated summary update to all subscribers
// @route   POST /api/newsletter/update-summary
router.post('/update-summary', async (req, res) => {
    try {
        // Fetch latest 3 items of each type
        const latestItems = await FoodItem.find().sort({ createdAt: -1 }).limit(3);
        const latestOffers = await Offer.find({ isActive: true }).sort({ createdAt: -1 }).limit(3);
        const latestCategories = await Category.find().sort({ createdAt: -1 }).limit(3);

        if (latestItems.length === 0 && latestOffers.length === 0 && latestCategories.length === 0) {
            return res.status(400).json({ message: 'No new updates found to send.' });
        }

        const subject = "🍱 What's New at Gourmet Paradise!";

        let html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #ff4757; margin-bottom: 5px;">Gourmet Paradise</h1>
                    <p style="color: #666; margin-top: 0;">Weekly Update Summary</p>
                </div>

                <p style="font-size: 16px; line-height: 1.6;">Hello Foodie! We've been busy adding some delicious new things to our menu. Check out what's new!</p>
        `;

        // Add Offers Section
        if (latestOffers.length > 0) {
            html += `
                <div style="margin-top: 30px; border-bottom: 2px solid #ff4757; padding-bottom: 10px;">
                    <h2 style="color: #ff4757; margin: 0;">🎁 Special Offers</h2>
                </div>
                <div style="display: grid; gap: 15px; margin-top: 15px;">
            `;
            latestOffers.forEach(offer => {
                html += `
                    <div style="background: #fff9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4757; display: flex; align-items: center; gap: 15px;">
                        <img src="${offer.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                        <div>
                            <h3 style="margin: 0; color: #333;">${offer.title}</h3>
                            <p style="margin: 5px 0; font-size: 14px; color: #666;">${offer.discount}% OFF - Now Only ₹${offer.price}</p>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Add Menu Items Section
        if (latestItems.length > 0) {
            html += `
                <div style="margin-top: 40px; border-bottom: 2px solid #2ed573; padding-bottom: 10px;">
                    <h2 style="color: #2ed573; margin: 0;">🍕 New Menu Items</h2>
                </div>
                <div style="display: grid; gap: 15px; margin-top: 15px;">
            `;
            latestItems.forEach(item => {
                html += `
                    <div style="background: #f9fff9; padding: 15px; border-radius: 8px; border-left: 4px solid #2ed573; display: flex; align-items: center; gap: 15px;">
                        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;" />
                        <div>
                            <h3 style="margin: 0; color: #333;">${item.name}</h3>
                            <p style="margin: 5px 0; font-size: 14px; color: #666;">${item.category} - ₹${item.price}</p>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        // Add Categories Section
        if (latestCategories.length > 0) {
            html += `
                <div style="margin-top: 40px; border-bottom: 2px solid #ffa502; padding-bottom: 10px;">
                    <h2 style="color: #ffa502; margin: 0;">🏷️ New Categories</h2>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
            `;
            latestCategories.forEach(cat => {
                html += `
                    <div style="background: #fff9f0; padding: 10px 15px; border-radius: 20px; font-weight: bold; color: #ffa502; border: 1px solid #ffeaa7;">
                        ${cat.name}
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `
                <div style="text-align: center; margin-top: 40px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 15px 40px; background: #ff4757; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3);">Order Now! 🚀</a>
                </div>
            </div>
        `;

        await sendNewsletterEmail(subject, html);

        res.json({ message: 'Summary update sent successfully to all subscribers.' });
    } catch (error) {
        console.error('Update summary error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Broadcast message to all subscribers
// @route   POST /api/newsletter/broadcast
router.post('/broadcast', async (req, res) => {
    try {
        const { subject, message, image } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required' });
        }

        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ff4757; text-align: center;">${subject}</h2>
                ${image ? `<div style="text-align: center; margin-bottom: 20px;">
                    <img src="${image}" alt="Update" style="width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" />
                </div>` : ''}
                <div style="padding: 0 10px;">
                    <div style="color: #444; line-height: 1.6; font-size: 16px;">${message.replace(/\n/g, '<br>')}</div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 12px 30px; background: #ff4757; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px;">Visit Website</a>
                    </div>
                </div>
            </div>
        `;

        await sendNewsletterEmail(subject, html);

        res.json({ message: 'Broadcast sent successfully to all subscribers.' });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if email already exists
        let subscription = await Newsletter.findOne({ email });

        if (subscription) {
            if (subscription.status === 'subscribed') {
                return res.status(400).json({ message: 'Email already subscribed' });
            } else {
                // Re-subscribe
                subscription.status = 'subscribed';
                await subscription.save();
            }
        } else {
            subscription = new Newsletter({ email, status: 'subscribed' });
            await subscription.save();
        }

        // Send Welcome Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Gourmet Paradise Newsletter! 🍕',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff4757;">Welcome to the Family!</h2>
                    <p>Thank you for subscribing to our newsletter.</p>
                    <p>You will now be the first to know about our <strong>latest offers, new dishes, and exclusive discounts</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">You are receiving this because you subscribed at Gourmet Paradise.</p>
                    <p style="font-size: 11px; color: #aaa;">If you wish to unsubscribe, <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe">click here</a>.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Welcome email error:', error);
            } else {
                console.log('Welcome email sent to:', email);
            }
        });

        res.status(201).json({ message: 'You are successfully subscribed and will receive new offers and item updates.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const subscription = await Newsletter.findOne({ email });

        if (!subscription) {
            return res.status(404).json({ message: 'Email not found in our subscriber list' });
        }

        subscription.status = 'unsubscribed';
        await subscription.save();

        res.json({ message: 'You have been successfully unsubscribed.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
