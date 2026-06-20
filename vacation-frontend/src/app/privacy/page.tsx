import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — VoyageArc",
  description: "VoyageArc privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#fafafa] relative overflow-hidden">
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-100/40 rounded-full blur-3xl" />

        {/* Hero */}
        <div className="relative h-48 bg-gradient-to-r from-orange-600 to-rose-600 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <h1 className="text-3xl md:text-4xl font-black text-white">Privacy Policy</h1>
            <p className="text-white/80 mt-1">Last updated: June 2026</p>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-14">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                <li>Personal information (name, email, phone number) when you make a booking or enquiry</li>
                <li>Payment information when you complete a transaction</li>
                <li>Travel preferences and special requirements you share with us</li>
                <li>Communications you send to us via email, chat, or phone</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                <li>Process and manage your travel bookings</li>
                <li>Communicate with you about your trips, including confirmations and updates</li>
                <li>Provide customer support and respond to your enquiries</li>
                <li>Send you promotional offers and travel deals (with your consent)</li>
                <li>Improve our services, website, and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed">
                We do not sell your personal information. We may share your information with trusted third-party service
                providers (hotels, airlines, local tour operators) solely to fulfil your booking. We may also share information
                when required by law or to protect our rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption,
                secure servers, and access controls. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                <li>Access, update, or delete your personal information</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Request a copy of your data</li>
                <li>Lodge a complaint with a data protection authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
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
