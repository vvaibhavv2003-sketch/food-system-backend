const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const { sendNewsletterEmail } = require('../utils/newsletterManager');

// @desc    Get all food items
// @route   GET /api/foods
router.get('/', async (req, res) => {
    try {
        const foods = await FoodItem.find({});
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a new food item
// @route   POST /api/foods
router.post('/', async (req, res) => {
    try {
        const { name, category, price, image, description, isVeg, rating, deliveryTime, sendNotification } = req.body;

        // Simple ID generation if not provided (for compatibility)
        const count = await FoodItem.countDocuments();
        const id = req.body.id || count + 1000;

        const food = new FoodItem({
            id,
            name,
            category,
            price,
            image,
            description,
            isVeg,
            rating,
            deliveryTime
        });

        const createdFood = await food.save();

        // Send email notification to subscribers if requested
        if (sendNotification) {
            const subject = `New Dish Alert: ${name} is now on the Menu! 🍱`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2ecc71; text-align: center;">New Dish Added!</h2>
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${image || 'https://via.placeholder.com/600x300'}" alt="${name}" style="width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" />
                    </div>
                    <div style="padding: 0 10px;">
                        <h3 style="margin-top: 0; font-size: 22px; color: #333;">${name}</h3>
                        <p style="color: #666; margin-bottom: 5px;"><strong>Category:</strong> ${category}</p>
                        <p style="color: #444; line-height: 1.5;">${description || 'Check out our latest addition to the menu. You are going to love it!'}</p>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
                            <p style="font-size: 28px; font-weight: bold; margin: 0; color: #2ecc71;">₹${price}</p>
                            <p style="font-size: 14px; margin: 10px 0 0 0; color: ${isVeg ? '#249419' : '#e74c3c'}; font-weight: 500;">
                                ${isVeg ? '🟢 Pure Vegetarian' : '🔴 Non-Vegetarian'}
                            </p>
                        </div>
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu" style="display: inline-block; padding: 14px 40px; background: #2ecc71; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">Order Now</a>
                        </div>
                    </div>
                </div>
            `;

            sendNewsletterEmail(subject, html);
        }

        res.status(201).json(createdFood);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a food item
// @route   PUT /api/foods/:id
router.put('/:id', async (req, res) => {
    try {
        const food = await FoodItem.findOne({ id: req.params.id });
        const { sendNotification } = req.body;

        if (food) {
            food.name = req.body.name || food.name;
            food.category = req.body.category || food.category;
            food.price = req.body.price || food.price;
            food.image = req.body.image || food.image;
            food.description = req.body.description || food.description;
            food.isVeg = req.body.isVeg !== undefined ? req.body.isVeg : food.isVeg;

            const updatedFood = await food.save();

            // Send notification on update if requested
            if (sendNotification) {
                const subject = `Menu Update: ${food.name} 🔔`;
                const html = `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2ecc71; text-align: center;">Menu Update!</h2>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="${food.image || 'https://via.placeholder.com/600x300'}" alt="${food.name}" style="width: 100%; border-radius: 8px; max-height: 250px; object-fit: cover;" />
                        </div>
                        <div style="padding: 0 10px;">
                            <h3 style="margin-top: 0; font-size: 22px; color: #333;">${food.name}</h3>
                            <p style="color: #666; margin-bottom: 5px;"><strong>Category:</strong> ${food.category}</p>
                            <p style="color: #444; line-height: 1.5;">${food.description}</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
                                <p style="font-size: 28px; font-weight: bold; margin: 0; color: #2ecc71;">₹${food.price}</p>
                            </div>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu" style="display: inline-block; padding: 14px 40px; background: #2ecc71; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Check it out</a>
                            </div>
                        </div>
                    </div>
                `;
                sendNewsletterEmail(subject, html);
            }

            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
router.delete('/:id', async (req, res) => {
    try {
        const food = await FoodItem.findOne({ id: req.params.id });

        if (food) {
            await food.deleteOne();
            res.json({ message: 'Food item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
