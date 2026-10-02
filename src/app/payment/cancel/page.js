"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw, LayoutDashboard } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-amber-50/30 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200 overflow-hidden text-center p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-9 h-9 stroke-[2]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            Payment Cancelled
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Checkout Was Cancelled
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            You exited the SSLCommerz payment gateway before completing the
            transaction. No amount was deducted.
          </p>

          {tranId && (
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-mono">
              Transaction ID: {tranId}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Resume & Pay Now
            </Link>

            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
