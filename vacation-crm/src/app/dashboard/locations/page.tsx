"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, MapPin, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { uploadToCloudinary, validateImageFile } from "@/lib/cloudinary";

interface Country {
  _id: string;
  name: string;
  code: string;
}

interface TravelType {
  _id: string;
  name: string;
}

interface Location {
  _id: string;
  name: string;
  country: Country;
  description: string;
  image: string;
  price: number;
  strikePrice: number;
  rating: number;
  reviews: number;
  days: number;
  nights: number;
  tag: string;
  packageTypes: TravelType[];
  isActive: boolean;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    description: "",
    price: "",
    strikePrice: "",
    rating: "",
    reviews: "",
    days: "",
    nights: "",
    packageTypes: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");

  const fetchData = async () => {
    try {
      const [locRes, countryRes, typeRes] = await Promise.all([
        api.get("/locations"),
        api.get("/countries"),
        api.get("/travel-types"),
      ]);
      setLocations(locRes.data.data);
      setCountries(countryRes.data.data);
      setTravelTypes(typeRes.data.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLocations = filterCountry
    ? locations.filter((loc) => loc.country?._id === filterCountry)
    : locations;

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      country: "",
      description: "",
      price: "",
      strikePrice: "",
      rating: "",
      reviews: "",
      days: "",
      nights: "",
      packageTypes: [],
    });
    setImageFile(null);
    setImageError("");
    setModalOpen(true);
  };

  const openEdit = (item: Location) => {
    setEditing(item);
    setForm({
      name: item.name,
      country: item.country?._id || "",
      description: item.description || "",
      price: item.price ? String(item.price) : "",
      strikePrice: item.strikePrice ? String(item.strikePrice) : "",
      rating: item.rating ? String(item.rating) : "",
      reviews: item.reviews ? String(item.reviews) : "",
      days: item.days ? String(item.days) : "",
      nights: item.nights ? String(item.nights) : "",
      packageTypes: item.packageTypes?.map((t) => t._id) || [],
    });
    setImageFile(null);
    setImageError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload image to Cloudinary first if a file is selected
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile, "vacation/locations");
      }

      const payload: Record<string, string | string[]> = {
        name: form.name,
        country: form.country,
        description: form.description,
        price: form.price || "0",
        strikePrice: form.strikePrice || "0",
        rating: form.rating || "0",
        reviews: form.reviews || "0",
        days: form.days || "1",
        nights: form.nights || "0",
        packageTypes: JSON.stringify(form.packageTypes) as unknown as string,
      };
      if (imageUrl) payload.image = imageUrl;

      if (editing) {
        await api.put(`/locations/${editing._id}`, payload);
        toast.success("Location updated");
      } else {
        await api.post("/locations", payload);
        toast.success("Location created");
      }
      setModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/locations/${id}`);
      toast.success("Location deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      {/* Filter by country */}
      {countries.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Filter by country:</span>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredLocations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {filterCountry ? "No locations in this country." : "No locations yet. Add your first one."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Image</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Country</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Package Types</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Rating</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Duration</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLocations.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      {item.image ? (
                        <img
                          src={item.image.startsWith("http") ? item.image : `http://localhost:5000/${item.image.replace(/\\/g, "/")}`}
                          alt={item.name}
                          className="w-14 h-10 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                        {item.country?.name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {item.packageTypes && item.packageTypes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {item.packageTypes.map((t) => (
                            <span key={t._id} className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="font-semibold text-gray-900">₹{item.price || 0}</span>
                        {item.strikePrice > 0 && (
                          <span className="ml-1.5 text-xs text-gray-400 line-through">₹{item.strikePrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{item.rating || 0}</span>
                        <span className="text-xs text-gray-400">({item.reviews || 0})</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">
                      {item.days || 0}D / {item.nights || 0}N
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Location" : "Add Location"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Bali, Noida"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  >
                    <option value="">Select a country</option>
                    {countries.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Types <span className="text-gray-400 font-normal">(select multiple)</span>
                </label>
                <div className="border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto space-y-2">
                  {travelTypes.map((t) => (
                    <label key={t._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg">
                      <input
                        type="checkbox"
                        checked={form.packageTypes.includes(t._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, packageTypes: [...form.packageTypes, t._id] });
                          } else {
                            setForm({ ...form, packageTypes: form.packageTypes.filter((id) => id !== t._id) });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{t.name}</span>
                    </label>
                  ))}
                  {travelTypes.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">Add travel types first</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min="0"
                    placeholder="4999"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strike Price (₹)</label>
                  <input
                    type="number"
                    value={form.strikePrice}
                    onChange={(e) => setForm({ ...form, strikePrice: e.target.value })}
                    min="0"
                    placeholder="6999"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.8"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reviews Count</label>
                  <input
                    type="number"
                    value={form.reviews}
                    onChange={(e) => setForm({ ...form, reviews: e.target.value })}
                    min="0"
                    placeholder="1200"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <input
                    type="number"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                    min="1"
                    placeholder="7"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                  <input
                    type="number"
                    value={form.nights}
                    onChange={(e) => setForm({ ...form, nights: e.target.value })}
                    min="0"
                    placeholder="6"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  placeholder="Brief tagline for the card..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {/* Current image preview */}
                {editing && editing.image && !imageFile && (
                  <div className="relative mb-3 inline-block">
                    <img
                      src={editing.image}
                      alt={editing.name}
                      className="w-full h-40 rounded-xl object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("Delete this image?")) return;
                        try {
                          await api.delete(`/locations/${editing._id}/image`);
                          toast.success("Image deleted");
                          setEditing({ ...editing, image: "" });
                          fetchData();
                        } catch {
                          toast.error("Failed to delete image");
                        }
                      }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {/* New file preview */}
                {imageFile && (
                  <div className="relative mb-3 inline-block">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-40 rounded-xl object-cover border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageError("");
                    if (file) {
                      const error = validateImageFile(file);
                      if (error) {
                        setImageError(error);
                        setImageFile(null);
                        e.target.value = "";
                        return;
                      }
                    }
                    setImageFile(file);
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Max 600KB. Recommended: 1200×800px, landscape orientation. Use TinyPNG to compress.
                </p>
                {imageError && (
                  <p className="text-xs text-red-500 mt-1">{imageError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold py-2.5 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all disabled:opacity-50"
              >
                {submitting ? "Saving..." : editing ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
