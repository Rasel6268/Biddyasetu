"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  User,
  CreditCard,
  QrCode,
  Calendar,
  ShieldCheck,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Award,
  Heart,
  Droplets,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  Edit3,
  Save,
  Plus,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import api from "@/utility/config";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MemberDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, updateProfile, changePassword, payMembership, logout } = useAuth();
  console.log(user)

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [idCardFlipped, setIdCardFlipped] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isPayingMembership, setIsPayingMembership] = useState(false);
  const [subscriptionSuccessBanner, setSubscriptionSuccessBanner] = useState("");

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("Student Scholarship Fund Donation");
  const [paymentAmount, setPaymentAmount] = useState("1000");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [transactionId, setTransactionId] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Receipt modal state
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Security password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Member Profile State
  const [member, setMember] = useState({
    name: "Member",
    nameBn: "",
    memberId: "BDS-MEMBER",
    tier: "General Member",
    batch: "Alumni",
    profession: "Alumnus",
    company: "Independent",
    education: "Adarsha High School, Kaitola",
    currentCity: "Dhaka",
    currentCountry: "Bangladesh",
    presentAddress: "",
    permanentAddress: "",
    totalContributions: 0,
    packageData: {
      packageName: "General Member",
      fee: 1000,
    },
  });

  

  // Edit form buffer
  const [editForm, setEditForm] = useState({ ...member });

  // Sync with authenticated user
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user) {
      const formattedMember = {
        name: user.name || "Member",
        nameBn: user.nameBn || "",
        memberId: user.membershipId || "BDS-MEMBER",
        tier: user.membership
          ? user.membership
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : "General Member",
        status: user.membershipStatus
          ? user.membershipStatus.charAt(0).toUpperCase() + user.membershipStatus.slice(1)
          : "Active",
        paymentStatus: user.paymentStatus || "unpaid",
        membershipDuration: user.membershipDuration || "yearly",
        membershipStartDate: user.membershipStartDate,
        membershipEndDate: user.membershipEndDate,
        packageData: user.packageData || {
          packageName: user.membership?.includes("life") ? "Life Member" : "General Member",
          fee: user.membership?.includes("life") ? 20000 : 1000,
          currency: "BDT",
          billingCycle: user.membership?.includes("life") ? "lifetime" : "yearly",
        },
        verified: true,
        batch: user.batch || "Alumni",
        sscYear: user.batch || "",
        bloodGroup: user.bloodGroup || "N/A",
        dob: user.dateOfBirth || "",
        gender: user.gender
          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
          : "Male",
        phone: user.phone || "",
        email: user.email || "",
        profession: user.profession || "Alumnus",
        company: user.organization || "Independent",
        education: user.education || "Adarsha High School, Kaitola",
        currentCity: user.currentAddress?.city || "Dhaka",
        currentCountry: user.currentAddress?.country || "Bangladesh",
        presentAddress:
          typeof user.currentAddress === "object"
            ? `${user.currentAddress?.line1 || ""} ${user.currentAddress?.city || ""} ${user.currentAddress?.country || ""}`.trim()
            : user.currentAddress || "",
        permanentAddress:
          typeof user.permanentAddress === "object"
            ? `${user.permanentAddress?.line1 || ""} ${user.permanentAddress?.upozilla || ""} ${user.permanentAddress?.division || ""}`.trim()
            : user.permanentAddress || "",
        emergencyContact: user.emergencyContact || "Alumni Support Desk (+880 1700-000000)",
        joinDate: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "17 February 2026",
        validThru: user.membershipDuration === "lifetime" ? "Lifetime" : "1 Year",
        totalContributions: user.totalContributions || 5000,
        bio: user.bio || "Proud alumnus of Adarsha High School, Kaitola.",
      };

      setMember(formattedMember);
      setEditForm(formattedMember);
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  

  // Payments History List
  const [transactions, setTransactions] = useState([]);

  // Events RSVPs List
  const [myEvents] = useState([]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: editForm.name,
        nameBn: editForm.nameBn,
        email: editForm.email,
        phone: editForm.phone,
        profession: editForm.profession,
        organization: editForm.company,
        bloodGroup: editForm.bloodGroup,
        gender: editForm.gender?.toLowerCase(),
        dateOfBirth: editForm.dob,
        bio: editForm.bio,
      });

      setMember({ ...editForm });
      setIsEditingProfile(false);
      setSaveSuccessMsg("Profile information updated successfully!");
      if (typeof window !== "undefined") {
        localStorage.setItem("biddyasetu_member", JSON.stringify(editForm));
      }
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    } catch (err) {
      setSaveSuccessMsg(err.message || "Failed to update profile.");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
    }
  };

  const handleNewPayment = (e) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    const newTxn = {
      id: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: paymentType,
      date: "Today, Just now",
      method: `${paymentMethod} (Txn: ${transactionId})`,
      txnId: transactionId,
      amount: parseInt(paymentAmount, 10) || 1000,
      status: "Pending Verification",
    };

    setTransactions([newTxn, ...transactions]);
    setMember((prev) => ({
      ...prev,
      totalContributions: prev.totalContributions + (parseInt(paymentAmount, 10) || 1000),
    }));
    setPaymentSubmitted(true);
    setTimeout(() => {
      setPaymentSubmitted(false);
      setShowPaymentModal(false);
      setTransactionId("");
    }, 2000);
  };

  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordMsg("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 4000);
    } catch (err) {
      setPasswordMsg(err.message || "Failed to update password.");
      setTimeout(() => setPasswordMsg(""), 4000);
    }
  };

  const handleDashboardLogout = async () => {
    await logout();
    router.push("/login");
  };
  const handleSSLPayment = async (paymentData, customAmount = null) => {
    setIsPayingMembership(true);
    try {
      const targetFee =
        customAmount ||
        paymentData.packageData?.fee ||
        (paymentData.membershipDuration === "lifetime" ? 20000 : 1000);

      const targetPackage =
        paymentData.packageData?.packageName ||
        (paymentData.membershipDuration === "lifetime" ? "Life Member" : "General Member");

      const payment = {
        memberId: paymentData.membershipId || paymentData.memberId,
        phone: paymentData.phone,
        amount: targetFee,
        packageName: targetPackage,
      };

      const result = await api.post("/ssl/init", payment);

      if (result.data?.success && result.data?.data?.gatewayUrl) {
        window.location.href = result.data.data.gatewayUrl;
      } else {
        alert(result.data?.message || "Payment gateway session could not be initialized.");
        setIsPayingMembership(false);
      }
    } catch (error) {
      console.error(
        "SSL Payment Error:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || error.message || "Failed to connect to SSLCommerz gateway.");
      setIsPayingMembership(false);
    }
  };

  // Fetch real payment records from backend
  useEffect(() => {
    let isSubscribed = true;
    const fetchPayments = async () => {
      try {
        const res = await api.get("/ssl/my-payments");
        if (isSubscribed && res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          const formatted = res.data.data.map((p) => ({
            id: p.transactionId,
            title: `${p.packageName || "Membership"} Subscription Fee`,
            date: new Date(p.paidAt || p.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            method: `${p.cardType || p.paymentGateway || "SSLCommerz"} ${p.bankTransactionId ? `(Txn: ${p.bankTransactionId})` : ""}`.trim(),
            txnId: p.transactionId,
            amount: p.amount,
            status: p.status === "paid" ? "Verified" : p.status === "pending" ? "Pending Verification" : "Failed",
            rawStatus: p.status,
          }));
          setTransactions(formatted);
        }
      } catch (err) {
        // Silently preserve existing list on network issue
      }
    };

    if (user) {
      fetchPayments();
    }

    return () => {
      isSubscribed = false;
    };
  }, [user]);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "membership", label: "Digital ID Card", icon: QrCode },
    { id: "payment", label: "Payments & Dues", icon: CreditCard, count: transactions.length },
    { id: "events", label: "My Events", icon: Calendar, count: myEvents.length },
    { id: "security", label: "Security & Settings", icon: Settings },
  ];

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-[calc(100vh-76px)] bg-[#FDF9DF]/40 text-slate-800 flex flex-col">
      {/* In-page Mobile Top Bar (Sticky below Navbar at top-[76px]) */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-sky-100/80 px-4 py-3 flex items-center justify-between sticky top-[76px] z-20 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Toggle Dashboard Menu"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Dashboard Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span className="capitalize text-sky-700">{activeTab}</span>
          <span className="w-1 h-1 rounded-full bg-sky-400" />
          <span className="font-mono text-[11px] text-slate-500">{member.memberId}</span>
        </div>
      </div>

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* SIDEBAR NAVIGATION (Permanently Fixed to Viewport) */}
        <aside
          className={`fixed top-[76px] bottom-0 left-0 z-40 w-72 shrink-0 bg-white border-r border-slate-200/90 shadow-2xl lg:shadow-xs flex flex-col transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Member Card Profile Widget in Sidebar */}
          <div className="p-5 border-b border-slate-100 bg-gradient-to-br from-sky-50/80 via-white to-sky-50/40">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white font-black text-base flex items-center justify-center shadow-md shadow-sky-500/20">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                  title="Active Member"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm text-slate-900 truncate leading-snug">
                  {member.name}
                </h2>
                <p className="text-xs text-slate-500 truncate">{member.profession}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px] border border-amber-200">
                    <Award className="w-3 h-3 text-amber-600" />
                    {member.tier}
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                    &apos;{member.batch.slice(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 rounded-xl p-2.5 border border-slate-200/80 text-[11px] flex items-center justify-between text-slate-600">
              <span className="font-mono font-bold text-sky-900">{member.memberId}</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>

          {/* Sidebar Navigation Menu */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Member Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/25 translate-x-0.5"
                      : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

           
          </div>

          {/* Sidebar Footer Links */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <Link
              href="/"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Back to Public Website</span>
            </Link>

            <button
              type="button"
              onClick={handleDashboardLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 top-[76px] bg-slate-900/40 backdrop-blur-xs z-35 lg:hidden"
          />
        )}

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:pl-80 max-w-full">
          {/* Top Header Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between pb-6 mb-6 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                <span>Alumni Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-sky-600 capitalize">{activeTab}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeTab === "overview" && "Welcome, " + member.name.split(" ")[0]}
                {activeTab === "profile" && "Alumni Member Profile"}
                {activeTab === "membership" && "Digital Membership ID Card"}
                {activeTab === "payment" && "Payment & Welfare Contributions"}
                {activeTab === "events" && "My Events & Attendance Passes"}
                {activeTab === "security" && "Account & Portal Security"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/members"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-sky-300 text-slate-700 hover:text-sky-600 text-xs font-bold transition-all shadow-xs"
              >
                <GraduationCap className="w-4 h-4 text-sky-600" />
                Search Alumni Directory
              </Link>

              <button
                type="button"
                onClick={() => setActiveTab("membership")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                View ID Card
              </button>
            </div>
          </div>

          {/* Success Flash Notifications */}
          {saveSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {subscriptionSuccessBanner && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2.5 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{subscriptionSuccessBanner}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Unpaid Subscription Alert Banner if paymentStatus is not paid */}
              {member.paymentStatus !== "paid" && (
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>Membership Subscription Unpaid</span>
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          {member.packageData?.packageName || member.tier}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        Your account is currently unpaid. Yearly membership validity is 1 year (resets to unpaid after 12 months). Pay now to activate full alumni privileges.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                   onClick={()=>handleSSLPayment(member)}
                    disabled={isPayingMembership}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isPayingMembership ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ৳{member.packageData?.fee ? member.packageData.fee.toLocaleString() : (member.membershipDuration === "lifetime" ? "20,000" : "1,000")} Fee</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Hero Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-sky-600 via-sky-500 to-sky-700 text-white p-6 sm:p-8 shadow-xl shadow-sky-900/10">
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle at 80% 20%, #fff 2px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-semibold mb-3 backdrop-blur-sm">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Official Alumni Member Portal
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                      Good day, {member.name}!
                    </h2>
                    <p className="text-sky-100 text-sm leading-relaxed">
                      You are an enrolled <strong>{member.tier}</strong> of Adarsha High School, Kaitola (SSC Batch {member.batch}). Thank you for your continued engagement with the student community.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab("membership")}
                      className="px-5 py-3 rounded-xl bg-white text-sky-700 font-bold text-xs sm:text-sm hover:bg-sky-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-sky-600" />
                      Digital ID Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Heart className="w-4 h-4 fill-slate-900" />
                      Contribute / Pay
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Stat Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Membership</span>
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900">{member.tier}</div>
                  <div className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Member ID</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-slate-900">
                    {member.memberId}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Batch {member.batch}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Contributions</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    ৳{member.totalContributions.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-bold mt-1">3 Completed Dues/Gifts</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    {myEvents.length} Events
                  </div>
                  <div className="text-xs text-sky-600 font-bold mt-1">Passes Issued</div>
                </div>
              </div>

              {/* Grid: ID Card Snippet + Recent Activity & Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ID Card Quick Look */}
                <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-sky-600" /> Digital Alumni Card
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Official
                      </span>
                    </div>

                    {/* Mini card preview */}
                    <div className="bg-gradient-to-br from-[#0c2d48] via-[#145374] to-[#0c2d48] text-white rounded-2xl p-5 shadow-lg border border-sky-500/30 relative overflow-hidden mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Image src="/logo.png" alt="Logo" width={28} height={28} className="rounded" />
                          <div>
                            <div className="font-black text-xs leading-none">বিদ্যাসেতু</div>
                            <div className="text-[9px] text-sky-300">Adarsha High School</div>
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-yellow-400 text-slate-900 rounded">
                          {member.packageData.packageName}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white mb-0.5">{member.name}</div>
                      <div className="text-[11px] text-sky-200 mb-3">{member.profession}</div>

                      <div className="flex items-end justify-between text-[10px] text-slate-300 border-t border-white/10 pt-2 font-mono">
                        <div>
                          <div className="text-[8px] uppercase text-slate-400">ID Number</div>
                          <div className="text-white font-bold">{member.memberId}</div>
                        </div>
                        <div>
                          <div className="text-[8px] uppercase text-slate-400">SSC Batch</div>
                          <div className="text-white font-bold">{member.batch}</div>
                        </div>
                        <div className="w-7 h-7 bg-white rounded p-0.5">
                          <QrCode className="w-full h-full text-slate-900" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("membership")}
                    className="w-full py-2.5 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Open Full Card & Print <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Recent Announcements & Upcoming Agenda */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-sky-600" /> Alumni Bulletins & Notices
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">Updated Sept 2026</span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-600 text-white shrink-0 flex items-center justify-center shadow-xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">
                            Grand Annual Alumni Reunion 2026 Scheduled
                          </h4>
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                            20 Dec 2026
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Registration is now officially open for all batches. Your Life Member entry badge has been reserved under your profile.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white shrink-0 flex items-center justify-center shadow-xs">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">
                            2026 Student Merit Scholarship Nominations
                          </h4>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Welfare Notice
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          The executive committee has invited nominations for 12 talented financially constrained students of Adarsha High School.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white shrink-0 flex items-center justify-center shadow-xs">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">
                            Digital Directory Privacy Controls
                          </h4>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">
                            Privacy
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Remember that your personal mobile number and private addresses remain shielded from the public directory. Only verified alumni can connect.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Personal & Academic Record</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep your contact details up to date for official alumni election ballots and communications.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {isEditingProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...member });
                          setIsEditingProfile(false);
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleProfileSave}
                        className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Profile Details
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                {/* 1. Basic Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 1. Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Full Name (English)
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                   
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.bloodGroup}
                        onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Academic & Alumni Records */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> 2. School & Higher Education
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        SSC Graduation Batch
                      </label>
                      <input
                        type="text"
                        disabled
                        value={"Batch " + member.batch + " (Adarsha High School)"}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Member ID
                      </label>
                      <input
                        type="text"
                        disabled
                        value={member.memberId}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm font-mono font-bold text-sky-700 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Higher Education Degrees
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.education}
                        onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Professional Details */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> 3. Profession & Workplace
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Current Profession / Designation
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.profession}
                        onChange={(e) => setEditForm({ ...editForm, profession: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Employer / Company / Organization
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Contact & Address Info */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-3 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> 4. Contact & Addresses
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Registered Phone Number (Login ID)
                      </label>
                      <input
                        type="tel"
                        disabled={!isEditingProfile}
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        disabled={!isEditingProfile}
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Present Residence Address
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.presentAddress}
                        onChange={(e) => setEditForm({ ...editForm, presentAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Permanent Address in Kaitola / Bangladesh
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={editForm.permanentAddress}
                        onChange={(e) =>
                          setEditForm({ ...editForm, permanentAddress: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Bio & Statement */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Alumni Bio & Words for Fellow Batchmates
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingProfile}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-700 focus:outline-none focus:border-sky-500 resize-y"
                  />
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MEMBERSHIP & DIGITAL ID CARD */}
          {activeTab === "membership" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Official Digital Alumni Card
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Present this digital card or print it for instant admission at reunions, general meetings, and election booths.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIdCardFlipped(!idCardFlipped)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-sky-600" /> Flip Card (Front/Back)
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Physical ID
                    </button>
                  </div>
                </div>

                {/* DIGITAL ID CARD DISPLAY */}
                <div className="flex justify-center my-6">
                  <div className="w-full max-w-md perspective-1000">
                    {!idCardFlipped ? (
                      /* CARD FRONT */
                      <div className="w-full aspect-[1.58/1] rounded-3xl bg-linear-to-br from-[#0c2d48] via-[#145374] to-[#0c2d48] text-white p-6 shadow-2xl border-2 border-sky-400/40 relative overflow-hidden flex flex-col justify-between">
                        {/* Background Holographic Ring Pattern */}
                        <div
                          className="absolute -right-16 -bottom-16 w-56 h-56 bg-sky-400/10 rounded-full blur-xl pointer-events-none"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute -left-16 -top-16 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl pointer-events-none"
                          aria-hidden="true"
                        />

                        {/* Top Banner */}
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/logo.png"
                              alt="Logo"
                              width={40}
                              height={40}
                              className="rounded-xl border border-white/20 bg-white p-0.5"
                            />
                            <div>
                              <div className="font-black text-base text-white leading-tight tracking-tight">
                                বিদ্যাসেতু · Biddyasetu
                              </div>
                              <div className="text-[10px] text-sky-200 font-semibold tracking-wide">
                                Adarsha High School, Kaitola
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 shadow-xs">
                            {member.packageData.packageName}
                          </span>
                        </div>

                        {/* Middle Member Details */}
                        <div className="flex items-center gap-4 z-10 my-2">
                          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-200 text-slate-900 font-black text-2xl flex items-center justify-center border-2 border-white/80 shadow-md shrink-0">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-black text-lg text-white leading-tight truncate">
                              {member.name}
                            </h4>
                            <p className="text-xs text-sky-200 font-medium truncate">
                              {member.profession}
                            </p>
                            <p className="text-[11px] text-sky-300/90 font-medium truncate">
                              {member.company}
                            </p>
                            <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-1">
                              <BadgeCheck className="w-3.5 h-3.5" /> Verified Alumni Member
                            </div>
                          </div>
                        </div>

                        {/* Bottom Information Row */}
                        <div className="border-t border-white/20 pt-2.5 flex items-end justify-between text-[11px] z-10 font-mono">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-sky-300 font-sans font-bold">
                              Member ID
                            </div>
                            <div className="text-white font-bold text-xs tracking-wider">
                              {member.memberId}
                            </div>
                          </div>

                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-sky-300 font-sans font-bold">
                              SSC Batch
                            </div>
                            <div className="text-white font-bold text-xs">{member.batch}</div>
                          </div>

                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-sky-300 font-sans font-bold">
                              Validity
                            </div>
                            <div className="text-white font-bold text-xs">{member.packageData.packageName}</div>
                          </div>

                          <div className="w-10 h-10 bg-white rounded-lg p-1 shrink-0 shadow-xs">
                            <QrCode className="w-full h-full text-slate-900" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* CARD BACK */
                      <div className="w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 shadow-2xl border-2 border-slate-700 relative overflow-hidden flex flex-col justify-between">
                        {/* Magnetic Strip Representation */}
                        <div className="-mx-6 -mt-1 h-10 bg-slate-950 border-y border-slate-800 flex items-center px-6">
                          <span className="text-[9px] font-mono tracking-widest text-slate-500">
                            BIDDYASETU ALUMNI SECURITY STRIP · SECURE ENCRYPTED VERIFICATION
                          </span>
                        </div>

                        {/* Terms & Instructions */}
                        <div className="text-[10px] text-slate-300 space-y-1.5 leading-relaxed my-2">
                          <p>
                            • This card certifies that the bearer is an official registered alumnus of <strong>Adarsha High School, Kaitola</strong>.
                          </p>
                          <p>
                            • Holds voting privileges in Executive Committee elections & General Assemblies.
                          </p>
                          <p>
                            • Non-transferable. If found, please return to: <em>Kaitola, Brahmanbaria, Bangladesh</em>.
                          </p>
                        </div>

                        {/* Signatures & Support Bar */}
                        <div className="border-t border-slate-700/80 pt-2.5 flex items-center justify-between text-[10px]">
                          <div>
                            <div className="font-serif italic text-sky-400 text-xs">Md. Rafiqul Islam</div>
                            <div className="text-[8px] uppercase tracking-wider text-slate-400">
                              President Signature
                            </div>
                          </div>

                          <div className="text-right font-mono text-[9px] text-slate-400">
                            <div>Hotline: +880 1700-000000</div>
                            <div>contact@biddyasetu.org</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Membership Privileges Breakdown */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900 mb-3">
                    Your {member.tier} Entitlements:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">Voting Power</div>
                        <div className="text-slate-600 mt-0.5">Vote in biennial elections & committee resolutions</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">Directory Access</div>
                        <div className="text-slate-600 mt-0.5">Browse 850+ alumni profiles across Bangladesh & abroad</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800">Priority Entry</div>
                        <div className="text-slate-600 mt-0.5">Complimentary badge for annual grand reunions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          

          {/* TAB 4: PAYMENTS & DUES */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              {/* Payment Summary Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Total Contributed
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ৳{member.totalContributions.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-1">Verified via Mobile Banking</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Subscription Status
                  </div>
                  <div className={`text-xl font-black ${member.paymentStatus === "paid" ? "text-emerald-600" : "text-rose-600"}`}>
                    {member.paymentStatus === "paid" ? "Active (Paid)" : "Unpaid (Pending)"}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {member.membershipDuration === "lifetime"
                      ? "Lifetime Member · Permanent"
                      : member.paymentStatus === "paid" && member.membershipEndDate
                      ? `Valid until: ${new Date(member.membershipEndDate).toLocaleDateString("en-GB")}`
                      : "Yearly member · Unpaid after 1 year"}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      {member.paymentStatus === "paid" ? "Support / Donate" : "Membership Dues"}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {member.paymentStatus === "paid" ? "Scholarship Fund" : `৳${member.packageData?.fee || (member.membershipDuration === "lifetime" ? 20000 : 1000)} Due`}
                    </div>
                  </div>
                  {member.paymentStatus !== "paid" ? (
                    <button
                      type="button"
                      onClick={() => handleSSLPayment(member)}
                      disabled={isPayingMembership}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isPayingMembership ? (
                        <span className="animate-pulse">Connecting Gateway...</span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" /> Pay Dues Now
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Donate Extra
                    </button>
                  )}
                </div>
              </div>

              {/* Membership Subscription Package Card */}
              <div className="bg-gradient-to-br from-white via-sky-50/40 to-white rounded-3xl border-2 border-sky-100 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                      Enrolled Package Details
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">
                      {member.packageData?.packageName || member.tier}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {member.membershipDuration === "lifetime"
                        ? "One-time contribution for permanent lifetime membership"
                        : "Yearly subscription renews annually. Payment status becomes unpaid after 1 year."}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black text-sky-800">
                      ৳{member.packageData?.fee ? member.packageData.fee.toLocaleString() : (member.membershipDuration === "lifetime" ? "20,000" : "1,000")}
                    </div>
                    <div className="text-xs font-bold text-slate-500">
                      {member.membershipDuration === "lifetime" ? "Lifetime Access" : "Yearly Validity (1 Year)"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 font-medium block mb-0.5">Payment Status</span>
                    <span className={`font-bold inline-flex items-center gap-1 uppercase ${
                      member.paymentStatus === "paid" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {member.paymentStatus === "paid" ? "✓ Paid & Verified" : "⚠ Unpaid (Payment Due)"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 font-medium block mb-0.5">Validity Duration</span>
                    <span className="font-bold text-slate-800">
                      {member.membershipDuration === "lifetime" ? "Lifetime Access" : "1 Year (Annual Renewal)"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/70">
                    <span className="text-slate-400 font-medium block mb-0.5">Expiration / Renewal</span>
                    <span className="font-bold text-slate-800">
                      {member.membershipDuration === "lifetime"
                        ? "Never Expires"
                        : member.membershipEndDate
                        ? new Date(member.membershipEndDate).toLocaleDateString("en-GB")
                        : "1 Year from payment"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Payment & Donation Vouchers</h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {transactions.length} receipts on file
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Receipt No</th>
                        <th className="pb-3 font-semibold">Purpose</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold">Method & Txn</th>
                        <th className="pb-3 font-semibold text-right">Amount</th>
                        <th className="pb-3 font-semibold text-center">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {transactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 font-mono text-xs font-bold text-sky-800">
                            {txn.id}
                          </td>
                          <td className="py-3.5 font-bold text-slate-800">{txn.title}</td>
                          <td className="py-3.5 text-xs text-slate-500">{txn.date}</td>
                          <td className="py-3.5 text-xs text-slate-600 font-mono">{txn.method}</td>
                          <td className="py-3.5 text-right font-black text-slate-900">
                            ৳{txn.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                txn.status === "Verified"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {txn.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(txn)}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
                            >
                              View Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MY EVENTS */}
          {activeTab === "events" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Registered Events & Passes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your official admission tickets and RSVP passes for upcoming alumni occasions.
                  </p>
                </div>
                <Link
                  href="/events"
                  className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Browse More Events <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-xs">
                          {evt.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {evt.status}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 leading-snug mb-2">
                        {evt.title}
                      </h4>

                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-sky-500" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-sky-500" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-mono text-[11px] font-bold text-slate-500">
                        {evt.ticketNo}
                      </div>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & SETTINGS */}
          {activeTab === "security" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs max-w-2xl">
              <h3 className="text-xl font-black text-slate-900 mb-1">Account & Security</h3>
              <p className="text-xs text-slate-500 mb-6">
                Manage your alumni portal login password and authentication preferences.
              </p>

              {passwordMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-sky-500 font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Notification Preferences */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notification Settings
                </h4>
                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-sky-600" />
                  <span>Receive SMS notifications for urgent school emergency blood donor alerts</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none text-xs text-slate-700">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-sky-600" />
                  <span>Receive periodic email updates on student scholarship distributions</span>
                </label>
              </div>
            </div>
          )}

          {/* Clean Dashboard In-page Footer */}
          <div className="pt-10 pb-6 text-center text-xs text-slate-500 border-t border-slate-200/60 mt-12">
            © 2026 Biddyasetu Alumni Organization · Adarsha High School, Kaitola · All Rights Reserved
          </div>
        </main>
      </div>

      {/* MAKE PAYMENT / CONTRIBUTION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Make a Payment / Contribution</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Pay membership dues or donate directly to the Biddyasetu student scholarship welfare fund.
            </p>

            {paymentSubmitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">Payment Voucher Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Transaction <strong>{transactionId}</strong> has been logged. The treasury committee will verify your submission within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNewPayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Purpose of Payment
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option>Student Scholarship Fund Donation</option>
                    <option>Annual Membership Renewal Fee (৳1,000)</option>
                    <option>Life Membership Upgradation (৳5,000)</option>
                    <option>School Library & Science Lab Aid</option>
                    <option>Winter Clothes Relief Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Select Amount (BDT)
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {["500", "1000", "2000", "5000"].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setPaymentAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          paymentAmount === amt
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-sky-500"
                    placeholder="Custom amount in BDT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["bKash", "Nagad", "Rocket"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          paymentMethod === m
                            ? "bg-sky-50 text-sky-700 border-sky-500"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                    Send Money / Merchant Pay to official alumni account: <strong>01700-000000</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. BK89123440"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:outline-none focus:border-sky-500 uppercase"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
                >
                  Submit Payment Voucher
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW RECEIPT INVOICE MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-sky-100 relative">
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Voucher Heading */}
            <div className="text-center pb-4 border-b border-slate-100">
              <Image
                src="/logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="mx-auto rounded-xl mb-2"
              />
              <h3 className="font-black text-base text-slate-900">বিদ্যাসেতু Alumni Organization</h3>
              <p className="text-[10px] text-slate-500">Adarsha High School, Kaitola · Official Payment Receipt</p>
            </div>

            <div className="my-5 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Receipt Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member Name:</span>
                <span className="font-bold text-slate-900">{member.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Member ID & Batch:</span>
                <span className="font-mono font-semibold">{member.memberId} (Batch {member.batch})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date of Payment:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Purpose:</span>
                <span className="font-semibold text-slate-900">{selectedReceipt.title}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Reference:</span>
                <span className="font-mono">{selectedReceipt.method}</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl flex justify-between items-center text-sm font-bold text-slate-900 border border-sky-100">
                <span>Total Amount Paid:</span>
                <span className="text-lg font-black text-sky-700">
                  ৳{selectedReceipt.amount.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Voucher
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </ProtectedRoute>
  );
}
