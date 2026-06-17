const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Check if user already exists
    const existing = await User.findOne({ email: "naved@gmail.com" });
    if (existing) {
      console.log("User already exists: naved@gmail.com");
    } else {
      await User.create({
        email: "naved@gmail.com",
        password: "naved@gmail.com",
        name: "Naved",
        role: "admin",
      });
      console.log("Admin user created: naved@gmail.com / naved@gmail.com");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedUser();
