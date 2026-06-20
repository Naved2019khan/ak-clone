"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Globe,
  Shield,
  Plane,
  Compass,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const STORAGE_KEY = "voyagearc_selected_location";

export default function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);

  // API data
  const [locations, setLocations] = useState<{ name: string; country: string; emoji: string }[]>([]);
  const [travelTypes, setTravelTypes] = useState<{ label: string; emoji: string }[]>([]);

  // Fetch locations and travel types from backend
  useEffect(() => {
    const fetchData = async () => {
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
              emoji: "📍",
            }))
          );
        }

        if (typeData.success && typeData.data) {
          setTravelTypes(
            typeData.data.map((t: { name: string }) => ({
              label: t.name,
              emoji: "✈️",
            }))
          );
        }
      } catch {
        // Silently fail — dropdowns will just be empty
      }
    };
    fetchData();
  }, []);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const guestsDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setDestination(saved);
      setLocationQuery(saved);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(e.target as Node)) {
        setGuestsDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns when search bar scrolls out of view
  useEffect(() => {
    if (!searchBarRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setLocationDropdownOpen(false);
          setGuestsDropdownOpen(false);
          setCalendarOpen(false);
          setDropdownOpen(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(searchBarRef.current);
    return () => observer.disconnect();
  }, []);

  // Track whether user is actively typing to filter
  const [isSearching, setIsSearching] = useState(false);

  const filteredLocations = isSearching && locationQuery
    ? locations.filter((loc) =>
        loc.name.toLowerCase().includes(locationQuery.toLowerCase()) ||
        loc.country.toLowerCase().includes(locationQuery.toLowerCase())
      )
    : locations;

  const handleSelectLocation = (locationName: string) => {
    setDestination(locationName);
    setLocationQuery(locationName);
    setLocationDropdownOpen(false);
    setIsSearching(false);
    localStorage.setItem(STORAGE_KEY, locationName);
  };

  const handleLocationInputChange = (value: string) => {
    setLocationQuery(value);
    setDestination(value);
    setIsSearching(true);
    setLocationDropdownOpen(true);
    if (!value) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleLocationFocus = () => {
    setLocationDropdownOpen(true);
    setIsSearching(false);
    setGuestsDropdownOpen(false);
    setDropdownOpen(false);
    setCalendarOpen(false);
  };

  const handleLocationBlur = () => {
    // Small delay to allow click on dropdown item to register first
    setTimeout(() => {
      const isValid = locations.some(
        (loc) => loc.name.toLowerCase() === locationQuery.toLowerCase()
      );
      if (!isValid) {
        // Revert to previously saved valid value, or clear
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setDestination(saved);
          setLocationQuery(saved);
        } else {
          setDestination("");
          setLocationQuery("");
        }
      }
      setIsSearching(false);
    }, 200);
  };

  const MAX_GUESTS = 50;

  const incrementGuests = () => {
    setGuests((prev) => Math.min(prev + 1, MAX_GUESTS));
  };

  const decrementGuests = () => {
    setGuests((prev) => Math.max(prev - 1, 0));
  };

  const handleGuestsInput = (value: string) => {
    // Only allow numeric input
    const numeric = value.replace(/\D/g, "");
    const num = parseInt(numeric, 10);
    if (numeric === "") {
      setGuests(0);
    } else if (num > MAX_GUESTS) {
      setGuests(MAX_GUESTS);
    } else {
      setGuests(num);
    }
  };

  // Calendar helpers
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const isDateDisabled = (d: Date) => {
    const check = new Date(d);
    check.setHours(0, 0, 0, 0);
    return check < today || check > maxDate;
  };

  const isDateSelected = (d: Date) => {
    if (!selectedDate) return false;
    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  };

  const isToday = (d: Date) => {
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const formatDate = (d: Date) => {
    return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleDateSelect = (d: Date) => {
    if (isDateDisabled(d)) return;
    setSelectedDate(d);
    setDate(formatDate(d));
    setCalendarOpen(false);
  };

  const calendarPrevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const calendarNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const canGoPrev = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const secondMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  const canGoNext = secondMonth < maxDate;

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const rows: (Date | null)[][] = [];
    let currentRow: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      currentRow.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      currentRow.push(new Date(year, month, day));
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
    if (currentRow.length > 0) {
      while (currentRow.length < 7) currentRow.push(null);
      rows.push(currentRow);
    }
    return rows;
  };

  return (
    <section className="relative w-full bg-[#fafafa] overflow-x-clip">
      {/* Subtle background mesh */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-orange-100/50 via-rose-50/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50/40 to-transparent rounded-full blur-3xl" />

      {/* ── Main Content Grid ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Text Content ── */}
          <div className="space-y-6">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-1.5 shadow-sm">
              <Plane className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                #1 Travel Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-tight">
              Discover Your Next{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
              Explore breathtaking destinations worldwide. From serene beaches to
              majestic mountains, we craft unforgettable travel experiences
              tailored to your dreams.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div>
                <p className="text-2xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-500">Destinations</p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-500">Happy Travelers</p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-2xl font-bold text-gray-900">4.9</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  Rating
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                <Globe className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Worldwide Trips</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">Secure Booking</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                <Star className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-gray-700">Best Price Guarantee</span>
              </div>
            </div>
          </div>

          {/* ── Right: Image Section ── */}
          <div className="relative flex justify-end">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-h-[560px] w-full max-w-md ml-auto ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85"
                alt="Majestic mountain landscape"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-orange-900/5" />

              {/* Floating card on image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Swiss Alps, Switzerland
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      7 days guided tour
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">$1,299</p>
                    <p className="text-xs text-gray-400">per person</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-orange-200/50 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-rose-200/40 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* ── Search Bar Section ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20" ref={searchBarRef}>
        {/* Gradient border wrapper */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400 shadow-2xl shadow-orange-200/30">

          <div className="bg-white rounded-[14px] flex flex-col md:flex-row md:items-center py-4 md:py-5 px-5 md:px-8 gap-3 md:gap-0 overflow-visible">
            {/* Location with dropdown */}
            <div className="relative flex items-center gap-3 flex-1 px-2 md:px-4 py-2 md:py-0 border-b md:border-b-0 border-gray-100" ref={locationDropdownRef}>
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs md:text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Location</p>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={handleLocationFocus}
                  onBlur={handleLocationBlur}
                  placeholder="Where are you going?"
                  className="text-sm font-bold text-gray-900 placeholder-gray-400 outline-none bg-transparent w-full"
                  aria-label="Location"
                />
              </div>

              {/* Location Dropdown */}
              <div
                onMouseDown={(e) => {
                  // Prevent blur on the location input so dropdown stays open
                  e.preventDefault();
                }}
                className={`absolute top-full left-0 mt-3 w-full md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 transition-all duration-200 origin-top ${
                  locationDropdownOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                }`}
              >
                {/* Recent selection indicator */}
                {destination && !locationQuery && (
                  <div className="px-5 py-3 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Last selected
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectLocation(destination)}
                      className="mt-1.5 text-sm text-orange-600 font-medium hover:underline"
                    >
                      {destination}
                    </button>
                  </div>
                )}

                {/* Scrollable list */}
                <div className="max-h-72 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => handleSelectLocation(loc.name)}
                        className={`w-full flex items-center gap-4 px-5 py-3 text-sm transition-colors ${
                          destination === loc.name
                            ? "bg-orange-50 text-orange-600 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-lg">{loc.emoji}</span>
                        <div className="text-left">
                          <span className="block font-medium">{loc.name}</span>
                          <span className="text-xs text-gray-400">{loc.country}</span>
                        </div>
                        {destination === loc.name && (
                          <span className="ml-auto text-orange-500 text-sm">✓</span>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center text-sm text-gray-400">
                      No locations found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Travellers */}
            <div className="relative flex items-center gap-3 flex-1 px-2 md:px-4 py-2 md:py-0 border-b md:border-b-0 border-gray-100" ref={guestsDropdownRef}>
              <Users className="w-5 h-5 md:w-6 md:h-6 text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs md:text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Travellers</p>
                <button
                  type="button"
                  onClick={() => {
                    setGuestsDropdownOpen(!guestsDropdownOpen);
                    setLocationDropdownOpen(false);
                    setDropdownOpen(false);
                    setCalendarOpen(false);
                  }}
                  className="text-sm font-bold text-left w-full outline-none bg-transparent"
                >
                  <span className={guests > 0 ? "text-gray-900" : "text-gray-400"}>
                    {guests > 0 ? `${guests} Guest${guests > 1 ? "s" : ""}` : "Add guests"}
                  </span>
                </button>
              </div>

              {/* Guests Dropdown */}
              <div
                className={`absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 z-50 transition-all duration-200 origin-top ${
                  guestsDropdownOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Number of Guests</p>
                    <p className="text-xs text-gray-500 mt-0.5">Max 50 guests allowed</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <button
                    type="button"
                    onClick={decrementGuests}
                    disabled={guests <= 0}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 shadow-sm"
                    aria-label="Decrease guests"
                  >
                    −
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={guests === 0 ? "" : String(guests)}
                    onChange={(e) => handleGuestsInput(e.target.value)}
                    placeholder="0"
                    className="w-16 text-center text-xl font-bold text-gray-900 placeholder-gray-300 outline-none bg-transparent"
                    aria-label="Number of guests"
                  />

                  <button
                    type="button"
                    onClick={incrementGuests}
                    disabled={guests >= MAX_GUESTS}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600 shadow-sm"
                    aria-label="Increase guests"
                  >
                    +
                  </button>
                </div>

                {guests >= MAX_GUESTS && (
                  <p className="text-xs text-rose-500 font-medium mt-3 text-center">
                    Maximum limit of 50 guests reached
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setGuestsDropdownOpen(false)}
                  className="w-full mt-4 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg py-2.5 hover:from-orange-600 hover:to-rose-600 transition-all"
                >
                  Done
                </button>
              </div>
            </div>

            {/* Check in */}
            <div className="relative flex items-center gap-3 flex-1 px-2 md:px-4 py-2 md:py-0 border-b md:border-b-0 border-gray-100" ref={calendarRef}>
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs md:text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Check in</p>
                <button
                  type="button"
                  onClick={() => {
                    setCalendarOpen(!calendarOpen);
                    setGuestsDropdownOpen(false);
                    setLocationDropdownOpen(false);
                    setDropdownOpen(false);
                  }}
                  className="text-sm font-bold text-left w-full outline-none bg-transparent"
                >
                  <span className={date ? "text-gray-900" : "text-gray-400"}>
                    {date || "Add date"}
                  </span>
                </button>
              </div>

              {/* Calendar Dropdown */}
              <div
                className={`absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 md:p-5 z-50 transition-all duration-200 origin-top w-[calc(100vw-3rem)] md:w-[580px] ${
                  calendarOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                }`}
              >
                {/* Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={calendarPrevMonth}
                    disabled={!canGoPrev}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="flex gap-12">
                    <span className="text-sm font-bold text-gray-900">
                      {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {MONTH_NAMES[secondMonth.getMonth()]} {secondMonth.getFullYear()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={calendarNextMonth}
                    disabled={!canGoNext}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Two month grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First month */}
                  <div>
                    <div className="grid grid-cols-7 mb-2">
                      {WEEKDAYS.map((d) => (
                        <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {renderMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()).flat().map((cell, idx) => (
                        <div key={idx} className="flex items-center justify-center py-1">
                          {cell ? (
                            <button
                              type="button"
                              onClick={() => handleDateSelect(cell)}
                              disabled={isDateDisabled(cell)}
                              className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                                isDateSelected(cell)
                                  ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md"
                                  : isToday(cell)
                                  ? "ring-2 ring-orange-300 text-gray-900 hover:bg-orange-50"
                                  : isDateDisabled(cell)
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {cell.getDate()}
                            </button>
                          ) : (
                            <span className="w-9 h-9" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Second month */}
                  <div>
                    <div className="grid grid-cols-7 mb-2">
                      {WEEKDAYS.map((d) => (
                        <div key={`${d}-2`} className="text-center text-xs font-semibold text-gray-400 py-1">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7">
                      {renderMonth(secondMonth.getFullYear(), secondMonth.getMonth()).flat().map((cell, idx) => (
                        <div key={idx} className="flex items-center justify-center py-1">
                          {cell ? (
                            <button
                              type="button"
                              onClick={() => handleDateSelect(cell)}
                              disabled={isDateDisabled(cell)}
                              className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                                isDateSelected(cell)
                                  ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md"
                                  : isToday(cell)
                                  ? "ring-2 ring-orange-300 text-gray-900 hover:bg-orange-50"
                                  : isDateDisabled(cell)
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {cell.getDate()}
                            </button>
                          ) : (
                            <span className="w-9 h-9" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer hint */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">Select your check-in date</p>
                  {selectedDate && (
                    <p className="text-xs font-semibold text-orange-600">
                      {formatDate(selectedDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Travel Type */}
            <div className="relative flex items-center gap-3 flex-1 px-2 md:px-4 py-2 md:py-0" ref={dropdownRef}>
              <Compass className="w-5 h-5 md:w-6 md:h-6 text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs md:text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Travel Type</p>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setLocationDropdownOpen(false);
                    setGuestsDropdownOpen(false);
                    setCalendarOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-sm font-bold outline-none bg-transparent"
                >
                  <span className={travelType ? "text-gray-900" : "text-gray-400"}>
                    {travelType || "Select type"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {travelTypes.map((type) => (
                    <button
                      key={type.label}
                      type="button"
                      onClick={() => {
                        setTravelType(type.label);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 text-sm transition-colors ${
                        travelType === type.label
                          ? "bg-orange-50 text-orange-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{type.emoji}</span>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search button */}
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (destination) params.set("location", destination);
                if (travelType) params.set("type", travelType);
                if (guests > 0) params.set("guests", String(guests));
                if (date) params.set("date", date);
                router.push(`/packages/search${params.toString() ? `?${params.toString()}` : ""}`);
              }}
              className="w-full md:w-14 h-12 md:h-14 rounded-xl flex items-center justify-center shrink-0 md:ml-4 transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/30"
              aria-label="Search"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
