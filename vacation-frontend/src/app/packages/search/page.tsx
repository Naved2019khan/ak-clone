"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  SlidersHorizontal,
  Clock,
  Star,
  CheckCircle,
  X,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

interface PackageItem {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  country: { _id: string; name: string; code: string };
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  strikePrice?: number;
  duration: { days: number; nights: number };
  highlights: string[];
  amenities: string[];
  images: string[];
  isFeatured: boolean;
  rating: number;
}

interface LocationItem {
  name: string;
  country: string;
}

interface TravelTypeItem {
  _id: string;
  name: string;
}

export default function PackageSearchPage() {
  return (
    <Suspense fallback={null}>
      <PackageSearchPageContent />
    </Suspense>
  );
}

function PackageSearchPageContent() {
  const searchParams = useSearchParams();

  // Search state
  const [searchLocation, setSearchLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Data from API
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelTypeItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState(0);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [locRes, typeRes] = await Promise.all([
          fetch(`${API_URL}/locations`),
          fetch(`${API_URL}/travel-types`),
        ]);
        const locData = await locRes.json();
        const typeData = await typeRes.json();

        if (locData.success && locData.data) {
          setLocations(
            locData.data.map((loc: { name: string; country?: { name?: string } }) => ({
              name: loc.name,
              country: loc.country?.name || "",
            }))
          );
        }
        if (typeData.success && typeData.data) {
          setTravelTypes(typeData.data);
        }
      } catch {
        // Silently fail
      }
    };
    fetchDropdownData();
  }, []);

  // Fetch packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/packages`);
        const data = await res.json();
        if (data.success) {
          setPackages(data.data);
          // Compute min/max price from packages
          if (data.data.length > 0) {
            const prices = data.data.map((p: PackageItem) => p.price);
            const minPrice = Math.floor(Math.min(...prices) / 1000) * 1000;
            const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
            setPriceBounds([minPrice, maxPrice]);
            setPriceRange([minPrice, maxPrice]);
          }
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Hydrate from URL params
  useEffect(() => {
    const locationParam = searchParams.get("location");
    const typeParam = searchParams.get("type");
    if (locationParam) setSearchLocation(locationParam);
    if (typeParam) {
      // Find the travel type by name and select it
      const matchedType = travelTypes.find(
        (t) => t.name.toLowerCase() === typeParam.toLowerCase()
      );
      if (matchedType) {
        setSelectedTypes([matchedType._id]);
      }
    }
  }, [searchParams, travelTypes]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter locations for dropdown
  const filteredLocations = searchLocation
    ? locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
          loc.country.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : locations;

  // Filter packages
  const filteredPackages = (() => {
    let result = packages;

    // Filter by location search
    if (searchLocation.trim()) {
      const q = searchLocation.toLowerCase();
      result = result.filter(
        (pkg) =>
          pkg.location?.name?.toLowerCase().includes(q) ||
          pkg.country?.name?.toLowerCase().includes(q) ||
          pkg.title?.toLowerCase().includes(q)
      );
    }

    // Filter by selected package types
    if (selectedTypes.length > 0) {
      result = result.filter((pkg) => selectedTypes.includes(pkg.travelType?._id));
    }

    // Filter by price range
    result = result.filter((pkg) => pkg.price >= priceRange[0] && pkg.price <= priceRange[1]);

    // Filter by minimum rating
    if (minRating > 0) {
      result = result.filter((pkg) => (pkg.rating || 0) >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  })();

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSearchLocation("");
    setPriceRange([priceBounds[0], priceBounds[1]]);
    setMinRating(0);
  };

  const activeFilterCount = selectedTypes.length + (searchLocation ? 1 : 0) + (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const toggleLike = (id: string) => {
    setLiked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const getImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80";
    const img = images[0];
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-orange-500" />
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs font-medium text-orange-600 hover:text-orange-700">
            Clear all
          </button>
        )}
      </div>

      {/* Package Type Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Package Type</h3>
        <div className="space-y-2.5">
          {travelTypes.map((type) => (
            <label key={type._id} className="flex items-center gap-3 cursor-pointer group/filter">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedTypes.includes(type._id)
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-300 group-hover/filter:border-orange-300"
                }`}
                onClick={() => toggleType(type._id)}
              >
                {selectedTypes.includes(type._id) && (
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover/filter:text-gray-900" onClick={() => toggleType(type._id)}>
                {type.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} min={priceBounds[0]} max={priceBounds[1]} />

      {/* Rating Filter */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                minRating === rating
                  ? "bg-orange-50 border border-orange-200 text-orange-700"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-xs">{rating}+ & above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa]">
        {/* Search Bar */}
        <div className="bg-white border-b border-gray-100 shadow-sm relative z-30 overflow-visible">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-visible">
            <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 shadow-xl shadow-orange-100/40 overflow-visible">
              <div className="bg-white rounded-[14px] flex flex-col sm:flex-row items-stretch sm:items-center py-4 sm:py-5 px-4 sm:px-8 gap-4 sm:gap-0 overflow-visible">

                {/* Location Input */}
                <div className="relative flex items-center gap-3 flex-1 px-2 sm:px-4" ref={locationRef}>
                  <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                  <div className="w-full">
                    <p className="text-xs font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                      Search by Location
                    </p>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => {
                        setSearchLocation(e.target.value);
                        setLocationOpen(true);
                      }}
                      onFocus={() => setLocationOpen(true)}
                      placeholder="Search location or country..."
                      className="text-sm font-bold text-gray-900 placeholder-gray-400 outline-none bg-transparent w-full"
                    />
                  </div>
                  {searchLocation && (
                    <button
                      onClick={() => setSearchLocation("")}
                      className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 shrink-0"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  )}

                  {/* Location Dropdown */}
                  {locationOpen && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="max-h-64 overflow-y-auto">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((loc) => (
                            <button
                              key={loc.name}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setSearchLocation(loc.name);
                                setLocationOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                                searchLocation === loc.name
                                  ? "bg-orange-50 text-orange-600 font-semibold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                              <div className="text-left">
                                <span className="block font-medium">{loc.name}</span>
                                {loc.country && (
                                  <span className="text-xs text-gray-400">{loc.country}</span>
                                )}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-5 py-6 text-center text-sm text-gray-400">
                            No locations found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={() => setLocationOpen(false)}
                  className="w-full sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center gap-2 shrink-0 sm:ml-4 transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/30"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="text-white font-semibold text-sm sm:hidden">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Active:</span>
              {searchLocation && (
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-100">
                  📍 {searchLocation}
                  <button onClick={() => setSearchLocation("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedTypes.map((id) => {
                const type = travelTypes.find((t) => t._id === id);
                return type ? (
                  <span key={id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                    {type.name}
                    <button onClick={() => toggleType(id)}><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              <button onClick={clearAllFilters} className="text-xs font-medium text-gray-500 hover:text-red-500 ml-2">
                Clear all ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-[88px] bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <FilterSidebar />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchLocation ? `Packages in "${searchLocation}"` : "All Packages"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-semibold text-gray-700">{filteredPackages.length}</span>{" "}
                    {filteredPackages.length === 1 ? "package" : "packages"} found
                  </p>
                </div>
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-orange-400 relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {selectedTypes.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {selectedTypes.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Sort Bar */}
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-3 mb-6 shadow-sm text-sm">
                <span className="font-medium text-gray-700">Sort:</span>
                {[
                  { value: "recommended", label: "Recommended" },
                  { value: "price-low", label: "Price ↑" },
                  { value: "price-high", label: "Price ↓" },
                  { value: "rating", label: "Rating" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      sortBy === opt.value
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Package List */}
              {loading ? (
                <div className="text-center py-20 text-gray-400">Loading packages...</div>
              ) : filteredPackages.length > 0 ? (
                <div className="space-y-5">
                  {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg._id} pkg={pkg} liked={liked} toggleLike={toggleLike} getImageUrl={getImageUrl} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-7 h-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
                  <button onClick={clearAllFilters} className="text-sm font-medium text-orange-600 hover:text-orange-700">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden">
              <div className="shrink-0 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FilterSidebar />
              </div>
              <div className="shrink-0 border-t border-gray-100 px-5 py-4">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold py-3 rounded-xl"
                >
                  Show {filteredPackages.length} results
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

// Price Range Slider Component
function PriceRangeSlider({
  priceRange,
  setPriceRange,
  min: MIN,
  max: MAX,
}: {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  min: number;
  max: number;
}) {
  const STEP = 1000;
  const GAP = 2000;

  // Local state for instant thumb feedback
  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when parent resets (e.g., clear all filters)
  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange]);

  const debouncedUpdate = (min: number, max: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPriceRange([min, max]);
    }, 300);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), localMax - GAP);
    setLocalMin(val);
    debouncedUpdate(val, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), localMin + GAP);
    setLocalMax(val);
    debouncedUpdate(localMin, val);
  };

  const minPercent = ((localMin - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((localMax - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
      <div className="bg-orange-50/50 border border-orange-100 rounded-xl px-3 py-2 mb-4 text-center">
        <span className="text-sm font-semibold text-gray-800">
          ₹{localMin.toLocaleString("en-IN")} – ₹{localMax.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="range-slider-container">
        {/* Track */}
        <div className="range-slider-track">
          <div
            className="range-slider-active"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
        </div>

        {/* Min Input */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={localMin}
          onChange={handleMinChange}
          aria-label="Minimum budget"
          className="range-slider-input"
        />

        {/* Max Input */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={localMax}
          onChange={handleMaxChange}
          aria-label="Maximum budget"
          className="range-slider-input"
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
        <span>₹{MIN.toLocaleString("en-IN")}</span>
        <span>₹{MAX.toLocaleString("en-IN")}</span>
      </div>

      <style>{`
        .range-slider-container {
          position: relative;
          width: 100%;
          height: 40px;
        }
        .range-slider-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 6px;
          transform: translateY(-50%);
          background: #e5e7eb;
          border-radius: 999px;
          pointer-events: none;
        }
        .range-slider-active {
          position: absolute;
          top: 0;
          bottom: 0;
          background: linear-gradient(90deg, #fb923c, #f43f5e);
          border-radius: 999px;
        }
        .range-slider-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
          margin: 0;
          padding: 0;
        }
        .range-slider-input:focus {
          outline: none;
        }
        .range-slider-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          background: transparent;
          border: none;
        }
        .range-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #f97316;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          cursor: grab;
          pointer-events: auto;
          margin-top: -8px;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .range-slider-input::-webkit-slider-thumb:hover {
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
          transform: scale(1.1);
        }
        .range-slider-input::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
          box-shadow: 0 3px 10px rgba(249, 115, 22, 0.5);
        }
        .range-slider-input:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
        }
        .range-slider-input::-moz-range-track {
          width: 100%;
          height: 6px;
          background: transparent;
          border: none;
        }
        .range-slider-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #f97316;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          cursor: grab;
          pointer-events: auto;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .range-slider-input::-moz-range-thumb:hover {
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.4);
          transform: scale(1.1);
        }
        .range-slider-input::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
          box-shadow: 0 3px 10px rgba(249, 115, 22, 0.5);
        }
        .range-slider-input:focus::-moz-range-thumb {
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
        }
      `}</style>
    </div>
  );
}

// Package Card Component
function PackageCard({
  pkg,
  liked,
  toggleLike,
  getImageUrl,
}: {
  pkg: PackageItem;
  liked: string[];
  toggleLike: (id: string) => void;
  getImageUrl: (images: string[]) => string;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const images = pkg.images && pkg.images.length > 0 ? pkg.images : [];
  const maxImages = images.slice(0, 5);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) {
      // Swipe left - next image
      setCurrentImage((prev) => (prev === maxImages.length - 1 ? 0 : prev + 1));
    } else if (diff < -threshold) {
      // Swipe right - previous image
      setCurrentImage((prev) => (prev === 0 ? maxImages.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-slide
  useEffect(() => {
    if (maxImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === maxImages.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxImages.length]);

  const getSingleImageUrl = (img: string) => {
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? maxImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === maxImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Image carousel - clean, no overlays */}
        <div
          className="relative sm:w-[320px] h-56 sm:h-auto sm:min-h-[240px] shrink-0 overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {maxImages.length > 0 ? (
            <img
              src={getSingleImageUrl(maxImages[currentImage])}
              alt={`${pkg.title} - ${currentImage + 1}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"
              alt={pkg.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}

          {/* Navigation arrows */}
          {maxImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {maxImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImage ? "bg-white w-3" : "bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          {/* Tags moved here */}
          <div className="flex items-center gap-2 mb-2">
            {pkg.travelType?.name && (
              <span className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {pkg.travelType.name}
              </span>
            )}
            {pkg.isFeatured && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {pkg.location?.name}, {pkg.country?.name}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {pkg.title}
              </h3>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {pkg.duration?.days}D / {pkg.duration?.nights}N
            </span>
            {pkg.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-gray-700">{pkg.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Highlights */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {pkg.highlights.slice(0, 4).map((f) => (
                <span key={f} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Price & CTA */}
          <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between border-t border-gray-100 mt-5">
            <div>
              {Number(pkg.strikePrice) > 0 && Number(pkg.strikePrice) > pkg.price && (
                <div className="text-xs text-gray-400 line-through">₹{pkg.strikePrice!.toLocaleString()}</div>
              )}
              <div className="text-2xl font-bold text-gray-900">
                ₹{pkg.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 ml-1">/person</span>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex-1 sm:flex-none border border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
              >
                {showMore ? "Less Details" : "More Details"}
              </button>
              <Link
                href={`/packages/${encodeURIComponent((pkg.country?.name || "package").toLowerCase().replace(/\s+/g, "-"))}/${pkg.slug || pkg._id}`}
                className="flex-1 sm:flex-none text-center bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-md shadow-orange-500/20"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details section */}
      {showMore && (
        <div className="border-t border-gray-100 px-5 sm:px-6 py-4 bg-gray-50/50">
          {pkg.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{pkg.description}</p>
          )}
          {pkg.amenities && pkg.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {pkg.amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
          {pkg.highlights && pkg.highlights.length > 4 && (
            <div className="mt-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">All Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {pkg.highlights.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-2.5 py-1.5 rounded-lg">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
