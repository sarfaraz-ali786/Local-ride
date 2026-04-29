const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  pickupStop: { type: String, required: true },
  dropoffStop: { type: String, required: true },
  fare: { type: Number, required: true },
  seatsBooked: { type: Number, default: 1 },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);