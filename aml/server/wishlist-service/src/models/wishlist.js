const mongoose = require('mongoose');

const wishlistRecordSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('WishlistRecord', wishlistRecordSchema);
