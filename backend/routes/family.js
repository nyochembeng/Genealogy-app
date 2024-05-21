const express = require('express');
const router = express.Router();
const Family = require('../models/family');
const auth = require('../middlewares/auth'); // Import authentication middleware

// Get all families the authenticated user belongs to (requires authentication)
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;
    const families = await Family.find({ members: user._id }); // Find families where user is a member
    res.send(families);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new family (requires authentication)
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const user = req.user;

    const family = new Family({
      name,
      description,
      createdBy: user._id,
      members: [user._id] // Add creator as the first member
    });
    await family.save();

    res.status(201).send(family);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get details of a specific family (requires authorization with permission check)
router.get('/:familyId', auth, async (req, res) => {
  try {
    const family = await Family.findById(req.params.familyId).populate('members'); // Populate members details
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user is a member of the family)
    // You can use middleware or logic within the route to restrict access based on user roles or family membership

    res.send(family);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a member to a family (requires authorization with permission check)
router.put('/:familyId/add-member', auth, async (req, res) => {
  try {
    const { memberId } = req.body;
    const familyId = req.params.familyId;

    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user has permission to add members)

    if (family.members.includes(memberId)) return res.status(400).send('Member already exists in the family');

    family.members.push(memberId);
    await family.save();

    res.send(family);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Remove a member from a family (requires authorization with permission check)
router.put('/:familyId/remove-member', auth, async (req, res) => {
  try {
    const { memberId } = req.body;
    const familyId = req.params.familyId;

    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user has permission to remove members)

    const memberIndex = family.members.indexOf(memberId);
    if (memberIndex === -1) return res.status(400).send('Member not found in the family');

    family.members.splice(memberIndex, 1);
    await family.save();

    res.send(family);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Update family details (requires authorization with permission check) (continued)
router.put('/:familyId/update', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description']; // Allowed fields to update
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) return res.status(400).send({ error: 'Invalid updates!' });

    const familyId = req.params.familyId;
    const updatesObject = req.body; // Update object

    const family = await Family.findByIdAndUpdate(familyId, updatesObject, { new: true, runValidators: true });
    if (!family) return res.status(404).send('Family not found');

    res.send(family);
  } catch (error) {
    res.status(400).send(error.message); // Handle potential errors during update
  }
});

module.exports = router;
