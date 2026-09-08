"use client";

import { useState } from "react";
import { Settings, Lock, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
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
            System & Security
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Portal Configuration & Audit Log
          </h1>
        </div>
      </div>

      {/* Gateways Config */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          Payment Accounts & Gateway Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              bKash Merchant / Agent Number
            </label>
            <input
              type="text"
              defaultValue="01700-000000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nagad Merchant Number
            </label>
            <input
              type="text"
              defaultValue="01800-000000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Bank Account Details
            </label>
            <input
              type="text"
              defaultValue="Sonali Bank, Kaitola Br, A/C: 34091823"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => triggerToast("Gateway settings saved successfully.")}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
          Recent Administrator Activity Logs
        </h3>

        <div className="divide-y divide-slate-100 text-xs text-slate-600 font-mono">
          <div className="py-2.5 flex items-center justify-between">
            <span>[2026-09-05 11:30] Super Admin approved payment voucher TXN-2026-9938</span>
            <span className="text-slate-400">IP 103.14.22.8</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span>[2026-09-05 09:15] Super Admin dispatched broadcast notice BC-104</span>
            <span className="text-slate-400">IP 103.14.22.8</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <span>[2026-09-04 18:40] Verified member BDS-LM-0842 (Engr. Tanvir Ahmed)</span>
            <span className="text-slate-400">IP 103.14.22.8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
