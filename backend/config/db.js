const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

uri = 'mongodb+srv://nyochembengn:58ydG5tfmUsxUvxn@genealogy-app.0nogi0l.mongodb.net/?retryWrites=true&w=majority&appName=Genealogy-app';

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB is connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
