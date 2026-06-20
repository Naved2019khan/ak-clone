import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — VoyageArc",
  description: "Get in touch with our travel experts. We're here 24/7 to help plan your perfect trip.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Get in Touch</h1>
            <p className="text-white/80 text-xl max-w-xl mx-auto">
              Our travel experts are ready to help you plan the perfect trip
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { Icon: Phone, title: "Phone", value: "+1 (234) 567-890", sub: "Mon–Fri, 9am–6pm EST", href: "tel:+1234567890" },
                    { Icon: Mail, title: "Email", value: "hello@voyagearc.com", sub: "We reply within 2 hours", href: "mailto:hello@voyagearc.com" },
                    { Icon: MapPin, title: "Office", value: "123 Travel Street", sub: "New York, NY 10001", href: "#" },
                    { Icon: Clock, title: "Support Hours", value: "24/7 Live Support", sub: "For urgent booking queries", href: "#" },
                  ].map(({ Icon, title, value, sub, href }) => (
                    <a
                      key={title}
                      href={href}
                      className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-6 text-white">
                <MessageSquare className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Live Chat Available</h3>
                <p className="text-white/80 text-sm mb-4">
                  Chat with a travel specialist right now — no waiting!
                </p>
                <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-blue-50 transition-all">
                  Start Live Chat
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-5" aria-label="Contact form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        placeholder="John"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        placeholder="Smith"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (234) 567-890"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="">Select a topic</option>
                      <option>New Booking Inquiry</option>
                      <option>Existing Booking</option>
                      <option>Cancellation / Refund</option>
                      <option>Package Customization</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preferred Destination
                    </label>
                    <input
                      id="destination"
                      type="text"
                      placeholder="e.g. Bali, Paris, Maldives..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us about your dream trip — dates, group size, special requirements..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      type="checkbox"
                      required
                      className="mt-1 w-4 h-4 text-blue-600 rounded accent-blue-600"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-500">
                      I agree to the{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and consent to being contacted about my travel inquiry.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
