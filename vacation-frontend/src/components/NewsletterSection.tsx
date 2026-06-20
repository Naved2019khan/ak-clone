"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
      {/* Accent glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
          <Mail className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-white/90">Newsletter</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Get Exclusive{" "}
          <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
            Travel Deals
          </span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
          Subscribe to our newsletter and be the first to receive special offers,
          curated itineraries, and insider travel tips.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-8 py-5 max-w-md mx-auto">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="font-semibold text-lg">
              You&apos;re subscribed! Watch your inbox for deals.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 max-w-lg mx-auto flex-col sm:flex-row"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full bg-white text-gray-800 placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 shadow-lg"
                aria-label="Email address for newsletter"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-xl whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        )}

        <p className="text-white/40 text-sm mt-5">
          No spam, unsubscribe at any time. Join 250,000+ travel enthusiasts.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/50 text-sm">
          {["🏆 World Travel Award 2024", "🔒 SSL Secured", "⭐ 4.9/5 on TrustPilot"].map(
            (badge) => (
              <span key={badge} className="font-medium">
                {badge}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
