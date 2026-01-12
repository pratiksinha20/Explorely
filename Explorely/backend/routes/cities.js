const express = require('express');
const router = express.Router();
const City = require('../models/City');


// GET cities by state
router.get('/', async (req, res) => {
  try {
    const { state } = req.query;
    const cities = await City.find({ state }).populate('state');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH cities by name and state (case-insensitive, partial match)
router.get('/search', async (req, res) => {
  const { q, state } = req.query;
  if (!q || !state) return res.json([]);
  try {
    const regex = new RegExp(q, 'i');
    const cities = await City.find({
      name: regex,
      state
    }).populate('state');
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new city
router.post('/', async (req, res) => {
  const city = new City({
    name: req.body.name,
    state: req.body.state,
  });
  try {
    const newCity = await city.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;