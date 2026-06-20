"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Search } from "lucide-react";
import Link from "next/link";

const API_URL = "http://localhost:5000/api";

interface Location {
  _id: string;
  name: string;
  country: { _id: string; name: string; code: string };
  description: string;
  image: string;
  price: number;
  strikePrice: number;
  rating: number;
  reviews: number;
  days: number;
  nights: number;
  tag: string;
  packageTypes: { _id: string; name: string }[];
}

export default function DestinationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocations = async (query?: string) => {
    try {
      setLoading(true);
      const url = query && query.trim()
        ? `${API_URL}/locations/search?q=${encodeURIComponent(query.trim())}`
        : `${API_URL}/locations`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLocations(data.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchLocations(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const getImageUrl = (img: string) => {
    if (!img) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";
    if (img.startsWith("http")) return img;
    // Normalize backslashes to forward slashes for URL
    const normalized = img.replace(/\\/g, "/");
    return `http://localhost:5000/${normalized}`;
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa] relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl" />

        {/* Hero */}
        <div
          className="relative h-64 bg-cover bg-center flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-rose-900/60" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Explore Destinations
            </h1>
            <p className="text-white/80 text-lg">
              Discover handpicked destinations for every type of traveler
            </p>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
          {/* Search Bar */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mb-10 border border-orange-100/50 shadow-sm">
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white max-w-lg">
              <Search className="w-5 h-5 text-orange-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, countries, or tags..."
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                aria-label="Search destinations"
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-400 mt-4 text-sm">Loading destinations...</p>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No destinations found.</p>
              <p className="text-gray-300 text-sm mt-1">Try a different search or add locations in the CRM.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {locations.map((loc) => (
                <article
                  key={loc._id}
                  className="rounded-3xl group"
                >
                  {/* Image Container */}
                  <div className="relative">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-[20px] shadow-[0_0_15px_rgba(251,146,60,0.12)] border border-orange-100/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(loc.image)}
                        alt={loc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Inner ring */}
                      <div className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/30 pointer-events-none" />
                      {/* Rating Badge - Top Left */}
                      {loc.rating > 0 && (
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <span className="text-[11px] font-semibold text-gray-800">{loc.rating}</span>
                        </div>
                      )}
                      {/* Location Icon - Top Right */}
                      <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                    </div>
                    {/* Cloud shadow below image */}
                    <div className="mx-6 h-[8px] -mt-[2px] rounded-full bg-gradient-to-r from-orange-300/30 via-rose-400/35 to-orange-300/30 blur-[8px]" />
                  </div>

                  {/* Content */}
                  <div className="pt-4 pb-2 px-1">
                    <h3 className="text-[15px] font-extrabold text-gray-900 mb-0.5">
                      {loc.name}
                    </h3>
                    <p className="text-[11px] text-orange-500 font-medium mb-1.5">
                      {loc.country?.name || ""}
                    </p>
                    <p className="text-[13px] text-gray-400 leading-[1.6] mb-4 line-clamp-4 min-h-[84px]">
                      {loc.description || "A beautiful destination waiting to be explored."}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between bg-orange-50/60 border border-orange-100/50 rounded-xl px-4 py-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-gray-900">
                          ₹{loc.price > 0 ? loc.price.toLocaleString() : "—"}
                        </span>
                        {loc.nights > 0 && (
                          <span className="text-[11px] text-gray-500">/ {loc.nights} Nights</span>
                        )}
                      </div>
                      <Link
                        href={`/packages/search?location=${encodeURIComponent(loc.name)}`}
                        className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-[11px] font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-orange-500/20"
                      >
                        See More
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
