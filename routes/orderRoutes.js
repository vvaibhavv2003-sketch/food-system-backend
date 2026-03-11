const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @desc    Get all orders (or filter by user)
// @route   GET /api/orders
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.user) {
            query.user = req.query.user;
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Place a new order
// @route   POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod, paymentResult, user } = req.body;

        const order = new Order({
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            paymentResult,
            status: 'Pending',
            user: user || 'Guest'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset all orders (Delete All)
// @route   DELETE /api/orders
router.delete('/', async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: 'All orders have been reset.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
