"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Users,
  Award,
  UserX,
  Eye,
  Plus,
  RefreshCw,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Phone,
  Mail,
  Droplets,
  Calendar,
  CreditCard,
  Trash2,
  Check,
} from "lucide-react";
import {
  useAdminMembers,
  useMemberStats,
  useUpdateMemberStatus,
  useDeleteMember,
} from "@/hooks/useQueries";
import { batches } from "@/lib/data/demo";

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [membershipFilter, setMembershipFilter] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Queries & Mutations
  const { data: members = [], isLoading, isFetching, refetch } = useAdminMembers({
    batch: batchFilter !== "ALL" ? batchFilter : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    membership: membershipFilter !== "ALL" ? membershipFilter : undefined,
    search: searchQuery || undefined,
  });

  const { data: stats = {} } = useMemberStats();
  const updateStatusMutation = useUpdateMemberStatus();
  const deleteMemberMutation = useDeleteMember();

  const handleApprove = async (id) => {
    await updateStatusMutation.mutateAsync({
      id,
      statusData: { membershipStatus: "active", paymentStatus: "paid" },
    });
    if (selectedMember && (selectedMember._id === id || selectedMember.id === id)) {
      setSelectedMember((prev) => (prev ? { ...prev, membershipStatus: "active", paymentStatus: "paid" } : null));
    }
  };

  const handleSuspend = async (id) => {
    await updateStatusMutation.mutateAsync({
      id,
      statusData: { membershipStatus: "suspended" },
    });
    if (selectedMember && (selectedMember._id === id || selectedMember.id === id)) {
      setSelectedMember((prev) => (prev ? { ...prev, membershipStatus: "suspended" } : null));
    }
  };

  const handleReactivate = async (id) => {
    await updateStatusMutation.mutateAsync({
      id,
      statusData: { membershipStatus: "active" },
    });
    if (selectedMember && (selectedMember._id === id || selectedMember.id === id)) {
      setSelectedMember((prev) => (prev ? { ...prev, membershipStatus: "active" } : null));
    }
  };

  const handleDelete = async (id) => {
    await deleteMemberMutation.mutateAsync(id);
    setDeleteConfirmId(null);
    if (selectedMember && (selectedMember._id === id || selectedMember.id === id)) {
      setSelectedMember(null);
    }
  };

  const handleExportCSV = () => {
    if (!members.length) return;
    const headers = [
      "Membership ID",
      "Name",
      "Bangla Name",
      "Phone",
      "Email",
      "Batch",
      "Profession",
      "Organization",
      "Blood Group",
      "Country",
      "City",
      "Membership Type",
      "Status",
      "Payment Status",
      "Joined Date",
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = members.map((m) => [
      escapeCsv(m.membershipId || `BDS-${m._id?.slice(-6) || m.id}`),
      escapeCsv(m.name || ""),
      escapeCsv(m.nameBn || ""),
      escapeCsv(m.phone || ""),
      escapeCsv(m.email || ""),
      escapeCsv(m.batch || ""),
      escapeCsv(m.profession || ""),
      escapeCsv(m.organization || m.company || ""),
      escapeCsv(m.bloodGroup || ""),
      escapeCsv(m.currentAddress?.country || m.country || "Bangladesh"),
      escapeCsv(m.currentAddress?.city || m.city || ""),
      escapeCsv(m.packageData?.packageName || m.membership || "General Member"),
      escapeCsv(m.membershipStatus || m.status || "active"),
      escapeCsv(m.paymentStatus || "paid"),
      escapeCsv(m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `biddyasetu_alumni_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side quick filter for instantaneous typing response
  const displayMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const name = (m.name || "").toLowerCase();
      const phone = (m.phone || "").toLowerCase();
      const email = (m.email || "").toLowerCase();
      const profession = (m.profession || "").toLowerCase();
      const memId = (m.membershipId || "").toLowerCase();
      const batch = (m.batch || "").toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        profession.includes(q) ||
        memId.includes(q) ||
        batch.includes(q)
      );
    });
  }, [members, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-sky-600 font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Official Alumni Database
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registered Alumni Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, verify, manage memberships and export official alumni database records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-sky-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!displayMembers.length}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {stats.totalMembers ?? members.length}
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Alumni
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700 leading-tight">
              {stats.activeMembers ?? members.filter((m) => (m.membershipStatus || m.status) === "active" || (m.membershipStatus || m.status) === "Verified").length}
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active / Verified
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-amber-700 leading-tight">
              {stats.pendingMembers ?? members.filter((m) => (m.membershipStatus || m.status) === "pending" || (m.membershipStatus || m.status) === "Pending Approval").length}
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Approvals
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-purple-700 leading-tight">
              {stats.lifeMembers ?? members.filter((m) => (m.membership || "").toLowerCase().includes("life")).length}
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Life Members
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, batch, or membership ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">All Batches</option>
            {batches.map((b) => (
              <option key={b} value={b}>
                Batch {b}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="active">Active / Verified</option>
            <option value="pending">Pending Approval</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">All Tiers</option>
            <option value="general_member">General Member</option>
            <option value="life_member">Life Member</option>
            <option value="donor_member">Donor Member</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-700">Loading alumni directory...</p>
          </div>
        ) : displayMembers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No registered alumni found</h3>
            <p className="text-xs text-slate-500 mb-4">
              {searchQuery || batchFilter !== "ALL" || statusFilter !== "ALL"
                ? "Try adjusting your search criteria or resetting filters."
                : "No registered alumni members in database yet."}
            </p>
            {(searchQuery || batchFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setBatchFilter("ALL");
                  setStatusFilter("ALL");
                  setMembershipFilter("ALL");
                }}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Member Details</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Profession & Org</th>
                  <th className="py-3.5 px-4">Tier & ID</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {displayMembers.map((m) => {
                  const mId = m._id || m.id;
                  const currentStatus = m.membershipStatus || m.status || "pending";
                  const isVerified = currentStatus === "active" || currentStatus === "Verified";
                  const isPending = currentStatus === "pending" || currentStatus === "Pending Approval";
                  const isSuspended = currentStatus === "suspended" || currentStatus === "Suspended";

                  const tierName =
                    m.packageData?.packageName ||
                    (m.membership === "life_member"
                      ? "Life Member"
                      : m.membership === "donor_member"
                        ? "Donor Member"
                        : "General Member");

                  return (
                    <tr key={mId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {m.profileImage || m.image ? (
                            <img
                              src={m.profileImage || m.image}
                              alt={m.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                              {(m.name || "A").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-sm leading-tight">
                              {m.name}
                            </div>
                            {m.nameBn && (
                              <div className="text-[11px] text-slate-500 font-medium">{m.nameBn}</div>
                            )}
                            <div className="text-[11px] text-sky-700 font-mono font-bold mt-0.5">
                              Batch {m.batch || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{m.phone}</div>
                        <div className="text-[11px] text-slate-500">{m.email || "No email"}</div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{m.profession || "Alumni"}</div>
                        <div className="text-[11px] text-slate-500">
                          {m.organization || m.company || m.currentAddress?.city || "Bangladesh"}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                            <Award className="w-3 h-3 text-amber-500" />
                            {tierName}
                          </span>
                          <div className="text-[10px] font-mono text-slate-400">
                            {m.membershipId || `BDS-${mId.slice(-6)}`}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            isVerified
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isSuspended
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : isSuspended ? (
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600" />
                          )}
                          {isVerified ? "Verified" : isSuspended ? "Suspended" : "Pending"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedMember(m)}
                            className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleApprove(mId)}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                              title="Approve and verify alumni"
                            >
                              Approve
                            </button>
                          )}

                          {isVerified && (
                            <button
                              type="button"
                              onClick={() => handleSuspend(mId)}
                              disabled={updateStatusMutation.isPending}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Suspend Member"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => handleReactivate(mId)}
                              disabled={updateStatusMutation.isPending}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                              title="Reactivate Member"
                            >
                              Reactivate
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(mId)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Member"
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
        )}
      </div>

      {/* Confirmation Dialog for Delete */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-rose-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Delete Member?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This action cannot be undone. All registration and membership records for this user will be removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleteMemberMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteMemberMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Profile Inspection */}
      {selectedMember && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-sky-100 relative my-8">
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Member Card Header */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              {selectedMember.profileImage || selectedMember.image ? (
                <img
                  src={selectedMember.profileImage || selectedMember.image}
                  alt={selectedMember.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-sky-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                  {(selectedMember.name || "A").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedMember.name}
                  </h3>
                  {selectedMember.nameBn && (
                    <span className="text-sm font-semibold text-slate-500">
                      ({selectedMember.nameBn})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                    {selectedMember.membershipId || `BDS-${(selectedMember._id || selectedMember.id)?.slice(-6)}`}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    Batch {selectedMember.batch || "N/A"}
                  </span>
                  {selectedMember.bloodGroup && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> {selectedMember.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Grid Details */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                <div className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                  Contact & Personal Info
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{selectedMember.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{selectedMember.profession || "N/A"} {selectedMember.organization ? `at ${selectedMember.organization}` : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{selectedMember.currentAddress?.country || selectedMember.country || "Bangladesh"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
                <div className="font-extrabold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
                  Membership & Subscription Status
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tier</span>
                    <span className="font-extrabold text-slate-800">
                      {selectedMember.packageData?.packageName || selectedMember.membership || "General Member"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                    <span className="font-extrabold text-emerald-700">
                      {selectedMember.membershipStatus || selectedMember.status || "active"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment</span>
                    <span className="font-extrabold text-sky-700">
                      {selectedMember.paymentStatus || "paid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              {(selectedMember.membershipStatus === "pending" || selectedMember.status === "Pending Approval") && (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedMember._id || selectedMember.id)}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Approve / Verify Member
                </button>
              )}

              {(selectedMember.membershipStatus === "active" || selectedMember.status === "Verified") && (
                <button
                  type="button"
                  onClick={() => handleSuspend(selectedMember._id || selectedMember.id)}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Suspend Membership
                </button>
              )}

              {(selectedMember.membershipStatus === "suspended" || selectedMember.status === "Suspended") && (
                <button
                  type="button"
                  onClick={() => handleReactivate(selectedMember._id || selectedMember.id)}
                  disabled={updateStatusMutation.isPending}
                  className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  Reactivate Member
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
