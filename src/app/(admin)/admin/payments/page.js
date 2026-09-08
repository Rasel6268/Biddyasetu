"use client";

import { useState } from "react";
import { CreditCard, Download, CheckCircle2, X } from "lucide-react";

export default function AdminPaymentsPage() {
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const [payments, setPayments] = useState([
    {
      id: "TXN-2026-9941",
      member: "S.M. Nahid Hasan",
      memberId: "BDS-PN-1044",
      batch: "2015",
      type: "Annual Membership Fee",
      amount: 1000,
      gateway: "bKash",
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
      gateway: "Nagad",
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
      gateway: "bKash",
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
      gateway: "Bank Transfer",
      trxId: "EBL-ONL-847291",
      date: "02 Mar 2026",
      status: "Verified",
    },
    {
      id: "TXN-2026-9930",
      member: "Barrister Anisur Rahman",
      memberId: "BDS-LM-0419",
      batch: "2001",
      type: "Life Membership Upgradation",
      amount: 5000,
      gateway: "Rocket",
      trxId: "RK66019284",
      date: "01 Mar 2026",
      status: "Verified",
    },
  ]);

  const handleVerify = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Verified" } : p))
    );
    triggerToast(`Payment voucher ${id} verified & added to ledger.`);
  };

  const handleReject = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
    triggerToast(`Payment voucher ${id} marked as rejected.`);
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
            Financial Records
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Treasury & Payment Vouchers
          </h1>
        </div>

        <button
          type="button"
          onClick={() => triggerToast("Exporting financial vouchers ledger...")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 rounded-3xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1">
            Total Fund Balance
          </div>
          <div className="text-3xl font-black mb-1">৳48,50,000</div>
          <p className="text-xs text-emerald-100">Sonali Bank Biddyasetu Trust A/C</p>
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
          <p className="text-xs text-slate-500">2 vouchers awaiting verification</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            This Month&apos;s Receipts
          </div>
          <div className="text-3xl font-black text-sky-600 mb-1">৳1,42,000</div>
          <p className="text-xs text-slate-500">Dues, Life Member, and Donations</p>
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
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                    {p.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{p.member}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{p.memberId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800">{p.type}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    ৳{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-sky-700">{p.gateway}</span>
                    <div className="font-mono text-[10px] text-slate-500">{p.trxId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{p.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        p.status === "Verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "Rejected"
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
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors"
                        >
                          Verify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(p.id)}
                          className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
