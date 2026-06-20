"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I book a travel package?",
    answer: "Browse our destinations or packages, select the one you like, and click 'Book Now'. Fill in your details and our team will confirm availability within 24 hours. No upfront payment is required until we confirm your booking.",
  },
  {
    question: "Can I customize a travel package?",
    answer: "Absolutely! All our packages can be customized to suit your preferences. Simply mention your requirements in the special requests field while booking, or contact our team directly for a tailored itinerary.",
  },
  {
    question: "What is included in the package price?",
    answer: "Each package clearly lists what's included (accommodation, meals, activities, transfers) and what's excluded. You can find this information on the package detail page under 'Inclusions' and 'Exclusions' sections.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 30+ days before departure receive a full refund minus processing fees. 15-30 days before: 50% refund. Less than 15 days: no refund. Force majeure events are handled on a case-by-case basis with options to reschedule or receive credit.",
  },
  {
    question: "Do I need travel insurance?",
    answer: "We strongly recommend purchasing travel insurance for all trips. It covers medical emergencies, trip cancellations, lost luggage, and other unforeseen events. We can help you find suitable insurance options.",
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 2-4 weeks in advance for domestic trips and 4-8 weeks for international trips. Popular destinations during peak season should be booked even earlier to ensure availability.",
  },
  {
    question: "Are there any hidden charges?",
    answer: "No hidden charges. The price shown includes everything listed in the inclusions. Any additional costs (visa fees, personal expenses, optional activities) are clearly mentioned in the exclusions section.",
  },
  {
    question: "What if I need help during my trip?",
    answer: "Our support team is available 24/7 during your trip. You'll receive a dedicated point of contact before departure. In case of emergencies, you can reach us via phone, email, or WhatsApp.",
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! We offer special rates for groups of 5 or more travelers. Contact our team with your group size and travel plans, and we'll provide a customized quote with group discounts.",
  },
  {
    question: "How do I pay for my booking?",
    answer: "We accept credit cards, debit cards, bank transfers, and UPI payments. A deposit secures your booking, with the balance due 15 days before departure. All transactions are secured with industry-standard encryption.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa] relative overflow-hidden">
        <div className="absolute top-60 left-10 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-rose-100/40 rounded-full blur-3xl" />

        {/* Hero */}
        <div className="relative h-48 bg-gradient-to-r from-orange-600 to-rose-600 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h1>
            <p className="text-white/80 mt-1">Everything you need to know about traveling with us</p>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-6 lg:px-10 py-14">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border transition-all ${
                  openIndex === index
                    ? "border-orange-200 shadow-md shadow-orange-100/50"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    openIndex === index ? "bg-orange-100" : "bg-gray-50"
                  }`}>
                    <HelpCircle className={`w-5 h-5 transition-colors ${
                      openIndex === index ? "text-orange-500" : "text-gray-400"
                    }`} />
                  </div>
                  <span className={`flex-1 font-semibold transition-colors ${
                    openIndex === index ? "text-gray-900" : "text-gray-700"
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 pl-[4.25rem]">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/80 text-sm mb-5">Our team is here to help you plan your perfect trip.</p>
            <a
              href="mailto:hello@voyagearc.com"
              className="inline-block bg-white text-orange-600 font-bold text-sm px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
