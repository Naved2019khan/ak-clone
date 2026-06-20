"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Users, Star, ArrowRight, Zap, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5000/api";

interface FeaturedPackage {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  country: { _id: string; name: string; code: string };
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  duration: { days: number; nights: number };
  highlights: string[];
  amenities: string[];
  images: string[];
  isFeatured: boolean;
}

export default function PackagesSection() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [packages, setPackages] = useState<FeaturedPackage[]>([]);

  // Fetch featured packages from API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/settings/featured-packages`);
        const data = await res.json();
        if (data.success && data.data.packages) {
          setPackages(data.data.packages);
        }
      } catch {
        // silently fail
      }
    };
    fetchFeatured();
  }, []);

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
  }, [packages]);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector("article");
    const cardWidth = card ? card.offsetWidth + 32 : sliderRef.current.clientWidth * 0.7;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const getImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&q=85";
    const img = images[0];
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  if (packages.length === 0) return null;

  return (
    <section className="py-28 bg-[#fafafa] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-rose-50/50 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-5 py-2 mb-5 shadow-sm">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Limited Time Deals
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              Featured{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Packages
              </span>
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-md">
              Exclusive deals handcrafted for unforgettable experiences
            </p>
          </div>
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
        </div>

        {/* Cards Slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide snap-x pt-4 pb-8 -mt-4"
        >
          {packages.map((pkg, index) => (
            <article
              key={pkg._id}
              className="group relative bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl shrink-0 w-[80vw] sm:w-[70vw] md:w-[520px] lg:w-[560px] snap-start"
            >
              {/* Popular ribbon for first item */}
              {index === 0 && (
                <div className="absolute top-7 -right-8 z-20 rotate-45">
                  <span className="block bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-10 py-1.5 shadow-lg">
                    Featured
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative sm:w-[42%] h-56 sm:h-auto sm:min-h-[280px] overflow-hidden">
                  <img
                    src={getImageUrl(pkg.images)}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 sm:top-5 sm:left-5 bg-orange-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg">
                    {pkg.travelType?.name || "Package"}
                  </div>
                </div>

                {/* Content */}
                <div className="sm:w-[58%] p-5 sm:p-7 lg:p-9 flex flex-col justify-between">
                  <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{pkg.location?.name}, {pkg.country?.name}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 font-bold text-lg sm:text-2xl mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors">
                      {pkg.title}
                    </h3>

                    {/* Meta pills */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                      <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs sm:text-sm font-medium px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-100">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" /> {pkg.duration?.days}D / {pkg.duration?.nights}N
                      </span>
                    </div>

                    {/* Highlights */}
                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
                        {pkg.highlights.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="text-[10px] sm:text-xs font-medium text-gray-600 bg-orange-50/80 border border-orange-100/60 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-end justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-400 block mb-1">starting from</span>
                      <span className="text-xl sm:text-2xl font-black text-gray-900 leading-none block">
                        ₹{pkg.price.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/packages/${encodeURIComponent((pkg.country?.name || "package").toLowerCase().replace(/\s+/g, "-"))}/${pkg.slug || pkg._id}`}
                      className="font-bold text-xs sm:text-sm px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap shrink-0 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-md shadow-orange-500/20"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/packages/search"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors group/link"
          >
            View all packages
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
