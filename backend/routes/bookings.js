const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/book', async (req, res) => {
  try {
    const { passenger, ride, pickupStop, dropoffStop, fare, seatsBooked } = req.body;
    const booking = new Booking({
      passenger, ride, pickupStop, dropoffStop, fare, seatsBooked, status: 'confirmed'
    });
    await booking.save();
    res.json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('ride');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
