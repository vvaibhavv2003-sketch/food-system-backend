const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { sendNewsletterEmail } = require('../utils/newsletterManager');

// @desc    Get all offers
// @route   GET /api/offers
router.get('/', async (req, res) => {
    try {
        const offers = await Offer.find({});
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add new offer
// @route   POST /api/offers
router.post('/', async (req, res) => {
    try {
        const { title, subtitle, description, discount, price, items, image, isActive, sendNotification } = req.body;
        const offer = await Offer.create({
            title,
            subtitle,
            description,
            discount,
            price,
            items: items || [],
            image,
            isActive
        });

        // Send email notification to subscribers if requested
        if (sendNotification) {
            const subject = `New Offer: ${title}! 🎁`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff4757; text-align: center;">New Delicious Offer is Here!</h2>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${image || 'https://via.placeholder.com/600x300'}" alt="${title}" style="width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" />
                    </div>
                    <div style="padding: 0 10px;">
                        <h3 style="margin-top: 0; font-size: 22px; color: #333;">${title}</h3>
                        <p style="color: #666; font-style: italic; margin-bottom: 15px;">${subtitle}</p>
                        <p style="color: #444; line-height: 1.5;">${description}</p>
                        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #ff4757;">
                            <p style="font-size: 28px; font-weight: bold; margin: 0; color: #ff4757;">${discount}% OFF</p>
                            <p style="font-size: 18px; margin: 10px 0 0 0; color: #333;">Price: ₹${price}</p>
                        </div>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 14px 40px; background: #ff4757; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);">Order Now & Save</a>
                        </div>
                    </div>
                </div>
            `;

            sendNewsletterEmail(subject, html);
        }

        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update offer
// @route   PUT /api/offers/:id
router.put('/:id', async (req, res) => {
    try {
        const { title, subtitle, description, discount, price, items, image, isActive, sendNotification } = req.body;
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            if (title !== undefined) offer.title = title;
            if (subtitle !== undefined) offer.subtitle = subtitle;
            if (description !== undefined) offer.description = description;
            if (discount !== undefined) offer.discount = discount;
            if (price !== undefined) offer.price = price;
            if (image !== undefined) offer.image = image;
            if (isActive !== undefined) offer.isActive = isActive;

            // Explicitly set items if provided
            if (items) {
                offer.items = items;
            }

            const updatedOffer = await offer.save();

            // Send notification on update if requested
            if (sendNotification) {
                const subject = `Offer Update: ${offer.title} 🎁`;
                const html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #ff4757; text-align: center;">Offer Updated!</h2>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="${offer.image || 'https://via.placeholder.com/600x300'}" alt="${offer.title}" style="width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" />
                        </div>
                        <div style="padding: 0 10px;">
                            <h3 style="margin-top: 0; font-size: 22px; color: #333;">${offer.title}</h3>
                            <p style="color: #666; font-style: italic; margin-bottom: 15px;">${offer.subtitle}</p>
                            <p style="color: #444; line-height: 1.5;">${offer.description}</p>
                            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px dashed #ff4757;">
                                <p style="font-size: 28px; font-weight: bold; margin: 0; color: #ff4757;">${offer.discount}% OFF</p>
                                <p style="font-size: 18px; margin: 10px 0 0 0; color: #333;">Price: ₹${offer.price}</p>
                            </div>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 14px 40px; background: #ff4757; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Get it Now</a>
                            </div>
                        </div>
                    </div>
                `;
                sendNewsletterEmail(subject, html);
            }

            res.json(updatedOffer);
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete offer
// @route   DELETE /api/offers/:id
router.delete('/:id', async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await offer.deleteOne();
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
