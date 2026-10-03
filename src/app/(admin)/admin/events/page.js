"use client";

import { useState } from "react";
import { Calendar, Plus, MapPin, CheckCircle2, X, Trash2, Users, Clock, Ticket, Sparkles } from "lucide-react";
import { useEvents, useCreateEvent, useDeleteEvent } from "@/hooks/useQueries";
import { showError, showSuccess } from "@/utility/toast";

export default function AdminEventsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    eventType: "Reunion",
    date: "",
    time: "09:00 AM - 05:00 PM",
    venue: "School Premises, Adarsha High School, Kaitola",
    capacity: 300,
    fee: "Free",
    featured: false,
  });

  const { data: events, isLoading, refetch } = useEvents();
  const createMutation = useCreateEvent();
  const deleteMutation = useDeleteEvent();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
      showError("Please provide event title, date, and venue.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: newEvent.title,
        description: newEvent.description || `${newEvent.title} organized by Biddyasetu Alumni Organization.`,
        eventType: newEvent.eventType,
        date: newEvent.date,
        time: newEvent.time,
        venue: newEvent.venue,
        capacity: Number(newEvent.capacity) || 300,
        fee: newEvent.fee,
        featured: newEvent.featured,
      });

      setShowModal(false);
      setNewEvent({
        title: "",
        description: "",
        eventType: "Reunion",
        date: "",
        time: "09:00 AM - 05:00 PM",
        venue: "School Premises, Adarsha High School, Kaitola",
        capacity: 300,
        fee: "Free",
        featured: false,
      });
    } catch (err) {
      // Handled in mutation toast
    }
  };

  const handleDelete = async (id, title) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        // Handled in mutation toast
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Reunion & Activities
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Events & Reunions Orchestrator
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : !events || events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No Events Published Yet</h3>
          <p className="text-slate-400 text-xs mb-4">Create your first alumni event or reunion program.</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map((e) => {
            const confirmedCount = e.attendees?.filter((a) => a.status === "confirmed")?.length || 0;

            return (
              <div
                key={e._id || e.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-100">
                      {e.eventType || "Reunion"}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600">
                      {e.status || "upcoming"}
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base mb-2 line-clamp-2">
                    {e.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{e.date} · {e.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate">{e.venue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span>{e.fee || "Free"}</span>
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Registered RSVPs</span>
                      <span className="text-sky-700">{confirmedCount} / {e.capacity || 500}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((confirmedCount / (e.capacity || 500)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEventAttendees(e)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Attendees ({confirmedCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(e._id || e.id, e.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Create New Alumni Event</h3>
            <p className="text-slate-500 text-xs mb-5">Publish an event to the public directory and alumni portal.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Grand Annual Alumni Reunion 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detailed description of the program, agenda, and activities..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Type
                  </label>
                  <select
                    value={newEvent.eventType}
                    onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Reunion">Reunion</option>
                    <option value="Sports">Sports Tournament</option>
                    <option value="Workshop">Workshop / Mentorship</option>
                    <option value="Ceremony">Ceremony / Gala</option>
                    <option value="Fundraiser">Fundraiser</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  placeholder="School Premises, Adarsha High School, Kaitola"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registration / Admission Fee
                </label>
                <input
                  type="text"
                  value={newEvent.fee}
                  onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                  placeholder="e.g. Free or ৳1,500 / Alumni"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition disabled:opacity-60"
                >
                  {createMutation.isPending ? "Publishing..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {selectedEventAttendees && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedEventAttendees(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedEventAttendees(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">
              {selectedEventAttendees.title} — Attendees
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              List of registered alumni & guests for this event.
            </p>

            {!selectedEventAttendees.attendees || selectedEventAttendees.attendees.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No attendees have registered for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Batch</th>
                      <th className="py-2.5 px-3">Guests</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedEventAttendees.attendees.map((a, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-bold text-slate-900">{a.name}</td>
                        <td className="py-3 px-3 font-mono">{a.phone}</td>
                        <td className="py-3 px-3">{a.batch || "Alumni"}</td>
                        <td className="py-3 px-3">{a.guestCount || 1}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {a.status || "confirmed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
