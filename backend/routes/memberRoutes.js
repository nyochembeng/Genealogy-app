// const { getMembers, addMember } = require('../controllers/memberController');

// router.get('/', getMembers);
// router.post('/', addMember);

const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const authMiddleware = require('../middleware/authMiddleware');

// Get all members
router.get('/', authMiddleware, async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add a new member
router.post('/', authMiddleware, async (req, res) => {
  const { name, email, dateOfBirth, placeOfResidence, phoneNumber, father, mother } = req.body;
  try {
    const newMember = new Member({
      name,
      email,
      dateOfBirth,
      placeOfResidence,
      phoneNumber,
      father,
      mother
    });
    const member = await newMember.save();
    res.json(member);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;

