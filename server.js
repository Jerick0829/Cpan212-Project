const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./configuration/passportConfiguration');
const userRoutes = require('./controllers/userRoutes');
const { body, validationResult } = require('express-validator');
const { TravelPlan } = require('./models/travelplan');

const app = express();
const PORT = 3000;
const versionedEndpoint = '/api/v1/travel-plans';
const connectionString = 'mongodb://localhost:27017/travelplanner';

// Express Middleware
app.use(express.json());

// Session setup for Passport.js
app.use(
  session({
    secret: 'YhK7#Lp$2y!@znT',
    resave: false,
    saveUninitialized: false,
  })
); 
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// User Routes
app.use('/user', userRoutes);

// Handle GET requests for travel plans with validation
app.get(
  versionedEndpoint,
  [
    body('destination').optional().isString(),
    body('date').optional().isISO8601(),
    body('page').optional().isInt({ min: 1 }),
    body('limit').optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { destination, date, page = 1, limit = 10 } = req.query;

      const query = {};
      if (destination) {
        query.destination = new RegExp(destination, 'i');
      }
      if (date) {
        query.date = date;
      }

      const totalCount = await TravelPlan.countDocuments(query);
      const paginatedPlans = await TravelPlan.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({ totalCount, paginatedPlans });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  }
);

// Add a new travel plan with validation
app.post(
  versionedEndpoint,
  [
    body('destination').notEmpty().isString(),
    body('date').notEmpty().isISO8601(),
    body('traveler').notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTravelPlan = new TravelPlan(req.body);
      await newTravelPlan.save();
      res.status(201).json({ message: 'Travel plan added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add travel plan' });
    }
  }
);

// UPDATE a travel plan
app.put(
  `${versionedEndpoint}/:id`,
  [
    body('destination').notEmpty().isString(),
    body('date').notEmpty().isISO8601(),
    body('traveler').notEmpty().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const updatedPlan = await TravelPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedPlan) {
        return res.status(404).json({ message: 'Travel plan not found' });
      }
      res.status(200).json({ message: 'Travel plan updated successfully', updatedPlan });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update travel plan' });
    }
  }
);

// DELETE a travel plan
app.delete(`${versionedEndpoint}/:id`, async (req, res) => {
  try {
    const deletedPlan = await TravelPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Travel plan not found' });
    }
    res.status(200).json({ message: 'Travel plan deleted successfully', deletedPlan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete travel plan' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
