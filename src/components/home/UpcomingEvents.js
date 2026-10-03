"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle, X, Sparkles, Ticket } from "lucide-react";
import { useEvents, useRegisterEvent } from "@/hooks/useQueries";
import { useAuth } from "@/context/AuthContext";
import ScrollAnimation from "@/components/ui/ScrollAnimation";

const typeColors = {
  Reunion: { bg: "rgba(6,163,236,0.1)", color: "var(--primary-dark)", border: "var(--primary)" },
  Ceremony: { bg: "rgba(22,163,74,0.1)", color: "var(--success)", border: "var(--success)" },
  Workshop: { bg: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "#7c3aed" },
  Fundraiser: { bg: "rgba(250,228,6,0.15)", color: "#854d0e", border: "#f59e0b" },
  Sports: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", border: "#ef4444" },
  General: { bg: "rgba(100,116,139,0.1)", color: "#475569", border: "#94a3b8" },
};

export default function UpcomingEvents() {
  const { user } = useAuth();
  const [activeEventModal, setActiveEventModal] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    batch: "",
  });

  const { data: events = [], isLoading } = useEvents({ limit: 3 });
  const registerMutation = useRegisterEvent();

  const handleOpenModal = (event) => {
    setActiveEventModal(event);
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      batch: user?.batch || "",
    });
    setGuestCount(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!activeEventModal) return;

    try {
      await registerMutation.mutateAsync({
        eventId: activeEventModal._id || activeEventModal.id,
        memberData: {
          name: formData.name || user?.name,
          phone: formData.phone || user?.phone,
          email: formData.email || user?.email,
          batch: formData.batch || user?.batch,
          guestCount: Number(guestCount),
        },
      });
      setActiveEventModal(null);
    } catch (err) {
      // Handled in mutation toast
    }
  };

  const isUserRegistered = (event) => {
    if (!event || !user || !event.attendees) return false;
    return event.attendees.some(
      (a) =>
        (a.user && a.user.toString() === user._id) ||
        (user.phone && a.phone && a.phone.includes(user.phone.replace(/\D/g, "")))
    );
  };

  return (
    <section className="section-padding" style={{ background: "var(--surface)", position: "relative" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Section Header */}
        <ScrollAnimation animation="fade-in-up">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1.25rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>
                <Calendar size={12} /> Upcoming Programs
              </span>
              <h2 className="section-heading">Events & Reunions</h2>
              <p className="section-subheading" style={{ marginTop: "0.5rem" }}>
                Join fellow alumni at upcoming campus reunions, workshops, and ceremonial gatherings.
              </p>
            </div>
            <Link href="/events" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              All Events ({events.length}) <ArrowRight size={15} />
            </Link>
          </div>
        </ScrollAnimation>

        {/* Events Grid */}
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card"
                style={{
                  padding: "1.75rem",
                  borderRadius: "1rem",
                  border: "1.5px solid var(--border)",
                  height: "260px",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "3rem 2rem",
              textAlign: "center",
              borderRadius: "1.25rem",
              border: "2px dashed var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <Calendar size={36} color="var(--primary)" style={{ margin: "0 auto 0.75rem", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>
              No Upcoming Events Scheduled Yet
            </h3>
            <p style={{ fontSize: "0.875rem" }}>
              New programs and reunions will appear here as soon as they are announced by the committee.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {events.slice(0, 3).map((event, i) => {
              const eventType = event.eventType || event.type || "Reunion";
              const typeStyle = typeColors[eventType] || typeColors.Reunion;
              const d = new Date(event.date);
              const isValidDate = !isNaN(d.getTime());
              const day = isValidDate ? d.getDate() : "—";
              const month = isValidDate ? d.toLocaleDateString("en-BD", { month: "short" }) : "—";
              const isRegistered = isUserRegistered(event);
              const confirmedCount = event.attendees?.filter((a) => a.status === "confirmed")?.length || 0;

              return (
                <ScrollAnimation key={event._id || event.id || i} animation="fade-in-up" delay={i * 90}>
                  <article
                    className="card interactive-card"
                    style={{
                      padding: "1.75rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      borderRadius: "1rem",
                      border: "1.5px solid var(--border)",
                    }}
                  >
                    <div>
                      {/* Date Block & Type Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                        <div
                          style={{
                            textAlign: "center",
                            background: "linear-gradient(135deg, #0369a1, #06A3EC)",
                            borderRadius: "0.75rem",
                            padding: "0.6rem 0.9rem",
                            color: "white",
                            minWidth: "58px",
                            boxShadow: "0 4px 10px rgba(6,163,236,0.25)",
                          }}
                        >
                          <div style={{ fontSize: "1.45rem", fontWeight: 900, lineHeight: 1 }}>{day}</div>
                          <div style={{ fontSize: "0.7rem", fontWeight: 700, opacity: 0.9, textTransform: "uppercase" }}>
                            {month}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            background: typeStyle.bg,
                            color: typeStyle.color,
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            border: `1px solid ${typeStyle.border}30`,
                          }}
                        >
                          {eventType}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", marginBottom: "0.6rem", lineHeight: 1.35 }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                        {event.description || event.desc}
                      </p>

                      {/* Meta info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                          <Clock size={14} color="var(--primary)" /> {event.time || "09:00 AM - 05:00 PM"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                          <MapPin size={14} color="var(--primary)" /> {event.venue}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                          <Users size={14} color="var(--primary)" /> {confirmedCount} attending
                        </span>
                      </div>
                    </div>

                    {/* Register Action Button */}
                    {isRegistered ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.65rem",
                          borderRadius: "0.5rem",
                          background: "rgba(22,163,74,0.1)",
                          color: "var(--success)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        }}
                      >
                        <CheckCircle size={16} /> RSVP Confirmed!
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(event)}
                        className="btn-outline"
                        style={{
                          width: "100%",
                          padding: "0.65rem",
                          borderRadius: "0.5rem",
                          textAlign: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                        }}
                      >
                        RSVP / Register Attendance
                      </button>
                    )}
                  </article>
                </ScrollAnimation>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive RSVP Modal */}
      {activeEventModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setActiveEventModal(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "1rem",
              maxWidth: "500px",
              width: "100%",
              padding: "2rem",
              position: "relative",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveEventModal(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "var(--background)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(6,163,236,0.1)",
                color: "var(--primary-dark)",
                fontSize: "0.75rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              <Sparkles size={12} /> Confirm Attendance
            </span>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
              {activeEventModal.title}
            </h3>

            <div style={{ background: "var(--background)", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--text)", fontWeight: 600, marginBottom: "0.35rem" }}>
                📅 Date: {new Date(activeEventModal.date).toLocaleDateString("en-BD", { day: "numeric", month: "long", year: "numeric" })} ({activeEventModal.time || "09:00 AM - 05:00 PM"})
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                📍 Venue: {activeEventModal.venue}
              </div>
            </div>

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full Name"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01700-000000"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveEventModal(null)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "white",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem", cursor: "pointer" }}
                >
                  {registerMutation.isPending ? "Confirming..." : "Confirm RSVP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
