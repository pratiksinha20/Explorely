const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/explorely', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes

app.use('/api/states', require('./routes/states'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/spots', require('./routes/spots'));
app.use('/api/counter', require('./routes/counter'));

app.get('/', (req, res) => {
  res.send('Explorely Backend');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});