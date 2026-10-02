"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");
  const reason =
    searchParams.get("reason") ||
    "The transaction could not be processed by your bank or the payment gateway.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-slate-50 to-amber-50/40 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl shadow-rose-950/10 border border-rose-100 overflow-hidden relative">
          {/* Top Decorative Red/Rose Bar */}
          <div className="h-3 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

          <div className="p-8 text-center">
            {/* Warning Icon */}
            <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Transaction Declined
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payment Incomplete
            </h1>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              We couldn’t complete your membership payment through SSLCommerz.
              No funds have been charged from your account, or if debited, will
              be reversed by your bank.
            </p>

            {/* Error Message Container */}
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Reason / Gateway Feedback
              </span>
              <p className="text-xs text-rose-900 font-medium leading-relaxed">
                {reason}
              </p>
              {tranId && (
                <div className="mt-2 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-rose-700">Reference ID:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {tranId}
                  </span>
                </div>
              )}
            </div>

            {/* Troubleshooting Advice */}
            <div className="mt-6 text-left p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                Common Fixes:
              </span>
              <p>• Ensure your mobile wallet (bKash/Nagad) has sufficient balance.</p>
              <p>• Verify you entered the correct OTP and PIN within the time limit.</p>
              <p>• Try selecting a different payment option on SSLCommerz (Card, Internet Banking, or another Wallet).</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/dashboard"
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Payment
              </Link>

              <Link
                href="/contact"
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-slate-600" />
                Contact Helpdesk
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/dashboard"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium transition"
          >
            ← Return to Member Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
