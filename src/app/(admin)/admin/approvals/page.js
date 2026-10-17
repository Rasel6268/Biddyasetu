"use client";

import { useState, useMemo } from "react";
import {
  UserCheck,
  CheckCircle2,
  Eye,
  X,
  Search,
  RefreshCw,
  Clock,
  Trash2,
  ShieldAlert,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  useAdminMembers,
  useUpdateMemberStatus,
  useDeleteMember,
} from "@/hooks/useQueries";
import { showSuccess, showError } from "@/utility/toast";

export default function AdminApprovalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null); // Detail modal
  const [confirmRejectId, setConfirmRejectId] = useState(null); // Rejection confirm dialog
  const [isApprovingAll, setIsApprovingAll] = useState(false);

  // Dynamic Query: Fetch all pending alumni
  const {
    data: pendingMembers = [],
    isLoading,
    isRefetching,
    refetch,
  } = useAdminMembers({ status: "pending", limit: 200 });

  const updateMemberStatusMutation = useUpdateMemberStatus();
  const deleteMemberMutation = useDeleteMember();

  // Search filter
  const filteredPendingMembers = useMemo(() => {
    if (!searchTerm.trim()) return pendingMembers;
    const term = searchTerm.toLowerCase();
    return pendingMembers.filter(
      (m) =>
        m.name?.toLowerCase().includes(term) ||
        m.phone?.includes(term) ||
        m.email?.toLowerCase().includes(term) ||
        m.batch?.includes(term) ||
        m.membershipId?.toLowerCase().includes(term) ||
        m.profession?.toLowerCase().includes(term)
    );
  }, [pendingMembers, searchTerm]);

  // Handle single approval
  const handleApprove = async (member) => {
    try {
      await updateMemberStatusMutation.mutateAsync({
        id: member._id,
        statusData: { membershipStatus: "active" },
      });
      showSuccess(`Member ${member.name} approved & verified!`);
      if (selectedMember?._id === member._id) {
        setSelectedMember(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle batch approve all
  const handleApproveAll = async () => {
    if (pendingMembers.length === 0) return;
    setIsApprovingAll(true);
    try {
      await Promise.all(
        pendingMembers.map((m) =>
          updateMemberStatusMutation.mutateAsync({
            id: m._id,
            statusData: { membershipStatus: "active" },
          })
        )
      );
      showSuccess(
        `All ${pendingMembers.length} pending registrations have been verified!`
      );
    } catch (err) {
      console.error(err);
      showError("Could not complete approval for all members.");
    } finally {
      setIsApprovingAll(false);
    }
  };

  // Handle rejection / removal
  const handleReject = async (id, name) => {
    try {
      await deleteMemberMutation.mutateAsync(id);
      setConfirmRejectId(null);
      if (selectedMember?._id === id) {
        setSelectedMember(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Header Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Verification Queue
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pending Member Approvals
            </h1>
            {!isLoading && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                {pendingMembers.length} Awaiting
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review and grant active membership credentials to newly registered alumni.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors shadow-2xs cursor-pointer"
            title="Refresh pending approvals queue"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin text-sky-600" : ""}`}
            />
          </button>

          {pendingMembers.length > 0 && (
            <button
              type="button"
              onClick={handleApproveAll}
              disabled={isApprovingAll || updateMemberStatusMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isApprovingAll
                  ? "Approving all..."
                  : `Approve All (${pendingMembers.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Search & Metrics Bar ─── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, SSC batch, email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredPendingMembers.length}</strong> of{" "}
          <strong className="text-slate-900">{pendingMembers.length}</strong> pending registrations
        </div>
      </div>

      {/* ─── Approvals Grid / Cards ─── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-24 bg-slate-50 rounded-2xl" />
              <div className="h-9 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : pendingMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto space-y-3 my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Verification Queue is Clear!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            All registered alumni have been reviewed and activated. New member
            sign-ups will appear here automatically.
          </p>
        </div>
      ) : filteredPendingMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs">
          <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No matches found</h4>
          <p className="text-xs text-slate-400 mt-1">
            No pending members match your query &ldquo;{searchTerm}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPendingMembers.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Avatar, Name, Member ID, Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {m.profileImage ? (
                      <img
                        src={m.profileImage}
                        alt={m.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {m.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-slate-900 truncate">
                        {m.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-bold text-sky-700">
                          {m.membershipId || "ID Pending"}
                        </span>
                        {m.bloodGroup && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {m.bloodGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] shrink-0">
                    Pending Validation
                  </span>
                </div>

                {/* Info Block */}
                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> School Batch:
                    </span>
                    <span className="font-bold text-slate-900">
                      {m.batch ? `Class of ${m.batch}` : "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                    </span>
                    <span className="font-mono font-bold text-slate-900">{m.phone}</span>
                  </div>

                  {m.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                      </span>
                      <span className="truncate max-w-[200px] text-slate-700">
                        {m.email}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Profession:
                    </span>
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">
                      {m.profession || "Alumni"}
                      {m.organization ? ` (${m.organization})` : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Signed Up:
                    </span>
                    <span className="text-slate-500">
                      {new Date(m.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleApprove(m)}
                  disabled={updateMemberStatusMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Assign ID
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMember(m)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-sky-600 transition-colors cursor-pointer"
                  title="View full registration profile"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setConfirmRejectId(m._id)}
                  className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Reject or remove registration"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── MODAL 1: Full Member Profile Inspection ─── */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative my-8">
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              {selectedMember.profileImage ? (
                <img
                  src={selectedMember.profileImage}
                  alt={selectedMember.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                  {selectedMember.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedMember.name}
                </h3>
                {selectedMember.nameBn && (
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedMember.nameBn}
                  </div>
                )}
                <div className="text-xs font-mono font-bold text-sky-600 mt-0.5">
                  {selectedMember.membershipId || "ID: Pending Approval"}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-400">School Batch:</span>
                <span className="font-bold text-slate-900">
                  Class of {selectedMember.batch || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-400">Phone (Login):</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedMember.phone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-400">Email:</span>
                <span className="text-slate-800">{selectedMember.email || "Not provided"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-400">Profession:</span>
                <span className="font-medium text-slate-800">
                  {selectedMember.profession || "Alumni"}
                  {selectedMember.organization ? ` at ${selectedMember.organization}` : ""}
                </span>
              </div>
              {selectedMember.bloodGroup && (
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-400">Blood Group:</span>
                  <span className="font-bold text-rose-600">
                    {selectedMember.bloodGroup}
                  </span>
                </div>
              )}
              {selectedMember.fatherName && (
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-400">Father&apos;s Name:</span>
                  <span className="text-slate-800">{selectedMember.fatherName}</span>
                </div>
              )}
              {selectedMember.currentAddress?.city && (
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-800">
                    {selectedMember.currentAddress.city}
                    {selectedMember.currentAddress.country
                      ? `, ${selectedMember.currentAddress.country}`
                      : ""}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-400">Package Tier:</span>
                <span className="font-bold text-sky-700 capitalize">
                  {selectedMember.packageData?.packageName ||
                    selectedMember.membership?.replace(/_/g, " ") ||
                    "General Member"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Registered On:</span>
                <span className="text-slate-600">
                  {new Date(selectedMember.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-5">
              <button
                type="button"
                onClick={() => handleApprove(selectedMember)}
                disabled={updateMemberStatusMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve & Grant ID
              </button>
              <button
                type="button"
                onClick={() => setConfirmRejectId(selectedMember._id)}
                className="px-4 py-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Reject Confirmation Dialog ─── */}
      {confirmRejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-base text-slate-900">
                Reject Registration?
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                This will remove the pending applicant from the database.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRejectId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReject(confirmRejectId)}
                disabled={deleteMemberMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {deleteMemberMutation.isPending ? "Removing..." : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
