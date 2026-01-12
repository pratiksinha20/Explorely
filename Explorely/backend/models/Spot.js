const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String }, // e.g., latitude,longitude
  mapLink: { type: String }, // Google Maps link
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
});

module.exports = mongoose.model('Spot', spotSchema);