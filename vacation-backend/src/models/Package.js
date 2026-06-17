const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Country is required"],
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required"],
    },
    travelType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelType",
      required: [true, "Travel type is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    highlights: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
