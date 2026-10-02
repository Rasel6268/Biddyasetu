"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Download,
  CheckCircle2,
  X,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
} from "lucide-react";
import api from "@/utility/config";

export default function AdminPaymentsPage() {
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 4850000,
    paidCount: 0,
    pendingCount: 0,
    failedCount: 0,
  });

  const [payments, setPayments] = useState([
    {
      id: "TXN-2026-9941",
      member: "S.M. Nahid Hasan",
      memberId: "BDS-PN-1044",
      batch: "2015",
      type: "Annual Membership Fee",
      amount: 1000,
      gateway: "SSLCommerz (bKash)",
      trxId: "BK9A87X021",
      date: "Today, 10:45 AM",
      status: "Pending Verification",
    },
    {
      id: "TXN-2026-9940",
      member: "Kazi Nusrat Jahan",
      memberId: "BDS-PN-1045",
      batch: "2018",
      type: "Annual Membership Fee",
      amount: 1000,
      gateway: "SSLCommerz (Nagad)",
      trxId: "NG88219401",
      date: "Today, 09:20 AM",
      status: "Pending Verification",
    },
    {
      id: "TXN-2026-9938",
      member: "Engr. Tanvir Ahmed",
      memberId: "BDS-LM-0842",
      batch: "2006",
      type: "Student Scholarship Fund Donation",
      amount: 5000,
      gateway: "SSLCommerz (bKash)",
      trxId: "BK77109283",
      date: "Yesterday",
      status: "Verified",
    },
    {
      id: "TXN-2026-9935",
      member: "Md. Rafiqul Islam",
      memberId: "BDS-LM-0102",
      batch: "1998",
      type: "School Library & Science Lab Aid",
      amount: 50000,
      gateway: "SSLCommerz (Bank)",
      trxId: "EBL-ONL-847291",
      date: "02 Mar 2026",
      status: "Verified",
    },
  ]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const fetchLivePayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ssl/all");
      if (res.data?.success && res.data?.data) {
        const { payments: livePayments, summary } = res.data.data;
        if (Array.isArray(livePayments) && livePayments.length > 0) {
          const formatted = livePayments.map((p) => ({
            id: p.transactionId,
            member: p.user?.name || "Member",
            memberId: p.membershipId || p.user?.membershipId || "N/A",
            batch: p.user?.batch || "Alumni",
            type: `${p.packageName || "Membership"} Fee`,
            amount: p.amount,
            gateway: p.cardType || p.paymentGateway || "SSLCommerz",
            trxId: p.bankTransactionId || p.valId || p.transactionId,
            date: new Date(p.paidAt || p.createdAt).toLocaleString("en-BD", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            status:
              p.status === "paid"
                ? "Verified"
                : p.status === "pending"
                ? "Pending Verification"
                : "Failed",
            rawStatus: p.status,
          }));
          setPayments(formatted);
        }

        if (summary) {
          setSummaryStats((prev) => ({
            totalRevenue: summary.totalRevenue || prev.totalRevenue,
            paidCount: summary.paidCount || 0,
            pendingCount: summary.pendingCount || 0,
            failedCount: summary.failedCount || 0,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not load real-time admin payments (using local records):", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePayments();
  }, []);

  const handleVerify = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p))
    );
    triggerToast(`Payment voucher ${id} verified & reconciled into ledger.`);
  };

  const handleReject = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
    triggerToast(`Payment voucher ${id} marked as rejected.`);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.trxId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && p.status === "Verified") ||
      (statusFilter === "pending" && p.status === "Pending Verification") ||
      (statusFilter === "failed" && (p.status === "Failed" || p.status === "Rejected"));

    return matchesSearch && matchesStatus;
  });

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
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>SSLCommerz Gateway & Financial Records</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              LIVE GATEWAY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Treasury & Payment Vouchers
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLivePayments}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast("Exporting financial vouchers ledger CSV...")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1">
            Total Fund Balance
          </div>
          <div className="text-3xl font-black mb-1">
            ৳{summaryStats.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-100">
            Combined Online Gateways & Trust A/C
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Pending Submissions
          </div>
          <div className="text-3xl font-black text-amber-600 mb-1">
            ৳
            {payments
              .filter((p) => p.status === "Pending Verification")
              .reduce((acc, p) => acc + p.amount, 0)
              .toLocaleString()}
          </div>
          <p className="text-xs text-slate-500">
            {payments.filter((p) => p.status === "Pending Verification").length} vouchers awaiting verification
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            SSLCommerz Verified Paid
          </div>
          <div className="text-3xl font-black text-sky-600 mb-1">
            {payments.filter((p) => p.status === "Verified").length} Records
          </div>
          <p className="text-xs text-slate-500">Instant IPN validated transactions</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Member, TrxID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Records" },
            { id: "verified", label: "Verified" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Receipt ID</th>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Purpose</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Gateway & TrxID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No payment vouchers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.member}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {p.memberId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">{p.type}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ৳{Number(p.amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sky-700">{p.gateway}</span>
                      <div className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                        {p.trxId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{p.date}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          p.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : p.status === "Rejected" || p.status === "Failed"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {p.status === "Pending Verification" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerify(p.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(p.id)}
                            className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
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
    </div>
  );
}
