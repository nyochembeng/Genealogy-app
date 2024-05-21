const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth'); // Import authentication middleware

// Register a new user (continued from previous code)
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login user (continued from previous code)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get currently authenticated user's information (requires authentication)
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user; // Access user from middleware
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update user information (requires authentication)
router.put('/:userId/update', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body); // Get updated fields
    const allowedUpdates = ['firstName', 'middleName', 'lastName', 'dateOfBirth', 'sex', 'socialMedia', 'address', 'biography']; // Allowed fields to update
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update)); // Check for valid updates
    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid updates!' });

    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }); // Update and return updated user
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get details of a specific user (requires authorization with permission check)
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    // Implement permission check here (e.g., check if user is part of the same family)
    // You can use middleware or logic within the route to restrict access based on user roles or family membership

    res.send(user); // If permission check passes, send user details
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
