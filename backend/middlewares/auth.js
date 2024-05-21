const jwt = require('jsonwebtoken');
const config = require('../config.json')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1]; // Extract token from authorization header
    if (!token) return res.status(401).send({ message: 'Unauthorized: Access token is required' });

    const decoded = jwt.verify(token, config.jwtSecret); // Verify token
    req.user = await User.findById(decoded._id); // Fetch user from decoded ID
    if (!req.user) return res.status(401).send({ message: 'Unauthorized: Invalid token' });

    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized: ' + error.message });
  }
};

module.exports = auth;
