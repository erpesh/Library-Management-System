const express = require('express');
const connectDB = require('./config/db');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/wishlist', wishlistRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;