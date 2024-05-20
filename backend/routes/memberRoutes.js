const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const requiresAuth = require('express-openid-connect').requiresAuth; // From express-openid-connect
const multer = require('multer'); // For file uploads

const upload = multer({ dest: '../uploads/' }); // Configure upload destination

// Get specific member details
router.get('/:memberId', requiresAuth(), async (req, res) => {
  const memberId = req.params.memberId;
  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member); // Exclude password from response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in getting member details');
  }
});

// Update member details
router.put('/:memberId', requiresAuth(), async (req, res) => {
  const memberId = req.params.memberId;
  const updates = req.body;
  try {
    const member = await Member.findByIdAndUpdate(memberId, updates, { new: true }); // Return updated document
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in updating member details');
  }
});

// Search for specific member
router.get('/search', async (req, res) => {
  const { searchTerm, role } = req.query; // Optional search parameters
  try {
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { firstName: { $regex: new RegExp(searchTerm, 'i') } }, // Case-insensitive search
          { middleName: { $regex: new RegExp(searchTerm, 'i') } },
          { familyName: { $regex: new RegExp(searchTerm, 'i') } },
          { email: { $regex: new RegExp(searchTerm, 'i') } }
        ]
      };
    }
    if (role) {
      query.role = role;
    }
    const members = await Member.find(query);
    res.json(members); // Exclude password from response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Upload member photos
router.post('/:memberId/photos', requiresAuth(), upload.single('photo'), async (req, res) => {
  const memberId = req.params.memberId;
  const photoUrl = req.file.path; // Path to uploaded file

  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    member.photoAlbum.push(photoUrl); // Add photo URL to the album
    await member.save();
    res.json({ message: 'Photo uploaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in  uploading photo');
  }
});

// Delete member photos
router.delete('/:memberId/photos/:photoIndex', requiresAuth(), async (req, res) => {
  const memberId = req.params.memberId;
  const photoIndex = parseInt(req.params.photoIndex); // Parse index as integer
  try {
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    if (photoIndex < 0 || photoIndex >= member.photoAlbum.length) {
      return res.status(400).json({ message: 'Invalid photo index' });
    }
    const photoUrl = member.photoAlbum[photoIndex]; // Get photo URL for deletion
    member.photoAlbum.splice(photoIndex, 1); // Remove photo from the album
    await member.save();
    // Implement logic to delete the actual photo file from the upload destination (e.g., using fs module)
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in deleting photo');
  }
});

// Father/Mother relationship
router.put('/:memberId/father/:fatherId', requiresAuth(), async (req, res) => {
  const memberId = req.params.memberId;
  const fatherId = req.params.fatherId;
  try {
    const member = await Member.findByIdAndUpdate(memberId, { father: fatherId }, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in updating father relationship');
  }
});

// Similar route for updating mother using motherId
router.put('/:memberId/mother/:motherId', requiresAuth(), async (req, res) => {
  const memberId = req.params.memberId;
  const motherId = req.params.motherId;
  try {
    const member = await Member.findByIdAndUpdate(memberId, { mother: motherId }, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error in updating mother relationship');
  }
});

module.exports = router;
