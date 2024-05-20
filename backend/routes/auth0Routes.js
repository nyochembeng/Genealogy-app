const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const User = require('../models/User'); // Import User model
const Member = require('../models/Member'); // Import Member model
const connectDB = require('../config/db');
const app = express();
const config = require('../config.json');

const auth0Routes = async () => {
const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: config.baseUrl,
  clientID: config.clientId,
  issuerBaseURL: config.domain,
  secret: config.clientSecret
};

// The `auth` router attaches /login, /logout and /callback routes to the baseURL
app.use(auth(config));

// Connect to MongoDB before starting the server
connectDB();

// Function to save user data to MongoDB
const saveUser = async (profile) => {
  const { email } = profile;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
    await user.save();
  }

  const member = new Member({
    // Extract member data from profile and assign to the model
    firstName: profile.firstName,
    middleName: profile.middleName,
    familyName: profile.familyName,
    email: profile.email,
    sex: profile.sex,
    age: profile.age,
    fatherName: null,
    motherName: null,
    password: profile.password,
    whatsapp: profile.whatsapp,
    facebook: profile.facebook,
    Instagram: profile.Instagram,
    tiktok: profile.tiktok,
    address: profile.address?.locality,
    profilePic: profile.profilePic,
    photoAlbum: profile.photoAlbum,
    biography: profile.biography,
    role: profile.role
  });
  await member.save();
};

// Route to handle login success (callback)
app.get('/callback', async (req, res) => {
  // Handle callback logic from Auth0
  const profile = req.oidc.user;
  await saveUser(profile); // Save user data to MongoDB

  res.redirect('/profile'); // Redirect to profile route
});

 // Route to get user profile data
 app.get('/profile', requiresAuth(), async (req, res) => {
  const profile = req.oidc.user;
  const user = await User.findOne({ email: profile.email });
  const member = await Member.findOne({ email: profile.email });

  // Combine user and member data (excluding password) and send as response
  const combinedProfile = {
    ...profile, // Include profile data from Auth0
    password: undefined, // Exclude password from user data
    ...(user ? { _id: user._id } : {}), // Include user ID if found
    ...member // Include member data
  };

  res.send(JSON.stringify(combinedProfile, null, 2));
});

return app; // Return the configured Express app
};

module.exports = auth0Routes;
