"use client";

import { useState } from "react";
import { Calendar, Plus, MapPin, CheckCircle2, X } from "lucide-react";

export default function AdminEventsPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "09:00 AM - 05:00 PM",
    venue: "School Premises, Adarsha High School",
    targetCapacity: 300,
    fee: "Free",
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [events, setEvents] = useState([
    {
      id: "EVT-ADM-01",
      title: "Grand Annual Alumni Reunion 2026",
      date: "20 Dec 2026",
      time: "09:00 AM - 06:00 PM",
      venue: "School Premises, Adarsha High School, Kaitola",
      rsvpCount: 420,
      targetCapacity: 600,
      fee: "৳1,500 / Alumni",
      status: "Registration Open",
    },
    {
      id: "EVT-ADM-02",
      title: "Alumni Cricket & Football Tournament 2026",
      date: "15 Nov 2026",
      time: "08:30 AM - 05:00 PM",
      venue: "Kaitola Central Play Ground",
      rsvpCount: 180,
      targetCapacity: 250,
      fee: "৳500 / Player",
      status: "Registration Open",
    },
    {
      id: "EVT-ADM-03",
      title: "Higher Education & Tech Career Mentorship",
      date: "12 Oct 2026",
      time: "03:30 PM - 06:00 PM",
      venue: "School Auditorium & Virtual Stream",
      rsvpCount: 95,
      targetCapacity: 120,
      fee: "Free for Students & Alumni",
      status: "Published",
    },
  ]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const newE = {
      id: `EVT-ADM-0${events.length + 1}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      venue: newEvent.venue,
      rsvpCount: 0,
      targetCapacity: parseInt(newEvent.targetCapacity, 10) || 200,
      fee: newEvent.fee,
      status: "Published",
    };

    setEvents([newE, ...events]);
    setShowModal(false);
    triggerToast(`Event "${newE.title}" published successfully.`);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[130] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {events.map((e) => (
          <div
            key={e.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-100">
                  {e.status}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{e.id}</span>
              </div>

              <h4 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                {e.title}
              </h4>

              <div className="space-y-2 text-xs text-slate-600 mb-5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    {e.date} · {e.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{e.venue}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">RSVP Passes</span>
                  <span className="text-sky-700">
                    {e.rsvpCount} / {e.targetCapacity}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (e.rsvpCount / e.targetCapacity) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-slate-900">{e.fee}</span>
                <button
                  type="button"
                  onClick={() => triggerToast(`Attendee list exported for ${e.title}`)}
                  className="text-sky-600 hover:text-sky-700 font-bold"
                >
                  Export Roster →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Publish New Alumni Event</h3>
            <p className="text-xs text-slate-500 mb-5">
              Create an event with RSVP attendance passes.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. Winter Iftar & Alumni Get-Together"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Capacity
                  </label>
                  <input
                    type="number"
                    value={newEvent.targetCapacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, targetCapacity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Venue Location
                </label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ticket Fee
                </label>
                <input
                  type="text"
                  value={newEvent.fee}
                  onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })}
                  placeholder="e.g. ৳500 / Member or Free"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
