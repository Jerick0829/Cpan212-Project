const express = require('express');
const router = express.Router();
const passport = require('../configuration/passportConfiguration');
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Import bcrypt


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password with 10 salt rounds
  
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      res.status(500).json({ message: 'Failed to register user' });
    }
  });

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
