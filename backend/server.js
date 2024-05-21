const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("./config.json");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Intergrating routes
app.use("/api/auth/user", require("./routes/user")); // User routes
app.use("/api/family", require("./routes/family")); // Family routes

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error handling middleware');
  });

const port = config.port;
app.listen(port, () => console.log(`Server is running on port ${port}`));
