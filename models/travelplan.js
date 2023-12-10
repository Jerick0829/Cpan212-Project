const mongoose = require('mongoose');

// Define the schema for TravelPlan
const travelPlanSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  traveler: {
    type: String,
    required: true
  }
});

// Create a model based on the schema
const TravelPlan = mongoose.model('TravelPlan', travelPlanSchema);

module.exports = { TravelPlan };
 