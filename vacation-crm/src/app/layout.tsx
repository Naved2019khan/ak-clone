import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Vacation CRM - Admin Panel",
  description: "Manage travel packages, countries, and travel types",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
