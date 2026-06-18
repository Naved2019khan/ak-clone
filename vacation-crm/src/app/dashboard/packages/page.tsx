"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { Plus, Pencil, Trash2, X, ImagePlus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";

// Tag Input for the modal
function ModalTagInput({
  label,
  items,
  onAdd,
  onRemove,
  placeholder,
  colorClass = "bg-gray-100 text-gray-700",
}: {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
  colorClass?: string;
}) {
  const [input, setInput] = useState("");
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input.trim();
      if (val && !items.includes(val)) {
        onAdd(val);
        setInput("");
      }
    }
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
        />
        <button
          type="button"
          onClick={() => {
            const val = input.trim();
            if (val && !items.includes(val)) { onAdd(val); setInput(""); }
          }}
          className="px-3 py-2.5 bg-orange-50 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-100 transition-colors"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-lg ${colorClass}`}>
              {item}
              <button type="button" onClick={() => onRemove(i)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface TravelType {
  _id: string;
  name: string;
}

interface Country {
  _id: string;
  name: string;
  code: string;
}

interface Location {
  _id: string;
  name: string;
  country: Country;
}

interface PackageItem {
  _id: string;
  title: string;
  description: string;
  country: Country;
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  duration: { days: number; nights: number };
  highlights: string[];
  amenities: string[];
  images: string[];
  inclusions: string[];
  exclusions: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export default function PackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PackageItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    country: "",
    location: "",
    travelType: "",
    price: "",
    strikePrice: "",
    days: "",
    nights: "",
    isFeatured: false,
  });
  const [highlights, setHighlights] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const [pkgRes, typeRes, countryRes, locRes] = await Promise.all([
        api.get("/packages"),
        api.get("/travel-types"),
        api.get("/countries"),
        api.get("/locations"),
      ]);
      setPackages(pkgRes.data.data);
      setTravelTypes(typeRes.data.data);
      setCountries(countryRes.data.data);
      setLocations(locRes.data.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter locations by selected country
  const filteredLocations = form.country
    ? locations.filter((loc) => loc.country?._id === form.country || (loc.country as unknown as string) === form.country)
    : locations;

  // Handle image file selection with preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageFiles(files);
    if (files) {
      const previews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        previews.push(URL.createObjectURL(files[i]));
      }
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      country: "",
      location: "",
      travelType: "",
      price: "",
      strikePrice: "",
      days: "",
      nights: "",
      isFeatured: false,
    });
    setHighlights([]);
    setAmenities([]);
    setInclusions([]);
    setExclusions([]);
    setImageFiles(null);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const openEdit = (item: PackageItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      country: item.country?._id || "",
      location: item.location?._id || "",
      travelType: item.travelType?._id || "",
      price: String(item.price),
      strikePrice: String((item as any).strikePrice || ""),
      days: String(item.duration?.days || ""),
      nights: String(item.duration?.nights || ""),
      isFeatured: item.isFeatured,
    });
    setHighlights(item.highlights || []);
    setAmenities(item.amenities || []);
    setInclusions(item.inclusions || []);
    setExclusions(item.exclusions || []);
    setImageFiles(null);
    // Show existing images as previews
    if (item.images?.length > 0) {
      setImagePreviews(
        item.images.map((img) => img.startsWith("http") ? img : `http://localhost:5000/${img}`)
      );
    } else {
      setImagePreviews([]);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("country", form.country);
    formData.append("location", form.location);
    formData.append("travelType", form.travelType);
    formData.append("price", form.price);
    formData.append("strikePrice", form.strikePrice || "0");
    formData.append("duration", JSON.stringify({ days: Number(form.days), nights: Number(form.nights) }));
    formData.append("highlights", JSON.stringify(highlights));
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("inclusions", JSON.stringify(inclusions));
    formData.append("exclusions", JSON.stringify(exclusions));
    formData.append("isFeatured", String(form.isFeatured));

    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    try {
      if (editing) {
        await api.put(`/packages/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Package updated");
      } else {
        await api.post("/packages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Package created");
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
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/packages/${id}`);
      toast.success("Package deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-400">No packages yet. Create your first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Images</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Title</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Country</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Location</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Type</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-600">Duration</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {packages.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {(item.images?.slice(0, 3) || []).map((img, idx) => (
                          <img
                            key={idx}
                            src={img.startsWith("http") ? img : `http://localhost:5000/${img}`}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm"
                          />
                        ))}
                        {(item.images?.length || 0) > 3 && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                            +{item.images.length - 3}
                          </div>
                        )}
                        {(!item.images || item.images.length === 0) && (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {item.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
                            Featured
                          </span>
                        )}
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.country?.name || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{item.location?.name || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-lg">
                        {item.travelType?.name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{item.price}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.duration?.days}D / {item.duration?.nights}N
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/packages/${item._id}`)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Package" : "Add Package"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Noida Weekend Getaway"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value, location: "" })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  >
                    <option value="">Select location</option>
                    {filteredLocations.map((loc) => (
                      <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type *</label>
                  <select
                    value={form.travelType}
                    onChange={(e) => setForm({ ...form, travelType: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  >
                    <option value="">Select type</option>
                    {travelTypes.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    placeholder="4999"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days *</label>
                  <input
                    type="number"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                    required
                    min="1"
                    placeholder="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nights *</label>
                  <input
                    type="number"
                    value={form.nights}
                    onChange={(e) => setForm({ ...form, nights: e.target.value })}
                    required
                    min="0"
                    placeholder="2"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Package description..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
                />
              </div>

              <ModalTagInput
                label="Highlights"
                items={highlights}
                onAdd={(item) => setHighlights([...highlights, item])}
                onRemove={(i) => setHighlights(highlights.filter((_, idx) => idx !== i))}
                placeholder="Type and press Enter to add"
                colorClass="bg-orange-50 text-orange-700"
              />

              <ModalTagInput
                label="Amenities"
                items={amenities}
                onAdd={(item) => setAmenities([...amenities, item])}
                onRemove={(i) => setAmenities(amenities.filter((_, idx) => idx !== i))}
                placeholder="Type and press Enter to add"
                colorClass="bg-blue-50 text-blue-700"
              />

              <ModalTagInput
                label="Inclusions"
                items={inclusions}
                onAdd={(item) => setInclusions([...inclusions, item])}
                onRemove={(i) => setInclusions(inclusions.filter((_, idx) => idx !== i))}
                placeholder="Type and press Enter to add"
                colorClass="bg-green-50 text-green-700"
              />

              <ModalTagInput
                label="Exclusions"
                items={exclusions}
                onAdd={(item) => setExclusions([...exclusions, item])}
                onRemove={(i) => setExclusions(exclusions.filter((_, idx) => idx !== i))}
                placeholder="Type and press Enter to add"
                colorClass="bg-red-50 text-red-700"
              />

              {/* Multiple Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images <span className="text-gray-400 font-normal">(select multiple)</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    id="pkg-images"
                    className="hidden"
                  />
                  <label htmlFor="pkg-images" className="cursor-pointer flex flex-col items-center gap-2">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload images</span>
                    <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB each</span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-3">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Mark as Featured
                </label>
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
