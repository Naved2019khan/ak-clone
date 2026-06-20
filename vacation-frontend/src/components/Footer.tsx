import Link from "next/link";
import { Globe, Share2, Rss, MessageCircle, Radio, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Destinations: [
    "Bali, Indonesia",
    "Santorini, Greece",
    "Maldives",
    "Kyoto, Japan",
    "Paris, France",
    "New York, USA",
  ],
  Packages: [
    "Romantic Getaways",
    "Adventure Tours",
    "Family Holidays",
    "Luxury Escapes",
    "Budget Trips",
    "Honeymoon Packages",
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Partners", href: "/partners" },
    { label: "Contact Us", href: "/contact" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Booking Guide", href: "/guide" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Travel Insurance", href: "/insurance" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl">
                Voyage<span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Arc</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-xs">
              Your trusted travel partner since 2010. We craft unforgettable journeys
              to the world&apos;s most spectacular destinations.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                +1 (234) 567-890
              </a>
              <a
                href="mailto:hello@voyagearc.com"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                hello@voyagearc.com
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>123 Travel Street, New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { Icon: Share2, href: "#", label: "Facebook" },
                { Icon: MessageCircle, href: "#", label: "Twitter" },
                { Icon: Radio, href: "#", label: "Instagram" },
                { Icon: Rss, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-rose-500 rounded-full flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Destinations</h4>
            <ul className="space-y-2.5">
              {footerLinks.Destinations.map((item) => (
                <li key={item}>
                  <Link
                    href="/destinations"
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Packages</h4>
            <ul className="space-y-2.5">
              {footerLinks.Packages.map((item) => (
                <li key={item}>
                  <Link
                    href="/packages"
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.Company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2.5">
              {footerLinks.Support.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} VoyageArc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Accepted Payments:</span>
            <div className="flex gap-2">
              {["Visa", "MC", "PayPal", "Amex"].map((p) => (
                <span
                  key={p}
                  className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
