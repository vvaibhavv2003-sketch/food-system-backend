const express = require('express');
console.log('Starting server.js execution...');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
