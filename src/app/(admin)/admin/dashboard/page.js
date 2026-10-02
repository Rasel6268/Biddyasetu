"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  CreditCard,
  GraduationCap,
  Calendar,
  Megaphone,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  Eye,
  Send,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardOverview() {
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("ALL");

  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    batch: "2010",
    phone: "",
    email: "",
    profession: "",
    tier: "General Member",
  });

  const triggerSuccessMsg = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 4000);
  };

  // Mock Approvals Queue
  const [pendingMembers, setPendingMembers] = useState([
  ]);

  // Mock Payments Queue
  const [recentPayments, setRecentPayments] = useState([

  ]);

  const handleApprove = (id) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== id));
    triggerSuccessMsg(`Member ${id} approved & verified!`);
  };

  const handleVerifyTxn = (id) => {
    setRecentPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p))
    );
    triggerSuccessMsg(`Transaction ${id} verified & reconciled.`);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastMessage) return;
    setShowBroadcastModal(false);
    setBroadcastSubject("");
    setBroadcastMessage("");
    triggerSuccessMsg("Broadcast notice dispatched to members via SMS and Email.");
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.phone) return;
    setShowAddMemberModal(false);
    setNewMemberForm({
      name: "",
      batch: "2010",
      phone: "",
      email: "",
      profession: "",
      tier: "General Member",
    });
    triggerSuccessMsg(`New alumni member ${newMemberForm.name} added successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-[130] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs font-bold">{actionSuccessMsg}</span>
          <button
            type="button"
            onClick={() => setActionSuccessMsg("")}
            className="ml-2 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Biddyasetu Alumni Organization
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Executive Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-sky-600" />
            <span>Broadcast Notice</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddMemberModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* ─── 4 TOP KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Alumni
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">864</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+28 registrations this month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {pendingMembers.length}
          </div>
          <Link
            href="/admin/approvals"
            className="text-xs text-amber-700 font-bold hover:underline"
          >
            Review verification queue →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Welfare Funds
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">৳48.50 Lakh</div>
          <div className="text-xs text-slate-500 font-medium">
            ৳1,42,000 collected this month
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Scholarships
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">124 Students</div>
          <div className="text-xs text-purple-700 font-semibold">
            Adarsha High School Beneficiaries
          </div>
        </div>
      </div>

      {/* ─── URGENT QUEUE & BROADCAST DISPATCHER ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals Quick Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Urgent Member Verification Queue
              </h3>
              <p className="text-xs text-slate-500">
                New alumni accounts awaiting batch and phone verification.
              </p>
            </div>
            <Link
              href="/admin/approvals"
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              View Full Queue ({pendingMembers.length}) →
            </Link>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All registered members are verified!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingMembers.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.batch.slice(2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">{m.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {m.phone} · Batch {m.batch} · {m.profession}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(m.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Approve
                    </button>
                    <Link
                      href="/admin/approvals"
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Broadcast Announcement Tool */}
        <div className="bg-gradient-to-br from-slate-900 to-sky-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-sky-300 font-bold text-[10px] border border-white/10 mb-4">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Executive Tools
            </div>
            <h3 className="font-black text-lg text-white mb-2">
              Broadcast to 850+ Alumni
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Dispatch emergency blood requests, reunion updates, or general meeting
              announcements directly via SMS and Email.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              Compose SMS / Email Broadcast
            </button>

            <Link
              href="/admin/events"
              className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              Manage Upcoming Events
            </Link>
          </div>
        </div>
      </div>

      {/* ─── RECENT CONTRIBUTION VOUCHERS TABLE ─── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Recent Member Contribution Vouchers
            </h3>
            <p className="text-xs text-slate-500">
              bKash, Nagad, Rocket, and Bank transfer submissions.
            </p>
          </div>
          <Link
            href="/admin/payments"
            className="text-xs font-bold text-sky-600 hover:text-sky-700"
          >
            View Treasury Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="pb-3">Member</th>
                <th className="pb-3">Purpose</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Gateway & TrxID</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-slate-900">{p.member}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{p.memberId}</div>
                  </td>
                  <td className="py-3.5 text-slate-700">{p.type}</td>
                  <td className="py-3.5 font-bold text-slate-900">
                    ৳{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-sky-700">{p.gateway}</span>
                    <div className="font-mono text-[10px] text-slate-500">{p.trxId}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${p.status === "Verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {p.status === "Pending Verification" ? (
                      <button
                        type="button"
                        onClick={() => handleVerifyTxn(p.id)}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                      >
                        Verify
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">✓ Reconciled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── BROADCAST MODAL ─── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
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

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                >
                  <option value="ALL">All Verified Alumni (842 Members)</option>
                  <option value="2006">Batch 2006 Alumni Only</option>
                  <option value="1998">Batch 1998 Alumni Only</option>
                </select>
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

      {/* ─── ADD MEMBER MODAL ─── */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Add New Alumni Member</h3>
            <p className="text-xs text-slate-500 mb-5">
              Directly onboard an alumni to the organization database.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberForm.name}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, name: e.target.value })
                  }
                  placeholder="e.g. Mohammad Ali"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    School Batch *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.batch}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, batch: e.target.value })
                    }
                    placeholder="e.g. 2008"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={newMemberForm.tier}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, tier: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option>General Member</option>
                    <option>Life Member</option>
                    <option>Patron Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number (Primary Login) *
                </label>
                <input
                  type="tel"
                  required
                  value={newMemberForm.phone}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, phone: e.target.value })
                  }
                  placeholder="+880 1700-000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Save & Onboard Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
