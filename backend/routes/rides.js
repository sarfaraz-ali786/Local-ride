const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a ride
router.post('/create', auth, async (req, res) => {
  try {
    const { startCity, endCity, totalSeats, stops, departureTime, fare } = req.body;
    const ride = new Ride({
      driver: req.user.id,
      startCity, endCity,
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
      startCity: from, endCity: to,
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
