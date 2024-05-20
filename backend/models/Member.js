const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  familyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  password: { type: String, required: true },
  whatsapp: { type: String },
  facebook: { type: String },
  Instagram: { type: String },
  tiktok: { type: String },
  address: { type: String, required: true },
  profilePic: { type: String },
  photoAlbum: [{ type: String }], // Array of image URLs
  biography: { type: String },
  role: { type: String, required: true }
});

// Hash password before saving the member
memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
