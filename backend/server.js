const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes
app.use('/api/members', require('./routes/memberRoutes')); // Member routes

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));
