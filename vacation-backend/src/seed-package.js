const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Country = require("./models/Country");
const Location = require("./models/Location");
const TravelType = require("./models/TravelType");
const Package = require("./models/Package");

dotenv.config();

const seedPackage = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // 1. Create or find Country: India
    let india = await Country.findOne({ $or: [{ code: "IN" }, { name: "India" }] });
    if (!india) {
      india = await Country.create({
        name: "India",
        code: "IN",
        description: "Incredible India - diverse culture, heritage, and natural beauty",
      });
      console.log("Created country: India");
    } else {
      console.log("Country India already exists");
    }

    // 2. Create or find Travel Type: Leisure
    let leisure = await TravelType.findOne({ name: "Leisure" });
    if (!leisure) {
      leisure = await TravelType.create({
        name: "Leisure",
        description: "Relaxing getaways with comfort and recreation",
      });
      console.log("Created travel type: Leisure");
    } else {
      console.log("Travel type Leisure already exists");
    }

    // 3. Create or find Location: Noida (with packageTypes)
    let noida = await Location.findOne({ name: "Noida", country: india._id });
    if (!noida) {
      noida = await Location.create({
        name: "Noida",
        country: india._id,
        description: "A modern city in Uttar Pradesh, gateway to NCR region",
        price: 4999,
        strikePrice: 7999,
        rating: 4.5,
        reviews: 320,
        days: 3,
        nights: 2,
        packageTypes: [leisure._id],
      });
      console.log("Created location: Noida");
    } else {
      // Update existing Noida with missing fields
      await Location.findByIdAndUpdate(noida._id, {
        price: noida.price || 4999,
        strikePrice: noida.strikePrice || 7999,
        rating: noida.rating || 4.5,
        reviews: noida.reviews || 320,
        days: noida.days || 3,
        nights: noida.nights || 2,
        packageTypes: noida.packageTypes && noida.packageTypes.length > 0 ? noida.packageTypes : [leisure._id],
      });
      noida = await Location.findById(noida._id);
      console.log("Location Noida already exists — updated missing fields");
    }

    // 4. Create dummy package for Noida
    const existingPkg = await Package.findOne({ title: "Noida Weekend Getaway" });
    if (existingPkg) {
      console.log("Package already exists: Noida Weekend Getaway");
    } else {
      await Package.create({
        title: "Noida Weekend Getaway",
        description:
          "Escape to Noida for a luxurious weekend retreat. Enjoy world-class malls, amusement parks, fine dining, and serene green spaces. Perfect for families and couples looking for a quick city break with all modern comforts.",
        country: india._id,
        location: noida._id,
        travelType: leisure._id,
        price: 4999,
        duration: { days: 3, nights: 2 },
        highlights: [
          "5-Star Hotel Stay",
          "Worlds of Wonder Theme Park",
          "DLF Mall of India Shopping",
          "Okhla Bird Sanctuary Visit",
          "Noida Nightlife Experience",
        ],
        amenities: [
          "Free WiFi",
          "Swimming Pool",
          "Spa & Wellness Center",
          "Complimentary Breakfast",
          "Airport/Station Pickup",
          "AC Rooms",
          "24/7 Room Service",
          "Gym Access",
          "Parking",
          "Kids Play Area",
        ],
        images: [
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
        ],
        inclusions: [
          "2 Nights in 5-Star Hotel",
          "Daily Breakfast & Dinner",
          "Theme Park Entry Tickets",
          "City Sightseeing Tour",
          "Welcome Drinks on Arrival",
          "Late Checkout",
        ],
        exclusions: [
          "Airfare / Train Tickets",
          "Personal Expenses",
          "Lunch",
          "Any activity not mentioned",
          "Travel Insurance",
        ],
        isFeatured: true,
        isActive: true,
      });
      console.log("Created package: Noida Weekend Getaway");
    }

    console.log("\nSeed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedPackage();
