import { Shield, Headphones, CreditCard, Award, Globe, ArrowRight } from "lucide-react";

const perks = [
  {
    icon: Shield,
    title: "100% Safe Booking",
    desc: "Your payments and data are protected by enterprise-grade encryption.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    desc: "Real travel specialists on call before, during and after your trip.",
  },
  {
    icon: CreditCard,
    title: "Best Price Guarantee",
    desc: "We match any lower price — and add an extra 5% off.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    desc: "World Travel Award winner 5 years in a row.",
  },
];

const images = [
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&q=80",
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image Mosaic */}
          <div className="relative h-[520px]">
            {/* Big image */}
            <div className="absolute top-0 left-0 w-3/4 h-64 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[0]} alt="Travel scene" className="w-full h-full object-cover" />
            </div>
            {/* Bottom left image */}
            <div className="absolute bottom-0 left-0 w-[45%] h-56 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[1]} alt="Adventure" className="w-full h-full object-cover" />
            </div>
            {/* Right image */}
            <div className="absolute top-16 right-0 w-[48%] h-80 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[2]} alt="Destination" className="w-full h-full object-cover" />
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-20 left-1/4 bg-gray-900 text-white rounded-2xl p-4 shadow-xl z-10 w-44">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-orange-400" />
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                  Global Reach
                </span>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">50K+</p>
              <p className="text-white/50 text-xs mt-0.5">Destinations worldwide</p>
            </div>

            {/* Floating review card */}
            <div className="absolute top-48 -left-6 bg-white rounded-2xl p-4 shadow-xl z-10 w-48 border border-gray-100">
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-orange-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-900 font-bold text-sm">&ldquo;Best trip of my life!&rdquo;</p>
              <div className="flex items-center gap-2 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80"
                  alt="Reviewer"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-gray-500 text-xs">Sarah M.</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 mb-4">
              <Award className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Why VoyageArc?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
              Travel Smarter,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                Not Harder
              </span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
              Over 15 years crafting extraordinary journeys. We handle every
              detail so you can focus entirely on the experience.
            </p>

            {/* Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {perks.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-100 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-orange-50 to-rose-50 group-hover:from-orange-100 group-hover:to-rose-100 transition-colors">
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1.5">{p.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="/about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              Learn About Us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
