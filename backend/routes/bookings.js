const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Create booking (Passenger)
router.post('/book', async (req, res) => {
  try {
    const { passenger, ride, pickupStop, dropoffStop, fare, seatsBooked } = req.body;

    const rideData = await Ride.findById(ride);
    if (!rideData) return res.status(404).json({ message: 'Ride not found!' });
    if (rideData.availableSeats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats!' });
    }

    const booking = new Booking({ passenger, ride, pickupStop, dropoffStop, fare, seatsBooked });
    await booking.save();

    // Reduce available seats
    rideData.availableSeats -= seatsBooked;
    await rideData.save();

    res.status(201).json({ message: 'Seat booked!', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete booking — seat release + 10% commission
router.put('/:id/complete', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found!' });

    booking.status = 'completed';
    await booking.save();

    // Release seat
    const ride = await Ride.findById(booking.ride);
    ride.availableSeats += booking.seatsBooked;
    await ride.save();

    // Deduct 10% commission from driver wallet
    const commission = booking.fare * 0.10;
    await User.findByIdAndUpdate(ride.driver, {
      $inc: { walletBalance: -commission }
    });

    res.json({ message: 'Booking completed! Seat released.', commission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bookings by passenger
router.get('/my/:passengerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.params.passengerId })
      .populate('ride');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;