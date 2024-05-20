const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Member = require('../models/Member');

// Registration route
router.post('/register', async (req, res) => {
  const {
    firstName,
    middleName,
    familyName,
    email,
    sex,
    age,
    father,
    mother,
    password,
    whatsapp,
    facebook,
    Instagram,
    tiktok,
    address,
    profilePic,
    photoAlbum,
    biography,
    role
  } = req.body;
  try {
    // Check for existing user with the same email
    let member = await Member.findOne({ email });
    if (member) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    member = new Member({
      firstName,
      middleName,
      familyName,
      email,
      sex,
      age,
      father,
      mother,
      password: hashedPassword,
      whatsapp,
      facebook,
      Instagram,
      tiktok,
      address,
      profilePic,
      photoAlbum,
      biography,
      role
    });

    await member.save();
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in registration');
  }
});

module.exports = router;
