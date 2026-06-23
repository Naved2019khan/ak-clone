const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
    },
    slug: {
      type: String,
      default: "",
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
    strikePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        activities: [{ type: String }],
        image: { type: String, default: "" },
      },
    ],
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
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving
packageSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

module.exports = mongoose.model("Package", packageSchema);
