const express = require('express');
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB(process.env.MONGO_URI);
}

// Middleware
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;