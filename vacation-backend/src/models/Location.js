const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Country is required"],
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    strikePrice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    days: {
      type: Number,
      default: 1,
    },
    nights: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
      default: "",
    },
    packageTypes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelType",
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate location names within same country
locationSchema.index({ name: 1, country: 1 }, { unique: true });

module.exports = mongoose.model("Location", locationSchema);
