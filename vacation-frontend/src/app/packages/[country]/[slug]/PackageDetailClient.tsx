"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Clock, Star, CheckCircle, MapPin, Calendar,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Phone, Mail, User,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

interface PackageData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  country: { _id: string; name: string; code: string };
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  strikePrice: number;
  duration: { days: number; nights: number };
  highlights: string[];
  amenities: string[];
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  isFeatured: boolean;
}

export default function PackageDetailClient({ slug, country }: { slug: string; country: string }) {
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", travelers: 2, travelDate: "", specialRequests: "", duration: "3D/2N",
  });
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [durationOpen, setDurationOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  const MAX_TRAVELERS = 50;
  const [travelersInput, setTravelersInput] = useState(String(formData.travelers));
  const incrementTravelers = () => setFormData((prev) => { const next = Math.min(prev.travelers + 1, MAX_TRAVELERS); setTravelersInput(String(next)); return { ...prev, travelers: next }; });
  const decrementTravelers = () => setFormData((prev) => { const next = Math.max(prev.travelers - 1, 1); setTravelersInput(String(next)); return { ...prev, travelers: next }; });
  const handleTravelersInput = (val: string) => {
    // Allow only digits
    const cleaned = val.replace(/[^0-9]/g, "");
    setTravelersInput(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= 1 && num <= MAX_TRAVELERS) {
      setFormData((prev) => ({ ...prev, travelers: num }));
    }
  };
  const handleTravelersBlur = () => {
    const num = parseInt(travelersInput, 10);
    if (isNaN(num) || num < 1) {
      setFormData((prev) => ({ ...prev, travelers: 1 }));
      setTravelersInput("1");
    } else if (num > MAX_TRAVELERS) {
      setFormData((prev) => ({ ...prev, travelers: MAX_TRAVELERS }));
      setTravelersInput(String(MAX_TRAVELERS));
    } else {
      setTravelersInput(String(num));
    }
  };

  const durationOptions = [
    { label: "1 Day / 0 Night", value: "1D/0N" },
    { label: "2 Days / 1 Night", value: "2D/1N" },
    { label: "3 Days / 2 Nights", value: "3D/2N" },
    { label: "4 Days / 3 Nights", value: "4D/3N" },
    { label: "5 Days / 4 Nights", value: "5D/4N" },
    { label: "6 Days / 5 Nights", value: "6D/5N" },
    { label: "7 Days / 6 Nights", value: "7D/6N" },
    { label: "8 Days / 7 Nights", value: "8D/7N" },
    { label: "9 Days / 8 Nights", value: "9D/8N" },
    { label: "10 Days / 9 Nights", value: "10D/9N" },
    { label: "10+ Days", value: "10+D" },
  ];

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${API_URL}/packages/slug/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setPkg(data.data);
        }
      } catch {}
      setLoading(false);
    };
    fetchPackage();
  }, [slug]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
      if (durationRef.current && !durationRef.current.contains(e.target as Node)) {
        setDurationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const today = new Date(); today.setHours(0,0,0,0);
  const maxDate = new Date(); maxDate.setFullYear(maxDate.getFullYear() + 1);
  const isDateDisabled = (d: Date) => { const c = new Date(d); c.setHours(0,0,0,0); return c < today || c > maxDate; };
  const isDateSelected = (d: Date) => selectedDate ? d.getFullYear()===selectedDate.getFullYear()&&d.getMonth()===selectedDate.getMonth()&&d.getDate()===selectedDate.getDate() : false;
  const isToday = (d: Date) => d.getFullYear()===today.getFullYear()&&d.getMonth()===today.getMonth()&&d.getDate()===today.getDate();
  const formatDate = (d: Date) => `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}`;
  const handleDateSelect = (d: Date) => { if(isDateDisabled(d)) return; setSelectedDate(d); setFormData({...formData, travelDate: formatDate(d)}); setCalendarOpen(false); };
  const getDaysInMonth = (y: number, m: number) => new Date(y, m+1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
  const canGoPrev = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1) > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1) < maxDate;

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const rows: (Date | null)[][] = [];
    let currentRow: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) currentRow.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      currentRow.push(new Date(year, month, day));
      if (currentRow.length === 7) { rows.push(currentRow); currentRow = []; }
    }
    if (currentRow.length > 0) { while (currentRow.length < 7) currentRow.push(null); rows.push(currentRow); }
    return rows;
  };

  const getImageUrl = (img: string) => img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = formData.phone.replace(/[^0-9]/g, "");
    if (digits.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      return;
    }
    if (digits.length > 12) {
      setPhoneError("Phone number too long");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: pkg?._id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          travelers: formData.travelers,
          duration: formData.duration,
          travelDate: formData.travelDate,
          specialRequests: formData.specialRequests,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "phone") {
      const digits = value.replace(/[^0-9]/g, "");
      if (digits.length < 10) {
        setPhoneError("Phone number must be at least 10 digits");
      } else if (digits.length > 12) {
        setPhoneError("Phone number too long");
      } else {
        setPhoneError("");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading package...</div>;
  }

  if (!pkg) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Package Not Found</h1>
        <p className="text-gray-500">The requested package does not exist.</p>
        <Link href="/packages/search" className="text-orange-600 font-medium mt-4 inline-block hover:underline">
          Browse all packages →
        </Link>
      </div>
    );
  }

  const images = pkg.images?.length > 0 ? pkg.images.map(getImageUrl) : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=85"];
  const discount = pkg.strikePrice > pkg.price ? Math.round(((pkg.strikePrice - pkg.price) / pkg.strikePrice) * 100) : 0;

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6 pb-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href="/packages/search" className="text-gray-500 hover:text-orange-600 transition-colors">Packages</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href={`/packages/search?location=${encodeURIComponent(pkg.country?.name || "")}`} className="text-gray-500 hover:text-orange-600 transition-colors">{pkg.country?.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-900 font-medium">{pkg.title}</span>
        </nav>
      </div>

      {/* Title & Meta */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          {pkg.isFeatured && (
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md shadow-amber-500/25">
              <Star className="w-3.5 h-3.5 fill-white" />
              Featured
            </span>
          )}
          <span className="text-orange-600 text-sm uppercase tracking-wider font-semibold">{pkg.travelType?.name}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">{pkg.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {pkg.location?.name}, {pkg.country?.name}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pkg.duration?.days}D / {pkg.duration?.nights}N</span>
        </div>
      </div>

      {/* Image Gallery + Price Card */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100 w-full aspect-[4/3]">
                <img src={images[selectedImage]} alt={pkg.title} className="w-full h-full object-cover transition-all duration-300" />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
                <button onClick={() => setSelectedImage((p) => (p === 0 ? images.length - 1 : p - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <button onClick={() => setSelectedImage((p) => (p === images.length - 1 ? 0 : p + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)} className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all border-2 ${selectedImage === idx ? "border-orange-500 opacity-100 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-gray-900">₹{pkg.price.toLocaleString()}</span>
                {pkg.strikePrice > 0 && pkg.strikePrice > pkg.price && (
                  <span className="text-lg text-gray-400 line-through">₹{pkg.strikePrice.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">per person</p>
              {discount > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                  🔥 Save ₹{(pkg.strikePrice - pkg.price).toLocaleString()} ({discount}% OFF)
                </div>
              )}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm"><Clock className="w-4 h-4 text-orange-500" /><span className="text-gray-700">{pkg.duration?.days}D / {pkg.duration?.nights}N</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="w-4 h-4 text-orange-500" /><span className="text-gray-700">{pkg.location?.name}, {pkg.country?.name}</span></div>
              </div>
              {pkg.highlights?.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  {pkg.highlights.slice(0, 5).map((h) => (
                    <div key={h} className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /><span className="text-sm text-gray-600">{h}</span></div>
                  ))}
                </div>
              )}
              <a href="#booking" className="block w-full mt-6 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-sm text-center py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
              <p className="text-gray-600 leading-relaxed text-base">{pkg.description}</p>
              {pkg.amenities?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pkg.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inclusions & Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pkg.inclusions?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-green-700 mb-3">Inclusions</h3>
                      <ul className="space-y-2">
                        {pkg.inclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pkg.exclusions?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-red-700 mb-3">Exclusions</h3>
                      <ul className="space-y-2">
                        {pkg.exclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-red-500 text-xs font-bold">✗</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
                    <p className="text-sm text-gray-500">{pkg.itinerary.length} days of adventure</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {pkg.itinerary.map((item) => (
                    <div key={item.day} className={`border rounded-xl overflow-hidden transition-all ${expandedDay === item.day ? "border-orange-200 bg-orange-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
                      <button onClick={() => setExpandedDay(expandedDay === item.day ? null : item.day)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                        <div className="flex items-center gap-4">
                          <span className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-sm font-bold rounded-lg flex items-center justify-center shrink-0">{item.day}</span>
                          <span className="font-semibold text-gray-900">{item.title}</span>
                        </div>
                        {expandedDay === item.day ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </button>
                      {expandedDay === item.day && (
                        <div className="px-5 pb-4 pl-[4.5rem]">
                          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                          {item.activities && item.activities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.activities.map((act, i) => (
                                <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg">{act}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1 pb-80" id="booking">
            <div className="sticky top-28 overflow-visible">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-visible">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Book This Package</h3>
                <p className="text-sm text-gray-500 mb-5">Fill in your details and we&apos;ll get back to you within 24 hours.</p>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h4>
                    <p className="text-sm text-gray-500">Thank you, {formData.fullName}! Our travel expert will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 overflow-visible">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 ${phoneError ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-orange-400 focus:ring-orange-100"}`} />
                      </div>
                      {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Travelers</label>
                        <div className="flex items-center justify-between border border-gray-200 rounded-xl px-2 h-[42px]">
                          <button
                            type="button"
                            onClick={decrementTravelers}
                            disabled={formData.travelers <= 1}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-base font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-50 border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
                            aria-label="Decrease travelers"
                          >
                            −
                          </button>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={travelersInput}
                            onChange={(e) => handleTravelersInput(e.target.value)}
                            onBlur={handleTravelersBlur}
                            className="w-10 text-center text-sm font-bold text-gray-900 outline-none bg-transparent"
                            aria-label="Number of travelers"
                          />
                          <button
                            type="button"
                            onClick={incrementTravelers}
                            disabled={formData.travelers >= MAX_TRAVELERS}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-base font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600"
                            aria-label="Increase travelers"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div ref={durationRef} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                        <button
                          type="button"
                          onClick={() => setDurationOpen(!durationOpen)}
                          className="w-full flex items-center justify-between pl-3 pr-3 h-[42px] border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-left bg-white"
                        >
                          <span className="text-gray-900 font-medium">{formData.duration}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${durationOpen ? "rotate-180" : ""}`} />
                        </button>
                        {durationOpen && (
                          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 max-h-52 overflow-y-auto">
                            {durationOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setFormData({ ...formData, duration: opt.value }); setDurationOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                  formData.duration === opt.value
                                    ? "bg-orange-50 text-orange-600 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                {opt.label}
                                {formData.duration === opt.value && <span className="float-right text-orange-500">✓</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div ref={calendarRef} className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Travel Date</label>
                      <button type="button" onClick={() => setCalendarOpen(!calendarOpen)} className="w-full flex items-center gap-2 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-left relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <span className={formData.travelDate ? "text-gray-900 font-medium" : "text-gray-400"}>{formData.travelDate || "Select date"}</span>
                      </button>
                        {calendarOpen && (
                          <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 w-[280px]">
                            <div className="flex items-center justify-between mb-3">
                              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()-1, 1))} disabled={!canGoPrev} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                              <span className="text-sm font-bold text-gray-900">{MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
                              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1))} disabled={!canGoNext} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-7 mb-1">{WEEKDAYS.map((d) => <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-1">{d}</div>)}</div>
                            <div className="grid grid-cols-7">
                              {renderMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()).flat().map((cell, idx) => (
                                <div key={idx} className="flex items-center justify-center py-0.5">
                                  {cell ? (
                                    <button type="button" onClick={() => handleDateSelect(cell)} disabled={isDateDisabled(cell)} className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${isDateSelected(cell) ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md" : isToday(cell) ? "ring-2 ring-orange-300 text-gray-900" : isDateDisabled(cell) ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}>{cell.getDate()}</button>
                                  ) : <span className="w-8 h-8" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Requests <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea name="specialRequests" rows={3} value={formData.specialRequests} onChange={handleChange} placeholder="Any special requirements..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none" />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                      Request Booking
                    </button>
                    <p className="text-xs text-gray-400 text-center">No payment required now. We&apos;ll confirm availability first.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
