// Script to import all states and cities into MongoDB
const mongoose = require('mongoose');
const State = require('./models/State');
const City = require('./models/City');
const statesData = require('./data/states.json');
const citiesData = require('./data/cities.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/explorely';

async function importData() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Import states
  await State.deleteMany({});
  const stateDocs = await State.insertMany(statesData);
  console.log('States imported');

  // Map state name to _id
  const stateMap = {};
  stateDocs.forEach(state => {
    stateMap[state.name] = state._id;
  });

  // Prepare cities with state ObjectId
  const citiesToInsert = citiesData.map(city => ({
    name: city.name,
    state: stateMap[city.state]
  })).filter(city => city.state);

  await City.deleteMany({});
  await City.insertMany(citiesToInsert);
  console.log('Cities imported');

  mongoose.disconnect();
  console.log('Done!');
}

importData().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
