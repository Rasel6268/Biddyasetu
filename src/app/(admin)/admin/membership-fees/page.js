"use client";

import { useState } from "react";
import {
  CreditCard,
  Crown,
  Heart,
  Users,
  CheckCircle2,
  X,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Award,
  TrendingUp,
  AlertCircle,
  Eye,
  Send,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

// ─── Membership Package Data ───
const defaultPackages = [
  {
    id: "pkg-general",
    name: "General Member",
    namebn: "সাধারণ সদস্য",
    fee: 1000,
    cycle: "Annual",
    description:
      "Standard annual membership for all verified alumni of Adarsha High School, Kaitola. Includes access to alumni directory, event participation, and voting rights in AGM.",
    benefits: [
      "Alumni Directory Access",
      "Event Participation",
      "AGM Voting Rights",
      "Community Forum Access",
      "Digital Membership Card",
    ],
    color: "sky",
    icon: "users",
    isActive: true,
  },
  {
    id: "pkg-life",
    name: "Life Member",
    namebn: "আজীবন সদস্য",
    fee: 20000,
    cycle: "One-time",
    description:
      "Pay ৳20,000 (equivalent to 20 years of annual fees) once and become a permanent life member. Receive an official Life Membership Certificate and badge.",
    benefits: [
      "All General Member Benefits",
      "Life Membership Certificate",
      "Permanent Member Status",
      "Priority Event Seating",
      "Executive Meeting Access",
      "Special Recognition on Website",
    ],
    color: "amber",
    icon: "crown",
    isActive: true,
  },
  {
    id: "pkg-donor",
    name: "Patron / Donor Member",
    namebn: "পৃষ্ঠপোষক সদস্য",
    fee: 50000,
    cycle: "One-time",
    description:
      "For distinguished alumni who wish to contribute significantly to Biddyasetu's welfare fund. Includes all Life Member privileges plus exclusive Patron honors.",
    benefits: [
      "All Life Member Benefits",
      "Patron Honor Roll Recognition",
      "School Naming Opportunity (Labs, Library)",
      "Annual Report Acknowledgment",
      "Exclusive Patron Events & Dinners",
      "Advisory Board Eligibility",
    ],
    color: "purple",
    icon: "heart",
    isActive: true,
  },
];

// ─── Mock Member Fee Data ───
const memberFeeData = [
  {
    id: "BDS-LM-0102",
    name: "Md. Rafiqul Islam",
    batch: "1998",
    phone: "+880 1711-223344",
    package: "Life Member",
    totalPaid: 20000,
    lastPayment: "2025-12-15",
    status: "Paid",
    certificate: true,
    paymentHistory: [
      { date: "2025-12-15", amount: 20000, method: "bKash", trxId: "BK77109283" },
    ],
  },
  {
    id: "BDS-GM-0341",
    name: "Engr. Tanvir Ahmed",
    batch: "2006",
    phone: "+880 1812-556677",
    package: "General Member",
    totalPaid: 3000,
    lastPayment: "2026-01-10",
    status: "Paid",
    validUntil: "2027-01-10",
    certificate: false,
    paymentHistory: [
      { date: "2026-01-10", amount: 1000, method: "Nagad", trxId: "NG42198301" },
      { date: "2025-01-08", amount: 1000, method: "bKash", trxId: "BK55301920" },
      { date: "2024-02-14", amount: 1000, method: "bKash", trxId: "BK33019284" },
    ],
  },
  {
    id: "BDS-GM-0512",
    name: "Farhana Akter",
    batch: "2010",
    phone: "+880 1600-998877",
    package: "General Member",
    totalPaid: 2000,
    lastPayment: "2025-06-20",
    status: "Unpaid",
    validUntil: "2026-06-20",
    certificate: false,
    dueAmount: 1000,
    paymentHistory: [
      { date: "2025-06-20", amount: 1000, method: "Rocket", trxId: "RK91204821" },
      { date: "2024-06-18", amount: 1000, method: "Rocket", trxId: "RK81023471" },
    ],
  },
  {
    id: "BDS-PN-1044",
    name: "S.M. Nahid Hasan",
    batch: "2015",
    phone: "+880 1911-778899",
    package: "General Member",
    totalPaid: 0,
    lastPayment: null,
    status: "Unpaid",
    validUntil: null,
    certificate: false,
    dueAmount: 1000,
    paymentHistory: [],
  },
  {
    id: "BDS-PN-1045",
    name: "Kazi Nusrat Jahan",
    batch: "2018",
    phone: "+880 1622-334455",
    package: "General Member",
    totalPaid: 1000,
    lastPayment: "2026-08-01",
    status: "Paid",
    validUntil: "2027-08-01",
    certificate: false,
    paymentHistory: [
      { date: "2026-08-01", amount: 1000, method: "bKash", trxId: "BK99301012" },
    ],
  },
  {
    id: "BDS-DN-0010",
    name: "Dr. Kamal Uddin",
    batch: "1995",
    phone: "+880 1700-112233",
    package: "Patron / Donor Member",
    totalPaid: 50000,
    lastPayment: "2026-03-17",
    status: "Paid",
    certificate: true,
    paymentHistory: [
      { date: "2026-03-17", amount: 50000, method: "Bank Transfer", trxId: "EBL-ONL-928471" },
    ],
  },
  {
    id: "BDS-GM-0620",
    name: "Tariqul Islam Rifat",
    batch: "2020",
    phone: "+880 1300-112233",
    package: "General Member",
    totalPaid: 0,
    lastPayment: null,
    status: "Unpaid",
    validUntil: null,
    certificate: false,
    dueAmount: 1000,
    paymentHistory: [],
  },
  {
    id: "BDS-LM-0205",
    name: "Sabrina Sultana",
    batch: "2002",
    phone: "+880 1500-667788",
    package: "Life Member",
    totalPaid: 20000,
    lastPayment: "2026-05-22",
    status: "Paid",
    certificate: true,
    paymentHistory: [
      { date: "2024-01-10", amount: 5000, method: "bKash", trxId: "BK10293847" },
      { date: "2024-06-15", amount: 5000, method: "Nagad", trxId: "NG83920174" },
      { date: "2025-02-20", amount: 5000, method: "bKash", trxId: "BK56789012" },
      { date: "2026-05-22", amount: 5000, method: "bKash", trxId: "BK78901234" },
    ],
  },
];

const iconMap = {
  users: Users,
  crown: Crown,
  heart: Heart,
};

const colorMap = {
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    icon: "bg-sky-100 text-sky-600",
    badge: "bg-sky-100 text-sky-800",
    gradient: "from-sky-500 to-sky-600",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-800",
    gradient: "from-amber-500 to-amber-600",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-800",
    gradient: "from-purple-500 to-purple-600",
  },
};

