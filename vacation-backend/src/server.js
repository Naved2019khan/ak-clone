const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/travel-types", require("./routes/travelType.routes"));
app.use("/api/countries", require("./routes/country.routes"));
app.use("/api/locations", require("./routes/location.routes"));
app.use("/api/packages", require("./routes/package.routes"));
app.use("/api/destinations", require("./routes/destination.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Vacation CRM Backend is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
