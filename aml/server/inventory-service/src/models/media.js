const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mediaType: { 
    type: String, 
    required: true, 
    enum: ['book', 'cd', 'game']  
  },
  genre: { type: String, required: true },
  releaseDate: { type: Date },
  stock: { type: Number, required: true, default: 0 },
  description: { type: String },
  coverImgURL: { type: String }, 
  borrowed: { type: String, required: true, default: "Available" }, 
  author: { type: String }, 
  publisher: { type: String }, 
  platform: { type: String, default: null }, 
  artist: { type: String, default: null }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);
