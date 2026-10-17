"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
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
  RefreshCw,
  Camera,
  AlertCircle,
} from "lucide-react";
import {
  useAdminDashboardStats,
  useUpdateMemberStatus,
  useOnboardMember,
  useVerifyPayment,
  useCreateAnnouncement,
} from "@/hooks/useQueries";
import { showSuccess, showError } from "@/utility/toast";

export default function AdminDashboardOverview() {
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Broadcast Modal State
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("ALL");
  const [broadcastCategory, setBroadcastCategory] = useState("General");
  const [broadcastPriority, setBroadcastPriority] = useState("High");

  // Onboard Member Modal State
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    batch: "2010",
    phone: "",
    email: "",
    profession: "",
    tier: "General Member",
  });

  // Dynamic React Query Hooks
  const {
    data: dashboardData,
    isLoading,
    isRefetching,
    refetch,
  } = useAdminDashboardStats();

  const updateMemberStatusMutation = useUpdateMemberStatus();
  const onboardMemberMutation = useOnboardMember();
  const verifyPaymentMutation = useVerifyPayment();
  const createAnnouncementMutation = useCreateAnnouncement();

  const triggerSuccessMsg = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(""), 4000);
  };

  // KPI Metrics
  const kpi = dashboardData?.kpi || {
    totalAlumni: 0,
    registrationsThisMonth: 0,
    pendingApprovals: 0,
    activeMembers: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    totalEvents: 0,
    totalActivities: 0,
    totalAnnouncements: 0,
  };

  // Real Queues from Database
  const urgentPendingMembers = dashboardData?.urgentPendingMembers || [];
  const recentPayments = dashboardData?.recentPayments || [];

  // Handle Approving a Pending Member
  const handleApprove = async (id, name) => {
    try {
      await updateMemberStatusMutation.mutateAsync({
        id,
        statusData: { membershipStatus: "active" },
      });
      triggerSuccessMsg(`Member ${name || id} approved & verified!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Verifying a Payment
  const handleVerifyTxn = async (transactionIdOrId) => {
    try {
      await verifyPaymentMutation.mutateAsync(transactionIdOrId);
      triggerSuccessMsg(`Transaction ${transactionIdOrId} verified & reconciled.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Dispatching an Announcement
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      showError("Please enter subject and message content.");
      return;
    }

    try {
      await createAnnouncementMutation.mutateAsync({
        title: broadcastSubject.trim(),
        content: broadcastMessage.trim(),
        category: broadcastCategory,
        priority: broadcastPriority,
        targetAudience: broadcastTarget,
      });

      setShowBroadcastModal(false);
      setBroadcastSubject("");
      setBroadcastMessage("");
      triggerSuccessMsg("Broadcast notice dispatched and published to alumni network!");
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Onboarding a New Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberForm.name.trim() || !newMemberForm.phone.trim()) {
      showError("Name and phone number are required.");
      return;
    }

    try {
      await onboardMemberMutation.mutateAsync({
        name: newMemberForm.name.trim(),
        batch: newMemberForm.batch.trim(),
        phone: newMemberForm.phone.trim(),
        email: newMemberForm.email.trim() || undefined,
        profession: newMemberForm.profession.trim() || undefined,
        tier: newMemberForm.tier,
      });

      setShowAddMemberModal(false);
      setNewMemberForm({
        name: "",
        batch: "2010",
        phone: "",
        email: "",
        profession: "",
        tier: "General Member",
      });
      triggerSuccessMsg(
        `New alumni member ${newMemberForm.name} onboarded successfully!`
      );
    } catch (err) {
      console.error(err);
    }
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
            className="ml-2 hover:opacity-75 cursor-pointer"
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
          <p className="text-xs text-slate-500 mt-1">
            Real-time alumni community metrics, treasury collections, and verification queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh dashboard metrics"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin text-sky-600" : ""}`}
            />
          </button>

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
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* ─── 4 TOP KPI CARDS (100% Dynamic from Database) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Alumni Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Alumni
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-20 animate-pulse mb-2" />
          ) : (
            <div className="text-2xl font-black text-slate-900 mb-1">
              {kpi.totalAlumni}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{kpi.registrationsThisMonth} registered this month</span>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-16 animate-pulse mb-2" />
          ) : (
            <div className="text-2xl font-black text-slate-900 mb-1">
              {kpi.pendingApprovals}
            </div>
          )}
          <Link
            href="/admin/approvals"
            className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1"
          >
            Review verification queue →
          </Link>
        </div>

        {/* Total Treasury Revenue Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Treasury Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-28 animate-pulse mb-2" />
          ) : (
            <div className="text-2xl font-black text-slate-900 mb-1">
              ৳{kpi.totalRevenue.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-slate-500 font-medium">
            ৳{kpi.revenueThisMonth.toLocaleString()} collected this month
          </div>
        </div>

        {/* Events & Community Activities Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Events & Gallery
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 bg-slate-100 rounded w-28 animate-pulse mb-2" />
          ) : (
            <div className="text-2xl font-black text-slate-900 mb-1">
              {kpi.totalEvents} Events
            </div>
          )}
          <div className="text-xs text-purple-700 font-semibold flex items-center gap-2">
            <span>{kpi.totalActivities} Gallery Photos</span>
            <span>·</span>
            <span>{kpi.totalAnnouncements} Notices</span>
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
              View Full Queue ({kpi.pendingApprovals}) →
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : urgentPendingMembers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span className="font-bold text-slate-700 block">
                All registered members are verified!
              </span>
              <span>No alumni waiting in pending approval queue.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {urgentPendingMembers.map((m) => (
                <div
                  key={m.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {m.batch ? String(m.batch).slice(-2) : "AL"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {m.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {m.phone} · Batch {m.batch || "N/A"} · {m.profession}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(m.id, m.name)}
                      disabled={updateMemberStatusMutation.isPending}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <Link
                      href="/admin/approvals"
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                      title="View member details"
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
              Broadcast to {kpi.totalAlumni} Alumni
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Dispatch emergency blood requests, reunion updates, or general meeting
              announcements directly via notice board and email.
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4" />
              Compose Official Broadcast
            </button>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/events"
                className="py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Events ({kpi.totalEvents})
              </Link>
              <Link
                href="/admin/gallery"
                className="py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-purple-400" />
                Gallery ({kpi.totalActivities})
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RECENT CONTRIBUTION VOUCHERS TABLE (Real Transactions) ─── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Recent Member Contribution Vouchers
            </h3>
            <p className="text-xs text-slate-500">
              Live SSLCommerz (bKash, Nagad, Cards, Bank transfer) payment submissions.
            </p>
          </div>
          <Link
            href="/admin/payments"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View Treasury Ledger →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/50">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway & TrxID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading recent payments...</span>
                    </div>
                  </td>
                </tr>
              ) : recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                    <span>No payment transactions recorded yet.</span>
                  </td>
                </tr>
              ) : (
                recentPayments.map((p) => (
                  <tr
                    key={p.id || p._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{p.member}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.memberId} {p.batch ? `· ${p.batch}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">{p.type}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ৳{Number(p.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-sky-700">
                        {p.gateway}
                      </span>
                      <div className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">
                        {p.trxId}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          p.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "Pending Verification"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {p.status === "Pending Verification" ? (
                        <button
                          type="button"
                          onClick={() => handleVerifyTxn(p._id || p.id)}
                          disabled={verifyPaymentMutation.isPending}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">
                          ✓ Reconciled
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── BROADCAST MODAL (Connected to Announcement DB) ─── */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Dispatch Organization Broadcast
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Publish an official notice to all registered alumni members.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="General">General Notice</option>
                    <option value="Urgent">Urgent / Blood Request</option>
                    <option value="Reunion">Reunion Update</option>
                    <option value="Welfare">Welfare & Charity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={createAnnouncementMutation.isPending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {createAnnouncementMutation.isPending
                  ? "Dispatching..."
                  : "Dispatch Broadcast Notice Now"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD MEMBER MODAL (Connected to MongoDB) ─── */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Add New Alumni Member
            </h3>
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
                      setNewMemberForm({
                        ...newMemberForm,
                        batch: e.target.value,
                      })
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
                      setNewMemberForm({
                        ...newMemberForm,
                        tier: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="General Member">General Member</option>
                    <option value="Life Member">Life Member</option>
                    <option value="Donor Member">Donor / Patron Member</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Profession / Designation
                </label>
                <input
                  type="text"
                  value={newMemberForm.profession}
                  onChange={(e) =>
                    setNewMemberForm({
                      ...newMemberForm,
                      profession: e.target.value,
                    })
                  }
                  placeholder="e.g. Civil Engineer, PWD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number (Login) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newMemberForm.phone}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="01700000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newMemberForm.email}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        email: e.target.value,
                      })
                    }
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={onboardMemberMutation.isPending}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                {onboardMemberMutation.isPending
                  ? "Saving to Database..."
                  : "Save & Onboard Member"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
