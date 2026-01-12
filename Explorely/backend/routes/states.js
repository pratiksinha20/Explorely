const express = require('express');
const router = express.Router();
const State = require('../models/State');


// GET all states
router.get('/', async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH states by name or code (case-insensitive, partial match)
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const regex = new RegExp(q, 'i');
    const states = await State.find({
      $or: [
        { name: regex },
        { code: regex }
      ]
    });
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new state
router.post('/', async (req, res) => {
  const state = new State({
    name: req.body.name,
  });
  try {
    const newState = await state.save();
    res.status(201).json(newState);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;