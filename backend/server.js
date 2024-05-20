const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const config = require("./config.json");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Intergrating routes
app.use("/api/auth", require("./routes//registerRoutes")); // Registration routes
app.use("/api/auth", require("./routes/auth0Routes")); // Authentication routes
app.use("/api/members", require("./routes/memberRoutes")); // Member routes

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error handling middleware');
  });

const port = config.port;
app.listen(port, () => console.log(`Server is running on port ${port}`));
