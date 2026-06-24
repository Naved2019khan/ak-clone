"use client";

import { useEffect, useState, KeyboardEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Plus, Trash2, Pencil, Save, X, MapPin,
  Calendar, Clock, ImagePlus, Check, Tag
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  image?: string;
}

interface TravelType { _id: string; name: string; }
interface Country { _id: string; name: string; code: string; }
interface Location { _id: string; name: string; country: Country; }

interface PackageDetail {
  _id: string;
  title: string;
  description: string;
  country: Country;
  location: { _id: string; name: string };
  travelType: { _id: string; name: string };
  price: number;
  strikePrice: number;
  duration: { days: number; nights: number };
  highlights: string[];
  amenities: string[];
  images: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
}

// Reusable Tag Input Component
function TagInput({
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
            if (val && !items.includes(val)) {
              onAdd(val);
              setInput("");
            }
          }}
          className="px-4 py-2.5 bg-orange-50 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-100 transition-colors"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {items.map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg ${colorClass}`}>
              {item}
              <button type="button" onClick={() => onRemove(i)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "itinerary" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  // Dropdown data
  const [travelTypes, setTravelTypes] = useState<TravelType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // Edit form state
  const [form, setForm] = useState({
    title: "", slug: "", description: "", country: "", location: "",
    travelType: "", price: "", strikePrice: "",
    days: "", nights: "", isFeatured: false, rating: "",
  });

  // Tag arrays (managed separately)
  const [highlights, setHighlights] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<string | null>(null);

  // Itinerary state
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [dayForm, setDayForm] = useState({ title: "", description: "", activities: "" });
  const [itineraryImageFiles, setItineraryImageFiles] = useState<Record<number, File>>({});
  const [itineraryImagePreviews, setItineraryImagePreviews] = useState<Record<number, string>>({});

  const fetchData = async () => {
    try {
      const [pkgRes, typeRes, countryRes, locRes] = await Promise.all([
        api.get(`/packages/${id}`),
        api.get("/travel-types"),
        api.get("/countries"),
        api.get("/locations"),
      ]);
      const data = pkgRes.data.data;
      setPkg(data);
      setTravelTypes(typeRes.data.data);
      setCountries(countryRes.data.data);
      setLocations(locRes.data.data);
      setItinerary(data.itinerary || []);
      populateForm(data);
    } catch {
      toast.error("Failed to load package");
      router.push("/dashboard/packages");
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (data: PackageDetail) => {
    setForm({
      title: data.title || "",
      slug: (data as any).slug || "",
      description: data.description || "",
      country: data.country?._id || "",
      location: data.location?._id || "",
      travelType: data.travelType?._id || "",
      price: String(data.price || ""),
      strikePrice: String(data.strikePrice || ""),
      days: String(data.duration?.days || ""),
      nights: String(data.duration?.nights || ""),
      isFeatured: data.isFeatured || false,
      rating: String(data.rating || ""),
    });
    setHighlights(data.highlights || []);
    setAmenities(data.amenities || []);
    setInclusions(data.inclusions || []);
    setExclusions(data.exclusions || []);
    setExistingImages(data.images || []);
    setNewImageFiles([]);
    setNewImagePreviews([]);
  };

  useEffect(() => { fetchData(); }, [id]);

  const filteredLocations = form.country
    ? locations.filter((loc) => loc.country?._id === form.country || (loc.country as unknown as string) === form.country)
    : locations;

  const getImageUrl = (img: string) =>
    img.startsWith("http") ? img : `http://localhost:5000/${img}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      const previews = filesArray.map((f) => URL.createObjectURL(f));
      setNewImageFiles((prev) => [...prev, ...filesArray]);
      setNewImagePreviews((prev) => [...prev, ...previews]);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const handleRemoveNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageUrl: string) => {
    setConfirmDeleteImage(imageUrl);
  };

  const confirmImageDelete = async () => {
    if (!confirmDeleteImage) return;
    const imageUrl = confirmDeleteImage;
    setConfirmDeleteImage(null);
    setDeletingImage(imageUrl);
    try {
      await api.delete(`/packages/${id}/image`, { data: { imageUrl } });
      setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
      toast.success("Image deleted");
    } catch {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
  };

  // Save package details
  const handleSaveDetails = async () => {
    setSaving(true);

    try {
      // Upload new package images to Cloudinary
      let newImageUrls: string[] = [];
      if (newImageFiles.length > 0) {
        newImageUrls = await uploadMultipleToCloudinary(newImageFiles, "vacation/packages");
      }

      // Upload itinerary images to Cloudinary
      const updatedItinerary = [...itinerary];
      for (const [index, file] of Object.entries(itineraryImageFiles)) {
        const url = await uploadToCloudinary(file, "vacation/packages/itinerary");
        updatedItinerary[Number(index)] = { ...updatedItinerary[Number(index)], image: url };
      }

      const payload: Record<string, unknown> = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        country: form.country,
        location: form.location,
        travelType: form.travelType,
        price: form.price,
        strikePrice: form.strikePrice || "0",
        duration: { days: Number(form.days), nights: Number(form.nights) },
        highlights,
        amenities,
        inclusions,
        exclusions,
        isFeatured: form.isFeatured,
        rating: form.rating || "0",
        itinerary: updatedItinerary,
      };

      // Merge new images with existing
      if (newImageUrls.length > 0) {
        payload.images = [...existingImages, ...newImageUrls];
      }

      await api.put(`/packages/${id}`, payload);
      toast.success("Package updated successfully");
      setItineraryImageFiles({});
      setItineraryImagePreviews({});
      fetchData();
    } catch {
      toast.error("Failed to update package");
    } finally {
      setSaving(false);
    }
  };

  // Itinerary handlers
  const handleAddDay = () => {
    const newDay: ItineraryDay = { day: itinerary.length + 1, title: "", description: "", activities: [] };
    setItinerary([...itinerary, newDay]);
    setEditingDay(itinerary.length);
    setDayForm({ title: "", description: "", activities: "" });
  };

  const handleSaveDay = (index: number) => {
    const updated = [...itinerary];
    updated[index] = {
      ...updated[index],
      title: dayForm.title,
      description: dayForm.description,
      activities: dayForm.activities.split(",").map((a) => a.trim()).filter(Boolean),
    };
    setItinerary(updated);
    setEditingDay(null);
  };

  const handleDeleteDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setItinerary(updated);
    if (editingDay === index) setEditingDay(null);
    // Clean up itinerary image state for deleted/reindexed days
    const newFiles: Record<number, File> = {};
    const newPreviews: Record<number, string> = {};
    Object.entries(itineraryImageFiles).forEach(([key, file]) => {
      const k = Number(key);
      if (k < index) { newFiles[k] = file; newPreviews[k] = itineraryImagePreviews[k]; }
      else if (k > index) { newFiles[k - 1] = file; newPreviews[k - 1] = itineraryImagePreviews[k]; }
    });
    setItineraryImageFiles(newFiles);
    setItineraryImagePreviews(newPreviews);
  };

  const handleItineraryImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke old preview if exists
      if (itineraryImagePreviews[index]) {
        URL.revokeObjectURL(itineraryImagePreviews[index]);
      }
      setItineraryImageFiles((prev) => ({ ...prev, [index]: file }));
      setItineraryImagePreviews((prev) => ({ ...prev, [index]: URL.createObjectURL(file) }));
    }
    e.target.value = "";
  };

  const handleRemoveItineraryImage = (index: number) => {
    // Remove the new file selection
    if (itineraryImagePreviews[index]) {
      URL.revokeObjectURL(itineraryImagePreviews[index]);
    }
    setItineraryImageFiles((prev) => { const n = { ...prev }; delete n[index]; return n; });
    setItineraryImagePreviews((prev) => { const n = { ...prev }; delete n[index]; return n; });
    // Also clear existing image from itinerary data
    const updated = [...itinerary];
    updated[index] = { ...updated[index], image: "" };
    setItinerary(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-400">Loading package...</div>
      </div>
    );
  }

  if (!pkg) return null;

  const priceNum = Number(form.price) || 0;
  const strikePriceNum = Number(form.strikePrice) || 0;
  const discount = strikePriceNum > priceNum ? Math.round(((strikePriceNum - priceNum) / strikePriceNum) * 100) : 0;
  const daysNum = Number(form.days) || 0;
  const itineraryMismatch = daysNum > 0 && itinerary.length > 0 && itinerary.length !== daysNum;

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (value: string) => {
    setForm({ ...form, title: value, slug: generateSlug(value) });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/dashboard/packages")}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{pkg.title}</h1>
          <p className="text-sm text-gray-500">
            {pkg.location?.name}, {pkg.country?.name} &bull; {pkg.duration?.days}D/{pkg.duration?.nights}N
          </p>
        </div>
        <button
          onClick={handleSaveDetails}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {([
          { key: "edit", label: "Edit Details" },
          { key: "itinerary", label: "Itinerary" },
          { key: "preview", label: "Preview" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "edit" | "itinerary" | "preview")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Edit Details Tab */}
      {activeTab === "edit" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Bali Adventure Package"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Title <span className="text-gray-400 font-normal">(auto-generated, no spaces)</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") })}
                    placeholder="e.g. bali-adventure-package"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                  {form.slug && (
                    <p className="text-xs text-gray-500 mt-1.5">
                      URL: <span className="font-mono text-orange-600">/packages/{form.slug}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    placeholder="Describe the package experience..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value, location: "" })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    >
                      <option value="">Select</option>
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
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    >
                      <option value="">Select</option>
                      {filteredLocations.map((loc) => (
                        <option key={loc._id} value={loc._id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Type *</label>
                    <select
                      value={form.travelType}
                      onChange={(e) => setForm({ ...form, travelType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    >
                      <option value="">Select</option>
                      {travelTypes.map((t) => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Duration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Pricing & Duration</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days *</label>
                  <input
                    type="number"
                    value={form.days}
                    onChange={(e) => setForm({ ...form, days: e.target.value })}
                    min="1"
                    placeholder="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nights *</label>
                  <input
                    type="number"
                    value={form.nights}
                    onChange={(e) => setForm({ ...form, nights: e.target.value })}
                    min="0"
                    placeholder="2"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>
              {discount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">{discount}% discount applied</span>
                </div>
              )}
            </div>

            {/* Highlights & Amenities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Highlights & Amenities</h3>
              <div className="space-y-5">
                <TagInput
                  label="Highlights"
                  items={highlights}
                  onAdd={(item) => setHighlights([...highlights, item])}
                  onRemove={(i) => setHighlights(highlights.filter((_, idx) => idx !== i))}
                  placeholder="Type a highlight and press Enter"
                  colorClass="bg-orange-50 text-orange-700"
                />
                <TagInput
                  label="Amenities"
                  items={amenities}
                  onAdd={(item) => setAmenities([...amenities, item])}
                  onRemove={(i) => setAmenities(amenities.filter((_, idx) => idx !== i))}
                  placeholder="Type an amenity and press Enter"
                  colorClass="bg-blue-50 text-blue-700"
                />
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Inclusions & Exclusions</h3>
              <div className="grid grid-cols-2 gap-6">
                <TagInput
                  label="Inclusions"
                  items={inclusions}
                  onAdd={(item) => setInclusions([...inclusions, item])}
                  onRemove={(i) => setInclusions(inclusions.filter((_, idx) => idx !== i))}
                  placeholder="Type and press Enter"
                  colorClass="bg-green-50 text-green-700"
                />
                <TagInput
                  label="Exclusions"
                  items={exclusions}
                  onAdd={(item) => setExclusions([...exclusions, item])}
                  onRemove={(i) => setExclusions(exclusions.filter((_, idx) => idx !== i))}
                  placeholder="Type and press Enter"
                  colorClass="bg-red-50 text-red-700"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-5">
            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Status</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Package</span>
              </label>
              {form.isFeatured && (
                <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-3">
                  This package will appear in the featured section.
                </p>
              )}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Images</h3>

              {/* Existing images from Cloudinary */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={getImageUrl(img)}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img)}
                        disabled={deletingImage === img}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {deletingImage === img && (
                        <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">Deleting...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* New images to upload */}
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {newImagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src}
                        alt={`New ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border-2 border-dashed border-orange-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-gray-700 hover:bg-gray-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-medium">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  id="pkg-images-edit"
                  className="hidden"
                />
                <label htmlFor="pkg-images-edit" className="cursor-pointer flex flex-col items-center gap-2">
                  <ImagePlus className="w-7 h-7 text-gray-400" />
                  <span className="text-xs text-gray-500">Click to add images</span>
                  <span className="text-[11px] text-gray-400">One or multiple files</span>
                </label>
              </div>

              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <p className="text-[11px] text-gray-400 mt-2 text-center">
                  {existingImages.length} saved &bull; {newImagePreviews.length} new to upload
                </p>
              )}
            </div>

            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl border border-orange-100 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Price</span>
                  <span className="font-semibold text-gray-900">₹{form.price || "—"}</span>
                </div>
                {strikePriceNum > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">MRP</span>
                    <span className="font-medium text-gray-400 line-through">₹{form.strikePrice}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-bold text-green-600">{discount}% OFF</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium text-gray-900">{form.days || "—"}D / {form.nights || "—"}N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Highlights</span>
                  <span className="font-medium text-gray-900">{highlights.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Itinerary</span>
                  <span className="font-medium text-gray-900">{itinerary.length} days</span>
                </div>
                {itineraryMismatch && (
                  <div className="mt-3 px-3 py-3 bg-red-50 border-2 border-red-300 rounded-xl">
                    <p className="text-sm font-bold text-red-700">⚠️ Mismatch!</p>
                    <p className="text-xs text-red-600 mt-0.5">Days ({daysNum}) ≠ Itinerary ({itinerary.length})</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Itinerary Tab */}
      {activeTab === "itinerary" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Day-wise Itinerary</h3>
              <p className="text-sm text-gray-500">Build the trip schedule day by day</p>
            </div>
            <button
              onClick={handleAddDay}
              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Day
            </button>
          </div>

          {itineraryMismatch && (
            <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border-2 border-red-300 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-bold text-red-700">Itinerary Mismatch Detected!</p>
                <p className="text-sm text-red-600 mt-0.5">
                  Package duration is <span className="font-bold underline">{daysNum} days</span> but itinerary has <span className="font-bold underline">{itinerary.length} days</span>. Please make them equal.
                </p>
              </div>
            </div>
          )}

          {itinerary.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No itinerary days yet</p>
              <p className="text-gray-400 text-sm mt-1">Click &quot;Add Day&quot; to build the trip schedule.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {itinerary.map((day, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  {editingDay === index ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{day.day}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">Day {day.day}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveDay(index)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg hover:bg-green-100"
                          >
                            <Check className="w-3 h-3" /> Done
                          </button>
                          <button
                            onClick={() => setEditingDay(null)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={dayForm.title}
                        onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
                        placeholder="Day title (e.g. Arrival & City Tour)"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                      />
                      <textarea
                        value={dayForm.description}
                        onChange={(e) => setDayForm({ ...dayForm, description: e.target.value })}
                        placeholder="Describe what happens on this day..."
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
                      />
                      <input
                        type="text"
                        value={dayForm.activities}
                        onChange={(e) => setDayForm({ ...dayForm, activities: e.target.value })}
                        placeholder="Activities (comma separated)"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                      />
                      {/* Itinerary Day Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Day Image</label>
                        {(itineraryImagePreviews[index] || day.image) ? (
                          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 group">
                            <img
                              src={itineraryImagePreviews[index] || getImageUrl(day.image!)}
                              alt={`Day ${day.day}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              <label
                                htmlFor={`itinerary-img-${index}`}
                                className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-100"
                              >
                                Change
                              </label>
                              <button
                                type="button"
                                onClick={() => handleRemoveItineraryImage(index)}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                            {itineraryImagePreviews[index] && (
                              <span className="absolute top-2 left-2 text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-medium">
                                New
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                            <label htmlFor={`itinerary-img-${index}`} className="cursor-pointer flex flex-col items-center gap-1.5">
                              <ImagePlus className="w-6 h-6 text-gray-400" />
                              <span className="text-xs text-gray-500">Click to add day image</span>
                            </label>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          id={`itinerary-img-${index}`}
                          className="hidden"
                          onChange={(e) => handleItineraryImageChange(index, e)}
                        />
                      </div>
                    </div>

                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-orange-600">{day.day}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{day.title || "Untitled Day"}</h4>
                          {day.description && <p className="text-sm text-gray-500 mt-1">{day.description}</p>}
                          {day.activities?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {day.activities.map((act, ai) => (
                                <span key={ai} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">{act}</span>
                              ))}
                            </div>
                          )}
                          {(itineraryImagePreviews[index] || day.image) && (
                            <div className="mt-3 w-full max-w-xs h-28 rounded-lg overflow-hidden border border-gray-100">
                              <img
                                src={itineraryImagePreviews[index] || getImageUrl(day.image!)}
                                alt={`Day ${day.day}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingDay(index);
                            setDayForm({
                              title: day.title,
                              description: day.description,
                              activities: day.activities?.join(", ") || "",
                            });
                          }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDay(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="bg-gray-50 -mx-6 -mb-6 px-6 pb-6 pt-4 rounded-b-2xl">
          {/* Title & Meta */}
          <div className="max-w-5xl mx-auto pb-5">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {form.isFeatured && (
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
              )}
              <span className="text-orange-600 text-sm uppercase tracking-wider font-semibold">
                {travelTypes.find((t) => t._id === form.travelType)?.name || "Travel Type"}
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">{form.title || "Package Title"}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {filteredLocations.find((l) => l._id === form.location)?.name || "Location"},{" "}
                {countries.find((c) => c._id === form.country)?.name || "Country"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {form.days || "—"}D / {form.nights || "—"}N
              </span>
            </div>
          </div>

          {/* Image Gallery + Price Card */}
          <div className="max-w-5xl mx-auto pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image Gallery */}
              <div className="lg:col-span-2">
                <div className="flex gap-3">
                  <div className="relative rounded-2xl overflow-hidden bg-gray-100 flex-1 aspect-[4/3]">
                    {(existingImages.length > 0 || newImagePreviews.length > 0) ? (
                      <img src={existingImages.length > 0 ? getImageUrl(existingImages[0]) : newImagePreviews[0]} alt={form.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                    {(existingImages.length + newImagePreviews.length) > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        1 / {existingImages.length + newImagePreviews.length}
                      </div>
                    )}
                  </div>
                  {(existingImages.length + newImagePreviews.length) > 1 && (
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[280px]">
                      {[...existingImages.map((img) => getImageUrl(img)), ...newImagePreviews].map((img, idx) => (
                        <div key={idx} className={`shrink-0 w-[56px] h-[56px] rounded-lg overflow-hidden ${idx === 0 ? "ring-2 ring-orange-500 ring-offset-1" : "opacity-60"}`}>
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-gray-900">₹{form.price || "0"}</span>
                    {strikePriceNum > 0 && strikePriceNum > priceNum && (
                      <span className="text-lg text-gray-400 line-through">₹{form.strikePrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">per person</p>
                  {discount > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                      🔥 Save ₹{(strikePriceNum - priceNum).toLocaleString()} ({discount}% OFF)
                    </div>
                  )}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700">{form.days || "—"}D / {form.nights || "—"}N</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700">
                        {filteredLocations.find((l) => l._id === form.location)?.name || "Location"},{" "}
                        {countries.find((c) => c._id === form.country)?.name || "Country"}
                      </span>
                    </div>
                  </div>
                  {highlights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      {highlights.slice(0, 5).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          <span className="text-sm text-gray-600">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="w-full mt-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm text-center py-3 rounded-xl shadow-lg shadow-orange-500/20">
                    Book Now
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                {form.description && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About This Package</h2>
                    <p className="text-gray-600 leading-relaxed text-sm">{form.description}</p>
                    {amenities.length > 0 && (
                      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {amenities.map((a, i) => (
                          <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                            <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="text-xs font-medium text-gray-700">{a}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Inclusions & Exclusions */}
                {(inclusions.length > 0 || exclusions.length > 0) && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {inclusions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-green-700 mb-3 text-sm">Inclusions</h3>
                          <ul className="space-y-2">
                            {inclusions.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="w-4 h-4 text-green-500 shrink-0" /> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {exclusions.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-red-700 mb-3 text-sm">Exclusions</h3>
                          <ul className="space-y-2">
                            {exclusions.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="text-red-500 text-xs font-bold">✗</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                {itinerary.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-4.5 h-4.5 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Day-by-Day Itinerary</h2>
                        <p className="text-xs text-gray-500">{itinerary.length} days of adventure</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {itinerary.map((day, idx) => (
                        <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
                          <div className="flex items-center gap-4 px-4 py-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs font-bold rounded-lg flex items-center justify-center shrink-0">
                              {day.day}
                            </span>
                            <span className="font-semibold text-gray-900 text-sm">{day.title || "Untitled"}</span>
                          </div>
                          {(day.description || (day.activities && day.activities.length > 0) || itineraryImagePreviews[idx] || day.image) && (
                            <div className="px-4 pb-3 pl-16">
                              {(itineraryImagePreviews[idx] || day.image) && (
                                <div className="mb-2 w-full h-36 rounded-lg overflow-hidden">
                                  <img
                                    src={itineraryImagePreviews[idx] || getImageUrl(day.image!)}
                                    alt={`Day ${day.day}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {day.description && <p className="text-gray-600 text-xs leading-relaxed">{day.description}</p>}
                              {day.activities && day.activities.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {day.activities.map((act, ai) => (
                                    <span key={ai} className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[11px] font-medium rounded-md">{act}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right sidebar placeholder (booking form area) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 mb-1">Book This Package</h3>
                  <p className="text-xs text-gray-500 mb-4">Fill in your details and we&apos;ll get back to you within 24 hours.</p>
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="h-10 bg-gray-100 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-10 bg-gray-100 rounded-xl" />
                      <div className="h-10 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-20 bg-gray-100 rounded-xl" />
                    <div className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm text-center py-2.5 rounded-xl">
                      Request Booking
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-3">No payment required now. We&apos;ll confirm availability first.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Image Confirmation Modal */}
      {confirmDeleteImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDeleteImage(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Image?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will permanently remove the image. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmDeleteImage(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmImageDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
