const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  emailVerified: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('users', userSchema);;
