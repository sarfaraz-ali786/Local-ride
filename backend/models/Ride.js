const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startCity: { type: String, required: true },
  endCity: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  stops: [{
    city: String,
    arrivalTime: Date,
    seatsAvailableFromHere: Number
  }],
  departureTime: { type: Date, required: true },
  fare: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);