const express = require('express');
const router = express.Router();
const Counter = require('../models/Counter');

// GET visitor count
router.get('/', async (req, res) => {
  try {
    let counter = await Counter.findOne({ name: 'visitors' });
    if (!counter) {
      counter = new Counter({ name: 'visitors', count: 0 });
      await counter.save();
    }
    counter.count += 1;
    await counter.save();
    res.json({ count: counter.count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;