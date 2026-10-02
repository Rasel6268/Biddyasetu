"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { countryDialCodes } from "@/lib/data/countries";
import { showSuccess, showError } from "@/utility/toast";
import {
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Users,
  GraduationCap,
  UserCheck,
  LogOut,
  Globe,
  LayoutDashboard,
  ChevronDown
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    login,
    logout,
  } = useAuth();

  const [countryCode, setCountryCode] = useState("+880");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const activeCountry =
    countryDialCodes.find((c) => c.code === countryCode) || countryDialCodes[0];

  // Auto redirect if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanInput = phoneNumber.trim();

    // Validation
    if (!cleanInput) {
      setErrorMessage("Please enter your registered phone number.");
      showError("Please enter your registered phone number.");
      return;
    }

    // Only allow phone number (no email)
    if (cleanInput.includes("@")) {
      setErrorMessage("Please enter your phone number only.");
      showError("Please enter your phone number only.");
      return;
    }

    // Build identifier — send with country code; backend strips it anyway
    const digitsOnly = cleanInput.replace(/[\s\-()]/g, "").replace(/^\+/, "");
    const identifier = `${countryCode.replace("+", "")}${digitsOnly}`;

    setIsSubmitting(true);

    try {
      const result = await login({ identifier });

      const successMsg =
        result.message || "Logged in successfully! Redirecting...";
      setSuccessMessage(successMsg);
      showSuccess(successMsg);

      setTimeout(() => {
        if (result.user?.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 800);
    } catch (error) {
      console.error("Login failed:", error);
      const errText =
        error.message ||
        "No account found with this phone number. Please register first.";
      setErrorMessage(errText);
      showError(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setPhoneNumber("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#FDF9DF] relative flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-sky-300/25 via-sky-200/15 to-transparent blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-0 w-[450px] h-[450px] bg-yellow-200/20 blur-3xl pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="relative max-w-lg w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3.5 group mb-4 no-underline"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-sky-200 shadow-lg shadow-sky-500/10 group-hover:border-sky-400 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Biddyasetu Logo"
                  width={46}
                  height={46}
                  className="rounded-xl object-contain"
                  priority
                />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors">
                  বিদ্যাসেতু
                </span>
                <span className="text-[10px] font-extrabold bg-gradient-to-r from-sky-500 to-sky-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Adarsha High School, Kaitola
              </p>
            </div>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Alumni Portal Login
          </h1>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Sign in with your registered phone number. No password needed —
            we&apos;ll recognize you instantly.
          </p>
        </div>

        {/* If user is already authenticated */}
        {isAuthenticated && user ? (
          <div className="bg-white/95 backdrop-blur-md border-[1.5px] border-sky-100 rounded-3xl p-7 sm:p-9 shadow-xl shadow-sky-900/10 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
              <UserCheck className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authentication
              Successful
            </span>

            <h2 className="text-2xl font-black text-slate-900 mb-1">
              Welcome, {user.name}!
            </h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              Batch: {user.batch || "Alumni"} ·{" "}
              {user.membership?.replace(/_/g, " ")} · ID: {user.membershipId}
            </p>

            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 text-left mb-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Verified Account Details
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-sky-500" /> Phone:
                </span>
                <span className="font-bold">{user.phone}</span>
              </div>
              {user.email && (
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span className="flex items-center gap-2 text-slate-600">
                    <Globe className="w-4 h-4 text-sky-500" /> Email:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {user.email}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Status:
                </span>
                <span className="font-bold text-emerald-600 capitalize">
                  {user.membershipStatus || "Active"} Member
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Link
                href={
                  user.role === "admin" ? "/admin/dashboard" : "/dashboard"
                }
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                {user.role === "admin" ? "Admin Portal" : "Member Dashboard"}
              </Link>
              <Link
                href="/members"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 text-slate-700 hover:text-sky-600 font-semibold text-sm transition-all"
              >
                <Users className="w-4 h-4" />
                Alumni Directory
              </Link>
            </div>

            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out of Portal
            </button>
          </div>
        ) : (
          /* Login Card */
          <div className="bg-white/95 backdrop-blur-md border-[1.5px] border-sky-100/90 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-sky-900/10 transition-all">
            {/* Register Prompt */}
            <div className="mb-6 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>New here?</span>
              </div>
              <Link
                href="/membership"
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-[11px] hover:bg-amber-100/60 shadow-sm transition-all cursor-pointer"
              >
                📝 Register Member
              </Link>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Phone Number Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="phone-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-500" />
                    International support
                  </span>
                </div>

                <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all overflow-hidden shadow-xs">
                  {/* Country Selector Dropdown */}
                  <div className="relative bg-slate-50/90 border-r border-slate-200 flex items-center px-2.5 sm:px-3 shrink-0">
                    <span className="text-base mr-1.5">
                      {activeCountry.flag}
                    </span>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent text-xs sm:text-sm font-bold text-slate-700 outline-none cursor-pointer pr-4 appearance-none py-3"
                      aria-label="Select Country Dial Code"
                    >
                      {countryDialCodes.map((c, idx) => (
                        <option key={`${c.code}-${c.name}-${idx}`} value={c.code}>
                          {c.code} {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none" />
                  </div>

                  {/* Phone input */}
                  <div className="relative flex-1 flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={activeCountry.placeholder}
                      className="w-full pl-9 pr-4 py-3 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-0.5">
                  <span>Enter your registered mobile number</span>
                  <span className="text-sky-600 font-semibold">
                    {activeCountry.name} ({activeCountry.code})
                  </span>
                </div>
              </div>

              {/* Info Banner */}
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-[11px] text-sky-800 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Passwordless Login:</strong> Just enter your
                  registered phone number — your account will be recognized
                  instantly.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Alumni Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Registration CTA */}
            <div className="mt-2 pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600 mb-3">
                Don&apos;t have an alumni account yet?
              </p>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-sky-500 text-sky-600 hover:bg-sky-50 font-bold text-sm transition-all"
              >
                <Users className="w-4 h-4" />
                Register for Alumni Membership
              </Link>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit SSL Encrypted</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1.5">74123
            <GraduationCap className="w-4 h-4 text-sky-500" />
            <span>Official Alumni Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}