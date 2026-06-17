"use client";

import { useEffect, useState } from "react";
import { Star, Save, Package } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface PackageItem {
  _id: string;
  title: string;
  country: { _id: string; name: string };
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  duration: { days: number; nights: number };
  isFeatured: boolean;
  images: string[];
}

interface Settings {
  featuredCount: number;
}

export default function FeaturedPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredCount, setFeaturedCount] = useState(4);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data.data);

      // Try to get settings
      try {
        const settingsRes = await api.get("/settings/featured-count");
        if (settingsRes.data.success) {
          setFeaturedCount(settingsRes.data.data.count);
        }
      } catch {
        // Settings endpoint might not exist yet, use default
      }
    } catch {
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const featuredPackages = packages.filter((p) => p.isFeatured);
  const nonFeaturedPackages = packages.filter((p) => !p.isFeatured);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      formData.append("isFeatured", String(!currentStatus));
      await api.put(`/packages/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(currentStatus ? "Removed from featured" : "Added to featured");
      fetchData();
    } catch {
      toast.error("Failed to update");
    }
  };

  const saveCount = async () => {
    setSaving(true);
    try {
      await api.post("/settings/featured-count", { count: featuredCount });
      toast.success("Featured count saved");
    } catch {
      toast.error("Failed to save count");
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (pkg: PackageItem) => {
    if (!pkg.images || pkg.images.length === 0) return "";
    const img = pkg.images[0];
    return img.startsWith("http") ? img : `http://localhost:5000/${img}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Featured Packages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select which packages to feature on the homepage. Set how many to display.
          </p>
        </div>
      </div>

      {/* Count Setting */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Show on frontend:</label>
            <input
              type="number"
              value={featuredCount}
              onChange={(e) => setFeaturedCount(Math.max(1, Math.min(20, Number(e.target.value))))}
              min={1}
              max={20}
              className="w-20 px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
            />
            <span className="text-sm text-gray-400">packages (1–20)</span>
          </div>
          <button
            onClick={saveCount}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Currently {featuredPackages.length} package{featuredPackages.length !== 1 ? "s" : ""} marked as featured.
          Frontend will display up to {featuredCount}.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-6">
          {/* Featured Packages */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Featured ({featuredPackages.length})
            </h2>
            {featuredPackages.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                <p className="text-sm text-amber-700">No packages marked as featured yet. Toggle the star below to feature packages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredPackages.map((pkg) => (
                  <div key={pkg._id} className="bg-white rounded-xl border-2 border-amber-200 p-4 shadow-sm relative">
                    {getImageUrl(pkg) && (
                      <img
                        src={getImageUrl(pkg)}
                        alt={pkg.title}
                        className="w-full h-28 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{pkg.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{pkg.location?.name}</span>
                      <span>·</span>
                      <span>{pkg.country?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">₹{pkg.price}</span>
                      <span className="text-xs text-gray-400">{pkg.duration?.days}D/{pkg.duration?.nights}N</span>
                    </div>
                    <button
                      onClick={() => toggleFeatured(pkg._id, true)}
                      className="absolute top-3 right-3 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors"
                      title="Remove from featured"
                    >
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Other Packages */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              Other Packages ({nonFeaturedPackages.length})
            </h2>
            {nonFeaturedPackages.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">All packages are featured.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {nonFeaturedPackages.map((pkg) => (
                  <div key={pkg._id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm relative">
                    {getImageUrl(pkg) && (
                      <img
                        src={getImageUrl(pkg)}
                        alt={pkg.title}
                        className="w-full h-28 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{pkg.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{pkg.location?.name}</span>
                      <span>·</span>
                      <span>{pkg.country?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">₹{pkg.price}</span>
                      <span className="text-xs text-gray-400">{pkg.duration?.days}D/{pkg.duration?.nights}N</span>
                    </div>
                    <button
                      onClick={() => toggleFeatured(pkg._id, false)}
                      className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                      title="Add to featured"
                    >
                      <Star className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
