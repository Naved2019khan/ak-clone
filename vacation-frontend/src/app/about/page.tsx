import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, Users, MapPin, Star, Shield, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — VoyageArc",
  description: "Learn about VoyageArc — your trusted travel partner crafting unforgettable journeys worldwide.",
};

const stats = [
  { value: "500+", label: "Destinations" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "12+", label: "Years Experience" },
  { value: "4.9", label: "Avg Rating" },
];

const values = [
  { icon: Heart, title: "Passion for Travel", description: "We believe travel transforms lives. Every trip we plan is infused with our love for exploration and discovery." },
  { icon: Shield, title: "Trust & Safety", description: "Your safety is our priority. We partner only with verified hotels, airlines, and local guides to ensure peace of mind." },
  { icon: Users, title: "Customer First", description: "From your first enquiry to your return home, our dedicated team is available 24/7 to make your journey seamless." },
  { icon: Star, title: "Quality Experience", description: "We handpick every destination, hotel, and activity to deliver experiences that exceed expectations every time." },
  { icon: Globe, title: "Global Reach", description: "With partners across 50+ countries, we bring the world closer to you with authentic local experiences." },
  { icon: MapPin, title: "Local Expertise", description: "Our on-ground experts in every destination ensure you get insider access to hidden gems and local culture." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa] relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl" />

        {/* Hero */}
        <div
          className="relative h-72 bg-cover bg-center flex items-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-rose-900/60" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">About VoyageArc</h1>
            <p className="text-white/80 text-lg max-w-xl">Crafting unforgettable travel experiences since 2010</p>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
          {/* Our Story */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-4">
              VoyageArc was born from a simple belief: that travel should be effortless, enriching, and accessible to everyone.
              What started as a small team of passionate travelers in 2010 has grown into a trusted platform serving thousands
              of explorers worldwide.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We combine technology with human expertise to curate journeys that go beyond the ordinary. Whether it&apos;s a
              romantic getaway, a family adventure, or a solo expedition, we make every trip a story worth telling.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 text-center border border-orange-100/50 shadow-sm">
                <p className="text-3xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
