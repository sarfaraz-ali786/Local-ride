const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  cnic: { type: String, required: true },
  role: { type: String, enum: ['passenger', 'driver', 'admin'], default: 'passenger' },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  walletBalance: { type: Number, default: 0 },
  agreedToTerms: { type: Boolean, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);