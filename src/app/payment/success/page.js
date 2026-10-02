"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  Clock,
  Printer,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import api from "@/utility/config";
import { useAuth } from "@/context/AuthContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser, user: authUser } = useAuth();

  const tranId = searchParams.get("tranId");
  const queryAmount = searchParams.get("amount");
  const queryMethod = searchParams.get("method");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  // Sync auth state & fetch transaction verification details once on mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let isMounted = true;

    const fetchDetails = async () => {
      try {
        if (refreshUser) {
          await refreshUser();
        }

        if (tranId) {
          const res = await api.get(`/ssl/status/${tranId}`);
          if (isMounted && res.data?.success && res.data?.data) {
            setPaymentData(res.data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch payment details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [tranId, refreshUser]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const amountDisplay = paymentData?.amount || queryAmount || "1,000";
  const currencyDisplay = paymentData?.currency || "BDT";
  const channelDisplay =
    paymentData?.cardType || queryMethod || "SSLCommerz Secured Payment";
  const memberName =
    paymentData?.user?.name || authUser?.name || "Valued Alumni Member";
  const memberId =
    paymentData?.membershipId ||
    paymentData?.user?.membershipId ||
    authUser?.membershipId ||
    "N/A";
  const packageName =
    paymentData?.packageName ||
    authUser?.packageData?.packageName ||
    "General Member";
  const paidDate = paymentData?.paidAt
    ? new Date(paymentData.paidAt).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-slate-50 to-sky-50/50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center print:bg-white print:p-0">
      <div className="w-full max-w-xl">
        {/* Receipt Container */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-950/10 border border-emerald-100 overflow-hidden relative print:shadow-none print:border-none">
          {/* Top Decorative Gradient Ribbon */}
          <div className="h-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />

          {/* Header Card */}
          <div className="p-8 text-center border-b border-slate-100 bg-gradient-to-b from-emerald-50/50 to-transparent">
            {/* Animated Checkmark Circle */}
            <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-white stroke-[2.5]" />
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Payment Verified
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
              Thank you! Your alumni membership dues have been received and
              activated successfully via SSLCommerz.
            </p>
          </div>

          {/* Amount Showcase Badge */}
          <div className="px-8 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                Amount Paid
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-baseline gap-1">
                <span>৳</span>
                <span>{Number(amountDisplay).toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  {currencyDisplay}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Subscription Tier
              </span>
              <span className="inline-block mt-0.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {packageName}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official Transaction Voucher
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 text-[11px] font-medium">
                  Transaction ID
                </span>
                <span className="font-mono font-bold text-slate-800 break-all mt-0.5">
                  {tranId || "N/A"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 text-[11px] font-medium">
                  Member ID
                </span>
                <span className="font-mono font-bold text-slate-800 mt-0.5">
                  {memberId}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 text-[11px] font-medium">
                  Member Name
                </span>
                <span className="font-bold text-slate-800 mt-0.5">
                  {memberName}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                <span className="text-slate-500 text-[11px] font-medium">
                  Payment Gateway
                </span>
                <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  {channelDisplay}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center sm:col-span-2">
                <span className="text-slate-500 text-[11px] font-medium">
                  Date & Time
                </span>
                <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {paidDate}
                </span>
              </div>
            </div>

            {/* Privileges Unlocked Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Alumni Access Unlocked</span>
                <p className="text-emerald-800/90 text-[11px] mt-0.5 leading-relaxed">
                  Your Digital ID card is now stamped as Verified & Active. You can
                  now access AGM voting, official event passes, and the member
                  directory.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              Print Receipt
            </button>

            <Link
              href="/dashboard?tab=membership"
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              Digital ID Card
            </Link>

            <Link
              href="/dashboard"
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6 print:hidden">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 font-medium transition"
          >
            ← Back to Kaitola Alumni Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
