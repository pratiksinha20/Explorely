const express = require('express');
const router = express.Router();
const Spot = require('../models/Spot');


// GET spots by city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const spots = await Spot.find({ city }).populate('city');
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH spots by name and city (case-insensitive, partial match)
router.get('/search', async (req, res) => {
  const { q, city } = req.query;
  if (!q || !city) return res.json([]);
  try {
    const regex = new RegExp(q, 'i');
    const spots = await Spot.find({
      name: regex,
      city
    }).populate('city');
    res.json(spots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new spot
router.post('/', async (req, res) => {
  const spot = new Spot({
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    mapLink: req.body.mapLink,
    city: req.body.city,
  });
  try {
    const newSpot = await spot.save();
    res.status(201).json(newSpot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;