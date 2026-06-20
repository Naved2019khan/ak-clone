import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — VoyageArc",
  description: "VoyageArc terms and conditions for using our travel booking services.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa] relative overflow-hidden">
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-rose-100/40 rounded-full blur-3xl" />

        {/* Hero */}
        <div className="relative h-48 bg-gradient-to-r from-orange-600 to-rose-600 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-3xl md:text-4xl font-black text-white">Terms & Conditions</h1>
            <p className="text-white/80 mt-1">Last updated: June 2026</p>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-14">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using VoyageArc&apos;s website and services, you agree to be bound by these Terms and Conditions.
                If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Booking & Payments</h2>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                <li>All bookings are subject to availability and confirmation from our team.</li>
                <li>Prices are quoted in the local currency and may be subject to change until booking is confirmed.</li>
                <li>A deposit may be required to secure your booking, with the balance due before departure.</li>
                <li>Payment can be made via credit card, debit card, bank transfer, or UPI.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cancellation & Refunds</h2>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                <li>Cancellations made 30+ days before departure: Full refund minus processing fee.</li>
                <li>Cancellations made 15-30 days before departure: 50% refund.</li>
                <li>Cancellations made less than 15 days before departure: No refund.</li>
                <li>Refunds are processed within 7-14 business days to the original payment method.</li>
                <li>In case of force majeure events, we will work with you to reschedule or provide credit.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Travel Documents</h2>
              <p className="text-gray-600 leading-relaxed">
                It is the traveler&apos;s responsibility to ensure they have valid passports, visas, and any required travel
                documents. VoyageArc is not liable for denied entry or deportation due to insufficient documentation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Travel Insurance</h2>
              <p className="text-gray-600 leading-relaxed">
                We strongly recommend purchasing comprehensive travel insurance before your trip. VoyageArc is not responsible
                for any losses, medical expenses, or trip disruptions that are not covered by insurance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                VoyageArc acts as an intermediary between travelers and service providers (hotels, airlines, tour operators).
                We are not liable for any injury, loss, or damage arising from the services provided by third parties. Our
                liability is limited to the amount paid for our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Changes to Itinerary</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify itineraries due to weather conditions, safety concerns, or operational reasons.
                In such cases, we will provide suitable alternatives of similar value.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. User Conduct</h2>
              <p className="text-gray-600 leading-relaxed">
                Users agree not to misuse our platform, provide false information, or engage in any activity that could harm
                our services or other users. We reserve the right to terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions regarding these terms, please reach out to us at{" "}
                <a href="mailto:hello@voyagearc.com" className="text-orange-600 hover:underline font-medium">hello@voyagearc.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
