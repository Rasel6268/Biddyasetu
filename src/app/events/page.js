"use client";

import { useState } from "react";
import { upcomingEvents } from "@/lib/data/demo";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  CheckCircle,
  X,
  Sparkles,
} from "lucide-react";

const typeColors = {
  Reunion: {
    bg: "bg-[rgba(6,163,236,0.1)]",
    color: "text-[var(--primary-dark)]",
    border: "border-[var(--primary)]"
  },
  Ceremony: {
    bg: "bg-[rgba(22,163,74,0.1)]",
    color: "text-[var(--success)]",
    border: "border-[var(--success)]"
  },
  Workshop: {
    bg: "bg-[rgba(124,58,237,0.1)]",
    color: "text-[#7c3aed]",
    border: "border-[#7c3aed]"
  },
  Fundraiser: {
    bg: "bg-[rgba(250,228,6,0.15)]",
    color: "text-[#854d0e]",
    border: "border-[#f59e0b]"
  },
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = ["all", "Reunion", "Ceremony", "Workshop", "Fundraiser"];

  const filteredEvents = upcomingEvents.filter((ev) => {
    if (selectedType !== "all" && ev.type !== selectedType) return false;
    if (
      search &&
      !ev.title.toLowerCase().includes(search.toLowerCase()) &&
      !ev.venue.toLowerCase().includes(search.toLowerCase()) &&
      !ev.desc.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleRegister = (id) => {
    setRegisteredEvents((prev) => ({ ...prev, [id]: true }));
    setActiveModalEvent(null);
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0284c7] via-[#06A3EC] to-[#38bdf8] py-[4.5rem] px-6 pb-14 text-center text-white">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.12) 0%, transparent 40%),
              radial-gradient(circle at 80% 20%, rgba(250,228,6,0.15) 0%, transparent 40%)
            `,
          }}
        />
        <div className="relative z-10 max-w-[760px] mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/16 border border-white/30 text-[0.8125rem] font-semibold backdrop-blur-sm mb-4">
            <Sparkles size={14} color="#fde047" />
            Official Gatherings & Programs
          </span>
          <h1 className="text-[clamp(2.25rem,5vw,3.25rem)] font-extrabold mb-3 tracking-tight">
            Events & Reunions
          </h1>
          <p className="text-[1.0625rem] opacity-90 leading-relaxed max-w-[600px] mx-auto">
            Stay connected through batch reunions, skill-building workshops,
            award ceremonies, and community fundraisers.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-[76px] z-30 bg-[var(--surface)] px-6 py-5 border-b border-[var(--border)] shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1000px] mx-auto flex gap-4 items-center flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[240px] relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search events by title, venue, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-10 pr-3.5 rounded-lg border-[1.5px] border-[var(--border)] bg-[var(--background)] text-sm outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => {
              const isSelected = selectedType === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all duration-150 ${isSelected
                    ? "bg-[var(--primary)] text-white border border-[var(--primary)] shadow-sm"
                    : "bg-white text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                >
                  {cat === "all" ? "All Events" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-6 bg-[var(--background)] min-h-[60vh]">
        <div className="max-w-[1200px] mx-auto">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-[var(--border)] text-[var(--text-muted)]">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="font-bold text-lg text-[var(--text)] mb-2">
                No events found
              </h3>
              <p className="text-sm">
                Try changing your filter category or search keyword.
              </p>
            </div>
          ) : (
            /* Grid Layout: 1 column on mobile, 2 on tablet, 3 on desktop */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const tc = typeColors[event.type] || typeColors.Reunion;
                const d = new Date(event.date);
                const day = d.getDate();
                const month = d.toLocaleDateString("en-BD", { month: "short" });
                const year = d.getFullYear();
                const isRegistered = !!registeredEvents[event.id];

                return (
                  <article
                    key={event.id}
                    className="bg-white rounded-[1.125rem] border-[1.5px] border-[var(--border)] p-6 flex flex-col hover:shadow-lg hover:border-[var(--primary)] transition-all duration-200"
                  >
                    {/* Date Block */}
                    <div className="text-center bg-gradient-to-br from-[#0369a1] to-[#06A3EC] rounded-xl px-5 py-4 text-white min-w-[75px] self-start mb-4 shadow-[0_4px_14px_rgba(6,163,236,0.25)]">
                      <div className="text-[1.85rem] font-black leading-none">
                        {day}
                      </div>
                      <div className="text-xs font-bold uppercase opacity-90">
                        {month}
                      </div>
                      <div className="text-[0.7rem] opacity-75">
                        {year}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-1.5 flex-wrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tc.bg} ${tc.color} ${tc.border}30`}
                        >
                          {event.type}
                        </span>
                      </div>

                      <h2 className="font-extrabold text-xl text-[var(--text)] mb-2 leading-tight line-clamp-2">
                        {event.title}
                      </h2>

                      <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-3 line-clamp-2">
                        {event.desc}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="flex items-center gap-1.5 text-[0.8125rem] text-[var(--text-muted)]">
                          <Clock size={14} className="text-[var(--primary)] shrink-0" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-[0.8125rem] text-[var(--text-muted)]">
                          <MapPin size={14} className="text-[var(--primary)] shrink-0" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-1.5 text-[0.8125rem] text-[var(--text-muted)]">
                          <Users size={14} className="text-[var(--primary)] shrink-0" />
                          {event.attending + (isRegistered ? 1 : 0)} attending
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      {isRegistered ? (
                        <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[rgba(22,163,74,0.1)] text-[var(--success)] font-bold text-sm w-full justify-center">
                          <CheckCircle size={16} />
                          RSVP Confirmed
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveModalEvent(event)}
                          className="w-full px-5 py-2.5 rounded-lg border-[1.5px] border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white font-bold text-sm transition-all duration-200"
                        >
                          Register RSVP
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RSVP Modal */}
      {activeModalEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(15,23,42,0.65)] backdrop-blur-sm"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="bg-white rounded-[1.125rem] max-w-[500px] w-full p-8 relative shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-5 right-5 bg-[var(--background)] border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-[var(--border)] transition-colors"
            >
              <X size={18} />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(6,163,236,0.1)] text-[var(--primary-dark)] text-xs font-bold mb-3">
              <Sparkles size={12} />
              Confirm Attendance
            </span>

            <h3 className="text-[1.3rem] font-extrabold text-[var(--text)] mb-2">
              {activeModalEvent.title}
            </h3>

            <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)] mb-5">
              <div className="text-sm text-[var(--text)] font-semibold mb-1.5">
                📅 Date: {new Date(activeModalEvent.date).toLocaleDateString("en-BD", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })} ({activeModalEvent.time})
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                📍 Venue: {activeModalEvent.venue}
              </div>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-6">
              Confirm your RSVP to receive schedule updates, entry instructions,
              and badge registration details.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-5 py-2.5 rounded-lg border border-[var(--border)] bg-white text-sm font-semibold cursor-pointer hover:bg-[var(--background)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRegister(activeModalEvent.id)}
                className="px-6 py-2.5 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Confirm RSVP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}