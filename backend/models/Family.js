const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // New fields for photos and posts
  photos: [{
    filename: { type: String },
    path: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],
  posts: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Replace with user ID if not referencing User model
    createdAt: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Family', familySchema);
