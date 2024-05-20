const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  placeOfResidence: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  father: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  mother: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
