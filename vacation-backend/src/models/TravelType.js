const mongoose = require("mongoose");

const travelTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Travel type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TravelType", travelTypeSchema);
