const Member = require('../models/Member');

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate('father mother');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMember = async (req, res) => {
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
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
