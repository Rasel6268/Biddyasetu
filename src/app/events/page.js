"use client";

import { useState, useMemo } from "react";
import { useEvents, useRegisterEvent } from "@/hooks/useQueries";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  CheckCircle,
  X,
  Sparkles,
  Ticket,
  ExternalLink,
  Share2,
  CalendarPlus,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Tag,
} from "lucide-react";

const typeColors = {
  Reunion: {
    bg: "bg-sky-50 text-sky-700 border-sky-200",
    badge: "bg-sky-600",
  },
  Ceremony: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badge: "bg-emerald-600",
  },
  Workshop: {
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    badge: "bg-purple-600",
  },
  Fundraiser: {
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    badge: "bg-amber-600",
  },
  Sports: {
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    badge: "bg-rose-600",
  },
  General: {
    bg: "bg-slate-50 text-slate-700 border-slate-200",
    badge: "bg-slate-600",
  },
};

export default function EventsPage() {
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form for guest/alumni registration
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    batch: "",
  });

  // Fetch live backend events
  const { data: backendEvents, isLoading, isError, refetch } = useEvents();
  const registerMutation = useRegisterEvent();

  const categories = ["all", "Reunion", "Sports", "Ceremony", "Workshop", "Fundraiser"];

  // Use only live backend events from database (NO demo data)
  const allEvents = useMemo(() => {
    if (backendEvents && Array.isArray(backendEvents)) {
      return backendEvents.map((ev) => ({
        id: ev._id || ev.id,
        title: ev.title,
        type: ev.eventType || ev.type || "Reunion",
        date: ev.date,
        time: ev.time || "09:00 AM - 05:00 PM",
        venue: ev.venue,
        desc: ev.description || ev.desc,
        attending: ev.attendees?.filter((a) => a.status === "confirmed")?.length || 0,
        capacity: ev.capacity || 500,
        fee: ev.fee || "Free",
        organizer: ev.organizer || "Biddyasetu Executive Committee",
        attendees: ev.attendees || [],
      }));
    }
    return [];
  }, [backendEvents]);

  // Filter events by type and search term
  const filteredEvents = useMemo(() => {
    return allEvents.filter((ev) => {
      if (selectedType !== "all" && ev.type?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = ev.title?.toLowerCase().includes(query);
        const matchesVenue = ev.venue?.toLowerCase().includes(query);
        const matchesDesc = ev.desc?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue && !matchesDesc) return false;
      }
      return true;
    });
  }, [allEvents, selectedType, search]);

  // Check if current user is registered for an event
  const isUserRegistered = (event) => {
    if (!event) return false;
    if (user && event.attendees) {
      const found = event.attendees.some(
        (a) =>
          (a.user && a.user.toString() === user._id) ||
          (user.phone && a.phone && a.phone.includes(user.phone.replace(/\D/g, "")))
      );
      if (found) return true;
    }
    return false;
  };

  const handleOpenModal = (event) => {
    setActiveModalEvent(event);
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      batch: user?.batch || "",
    });
    setGuestCount(1);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalEvent) return;

    try {
      await registerMutation.mutateAsync({
        eventId: activeModalEvent.id,
        memberData: {
          userId: user?._id || user?.id || null,
          name: formData.name || user?.name,
          phone: formData.phone || user?.phone,
          email: formData.email || user?.email,
          batch: formData.batch || user?.batch,
          guestCount: Number(guestCount),
        },
      });
      setActiveModalEvent(null);
    } catch (err) {
      // Handled in mutation onError toast
    }
  };

  const createGoogleCalendarLink = (event) => {
    if (!event) return "#";
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.desc}\n\nVenue: ${event.venue}\nOrganized by: ${event.organizer}`);
    const location = encodeURIComponent(event.venue);
    
    // Parse ISO date
    const d = new Date(event.date);
    const formattedDate = !isNaN(d.getTime())
      ? d.toISOString().replace(/-|:|\.\d+/g, "").slice(0, 8)
      : "20261220";

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${formattedDate}T030000Z/${formattedDate}T120000Z`;
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0284c7] via-[#06A3EC] to-[#38bdf8] py-16 sm:py-20 px-4 sm:px-6 text-center text-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(250,228,6,0.25) 0%, transparent 40%)`,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-yellow-300" />
            Official Gatherings & Programs
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Alumni Events & Reunions
          </h1>

          <p className="text-sm sm:text-base md:text-lg opacity-95 leading-relaxed max-w-2xl mx-auto font-medium">
            Stay connected through grand annual reunions, sports tournaments, career mentorship workshops, and student welfare galas.
          </p>
        </div>
      </section>

      {/* Sticky Filter & Search Bar */}
      <section className="sticky top-[76px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="flex-1 max-w-md relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title, venue, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 items-center no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedType.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedType(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-md shadow-sky-500/25 scale-[1.02]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  {cat === "all" ? "All Events" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-10 bg-slate-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="font-extrabold text-lg text-slate-800 mb-1">
              No events matched your search
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Try adjusting your category filter or search keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedType("all");
                setSearch("");
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const tc = typeColors[event.type] || typeColors.Reunion;
              const d = new Date(event.date);
              const isValidDate = !isNaN(d.getTime());
              const day = isValidDate ? d.getDate() : "20";
              const month = isValidDate
                ? d.toLocaleDateString("en-BD", { month: "short" })
                : "Dec";
              const year = isValidDate ? d.getFullYear() : "2026";
              const registered = isUserRegistered(event);

              return (
                <article
                  key={event.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-sky-300 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Accent Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header: Date Badge & Category */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="text-center bg-gradient-to-br from-sky-600 to-sky-800 rounded-2xl px-4 py-3 text-white shadow-md shadow-sky-600/20 shrink-0">
                        <div className="text-2xl font-black leading-none">{day}</div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-90 mt-0.5">
                          {month}
                        </div>
                        <div className="text-[9px] font-mono opacity-75">{year}</div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${tc.bg}`}
                        >
                          {event.type}
                        </span>

                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Ticket className="w-3 h-3 text-emerald-600" />
                          {event.fee}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="font-black text-lg text-slate-900 mb-2 leading-tight group-hover:text-sky-700 transition-colors line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-slate-600 text-xs leading-relaxed mb-5 line-clamp-3">
                      {event.desc}
                    </p>

                    {/* Metadata List */}
                    <div className="space-y-2.5 mb-6 text-xs text-slate-600 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-sky-600 shrink-0" />
                        <span className="truncate">{event.time}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin size={15} className="text-sky-600 shrink-0 mt-0.5" />
                        <span className="truncate">{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={15} className="text-sky-600 shrink-0" />
                        <span className="font-semibold text-slate-700">
                          {event.attending} Attending
                        </span>
                        <span className="text-[11px] text-slate-400">
                          / {event.capacity} seats
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    {registered ? (
                      <div className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                        <CheckCircle size={15} />
                        RSVP Confirmed
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(event)}
                        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:shadow-lg hover:shadow-sky-500/25"
                      >
                        <span>Register Attendance</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* RSVP Modal */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-sky-600" />
              Event Registration Pass
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-tight">
              {activeModalEvent.title}
            </h3>

            {/* Event Details Card */}
            <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-100 mb-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Calendar size={14} className="text-sky-600" />
                <span>
                  {new Date(activeModalEvent.date).toLocaleDateString("en-BD", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {activeModalEvent.time}
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <MapPin size={14} className="text-sky-600 shrink-0 mt-0.5" />
                <span>{activeModalEvent.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Ticket size={14} className="text-sky-600 shrink-0" />
                <span>Ticket / Admission: <strong>{activeModalEvent.fee}</strong></span>
              </div>
            </div>

            {/* RSVP Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Md. Rafiqul Islam"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01700-000000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alumni Batch
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    placeholder="e.g. 2012 / Alumni"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Number of Attendees (Self + Guests)
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500 bg-white"
                >
                  <option value={1}>1 Person (Just Me)</option>
                  <option value={2}>2 Persons (Me + 1 Guest)</option>
                  <option value={3}>3 Persons (Me + 2 Family)</option>
                  <option value={4}>4 Persons (Family Group)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={createGoogleCalendarLink(activeModalEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <CalendarPlus size={15} />
                  Google Calendar
                </a>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition cursor-pointer disabled:opacity-60"
                >
                  {registerMutation.isPending ? (
                    <span>Confirming RSVP...</span>
                  ) : (
                    <>
                      <CheckCircle size={15} />
                      Confirm RSVP Attendance
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}