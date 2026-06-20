"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, ArrowRight, Heart, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5000/api";

interface Destination {
  _id: string;
  name: string;
  country: { name: string; code: string };
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

export default function DestinationsSection() {
  const [active, setActive] = useState("All");
  const [liked, setLiked] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filters, setFilters] = useState<{ _id: string; name: string }[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch filters (travel types) from API
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_URL}/destinations/filters`);
        const data = await res.json();
        if (data.success) {
          setFilters(data.data);
        }
      } catch {
        // fallback
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const url = active === "All"
          ? `${API_URL}/destinations`
          : `${API_URL}/destinations?type=${encodeURIComponent(active)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setDestinations(data.data);
        }
      } catch {
        // fallback
      }
    };
    fetchDestinations();
  }, [active]);

  const toggleLike = (id: string) =>
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  });

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const getImageUrl = (img: string) => {
    if (!img) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`;
  };

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-100 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Trending Destinations
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Where To{" "}
              <span className="bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Next?
              </span>
            </h2>
            <p className="text-gray-700 mt-3 text-lg max-w-md">
              Handpicked spots loved by travelers around the world
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <Link
              href="/destinations"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
            >
              All Destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Pills from API (Package Types) */}
        <div className="flex gap-2.5 mb-12 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setActive("All")}
            className={`shrink-0 text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 ${
              active === "All"
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md"
            }`}
          >
            All
          </button>
          {filters.map((f) => (
            <button
              key={f._id}
              onClick={() => setActive(f._id)}
              className={`shrink-0 text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 ${
                active === f._id
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm border border-gray-100 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Card Slider */}
        {destinations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No destinations found. Add locations in CRM to see them here.</p>
          </div>
        ) : (
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x py-4"
          >
            {destinations.map((dest) => (
              <div
                key={dest._id}
                className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 h-[380px] sm:h-[420px] bg-gray-900 shrink-0 w-[75vw] sm:w-[55vw] md:w-[320px] lg:w-[300px] snap-start"
              >
                {/* Background Image */}
                <img
                  src={getImageUrl(dest.image)}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90" />

                {/* Like Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(dest._id);
                  }}
                  className="absolute top-5 right-5 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all z-10 shadow-lg"
                  aria-label={`Like ${dest.name}`}
                >
                  <Heart
                    className={`w-4.5 h-4.5 transition-all duration-300 ${
                      liked.includes(dest._id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Package Type badges */}
                {dest.packageTypes && dest.packageTypes.length > 0 && (
                  <div className="absolute top-5 left-5 flex gap-1.5 flex-wrap">
                    {dest.packageTypes.slice(0, 2).map((pt) => (
                      <span key={pt._id} className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg">
                        {pt.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {/* Rating */}
                  {dest.rating > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                      <span className="text-white text-sm font-bold">{dest.rating}</span>
                      {dest.reviews > 0 && (
                        <span className="text-gray-300 text-xs">({dest.reviews.toLocaleString()})</span>
                      )}
                    </div>
                  )}

                  <h3 className="font-bold text-white text-2xl leading-tight mb-1">
                    {dest.name}
                  </h3>
                  {dest.description && (
                    <p className="text-gray-200 text-sm mb-2">{dest.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-200 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-orange-300" />
                    <span>{dest.country?.name || ""}</span>
                    {dest.nights > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{dest.nights} nights</span>
                      </>
                    )}
                  </div>

                  {/* Price + CTA row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-400">
                    <div>
                      <p className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">From</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-white">₹{dest.price.toLocaleString()}</p>
                        {dest.strikePrice > 0 && dest.strikePrice > dest.price && (
                          <p className="text-sm text-gray-400 line-through">₹{dest.strikePrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/packages/search?location=${encodeURIComponent(dest.name)}`}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold px-8 py-4 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-lg shadow-orange-500/25"
          >
            View All Destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
