"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { countryDialCodes } from "@/lib/data/countries";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Users,
  GraduationCap,
  HelpCircle,
  X,
  Send,
  UserCheck,
  LogOut,
  ChevronRight,
  ChevronDown,
  Globe,
  LayoutDashboard,
} from "lucide-react";

export default function LoginPage() {
  const [countryCode, setCountryCode] = useState("+880");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotCountryCode, setForgotCountryCode] = useState("+880");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: enter phone, 2: enter otp, 3: success
  const [otpCode, setOtpCode] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const activeCountry =
    countryDialCodes.find((c) => c.code === countryCode) || countryDialCodes[0];
  const activeForgotCountry =
    countryDialCodes.find((c) => c.code === forgotCountryCode) || countryDialCodes[0];

  const handleDemoFill = () => {
    setCountryCode("+880");
    setPhoneNumber("01712345678");
    setPassword("biddyasetu2026");
    setErrorMessage("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanPhone = phoneNumber.replace(/[\s\-()]/g, "");

    // Basic validation
    if (!cleanPhone) {
      setErrorMessage("Please enter your registered phone number.");
      return;
    }

    if (cleanPhone.length < 6) {
      setErrorMessage("Please enter a valid mobile number for " + activeCountry.name + ".");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // Simulate API authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUser({
        name: "Engr. Tanvir Ahmed",
        country: activeCountry.name,
        flag: activeCountry.flag,
        phone: `${countryCode} ${cleanPhone}`,
        batch: "2006",
        tier: "Life Member",
        memberId: "BS-LM-0842",
      });
    }, 750);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setPassword("");
    setErrorMessage("");
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const cleanPhone = forgotPhone.replace(/[\s\-()]/g, "");
    if (!cleanPhone || cleanPhone.length < 6) {
      setForgotMsg("Please enter a valid mobile phone number.");
      return;
    }
    setForgotMsg("");
    setForgotStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setForgotMsg("Please enter the 4-digit code sent via SMS.");
      return;
    }
    setForgotMsg("");
    setForgotStep(3);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotPhone("");
    setOtpCode("");
    setForgotMsg("");
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
          <Link href="/" className="inline-flex items-center gap-3.5 group mb-4 no-underline">
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
            Sign in with your phone number and password. Domestic and international alumni members can select their country dialing code.
          </p>
        </div>

        {/* If user is logged in (simulated state) */}
        {loggedInUser ? (
          <div className="bg-white/95 backdrop-blur-md border-[1.5px] border-sky-100 rounded-3xl p-7 sm:p-9 shadow-xl shadow-sky-900/10 text-center animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
              <UserCheck className="w-10 h-10" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authentication Successful
            </span>

            <h2 className="text-2xl font-black text-slate-900 mb-1">
              Welcome back, {loggedInUser.name}!
            </h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              Batch: {loggedInUser.batch} · {loggedInUser.tier} · ID: {loggedInUser.memberId}
            </p>

            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 text-left mb-6 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Verified Account Details
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-sky-500" /> Phone:
                </span>
                <span className="font-bold flex items-center gap-1.5">
                  <span>{loggedInUser.flag}</span>
                  <span>{loggedInUser.phone}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2 text-slate-600">
                  <Globe className="w-4 h-4 text-sky-500" /> Member Region:
                </span>
                <span className="font-semibold text-slate-800">{loggedInUser.country}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Status:
                </span>
                <span className="font-bold text-emerald-600">Active Member</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Member Dashboard
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
            {/* Quick Demo Autofill Notice */}
            <div className="mb-6 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-medium">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Need test credentials?</span>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-[11px] hover:bg-amber-100/60 shadow-sm transition-all cursor-pointer"
              >
                ⚡ Autofill Demo
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-semibold">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Phone Number Field with Multi-Country Code */}
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
                    <span className="text-base mr-1.5">{activeCountry.flag}</span>
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
                  <span>Enter registered mobile number</span>
                  <span className="text-sky-600 font-semibold">{activeCountry.name} ({activeCountry.code})</span>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 font-medium transition-all shadow-xs"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Keep me signed in on this device
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
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
                    <span>Verifying Credentials...</span>
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
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600 mb-3">
                Don&apos;t have an alumni account yet?
              </p>
              <Link
                href="/membership"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/70 text-sky-700 hover:text-sky-800 font-bold text-sm transition-all"
              >
                <Users className="w-4 h-4" />
                Register for Alumni Membership
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Security & Assistance Badges */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
          <div className="flex flex-col items-center gap-1 p-2">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2">
            <GraduationCap className="w-4 h-4 text-sky-600" />
            <span>Verified Alumni Directory</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <Link href="/contact" className="hover:text-sky-600 underline underline-offset-2">
              Need Help? Contact
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors inline-flex items-center gap-1"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal with Country Code */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 relative">
            <button
              onClick={closeForgotModal}
              type="button"
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            {forgotStep === 1 && (
              <>
                <h3 className="text-xl font-black text-slate-900 mb-1.5">
                  Reset Account Password
                </h3>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  Select your country code and enter your registered mobile number. We will send a 4-digit SMS verification code to reset your password.
                </p>

                {forgotMsg && (
                  <p className="text-xs text-red-600 font-semibold mb-3">{forgotMsg}</p>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <div className="flex rounded-xl border border-slate-200 bg-white focus-within:border-sky-500 overflow-hidden">
                      <div className="relative bg-slate-50 border-r border-slate-200 flex items-center px-2 shrink-0">
                        <span className="text-sm mr-1">{activeForgotCountry.flag}</span>
                        <select
                          value={forgotCountryCode}
                          onChange={(e) => setForgotCountryCode(e.target.value)}
                          className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-3 appearance-none py-2.5"
                          aria-label="Country Code"
                        >
                          {countryDialCodes.map((c, idx) => (
                            <option key={`${c.code}-${c.name}-${idx}`} value={c.code}>
                              {c.flag} {c.code} ({c.name})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-0.5 pointer-events-none" />
                      </div>

                      <div className="relative flex-1 flex items-center">
                        <input
                          type="tel"
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value)}
                          placeholder={activeForgotCountry.placeholder}
                          className="w-full px-3 py-2.5 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send Verification Code
                  </button>
                </form>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <h3 className="text-xl font-black text-slate-900 mb-1.5">
                  Enter SMS Verification Code
                </h3>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  We sent a 4-digit code to <strong>{forgotCountryCode} {forgotPhone}</strong>. (For demo testing, enter <strong>1234</strong>).
                </p>

                {forgotMsg && (
                  <p className="text-xs text-red-600 font-semibold mb-3">{forgotMsg}</p>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      className="w-full text-center tracking-[0.5em] text-lg font-black py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                  >
                    Verify & Reset Password
                  </button>
                </form>
              </>
            )}

            {forgotStep === 3 && (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Password Reset Initiated
                </h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  A temporary password has been dispatched to <strong>{forgotCountryCode} {forgotPhone}</strong>. You can use it to sign in immediately and update your password in account settings.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
