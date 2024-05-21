const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // For authentication

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sex: String,
  dateOfBirth: Date,
  fathersName: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference another user's _id
  mothersName: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  socialMedia: {
    whatsapp: String,
    facebook: String,
    instagram: String,
    tiktok: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  profilePic: String,
  photoAlbum: [String],
  biography: String,
  role: String,
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family' }
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return token;
};

module.exports = mongoose.model('User', userSchema);
