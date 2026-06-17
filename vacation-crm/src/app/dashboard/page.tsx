"use client";

import { useEffect, useState } from "react";
import { Compass, Globe, Package } from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ travelTypes: 0, countries: 0, packages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [types, countries, packages] = await Promise.all([
          api.get("/travel-types"),
          api.get("/countries"),
          api.get("/packages"),
        ]);
        setStats({
          travelTypes: types.data.data.length,
          countries: countries.data.data.length,
          packages: packages.data.data.length,
        });
      } catch {
        // Ignore errors on dashboard load
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Travel Types", value: stats.travelTypes, icon: Compass, color: "from-blue-500 to-indigo-500", bgColor: "bg-blue-50" },
    { label: "Countries", value: stats.countries, icon: Globe, color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-50" },
    { label: "Packages", value: stats.packages, icon: Package, color: "from-orange-500 to-rose-500", bgColor: "bg-orange-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ stroke: "url(#grad)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
