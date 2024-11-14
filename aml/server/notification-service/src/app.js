const express = require('express');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
app.use('/api/notification', notificationRoutes);

// Error handling (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;