"use client";

import { useState } from "react";
import { Megaphone, Send, RefreshCw, CheckCircle2, X } from "lucide-react";

export default function AdminBroadcastPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [broadcastTarget, setBroadcastTarget] = useState("ALL");
  const [broadcastChannel, setBroadcastChannel] = useState("SMS & Email");
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [broadcasts, setBroadcasts] = useState([
    {
      id: "BC-104",
      subject: "Reminder: Annual General Meeting & Committee Election",
      target: "All Verified Alumni (842 Members)",
      channel: "SMS & Email",
      sentDate: "Today, 11:30 AM",
      deliveredRate: "99.2%",
    },
    {
      id: "BC-103",
      subject: "Emergency Blood Requirement: O+ for Adarsha School Student",
      target: "All Alumni in Dhaka & Brahmanbaria",
      channel: "Urgent SMS",
      sentDate: "03 Mar 2026",
      deliveredRate: "100%",
    },
    {
      id: "BC-102",
      subject: "Quarterly Financial Transparency Statement Published",
      target: "Executive & Life Members",
      channel: "Email Bulletin",
      sentDate: "01 Mar 2026",
      deliveredRate: "98.5%",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;

    const newBc = {
      id: `BC-${105 + broadcasts.length}`,
      subject: broadcastSubject,
      target:
        broadcastTarget === "ALL"
          ? "All Verified Alumni (842 Members)"
          : `Batch ${broadcastTarget} Alumni`,
      channel: broadcastChannel,
      sentDate: "Just now",
      deliveredRate: "Sending...",
    };

    setBroadcasts([newBc, ...broadcasts]);
    setShowModal(false);
    setBroadcastSubject("");
    setBroadcastMessage("");
    triggerToast("Broadcast queued and dispatched via gateways.");
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
            Communication Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Broadcast & Notice Dispatcher
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Compose New Broadcast</span>
        </button>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="divide-y divide-slate-100">
          {broadcasts.map((bc) => (
            <div
              key={bc.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] font-bold text-sky-700">
                    {bc.id}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{bc.subject}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Target: <strong>{bc.target}</strong> · Via {bc.channel} · Sent{" "}
                  {bc.sentDate}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                  Delivered {bc.deliveredRate}
                </span>
                <button
                  type="button"
                  onClick={() => triggerToast("Resending broadcast...")}
                  className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  title="Resend Broadcast"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
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

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Dispatch Organization Broadcast
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Send SMS or Email bulletin to alumni members.
            </p>

            <form onSubmit={handleSend} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="ALL">All Verified Alumni (842)</option>
                    <option value="2006">Batch 2006 Alumni</option>
                    <option value="1998">Batch 1998 Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Delivery Channel
                  </label>
                  <select
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option>SMS & Email</option>
                    <option>SMS Broadcast Only</option>
                    <option>Email Bulletin Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subject / Heading *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. Annual Alumni Reunion Ticket Booking Now Open"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type your official announcement here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Dispatch Broadcast Notice Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