export default function AdminMembershipFeesPage() {
  const [packages, setPackages] = useState(defaultPackages);
  const [members] = useState(memberFeeData);
  const [toastMsg, setToastMsg] = useState("");
  const [activeTab, setActiveTab] = useState("packages");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);

  // New package form
  const [newPkg, setNewPkg] = useState({
    name: "",
    namebn: "",
    fee: "",
    cycle: "One-time",
    description: "",
    benefits: "",
    color: "sky",
    icon: "users",
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  // ─── KPI Calculations ───
  const totalCollected = members.reduce((sum, m) => sum + m.totalPaid, 0);
  const paidMembers = members.filter((m) => m.status === "Paid").length;
  const unpaidMembers = members.filter((m) => m.status === "Unpaid").length;
  const lifeMembers = members.filter((m) => m.package === "Life Member").length;

  // ─── Filtered Members ───
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batch.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || m.status.toLowerCase() === statusFilter;
    const matchesPackage =
      packageFilter === "all" || m.package === packageFilter;
    return matchesSearch && matchesStatus && matchesPackage;
  });

  // ─── Package CRUD handlers ───
  const handleCreatePackage = (e) => {
    e.preventDefault();
    if (!newPkg.name || !newPkg.fee) return;
    const pkg = {
      id: `pkg-${Date.now()}`,
      name: newPkg.name,
      namebn: newPkg.namebn,
      fee: Number(newPkg.fee),
      cycle: newPkg.cycle,
      description: newPkg.description,
      benefits: newPkg.benefits
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      color: newPkg.color,
      icon: newPkg.icon,
      isActive: true,
    };
    setPackages((prev) => [...prev, pkg]);
    setShowCreateModal(false);
    setNewPkg({
      name: "",
      namebn: "",
      fee: "",
      cycle: "One-time",
      description: "",
      benefits: "",
      color: "sky",
      icon: "users",
    });
    triggerToast(`Package "${pkg.name}" created successfully.`);
  };

  const handleTogglePackage = (id) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDeletePackage = (id) => {
    const pkg = packages.find((p) => p.id === id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    triggerToast(`Package "${pkg?.name}" removed.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[130] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg("")}
            className="ml-2 hover:opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            Membership & Fee Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Membership Fees & Packages
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create packages, track annual dues, and manage life membership certifications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Fee Collected
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            ৳{totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            From all membership tiers
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{paidMembers}</div>
          <div className="text-xs text-emerald-600 font-semibold">
            Up to date on fees
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Unpaid / Overdue
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{unpaidMembers}</div>
          <div className="text-xs text-rose-600 font-semibold">
            Require follow-up
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Life Members
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">{lifeMembers}</div>
          <div className="text-xs text-amber-700 font-semibold">
            Certified lifetime alumni
          </div>
        </div>
      </div>

      {/* ─── Tab Switcher ─── */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1 w-fit">
        {[
          { key: "packages", label: "Membership Packages" },
          { key: "members", label: "Member Fee Status" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.key
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── TAB 1: MEMBERSHIP PACKAGES ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          {/* Fee Structure Info Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Biddyasetu Fee Structure Policy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The annual subscription fee is a minimum of{" "}
                <strong className="text-sky-700">৳1,000.00</strong> collected
                annually. If any member pays{" "}
                <strong className="text-amber-700">
                  ৳20,000 (20 years&apos; worth)
                </strong>{" "}
                as a lump sum, they are automatically elevated to{" "}
                <strong className="text-amber-700">Life Member</strong> status
                and receive an official Life Membership Certificate.
              </p>
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {packages.map((pkg) => {
              const colors = colorMap[pkg.color] || colorMap.sky;
              const IconComp = iconMap[pkg.icon] || Users;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl border ${colors.border} shadow-xs hover:shadow-md transition-all relative overflow-hidden ${!pkg.isActive ? "opacity-60" : ""
                    }`}
                >
                  {/* Package Header */}
                  <div className={`${colors.bg} p-5 border-b ${colors.border}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${colors.icon} flex items-center justify-center`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-900">
                            {pkg.name}
                          </h3>
                          {pkg.namebn && (
                            <div className="text-xs text-slate-500 font-medium">
                              {pkg.namebn}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${pkg.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {pkg.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">
                        ৳{pkg.fee.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        / {pkg.cycle}
                      </span>
                    </div>
                  </div>

                  {/* Package Body */}
                  <div className="p-5">
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {pkg.description}
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-2 mb-5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Benefits Included
                      </div>
                      {pkg.benefits.map((b, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text} shrink-0 mt-0.5`} />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Package Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleTogglePackage(pkg.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${pkg.isActive
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                      >
                        {pkg.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Package Card */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 transition-all min-h-[320px] flex flex-col items-center justify-center gap-3 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-sky-100 text-slate-400 group-hover:text-sky-500 flex items-center justify-center transition-colors">
                <Plus className="w-7 h-7" />
              </div>
              <span className="text-sm font-bold text-slate-400 group-hover:text-sky-600 transition-colors">
                Create New Package
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── TAB 2: MEMBER FEE STATUS TABLE ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, member ID, or batch..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>

            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Packages</option>
              <option value="General Member">General Member</option>
              <option value="Life Member">Life Member</option>
              <option value="Patron / Donor Member">Patron / Donor</option>
            </select>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Summary Bar */}
          <div className="text-xs text-slate-500 font-medium">
            Showing{" "}
            <strong className="text-slate-900">{filteredMembers.length}</strong>{" "}
            of <strong className="text-slate-900">{members.length}</strong>{" "}
            members
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/50">
                    <th className="px-5 py-3.5">Member</th>
                    <th className="px-5 py-3.5">Batch</th>
                    <th className="px-5 py-3.5">Package</th>
                    <th className="px-5 py-3.5">Total Paid</th>
                    <th className="px-5 py-3.5">Due Amount</th>
                    <th className="px-5 py-3.5">Last Payment</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Certificate</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMembers.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Member Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${m.status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {m.name
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {m.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold text-[11px]">
                          {m.batch}
                        </span>
                      </td>

                      {/* Package */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {m.package === "Life Member" && (
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {m.package === "Patron / Donor Member" && (
                            <Heart className="w-3.5 h-3.5 text-purple-500" />
                          )}
                          <span className="font-semibold text-slate-700 text-[11px]">
                            {m.package}
                          </span>
                        </div>
                      </td>

                      {/* Total Paid */}
                      <td className="px-5 py-4 font-bold text-slate-900">
                        ৳{m.totalPaid.toLocaleString()}
                      </td>

                      {/* Due Amount */}
                      <td className="px-5 py-4">
                        {m.dueAmount ? (
                          <span className="font-bold text-rose-600">
                            ৳{m.dueAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Last Payment */}
                      <td className="px-5 py-4 text-slate-600">
                        {m.lastPayment || (
                          <span className="text-slate-400 italic">Never</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${m.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {m.status === "Paid" ? "✓ Paid" : "✗ Unpaid"}
                        </span>
                      </td>

                      {/* Certificate */}
                      <td className="px-5 py-4">
                        {m.certificate ? (
                          <div className="flex items-center gap-1 text-amber-600">
                            <Award className="w-4 h-4" />
                            <span className="text-[10px] font-bold">Issued</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowDetailModal(m)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer"
                            title="View Payment History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {m.status === "Unpaid" && (
                            <button
                              type="button"
                              onClick={() =>
                                triggerToast(
                                  `Payment reminder sent to ${m.name} via SMS.`
                                )
                              }
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] transition-colors cursor-pointer"
                            >
                              Send Reminder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-12 text-slate-400 text-xs"
                      >
                        No members match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unpaid Members Call-to-Action */}
          {unpaidMembers > 0 && (
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-slate-900 mb-1">
                  {unpaidMembers} Member{unpaidMembers > 1 ? "s" : ""} with
                  Outstanding Dues
                </h3>
                <p className="text-xs text-slate-600">
                  Send batch SMS/Email reminders to all members with unpaid
                  annual subscription fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  triggerToast(
                    `Batch payment reminders sent to ${unpaidMembers} members.`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Send Bulk Reminder
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── CREATE PACKAGE MODAL ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Create Membership Package
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Define a new membership tier with pricing and benefits.
            </p>

            <form onSubmit={handleCreatePackage} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newPkg.name}
                  onChange={(e) =>
                    setNewPkg({ ...newPkg, name: e.target.value })
                  }
                  placeholder="e.g. Honorary Member"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Package Name (বাংলা)
                </label>
                <input
                  type="text"
                  value={newPkg.namebn}
                  onChange={(e) =>
                    setNewPkg({ ...newPkg, namebn: e.target.value })
                  }
                  placeholder="e.g. সম্মানসূচক সদস্য"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Fee Amount (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newPkg.fee}
                    onChange={(e) =>
                      setNewPkg({ ...newPkg, fee: e.target.value })
                    }
                    placeholder="1000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={newPkg.cycle}
                    onChange={(e) =>
                      setNewPkg({ ...newPkg, cycle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option>Annual</option>
                    <option>One-time</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newPkg.description}
                  onChange={(e) =>
                    setNewPkg({ ...newPkg, description: e.target.value })
                  }
                  placeholder="Brief description of this membership tier..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Benefits (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPkg.benefits}
                  onChange={(e) =>
                    setNewPkg({ ...newPkg, benefits: e.target.value })
                  }
                  placeholder="Benefit 1, Benefit 2, Benefit 3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Theme Color
                  </label>
                  <select
                    value={newPkg.color}
                    onChange={(e) =>
                      setNewPkg({ ...newPkg, color: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="sky">Blue (Sky)</option>
                    <option value="amber">Gold (Amber)</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={newPkg.icon}
                    onChange={(e) =>
                      setNewPkg({ ...newPkg, icon: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="users">Users</option>
                    <option value="crown">Crown</option>
                    <option value="heart">Heart</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Membership Package
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ─── MEMBER DETAIL / PAYMENT HISTORY MODAL ─── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-sky-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDetailModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Member Header */}
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-slate-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${showDetailModal.status === "Paid"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
                }`}
              >
                {showDetailModal.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {showDetailModal.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {showDetailModal.id} · Batch {showDetailModal.batch} ·{" "}
                  {showDetailModal.phone}
                </div>
              </div>
            </div>

            {/* Member Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Package
                </div>
                <div className="font-bold text-sm text-slate-900 mt-1 flex items-center gap-1.5">
                  {showDetailModal.package === "Life Member" && (
                    <Crown className="w-4 h-4 text-amber-500" />
                  )}
                  {showDetailModal.package}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Paid
                </div>
                <div className="font-black text-sm text-slate-900 mt-1">
                  ৳{showDetailModal.totalPaid.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </div>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${showDetailModal.status === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {showDetailModal.status}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Certificate
                </div>
                <div className="mt-1">
                  {showDetailModal.certificate ? (
                    <span className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                      <Award className="w-4 h-4" /> Issued
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Not Issued</span>
                  )}
                </div>
              </div>
            </div>

            {/* Life Member Upgrade Progress */}
            {showDetailModal.package === "General Member" && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-800">
                    Life Membership Progress
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (showDetailModal.totalPaid / 20000) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-amber-700 font-semibold">
                  ৳{showDetailModal.totalPaid.toLocaleString()} / ৳20,000 —{" "}
                  {Math.round((showDetailModal.totalPaid / 20000) * 100)}%
                  towards Life Member
                </div>
              </div>
            )}

            {/* Payment History */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                Payment History
              </h4>
              {showDetailModal.paymentHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  No payments recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {showDetailModal.paymentHistory.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          ৳{p.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.date} · {p.method}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-500">
                          {p.trxId}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {showDetailModal.status === "Unpaid" && (
              <div className="mt-5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(
                      `Payment reminder sent to ${showDetailModal.name}.`
                    );
                    setShowDetailModal(null);
                  }}
                  className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Payment Reminder
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
