"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    trip: "Bali Escape Package",
    review:
      "Absolutely magical! VoyageArc organized every detail perfectly. From the airport pickup to the private villa — everything exceeded our expectations. We've already booked our next trip with them!",
    date: "March 2025",
  },
  {
    id: 2,
    name: "James Thornton",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    trip: "Europe Grand Tour",
    review:
      "The 14-day Europe tour was phenomenal. Our guide Marcus was incredibly knowledgeable and the hotels were all top-notch. I've traveled with many agencies, but VoyageArc is on a different level.",
    date: "February 2025",
  },
  {
    id: 3,
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    trip: "Maldives Luxury Stay",
    review:
      "The Maldives package was worth every penny. The overwater bungalow was breathtaking and the all-inclusive service was flawless. VoyageArc made our honeymoon absolutely unforgettable.",
    date: "January 2025",
  },
  {
    id: 4,
    name: "Carlos Rivera",
    location: "Madrid, Spain",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    rating: 4,
    trip: "Southeast Asia Explorer",
    review:
      "Great value for money! The Southeast Asia package took us through 4 countries in 12 days. Everything was well-organized and our local guides were fantastic. Will definitely book again.",
    date: "April 2025",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const featured = testimonials[current];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-50/50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-4">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Traveler{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            Real experiences from real travelers around the world
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Featured Testimonial */}
          <div className="flex-1 relative">
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-3xl p-8 md:p-10 relative border border-orange-100/50">
              <Quote className="w-12 h-12 text-orange-200 absolute top-6 right-8" />

              <div className="flex items-center gap-4 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.avatar}
                  alt={featured.name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{featured.name}</h4>
                  <p className="text-gray-500 text-sm">{featured.location}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: featured.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-orange-400 fill-orange-400"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                &ldquo;{featured.review}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 rounded-full px-3 py-1">
                    {featured.trip}
                  </span>
                  <p className="text-gray-400 text-xs mt-2">{featured.date}</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-500 hover:border-transparent hover:text-white text-gray-600 transition-all"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-500 hover:border-transparent hover:text-white text-gray-600 transition-all"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all ${
                    i === current
                      ? "w-6 h-2 bg-gradient-to-r from-orange-500 to-rose-500"
                      : "w-2 h-2 bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Side Cards */}
          <div className="lg:w-80 flex flex-col gap-5">
            {testimonials
              .filter((_, i) => i !== current)
              .slice(0, 3)
              .map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCurrent(testimonials.indexOf(t))}
                  className="bg-white hover:bg-orange-50/50 border border-gray-100 hover:border-orange-200 rounded-2xl p-5 text-left transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                        {t.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{t.trip}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{t.review}</p>
                </button>
              ))}

            {/* Stats */}
            <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-500/20">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: "2M+", label: "Happy Travelers" },
                  { value: "4.9", label: "Avg Rating" },
                  { value: "98%", label: "Satisfaction" },
                  { value: "15+", label: "Years Experience" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
