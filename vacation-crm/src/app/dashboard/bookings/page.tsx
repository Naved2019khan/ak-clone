"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  Trash2,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import api from "@/lib/api";

interface BookingItem {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  travelers: number;
  duration: string;
  travelDate: string;
  specialRequests: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string;
  createdAt: string;
  package: {
    _id: string;
    title: string;
    price: number;
    duration: { days: number; nights: number };
    country?: { name: string };
    location?: { name: string };
  } | null;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  completed: { label: "Completed", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.package?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(true);
    try {
      const res = await api.put(`/bookings/${id}`, { status });
      if (res.data.success) {
        setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: status as BookingItem["status"] } : b)));
        if (selectedBooking?._id === id) {
          setSelectedBooking({ ...selectedBooking, status: status as BookingItem["status"] });
        }
      }
    } catch {
      // Silently fail
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        if (selectedBooking?._id === id) {
          setDetailOpen(false);
          setSelectedBooking(null);
        }
      }
    } catch {
      // Silently fail
    }
  };

  const openDetail = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-orange-500" />
            Bookings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer booking requests</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <p className="text-xs text-amber-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <p className="text-xs text-green-600 font-medium">Confirmed</p>
          <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs text-blue-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-blue-700">{stats.completed}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or package..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "cancelled", "completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                filterStatus === s
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No bookings found</p>
          <p className="text-sm text-gray-400 mt-1">Bookings from the website will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Package</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Travel Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Travelers</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Booked On</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusConfig[booking.status].icon;
                  return (
                    <tr key={booking._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.fullName}</p>
                          <p className="text-xs text-gray-400">{booking.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-700 truncate max-w-[200px]">
                          {booking.package?.title || "Deleted Package"}
                        </p>
                        {booking.package?.location && (
                          <p className="text-xs text-gray-400">{booking.package.location.name}, {booking.package.country?.name}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{booking.travelDate || "—"}</td>
                      <td className="px-5 py-4 text-gray-600">{booking.travelers}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[booking.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[booking.status].label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(booking.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetail(booking)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {detailOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="shrink-0 border-b border-gray-100 px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
              <button
                onClick={() => setDetailOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {(["pending", "confirmed", "cancelled", "completed"] as const).map((s) => {
                    const config = statusConfig[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedBooking._id, s)}
                        disabled={updating}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                          selectedBooking.status === s
                            ? config.color + " ring-2 ring-offset-1 ring-current"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Customer Information</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedBooking.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${selectedBooking.email}`} className="text-sm text-orange-600 hover:underline">{selectedBooking.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${selectedBooking.phone}`} className="text-sm text-orange-600 hover:underline">{selectedBooking.phone}</a>
                  </div>
                </div>
              </div>

              {/* Package Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Package Details</h3>
                <p className="text-sm font-medium text-gray-700">{selectedBooking.package?.title || "Deleted Package"}</p>
                {selectedBooking.package && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedBooking.package.location?.name}, {selectedBooking.package.country?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">₹{selectedBooking.package.price?.toLocaleString()}/person</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Travel Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Travel Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedBooking.travelers} traveler{selectedBooking.travelers > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedBooking.duration || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{selectedBooking.travelDate || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-gray-400">
                <p>Booked on: {formatDate(selectedBooking.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
