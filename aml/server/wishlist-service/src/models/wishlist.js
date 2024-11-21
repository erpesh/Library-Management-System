const mongoose = require('mongoose');

const wishlistRecordSchema = new Schema({
  userID: { type: Number, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  mediaID: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('WishlistRecord', wishlistRecordSchema);
