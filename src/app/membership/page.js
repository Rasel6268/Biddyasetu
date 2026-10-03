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
  Home,
  Building2,
  MapPinned,
  LocateFixed,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { showSuccess, showError } from "@/utility/toast";
import api from "@/utility/config";

const totalSteps = 2; // Password step removed — now only 2 steps

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
const genders = ["Male", "Female"];
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

// Bangladesh divisions for permanent address
const bangladeshDivisions = [
  "Dhaka Division",
  "Chittagong Division",
  "Rajshahi Division",
  "Khulna Division",
  "Barishal Division",
  "Sylhet Division",
  "Rangpur Division",
  "Mymensingh Division",
];

function FormGroup({ label, required, children, hint, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-text">
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
  const { register, payMembership, user } = useAuth();
  const [step, setStep] = useState(1);
  const [isPayingFee, setIsPayingFee] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [selectedTier, setSelectedTier] = useState("General Member");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+880");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [registeredMember, setRegisteredMember] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const activePhoneCountry =
    countryDialCodes.find((c) => c.code === phoneCountryCode) ||
    countryDialCodes[0];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    batch: "",
    profession: "",
    organization: "",
  });

  const [currentAddress, setCurrentAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
  });

  const [permanentAddress, setPermanentAddress] = useState({
    line1: "",
    line2: "",
    upozilla: "",
    zilla: "",
    division: "",
    postCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image.");
      return;
    }

    // Validate size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      showError("Profile photo must be less than 5MB.");
      return;
    }

    try {
      setProfileImage(file);

      // Preview
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);

      setImageUploading(true);
      setImageUploadProgress(0);

      // Get ImageKit authentication
      const authResponse = await fetch("/api/imagekit-auth");

      if (!authResponse.ok) {
        throw new Error("ImageKit authentication failed.");
      }

      const auth = await authResponse.json();

      // Dynamic import so upload stays client-side
      const { upload } = await import("@imagekit/next");

      const uploadResponse = await upload({
        file,
        fileName: `profile-${Date.now()}-${file.name}`,

        token: auth.token,
        signature: auth.signature,
        expire: auth.expire,
        publicKey: auth.publicKey,
        urlEndpoint: auth.urlEndpoint || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,

        folder: "/biddyasetu/members",

        onProgress: (event) => {
          if (event.total) {
            const progress = Math.round(
              (event.loaded / event.total) * 100
            );

            setImageUploadProgress(progress);
          }
        },
      });
      if (!uploadResponse?.url) {
        throw new Error("Image upload failed.");
      }

      // Save ImageKit URL
      setProfileImageUrl(uploadResponse.url);

      showSuccess("Profile photo uploaded successfully!");

    } catch (error) {
      console.error("Profile image upload error:", error);

      setProfileImage(null);
      setProfileImagePreview("");
      setProfileImageUrl("");
      setImageUploadProgress(0);

      showError(
        error.message || "Failed to upload profile photo."
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      showError("Please agree to the terms & conditions before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Full phone with country code (strip non-digits except leading +)
      const fullPhone = `${phoneCountryCode}${phoneNumber.replace(/\D/g, "")}`;

      const result = await register({
        fullName: formData.fullName,
        email: formData.email || null,
        phone: fullPhone,
        profileImage: profileImageUrl || null,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        batch: formData.batch,
        profession: formData.profession,
        organization: formData.organization,
        membership: selectedTier,
        membershipTier: selectedTier,
        currentAddress,
        permanentAddress,
      });
      setRegisteredMember(result);
      setSubmitted(true);
      showSuccess("Registration application submitted successfully!");
    } catch (err) {
      const msg = err.message || "Registration failed. Please try again.";
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPackageDetails = () => {
    const tier = (selectedTier || "").toLowerCase();
    if (tier.includes("life")) {
      return {
        name: "Life Member Package",
        fee: "৳20,000",
        billing: "One-Time (Lifetime Access)",
        renewalText: "Never expires · Permanent membership",
        amount: 20000,
        duration: "Lifetime",
        perks: [
          "Permanent verified digital alumni ID card",
          "Executive committee voting & candidacy rights",
          "Official lifetime membership crest & certificate",
          "Priority seat on school scholarship & welfare committee",
          "Special honor recognition in annual reunion magazine",
        ],
      };
    }
    if (
      tier.includes("donor") ||
      tier.includes("patron") ||
      tier.includes("doner")
    ) {
      return {
        name: "Patron / Donor Member Package",
        fee: "৳20,000+",
        billing: "Annual Welfare Contribution",
        renewalText: "Renews annually for student scholarships",
        amount: 20000,
        duration: "1 Year",
        perks: [
          "Permanent recognition on School Wall of Honor",
          "Advisory council seat for institutional development",
          "VIP access & stage honor at all alumni events",
          "Direct sponsor attribution for student scholarships",
        ],
      };
    }
    return {
      name: "General Member Package",
      fee: "৳1,000",
      billing: "1 Year Validity (Annual Renewal)",
      renewalText:
        "Renews annually (Payment status becomes unpaid after 1 year)",
      amount: 1000,
      duration: "1 Year",
      perks: [
        "Verified entry in alumni global directory",
        "Official alumni reunion & sports tournament passes",
        "Access to alumni job board and mentorship hub",
        "Monthly alumni newsletter & community voting",
      ],
    };
  };

  const handleInstantPayment = async () => {
    setIsPayingFee(true);
    try {
      const pkg = getPackageDetails();
      const memberId =
        registeredMember?.user?.membershipId ||
        registeredMember?.membershipId ||
        user?.membershipId ||
        formData.phone;
      const phone =
        registeredMember?.user?.phone ||
        registeredMember?.phone ||
        user?.phone ||
        formData.phone;

      // Initiate online checkout via SSLCommerz
      const res = await api.post("/ssl/init", {
        memberId,
        phone,
        amount: pkg.amount,
        packageName: pkg.name,
      });

      if (res.data?.success && res.data?.data?.gatewayUrl) {
        window.location.href = res.data.data.gatewayUrl;
        return;
      }

      // Fallback
      await payMembership({
        paymentMethod: "SSLCommerz / bKash",
        transactionId: `SSL${Math.floor(10000000 + Math.random() * 90000000)}`,
        amount: pkg.amount,
        membershipTier: selectedTier,
      });
      setPaymentSuccess(true);
      showSuccess("Membership fee payment recorded successfully!");
    } catch (err) {
      console.error("Payment error:", err);
      showError(err.message || "Payment gateway could not be reached.");
    } finally {
      setIsPayingFee(false);
    }
  };

  if (submitted) {
    const pkg = getPackageDetails();

    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-8 bg-linear-to-br from-sky-50 via-white to-amber-50/40">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-sky-900/10 border border-sky-100 relative overflow-hidden my-8">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-linear-to-tr from-sky-400/10 to-sky-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-linear-to-tr from-emerald-400/10 to-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-400/30">
              <CheckCircle size={40} className="text-white" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mb-2 text-slate-900">
              Registration Successful! 🎉
            </h1>
            <p className="text-slate-600 leading-relaxed mb-6 text-xs sm:text-sm max-w-md mx-auto">
              Welcome to Biddyasetu Alumni Organization,{" "}
              <strong>{formData.fullName}</strong>. Your account has been
              registered with initial status <strong>Unpaid</strong>. You can
              now log in using your phone number.
            </p>

            {/* Member Card Summary */}
            <div className="bg-sky-50/80 rounded-2xl p-4 mb-6 border border-sky-100 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-500">
                  Assigned Member ID:
                </span>
                <span className="font-mono font-bold text-sky-700 bg-white px-2.5 py-0.5 rounded border border-sky-200">
                  {registeredMember?.membershipId || "BDS-2026-MEMBER"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-500">
                  Registered Mobile:
                </span>
                <span className="font-bold text-slate-800">
                  {phoneCountryCode} {phoneNumber}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-500">
                  Selected Membership Tier:
                </span>
                <span className="font-bold text-slate-800">{selectedTier}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold text-slate-500">
                  Login Method:
                </span>
                <span className="font-bold text-emerald-600">
                  Phone number only (passwordless)
                </span>
              </div>
            </div>

            {/* Subscription Pay Table */}
            <div className="mb-6 rounded-2xl border-2 border-sky-200 bg-white p-5 text-left shadow-md">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    Subscription Pay Table
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {pkg.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-extrabold px-3 py-1 rounded-full uppercase text-xs ${paymentSuccess
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse"
                      }`}
                  >
                    {paymentSuccess ? "PAID & ACTIVE" : "UNPAID (Pending)"}
                  </span>
                </div>
              </div>

              {/* Pay Table Breakdown */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-y border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3">Item / Package</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {pkg.name}
                        <p className="text-[10px] text-slate-400 font-normal">
                          Official Club Membership
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold text-[11px]">
                          {pkg.duration}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${paymentSuccess
                            ? "text-emerald-600"
                            : "text-rose-600"
                            }`}
                        >
                          {paymentSuccess ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-sm text-sky-700">
                        {pkg.fee}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t-2 border-slate-200 font-bold">
                    <tr>
                      <td
                        colSpan={3}
                        className="py-2.5 px-3 text-slate-800 text-xs"
                      >
                        Total Amount Due
                      </td>
                      <td className="py-2.5 px-3 text-right text-base font-black text-slate-900">
                        {pkg.fee}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Yearly membership notice */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed mb-4">
                <strong>Important Subscription Policy:</strong>{" "}
                {pkg.renewalText}. No monthly subscription option is offered.
              </div>

              {/* Included Benefits */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Included Subscription Benefits:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                  {pkg.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Action Box */}
              {!paymentSuccess ? (
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleInstantPayment}
                    disabled={isPayingFee}
                    className="w-full sm:w-auto flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-60"
                  >
                    {isPayingFee ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>Processing Fee...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay {pkg.fee} (bKash / Nagad)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Payment received! Your membership subscription is now fully
                    active.
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-linear-to-r from-[#06A3EC] to-[#0284c7] text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <LogIn size={18} /> Continue to Member Dashboard
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm text-slate-700"
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
      <section className="relative overflow-hidden bg-linear-to-tr from-[#0284c7] via-[#06A3EC] to-[#38bdf8] py-20 px-6 text-center text-white">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
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
            Register your profile with just your phone number — no password
            needed. Access the verified directory, vote in committee elections,
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
                  <p className="text-xs font-bold text-[var(--text)]">
                    Privacy Guarantee
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Data protected & encrypted
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <Heart size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">
                    Community Trust
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Verified members only
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-xl border border-[var(--border)] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text)]">
                    Passwordless Login
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Just your phone number
                  </p>
                </div>
              </div>
            </div>

            {/* Login Prompt */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 shadow-sm">
                <span className="text-sm text-slate-700">
                  Already a member?
                </span>
                <Link
                  href="/login"
                  className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 transition-colors"
                >
                  <LogIn size={15} /> Log in with phone →
                </Link>
              </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-[800px] mx-auto w-full">
              <div className="bg-white rounded-3xl border border-[var(--border)] shadow-xl shadow-sky-900/5 overflow-hidden">
                {/* Progress Header */}
                <div className="p-8 pb-0">
                  <div className="flex justify-between mb-4">
                    {["Personal Info", "Address & Education"].map(
                      (label, i) => (
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
                      )
                    )}
                  </div>
                  <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#06A3EC] to-[#0284c7] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-full"
                      style={{
                        width: `${((step - 1) / (totalSteps - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-8 pt-6">
                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm animate-shake">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1 font-semibold">{errorMessage}</div>
                    </div>
                  )}

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
                            Provide your official name and identification
                            details. Your phone number is your login credential.
                          </p>
                        </div>

                        <FormGroup label="Full Name" required icon={User}>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="e.g. Md. Rafiqul Islam"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup
                            label="Phone Number (Login ID)"
                            required
                            icon={Phone}
                            hint={`You'll log in with this number — ${activePhoneCountry.name}`}
                          >
                            <div className="flex rounded-xl border-2 border-[var(--border)] bg-white overflow-hidden focus-within:border-[var(--primary)] focus-within:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] transition-all">
                              <div className="relative bg-slate-50 border-r border-[var(--border)] flex items-center px-2.5 shrink-0">
                                <span className="text-base mr-1">
                                  {activePhoneCountry.flag}
                                </span>
                                <select
                                  value={phoneCountryCode}
                                  onChange={(e) =>
                                    setPhoneCountryCode(e.target.value)
                                  }
                                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-6 py-3 appearance-none"
                                  aria-label="Country Dial Code"
                                >
                                  {countryDialCodes.map((c, idx) => (
                                    <option
                                      key={`${c.code}-${c.name}-${idx}`}
                                      value={c.code}
                                    >
                                      {c.flag} {c.code}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
                              </div>
                              <input
                                type="tel"
                                name="phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={activePhoneCountry.placeholder}
                                className="flex-1 px-3 py-3 bg-transparent text-sm text-[var(--text)] outline-none"
                                required
                              />
                            </div>
                          </FormGroup>

                          <FormGroup
                            label="Email Address"
                            hint="For newsletters & notices (optional)"
                            icon={Mail}
                          >
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="you@email.com"
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            />
                          </FormGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup label="Gender" required icon={User}>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                              required
                            >
                              <option value="">Select gender...</option>
                              {genders.map((g) => (
                                <option key={g} value={g.toLowerCase()}>
                                  {g}
                                </option>
                              ))}
                            </select>
                          </FormGroup>
                          <FormGroup
                            label="Date of Birth"
                            required
                            icon={Calendar}
                          >
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              required
                            />
                          </FormGroup>
                        </div>

                        <FormGroup
                          label="Blood Group"
                          hint="For emergency donor coordination"
                          icon={Droplets}
                        >
                          <select
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                          >
                            <option value="">Select blood group...</option>
                            {bloodGroups.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </FormGroup>

                        <FormGroup
                          label="Profile Photo"
                          hint="JPG, PNG or WebP, max 5MB"
                          icon={Camera}
                        >
                          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--primary)] hover:bg-sky-50/50 transition-all duration-300">

                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              id="profilePhoto"
                              name="profileImage"
                              onChange={handleProfileImageChange}
                            />

                            <label
                              htmlFor="profilePhoto"
                              className="cursor-pointer block"
                            >
                              {profileImagePreview ? (
                                <div className="flex flex-col items-center">

                                  <img
                                    src={profileImagePreview}
                                    alt="Profile preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-3"
                                  />

                                  <p className="text-sm font-semibold text-[var(--text)]">
                                    {profileImage?.name}
                                  </p>

                                  <span className="text-xs text-[var(--text-muted)] mt-1">
                                    Click to change photo
                                  </span>

                                </div>
                              ) : (
                                <>
                                  <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-3">
                                    <Camera
                                      size={24}
                                      className="text-[var(--primary)]"
                                    />
                                  </div>

                                  <p className="text-sm text-[var(--text)] font-semibold">
                                    Click or drag photo here
                                  </p>

                                  <span className="text-xs text-[var(--text-muted)]">
                                    Supports PNG, JPG, WebP up to 5MB
                                  </span>
                                </>
                              )}
                            </label>

                            {/* Upload Progress */}
                            {imageUploading && (
                              <div className="mt-4">

                                <div className="flex justify-between text-xs font-semibold mb-1">
                                  <span className="text-slate-600">
                                    Uploading profile photo...
                                  </span>

                                  <span className="text-sky-600">
                                    {imageUploadProgress}%
                                  </span>
                                </div>

                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#06A3EC] to-[#0284c7] transition-all duration-300"
                                    style={{
                                      width: `${imageUploadProgress}%`,
                                    }}
                                  />
                                </div>

                              </div>
                            )}

                            {/* Uploaded */}
                            {profileImageUrl && !imageUploading && (
                              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600">
                                <CheckCircle size={15} />
                                Profile photo uploaded successfully
                              </div>
                            )}

                          </div>
                        </FormGroup>

                        <button
                          type="button"
                          className="w-full bg-gradient-to-r from-[#06A3EC] to-[#0284c7] text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                          onClick={() => setStep(2)}
                        >
                          Continue to Address & Education{" "}
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    )}

                    {/* Step 2: Address & Education */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="pb-2 border-b border-[var(--border)]">
                          <h3 className="text-xl font-black text-[var(--text)] flex items-center gap-2">
                            <MapPin
                              size={22}
                              className="text-[var(--primary)]"
                            />
                            Address & Education
                          </h3>
                          <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            Current residence, permanent address in Bangladesh,
                            and educational details.
                          </p>
                        </div>

                        {/* Current Address (US/International) */}
                        <div className="bg-sky-50/50 rounded-xl p-4 border border-sky-100">
                          <h4 className="text-sm font-bold text-[var(--text)] flex items-center gap-2 mb-3">
                            <Building2
                              size={16}
                              className="text-[var(--primary)]"
                            />
                            Current Address (US/International)
                          </h4>
                          <div className="space-y-3">
                            <FormGroup
                              label="Address Line 1"
                              required
                              icon={Home}
                            >
                              <input
                                type="text"
                                placeholder="Street address, P.O. box"
                                value={currentAddress.line1}
                                onChange={(e) =>
                                  setCurrentAddress({
                                    ...currentAddress,
                                    line1: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                required
                              />
                            </FormGroup>

                            <FormGroup label="Address Line 2" icon={Home}>
                              <input
                                type="text"
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                value={currentAddress.line2}
                                onChange={(e) =>
                                  setCurrentAddress({
                                    ...currentAddress,
                                    line2: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormGroup label="City" required icon={MapPinned}>
                                <input
                                  type="text"
                                  placeholder="City"
                                  value={currentAddress.city}
                                  onChange={(e) =>
                                    setCurrentAddress({
                                      ...currentAddress,
                                      city: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>

                              <FormGroup
                                label="State"
                                required
                                icon={MapPinned}
                              >
                                <input
                                  type="text"
                                  placeholder="e.g. New York, California, Texas"
                                  value={currentAddress.state}
                                  onChange={(e) =>
                                    setCurrentAddress({
                                      ...currentAddress,
                                      state: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormGroup
                                label="ZIP Code"
                                required
                                icon={LocateFixed}
                              >
                                <input
                                  type="text"
                                  placeholder="ZIP code"
                                  value={currentAddress.zipCode}
                                  onChange={(e) =>
                                    setCurrentAddress({
                                      ...currentAddress,
                                      zipCode: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>

                              <FormGroup label="Country" required icon={Globe}>
                                <select
                                  value={currentAddress.country}
                                  onChange={(e) =>
                                    setCurrentAddress({
                                      ...currentAddress,
                                      country: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                                  required
                                >
                                  {countries.map((c) => (
                                    <option key={c} value={c}>
                                      {c}
                                    </option>
                                  ))}
                                </select>
                              </FormGroup>
                            </div>
                          </div>
                        </div>

                        {/* Permanent Address (Bangladesh) */}
                        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                          <h4 className="text-sm font-bold text-[var(--text)] flex items-center gap-2 mb-3">
                            <MapPin size={16} className="text-emerald-600" />
                            Permanent Address (Bangladesh)
                          </h4>
                          <div className="space-y-3">
                            <FormGroup
                              label="Address Line 1"
                              required
                              icon={Home}
                            >
                              <input
                                type="text"
                                placeholder="Village, road, house number"
                                value={permanentAddress.line1}
                                onChange={(e) =>
                                  setPermanentAddress({
                                    ...permanentAddress,
                                    line1: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                required
                              />
                            </FormGroup>

                            <FormGroup label="Address Line 2" icon={Home}>
                              <input
                                type="text"
                                placeholder="Additional address details"
                                value={permanentAddress.line2}
                                onChange={(e) =>
                                  setPermanentAddress({
                                    ...permanentAddress,
                                    line2: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                              />
                            </FormGroup>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormGroup
                                label="Upozilla / Sub-District"
                                required
                                icon={MapPinned}
                              >
                                <input
                                  type="text"
                                  placeholder="e.g. Savar, Gazipur"
                                  value={permanentAddress.upozilla}
                                  onChange={(e) =>
                                    setPermanentAddress({
                                      ...permanentAddress,
                                      upozilla: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>

                              <FormGroup
                                label="Zilla / District"
                                required
                                icon={MapPinned}
                              >
                                <input
                                  type="text"
                                  placeholder="e.g. Dhaka, Chittagong"
                                  value={permanentAddress.zilla}
                                  onChange={(e) =>
                                    setPermanentAddress({
                                      ...permanentAddress,
                                      zilla: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormGroup
                                label="Division"
                                required
                                icon={Globe}
                              >
                                <select
                                  value={permanentAddress.division}
                                  onChange={(e) =>
                                    setPermanentAddress({
                                      ...permanentAddress,
                                      division: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                                  required
                                >
                                  <option value="">Select division...</option>
                                  {bangladeshDivisions.map((div) => (
                                    <option key={div} value={div}>
                                      {div}
                                    </option>
                                  ))}
                                </select>
                              </FormGroup>

                              <FormGroup
                                label="Post Code"
                                required
                                icon={LocateFixed}
                              >
                                <input
                                  type="text"
                                  placeholder="e.g. 1340"
                                  value={permanentAddress.postCode}
                                  onChange={(e) =>
                                    setPermanentAddress({
                                      ...permanentAddress,
                                      postCode: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                                  required
                                />
                              </FormGroup>
                            </div>
                          </div>
                        </div>

                        {/* Education */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormGroup
                            label="Batch"
                            required
                            icon={GraduationCap}
                          >
                            <select
                              name="batch"
                              value={formData.batch}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] appearance-none hover:border-[var(--primary)]/50"
                              required
                            >
                              <option value="">Select batch...</option>
                              {batches.map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                          </FormGroup>

                          <FormGroup
                            label="Membership Tier"
                            required
                            icon={Award}
                          >
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
                        </div>

                        <FormGroup
                          label="Current Profession"
                          required
                          icon={Briefcase}
                        >
                          <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                            placeholder="e.g. Software Engineer, Doctor, Educator..."
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                            required
                          />
                        </FormGroup>

                        <FormGroup
                          label="Organization / Institution"
                          icon={Briefcase}
                        >
                          <input
                            type="text"
                            name="organization"
                            value={formData.organization}
                            onChange={handleInputChange}
                            placeholder="Your current employer or business"
                            className="w-full px-4 py-3 pl-10 rounded-xl border-2 border-[var(--border)] bg-white text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:shadow-[0_0_0_4px_rgba(6,163,236,0.1)] hover:border-[var(--primary)]/50"
                          />
                        </FormGroup>

                        {/* Terms & Conditions */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={agreed}
                              onChange={(e) => setAgreed(e.target.checked)}
                              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                              required
                            />
                            <span className="text-xs text-slate-700 leading-relaxed">
                              I confirm that all information provided is
                              accurate and agree to the{" "}
                              <Link
                                href="/terms"
                                className="font-bold text-[var(--primary)] hover:underline"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="/privacy"
                                className="font-bold text-[var(--primary)] hover:underline"
                              >
                                Privacy Policy
                              </Link>
                              . I understand my phone number will be my login
                              credential.
                            </span>
                          </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            className="px-8 py-3.5 rounded-xl font-semibold border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300"
                            onClick={() => setStep(1)}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !agreed}
                            className="flex-1 bg-linear-to-r from-[#06A3EC] to-[#0284c7] text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-400/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 text-white"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  />
                                </svg>
                                Submitting Application...
                              </>
                            ) : (
                              <>
                                Submit Registration{" "}
                                <CheckCircle size={18} />
                              </>
                            )}
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