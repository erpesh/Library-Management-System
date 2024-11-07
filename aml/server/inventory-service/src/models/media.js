const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  genre: { type: String, required: true },
  releaseDate: { type: Date },
  imageUrl: { type: String },
  stock: { type: Number, required: true, default: 0 },
  borrowed: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);
