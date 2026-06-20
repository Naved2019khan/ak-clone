import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Filter, Search } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Destinations — VoyageArc",
  description: "Explore 50,000+ destinations worldwide. Find your perfect travel destination.",
};

const allDestinations = [
  {
    id: 1, name: "Bali, Indonesia", continent: "Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    price: "$899", rating: 4.9, reviews: 2840, nights: 7, type: "Beach & Culture",
  },
  {
    id: 2, name: "Santorini, Greece", continent: "Europe",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    price: "$1,299", rating: 4.8, reviews: 1920, nights: 6, type: "Romantic",
  },
  {
    id: 3, name: "Maldives", continent: "Asia",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    price: "$2,499", rating: 5.0, reviews: 1145, nights: 5, type: "Luxury Beach",
  },
  {
    id: 4, name: "Kyoto, Japan", continent: "Asia",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
    price: "$1,150", rating: 4.9, reviews: 2310, nights: 8, type: "Cultural",
  },
  {
    id: 5, name: "Machu Picchu, Peru", continent: "South America",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80",
    price: "$1,599", rating: 4.8, reviews: 987, nights: 9, type: "Adventure",
  },
  {
    id: 6, name: "Paris, France", continent: "Europe",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
    price: "$1,099", rating: 4.7, reviews: 3560, nights: 6, type: "Romantic",
  },
  {
    id: 7, name: "New York, USA", continent: "North America",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    price: "$799", rating: 4.6, reviews: 4100, nights: 5, type: "City Break",
  },
  {
    id: 8, name: "Cape Town, South Africa", continent: "Africa",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
    price: "$1,399", rating: 4.8, reviews: 876, nights: 8, type: "Adventure",
  },
  {
    id: 9, name: "Dubai, UAE", continent: "Middle East",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    price: "$1,899", rating: 4.7, reviews: 2230, nights: 6, type: "Luxury",
  },
  {
    id: 10, name: "Sydney, Australia", continent: "Oceania",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80",
    price: "$1,699", rating: 4.8, reviews: 1560, nights: 8, type: "City & Beach",
  },
  {
    id: 11, name: "Amalfi Coast, Italy", continent: "Europe",
    image: "https://images.unsplash.com/photo-1533606688076-b6683a5f59f1?w=600&q=80",
    price: "$1,349", rating: 4.9, reviews: 1450, nights: 7, type: "Scenic",
  },
  {
    id: 12, name: "Phuket, Thailand", continent: "Asia",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&q=80",
    price: "$749", rating: 4.6, reviews: 3100, nights: 7, type: "Beach",
  },
];

const continents = ["All", "Asia", "Europe", "North America", "South America", "Africa", "Middle East", "Oceania"];

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div
          className="relative h-64 bg-cover bg-center flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Explore Destinations
            </h1>
            <p className="text-white/80 text-lg">
              Discover 50,000+ destinations handpicked for every type of traveler
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                aria-label="Search destinations"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {continents.map((c) => (
                <button
                  key={c}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    c === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-blue-400 transition-all shrink-0">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allDestinations.map((dest) => (
              <article
                key={dest.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover group"
              >
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 gradient-overlay" />
                  <span className="absolute top-2 left-2 bg-white/90 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {dest.type}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-gray-700">{dest.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.continent}</span>
                    <span className="mx-1">·</span>
                    <span>{dest.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{dest.price}</span>
                      <span className="text-gray-400 text-xs ml-1">/person</span>
                    </div>
                    <Link
                      href={`/destinations/${dest.id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-10">
            <button className="bg-white border border-blue-200 text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all">
              Load More Destinations
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
