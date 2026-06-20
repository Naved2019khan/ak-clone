import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Clock, Users, Star, CheckCircle, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travel Packages — VoyageArc",
  description: "Browse all-inclusive travel packages for every budget and style.",
};

const allPackages = [
  {
    id: 1, name: "Bali Escape", type: "Romantic",
    image: "https://images.unsplash.com/photo-1559628233-100c798642d8?w=600&q=80",
    originalPrice: 1299, price: 899, duration: "7D / 6N", groupSize: "2", rating: 4.9, reviews: 342,
    features: ["5★ Resort", "Airport Transfers", "Daily Breakfast", "Spa Credit"],
    badge: "Best Seller", badgeColor: "bg-amber-500",
  },
  {
    id: 2, name: "Europe Grand Tour", type: "Cultural",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    originalPrice: 3499, price: 2799, duration: "14D / 13N", groupSize: "Up to 12", rating: 4.8, reviews: 218,
    features: ["8 Countries", "Guided Tours", "All Meals", "Rail Passes"],
    badge: "Top Rated", badgeColor: "bg-blue-500",
  },
  {
    id: 3, name: "Maldives Luxury", type: "Luxury",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80",
    originalPrice: 3999, price: 2999, duration: "6D / 5N", groupSize: "2", rating: 5.0, reviews: 156,
    features: ["Overwater Villa", "All-Inclusive", "Seaplane Transfer", "Snorkeling"],
    badge: "Premium", badgeColor: "bg-purple-600",
  },
  {
    id: 4, name: "SE Asia Explorer", type: "Adventure",
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80",
    originalPrice: 2199, price: 1599, duration: "12D / 11N", groupSize: "Up to 8", rating: 4.7, reviews: 287,
    features: ["4 Countries", "Boutique Hotels", "Activities", "Local Guide"],
    badge: "New", badgeColor: "bg-green-500",
  },
  {
    id: 5, name: "Japan Cherry Blossom", type: "Cultural",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80",
    originalPrice: 2499, price: 1999, duration: "10D / 9N", groupSize: "Up to 10", rating: 4.9, reviews: 198,
    features: ["Kyoto & Tokyo", "Ryokan Stay", "Tea Ceremony", "Rail Pass"],
    badge: "Seasonal", badgeColor: "bg-rose-500",
  },
  {
    id: 6, name: "African Safari", type: "Adventure",
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=600&q=80",
    originalPrice: 4999, price: 3799, duration: "8D / 7N", groupSize: "Up to 6", rating: 5.0, reviews: 124,
    features: ["Big 5 Game Drive", "Luxury Camp", "All Meals", "Expert Guide"],
    badge: "Exclusive", badgeColor: "bg-amber-600",
  },
  {
    id: 7, name: "Greek Island Hopping", type: "Leisure",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80",
    originalPrice: 2299, price: 1849, duration: "9D / 8N", groupSize: "2+", rating: 4.8, reviews: 315,
    features: ["5 Islands", "Ferry Passes", "Boutique Hotels", "Wine Tours"],
    badge: "Popular", badgeColor: "bg-sky-500",
  },
  {
    id: 8, name: "Peru & Machu Picchu", type: "Adventure",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80",
    originalPrice: 2799, price: 2199, duration: "10D / 9N", groupSize: "Up to 8", rating: 4.8, reviews: 173,
    features: ["Inca Trail Trek", "Cusco Stay", "Local Cuisine", "Expert Guide"],
    badge: "Top Rated", badgeColor: "bg-blue-500",
  },
];

const categories = ["All", "Romantic", "Cultural", "Luxury", "Adventure", "Leisure", "Family"];

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div
          className="relative h-64 bg-cover bg-center flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-violet-900/70" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Travel Packages
            </h1>
            <p className="text-white/80 text-lg">
              All-inclusive packages designed for every type of traveler
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
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
            <div className="flex gap-3 shrink-0">
              <select
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-blue-400"
                aria-label="Sort packages"
              >
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
                <option>Most Popular</option>
              </select>
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 hover:border-blue-400">
                <SlidersHorizontal className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>

          {/* Results Count + Search Link */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">
              Showing <span className="font-semibold text-gray-800">{allPackages.length}</span> packages
            </p>
            <Link
              href="/packages/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Search &amp; Filters
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPackages.map((pkg) => (
              <article
                key={pkg.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm card-hover group"
              >
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 gradient-overlay" />
                  <span className={`absolute top-2 left-2 ${pkg.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                    {pkg.badge}
                  </span>
                  {pkg.originalPrice > pkg.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Save ${(pkg.originalPrice - pkg.price).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-xs text-blue-600 font-semibold uppercase">{pkg.type}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-0.5 mb-2 group-hover:text-blue-600 transition-colors">
                    {pkg.name}
                  </h3>

                  <div className="flex gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {pkg.groupSize}
                    </span>
                  </div>

                  <ul className="space-y-1 mb-3">
                    {pkg.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <div className="text-xs text-gray-400 line-through">${pkg.originalPrice.toLocaleString()}</div>
                        <div className="text-xl font-bold text-gray-900">
                          ${pkg.price.toLocaleString()}
                          <span className="text-xs font-normal text-gray-500 ml-1">/person</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold">{pkg.rating}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/packages/search"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm text-center py-2.5 rounded-xl transition-all"
                      >
                        View Details
                      </Link>
                      <Link
                        href="/packages/search"
                        className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm text-center py-2.5 rounded-xl transition-all"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
