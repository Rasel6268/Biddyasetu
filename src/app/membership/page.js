"use client";

import { useState } from "react";
import Link from "next/link";
import { batches, membershipTypes } from "@/lib/data/demo";
import { countryDialCodes } from "@/lib/data/countries";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplets,
  GraduationCap,
  Briefcase,
  MapPin,
  Globe,
  Camera,
  Lock,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Award,
  LogIn,
  ChevronDown,
  Heart,
  Users,
  Star,
  BadgeCheck,
} from "lucide-react";

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const genders = ["Male", "Female", "Other", "Prefer not to say"];
const countries = [
  "Bangladesh",
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Germany",
  "Other",
];

function FormGroup({ label, required, children, hint, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[var(--text)]">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors"
          />
        )}
        {children}
      </div>
      {hint && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
    </div>
  );
}

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Life Member");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+880");
  const [phoneNumber, setPhoneNumber] = useState("");

  const activePhoneCountry =
    countryDialCodes.find((c) => c.code === phoneCountryCode) || countryDialCodes[0];

  const totalSteps = 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8 bg-gradient-to-br from-sky-50 via-white to-sky-50/50">
        <div className="max-w-[540px] w-full bg-white rounded-3xl p-10 sm:p-12 text-center shadow-2xl shadow-sky-900/10 border border-sky-100/50 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-sky-400/10 to-sky-600/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-emerald-400/10 to-emerald-600/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-400/30">
              <CheckCircle size={48} className="text-white" />
            </div>

            <h1 className="text-3xl font-black mb-3 text-[var(--text)]">
              Welcome Aboard! 🎉
            </h1>
            <p className="text-[var(--text-muted)] leading-relaxed mb-8 text-sm max-w-sm mx-auto">
              Thank you for applying to join the Biddyasetu Alumni Organization.
              Your credentials have been submitted for verification.
            </p>

            <div className="bg-sky-50 rounded-xl p-4 mb-8 border border-sky-100">
              <div className="flex items-center gap-2 text-sm text-sky-700">
                <ShieldCheck size={16} className="shrink-0" />
                <span>You'll receive a confirmation notification via SMS or email once approved.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto bg-gradient-to-r from-[#06A3EC] to-[#0284c7] text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogIn size={18} /> Go to Login
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Return Home <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0284c7] via-[#06A3EC] to-[#38bdf8] py-20 px-6 text-center text-white">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat"
            }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(250,228,6,0.12) 0%, transparent 50%)
            `,
          }}
        />
        <div className="max-w-[840px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold mb-5 shadow-lg">
            <Sparkles size={16} className="text-yellow-300" />
            Join 850+ Registered Alumni
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
            Alumni Registration
          </h1>
          <p className="text-xl opacity-95 leading-relaxed max-w-[640px] mx-auto">
            Register your profile to access the verified directory, vote in committee elections,
            and receive scholarship updates.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm opacity-90">
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={16} /> Verified Alumni
            </span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="flex items-center gap-1.5">
              <Users size={16} /> Global Network
            </span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span className="flex items-center gap-1.5">
              <Star size={16} /> Lifetime Benefits
            </span>
          </div>
        </div>
      </section>

      {/* Main Registration Layout */}
      <section className="py-16 bg-gradient-to-b from-[var(--background)] to-white">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="grid grid-cols-1 gap-8">
            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[800px] mx-auto w-full">
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Privacy Guarantee</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Data protected & encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Heart size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Community Trust</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Verified members only</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">Lifetime Access</p>
                  <p className="text-[10px] text-[var(--text-muted)]">One-time registration</p>
                </div>
              </div>
            </div>

            {/* Login Prompt */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 shadow-sm">
                <span className="text-sm text-slate-700">Already a member?</span>
                <Link
                  href="/login"
                  className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors"
                >
                  <LogIn size={15} /> Log in →
                </Link>
              </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-[800px] mx-auto w-full">
              <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl shadow-sky-900/5 overflow-hidden">
                {/* Progress Header */}
                <div className="p-8 pb-0">
                  <div className="flex justify-between mb-4">
                    {["Personal Info", "Education & Work", "Account Security"].map((label, i) => (
                      <div key={label} className="text-center flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm mx-auto mb-2 transition-all duration-500 ${step > i + 1
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-400/30"
                              : step === i + 1
                                ? "bg-gradient-to-r from-[#06A3EC] to-[#0284c7] text-white shadow-lg shadow-sky-400/30 scale-110"
                                : "bg-[var(--border)] text-[var(--text-muted)]"
                            }`}
                        >
                          {step > i + 1 ? <CheckCircle size={18} /> : i + 1}
                        </div>
                        <span
                          className={`text-xs font-bold transition-colors duration-300 ${step === i + 1
                              ? "text-[var(--primary)]"
                              : "text-[var(--text-muted)]"
                            }`}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#06A3EC] to-[#0284c7] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full"
                      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-8 pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="pb-2 border-b border-[var(--border)]">
                          <h3 className="text-xl font-black text-[var(--text)] flex items-center gap-2">
                            <User size={22} className="text-[var(--primary)]" />
                            Personal Information
                          </h3>
                          <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            Provide your official name and identification details.
                          </p>
                        </div>

                        <FormGroup label="Full Name" required icon={User}>
                          <input
                            type="text"
                            placeholder="e.g. Md. Rafiqul Islam"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="Phone Number" required icon={Phone} hint={`Used for login — ${activePhoneCountry.name}`}>
                            <div className="flex rounded-xl border-2 border-[var(--border)] bg-white overflow-hidden focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] transition-all">
                              <div className="relative bg-slate-50 border-r border-[var(--border)] flex items-center px-2.5 shrink-0">
                                <span className="text-base mr-1">{activePhoneCountry.flag}</span>
                                <select
                                  value={phoneCountryCode}
                                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-6 py-3 appearance-none"
                                  aria-label="Country Dial Code"
                                >
                                  {countryDialCodes.map((c, idx) => (
                                    <option key={`${c.code}-${c.name}-${idx}`} value={c.code}>
                                      {c.flag} {c.code}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
                              </div>
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={activePhoneCountry.placeholder}
                                className="flex-1 px-3 py-3 bg-transparent text-sm text-[var(--text)] outline-none"
                                required
                              />
                            </div>
                          </FormGroup>

                          <FormGroup label="Email Address" hint="For newsletters & notices" icon={Mail}>
                            <input
                              type="email"
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            />
                          </FormGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="Gender" required icon={User}>
                            <select className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50" required>
                              <option value="">Select gender...</option>
                              {genders.map((g) => (
                                <option key={g}>{g}</option>
                              ))}
                            </select>
                          </FormGroup>
                          <FormGroup label="Date of Birth" required icon={Calendar}>
                            <input
                              type="date"
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              required
                            />
                          </FormGroup>
                        </div>

                        <FormGroup label="Blood Group" hint="For emergency donor coordination" icon={Droplets}>
                          <select className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50">
                            <option value="">Select blood group...</option>
                            {bloodGroups.map((b) => (
                              <option key={b}>{b}</option>
                            ))}
                          </select>
                        </FormGroup>

                        <FormGroup label="Profile Photo" hint="JPG or PNG, max 5MB" icon={Camera}>
                          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-sky-50/50 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-sky-100 transition-colors">
                              <Camera size={24} className="text-[var(--primary)]" />
                            </div>
                            <p className="text-sm text-[var(--text)] font-semibold">
                              Click or drag photo here
                            </p>
                            <span className="text-xs text-[var(--text-muted)]">Supports PNG, JPG up to 5MB</span>
                          </div>
                        </FormGroup>

                        <button
                          type="button"
                          className="w-full bg-gradient-to-r from-[#06A3EC] to-[#0284c7] text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                          onClick={() => setStep(2)}
                        >
                          Continue to Education & Work <ArrowRight size={18} />
                        </button>
                      </div>
                    )}

                    {/* Step 2: Education & Work */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="pb-2 border-b border-[var(--border)]">
                          <h3 className="text-xl font-black text-[var(--text)] flex items-center gap-2">
                            <GraduationCap size={22} className="text-[var(--primary)]" />
                            Education & Professional Info
                          </h3>
                          <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            Your graduation batch and current workplace details.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="SSC Year" required icon={Calendar}>
                            <input
                              type="number"
                              placeholder="e.g. 2006"
                              min="1970"
                              max="2026"
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              required
                            />
                          </FormGroup>
                          <FormGroup label="Batch" required icon={GraduationCap}>
                            <select className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50" required>
                              <option value="">Select batch...</option>
                              {batches.map((b) => (
                                <option key={b}>{b}</option>
                              ))}
                            </select>
                          </FormGroup>
                        </div>

                        <FormGroup label="Current Profession" required icon={Briefcase}>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer, Doctor, Educator..."
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <FormGroup label="Organization / Institution" icon={Briefcase}>
                          <input
                            type="text"
                            placeholder="Your current employer or business"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                          />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="Current City" required icon={MapPin}>
                            <input
                              type="text"
                              placeholder="e.g. Dhaka"
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              required
                            />
                          </FormGroup>
                          <FormGroup label="Current Country" required icon={Globe}>
                            <select className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50" required>
                              <option value="">Select country...</option>
                              {countries.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </FormGroup>
                        </div>

                        <FormGroup label="Permanent Address" icon={MapPin}>
                          <textarea
                            rows={2}
                            placeholder="Your permanent address in Bangladesh"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] resize-y hover:border-[var(--primary)]/50"
                          />
                        </FormGroup>

                        <FormGroup label="Membership Tier" required icon={Award}>
                          <select
                            value={selectedTier}
                            onChange={(e) => setSelectedTier(e.target.value)}
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                            required
                          >
                            {membershipTypes.map((t) => (
                              <option key={t.name} value={t.name}>
                                {t.name} — {t.fee}
                              </option>
                            ))}
                          </select>
                        </FormGroup>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            className="px-8 py-3.5 rounded-xl font-semibold border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            className="flex-1 bg-gradient-to-r from-[#06A3EC] to-[#0284c7] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2"
                            onClick={() => setStep(3)}
                          >
                            Continue to Security <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Account Security */}
                    {step === 3 && (
                      <div className="space-y-5">
                        <div className="pb-2 border-b border-[var(--border)]">
                          <h3 className="text-xl font-black text-[var(--text)] flex items-center gap-2">
                            <Lock size={22} className="text-[var(--primary)]" />
                            Account Security
                          </h3>
                          <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            Set a secure password for your alumni account.
                          </p>
                        </div>

                        <FormGroup label="Password" required icon={Lock} hint="Must be at least 8 characters">
                          <input
                            type="password"
                            placeholder="Create a strong password"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <FormGroup label="Confirm Password" required icon={Lock}>
                          <input
                            type="password"
                            placeholder="Repeat your password"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <label className="flex items-start gap-3 cursor-pointer bg-gradient-to-r from-sky-50/50 to-blue-50/50 p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-0.5 w-5 h-5 rounded border-2 border-[var(--border)] accent-[var(--primary)] cursor-pointer"
                          />
                          <span className="text-sm text-[var(--text)] leading-relaxed">
                            I confirm that I am a former student of <strong>Adarsha High School, Kaitola</strong> and agree to the <strong className="text-[var(--primary)]">Terms & Conditions</strong> of Biddyasetu Alumni Organization.
                          </span>
                        </label>

                        {!agreed && (
                          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-200">
                            <AlertCircle size={16} className="shrink-0" />
                            <span className="text-sm">Please accept the terms to continue.</span>
                          </div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            className="px-8 py-3.5 rounded-xl font-semibold border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
                            onClick={() => setStep(2)}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className={`flex-1 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${agreed
                                ? "hover:shadow-lg hover:shadow-emerald-400/30 hover:scale-[1.02]"
                                : "opacity-50 cursor-not-allowed"
                              }`}
                            disabled={!agreed}
                          >
                            Submit Registration <CheckCircle size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}