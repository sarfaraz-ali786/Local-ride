const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Create a ride (Driver)
router.post('/create', async (req, res) => {
  try {
    const { driver, startCity, endCity, totalSeats, stops, departureTime, fare } = req.body;
    const ride = new Ride({
      driver, startCity, endCity,
      totalSeats, availableSeats: totalSeats,
      stops, departureTime, fare
    });
    await ride.save();
    res.status(201).json({ message: 'Ride created!', ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search rides
router.get('/search', async (req, res) => {
  try {
    const { from, to } = req.query;
    const rides = await Ride.find({
      startCity: from,
      endCity: to,
      status: 'active',
      availableSeats: { $gt: 0 }
    }).populate('driver', 'name rating');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().populate('driver', 'name rating');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;