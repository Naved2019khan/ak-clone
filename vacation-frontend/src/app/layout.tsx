import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoyageArc — Discover Your Next Adventure",
  description:
    "Find the best vacation packages, tours, and travel experiences worldwide. Plan your dream holiday with VoyageArc.",
  keywords: ["travel", "vacation packages", "tours", "holiday", "adventure"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
