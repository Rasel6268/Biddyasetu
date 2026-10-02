"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function AdminMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [members, setMembers] = useState([]);

  const handleApprove = (id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Verified" } : m))
    );
    triggerToast(`Member ${id} verified!`);
  };

  const handleSuspend = (id) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "Suspended" } : m))
    );
    triggerToast(`Member ${id} suspended.`);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.profession.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch = batchFilter === "ALL" || m.batch === batchFilter;
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;

    return matchesSearch && matchesBatch && matchesStatus;
  });

  const batchList = Array.from(new Set(members.map((m) => m.batch))).sort().reverse();

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
            Alumni Database
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registered Alumni Directory
          </h1>
        </div>

        <button
          type="button"
          onClick={() => triggerToast("Exporting member directory to CSV...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Directory</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, profession, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-800 outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Batches</option>
            {batchList.map((b) => (
              <option key={b} value={b}>
                Batch {b}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Member Details</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Profession & Company</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                        <div className="text-[11px] text-sky-700 font-mono">
                          {m.id} · Batch &apos;{m.batch.slice(2)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">{m.phone}</div>
                    <div className="text-[11px] text-slate-500">{m.email}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800">{m.profession}</div>
                    <div className="text-[11px] text-slate-500">{m.company}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                      <Award className="w-3 h-3 text-amber-500" />
                      {m.tier}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${m.status === "Verified"
                        ? "bg-emerald-100 text-emerald-800"
                        : m.status === "Suspended"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {m.status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMember(m)}
                        className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {m.status === "Pending Approval" && (
                        <button
                          type="button"
                          onClick={() => handleApprove(m.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      {m.status === "Verified" && (
                        <button
                          type="button"
                          onClick={() => handleSuspend(m.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Suspend"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Profile Inspection */}
      {selectedMember && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center">
                {selectedMember.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedMember.name}</h3>
                <p className="text-xs text-slate-500 font-mono font-bold text-sky-700">
                  {selectedMember.id} · Batch {selectedMember.batch}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{selectedMember.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900">{selectedMember.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Profession:</span>
                <span className="font-bold text-slate-900">{selectedMember.profession}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Company:</span>
                <span className="font-medium text-slate-900">{selectedMember.company}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-900">{selectedMember.location}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
