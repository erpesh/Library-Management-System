const rateLimit = require('express-rate-limit');

const mediaSearchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 30,                 // limit each IP to 30 requests per window
  message: {
    error: 'Too many requests. Please slow down.',
  },
});

module.exports = {
  mediaSearchLimiter,
};
