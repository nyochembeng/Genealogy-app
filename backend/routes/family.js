const express = require('express');
const router = express.Router();
const Family = require('../models/Family');
const auth = require('../middlewares/auth'); // Import authentication middleware

// Get all families the authenticated user belongs to (requires authentication)
router.get('/all', auth, async (req, res) => {
  try {
    const user = req.user;
    const families = await Family.find({ members: user._id }).populate('createdBy members'); // Populate creator and member details
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
      members: [user._id], // Add creator as the first member
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

// Get all photos for a specific family (requires authorization with permission check)
router.get('/:familyId/photos', auth, async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user is a member of the family)

    res.send(family.photos);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Upload a new photo for a family (requires authorization with permission check)
// (Assuming you have a separate route for handling file uploads)
router.post('/:familyId/upload-photo', auth, async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const { filename, path } = req.body; // Assuming photo details are sent in the request body

    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user has permission to upload photos)

    family.photos.push({ filename, path, uploadedAt: Date.now() });
    await family.save();

    res.status(201).send(family);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all posts for a specific family (requires authorization with permission check)
router.get('/:familyId/posts', auth, async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const family = await Family.findById(familyId).populate('posts.author'); // Populate author details for posts

    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user is a member of the family)

    res.send(family.posts);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new post for a family (requires authorization with permission check)
router.post('/:familyId/create-post', auth, async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const { content } = req.body;
    const user = req.user; // Get user details from authentication middleware

    const family = await Family.findById(familyId);
    if (!family) return res.status(404).send('Family not found');

    // Implement permission check here (e.g., check if user can create posts)

    family.posts.push({ content, author: user._id, createdAt: Date.now() });
    await family.save();

    res.status(201).send(family);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
