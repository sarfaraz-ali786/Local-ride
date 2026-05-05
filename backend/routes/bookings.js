const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const authMiddleware = require('../middleware/auth');

router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { rideId, seats } = req.body;

    const ride = await Ride.findById(rideId).populate('driver', 'name phone');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.seats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = new Booking({
      ride: rideId,
      passenger: req.user.id,
      seats,
      totalFare: ride.fare * seats,
    });
    await booking.save();

    ride.seats -= seats;

    // ✅ FIX: booking ko ride.bookings array mein add karo
    if (!ride.bookings) ride.bookings = [];
    ride.bookings.push(booking._id);

    await ride.save();

    // Driver ko notification (Socket.IO)
    try {
      const driverId = ride.driver._id.toString();
      const driverSocketId = req.driverSockets && req.driverSockets[driverId];
      if (driverSocketId) {
        req.io.to(driverSocketId).emit('new_booking', {
          seats,
          from: ride.startCity,
          to: ride.endCity,
          totalFare: ride.fare * seats,
        });
      }
    } catch (socketErr) {
      // Socket error se booking fail na ho
      console.log('Socket notification skipped:', socketErr.message);
    }

    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;